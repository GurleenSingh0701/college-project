import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/config";
import moment from "moment";
import styles from '@/app/styles/Message.module.css';
import { DocumentData, Timestamp } from "firebase/firestore";
import { Container } from "@mui/material";
import { useMemo } from "react";

interface MessageProps {
    id: string,

    user: string;
    message: {
        message: string | null;
        timestamp: Timestamp;
    };
}
export default function Message({ user, message }: MessageProps) {
    const [userLoggedIn] = useAuthState(auth)
    const TypeOfMessage = useMemo(() => {
        if (user === userLoggedIn?.email) {
            return styles.Sender;
        } else {
            return styles.Reciver;
        }
    }, [user, userLoggedIn])

    return (
        <Container>
            <div className={TypeOfMessage}> {/* Changed Container to div */}
                {message.message}
                <p> {/* Changed Timestamp to p */}
                    {message.timestamp ? moment(message.timestamp).format('LT') : '...'} {/* Updated to toDate() */}
                </p>
            </div>
        </Container>
    )

}


