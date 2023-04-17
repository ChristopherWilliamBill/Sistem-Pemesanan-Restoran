import styles from '../../styles/EditEmployee.module.css'
import Layout from '../../component/layout'
import { useSession } from 'next-auth/react';
import {conn} from '../../module/pg.js';
import { useState } from 'react';
import FormKaryawan from '../../component/formkaryawan';
import NavBar from '../../component/navbar';

export default function EditEmployee({dataAdmin}){
    const [selectedAdmin, setSelectedAdmin] = useState(null);

    const { data: session, status } = useSession()

    return(
        <>
            {session.role === "manager" ? 
                <div className={styles.container}>
                    <div className={styles.listcontainer}> 
                        <h3>Choose admin to edit:</h3>
                        {dataAdmin.map(a => 
                          <p key={a.idAdmin} className={styles.listitem} onClick={() => setSelectedAdmin(a)}>
                            {a.username}
                          </p>
                        )}
                    </div>

                    {selectedAdmin == null ? <p>No admin selected</p> : <FormKaryawan key={selectedAdmin.idAdmin} dataAdmin={selectedAdmin}></FormKaryawan>}
                </div>

                : 'Only for manager'
            }
        </>
    )
}

export async function getStaticProps(){
    const query = `SELECT * FROM "Admin"`
    const res = await conn.query(query)
    const dataAdmin = res.rows
  
    return{
      props:{
        dataAdmin
      }
    }
}

EditEmployee.getLayout = function getLayout(page) {
  return (
    <Layout>
      <div className={styles.rootcontainer}>
        <NavBar key='editkaryawan' currentPath={'/admin/editemployee'}></NavBar>
        {page}
      </div>
    </Layout>
  )
}
