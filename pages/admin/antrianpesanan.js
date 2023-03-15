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

  const order = dataO.reduce((order, {idPesanan, isiPesanan, jumlah, statusPesanan, jam, idMeja, status, delivered, requestcancel}) => {
    if(!order[idPesanan -1]){
      order[idPesanan -1] = {idPesanan: idPesanan, isiPesanan: [], jumlah: [], status: [], isiPaket: [], delivered: [], requestcancel: []}
    }
    //order[idPesanan] ??= {idPesanan: idPesanan, isiPesanan: "", jumlah: []}; // ??= --> logical nullish assignment

    order[idPesanan - 1].isiPesanan.push(isiPesanan)
    order[idPesanan - 1].jumlah.push(jumlah)
    order[idPesanan - 1].statusPesanan = statusPesanan
    order[idPesanan - 1].jam = jam
    order[idPesanan - 1].idMeja = idMeja
    order[idPesanan - 1].status.push(status)
    order[idPesanan - 1].delivered.push(delivered)
    order[idPesanan - 1].requestcancel.push(requestcancel)

    return order;
  }, []);

  //loop setiap order yang sudah difilter (bukan order yang dicancel)
  order.filter(or => or.status[0] != null).map(o => { 
    o.isiPesanan.map( isi => { //lihat setiap isi pesanannya
      dataMenu[isi - 1].isiMenu.length > 0 ? //kalau isi pesanannya punya isi menu lagi (artinya pesanan ini = paket)
        o.isiPaket.push(dataMenu[isi - 1].isiMenu) //array isiPaket diisi array isiMenu (daftar menu dari paketnya)
      : o.isiPaket.push(0) //kalau tidak, isi angka 0 (artinya bukan paket)
    })
  })
  
  const [dataOrder, setDataOrder] = useState(order)
  const [tab, setTab] = useState("neworders")
  const [print, setPrint] = useState(new Array(dataOrder.filter(d => d.statusPesanan == 2).length).fill(0))

  const printOrder = (index) => {
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
    })
  }

  const notifyTable = async (msg) => {
    socket.emit('handleorder', msg)
  }

  const notifyKitchen = async () => {
    socket.emit('notify-kitchen', 'kitchen')
  }

  useEffect(() => {socketInitializer()}, [])
  useEffect(() => setPrint(new Array(dataOrder.filter(d => d.statusPesanan == 2).length).fill(0)), [dataOrder])
  useEffect(() => {
    if(!print.every(p => p == 0)){
      window.print()
      setPrint(new Array(dataOrder.filter(d => d.statusPesanan == 2).length).fill(0))
    }
  }, [print])


  if (status === "authenticated") {

    if(!dataOrder){
      return <h1>LOADING</h1>
    }
  
    return(
      <>
        <div className={styles.navbar}>
          <button onClick={() => setTab("neworders")} className={tab === "neworders" && styles.selected}>New Orders</button>
          <button onClick={() => setTab("kitchen")} className={tab === "kitchen" && styles.selected}>In the Kitchen</button>
          <button onClick={() => setTab("payment")} className={tab === "payment" && styles.selected}>Waiting for Payment</button>
        </div>

        {tab === "neworders" && 
          <>
            <div className={styles.container}>
              {
                dataOrder.filter(d => d.statusPesanan == 1).length > 0 ?
                  dataOrder.filter(d => d.statusPesanan == 1).map(
                    (d, index) => (<PendingOrderCard d={d} dataMenu={dataMenu} status={1} notifyKitchen={notifyKitchen} idAdmin={session.idAdmin} notifyTable={notifyTable} index={index} setPrint={setPrint}></PendingOrderCard>)
                  )
                : <p>No Order</p>
              }
            </div>
          </>
        }
        {tab === "kitchen" &&
          <>
            <div className={styles.container}>
              {
                dataOrder.filter(d => d.statusPesanan == 2).length > 0 ?
                  dataOrder.filter(d => d.statusPesanan == 2).map(
                    (d,index) =>  
                      <div className={print[index] == 1 ? styles.printarea : styles.dontprint}>
                        <PendingOrderCard d={d} dataMenu={dataMenu} status={2} notifyKitchen={notifyKitchen} idAdmin={session.idAdmin} notifyTable={notifyTable} index={index} setPrint={setPrint} printOrder={printOrder}></PendingOrderCard>
                      </div>
                  )
                : <p>No Order</p>
              }
            </div>
          </>
        }

        {tab === "payment" &&
          <>
            <div className={styles.container}>
              {
                dataOrder.filter(d => d.statusPesanan == 3).length > 0 ?
                  dataOrder.filter(d => d.statusPesanan == 3).map(
                    d => <PendingOrderCard d={d} dataMenu={dataMenu} status={3} notifyKitchen={notifyKitchen} idAdmin={session.idAdmin} notifyTable={notifyTable} print={print} setPrint={setPrint}></PendingOrderCard>
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
  const queryPaket = `SELECT "Menu"."idMenu", "TerdiriMenu"."isiMenu" FROM "Menu" INNER JOIN "TerdiriMenu" ON "Menu"."idMenu" = "TerdiriMenu"."idMenu"`
  //queryOrder terurut berdasarkan status, kemudian jumlah
  const queryOrder = `SELECT "Pesanan"."idPesanan", "Pesanan"."statusPesanan", "Pesanan"."jam", "Pesanan"."idMeja", "Pesanan"."selesai", "TerdiriPesanan"."isiPesanan", "TerdiriPesanan"."jumlah", "TerdiriPesanan"."status", "TerdiriPesanan"."delivered", "TerdiriPesanan"."requestcancel" FROM "Pesanan" LEFT JOIN "TerdiriPesanan" ON "Pesanan"."idPesanan" = "TerdiriPesanan"."idPesanan" ORDER BY "TerdiriPesanan"."status", "TerdiriPesanan"."jumlah", "TerdiriPesanan"."isiPesanan"`
  const queryOrderTambahan = `SELECT "Pesanan"."idPesanan", "Pesanan"."statusPesanan", "Pesanan"."jam", "Pesanan"."idMeja", "Pesanan"."selesai", "PesananTambahan"."isiPesanan", "PesananTambahan"."jumlah", "PesananTambahan"."status", "PesananTambahan"."delivered" FROM "Pesanan" INNER JOIN "PesananTambahan" ON "Pesanan"."idPesanan" = "PesananTambahan"."idPesanan" ORDER BY "PesananTambahan"."isiPesanan" ASC`

  const resMenu = await conn.query(queryMenu)
  const resPaket = await conn.query(queryPaket)

  const dataMenu = resMenu.rows
  const dataPaket = resPaket.rows

  for(let i = 0; i < dataMenu.length; i++){
    dataMenu[i].isiMenu = []
  }

  dataMenu.sort((a,b) => a.idMenu - b.idMenu)

  for(let i = 0; i < dataPaket.length; i++){
    dataMenu[dataPaket[i].idMenu - 1].isiMenu.push(dataPaket[i].isiMenu)
  }

  const resOrder = await conn.query(queryOrder)
  const resOrderTambahan = await conn.query(queryOrderTambahan)

  const dataOrder = resOrder.rows
  const dataOrder2 = resOrderTambahan.rows

  const dataO = dataOrder.concat(dataOrder2)

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