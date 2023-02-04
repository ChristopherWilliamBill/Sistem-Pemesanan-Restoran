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
                        <div className={styles.listcontainer}>
                            {dataAdmin.map(a => 
                                <div className={styles.admincard} onClick={() => setSelectedAdmin(a)}>
                                    <p>{a.username}</p>
                                </div>
                            )}
                        </div>
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
