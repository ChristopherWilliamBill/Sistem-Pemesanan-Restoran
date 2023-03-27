import styles from '../../styles/Admin.module.css'
import Layout from '../../component/layout'
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import NavBar from '../../component/navbar';
import {conn} from '../../module/pg.js';

export default function Admin({dataTopMenu, dataAllTimeRevenue, dataDailyRevenue, dataMeja, dataJumlahOrder, dataJumlahDailyOrder, dataTotalThisWeek, dataTotalLastWeek, dataTotalThisMonth, dataTotalLastMonth}){

  const { data: session, status } = useSession()
  const today = new Date().toLocaleDateString('en-CA')


  const router = useRouter()

  const calculateDifference = (current, previous) => {    
    if(current === 0 || previous === 0){
      return '-'
    }

    let diff = (((current/previous) - 1) * 100).toFixed(2)
    if(diff > 0){
      diff = '+' + diff
    }
    return diff
  }

  const dailyDifference = calculateDifference(parseInt(dataDailyRevenue[dataDailyRevenue.length - 1].total), parseInt(dataDailyRevenue[dataDailyRevenue.length - 2].total))
  const weeklyDifference = calculateDifference(parseInt(dataTotalThisWeek[0].total), parseInt(dataTotalLastWeek[0].total))
  const monthlyDifference = calculateDifference(parseInt(dataTotalThisMonth[0].total), parseInt(dataTotalLastMonth[0].total))

  return(
    <div className={styles.container}>
      <h3>Dashboard</h3>
      <div className={styles.cardcontainer}>
        <div className={styles.bestsellingcard}>
          Best selling menu:
          <h3>{dataTopMenu[0].namaMenu} x {dataTopMenu[0].jumlah}</h3>
        </div>

        <div className={styles.bestsellingcard}>
          Worst selling menu:
          <h3>{dataTopMenu[dataTopMenu.length - 1].namaMenu} x {dataTopMenu[dataTopMenu.length - 1].jumlah}</h3>
        </div>

        <div className={styles.bestsellingcard}>
          All time total order:
          <h3>{dataJumlahOrder[0].total}</h3>
        </div>

        <div className={styles.bestsellingcard}>
          Daily total order:
          <h3>{dataJumlahDailyOrder[0].total}</h3>
        </div>

        <div className={styles.bestsellingcard}>
          All time revenue:
          <h3>IDR {parseInt(dataAllTimeRevenue[0].total).toLocaleString()}</h3>
        </div>

        <div className={styles.bestsellingcard}>
          Daily revenue:
          <div className={styles.performance}>
            <h3>IDR {parseInt(dataDailyRevenue[dataDailyRevenue.length - 1].total).toLocaleString()}</h3>
            <h3 className={dailyDifference < 0 ? styles.negative : styles.positive}>{dailyDifference} %</h3>
          </div>
        </div>

        <div className={styles.bestsellingcard}>
          Weekly revenue:
          <div className={styles.performance}>
            <h3>IDR {parseInt(dataTotalThisWeek[0].total).toLocaleString()}</h3>
            <h3 className={monthlyDifference < 0 ? styles.negative : styles.positive}>{weeklyDifference} %</h3>
          </div>
        </div>

        <div className={styles.bestsellingcard}>
          Monthly revenue:
          <div className={styles.performance}>
            <h3>IDR {parseInt(dataTotalThisMonth[0].total).toLocaleString()}</h3>
            <h3 className={monthlyDifference < 0 ? styles.negative : styles.positive}>{monthlyDifference} %</h3>
          </div>
        </div>
      </div>
      
      {/* {<p>{new Date().toLocaleString()}</p>} */}
      <h3>Menu performance: donut chart</h3>
      <h3>All Time Revenue: IDR {parseInt(dataAllTimeRevenue[0].total).toLocaleString()}</h3>
      <h3>Total Order: 100</h3>
      <h3>Daily Order: 12</h3>
      <h3>Daily revenue: {dataDailyRevenue[0].total}</h3>
      <h3>Daily performance: +5%</h3>
      <h3>Occupied Table: {dataMeja.length > 0 && dataMeja[0].idMeja}</h3>
    </div>
  )
}

export async function getServerSideProps(){
  const today = new Date().toLocaleDateString('en-CA')

  const queryTopMenu = `SELECT "TerdiriPesanan"."isiPesanan", "Menu"."namaMenu", COUNT("TerdiriPesanan"."isiPesanan") AS "jumlah" FROM "TerdiriPesanan" INNER JOIN "Menu" ON "Menu"."idMenu" = "TerdiriPesanan"."isiPesanan" GROUP BY "TerdiriPesanan"."isiPesanan", "Menu"."namaMenu" ORDER BY "jumlah" DESC`
  const queryAllTimeRevenue = `SELECT SUM("total") AS "total" FROM "Transaksi"`
  const queryDailyRevenue = `SELECT "Transaksi"."tanggal", SUM("total") AS "total" FROM "Transaksi" GROUP BY "Transaksi"."tanggal" ORDER BY "Transaksi"."tanggal" ASC`
  const queryMeja = `SELECT "idMeja" FROM "Pesanan" WHERE "selesai" = 0`
  const queryJumlahOrder = `SELECT COUNT("Pesanan"."idPesanan") AS "total" FROM "Pesanan" WHERE "statusPesanan" = 4`
  const queryJumlahDailyOrder = `SELECT COUNT("Pesanan"."idPesanan") AS "total" FROM "Pesanan" WHERE "statusPesanan" = 4 AND "tanggal" = '${today}'`
  const queryTotalThisWeek = `SELECT SUM("total") AS "total" FROM "Transaksi" WHERE "tanggal" < NOW() AND "tanggal" > NOW() - interval '7 day'`
  const queryTotalLastWeek = `SELECT SUM("total") AS "total" FROM "Transaksi" WHERE "tanggal" < NOW() - interval '7 day' AND "tanggal" > NOW() - interval '14 day'`
  const queryTotalThisMonth = `SELECT SUM("total") AS "total" FROM "Transaksi" WHERE "tanggal" < NOW() AND "tanggal" > NOW() - interval '1 month'`
  const queryTotalLastMonth = `SELECT SUM("total") AS "total" FROM "Transaksi" WHERE "tanggal" < NOW() - interval '1 month' AND "tanggal" > NOW() - interval '2 month'`

  const resTopMenu = await conn.query(queryTopMenu)
  const resAllTimeRevenue = await conn.query(queryAllTimeRevenue)
  const resDailyRevenue = await conn.query(queryDailyRevenue)
  const resMeja = await conn.query(queryMeja)
  const resJumlahOrder = await conn.query(queryJumlahOrder)
  const resJumlahDailyOrder = await conn.query(queryJumlahDailyOrder)
  const resTotalLastWeek = await conn.query(queryTotalLastWeek)
  const resTotalThisWeek = await conn.query(queryTotalThisWeek)
  const resTotalLastMonth = await conn.query(queryTotalLastMonth)
  const resTotalThisMonth = await conn.query(queryTotalThisMonth)

  const dataTopMenu = resTopMenu.rows
  const dataAllTimeRevenue = resAllTimeRevenue.rows
  const dataDailyRevenue = resDailyRevenue.rows
  const dataMeja = resMeja.rows
  const dataJumlahOrder = resJumlahOrder.rows
  const dataJumlahDailyOrder = resJumlahDailyOrder.rows

  let dataTotalLastMonth = [{total: 0}]
  if(resTotalLastMonth.rows[0].total !== null){
    dataTotalLastMonth = resTotalLastMonth.rows
  }

  let dataTotalThisMonth = [{total: 0}]
  if(resTotalThisMonth.rows[0].total !== null){
    dataTotalThisMonth = resTotalThisMonth.rows
  }

  let dataTotalLastWeek = [{total: 0}]
  if(resTotalLastWeek.rows[0].total !== null){
    dataTotalLastWeek = resTotalLastWeek.rows
  }

  let dataTotalThisWeek = [{total: 0}]
  if(resTotalThisWeek.rows[0].total !== null){
    dataTotalThisWeek = resTotalThisWeek.rows
  }

  dataDailyRevenue.map(d => d.tanggal = String(d.tanggal))

  console.log(dataTotalLastWeek)

  return{
    props:{
      dataTopMenu,
      dataAllTimeRevenue,
      dataDailyRevenue,
      dataMeja,
      dataJumlahOrder,
      dataJumlahDailyOrder,
      dataTotalThisWeek,
      dataTotalLastWeek,
      dataTotalThisMonth,
      dataTotalLastMonth
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
