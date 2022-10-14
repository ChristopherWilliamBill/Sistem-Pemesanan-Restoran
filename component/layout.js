import Header from './header.js'
import { useSession, signIn } from "next-auth/react"
import styles from '../styles/Layout.module.css'

export default function Layout({ children }) {

    const { data: session, status } = useSession()

    if (status === "authenticated") {
      return(<>
        <Header admin={session.user.name}/>
        <main>{children}</main>
      </>
      )
    }

    return (
      <div className={styles.container}>
        <h1>You Are Not Signed In</h1>
        <button className={styles.buttonn}onClick={() => signIn()}>Sign In</button>
      </div>
    )
  }