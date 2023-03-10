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

  const order = dataO.reduce((order, {idPesanan, isiPesanan, jumlah, statusPesanan, jam, idMeja, status, delivered}) => {
    if(!order[idPesanan -1]){
      order[idPesanan -1] = {idPesanan: idPesanan, isiPesanan: [], jumlah: [], status: [], isiPaket: [], delivered: []}
    }
    //order[idPesanan] ??= {idPesanan: idPesanan, isiPesanan: "", jumlah: []}; // ??= --> logical nullish assignment

    order[idPesanan - 1].isiPesanan.push(isiPesanan)
    order[idPesanan - 1].jumlah.push(jumlah)
    order[idPesanan - 1].statusPesanan = statusPesanan
    order[idPesanan - 1].jam = jam
    order[idPesanan - 1].idMeja = idMeja
    order[idPesanan - 1].status.push(status)
    order[idPesanan - 1].delivered.push(delivered)

    return order;
  }, []);

  //loop setiap order
  order.map(o => {
    o.isiPesanan.map( isi => { //lihat setiap isi pesanannya
      dataMenu[isi - 1].isiMenu.length > 0 ? //kalau isi pesanannya punya isi menu lagi (artinya pesanan ini = paket)
        o.isiPaket.push(dataMenu[isi - 1].isiMenu) //array isiPaket diisi array isiMenu (daftar menu dari paketnya)
      : o.isiPaket.push(0) //kalau tidak, isi angka 0 (artinya bukan paket)
    })
  })

  const [dataOrder, setDataOrder] = useState(order)
  const [tab, setTab] = useState("pesananbaru")
  const [print, setPrint] = useState(1)
  
  const socketInitializer = async () => {
    await fetch('/api/socket')
    socket = io()

    socket.on('connect', () => {
      console.log('connected')
    })

    socket.on('sendorders', (msg) => {
      setDataOrder(order)
    })
  }

  const notifyTable = async (msg) => {
    socket.emit('handleorder', msg)
  }

  const notifyKitchen = async () => {
    socket.emit('notify-kitchen', 'new-order')
  }

  useEffect(() => {socketInitializer()}, [])

  if (status === "authenticated") {

    if(!dataOrder){
      return <h1>LOADING</h1>
    }
  
    return(
      <>
      {console.log(dataOrder)}
        <div className={styles.navbar}>
          <button onClick={() => setTab("pesananbaru")}>New Orders</button>
          <button onClick={() => setTab("diproses")}>In the Kitchen</button>
          <button onClick={() => setTab("pembayaran")}>Waiting for Payment</button>
        </div>

        {tab === "pesananbaru" ? 
          <>
            <h2 className={styles.category}>New Orders</h2>
            <div className={styles.container}>
              {
                dataOrder.filter(d => d.statusPesanan == 1).length > 0 ?
                  dataOrder.filter(d => d.statusPesanan == 1).map(
                    d => <PendingOrderCard d={d} dataMenu={dataMenu} status={1} notifyKitchen={notifyKitchen} idAdmin={session.idAdmin} notifyTable={notifyTable} print={print} setPrint={setPrint}></PendingOrderCard>
                  )
                : <p>No Order</p>
              }
            </div>
          </>
          : null
        }
        {tab === "diproses" ?
          <>
            <h2 className={styles.category}>In the Kitchen</h2>
            <div className={styles.container}>
              {
                dataOrder.filter(d => d.statusPesanan == 2).length > 0 ?
                  dataOrder.filter(d => d.statusPesanan == 2).map(
                    d => <PendingOrderCard d={d} dataMenu={dataMenu} status={2} notifyKitchen={notifyKitchen} idAdmin={session.idAdmin} notifyTable={notifyTable} print={print} setPrint={setPrint}></PendingOrderCard>
                  )
                : <p>No Order</p>
              }
            </div>
          </>
          : null
        }

        {tab === "pembayaran" ?
          <>
            <h2 className={styles.category}>Waiting for Payment</h2>
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
          : null
        }
      </>
    )
  }
}

export async function getServerSideProps(){

  const queryMenu = `SELECT * FROM "Menu"`
  const queryPaket = `SELECT "Menu"."idMenu", "TerdiriMenu"."isiMenu" FROM "Menu" INNER JOIN "TerdiriMenu" ON "Menu"."idMenu" = "TerdiriMenu"."idMenu"`
  const queryOrder = `SELECT "Pesanan"."idPesanan", "Pesanan"."statusPesanan", "Pesanan"."jam", "Pesanan"."idMeja", "Pesanan"."selesai", "TerdiriPesanan"."isiPesanan", "TerdiriPesanan"."jumlah", "TerdiriPesanan"."status", "TerdiriPesanan"."delivered" FROM "Pesanan" INNER JOIN "TerdiriPesanan" ON "Pesanan"."idPesanan" = "TerdiriPesanan"."idPesanan" ORDER BY "TerdiriPesanan"."isiPesanan" ASC`
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