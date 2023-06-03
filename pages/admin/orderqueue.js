import Layout from '../../component/layout'
import PendingOrderCard from '../../component/pendingordercard';
import {conn} from '../../module/pg.js';
import styles from '../../styles/OrderQueue.module.css'
import io from 'socket.io-client'
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { orderFormatter } from '../../module/orderformatter';
import Swal from 'sweetalert2';

let socket = null

export default function OrderQueue({dataMenu, dataO}){
  const { data: session, status } = useSession()

  const [dataOrder, setDataOrder] = useState(orderFormatter(dataO, dataMenu))
  const [tab, setTab] = useState("neworders")
  const [print, setPrint] = useState(new Array(dataOrder.filter(d => d.statusPesanan == 2).length).fill(0))
  const [currentIndexNewOrders, setCurrentIndexNewOrders] = useState(0)
  const [currentIndexKitchen, setCurrentIndexKitchen] = useState(0)
  const [currentIndexPayment, setCurrentIndexPayment] = useState(0)


  const printOrder = async (index, tipe) => {
    if(tipe === 'utama'){
      if(dataOrder[index].requestcancel.some(dr => dr === 1)){
        Swal.fire({title: "Handle cancellation request first!", timer: 1500, showConfirmButton: false, icon: "error"})
        return
      }
    }

    let temp = print.slice()
    temp[index] = 1
    setPrint(temp)
  }  

  const socketInitializer = async () => {
    await fetch('/api/socket')
    socket = io()

    socket.on('connect', () => {
      console.log('connected')
    })

    socket.on('sendorders', (msg) => {
      setDataOrder(msg)
      setPrint(new Array(msg.filter(d => d.statusPesanan == 2).length).fill(0))
    })
  }

  const notifyTable = async (msg) => {
    socket.emit('handleorder', msg)
  }

  const notifyKitchen = async () => {
    socket.emit('notify-antrian', 'kitchen')
    socket.emit('notify-kitchen', 'kitchen')
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
  // useEffect(() => setPrint(new Array(dataOrder.filter(d => d.statusPesanan == 2).length).fill(0)), [dataOrder])

  useEffect(() => {
    if(!print.every(p => p == 0)){
      window.print()
      setPrint(new Array(dataOrder.filter(d => d.statusPesanan == 2).length).fill(0))
    }
  }, [print])

  const visibleOrderNewOrders = dataOrder.filter(d => d.statusPesanan === 1).slice(currentIndexNewOrders, currentIndexNewOrders + 3);
  const visibleOrderKitchen = dataOrder.filter(d => d.statusPesanan === 2).slice(currentIndexKitchen, currentIndexKitchen + 3);
  const visibleOrderPayment = dataOrder.filter(d => d.statusPesanan === 3).slice(currentIndexPayment, currentIndexPayment + 3);

  const handlePrevClick = () => {
    if(tab === "neworders" && currentIndexNewOrders >= 3){ setCurrentIndexNewOrders(currentIndexNewOrders - 3) }
    if(tab === "kitchen" && currentIndexKitchen >= 3){ setCurrentIndexKitchen(currentIndexKitchen - 3) }
    if(tab === "payment" && currentIndexPayment >= 3){ setCurrentIndexPayment(currentIndexPayment - 3) }
  }

  const handleNextClick = () => {
    if(tab === "neworders" && currentIndexNewOrders + 3 < dataOrder.filter(d => d.statusPesanan === 1).length){ setCurrentIndexNewOrders(currentIndexNewOrders + 3) }
    if(tab === "kitchen" && currentIndexKitchen + 3 < dataOrder.filter(d => d.statusPesanan === 2).length){ setCurrentIndexKitchen(currentIndexKitchen + 3) }
    if(tab === "payment" && currentIndexPayment + 3 < dataOrder.filter(d => d.statusPesanan === 3).length){ setCurrentIndexPayment(currentIndexPayment + 3) }
  }

  if (status === "authenticated") {
    if(!dataOrder){
      return <h1>LOADING</h1>
    }
  
    return(
      <>
        <div className={styles.navbar}>
          <button onClick={() => setTab("neworders")} className={tab === "neworders" ? styles.selected : 'false'}>New Orders</button>
          <button onClick={() => setTab("kitchen")} className={tab === "kitchen" ? styles.selected : 'false'}>In the Kitchen</button>
          <button onClick={() => setTab("payment")} className={tab === "payment" ? styles.selected : 'false'}>Waiting for Payment</button>
        </div>

        {tab === "neworders" && 
          <>
            {visibleOrderNewOrders.length > 0 && 
            <div className={styles.buttoncarousel}>
              <button className='btn-primary' onClick={handlePrevClick}>&#60;</button>
              <label>Page {currentIndexNewOrders + 1}/{Math.ceil(dataOrder.filter(d => d.statusPesanan === 1).length/3)}</label>
              <button className='btn-primary' onClick={handleNextClick}>&#62;</button>
            </div>}

            <div className={styles.container}>
              {
                visibleOrderNewOrders.length > 0 ?
                  visibleOrderNewOrders.map(
                    (d, index) => <PendingOrderCard key={d.idPesanan} d={d} dataMenu={dataMenu} status={1} notifyKitchen={notifyKitchen} idAdmin={session.idAdmin} notifyTable={notifyTable} index={index} setPrint={setPrint}></PendingOrderCard>
                  )
                : <p>No Order</p>
              }
            </div>
          </>
        }
        {tab === "kitchen" &&
          <>
            {visibleOrderKitchen.length > 0 && 
            <div className={styles.buttoncarousel}>
              <button className='btn-primary' onClick={handlePrevClick}>&#60;</button>
              <label>Page {currentIndexKitchen === 0 ? currentIndexKitchen + 1 : currentIndexKitchen/3 + 1}/{Math.ceil(dataOrder.filter(d => d.statusPesanan === 2).length/3)}</label>
              <button className='btn-primary' onClick={handleNextClick}>&#62;</button>
            </div>}
            <div className={styles.container}>
              {
                visibleOrderKitchen.length > 0 ?
                  visibleOrderKitchen.map(
                    (d,index) =>  
                      <div key={d.idPesanan} className={print[index] == 1 ? styles.printarea : styles.dontprint}>
                        <PendingOrderCard key={`${d.idPesanan},${d.isiPesanan.length}`} d={d} dataMenu={dataMenu} status={2} notifyKitchen={notifyKitchen} idAdmin={session.idAdmin} notifyTable={notifyTable} index={index} setPrint={setPrint} printOrder={printOrder}></PendingOrderCard>
                      </div>
                  )
                : <p>No Order</p>
              }
            </div>

            
          </>
        }

        {tab === "payment" &&
          <>
            {visibleOrderPayment.length > 0 && 
            <div className={styles.buttoncarousel}>
              <button className='btn-primary' onClick={handlePrevClick}>&#60;</button>
              <label>Page {currentIndexPayment + 1}/{Math.ceil(dataOrder.filter(d => d.statusPesanan === 3).length/3)}</label>
              <button className='btn-primary' onClick={handleNextClick}>&#62;</button>
            </div>}

            <div className={styles.container}>
              {
                visibleOrderPayment.length > 0 ?
                  visibleOrderPayment.map(
                    (d,index) => 
                    <div key={d.idPesanan} className={print[index] == 1 ? styles.printarea : styles.dontprint}>
                      <PendingOrderCard key={d.idPesanan} d={d} dataMenu={dataMenu} status={3} notifyKitchen={notifyKitchen} idAdmin={session.idAdmin} notifyTable={notifyTable} index={index} setPrint={setPrint} printOrder={printOrder}></PendingOrderCard>
                    </div>
                  )
                : <p>No Order</p>
              }
            </div>
          </>
        }
      </>
    )
  }
}

export async function getServerSideProps(){

  const queryMenu = `SELECT * FROM "Menu"`
  const queryPaket = `SELECT "Menu"."idMenu", "TerdiriMenu"."isiMenu", "TerdiriMenu"."jumlah" FROM "Menu" INNER JOIN "TerdiriMenu" ON "Menu"."idMenu" = "TerdiriMenu"."idMenu"`
  //queryOrder terurut berdasarkan status, kemudian jumlah
  const queryOrder = `SELECT "Pesanan"."idPesanan", "Pesanan"."uuid", "Pesanan"."statusPesanan", "Pesanan"."jam", "Pesanan"."idMeja", "Pesanan"."selesai", "TerdiriPesanan"."isiPesanan", "TerdiriPesanan"."jumlah", "TerdiriPesanan"."status", "TerdiriPesanan"."delivered", "TerdiriPesanan"."requestcancel" FROM "Pesanan" LEFT JOIN "TerdiriPesanan" ON "Pesanan"."idPesanan" = "TerdiriPesanan"."idPesanan" WHERE "selesai" = 0 ORDER BY "TerdiriPesanan"."status", "TerdiriPesanan"."jumlah", "TerdiriPesanan"."isiPesanan"`
  const queryOrderTambahan = `SELECT "Pesanan"."idPesanan", "Pesanan"."statusPesanan", "Pesanan"."jam", "Pesanan"."idMeja", "Pesanan"."selesai", "PesananTambahan"."isiPesanan", "PesananTambahan"."jumlah" FROM "Pesanan" INNER JOIN "PesananTambahan" ON "Pesanan"."idPesanan" = "PesananTambahan"."idPesanan" ORDER BY "PesananTambahan"."isiPesanan" ASC`

  const resMenu = await conn.query(queryMenu)
  const resPaket = await conn.query(queryPaket)

  const dataMenu = resMenu.rows
  const dataPaket = resPaket.rows

  for(let i = 0; i < dataMenu.length; i++){
    dataMenu[i].isiMenu = []
    dataMenu[i].jumlahMenu = []
  }

  dataMenu.sort((a,b) => a.idMenu - b.idMenu)

  for(let i = 0; i < dataPaket.length; i++){
    dataMenu[dataPaket[i].idMenu - 1].isiMenu.push(dataPaket[i].isiMenu)
    dataMenu[dataPaket[i].idMenu - 1].jumlahMenu.push(dataPaket[i].jumlah)
  }

  const resOrder = await conn.query(queryOrder)
  const resOrderTambahan = await conn.query(queryOrderTambahan)

  const dataOrder = resOrder.rows
  const dataOrder2 = resOrderTambahan.rows
  dataOrder2.map(d => {
    d.status = 3
    d.delivered = 0
  })
  const dataO = dataOrder.concat(dataOrder2)

  return{
    props:{
      dataMenu,
      dataO,      
    }
  }
}

OrderQueue.getLayout = function getLayout(page) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}