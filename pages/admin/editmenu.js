import Layout from '../../component/layout'
import React, { useState } from 'react';
import {conn} from '../../module/pg.js';
import styles from '../../styles/EditMenu.module.css';
import FormMenu from '../../component/formmenu';
import { useSession } from 'next-auth/react';
import NavBar from '../../component/navbar';

export default function EditMenu({dataMenu}){
  const [selectedMenu, setSelectedMenu] = useState(null);

  const { data: session, status } = useSession()
  if (status === "authenticated") {
    return(
      <div className={styles.container}>
        <div className={styles.listcontainer}>
        <h4>Choose menu to edit:</h4>

            {dataMenu.map(d => 
              <p key={d.idMenu} className={d.aktif === 1 ? styles.listitem : styles.notactive} onClick={() => setSelectedMenu(d)}>
                {d.namaMenu}
              </p>
            )}
        </div>

        {selectedMenu == null ? <p>No menu selected</p> : <FormMenu key={selectedMenu.idMenu} selectedMenu={selectedMenu} dataMenu={dataMenu} idAdmin={session.idAdmin}></FormMenu>}
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
  const query = `SELECT "Menu"."idMenu", "Menu"."namaMenu", "Menu"."deskripsiMenu", "Menu"."harga", "Menu"."idAdmin", "Menu"."aktif", "Menu"."gambar", "Admin"."username", "Kategori"."idKategori" FROM "Menu" INNER JOIN "Admin" ON "Menu"."idAdmin" = "Admin"."idAdmin" INNER JOIN "Kategori" ON "Menu"."idKategori" = "Kategori"."idKategori" ORDER BY "Menu"."idMenu" ASC`
  const queryPaket = `SELECT "Menu"."idMenu", "TerdiriMenu"."isiMenu", "TerdiriMenu"."jumlah" FROM "Menu" INNER JOIN "TerdiriMenu" ON "Menu"."idMenu" = "TerdiriMenu"."idMenu"`

  const res = await conn.query(query)
  const resPaket = await conn.query(queryPaket)

  const dataMenu = res.rows
  const dataPaket = resPaket.rows

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
      <div className={styles.rootcontainer}>
        <NavBar currentPath={'/admin/editmenu'}></NavBar>
        {page}
      </div>    
    </Layout>
  )
}