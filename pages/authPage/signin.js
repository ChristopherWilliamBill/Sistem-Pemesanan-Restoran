import React, { useState } from 'react';
import { signIn } from "next-auth/react"
import { redirect } from 'next/dist/server/api-utils';
import { useRouter } from 'next/router';


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
        <>
            <form onSubmit={handleSubmit}>
                username
                <input type='text' value={username} onChange={({target}) => setUserName(target.value)}></input>

                <br></br>

                password
                <input type='password' value={password} onChange={({target}) => setPassword(target.value)}></input>

                <br></br>
                <input type='submit'></input>
            </form>
        </>
    )
}