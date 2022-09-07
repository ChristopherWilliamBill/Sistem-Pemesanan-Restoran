import Header from './header.js'
import { useSession, signIn } from "next-auth/react"

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
      <>
      <p>Not Signed In</p>
      <button onClick={() => signIn()}>Sign In</button>
      </>
    )
  }