import React, { useState } from 'react';
import { signIn } from "next-auth/react"
import { useRouter } from 'next/router';
import styles from '../../styles/SignIn.module.css'


export default function SignIn() {
    const router = useRouter()

    const [username, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('meja')

    const handleSubmit = async (e) => {
        e.preventDefault()
        const res = await signIn('credentials',{
            username: username,
            password: password,
            role: role,
            redirect: false
        }).then(({ok, error}) => {
            if(ok){
                if(role === "meja"){
                    router.replace('../')
                }
                if(role === "admin"){
                    router.replace('../admin')
                }
            }else{
                alert("Username or password invalid")
            }
        })
    }

    return(
        <div className={styles.container}>
            <div className={styles.signinform}>
                <h2>Sign In</h2>
                <div className={styles.switch}>
                    <input type="radio" id="radiomeja" name="switch" value={"meja"} onChange={({target}) => setRole(target.value)} defaultChecked/>
                    <label htmlFor="radiomeja">Table</label>
                    <input type="radio" id="radioadmin" name="switch" value={"admin"} onChange={({target}) => setRole(target.value)}/>
                    <label htmlFor="radioadmin">Admin</label>
                </div>
                <div>
                    <label>Username</label>
                    <input className={styles.input} required type='text' value={username} onChange={({target}) => setUserName(target.value)}></input>
                </div>

                <div>
                    <label>Password</label>
                    <input className={styles.input} required type='password' value={password} onChange={({target}) => setPassword(target.value)}></input>
                </div>

                <button className='btn-primary' onClick={handleSubmit}>Sign In</button>
            </div>
        </div>
    )
}