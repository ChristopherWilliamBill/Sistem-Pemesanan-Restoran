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

  const order = dataO.reduce((order, {idPesanan, isiPesanan, jumlah, status, jam, idMeja}) => {
    if(!order[idPesanan -1]){
      order[idPesanan -1] = {idPesanan: idPesanan, isiPesanan: [], jumlah: []}
    }
    //order[idPesanan] ??= {idPesanan: idPesanan, isiPesanan: "", jumlah: []}; // ??= --> logical nullish assignment

    order[idPesanan -1].isiPesanan.push(isiPesanan)
    order[idPesanan -1].jumlah.push(jumlah)
    order[idPesanan -1].status = status
    order[idPesanan -1].jam = jam
    order[idPesanan -1].idMeja = idMeja


    return order;
  }, []);

  console.log(order)  
  const [dataOrder, setDataOrder] = useState(order)
  
  const socketInitializer = async () => {
    await fetch('/api/socket')
    socket = io()

    socket.on('connect', () => {
      console.log('connected')
    })

    socket.on('send-orders', msg => {
      setDataOrder(msg)
    })
  }

  const notifyKitchen = async () => {
    socket.emit('notify-kitchen', 'new-order')
  }

  useEffect(() => {socketInitializer()}, [])


  // const fetcher = async () => {
  //   const response = await fetch('http://localhost:3000/api/getOrder')
  //   const dataOrder = await response.json()
  //   return dataOrder
  // }

  // const { data, error } = useSWR('order', fetcher, { refreshInterval: 10000})

  if (status === "authenticated") {

    if(!dataOrder){
      return <h1>LOADING</h1>
    }
  
    return(
      <>
        <h2 className={styles.category}>Pending</h2>
        <div className={styles.container}>
          {
            dataOrder.filter(d => d.status == 1).length > 0 ?
              dataOrder.filter(d => d.status == 1).map(
                d => <PendingOrderCard d={d} dataMenu={dataMenu} status={1} notifyKitchen={notifyKitchen} idAdmin={session.idAdmin}></PendingOrderCard>
              )
            : <p>No Order</p>
          }
        </div>
  
        <hr></hr>
  
        <h2 className={styles.category}>Processing</h2>
        <div className={styles.container}>
          {
            dataOrder.filter(d => d.status == 2).length > 0 ?
              dataOrder.filter(d => d.status == 2).map(
                d => <PendingOrderCard d={d} dataMenu={dataMenu} status={2} notifyKitchen={notifyKitchen} idAdmin={session.idAdmin}></PendingOrderCard>
              )
            : <p>Accept Pending Order</p>
          }
        </div>
      </>
    )
  }
}

export async function getServerSideProps(){

  const queryMenu = `SELECT * FROM "Menu"`
  const queryOrder = `SELECT * FROM "Pesanan" INNER JOIN "TerdiriPesanan" ON "Pesanan"."idPesanan" = "TerdiriPesanan"."idPesanan"`

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