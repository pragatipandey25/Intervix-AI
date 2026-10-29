"use server";

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

// Session duration (1 week)
const SESSION_DURATION = 60 * 60 * 24 * 7;

const OWNER_USER: User = {
  id: "owner-pragati-pandey",
  name: "Pragati Pandey",
  email: "pragatipandey454@gmail.com",
  role: "Founder & Lead Engineer",
  avatarUrl: "/profile.svg",
  bio: "Founder & Lead Engineer of Intervix AI. Dedicated to empowering software engineers and technical candidates with intelligent, real-time AI interview simulations and career preparation.",
  phoneNumber: "+91 98765 43210",
  country: "India",
  timeZone: "Asia/Kolkata (IST)",
  createdAt: "2024-01-01T00:00:00.000Z",
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

// Sign in directly as Owner (Pragati Pandey)
export async function signInAsOwner() {
  const cookieStore = await cookies();

  cookieStore.set("session", "owner-session-token", {
    maxAge: SESSION_DURATION,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });

  // Ensure owner user doc exists in db if possible
  try {
    const ownerRef = db.collection("users").doc(OWNER_USER.id);
    const doc = await ownerRef.get();
    if (!doc.exists) {
      await ownerRef.set(OWNER_USER, { merge: true });
    }
  } catch (error) {
    console.warn("Could not sync owner user to db:", error);
  }

  return {
    success: true,
    message: "Welcome Pragati Pandey! Signed in as Owner.",
  };
}

// Alias for seamless backward compatibility
export async function signInAsDemoUser() {
  return signInAsOwner();
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

    await db.collection("users").doc(uid).set({
      name,
      email,
      avatarUrl: avatarUrl || null,
      phoneNumber: null,
      role: "Candidate",
      country: null,
      timeZone: null,
      bio: null,
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
      if (!userDoc.exists) {
        await db.collection("users").doc(userRecord.uid).set({
          name: userRecord.displayName || email.split("@")[0],
          email,
          avatarUrl: userRecord.photoURL || null,
          phoneNumber: null,
          role: "Candidate",
          country: null,
          timeZone: null,
          bio: null,
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

// Sign out user by clearing the session cookie and recording logged-out intent
export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  cookieStore.set("logged_out", "true", {
    maxAge: 3600,
    httpOnly: true,
    path: "/",
  });
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
    if (userId.startsWith("owner") || userId.startsWith("demo")) {
      try {
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
      } catch (e) {
        console.warn("Could not save owner profile to db:", e);
      }

      return {
        success: true,
        message: "Profile updated successfully.",
      };
    }

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

  const isExplicitlyLoggedOut = cookieStore.get("logged_out")?.value === "true";
  const sessionCookie = cookieStore.get("session")?.value;

  // If user explicitly signed out and has no session, show sign-in page
  if (isExplicitlyLoggedOut && !sessionCookie) {
    return null;
  }

  // If no session cookie or owner session, default to OWNER_USER (Pragati Pandey)!
  if (
    !sessionCookie ||
    sessionCookie === "owner-session-token" ||
    sessionCookie.startsWith("owner") ||
    sessionCookie.startsWith("demo")
  ) {
    try {
      const doc = await db.collection("users").doc(OWNER_USER.id).get();
      if (doc.exists) {
        return {
          ...OWNER_USER,
          ...doc.data(),
          id: OWNER_USER.id,
        } as User;
      }
    } catch {
      // Use OWNER_USER
    }
    return OWNER_USER;
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
        return {
          id: authUser.uid,
          name: authUser.displayName || authUser.email?.split("@")[0] || "User",
          email: authUser.email || "",
          avatarUrl: authUser.photoURL || null,
          role: "Candidate",
        } as User;
      } catch {
        return null;
      }
    }

    return {
      ...userRecord.data(),
      id: userRecord.id,
    } as User;
  } catch (error) {
    console.log("Session verification failed, falling back to owner:", error);
    return OWNER_USER;
  }
}

// Check if user is authenticated
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}
