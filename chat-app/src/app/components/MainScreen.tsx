'use client';
import mainStyles from "@/app/page.module.css";
import Sidebar from "./Sidebar";
export default function Home() {

    return (
        (<div className={mainStyles.App}>
            <div className={mainStyles.App_Body}>
                <Sidebar />
            </div>
        </div >)
    );
}

