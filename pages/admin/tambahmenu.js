import Layout from '../../component/layout'
import { useRouter } from 'next/router'
import styles from '../../styles/TambahMenu.module.css'
import { useSession } from 'next-auth/react'
import FormMenu from '../../component/formmenu'
import {conn} from '../../module/pg.js';
import NavBar from '../../component/navbar'

export default function TambahMenu({dataMenu}){
  const router = useRouter()

  const { data: session, status } = useSession()

  if (status === "authenticated") {
    return(
      <div className={styles.container}>
        <FormMenu selectedMenu={null} dataMenu={dataMenu} idAdmin={session.idAdmin}></FormMenu>
      </div>
    )
  }
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

TambahMenu.getLayout = function getLayout(page) {
    return (
      <Layout>
        <div className={styles.rootcontainer}>
          <NavBar key='tambahmenu' currentPath={'/admin/tambahmenu'}></NavBar>
          {page}
        </div>
      </Layout>
    )
}