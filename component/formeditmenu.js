import { useState, useEffect } from "react";
import styles from "../styles/FormMenu.module.css"
import Router, { useRouter } from "next/router";

export default function FormEditMenu({dataMenu}){
    const router = useRouter()

    const [namaMenu, setNamaMenu] = useState("")
    const [deskripsi, setDeskripsi] = useState("");
    const [harga, setHarga] = useState(0)

    useEffect(() => {
        if (dataMenu) {
            setNamaMenu(dataMenu.namaMenu);
            setDeskripsi(dataMenu.deskripsiMenu);
            setHarga(dataMenu.harga);
        }
    }, [dataMenu]); //ketika dataMenu berubah, callback akan dieksekusi (mengupdate state menjadi menu yang sedang dipilih di parent)


    const handleSubmit = async (e) => {
        e.preventDefault()
        const data = {
            namaMenu: namaMenu,
            deskripsiMenu: deskripsi,
            harga: harga,
            id: dataMenu.id
        }
    
        const JSONdata = JSON.stringify(data)
    
        const endpoint = '../api/editmenu'
    
        const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSONdata
        }
    
        const response = await fetch(endpoint, options)
        const result = await response.json()
        alert(result.message)
        router.push('../')
    }

    return(
        <div>
            <h3>Isi data menu yang baru: </h3>
            <form className={styles.tambahmenuform} onSubmit={handleSubmit}>
                <label>
                    Nama Menu
                    <input type='text' placeholder={dataMenu.namaMenu} value={namaMenu} onChange={({target}) => setNamaMenu(target.value)} name="namaMenu" required></input>
                </label>

                <label>
                    Deskripsi
                    <input type='text' placeholder={dataMenu.deskripsiMenu} value={deskripsi} onChange={({target}) => setDeskripsi(target.value)} name="deskripsi" required></input>
                </label>

                <label>
                    Harga
                    <input type='number' placeholder={dataMenu.harga} value={harga} onChange={({target}) => setHarga(target.value)} name="harga" required></input>
                </label>

                <input type='submit' className={styles.submitbtn}></input>
            </form>
        </div>
    )
}