import { CircularProgress } from "@mui/material";
import styles from '@/app/styles/Loading.module.css';
export default function Loading() {
    return <div className={styles.container}>
        <div className={styles.center}><CircularProgress /></div>
    </div>
}