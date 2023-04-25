import Layout from '../../component/layout'
import { useState, useEffect} from 'react'
import styles from '../../styles/Kitchen.module.css'
import { useSession } from 'next-auth/react'
import {conn} from '../../module/pg.js';
import io from 'socket.io-client'

let socket = null
export default function Kitchen({dataO, dataMenu, dataPaket}){

    const { data: session, status } = useSession()
    const [dataOrder, setDataOrder] = useState(dataO)

    const socketInitializer = async () => {
        await fetch('/api/socket')
        socket = io()
    
        socket.on('connect', () => {
            console.log('connected')
        })
    
        socket.on('datakitchen', (msg) => {
            console.log('diterima')
            setDataOrder(msg)
        })
    }

    const socketCleanUp = () => {
        if(socket){
          socket.removeAllListeners()
          socket.disconnect()
        }
    }

    useEffect(() => {
        socketInitializer()
        return () => {
          socketCleanUp()
        }
    }, [])

    if (status === "authenticated") {
        return(
            <div className={styles.container}>
                <h4>Orders to make: </h4>

                <div className={styles.ordercontainer}>
                    {dataOrder.map(d => 
                        <div key={d.isiPesanan} className={styles.card}>
                            <div className={styles.content}>
                                <h3>Earliest Order Time: {d.jam.split('.')[0]}</h3>
                                <div className={styles.info}>
                                    <h1>{dataMenu[d.isiPesanan - 1].namaMenu}</h1>
                                    <h1>x {d.sisa}</h1>
                                </div>
                            </div>

                            {dataPaket.some(paket => paket.idMenu === d.isiPesanan) &&
                            <div className={styles.paketcontainer}>
                                {dataPaket.filter(paket => paket.idMenu === d.isiPesanan).map(p => 
                                    <div key={p.isiMenu} className={styles.isipaket}>
                                        <h2>{dataMenu[p.isiMenu - 1].namaMenu}</h2> 
                                        <h2>x {p.jumlah * d.sisa}</h2>
                                    </div>
                                )}
                            </div>
                            }
                        </div>
                    )}
                </div>
            </div>
        )
    }
}

export async function getServerSideProps(){
    const query = `SELECT "isiPesanan", SUM("TerdiriPesanan"."jumlah") - SUM("delivered") AS "sisa", MIN("Pesanan"."jam") AS "jam" FROM "TerdiriPesanan" INNER JOIN "Pesanan" ON "Pesanan"."idPesanan" = "TerdiriPesanan"."idPesanan" WHERE "Pesanan"."statusPesanan" = 2 AND "TerdiriPesanan"."status" = 1 OR "TerdiriPesanan"."status" = 5 GROUP BY "isiPesanan", "Pesanan"."statusPesanan" ORDER BY "sisa" DESC, "jam" ASC`
    const queryMenu = `SELECT "namaMenu" FROM "Menu" ORDER BY "idMenu"`
    const queryPaket = `SELECT * FROM "TerdiriMenu"`
    const res = await conn.query(query)
    const resMenu = await conn.query(queryMenu)
    const resPaket = await conn.query(queryPaket)

    const dataO = res.rows
    const dataMenu = resMenu.rows
    const dataPaket = resPaket.rows

    console.log(dataO)
    console.log(dataMenu)
    console.log(dataPaket)
    return{
        props:{
            dataO,
            dataMenu,
            dataPaket
        }
    }
}

Kitchen.getLayout = function getLayout(page) {
    return (
      <Layout>
        {page}
      </Layout>
    )
}

