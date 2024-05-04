'use client';
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import styles from './sign-in.module.css';
import { Auth, GoogleAuthProvider, User, signInWithPopup, signInWithRedirect } from "firebase/auth";
import { auth, db } from "../firebase/config";
import { Button } from "@mui/material";
import { saveUserToFirestore } from "../firebase/firestoreFunctions";
import { Query, addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { ElderlySharp } from "@mui/icons-material";
export default function SignIn() {
    const router = useRouter()
    const handlesignIn = async (e: FormEvent) => {
        e.preventDefault();
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider)
        router.push('/')
    }
    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={(e) => { e.preventDefault(); }}>
                <img className={styles.logo} src="https://th.bing.com/th/id/R.4838b296236a46a8b326d6bccf6d2d30?rik=Q5BlsABphw2mSQ&riu=http%3a%2f%2fmedia.idownloadblog.com%2fwp-content%2fuploads%2f2014%2f10%2fMessages-App-Icon.png&ehk=pj48EXoqWY9YCMRCczkiqkuWbnbxjXX4Yn5O0dOrinM%3d&risl=&pid=ImgRaw&r=0" alt="logo" />

                <span className={styles.title}>Sign in to your account</span>

                <Button type="submit" variant="contained" onClick={handlesignIn}>Sign In with Google</Button>
            </form>
        </div>
    );
}



