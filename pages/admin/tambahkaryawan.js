import Layout from '../../component/layout'
import styles from '../../styles/TambahKaryawan.module.css'
import { useSession } from 'next-auth/react'
import FormKaryawan from '../../component/formkaryawan'

export default function TambahKaryawan(){

  const { data: session, status } = useSession()

  if (status === "authenticated") {
    return(
      <>
        {session.role === "manager" ? 
          <div className={styles.container}>
            <h1>Add Employee</h1>
            <FormKaryawan></FormKaryawan>
          </div>
          : 'Only for manager'
        }
      </>
    )
  }
}

TambahKaryawan.getLayout = function getLayout(page) {
    return (
      <Layout>
        {page}
      </Layout>
    )
}