import styles from '../../styles/Admin.module.css'
import Layout from '../../component/layout'
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

export default function Admin(){

  const { data: session, status } = useSession()

  const router = useRouter()

  return(
    <div className={styles.container}>
      {console.log(session)}

      <div className={styles.aksi}>
        <div className={styles.section}>
          <h3>Operational</h3>
          <div className={styles.card} onClick={() => router.push("admin/antrianpesanan")}>
            Order Queue
          </div>

          <div className={styles.card} onClick={() => router.push("admin/kitchen")}>
            Kitchen
          </div>

          <div className={styles.card} onClick={() => router.push("admin/meja")}>
            Table
          </div>

          {session.role === "manager" && 
          <div className={styles.card} onClick={() => router.push("admin/riwayattransaksi")}>
            Transaction History
          </div>
          }
        </div>

        <div className={styles.section}>
          <h3>Menu</h3>
          <div className={styles.card} onClick={() => router.push("admin/editmenu")}>
            Edit Menu
          </div>

          <div className={styles.card} onClick={() => router.push("admin/tambahmenu")}>
            Add Menu
          </div>

          <div className={styles.card} onClick={() => router.push("/")}>
            Menu
          </div>
        </div>

        {session.role === "manager" && 
          <div className={styles.section}>
            <h3>Employee</h3>

            <div className={styles.card} onClick={() => router.push("admin/editkaryawan")}>
              Edit Employee
            </div>

            <div className={styles.card} onClick={() => router.push("admin/tambahkaryawan")}>
              Add Employee
            </div>
          </div>
        }
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
