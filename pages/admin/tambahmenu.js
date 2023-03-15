import Layout from '../../component/layout'
import { useRouter } from 'next/router'
import { useState } from 'react'
import styles from '../../styles/TambahMenu.module.css'
import { useSession } from 'next-auth/react'
import FormEditMenu from '../../component/formeditmenu'
import {conn} from '../../lib/pg.js';


export default function TambahMenu({dataMenu}){
  const router = useRouter()

  const [namamenu, setNamaMenu] = useState('')
  const [deskripsi, setDeskripsi] = useState('')
  const [harga, setHarga] = useState('')

  const { data: session, status } = useSession()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const data = {
      namaMenu: namamenu,
      deskripsi: deskripsi,
      harga: harga,
      idAdmin: session.idAdmin
    }

    const JSONdata = JSON.stringify(data)

    const endpoint = '../api/tambahmenu'

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSONdata
    }

    const response = await fetch(endpoint, options)
    const result = await response.json()
    alert(result.message)
  }

  if (status === "authenticated") {
    return(
      <div className={styles.container}>
        <FormEditMenu selectedMenu={null} dataMenu={dataMenu} idAdmin={session.idAdmin}></FormEditMenu>
      </div>
      // <div className={styles.container}>
      //   <h1>Tambah Menu</h1>

      //     <form className={styles.tambahmenuform} onSubmit={handleSubmit}>
      //         <label>
      //             Nama Menu
      //             <input type='text' value={namamenu} onChange={({target}) => setNamaMenu(target.value)} name="namaMenu"></input>
      //         </label>

      //         <label>
      //             Deskripsi
      //             <input type='text' value={deskripsi} onChange={({target}) => setDeskripsi(target.value)} name="deskripsi"></input>
      //         </label>

      //         <label>
      //             Harga
      //             <input type='number' value={harga} onChange={({target}) => setHarga(target.value)} name="harga"></input>
      //         </label>

      //         <input type='submit' className={styles.submitbtn}></input>
      //     </form>

      //     <button onClick={() => router.push('/admin')}>Back</button>
      // </div>
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
        {page}
      </Layout>
    )
}