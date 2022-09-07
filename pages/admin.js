import { signOut, useSession, signIn } from "next-auth/react"
import styles from '../styles/Admin.module.css'
import Layout from '../component/layout'


export default function Admin(){
  return(

    <div>
      <div>
        edit menu
      </div>

      <div>
        lihat pesanan
      </div>
    </div>
  )

}

Admin.getLayout = function getLayout(page) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}
