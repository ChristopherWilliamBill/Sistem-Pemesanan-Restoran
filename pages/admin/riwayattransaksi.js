import Layout from '../../component/layout'
import {conn} from '../../lib/pg.js';
import styles from '../../styles/RiwayatTransaksi.module.css'
import { useState } from 'react';
import { useEffect } from 'react';

export default function RiwayatTransaksi({dataTransaksi, dataOrder, dataMenu, dataAdminFinish, dataAdminAccept}){

    const [fromDate, setFromDate] = useState()
    const [toDate, setToDate] = useState()
    const [showIsi, setShowIsi] = useState([])

    const handleChangeFrom = (e) => {
      setFromDate(new Date(e.target.value).toLocaleDateString('en-CA'))
    }

    const handleChangeTo = (e) => {
      setToDate(new Date(e.target.value).toLocaleDateString('en-CA'))
    }

    const handleClick = (idTransaksi) => {
      let temp = []
      temp = showIsi.slice()
      temp[temp.findIndex(t => t.idTransaksi === idTransaksi)].show = !temp[temp.findIndex(t => t.idTransaksi === idTransaksi)].show
      setShowIsi(temp)
    }

    useEffect(() => {
      if(dataTransaksi.length > 0){
        setFromDate(new Date(dataTransaksi[0].tanggal).toLocaleDateString('en-CA'))
        setToDate(new Date(dataTransaksi[dataTransaksi.length - 1].tanggal).toLocaleDateString('en-CA'))
        dataTransaksi.map(d => setShowIsi(
          showIsi => [...showIsi, {idTransaksi: d.idTransaksi, show: false}]
        ))
      }
    }, []);

    return(
        <>
          <div className={styles.container}>
            <h1>Transaction History</h1>
            {dataTransaksi.length > 0 ?
              <>
                <div className={styles.input}>
                  <div> From: <input type="date" value={fromDate} onChange={(e) => handleChangeFrom(e)}></input> </div>
                  <div> To: <input type="date" value={toDate} onChange={(e) => handleChangeTo(e)}></input> </div>
                </div>
                <table className={styles.table}>
                  <tr className={styles.header}>
                    <th>Date</th>
                    <th>Order ID</th>
                    <th>Total</th> 
                    <th>Table</th>
                  </tr>
                  {dataTransaksi.filter(
                    data => new Date(data.tanggal).toLocaleDateString('en-CA') >= fromDate && new Date(data.tanggal).toLocaleDateString('en-CA') <= toDate).map(d => 
                    <>
                      <tr className={styles.trtransaksi} onClick={() => handleClick(d.idTransaksi)}>
                        <td>{new Date(d.tanggal).toString().slice(0,15)}</td>
                        <td>{d.uuid}</td>
                        <td>Rp {d.total.toLocaleString()}</td>
                        <td>{d.idMeja}</td>
                      </tr>

                      {showIsi[showIsi.findIndex(s => s.idTransaksi === d.idTransaksi)].show && 
                        <td colspan={4} className={styles.animasi}>
                          <tr>
                            <th className={styles.isimenu}>Menu</th>
                            <th className={styles.isimenu}>Amount</th>
                            <th className={styles.isimenu}></th>
                            <th className={styles.isimenu}></th>
                          </tr>

                        {dataOrder.filter(dataO => dataO.idPesanan === d.idPesanan).map( d => 
                          <tr>
                            <td className={styles.isimenu}>{dataMenu[d.isiPesanan - 1].namaMenu}</td>
                            <td className={styles.isimenu}>{d.jumlah}</td>
                            <td className={styles.isimenu}></td>
                            <td className={styles.isimenu}></td>
                          </tr>
                        )}

                          <tr>
                            <th className={styles.isimenu}>Accepted by: {dataAdminAccept[dataAdminAccept.findIndex(da => da.idTransaksi == d.idTransaksi)].username}</th>
                            <th className={styles.isimenu}>At: {dataAdminAccept[dataAdminAccept.findIndex(da => da.idTransaksi == d.idTransaksi)].jam.split('.')[0]}</th>
                            <th className={styles.isimenu}>Finished by: {dataAdminFinish[dataAdminFinish.findIndex(da => da.idTransaksi == d.idTransaksi)].username}</th>
                            <th className={styles.isimenu}>At: {dataAdminFinish[dataAdminFinish.findIndex(da => da.idTransaksi == d.idTransaksi)].jam.split('.')[0]}</th>
                          </tr>
                        </td>
                      }
                    </>
                  )}
                  <tr>
                    <td className={styles.total} colSpan={4}>
                      Total: Rp {dataTransaksi.filter(
                      data => new Date(data.tanggal).toLocaleDateString('en-CA') >= fromDate && new Date(data.tanggal).toLocaleDateString('en-CA') <= toDate)
                      .reduce((total, i) => total + i.total, 0).toLocaleString()}
                    </td>
                  </tr>
                </table>
              </>
            : <p>No transaction yet</p>}
          </div>
        </>
    )
}

export async function getServerSideProps(){
  // terurut berdasarkan id dan tanggal
  const query = `SELECT "Transaksi"."idTransaksi", "Transaksi"."total", "Transaksi"."tanggal", "Transaksi"."idMeja", "Pesanan"."uuid", "Pesanan"."idPesanan" FROM "Transaksi" INNER JOIN "TerdiriTransaksi" ON "Transaksi"."idTransaksi" = "TerdiriTransaksi"."idTransaksi" INNER JOIN "Pesanan" ON "Pesanan"."idPesanan" = "TerdiriTransaksi"."idPesanan" WHERE "Pesanan"."statusPesanan" = 4 ORDER BY "Transaksi"."idTransaksi", "Transaksi"."tanggal"`
  const queryOrder = `SELECT * FROM "TerdiriPesanan" INNER JOIN "Pesanan" ON "TerdiriPesanan"."idPesanan" = "Pesanan"."idPesanan"`
  const queryMenu = `SELECT * FROM "Menu" ORDER BY "idMenu"`
  const queryAdminAccept = `SELECT * FROM "KelolaPesanan" INNER JOIN "TerdiriTransaksi" ON "KelolaPesanan"."idPesanan" = "TerdiriTransaksi"."idPesanan" INNER JOIN "Admin" ON "Admin"."idAdmin" = "KelolaPesanan"."idAdmin" WHERE "aksi" = 2`
  const queryAdminFinish = `SELECT * FROM "KelolaPesanan" INNER JOIN "TerdiriTransaksi" ON "KelolaPesanan"."idPesanan" = "TerdiriTransaksi"."idPesanan" INNER JOIN "Admin" ON "Admin"."idAdmin" = "KelolaPesanan"."idAdmin" WHERE "aksi" = 4`

  const result = await conn.query(query)
  const dataTransaksi = result.rows
  const resultOrder = await conn.query(queryOrder)
  const dataOrder = resultOrder.rows
  const resultMenu = await conn.query(queryMenu)
  const dataMenu = resultMenu.rows
  const resultAdminAccept = await conn.query(queryAdminAccept)
  const dataAdminAccept = resultAdminAccept.rows
  const resultAdminFinish = await conn.query(queryAdminFinish)
  const dataAdminFinish = resultAdminFinish.rows

  dataOrder.map(d => d.tanggal = d.tanggal.toString())

  dataTransaksi.map(d => d.tanggal = String(d.tanggal))
  console.log(dataOrder)

  return{
    props:{
      dataTransaksi,
      dataOrder,
      dataMenu,
      dataAdminFinish,
      dataAdminAccept
    }
  }
}

RiwayatTransaksi.getLayout = function getLayout(page) {
    return (
      <Layout>
        {page}
      </Layout>
    )
}