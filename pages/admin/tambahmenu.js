import Layout from '../../component/layout'
import { useRouter } from 'next/router'
import { useState } from 'react'
import styles from '../../styles/TambahMenu.module.css'
import { useSession } from 'next-auth/react'

export default function TambahMenu(){
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
        <h1>Tambah Menu</h1>

          <form className={styles.tambahmenuform} onSubmit={handleSubmit}>
              <label>
                  Nama Menu
                  <input type='text' value={namamenu} onChange={({target}) => setNamaMenu(target.value)} name="namaMenu"></input>
              </label>

              <label>
                  Deskripsi
                  <input type='text' value={deskripsi} onChange={({target}) => setDeskripsi(target.value)} name="deskripsi"></input>
              </label>

              <label>
                  Harga
                  <input type='number' value={harga} onChange={({target}) => setHarga(target.value)} name="harga"></input>
              </label>

              <input type='submit' className={styles.submitbtn}></input>
          </form>

          <button onClick={() => router.push('/admin')}>Back</button>
      </div>
    )
  }
}

TambahMenu.getLayout = function getLayout(page) {
    return (
      <Layout>
        {page}
      </Layout>
    )
}