import Layout from '../../component/layout'
import { useRouter } from 'next/router'
import { useState } from 'react'
import styles from '../../styles/TambahMenu.module.css'

export default function TambahMenu(){
  const router = useRouter()

  const [namamenu, setNamaMenu] = useState('')
  const [deskripsi, setDeskripsi] = useState('')
  const [harga, setHarga] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    alert("nama: " + namamenu + " deskripsi: " + deskripsi + " harga: " + harga)
  }

  return(
    <div className={styles.container}>
      <h1>Tambah Menu</h1>
        <form onSubmit={handleSubmit} className={styles.tambahmenuform}>
            <label>
                Nama Menu
                <input type='text' value={namamenu} onChange={({target}) => setNamaMenu(target.value)}></input>
            </label>

            <label>
                Deskripsi
                <input type='text' value={deskripsi} onChange={({target}) => setDeskripsi(target.value)}></input>
            </label>

            <label>
                Harga
                <input type='number' value={harga} onChange={({target}) => setHarga(target.value)}></input>
            </label>

            <input type='submit' className={styles.submitbtn}></input>
        </form>

        <button onClick={() => router.push('/admin')}>Back</button>
    </div>
  )
}

TambahMenu.getLayout = function getLayout(page) {
    return (
      <Layout>
        {page}
      </Layout>
    )
}