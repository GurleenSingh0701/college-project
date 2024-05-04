// 'use client';
// import { Avatar } from "@mui/material";
// import { collection, query, where } from "firebase/firestore";
// import { useRouter } from "next/navigation";
// import { useAuthState } from "react-firebase-hooks/auth";
// import { useCollection } from "react-firebase-hooks/firestore";
// import { auth, db } from "../firebase/config";
// import getRecipientEmail from "../utils/getRecipientEmail";
// import styles from '@/app/styles/SidebarChat.module.css'
// function Chat({ id, users }: any) {
//     const router = useRouter();
//     const [user] = useAuthState(auth);
//     const recipientEmail = getRecipientEmail(users, user);
//     console.log(recipientEmail);
//     console.log("Recipient Email:", recipientEmail);

//     // Construct the query
//     const q = query(collection(db, "users"), where("users", "array-contains", recipientEmail));

//     // Log the query
//     console.log("Query:", q);

//     // Use the useCollection hook with the constructed query
//     const [recipientSnapshot, recipientLoading, recipientError] = useCollection(q);

//     // Log the snapshot, loading state, and errors
//     console.log("Snapshot:", recipientSnapshot);
//     console.log("Loading:", recipientLoading);
//     console.log("Error:", recipientError);
//     const enterChat = () => {
//         router.push(`/chats/${id}`);
//     };
//     const rec
//     return (
//         <div onClick={enterChat} className={styles.link}>
//             <div className={styles.sidebarChat}>
//                 {recipientUser ? (
//                     <Avatar />
//                 ) : (
//                     <Avatar>{recipientEmail[0].toUpperCase()}</Avatar>
//                 )}
//                 <div className={styles.sidebarChat_info}>
//                     <h2>{recipientEmail}</h2>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Chat;



import { Avatar, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../firebase/config";
import getRecipientEmail from "../utils/getRecipientEmail";
import styles from '@/app/styles/SidebarChat.module.css';
import { query, collection, where } from "firebase/firestore";

function Chat({ id, users }: any) {
    const router = useRouter();
    const [user] = useAuthState(auth);
    const recipientEmail = getRecipientEmail(users, user);

    const q = query(collection(db, "users"), where("email", "==", recipientEmail));
    const [recipientSnapshot, recipientLoading, recipientError] = useCollection(q);

    const enterChat = () => {
        router.push(`/chats/${id}`);
    };
    const recipientUser = recipientSnapshot?.docs?.[0]?.data();
    return (
        <div onClick={enterChat} className={styles.link}>
            <div className={styles.sidebarChat}>
                {recipientUser ? (
                    <Avatar src={recipientUser?.photoURL} />
                ) : (
                    <Avatar>{recipientEmail[0].toUpperCase()}</Avatar>
                )}
                <p>{recipientEmail}</p>
            </div>
        </div>
    );
}

export default Chat;
