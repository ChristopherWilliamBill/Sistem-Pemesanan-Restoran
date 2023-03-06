import styles from '../styles/Home.module.css'
import { useRouter } from 'next/router';
import React, { useState,useEffect } from 'react';
import {conn} from '../lib/pg.js';
import MenuCard from '../component/menucard';
import OrderCard from '../component/ordercard';
import { useSession, signIn } from 'next-auth/react';
import io from 'Socket.IO-client'

let socket = null

export default function Home({dataMenu}) {
  const router = useRouter()

  const { data: session, status } = useSession()

  const [isWaiting, setIsWaiting] = useState(false);
  const [idPesanan, setIdPesanan] = useState(0)
  const [order, setOrder] = useState(dataMenu);
  const [extendOrder, setExtendOrder] = useState(false)
  const [orderTambahan, setOrderTambahan] = useState(dataMenu);

  const socketInitializer = async () => {
    await fetch('/api/socket')
    socket = io()

    socket.on('connect', () => {
      console.log('connected')
    })

    if(session){
      const statusorder = 'statusorder' + session.user.name.substring(6, session.user.name.length)
      socket.on(statusorder, (msg) => {
        resetOrder()
        getCurrentOrder(msg)
      })
    }
  }

  const notifyKitchen = async () => {
    socket.emit('notify-kitchen', 'new-order')
  }

  const getCurrentOrder = async (idMeja) => {
    resetOrder()
    const data = {
      idMeja: idMeja
    }

    const JSONdata = JSON.stringify(data)

    const endpoint = '../api/getcurrentorder'

    const options = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSONdata
    }
    const response = await fetch(endpoint, options)
    const dataJSON = await response.json()

    if(dataJSON.message[0].statusPesanan < 4){
      resetOrder()
    }

    if(dataJSON.message != "Failed" && dataJSON.message[0].statusPesanan < 4){
      setIdPesanan(dataJSON.message[0].idPesanan)

      for(let i = 0; i < dataJSON.message.length; i++){
        setOrder((order) => [...order].map(o => {
          if(o.idMenu === dataJSON.message[i].isiPesanan && dataJSON.message[i].status != 4) {
            return {
              ...o,
              count: dataJSON.message[i].jumlah,
              statusPesanan: dataJSON.message[0].statusPesanan,
              status: dataJSON.message[i].status,
              delivered: dataJSON.message[i].delivered
            }
          }
          else return o;
        }))
      }
      setIsWaiting(true)
    }
  }

  useEffect(() => {socketInitializer()}, [status])

  useEffect(() => {
    if(session){
      const x = session.user.name.substring(6, session.user.name.length)
      getCurrentOrder(x)
    }
  },[status])

  const resetOrder = () =>{
    setOrder(dataMenu)
    setIdPesanan(0)
    setIsWaiting(false)
  } 

  const resetOrderTambahan = () =>{
    setOrderTambahan(dataMenu)
    setExtendOrder(false)
  } 

  const addToOrder = (menu) => {
    if(isWaiting){
      return
    }

    setOrder([...order].map(o => {
      if(o.idMenu === menu.idMenu) {
        return {
          ...o,
          count: o.count + 1,
        }
      }
      else return o;
    }))
  }

  const addToOrderTambahan = (menu) => {
    setOrderTambahan([...orderTambahan].map(o => {
      if(o.idMenu === menu.idMenu) {
        return {
          ...o,
          count: o.count + 1,
        }
      }
      else return o;
    }))
  }

  const reduceOrder = (menu) => {
    setOrder([...order].map(o => {
      if(o.idMenu === menu.idMenu) {
        return {
          ...o,
          count: o.count - 1,
        }
      }
      else return o;
    }))
  }

  const reduceOrderTambahan = (menu) => {
    setOrderTambahan([...orderTambahan].map(o => {
      if(o.idMenu === menu.idMenu) {
        return {
          ...o,
          count: o.count - 1,
        }
      }
      else return o;
    }))
  }

  if (status === "authenticated"){
    return (
      <>
        <h1 className={styles.title}>Welcome {session.user.name} !</h1>
  
        <div className={styles.container}>
          <div className={styles.menucontainer}>
            {dataMenu.map((menu) => (
              <MenuCard key={menu.idMenu} menu={menu} addToOrder={addToOrder} extendOrder={extendOrder} addToOrderTambahan={addToOrderTambahan} isWaiting={isWaiting} setIsWaiting={setIsWaiting}></MenuCard>
            ))}
          </div>
  
          {session.user.name.substring(0,5) == "Table" ? 
            <div className={styles.ordercontainer}>
              <OrderCard order={order} addToOrder={addToOrder} reduceOrder={reduceOrder} resetOrder={resetOrder} notifyKitchen={notifyKitchen} isWaiting={isWaiting} setIsWaiting={setIsWaiting} meja={session.user.name} idPesanan={idPesanan} getCurrentOrder={getCurrentOrder} extendOrder={extendOrder} setExtendOrder={setExtendOrder}></OrderCard>


              {/* {ADDTOORDER SAMA REDUCE ORDER BIKIN VERSI ADDITIONAL ORDERNYA} */}

              
              {extendOrder && <OrderCard extendOrder={extendOrder} resetOrder={resetOrderTambahan} order={orderTambahan} addToOrder={addToOrderTambahan} isWaiting={false} setIsWaiting={setIsWaiting} reduceOrder={reduceOrderTambahan} meja={session.user.name} idPesanan={idPesanan} notifyKitchen={notifyKitchen} getCurrentOrder={getCurrentOrder} setExtendOrder={setExtendOrder}></OrderCard>}
            </div>
          : 
            <div className={styles.containerpengunjung}>
              <h3 className={styles.pengunjung}>Hanya Untuk Pengunjung</h3>
            </div>
          }
        </div>
      </>
    )
  }

  return (
    <div className={styles.containerSignIn}>
      <h1>Please contact administrator.</h1>
      <button className={styles.button} onClick={signIn}>Sign In</button>
    </div>
  )
}

export async function getServerSideProps(){
  const query = `SELECT * FROM "Menu"`
  const queryPaket = `SELECT "Menu"."idMenu", "TerdiriMenu"."isiMenu" FROM "Menu" INNER JOIN "TerdiriMenu" ON "Menu"."idMenu" = "TerdiriMenu"."idMenu"`

  const res = await conn.query(query)
  const resPaket = await conn.query(queryPaket)

  const dataMenu = res.rows
  const dataPaket = resPaket.rows

  dataMenu.sort((a,b) => a.idMenu - b.idMenu)

  for(let i = 0; i < dataMenu.length; i++){
    dataMenu[i].count = 0
    dataMenu[i].statusPesanan = 0
    dataMenu[i].status = 0
    dataMenu[i].isiMenu = []
  }

  for(let i = 0; i < dataPaket.length; i++){
    dataMenu[dataPaket[i].idMenu - 1].isiMenu.push(dataPaket[i].isiMenu)
  }

  console.log(dataMenu)

  return{
    props:{
      dataMenu
    }
  }
}