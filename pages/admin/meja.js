import Layout from '../../component/layout'
import { useRouter } from 'next/router'
import { useState } from 'react'
import styles from '../../styles/Meja.module.css'
import { useSession } from 'next-auth/react'
import {conn} from '../../lib/pg.js';


export default function Meja({dataMeja, dataOrder}){
    const router = useRouter()

    const { data: session, status } = useSession()

    const [username, setUsername] = useState()
    const [password, setPassword] = useState()

    const handleNew = () => {
        setUsername('Table ' + (dataMeja.length + 1))
        setPassword('meja' + (dataMeja.length + 1))
    }

    const handleExisting = (d) => {
        if(username){
            return
        }
        setUsername(d.username)
        setPassword(d.password)
    }

    const handleCancel = () => {
        setPassword()
        setUsername()
    }

    if (status === "authenticated") {
        return(
            <>
            {console.log(dataOrder)}
                <div className={styles.container}>
                    <div className={styles.containerexisting}>
                        <h3>Existing Table: </h3>
                        {dataMeja.map(d => 
                        <div className={styles.list}>                            
                            <p>{d.username} {dataOrder.some(dataO => dataO.idMeja === d.idMeja) && 'occupied'}</p>
                            {!username && <button className='btn-primary' onClick={() => handleExisting(d)}>edit</button>}
                        </div>)
                        }
                        {username && <p className={styles.selected}>Editing: {username}</p>}
                        {!username && <button className='btn-primary' onClick={handleNew}>Add more</button>}
                    </div>

                    {username && 
                        <div className={styles.newmeja}>
                            <h4>{username}</h4>
                            <label className={styles.input}>
                                <p>Set password:</p>
                                <input type="text" value={password} placeholder={password} onChange={({target}) => setPassword(target.value)}></input>
                            </label> 

                            <div className={styles.btn}>
                                <button className='btn-primary'>Submit</button>
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
    const queryOrder = `SELECT "idMeja" FROM "Pesanan" WHERE "selesai" = 0`

    const res = await conn.query(query)
    const resOrder = await conn.query(queryOrder)
    const dataMeja = res.rows
    const dataOrder = resOrder.rows
    
    return{
        props:{
            dataMeja,
            dataOrder
        }
    }
}

Meja.getLayout = function getLayout(page) {
    return (
      <Layout>
        {page}
      </Layout>
    )
}