import { RecaptchaVerifier, signInWithPhoneNumber, signOut } from "firebase/auth";

import type { ConfirmationResult, User } from "firebase/auth";

import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

import { auth, db } from "../firebase/firebase";

// Stores OTP confirmation session
let confirmationResult: ConfirmationResult | null = null;

// ======================================
// Initialize Invisible reCAPTCHA
// ======================================

export const initializeRecaptcha = (containerId: string) => {
  return new RecaptchaVerifier(auth, containerId, {
    size: "invisible",
    callback: () => {
      console.log("reCAPTCHA verified");
    },
  });
};

// ======================================
// Send OTP
// ======================================

export const sendOTP = async (phoneNumber: string, appVerifier: RecaptchaVerifier) => {
  try {
    confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);

    return {
      success: true,
      message: "OTP sent successfully",
    };
  } catch (error: any) {
    console.error(error);

    return {
      success: false,
      message: error.message,
    };
  }
};

// ======================================
// Verify OTP
// ======================================

export const verifyOTP = async (otp: string) => {
  try {
    if (!confirmationResult) {
      throw new Error("OTP has not been sent.");
    }

    const result = await confirmationResult.confirm(otp);

    await saveUser(result.user);

    return {
      success: true,
      user: result.user,
    };
  } catch (error: any) {
    console.error(error);

    return {
      success: false,
      message: error.message,
    };
  }
};

// ======================================
// Save User in Firestore
// ======================================

export const saveUser = async (user: User) => {
  try {
    const userRef = doc(db, "users", user.uid);

    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return;
    }

    await setDoc(userRef, {
      uid: user.uid,
      displayName: user.displayName || "",
      email_id: user.email || "",
      phone_no: user.phoneNumber || "",
      profile_photo: user.photoURL || "",
      verification_status: true,
      online: true,
      createdAt: serverTimestamp(),
    });

    console.log("User profile created.");
  } catch (error: any) {
    console.error(error);
    throw error;
  }
};

// ======================================
// Get Current User
// ======================================

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

// ======================================
// Logout
// ======================================

export const logout = async () => {
  try {
    await signOut(auth);

    return {
      success: true,
    };
  } catch (error: any) {
    console.error(error);

    return {
      success: false,
      message: error.message,
    };
  }
};
