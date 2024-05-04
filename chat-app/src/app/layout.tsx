'use client'
import { Inter } from "next/font/google";
import './globals.css';
import Loading from "./Loading/loading";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "./firebase/config";
import SignIn from "./sign-in/page";

const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      const document = doc(db, `users/${user?.uid}`);
      setDoc(
        document,
        {
          email: user.email,
          lastSeen: serverTimestamp(),
          photoURL: user.photoURL,
        },
        { merge: true }
      );
    }
  }, [user]);

  if (loading) return (
    <html lang="en">
      <body className={inter.className}>
        <Loading />
      </body>
    </html>
  );;
  if (!user) return (
    <html lang="en">
      <body className={inter.className}>
        <SignIn />
      </body>
    </html>
  );
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
