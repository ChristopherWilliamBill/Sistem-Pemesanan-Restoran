import React, { useState } from 'react';
import { signIn } from "next-auth/react"
import { useRouter } from 'next/router';
import styles from '../../styles/SignIn.module.css'


export default function SignIn() {
    const router = useRouter()

    const [username, setUserName] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        const res = await signIn('credentials',{
            username: username,
            password: password,
            redirect: false
        }).then(({ok, error}) => {
            if(ok){
                router.push('../admin')
            }else{
                alert("Username or password invalid")
            }
        })
    }

    return(
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.signinform}>
                <label>
                    Username
                    <input type='text' value={username} onChange={({target}) => setUserName(target.value)}></input>
                </label>

                <label>
                    Password
                    <input type='password' value={password} onChange={({target}) => setPassword(target.value)}></input>
                </label>

                <input type='submit' className={styles.submitbtn}></input>
            </form>
        </div>
    )

}