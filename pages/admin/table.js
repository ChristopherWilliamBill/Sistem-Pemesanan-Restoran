import Layout from '../../component/layout'
import { useRouter } from 'next/router'
import { useState } from 'react'
import styles from '../../styles/Table.module.css'
import { useSession } from 'next-auth/react'
import {conn} from '../../module/pg.js';
import NavBar from '../../component/navbar'

export default function Table({dataMeja}){
    const router = useRouter()

    const { data: session, status } = useSession()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isNew, setIsNew] = useState(false)

    const handleNew = () => {
        setIsNew(true)
        setUsername('Table ' + (dataMeja.length + 1))
        setPassword('meja' + (dataMeja.length + 1))
    }

    const handleExisting = (d) => {
        if(username){
            return
        }
        setIsNew(false)
        setUsername(d.username)
        setPassword(d.password)
    }

    const handleCancel = () => {
        setIsNew(false)
        setPassword('')
        setUsername('')
    }

    const handleSubmit = async () => {
        if(username === '' || password === ''){
            alert('Invalid password')
            return
        }

        let method = ''
        if(isNew){
            method = 'POST'
        }else{
            method = 'PUT'
        }

        const data = {
            username: username,
            password: password,
        }    
        const JSONdata = JSON.stringify(data)
        const endpoint = '../api/meja'
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSONdata
        }
    
        const response = await fetch(endpoint, options)
        const result = await response.json()

        if(result.revalidated){
            router.reload()
        }
    }

    if (status === "authenticated") {
        return(
            <>
                <div className={styles.container}>
                    <div className={styles.containerexisting}>
                        <h3>Existing Table: </h3>
                        {dataMeja.map(d => 
                        <div key={d.idMeja} className={styles.list}>                            
                            <p>{d.username}</p>
                            {!username && <button className='btn-primary' onClick={() => handleExisting(d)}>edit</button>}
                        </div>)
                        }
                        {username && <p className={styles.selected}>Editing: {username}</p>}
                        {!username && <button className='btn-primary' onClick={handleNew}>Add more</button>}
                    </div>

                    {username && 
                        <div className={styles.newmeja}>
                            {username === 'Table ' + (dataMeja.length + 1) ?
                            <h3>Add New: {username} </h3>
                            : <h3>Editing: {username}</h3>}
                            <label className={styles.input}>
                                <p>Set password:</p>
                                <input type="text" value={password} placeholder={password} onChange={({target}) => setPassword(target.value)}></input>
                            </label> 

                            <div className={styles.btn}>
                                <button className='btn-primary' onClick={handleSubmit}>Submit</button>
                                <button className='btn-danger' onClick={handleCancel}>Cancel</button>
                            </div>
                        </div>
                    }
                </div>
            </>
        )
    }
}

export async function getStaticProps(){
    const query = `SELECT * FROM "Meja" ORDER BY "idMeja"`
    const res = await conn.query(query)
    const dataMeja = res.rows
    
    return{
        props:{
            dataMeja,
        }
    }
}

Table.getLayout = function getLayout(page) {
    return (
      <Layout>
        <div className={styles.rootcontainer}>
            <NavBar currentPath={'/admin/table'}></NavBar>
            {page}
        </div>
      </Layout>
    )
}