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
  const [showNotification, setShowNotification] = useState(false);
  const [notification, setNotification] = useState([]);
  const [isWaiting, setIsWaiting] = useState(false);
  const [idPesanan, setIdPesanan] = useState(0)
  const [uuid, setUuid] = useState('')
  const [order, setOrder] = useState(dataMenu);
  const [extendOrder, setExtendOrder] = useState(false)
  const [inputOrderTambahan, setInputOrderTambahan] = useState(dataMenu);
  const [orderTambahan, setOrderTambahan] = useState(dataMenu);
  const [jumlahCancel, setJumlahCancel] = useState([])
  const [jumlahCancelAdditional, setJumlahCancelAdditional] = useState([])
  const [audio, setAudio] = useState()

  const socketInitializer = async () => {
    await fetch('/api/socket')
    socket = io()

    socket.on('connect', () => {
      console.log('connected')
    })

    if(session){
      const statusorder = 'statusorder' + session.user.name.substring(6, session.user.name.length)
      socket.on(statusorder, (msg) => {
        getCurrentOrder(msg.idMeja)
        if(msg.message === 'Order finished.'){
          setNotification([])
        }else{
          setNotification(notification => [...notification, msg.message])
        }
        if(audio){
          audio.play()
        }
      })
    }
  }

  const notifyKitchen = async () => {
    socket.emit('notify-kitchen', 'table')
  }

  const getCurrentOrder = async (idMeja) => {
    if(session.role !== "meja"){
      return
    }

    resetOrder()
    const data = { idMeja: idMeja}
    const JSONdata = JSON.stringify(data)
    const endpoint = '../api/getcurrentorder'

    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSONdata
    }
    const response = await fetch(endpoint, options)
    const dataJSON = await response.json()

    if(dataJSON.message != "Failed" && dataJSON.message.orderUtama[0].statusPesanan < 4){
      setIdPesanan(dataJSON.message.orderUtama[0].idPesanan)
      setUuid(dataJSON.message.orderUtama[0].uuid)

      setJumlahCancel(new Array(dataJSON.message.orderUtama.length).fill(0))
      setJumlahCancelAdditional(new Array(dataJSON.message.orderTambahan.length).fill(0))

      for(let i = 0; i < dataJSON.message.orderUtama.length; i++){
        setOrder((order) => [...order].map(o => {
          if(o.idMenu === dataJSON.message.orderUtama[i].isiPesanan && dataJSON.message.orderUtama[i].status != 4) {
            return {
              ...o,
              count: o.count + dataJSON.message.orderUtama[i].jumlah,
              statusPesanan: dataJSON.message.orderUtama[0].statusPesanan,
              status: dataJSON.message.orderUtama[i].status,
              delivered: o.delivered + dataJSON.message.orderUtama[i].delivered,
              requestcancel: dataJSON.message.orderUtama[i].requestcancel
            }
          }
          else return o;
        }))
      }

      for(let i = 0; i < dataJSON.message.orderTambahan.length; i++){
        setOrderTambahan((orderTambahan) => [...orderTambahan].map(o => {
          if(o.idMenu === dataJSON.message.orderTambahan[i].isiPesanan && dataJSON.message.orderTambahan[i].status != 4) {
            return {
              ...o,
              count: o.count + dataJSON.message.orderTambahan[i].jumlah,
              statusPesanan: dataJSON.message.orderTambahan[0].statusPesanan,
              status: dataJSON.message.orderTambahan[i].status,
              delivered: o.delivered + dataJSON.message.orderTambahan[i].delivered,
              requestcancel: dataJSON.message.orderTambahan[i].requestcancel
            }
          }
          else return o;
        }))
      }

      setIsWaiting(true)
    }
  }

  useEffect(() => {socketInitializer()}, [status])
  useEffect(() => setAudio(new Audio('/notification.mp3')),[])

  useEffect(() => {
    if(session){
      const x = session.user.name.substring(6, session.user.name.length)
      getCurrentOrder(x)
    }
  },[status])

  const resetOrder = () =>{
    setOrder(dataMenu)
    setOrderTambahan(dataMenu)
    setIdPesanan(0)
    setIsWaiting(false)
  } 

  const resetInputOrderTambahan = () =>{
    setInputOrderTambahan(dataMenu)
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

  const addToInputOrderTambahan = (menu) => {
    setInputOrderTambahan([...inputOrderTambahan].map(o => {
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

  const reduceInputOrderTambahan = (menu) => {
    setInputOrderTambahan([...inputOrderTambahan].map(o => {
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
        <button className={styles.notifbutton} onClick={() => setShowNotification(!showNotification)}>
          Notification
        </button>

        {showNotification && <div className={styles.notification}>
            {notification.map(n => <p>{n}</p>)}
            {notification.length === 0 && <p>No notification</p>}
        </div>}

        <div className={styles.container} onClick={() => setShowNotification(false)}>
          <div className={styles.menucontainer}>
            {dataMenu.filter(d => d.aktif === 1).map((menu) => (
              <MenuCard key={menu.idMenu} menu={menu} addToOrder={addToOrder} extendOrder={extendOrder} addToInputOrderTambahan={addToInputOrderTambahan} isWaiting={isWaiting} setIsWaiting={setIsWaiting}></MenuCard>
            ))}
          </div>
  
          {session.user.name.substring(0,5) === "Table" ? 
            <div className={styles.ordercontainer}>
              <OrderCard order={order} orderTambahan={orderTambahan} addToOrder={addToOrder} reduceOrder={reduceOrder} resetOrder={resetOrder} notifyKitchen={notifyKitchen} isWaiting={isWaiting} setIsWaiting={setIsWaiting} meja={session.user.name} idPesanan={idPesanan} getCurrentOrder={getCurrentOrder} extendOrder={extendOrder} setExtendOrder={setExtendOrder} jumlahCancel={jumlahCancel} setJumlahCancel={setJumlahCancel} jumlahCancelAdditional={jumlahCancelAdditional} setJumlahCancelAdditional={setJumlahCancelAdditional} uuid={uuid}></OrderCard>
              {extendOrder && <OrderCard extendOrder={extendOrder} resetOrder={resetInputOrderTambahan} order={inputOrderTambahan} addToOrder={addToInputOrderTambahan} isWaiting={false} setIsWaiting={setIsWaiting} reduceOrder={reduceInputOrderTambahan} meja={session.user.name} idPesanan={idPesanan} notifyKitchen={notifyKitchen} getCurrentOrder={getCurrentOrder} setExtendOrder={setExtendOrder} jumlahCancel={jumlahCancel} setJumlahCancel={setJumlahCancel} jumlahCancelAdditional={jumlahCancelAdditional} setJumlahCancelAdditional={setJumlahCancelAdditional} uuid={uuid}></OrderCard>}
            </div>
          : 
            <div className={styles.containerpengunjung}>
              <h3 className={styles.pengunjung}>Only for customer</h3>
              <button className='btn-primary' onClick={() => router.push('./admin')}>To Admin</button>
            </div>
          }
        </div>
      </>
    )
  }

  return (
    <div className={styles.containerSignIn}>
      <h1>Please contact administrator.</h1>
      <button className='btn-primary' onClick={signIn}>Sign In</button>
    </div>
  )
}

export async function getServerSideProps(){
  const query = `SELECT * FROM "Menu"`
  const queryPaket = `SELECT "Menu"."idMenu", "TerdiriMenu"."isiMenu", "TerdiriMenu"."jumlah" FROM "Menu" INNER JOIN "TerdiriMenu" ON "Menu"."idMenu" = "TerdiriMenu"."idMenu"`

  const res = await conn.query(query)
  const resPaket = await conn.query(queryPaket)

  const dataMenu = res.rows
  const dataPaket = resPaket.rows

  dataMenu.sort((a,b) => a.idMenu - b.idMenu)

  for(let i = 0; i < dataMenu.length; i++){
    dataMenu[i].count = 0
    dataMenu[i].delivered = 0
    dataMenu[i].statusPesanan = 0
    dataMenu[i].status = 0
    dataMenu[i].isiMenu = []
    dataMenu[i].requestcancel = 0
  }

  for(let i = 0; i < dataPaket.length; i++){
    dataMenu[dataPaket[i].idMenu - 1].isiMenu.push({isiMenu: dataPaket[i].isiMenu, jumlah: dataPaket[i].jumlah})
  }
  
  return{
    props:{
      dataMenu
    }
  }
}