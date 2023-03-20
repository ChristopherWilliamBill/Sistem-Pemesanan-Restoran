import styles from '../../styles/EditKaryawan.module.css'
import Layout from '../../component/layout'
import { useSession } from 'next-auth/react';
import {conn} from '../../module/pg.js';
import { useState } from 'react';
import FormKaryawan from '../../component/formkaryawan';

export default function EditKaryawan({dataAdmin}){
    const [selectedAdmin, setSelectedAdmin] = useState(null);

    const { data: session, status } = useSession()

    return(
        <>
            {session.role === "manager" ? 
                <div className={styles.container}>
                    <div classname={styles.listcontainer}> 
                        <h3>Choose admin to edit:</h3>
                        {dataAdmin.map(a => 
                            <p className={styles.listitem} onClick={() => setSelectedAdmin(a)}>
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

export async function getServerSideProps(){
    const query = `SELECT * FROM "Admin"`
    const res = await conn.query(query)
    const dataAdmin = res.rows
  
    return{
      props:{
        dataAdmin
      }
    }
}

EditKaryawan.getLayout = function getLayout(page) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}
