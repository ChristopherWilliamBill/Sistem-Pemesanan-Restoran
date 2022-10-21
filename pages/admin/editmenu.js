import Layout from '../../component/layout'
import React, { useState } from 'react';
import {conn} from '../../lib/pg.ts';
import styles from '../../styles/EditMenu.module.css';
import FormEditMenu from '../../component/formeditmenu';

export default function EditMenu({dataMenu}){
  const [selectedMenu, setSelectedMenu] = useState(null);

  return(
      <div className={styles.container}>
        <div className={styles.listmenu}>
          { dataMenu.map((data) => <div key={data.id} className={styles.menucard} onClick={() => setSelectedMenu(data)}>{data.namaMenu}</div>)}
        </div>
        {selectedMenu == null ? <p>No menu selected</p> : <FormEditMenu dataMenu={selectedMenu}></FormEditMenu>}
      </div>
  )
}

export async function getStaticProps(){
  const query = `SELECT * FROM "Menu"`
  const res = await conn.query(query)
  const dataMenu = res.rows
  return{
    props:{
      dataMenu
    }
  }
} 

EditMenu.getLayout = function getLayout(page) {
    return (
      <Layout>
        {page}
      </Layout>
    )
}