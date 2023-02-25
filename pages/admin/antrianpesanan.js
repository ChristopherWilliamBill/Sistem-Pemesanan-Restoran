import Layout from '../../component/layout'
import PendingOrderCard from '../../component/pendingordercard';
import {conn} from '../../lib/pg.js';
import styles from '../../styles/AntrianPesanan.module.css'
import io from 'Socket.IO-client'
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

let socket = null

export default function AntrianPesanan({dataMenu, dataO}){

  const { data: session, status } = useSession()

  const order = dataO.reduce((order, {idPesanan, isiPesanan, jumlah, statusPesanan, jam, idMeja, status}) => {
    if(!order[idPesanan -1]){
      order[idPesanan -1] = {idPesanan: idPesanan, isiPesanan: [], jumlah: [], status: []}
    }
    //order[idPesanan] ??= {idPesanan: idPesanan, isiPesanan: "", jumlah: []}; // ??= --> logical nullish assignment

    order[idPesanan -1].isiPesanan.push(isiPesanan)
    order[idPesanan -1].jumlah.push(jumlah)
    order[idPesanan -1].statusPesanan = statusPesanan
    order[idPesanan -1].jam = jam
    order[idPesanan -1].idMeja = idMeja
    order[idPesanan -1].status.push(status)

    return order;
  }, []);

  const [dataOrder, setDataOrder] = useState(order)
  const [tab, setTab] = useState("pesananbaru")
  
  const socketInitializer = async () => {
    await fetch('/api/socket')
    socket = io()

    socket.on('connect', () => {
      console.log('connected')
    })

    socket.on('send-orders', msg => {
      setDataOrder(msg)
      console.log('nerima order')

    })
  }

  const notifyTable = async (msg) => {
    socket.emit('handleorder', msg)
  }

  const notifyKitchen = async () => {
    socket.emit('notify-kitchen', 'new-order')
    console.log('notifykithcen')
  }

  useEffect(() => {socketInitializer()}, [])

  console.log(dataOrder)

  if (status === "authenticated") {

    if(!dataOrder){
      return <h1>LOADING</h1>
    }
  
    return(
      <>
        <div className={styles.navbar}>
          <button onClick={() => setTab("pesananbaru")}>New Orders</button>
          <button onClick={() => setTab("diproses")}>In The Kitchen</button>
          <button onClick={() => setTab("pesananselesai")}>Finished Orders</button>
        </div>

        {tab === "pesananbaru" ? 
          <>
            <h2 className={styles.category}>New Orders</h2>
            <div className={styles.container}>
              {
                dataOrder.filter(d => d.statusPesanan == 1).length > 0 ?
                  dataOrder.filter(d => d.statusPesanan == 1).map(
                    d => <PendingOrderCard d={d} dataMenu={dataMenu} status={1} notifyKitchen={notifyKitchen} idAdmin={session.idAdmin} notifyTable={notifyTable}></PendingOrderCard>
                  )
                : <p>No Order</p>
              }
            </div>
          </>
          : null
        }
        {tab === "diproses" ?
          <>
            <h2 className={styles.category}>In The Kitchen</h2>
            <div className={styles.container}>
              {
                dataOrder.filter(d => d.statusPesanan == 2).length > 0 ?
                  dataOrder.filter(d => d.statusPesanan == 2).map(
                    d => <PendingOrderCard d={d} dataMenu={dataMenu} status={2} notifyKitchen={notifyKitchen} idAdmin={session.idAdmin} notifyTable={notifyTable}></PendingOrderCard>
                  )
                : <p>No Order</p>
              }
            </div>
          </>
          : null
        }

        {tab === "pesananselesai" ?
          <>
            <h2 className={styles.category}>Finished Orders</h2>
            <div className={styles.container}>
              {
                dataOrder.filter(d => d.statusPesanan == 3).length > 0 ?
                  dataOrder.filter(d => d.statusPesanan == 3).map(
                    d => <PendingOrderCard d={d} dataMenu={dataMenu} status={3} notifyKitchen={notifyKitchen} idAdmin={session.idAdmin} notifyTable={notifyTable}></PendingOrderCard>
                  )
                : <p>No Order</p>
              }
            </div>
          </>
          : null
        }
      </>
    )
  }
}

export async function getServerSideProps(){

  const queryMenu = `SELECT * FROM "Menu"`
  //const queryOrder = `SELECT * FROM "Pesanan" INNER JOIN "TerdiriPesanan" ON "Pesanan"."idPesanan" = "TerdiriPesanan"."idPesanan"`
  const queryOrder = `SELECT "Pesanan"."idPesanan", "Pesanan"."statusPesanan", "Pesanan"."jam", "Pesanan"."idMeja", "Pesanan"."selesai", "TerdiriPesanan"."isiPesanan", "TerdiriPesanan"."jumlah", "TerdiriPesanan"."status" FROM "Pesanan" INNER JOIN "TerdiriPesanan" ON "Pesanan"."idPesanan" = "TerdiriPesanan"."idPesanan"`

  const resMenu = await conn.query(queryMenu)
  const dataMenu = resMenu.rows
  dataMenu.sort((a,b) => a.idMenu - b.idMenu)

  const resOrder = await conn.query(queryOrder)
  const dataO = resOrder.rows

  console.log(dataO)

  return{
    props:{
      dataMenu,
      dataO
    }
  }
}

AntrianPesanan.getLayout = function getLayout(page) {
    return (
      <Layout>
        {page}
      </Layout>
    )
}