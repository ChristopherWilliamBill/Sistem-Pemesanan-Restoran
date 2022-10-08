import { signOut, useSession, signIn } from "next-auth/react"
import styles from '../../styles/Admin.module.css'
import Layout from '../../component/layout'


export default function Admin(){
  return(

    <div className={styles.container}>
      <div className={styles.card}>
        edit menu
      </div>

      <div className={styles.card}>
        antrian pesanan
      </div>

      <div className={styles.card}>
        histori transaksi
      </div>

      <div className={styles.card}>
        something
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
