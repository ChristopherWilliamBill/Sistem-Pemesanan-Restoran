import { useState } from "react";
import styles from "../styles/FormKaryawan.module.css"
import Router, { useRouter } from "next/router";

export default function FormKaryawan({dataAdmin}){
    const router = useRouter()

    const [namaAdmin, setNamaAdmin] = useState(dataAdmin ? dataAdmin.username : "")
    const [password, setPassword] = useState(dataAdmin ? dataAdmin.password : "")
    const [role, setRole] = useState(dataAdmin ? dataAdmin.role : "karyawan")

    const handleSubmit = async () => {
        let endpoint = '../api/karyawan'
        let idAdmin
        let method

        if(dataAdmin){  
            idAdmin = dataAdmin.idAdmin
            method = 'PUT'
        }else{
            method = 'POST'
        }   

        const data = {
            username: namaAdmin,
            password: password,
            role: role,
            idAdmin: idAdmin,
        }
    
        const JSONdata = JSON.stringify(data)

        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSONdata
        }
    
        const response = await fetch(endpoint, options)
        const result = await response.json()
        alert(result.message)

        if(result.revalidated){
            if(dataAdmin){  
                router.reload()
            }else{
                router.push('/admin/editemployee')
            } 
        }
    }

    return(
        <div>
            {dataAdmin ? <h3>Updated admin data: </h3> : <h3>Add admin: </h3>}
            <div className={styles.container}>
                <div className={styles.inputcontainer}>
                    <p>Username</p>
                    <input type='text' placeholder={dataAdmin ? dataAdmin.username : 'name'} value={namaAdmin} onChange={({target}) => setNamaAdmin(target.value)} name="username" required></input>
                </div>

                <div className={styles.inputcontainer}>
                    <p>Password</p>
                    <input type='text' placeholder={dataAdmin ? dataAdmin.password : 'password'} value={password} onChange={({target}) => setPassword(target.value)} name="password" required></input>
                </div>

                <div className={styles.switch}>
                    <input checked={role === "karyawan" && true} type='radio' id="radiokaryawan" value={"karyawan"} onChange={({target}) => setRole(target.value)} name="role"></input> 
                    <label htmlFor="radiokaryawan">Employee</label>
                    <input checked={role === "manager" && true} type='radio' id="radiomanager" value={"manager"} onChange={({target}) => setRole(target.value)} name="role"></input> 
                    <label htmlFor="radiomanager">Manager</label>
                </div>
                <button className='btn-primary' onClick={handleSubmit}>Submit</button>
            </div>
        </div>
    )
}