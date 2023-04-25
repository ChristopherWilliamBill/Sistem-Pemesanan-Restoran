import Header from './header.js'
import { useSession, signIn } from "next-auth/react"
import styles from '../styles/Layout.module.css'

export default function Layout({ children }) {

  const { data: session, status } = useSession()

  if (status === "authenticated" && session.role !== "meja") {
    return(<>
      <Header admin={session.user.name}/>
      <main>{children}</main>
    </>
    )
  }

  return (
    <div className={styles.container}>
      <h1>Administrator Only</h1>
      <button className='btn-primary' onClick={signIn}>Sign In</button>
    </div>
  )
}