import { useState, useEffect } from "react";
import styles from "../styles/FormMenu.module.css"
import Router, { useRouter } from "next/router";

export default function FormEditKaryawan({dataAdmin}){
    const router = useRouter()

    const [namaAdmin, setNamaAdmin] = useState("")
    const [password, setPassword] = useState("")


    useEffect(() => {
        if (dataAdmin) {
            setNamaAdmin(dataAdmin.username);
            setPassword(dataAdmin.password);
        }
    }, [dataAdmin]); //ketika dataAdmin berubah, callback akan dieksekusi (mengupdate state menjadi admin yang sedang dipilih di parent)

    const handleSubmit = async (e) => {
        e.preventDefault()
        const data = {
            username: namaAdmin,
            password: password,
            idAdmin: dataAdmin.idAdmin,
        }
    
        const JSONdata = JSON.stringify(data)
    
        const endpoint = '../api/editkaryawan'
    
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
        router.push('../admin')
    }

    return(
        <div>
            <h3>Isi data admin yang baru: </h3>
            <form className={styles.tambahmenuform} onSubmit={handleSubmit}>
                <label>
                    Username
                    <input type='text' placeholder={dataAdmin.username} value={namaAdmin} onChange={({target}) => setNamaAdmin(target.value)} name="username" required></input>
                </label>

                <label>
                    Password
                    <input type='text' placeholder={dataAdmin.password} value={password} onChange={({target}) => setPassword(target.value)} name="password" required></input>
                </label>

                <input type='submit' className={styles.submitbtn}></input>
            </form>
        </div>
    )
}