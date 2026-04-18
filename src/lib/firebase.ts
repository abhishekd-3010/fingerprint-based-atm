import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDEDhfvZYBFNv-dLwjdydtdf-2gL-HEY2g",
  authDomain: "fingerprint-atm-6f38f.firebaseapp.com",
  databaseURL: "https://fingerprint-atm-6f38f-default-rtdb.firebaseio.com",
  projectId: "fingerprint-atm-6f38f",
  storageBucket: "fingerprint-atm-6f38f.firebasestorage.app",
  messagingSenderId: "388840452781",
  appId: "1:388840452781:web:3bbcbb99be248244f04c24",
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = getDatabase(app);

export type AtmUser = {
  name: string;
  pin: string;
  balance: number;
  verified?: boolean;
  transactions?: Record<string, unknown>;
};

export type LoginType = "card" | "fingerprint";
