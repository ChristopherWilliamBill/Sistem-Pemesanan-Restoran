import styles from '../../styles/Admin.module.css'
import Layout from '../../component/layout'
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import NavBar from '../../component/navbar';
import io from 'socket.io-client'
import {conn} from '../../module/pg.js';
import { useEffect } from 'react';
import { useState } from 'react';
import LineChart from '../../component/linechart';
import BarChart from '../../component/barchart';

let socket = null

export default function Admin({dataTopMenu, dataTopMenuMonthly, dataTopMenuWeekly, dataAllTimeRevenue, dataDailyRevenue, dataDailyRevenueMonthly, dataDailyRevenueWeekly, dataOccupied, dataMeja, dataJumlahOrder, dataJumlahDailyOrder, dataTotalToday, dataTotalYesterday, dataTotalThisWeek, dataTotalLastWeek, dataTotalThisMonth, dataTotalLastMonth}){

  const { data: session, status } = useSession()
  const [occupied, setOccupied] = useState(dataOccupied)
  const [meja, setMeja] = useState(dataMeja)
  const [timeFrameMenu, setTimeFrameMenu] = useState('All time')
  const [timeFrameRevenue, setTimeFrameRevenue] = useState('All time')

  const socketInitializer = async () => {
    await fetch('/api/socket')
    socket = io()

    socket.on('connect', () => {
      console.log('connected')
    })

    socket.on('occupied', (msg) => {
      setOccupied(occupied => [...occupied, {idMeja: parseInt(msg)}])
    })

    socket.on('notifyhelp', (msg) => {
      console.log(msg)
      setMeja(meja => [...meja].map(m => {
        if(m.idMeja === parseInt(msg.idMeja)){
          return {
            ...m,
            help: msg.help
          }
        }
        else return m
      }))
    })
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

  const router = useRouter()

  const calculateDifference = (current, previous) => {  
    if(current === 0 || previous === 0){
      return '-'
    }

    let diff = (((current/previous) - 1) * 100).toFixed(2)
    if(isNaN(diff)){
      return '-'
    }
    return diff
  }

  const dailyDifference = calculateDifference(parseInt(dataTotalToday[0].total), parseInt(dataTotalYesterday[0].total))
  const weeklyDifference = calculateDifference(parseInt(dataTotalThisWeek[0].total), parseInt(dataTotalLastWeek[0].total))
  const monthlyDifference = calculateDifference(parseInt(dataTotalThisMonth[0].total), parseInt(dataTotalLastMonth[0].total))

  const exportCSV = (tipe) => {
    let data
    let filename

    if(tipe === 'menu'){
      if(timeFrameMenu === 'All time'){
        data = dataTopMenu
        filename = 'alltimemenu'
      }else if(timeFrameMenu === 'Monthly'){
        data = dataTopMenuMonthly
        filename = 'monthlymenu'
      }else if(timeFrameMenu === 'Weekly'){
        data = dataTopMenuWeekly
        filename = 'weeklymenu'
      }
    }

    if(tipe === 'revenue'){
      if(timeFrameRevenue === 'All time'){
        data = dataDailyRevenue
        filename = 'alltimerevenue'
      }else if(timeFrameRevenue === 'Monthly'){
        data = dataDailyRevenueMonthly
        filename = 'monthlyrevenue'
      }else if(timeFrameRevenue === 'Weekly'){
        data = dataDailyRevenueWeekly
        filename = 'weeklyrevenue'
      }
    }


    let header = Object.keys(data[0]).join(',');
    let csvRows = data.map(row => {
      return Object.values(row).join(',');
    });
    csvRows.unshift(header);
    let csvString = csvRows.join('\n');
    
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return(
    <div className={styles.container}>
      <h3>Dashboard</h3>
      <div className={styles.cardcontainer}>
        <div className={styles.card}>
          Best selling menu:
          <div className={styles.performance}>
            <h3>{dataTopMenu[0].namaMenu}</h3> 
            <h3> x {dataTopMenu[0].jumlah}</h3>
          </div>
        </div>

        <div className={styles.card}>
          Worst selling menu:
          <div className={styles.performance}>
            <h3>{dataTopMenu[dataTopMenu.length - 1].namaMenu} </h3>
            <h3> x {dataTopMenu[dataTopMenu.length - 1].jumlah}</h3>
          </div>
        </div>

        <div className={styles.card}>
          All time total order:
          <h3>{dataJumlahOrder[0].total}</h3>
        </div>

        <div className={styles.card}>
          Daily total order:
          <h3>{dataJumlahDailyOrder[0].total}</h3>
        </div>

        {session.role === "manager" && 
        <>
          <div className={styles.card}>
            All time revenue:
            <h3>IDR {parseInt(dataAllTimeRevenue[0].total).toLocaleString()}</h3>
          </div>

          <div className={styles.card}>
            Daily revenue:
            <div className={styles.performance}>
              <h3>IDR {parseInt(dataTotalToday[0].total).toLocaleString()}</h3>
              <h3 className={dailyDifference < 0 ? styles.negative : styles.positive}>{dailyDifference > 0 ? '+' + dailyDifference : dailyDifference} %</h3>
            </div>
          </div>

          <div className={styles.card}>
            Weekly revenue:
            <div className={styles.performance}>
              <h3>IDR {parseInt(dataTotalThisWeek[0].total).toLocaleString()}</h3>
              <h3 className={weeklyDifference < 0 ? styles.negative : styles.positive}>{weeklyDifference > 0 ? '+' + weeklyDifference : weeklyDifference} %</h3>
            </div>
          </div>

          <div className={styles.card}>
            Monthly revenue:
            <div className={styles.performance}>
              <h3>IDR {parseInt(dataTotalThisMonth[0].total).toLocaleString()}</h3>
              {console.log(monthlyDifference)}
              <h3 className={monthlyDifference < 0 ? styles.negative : styles.positive}>{monthlyDifference > 0 ? '+' + monthlyDifference : monthlyDifference} %</h3>
            </div>
          </div>
        </>
        }
        
      </div>

      <div className={styles.bigcard}>
        <div className={styles.occupiedtable}>
          {meja.map(m => occupied.some(o => o.idMeja === m.idMeja) ? 
            <p key={m.idMeja} className={styles.occupied}>Table {m.idMeja} <b>{m.help === 1 && 'help'}</b> <b>order on-going</b> </p> 
            : <p key={m.idMeja}>Table {m.idMeja} <b>{m.help === 1 && 'help'}</b> <b>idle</b> </p>)}
        </div>

        <div className={styles.menuperformance}>
          <div className={styles.switchtimeframe}>
            <h3>{timeFrameMenu} menu sales:</h3> 
            <div>
              <button className='btn-primary' onClick={() => setTimeFrameMenu('All time') }>All time</button>
              <button className='btn-primary' onClick={() => setTimeFrameMenu('Monthly')}>Monthly</button>
              <button className='btn-primary' onClick={() => setTimeFrameMenu('Weekly')}>Weekly</button>
              <button className='btn-primary' onClick={() => exportCSV('menu')}>Export to .csv</button>
            </div>
          </div>
          {timeFrameMenu === 'All time' && <BarChart dataTopMenu={dataTopMenu}></BarChart>}
          {timeFrameMenu === 'Monthly' && <BarChart dataTopMenu={dataTopMenuMonthly}></BarChart>}
          {timeFrameMenu === 'Weekly' && <BarChart dataTopMenu={dataTopMenuWeekly}></BarChart>}
        </div>
      </div>
          
      {session.role === "manager" && 
        <div className={styles.incomechart}>
          <div className={styles.switchtimeframe}>
            <h3>{timeFrameRevenue} revenue:</h3>
            <div>
                <button className='btn-primary' onClick={() => setTimeFrameRevenue('All time') }>All time</button>
                <button className='btn-primary' onClick={() => setTimeFrameRevenue('Monthly')}>Monthly</button>
                <button className='btn-primary' onClick={() => setTimeFrameRevenue('Weekly')}>Weekly</button>
                <button className='btn-primary' onClick={() => exportCSV('revenue')}>Export to .csv</button>
            </div>
          </div>
          {timeFrameRevenue === 'All time' && <LineChart dataDailyRevenue={dataDailyRevenue}></LineChart>}
          {timeFrameRevenue === 'Monthly' && <LineChart dataDailyRevenue={dataDailyRevenueMonthly}></LineChart>}
          {timeFrameRevenue === 'Weekly' && <LineChart dataDailyRevenue={dataDailyRevenueWeekly}></LineChart>}
        </div>
      }
    </div>
  )
}

export async function getServerSideProps(){
  const today = new Date().toLocaleDateString('en-CA')
  const queryTopMenu = `SELECT "TerdiriPesanan"."isiPesanan", "Menu"."namaMenu", COUNT("TerdiriPesanan"."isiPesanan") AS "jumlah" FROM "TerdiriPesanan" INNER JOIN "Menu" ON "Menu"."idMenu" = "TerdiriPesanan"."isiPesanan" GROUP BY "TerdiriPesanan"."isiPesanan", "Menu"."namaMenu" ORDER BY "jumlah" DESC`
  const queryTopMenuMonthly = `SELECT "TerdiriPesanan"."isiPesanan", "Menu"."namaMenu", COUNT("TerdiriPesanan"."isiPesanan") AS "jumlah" FROM "TerdiriPesanan" INNER JOIN "Menu" ON "Menu"."idMenu" = "TerdiriPesanan"."isiPesanan" INNER JOIN "Pesanan" ON "Pesanan"."idPesanan" = "TerdiriPesanan"."idPesanan" WHERE "Pesanan"."tanggal" < NOW() AND "Pesanan"."tanggal" > NOW() - interval '1 month' GROUP BY "TerdiriPesanan"."isiPesanan", "Menu"."namaMenu" ORDER BY "jumlah" DESC`
  const queryTopMenuWeekly = `SELECT "TerdiriPesanan"."isiPesanan", "Menu"."namaMenu", COUNT("TerdiriPesanan"."isiPesanan") AS "jumlah" FROM "TerdiriPesanan" INNER JOIN "Menu" ON "Menu"."idMenu" = "TerdiriPesanan"."isiPesanan" INNER JOIN "Pesanan" ON "Pesanan"."idPesanan" = "TerdiriPesanan"."idPesanan" WHERE "Pesanan"."tanggal" < NOW() AND "Pesanan"."tanggal" > NOW() - interval '7 day' GROUP BY "TerdiriPesanan"."isiPesanan", "Menu"."namaMenu" ORDER BY "jumlah" DESC`
  const queryAllTimeRevenue = `SELECT SUM("total") AS "total" FROM "Transaksi"`
  const queryDailyRevenue = `SELECT "Transaksi"."tanggal", SUM("total") AS "total" FROM "Transaksi" GROUP BY "Transaksi"."tanggal" ORDER BY "Transaksi"."tanggal" ASC`
  const queryDailyRevenueMonthly = `SELECT "Transaksi"."tanggal", SUM("total") AS "total" FROM "Transaksi" WHERE "Transaksi"."tanggal" < NOW() AND "Transaksi"."tanggal" > NOW() - interval '1 month' GROUP BY "Transaksi"."tanggal" ORDER BY "Transaksi"."tanggal" ASC`
  const queryDailyRevenueWeekly = `SELECT "Transaksi"."tanggal", SUM("total") AS "total" FROM "Transaksi" WHERE "Transaksi"."tanggal" < NOW() AND "Transaksi"."tanggal" > NOW() - interval '7 day' GROUP BY "Transaksi"."tanggal" ORDER BY "Transaksi"."tanggal" ASC`
  const queryOccupied = `SELECT "idMeja" FROM "Pesanan" WHERE "selesai" = 0`
  const queryMeja = `SELECT "idMeja", "help" FROM "Meja" ORDER BY "idMeja" ASC`
  const queryJumlahOrder = `SELECT COUNT("Pesanan"."idPesanan") AS "total" FROM "Pesanan" WHERE "statusPesanan" = 4`
  const queryJumlahDailyOrder = `SELECT COUNT("Pesanan"."idPesanan") AS "total" FROM "Pesanan" WHERE "statusPesanan" = 4 AND "tanggal" = '${today}'`
  const queryTotalToday = `SELECT SUM("total") AS "total" FROM "Transaksi" WHERE "tanggal" = '${today}'`
  const queryTotalYesterday = `SELECT SUM("total") AS "total" FROM "Transaksi" WHERE "tanggal" > NOW() - interval '2 day' AND "tanggal" < NOW() - interval '1 day'`
  const queryTotalThisWeek = `SELECT SUM("total") AS "total" FROM "Transaksi" WHERE "tanggal" < NOW() AND "tanggal" > NOW() - interval '7 day'`
  const queryTotalLastWeek = `SELECT SUM("total") AS "total" FROM "Transaksi" WHERE "tanggal" < NOW() - interval '7 day' AND "tanggal" > NOW() - interval '14 day'`
  const queryTotalThisMonth = `SELECT SUM("total") AS "total" FROM "Transaksi" WHERE "tanggal" < NOW() AND "tanggal" > NOW() - interval '1 month'`
  const queryTotalLastMonth = `SELECT SUM("total") AS "total" FROM "Transaksi" WHERE "tanggal" < NOW() - interval '1 month' AND "tanggal" > NOW() - interval '2 month'`

  const resTopMenu = await conn.query(queryTopMenu)
  const resTopMenuMonthly = await conn.query(queryTopMenuMonthly)
  const resTopMenuWeekly = await conn.query(queryTopMenuWeekly)
  const resAllTimeRevenue = await conn.query(queryAllTimeRevenue)
  const resDailyRevenue = await conn.query(queryDailyRevenue)
  const resDailyRevenueMonthly = await conn.query(queryDailyRevenueMonthly)
  const resDailyRevenueWeekly = await conn.query(queryDailyRevenueWeekly)
  const resOccupied = await conn.query(queryOccupied)
  const resMeja = await conn.query(queryMeja)
  const resJumlahOrder = await conn.query(queryJumlahOrder)
  const resJumlahDailyOrder = await conn.query(queryJumlahDailyOrder)
  const resTotalToday = await conn.query(queryTotalToday)
  const resTotalYesterday = await conn.query(queryTotalYesterday)
  const resTotalLastWeek = await conn.query(queryTotalLastWeek)
  const resTotalThisWeek = await conn.query(queryTotalThisWeek)
  const resTotalLastMonth = await conn.query(queryTotalLastMonth)
  const resTotalThisMonth = await conn.query(queryTotalThisMonth)

  const dataTopMenu = resTopMenu.rows
  const dataTopMenuMonthly = resTopMenuMonthly.rows
  const dataTopMenuWeekly = resTopMenuWeekly.rows
  const dataAllTimeRevenue = resAllTimeRevenue.rows
  const dataDailyRevenue = resDailyRevenue.rows
  const dataDailyRevenueMonthly = resDailyRevenueMonthly.rows
  const dataDailyRevenueWeekly = resDailyRevenueWeekly.rows
  const dataOccupied = resOccupied.rows
  const dataMeja = resMeja.rows
  const dataJumlahOrder = resJumlahOrder.rows
  const dataJumlahDailyOrder = resJumlahDailyOrder.rows

  let dataTotalToday = [{total: 0}]
  if(resTotalToday.rows[0].total !== null){
    dataTotalToday = resTotalToday.rows
  }

  let dataTotalYesterday = resTotalYesterday.rows
  if(resTotalYesterday.rows[0].total !== null){
    dataTotalYesterday = resTotalYesterday.rows
  }

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
  dataDailyRevenueMonthly.map(d => d.tanggal = String(d.tanggal))
  dataDailyRevenueWeekly.map(d => d.tanggal = String(d.tanggal))

  return{
    props:{
      dataTopMenu,
      dataTopMenuMonthly,
      dataTopMenuWeekly,
      dataAllTimeRevenue,
      dataDailyRevenue,
      dataDailyRevenueMonthly,
      dataDailyRevenueWeekly,
      dataOccupied,
      dataMeja,
      dataJumlahOrder,
      dataJumlahDailyOrder,
      dataTotalToday,
      dataTotalYesterday,
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
        <NavBar currentPath={'/admin'}></NavBar>
        {page}
      </div>
    </Layout>
  )
}
