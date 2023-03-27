import styles from '../../styles/Admin.module.css'
import Layout from '../../component/layout'
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import NavBar from '../../component/navbar';
import {conn} from '../../module/pg.js';

export default function Admin({dataTopMenu, dataAllTimeRevenue, dataDailyRevenue, dataMeja}){

  const { data: session, status } = useSession()

  const router = useRouter()

  return(
    <div className={styles.container}>
      {<p>{new Date().toLocaleString()}</p>}
      <div className={styles.section}>
        <h3>Best Selling Menu: {dataTopMenu[0].namaMenu} {dataTopMenu[0].jumlah}</h3>
        <h3>Worst Selling Menu: {dataTopMenu[dataTopMenu.length - 1].namaMenu} {dataTopMenu[dataTopMenu.length - 1].jumlah}</h3>
        <h3>Menu performance: donut chart</h3>
        <h3>All Time Revenue: IDR {parseInt(dataAllTimeRevenue[0].total).toLocaleString()}</h3>
        <h3>Total Order: 100</h3>
        <h3>Daily Order: 12</h3>
        <h3>Daily revenue: {dataDailyRevenue[0].total}</h3>
        <h3>Daily performance: +5%</h3>
        <h3>Occupied Table: {dataMeja[0].idMeja}</h3>
      </div>
    </div>
  )
}

export async function getServerSideProps(){
  const queryTopMenu = `SELECT "TerdiriPesanan"."isiPesanan", "Menu"."namaMenu", COUNT("TerdiriPesanan"."isiPesanan") AS "jumlah" FROM "TerdiriPesanan" INNER JOIN "Menu" ON "Menu"."idMenu" = "TerdiriPesanan"."isiPesanan" GROUP BY "TerdiriPesanan"."isiPesanan", "Menu"."namaMenu" ORDER BY "jumlah" DESC`
  const queryAllTimeRevenue = `SELECT SUM("total") AS "total" FROM "Transaksi"`
  const queryDailyRevenue = `SELECT "Transaksi"."tanggal", SUM("total") AS "total" FROM "Transaksi" GROUP BY "Transaksi"."tanggal" ORDER BY "Transaksi"."tanggal" ASC`
  const queryMeja = `SELECT "idMeja" FROM "Pesanan" WHERE "selesai" = 0`

  const resTopMenu = await conn.query(queryTopMenu)
  const resAllTimeRevenue = await conn.query(queryAllTimeRevenue)
  const resDailyRevenue = await conn.query(queryDailyRevenue)
  const resMeja = await conn.query(queryMeja)

  const dataTopMenu = resTopMenu.rows
  const dataAllTimeRevenue = resAllTimeRevenue.rows
  const dataDailyRevenue = resDailyRevenue.rows
  const dataMeja = resMeja.rows

  dataDailyRevenue.map(d => d.tanggal = String(d.tanggal))

  return{
    props:{
      dataTopMenu,
      dataAllTimeRevenue,
      dataDailyRevenue,
      dataMeja
    }
  }
}

Admin.getLayout = function getLayout(page) {
  return (
    <Layout>
      <div className={styles.rootcontainer}>
        <NavBar key='admin' currentPath={'/admin'}></NavBar>
        {page}
      </div>
    </Layout>
  )
}
