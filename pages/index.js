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

  const { data: session, status } = useSession()

  const [isWaiting, setIsWaiting] = useState(false);

  const socketInitializer = async () => {
    await fetch('/api/socket')
    socket = io()

    socket.on('connect', () => {
      console.log('connected')
    })
  }

  const notifyKitchen = async () => {
    socket.emit('notify-kitchen', 'new-order')
  }

  const getCurrentOrder = async () => {
    const data = {
      idMeja: session.user.name.substring(6, session.user.name.length),
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
    console.log(dataJSON.message)

    if(dataJSON.message.length > 0){
      
      for(let i = 0; i < dataJSON.message.length; i++){
        setOrder((order) => [...order].map(o => {
          if(o.idMenu === dataJSON.message[i].isiPesanan) {
            return {
              ...o,
              count: o.count + dataJSON.message[i].jumlah,
            }
          }
          else return o;
        }))
      }
      setIsWaiting(true)
    }
  }

  useEffect(() => {socketInitializer()}, [])

  useEffect(() => {
    if(session){
      getCurrentOrder()
    }
  },[status])

  const router = useRouter()

  const [order, setOrder] = useState(dataMenu);

  const resetOrder = () =>{
    setOrder(dataMenu)
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

  const learnMore = (menu) => {router.push(`/menu/${menu.idMenu}`)}

  if (status === "authenticated"){
    return (
      <>
        <h1 className={styles.title}>Welcome {session.user.name} !</h1>
  
        <div className={styles.container}>
          <div className={styles.menucontainer}>
            {dataMenu.map((menu) => (
              <MenuCard key={menu.idMenu} menu={menu} addToOrder={addToOrder} learnMore={learnMore} isWaiting={isWaiting} setIsWaiting={setIsWaiting}></MenuCard>
            ))}
          </div>
  
          {session.user.name.substring(0,5) == "Table" ? 
          <OrderCard order={order} addToOrder={addToOrder} reduceOrder={reduceOrder} resetOrder={resetOrder} notifyKitchen={notifyKitchen} isWaiting={isWaiting} setIsWaiting={setIsWaiting} meja={session.user.name}></OrderCard>
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
  const res = await conn.query(query)
  const dataMenu = res.rows
  dataMenu.sort((a,b) => a.idMenu - b.idMenu)

  for(let i = 0; i < dataMenu.length; i++){
    dataMenu[i].count = 0
  }

  return{
    props:{
      dataMenu
    }
  }
}