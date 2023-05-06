import Layout from '../../component/layout'
import {conn} from '../../module/pg.js';
import styles from '../../styles/TransactionHistory.module.css'
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import React from 'react';
import NavBar from '../../component/navbar';

export default function TransactionHistory({dataTransaksi, dataOrder, dataMenu, dataAdminFinish, dataAdminAccept, show, dataCancel}){
    const { data: session, status } = useSession()
    const [fromDate, setFromDate] = useState((dataTransaksi.length > 0) && new Date(dataTransaksi[0].tanggal).toLocaleDateString('en-CA'))
    const [toDate, setToDate] = useState((dataTransaksi.length > 0) && new Date(dataTransaksi[dataTransaksi.length - 1].tanggal).toLocaleDateString('en-CA'))
    const [showIsi, setShowIsi] = useState(show)
    const [cancel, setCancel] = useState(false)

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

    return(
        <> 
          {session.role === "manager" ? 
          <div className={styles.container}>
            <h1>Transaction History</h1>
            <div className={styles.switch}>
                Show: 
                <label>
                  <input type="radio" name="switch" checked={!cancel} onChange={() => setCancel(!cancel)} />
                  Transaction
                </label>

                <label>
                  <input type="radio" name="switch" checked={cancel} onChange={() => setCancel(!cancel)} /> 
                  Cancelled Order
                </label>
            </div>

            {dataTransaksi.length > 0 ?
              <>
                <div className={styles.input}>
                  <div> From: <input type="date" value={fromDate} onChange={(e) => handleChangeFrom(e)}></input> </div>
                  <div> To: <input type="date" value={toDate} onChange={(e) => handleChangeTo(e)}></input> </div>
                </div>
                <button className='btn-primary' onClick={window.print}>Print</button>
                <table className={styles.table}>
                  <tbody>
                  {cancel ? 
                  <>
                    <tr className={styles.headercancel}>
                      <th colSpan={4}>Cancelled Order</th>
                    </tr>

                    <tr className={styles.cancel}>
                      <th>Date</th>
                      <th>Order ID</th>
                      <th>Cancelled By</th> 
                      <th>Table</th>
                    </tr>

                    {dataCancel.filter(data => new Date(data.tanggal).toLocaleDateString('en-CA') >= fromDate && new Date(data.tanggal).toLocaleDateString('en-CA') <= toDate).map(d => 
                      <React.Fragment key={d.uuid}>
                        <tr className={styles.trtransaksi}>
                          <td>{new Date(d.tanggal).toString().slice(0,15)}</td>
                          <td><p className={styles.uuid}>{d.uuid}</p></td>
                          <td>{d.aksi === 5 ? d.username : 'customer'}</td>
                          <td>{d.idMeja}</td>
                        </tr>
                      </React.Fragment>
                    )}
                  </>
                  : 
                  <>
                    <tr className={styles.header}>
                      <th>Date</th>
                      <th>Order ID</th>
                      <th>Total</th> 
                      <th>Table</th>
                    </tr>
                    {dataTransaksi.filter(
                      data => new Date(data.tanggal).toLocaleDateString('en-CA') >= fromDate && new Date(data.tanggal).toLocaleDateString('en-CA') <= toDate).map(d => 
                      <React.Fragment key={d.uuid}>
                        <tr className={styles.trtransaksi} onClick={() => handleClick(d.idTransaksi)}>
                          <td>{new Date(d.tanggal).toString().slice(0,15)}</td>
                          <td>{d.uuid}</td>
                          <td>Rp {d.total.toLocaleString()}</td>
                          <td>{d.idMeja}</td>
                        </tr>

                        {showIsi[showIsi.findIndex(s => s.idTransaksi === d.idTransaksi)].show && 
                        <>
                          <tr colSpan={4}>
                            <th className={styles.isimenu}>Menu</th>
                            <th className={styles.isimenu}>Amount</th>
                            <th className={styles.isimenu}></th>
                            <th className={styles.isimenu}></th>
                          </tr>

                          {dataOrder.filter(dataO => dataO.idPesanan === d.idPesanan).map( d => 
                            <tr key={d.isiPesanan}>
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
                        </>
                        }
                      </React.Fragment>
                    )}

                    <tr>
                      <td className={styles.total} colSpan={4}>
                        Total: Rp {dataTransaksi.filter(
                        data => new Date(data.tanggal).toLocaleDateString('en-CA') >= fromDate && new Date(data.tanggal).toLocaleDateString('en-CA') <= toDate)
                        .reduce((total, i) => total + i.total, 0).toLocaleString()}
                      </td>
                    </tr>
                  </>}
                  </tbody>
                </table>
              </>
            : <p>No transaction yet</p>}
          </div>
        : 'Only for manager'}
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
  const queryCancel = `SELECT "Pesanan"."idPesanan", "Pesanan"."statusPesanan", "Pesanan"."jam", "Pesanan"."idMeja", "Pesanan"."tanggal", "Pesanan"."uuid", "KelolaPesanan"."idAdmin", "KelolaPesanan"."aksi", "Admin"."username" FROM "Pesanan" INNER JOIN "KelolaPesanan" ON "Pesanan"."idPesanan" = "KelolaPesanan"."idPesanan" INNER JOIN "Admin" ON "Admin"."idAdmin" = "KelolaPesanan"."idAdmin" WHERE "Pesanan"."statusPesanan" = 5`

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
  const resultCancel = await conn.query(queryCancel)
  const dataCancel = resultCancel.rows

  dataOrder.map(d => d.tanggal = d.tanggal.toString())

  dataTransaksi.map(d => d.tanggal = String(d.tanggal))
  dataCancel.map(d => d.tanggal = String(d.tanggal))

  const show = []
  dataTransaksi.map(d => show.push({idTransaksi: d.idTransaksi, show: false}))

  console.log(dataOrder)

  return{
    props:{
      dataTransaksi,
      dataOrder,
      dataMenu,
      dataAdminFinish,
      dataAdminAccept,
      show,
      dataCancel
    }
  }
}

TransactionHistory.getLayout = function getLayout(page) {
    return (
      <Layout>
        <div>
          <NavBar key='riwayattransaksi' currentPath={'/admin/transactionhistory'}></NavBar>
          {page}
        </div>
      </Layout>
    )
}