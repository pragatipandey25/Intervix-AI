"use server";

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

// Session duration (1 week)
const SESSION_DURATION = 60 * 60 * 24 * 7;

const OWNER_EMAIL = "pragatipandey454@gmail.com";

const OWNER_DEFAULTS = {
  name: "Pragati Pandey",
  email: OWNER_EMAIL,
  role: "Founder & Lead Engineer",
  avatarUrl: "/profile.svg",
  bio: "Founder & Lead Engineer of Intervix AI. Dedicated to empowering software engineers and technical candidates with intelligent, real-time AI interview simulations and career preparation.",
  phoneNumber: "+91 98765 43210",
  country: "India",
  timeZone: "Asia/Kolkata (IST)",
};

// Set session cookie
export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();

  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: SESSION_DURATION * 1000,
  });

  cookieStore.set("session", sessionCookie, {
    maxAge: SESSION_DURATION,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
}

export async function signUp(params: SignUpParams) {
  const { uid, name, email, avatarUrl } = params;

  try {
    const userRecord = await db.collection("users").doc(uid).get();
    if (userRecord.exists) {
      return {
        success: false,
        message: "User already exists. Please sign in.",
      };
    }

    const isOwner = email.toLowerCase().trim() === OWNER_EMAIL;

    await db.collection("users").doc(uid).set({
      name: isOwner ? (name || OWNER_DEFAULTS.name) : name,
      email,
      avatarUrl: avatarUrl || (isOwner ? OWNER_DEFAULTS.avatarUrl : null),
      phoneNumber: isOwner ? OWNER_DEFAULTS.phoneNumber : null,
      role: isOwner ? OWNER_DEFAULTS.role : "Candidate",
      country: isOwner ? OWNER_DEFAULTS.country : null,
      timeZone: isOwner ? OWNER_DEFAULTS.timeZone : null,
      bio: isOwner ? OWNER_DEFAULTS.bio : null,
      createdAt: new Date().toISOString(),
    });

    return {
      success: true,
      message: "Account created successfully. Please sign in.",
    };
  } catch (error: any) {
    console.error("Error creating user:", error);

    if (error.code === "auth/email-already-exists") {
      return {
        success: false,
        message: "This email is already in use",
      };
    }

    return {
      success: false,
      message: "Failed to create account. Please try again.",
    };
  }
}

export async function signIn(params: SignInParams) {
  const { email, idToken } = params;

  try {
    let userRecord;
    try {
      userRecord = await auth.getUserByEmail(email);
    } catch {
      // ignore
    }

    if (userRecord) {
      const userDoc = await db.collection("users").doc(userRecord.uid).get();
      const isOwner = email.toLowerCase().trim() === OWNER_EMAIL;

      if (!userDoc.exists) {
        await db.collection("users").doc(userRecord.uid).set({
          name: isOwner
            ? (userRecord.displayName || OWNER_DEFAULTS.name)
            : (userRecord.displayName || email.split("@")[0]),
          email,
          avatarUrl: userRecord.photoURL || (isOwner ? OWNER_DEFAULTS.avatarUrl : null),
          phoneNumber: isOwner ? OWNER_DEFAULTS.phoneNumber : null,
          role: isOwner ? OWNER_DEFAULTS.role : "Candidate",
          country: isOwner ? OWNER_DEFAULTS.country : null,
          timeZone: isOwner ? OWNER_DEFAULTS.timeZone : null,
          bio: isOwner ? OWNER_DEFAULTS.bio : null,
          createdAt: new Date().toISOString(),
        });
      } else if (!userDoc.data()?.avatarUrl && userRecord.photoURL) {
        await db.collection("users").doc(userRecord.uid).set(
          {
            avatarUrl: userRecord.photoURL,
          },
          { merge: true },
        );
      }
    }

    await setSessionCookie(idToken);

    return {
      success: true,
      message: "Signed in successfully.",
    };
  } catch (error: any) {
    console.error("Sign in error:", error);

    return {
      success: false,
      message: "Failed to log into account. Please try again.",
    };
  }
}

// Sign out user by clearing the session cookie
export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

export async function updateUserProfile(params: UpdateUserProfileParams) {
  const {
    userId,
    name,
    email,
    phoneNumber,
    role,
    country,
    timeZone,
    bio,
    avatarUrl,
  } = params;

  try {
    try {
      await auth.updateUser(userId, {
        displayName: name,
        email,
        photoURL: avatarUrl || undefined,
      });
    } catch (authError) {
      console.warn("Auth update error (non-fatal):", authError);
    }

    await db.collection("users").doc(userId).set(
      {
        name,
        email,
        phoneNumber: phoneNumber || null,
        role: role || null,
        country: country || null,
        timeZone: timeZone || null,
        bio: bio || null,
        avatarUrl: avatarUrl || null,
      },
      { merge: true },
    );

    return {
      success: true,
      message: "Profile updated successfully.",
    };
  } catch (error) {
    console.error("Error updating profile:", error);

    return {
      success: false,
      message: "Failed to update profile. Please try again.",
    };
  }
}

// Get current user from session cookie
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;

  if (!sessionCookie) {
    return null;
  }

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

    const userRecord = await db
      .collection("users")
      .doc(decodedClaims.uid)
      .get();

    if (!userRecord.exists) {
      try {
        const authUser = await auth.getUser(decodedClaims.uid);
        const isOwner = authUser.email?.toLowerCase().trim() === OWNER_EMAIL;
        return {
          id: authUser.uid,
          name: authUser.displayName || (isOwner ? OWNER_DEFAULTS.name : authUser.email?.split("@")[0] || "User"),
          email: authUser.email || "",
          avatarUrl: authUser.photoURL || (isOwner ? OWNER_DEFAULTS.avatarUrl : null),
          role: isOwner ? OWNER_DEFAULTS.role : "Candidate",
          bio: isOwner ? OWNER_DEFAULTS.bio : null,
          country: isOwner ? OWNER_DEFAULTS.country : null,
          timeZone: isOwner ? OWNER_DEFAULTS.timeZone : null,
          phoneNumber: isOwner ? OWNER_DEFAULTS.phoneNumber : null,
        } as User;
      } catch {
        return null;
      }
    }

    const userData = userRecord.data();
    const isOwner = userData?.email?.toLowerCase().trim() === OWNER_EMAIL;

    return {
      ...userData,
      id: userRecord.id,
      role: isOwner ? OWNER_DEFAULTS.role : (userData?.role || "Candidate"),
    } as User;
  } catch (error) {
    console.error("Session verification failed:", error);
    return null;
  }
}

// Check if user is authenticated
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}
