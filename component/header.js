import styles from '../styles/Header.module.css'
import { signOut, signIn } from "next-auth/react"


export default function Header({admin}){

    return(
        <>
            <div className={styles.container}>
                <p>Signed In As <b>{admin}</b></p>
                <button onClick={() => signOut()}>Sign Out</button>
            </div>
        </>
    )
}