import styles from '../../styles/Admin.module.css'
import Layout from '../../component/layout'
import { useRouter } from 'next/router';

export default function Admin(){

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

      <div className={styles.card} onClick={() => router.push("admin/historitransaksi")}>
        histori transaksi
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
