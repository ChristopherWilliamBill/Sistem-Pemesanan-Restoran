import Layout from '../../component/layout'
import React, { useState } from 'react';
import {conn} from '../../lib/pg.js';
import styles from '../../styles/EditMenu.module.css';
import FormMenu from '../../component/formmenu';
import { useSession } from 'next-auth/react';

export default function EditMenu({dataMenu}){
  const [selectedMenu, setSelectedMenu] = useState(null);

  const { data: session, status } = useSession()
  if (status === "authenticated") {
    return(
      <div className={styles.container}>
        <div> 
            <h3>Choose the menu to edit:</h3>
            <div className={styles.listcontainer}>
                {dataMenu.map(d => 
                  <p className={styles.listitem} onClick={() => setSelectedMenu(d)}>
                    {d.namaMenu}
                  </p>
                )}
            </div>
        </div>

        {selectedMenu == null ? <p>No menu selected</p> : <FormMenu selectedMenu={selectedMenu} dataMenu={dataMenu} idAdmin={session.idAdmin}></FormMenu>}
      </div>
    )
  }

  return(
    <div className={styles.container}>
      <h1>You Are Not Signed In</h1>
      <button className={styles.buttonn} onClick={signIn}>Sign In</button>
    </div>
  )
}

export async function getStaticProps(){
  const query = `SELECT * FROM "Menu"`
  const queryPaket = `SELECT "Menu"."idMenu", "TerdiriMenu"."isiMenu", "TerdiriMenu"."jumlah" FROM "Menu" INNER JOIN "TerdiriMenu" ON "Menu"."idMenu" = "TerdiriMenu"."idMenu"`

  const res = await conn.query(query)
  const resPaket = await conn.query(queryPaket)

  const dataMenu = res.rows
  const dataPaket = resPaket.rows

  dataMenu.sort((a,b) => a.idMenu - b.idMenu)

  for(let i = 0; i < dataMenu.length; i++){
    dataMenu[i].isiMenu = []
  }

  for(let i = 0; i < dataPaket.length; i++){
    dataMenu[dataPaket[i].idMenu - 1].isiMenu.push({isiMenu: dataPaket[i].isiMenu, jumlah: dataPaket[i].jumlah})
  }
  
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