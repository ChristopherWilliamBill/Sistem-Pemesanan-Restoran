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

    if(dataJSON.message != "Failed"){
      setIdPesanan(dataJSON.message[0].idPesanan)

      for(let i = 0; i < dataJSON.message.length; i++){
        setOrder((order) => [...order].map(o => {
          if(o.idMenu === dataJSON.message[i].isiPesanan && dataJSON.message[i].status != 2) {
            return {
              ...o,
              count: dataJSON.message[i].jumlah,
              statusPesanan: dataJSON.message[0].statusPesanan,
              status: dataJSON.message[i].status
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
  } 

  const addToOrder = (menu) => {
    if(isWaiting){
      console.log(isWaiting)
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


    //kalau menu berupa paket, masukin order satu-satu sesuai isi menu, else, langsung masukin menu ke order
    // if(menu.isiMenu.length > 0){
    //   for(let i = 0; i < menu.isiMenu.length; i++){
    //     setOrder((order) => [...order].map(o => {
    //       if(o.idMenu === menu.isiMenu[i]) {
    //         return {
    //           ...o,
    //           count: o.count + 1,
    //         }
    //       }
    //       else return o;
    //     }))
    //   }
    // }else{
    //   setOrder([...order].map(o => {
    //     if(o.idMenu === menu.idMenu) {
    //       return {
    //         ...o,
    //         count: o.count + 1,
    //       }
    //     }
    //     else return o;
    //   }))
    // }
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

  if (status === "authenticated"){
    return (
      <>
        <h1 className={styles.title}>Welcome {session.user.name} !</h1>
  
        <div className={styles.container}>
          <div className={styles.menucontainer}>
            {dataMenu.map((menu) => (
              <MenuCard key={menu.idMenu} menu={menu} addToOrder={addToOrder} isWaiting={isWaiting} setIsWaiting={setIsWaiting}></MenuCard>
            ))}
          </div>
  
          {session.user.name.substring(0,5) == "Table" ? 
          <OrderCard order={order} addToOrder={addToOrder} reduceOrder={reduceOrder} resetOrder={resetOrder} notifyKitchen={notifyKitchen} isWaiting={isWaiting} setIsWaiting={setIsWaiting} meja={session.user.name} idPesanan={idPesanan} getCurrentOrder={getCurrentOrder}></OrderCard>
          : 
          <div>
            <h3>Hanya Untuk Pengunjung</h3>
          </div>}
        </div>
      </>
    )
  }

  return (
    <div className={styles.container}>
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