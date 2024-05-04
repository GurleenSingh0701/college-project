'use client'
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/app/firebase/config";
import { doc, collection, query, orderBy, getDocs, getDoc } from "firebase/firestore";
import { Head } from "next/document";
import Sidebar from "@/app/components/Sidebar";
import Chatscreen from "@/app/components/ChatScreen";
import getRecipientEmail from "@/app/utils/getRecipientEmail";
import mainstyles from '@/app/page.module.css';

type props = {
    id: string,
    userEmail: string | null | undefined,
}
async function fetchData({ id, userEmail }: props) {
    try {
        if (!userEmail) throw new Error("User email not found.");

        const chatRef = doc(db, 'chats', id);
        const messagesRef = collection(chatRef, 'messages');
        const messagesQuery = query(messagesRef, orderBy('timestamp', 'asc'));
        const messagesSnapshot = await getDocs(messagesQuery);

        const messages = messagesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp.toDate().getTime()
        }));

        const chatSnapshot = await getDoc(chatRef);
        const chat = {
            id: chatSnapshot.id,
            ...chatSnapshot.data()
        };

        return {
            messages: JSON.stringify(messages),
            chat: chat
        };
    } catch (error) {
        console.error("Error getting data:", error);
        return null;
    }
}

export default function Chat({ params }: any) {
    const { id } = params;
    const [user] = useAuthState(auth);
    const userEmail = user?.email;
    const [chatContent, setChatContent] = useState<any>();

    useEffect(() => {
        fetchData({ id, userEmail }).then((data) => {
            setChatContent(data);
            console.log(data);
        });
    }, [id, userEmail]);

    if (!userEmail || !chatContent) {
        return <div>Loading...</div>;
    }
    console.log('chat content', chatContent);
    return (
        <main className={mainstyles.App}>
            <div className={mainstyles.App_Body}>

                <Sidebar />
                <Chatscreen key={chatContent?.chat?.id} id={chatContent?.chat?.id} chat={chatContent?.chat} messages={chatContent?.messages} />
            </div>
        </main>
    );
}
