import styles from '../../styles/EditKaryawan.module.css'
import Layout from '../../component/layout'
import { useSession } from 'next-auth/react';
import {conn} from '../../lib/pg.js';
import { useState } from 'react';
import FormEditKaryawan from '../../component/formeditkaryawan';

export default function EditKaryawan({dataAdmin}){
    const [selectedAdmin, setSelectedAdmin] = useState(null);

    const { data: session, status } = useSession()

    return(
        <>
            {session.role == "manager" ? 
                <div className={styles.container}>
                    <div classname={styles.left}> 
                        <h3>Pilih karyawan yang mau diedit:</h3>
                        <ul>
                            {dataAdmin.map(a => 
                                <li className={styles.listitem} onClick={() => setSelectedAdmin(a)}>
                                    {a.username}
                                </li>
                            )}
                        </ul>
                    </div>

                    <div className={styles.right}>
                        {selectedAdmin == null ? 
                            <p>No admin selected</p> 
                        : <FormEditKaryawan dataAdmin={selectedAdmin}></FormEditKaryawan>}
                    </div>
                </div>

                : <p>Hanya dapat diakses oleh manager</p>
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
