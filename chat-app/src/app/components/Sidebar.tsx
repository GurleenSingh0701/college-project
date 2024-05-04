'use client'
import { Avatar, IconButton, Button, CircularProgress } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import * as EmailValidator from "email-validator";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase/config";
import { collection, addDoc, query, where } from "firebase/firestore";
import Chat from "./Chat";
import styles from '@/app/styles/Sidebar.module.css';
import { Add } from "@mui/icons-material";
function Sidebar() {
    const [user] = useAuthState(auth);
    const userChatRef = query(
        collection(db, `chats`),
        where("users", "array-contains", user?.email)
    );
    const [chatsSnapshot, loading, error] = useCollection(userChatRef);
    const createChat = () => {
        const input = prompt(
            "Please enter an email address for the user you wish to chat with:"
        );

        if (!input) {
            return null;
        }

        if (
            EmailValidator.validate(input) &&
            !chatAlreadyExists(input) &&
            input !== user?.email
        ) {
            // add chat into DB 'chats' collection if it doesnt exists and is a valid email
            const col = collection(db, `chats`);
            addDoc(col, {
                users: [user?.email, input],
            });
        }
    };

    const chatAlreadyExists = (recipientEmail: string) =>
        !!chatsSnapshot?.docs.find(chat =>
            chat.data().users.includes(user?.email) && chat.data().users.includes(recipientEmail)
        );
    return (
        <div className={styles.sidebar}>
            <div className={styles.sidebar_header}>
                <Avatar
                    src={user?.photoURL || ""}
                    onClick={() => {
                        signOut(auth)
                    }}
                />
                <div className={styles.sidebar_headerRight}>
                    <IconButton>
                        <ChatIcon />
                    </IconButton>

                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </div>
            </div>

            <div className={styles.sidebar_search}>
                <div className={styles.searchContainer}>
                    <SearchIcon />
                    <input placeholder="Search in Chats" />
                </div>
            </div>
            <div className={styles.sidebar_chats}>
                <div onClick={createChat} className={styles.sidebarChat}>
                    <h4 className={styles.add_new_chat_title}>Add New Chat</h4>
                    <Add />
                </div>
                {loading && <CircularProgress />} {/* Loading indicator */}
                {error && <p>Error: {error.message}</p>} {/* Error message */}
                {chatsSnapshot?.docs.map((chat) => (
                    <Chat key={chat.id} id={chat.id} users={chat.data().users} />
                ))}
            </div>
        </div>
    );
}

export default Sidebar;

