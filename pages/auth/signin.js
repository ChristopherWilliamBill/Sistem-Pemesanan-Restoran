import React, { useState } from 'react';
import { signIn } from "next-auth/react"
import { useRouter } from 'next/router';
import styles from '../../styles/SignIn.module.css'


export default function SignIn() {
    const router = useRouter()

    const [username, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('')

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
                    router.push('../')
                }
                if(role === "admin"){
                    router.push('../admin')
                }
            }else{
                alert("Username or password invalid")
            }
        })
    }

    return(
        <div className={styles.container}>
            <h2>Sign In</h2>
            <div onSubmit={handleSubmit} className={styles.signinform}>
                <label>
                    Username
                    <input type='text' value={username} onChange={({target}) => setUserName(target.value)}></input>
                </label>

                <label>
                    Password
                    <input type='password' value={password} onChange={({target}) => setPassword(target.value)}></input>
                </label>

                <label>
                    <input type='radio' value={"meja"} onChange={({target}) => setRole(target.value)} name="role"></input> Table
                    <input type='radio' value={"admin"} onChange={({target}) => setRole(target.value)} name="role"></input> Administrator
                </label>

                <button className={styles.submitbtn} onClick={handleSubmit}>Sign In</button>
            </div>
        </div>
    )

}