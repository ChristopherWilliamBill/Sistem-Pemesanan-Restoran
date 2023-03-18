import styles from '../styles/Header.module.css'
import { signOut, signIn } from "next-auth/react"
import { useRouter } from 'next/router';

export default function Header({admin}){

    const router = useRouter()

    return(
        <>
            <div className={styles.container}>
                <p>Signed in as <b>{admin}</b></p>
                <div>
                    <button onClick={() => router.push("../admin")} className='btn-primary'>Home</button>
                    <button onClick={() => signOut()} className='btn-danger'>Sign Out</button>
                </div>
            </div>
        </>
    )
}