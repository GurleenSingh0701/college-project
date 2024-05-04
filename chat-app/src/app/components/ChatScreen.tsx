'use client'
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../firebase/config";
import { useParams } from "next/navigation";
import { Avatar, IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import {
    collection,
    doc,
    orderBy,
    query,
    setDoc,
    Timestamp,
    addDoc,
    where,
    getDoc,
    serverTimestamp,
} from "firebase/firestore";
import Message from "@/app/components/Message";
import { Key, useCallback, useMemo, useRef, useState } from "react";
import getRecipientEmail from "../utils/getRecipientEmail";
import styles from '@/app/styles/Chat.module.css';
import TimeAgo from 'timeago-react'; // var TimeAgo = require('timeago-react');

export default function Chatscreen({ chat, messages }: any) {
    const { id } = useParams();

    const [user] = useAuthState(auth);
    const [input, setInput] = useState('');
    const endOfMessagesRef = useRef<HTMLDivElement>(null);
    // const [recipientSnapshot, setRecipientSnapshot] = useState<any>();
    const recipientEmail = getRecipientEmail(chat.users, user);

    const q = query(collection(db, 'users'), where('email', '==', recipientEmail));

    const [recipientSnapshot] = useCollection(q);


    const [messagesSnapshot] = useCollection(
        query(collection(db, 'chats', `${id}`, 'messages'), orderBy('timestamp', 'asc'))
    );



    const showMessages = useMemo(() => {
        if (messagesSnapshot) {
            return messagesSnapshot.docs.map(message => (
                <Message
                    key={message.id}
                    user={message.data().user}
                    message={{
                        ...message.data(),
                        timestamp: message.data().timestamp?.toDate().getTime()
                    }}
                />
            ))
        } else {
            return JSON.parse(messages).map((message: { id?: any; user?: any; message?: string | null; timestamp?: Timestamp; }) => (
                <Message key={message.id} user={message.user} message={message} />
            ))
        }
    }, [messages, messagesSnapshot])

    const scrollToBottom = () => {
        if (endOfMessagesRef.current) {
            endOfMessagesRef.current.scrollIntoView({
                behavior: "smooth",
                block: "end",
            });
        }
    };
    const sendMessage = useCallback(async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        const userRef = doc(db, 'users', `${user?.uid}`);
        await setDoc(userRef, { lastSeen: serverTimestamp() }, { merge: true });
        const messagesRef = collection(db, 'chats', `${id}`, 'messages');
        await addDoc(messagesRef, {
            timestamp: serverTimestamp(),
            message: input,
            user: user?.email,
            photoURL: user?.photoURL
        });
        setInput("");
        scrollToBottom();
    }, [input, scrollToBottom, user]);


    const recipient = useMemo(() => {
        return recipientSnapshot?.docs[0]?.data()
    }, [recipientSnapshot])
    return <div className={styles.chat}>
        <div className={styles.chat_header}>
            {recipient ? (
                <Avatar src={recipient?.photoURL} />
            ) : (
                <Avatar>{recipientEmail[0]}</Avatar>
            )}
            <div className={styles.chat_headerInfo}>
                <h3 className={styles.chat_room_name}>{recipientEmail}</h3>
                {recipientSnapshot ? (
                    <p>
                        last active: {' '}
                        {recipient?.lastSeen.toDate() ? (
                            <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
                        ) : 'Unavailable'}
                    </p>
                ) : (
                    <p>Loading Last Active</p>
                )}
            </div>
            <div className={styles.chat_headerRight}>
                <IconButton>
                    <AttachFileIcon />
                </IconButton>
                <IconButton>
                    <MoreVertIcon />
                </IconButton>
            </div>
        </div>

        <div className={styles.chat_body}>
            {showMessages}
            <div ref={endOfMessagesRef}></div>
        </div>
        <div className={styles.chat_footer}>
            <form>
                <input value={input} onChange={(e) => setInput(e.target.value)} />
                <button hidden disabled={!input} type="submit" onClick={sendMessage}>
                    Send Message
                </button>
            </form>
        </div>
    </div>

}