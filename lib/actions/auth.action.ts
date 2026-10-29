"use server";

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

// Session duration (1 week)
const SESSION_DURATION = 60 * 60 * 24 * 7;

const DEMO_USER: User = {
  id: "demo-user-intervix",
  name: "Alex Developer",
  email: "alex.dev@intervix.ai",
  role: "Senior Full Stack Engineer",
  avatarUrl: "/profile.svg",
  bio: "Passionate software engineer preparing for senior full-stack and distributed systems engineering roles.",
  phoneNumber: "+1 (555) 234-5678",
  country: "United States",
  timeZone: "America/New_York (EST)",
  createdAt: "2025-01-15T00:00:00.000Z",
};

// Set session cookie
export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();

  // Create session cookie
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: SESSION_DURATION * 1000, // milliseconds
  });

  // Set cookie in the browser
  cookieStore.set("session", sessionCookie, {
    maxAge: SESSION_DURATION,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
}

// Sign in with quick demo candidate account
export async function signInAsDemoUser() {
  const cookieStore = await cookies();

  cookieStore.set("session", "demo-session-token", {
    maxAge: SESSION_DURATION,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });

  // Ensure demo user doc exists in db if possible
  try {
    const demoRef = db.collection("users").doc(DEMO_USER.id);
    const doc = await demoRef.get();
    if (!doc.exists) {
      await demoRef.set(DEMO_USER, { merge: true });
    }
  } catch (error) {
    console.warn("Could not sync demo user to db:", error);
  }

  return {
    success: true,
    message: "Logged in as Demo Candidate.",
  };
}

export async function signUp(params: SignUpParams) {
  const { uid, name, email, avatarUrl } = params;

  try {
    // check if user exists in db
    const userRecord = await db.collection("users").doc(uid).get();
    if (userRecord.exists) {
      return {
        success: false,
        message: "User already exists. Please sign in.",
      };
    }

    // save user to db
    await db.collection("users").doc(uid).set({
      name,
      email,
      avatarUrl: avatarUrl || null,
      phoneNumber: null,
      role: null,
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

    // Handle Firebase specific errors
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
      // If user by email look up fails, continue to session cookie
    }

    if (userRecord) {
      const userDoc = await db.collection("users").doc(userRecord.uid).get();
      if (!userDoc.exists) {
        await db.collection("users").doc(userRecord.uid).set({
          name: userRecord.displayName || email.split("@")[0],
          email,
          avatarUrl: userRecord.photoURL || null,
          phoneNumber: null,
          role: null,
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
    // If demo user
    if (userId.startsWith("demo")) {
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
        console.warn("Could not save demo profile to db:", e);
      }

      return {
        success: true,
        message: "Profile updated successfully.",
      };
    }

    // Try updating auth user
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
  if (!sessionCookie) return null;

  // Handle demo session
  if (sessionCookie === "demo-session-token" || sessionCookie.startsWith("demo")) {
    try {
      const doc = await db.collection("users").doc(DEMO_USER.id).get();
      if (doc.exists) {
        return {
          ...DEMO_USER,
          ...doc.data(),
          id: DEMO_USER.id,
        } as User;
      }
    } catch {
      // Return default DEMO_USER if db is offline
    }
    return DEMO_USER;
  }

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

    // get user info from db
    const userRecord = await db
      .collection("users")
      .doc(decodedClaims.uid)
      .get();

    if (!userRecord.exists) {
      // Fallback to auth record if doc doesn't exist yet
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
    console.log("Session verification failed:", error);
    return null;
  }
}

// Check if user is authenticated
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}
