import styles from '../../styles/Admin.module.css'
import Layout from '../../component/layout'
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

export default function Admin(){

  const { data: session, status } = useSession()

  const router = useRouter()

  return(
    <div className={styles.container}>
      <div className={styles.card} onClick={() => router.push("admin/editmenu")}>
        edit menu
      </div>

      <div className={styles.card} onClick={() => router.push("admin/tambahmenu")}>
        tambah menu
      </div>

      <div className={styles.card} onClick={() => router.push("admin/antrianpesanan")}>
        antrian pesanan
      </div>

      <div className={styles.card} onClick={() => router.push("admin/riwayattransaksi")}>
        histori transaksi
      </div>

      {session.role == "manager" ? 
        <>
          <div className={styles.card} onClick={() => router.push("admin/editkaryawan")}>
            edit karyawan
          </div>

          <div className={styles.card} onClick={() => router.push("admin/tambahkaryawan")}>
            tambah karyawan
          </div>
        </>
      : null
      }
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
