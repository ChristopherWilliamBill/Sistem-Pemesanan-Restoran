import styles from '../styles/Header.module.css'
import { signOut, signIn } from "next-auth/react"
import { useRouter } from 'next/router';

export default function Header({admin}){

    const router = useRouter()

    return(
        <>
            <div className={styles.container}>
                <p>Signed In As <b>{admin}</b></p>
                <div>
                    <button onClick={() => router.push("../admin")}>Home</button>
                    <button onClick={() => signOut()}>Sign Out</button>
                </div>
            </div>
        </>
    )
}