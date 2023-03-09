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
        Edit Menu
      </div>


      {session.role == "manager" ? 
        <>
          <div className={styles.card} onClick={() => router.push("admin/editkaryawan")}>
            Edit Employee
          </div>

          <div className={styles.card} onClick={() => router.push("admin/tambahkaryawan")}>
            Add Employee
          </div>
        </>
      : null
      }

      <div className={styles.card} onClick={() => router.push("admin/tambahmenu")}>
        Add Menu
      </div>

      <div className={styles.card} onClick={() => router.push("admin/antrianpesanan")}>
        Order Queue
      </div>

      <div className={styles.card} onClick={() => router.push("admin/riwayattransaksi")}>
        Transaction History
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
