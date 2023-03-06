import Layout from '../../component/layout'
import {conn} from '../../lib/pg.js';
import styles from '../../styles/RiwayatTransaksi.module.css'

export default function RiwayatTransaksi({dataTransaksi}){
    return(
        <>
          <div className={styles.container}>
            <table className={styles.table}>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>ORDER ID</th>
                <th>Total</th> 
                <th>Table</th>
                <th>Status</th>
              </tr>
              {dataTransaksi.map(d => 
                <tr>
                  <td>{d.tanggal}</td>
                  <td>{d.jam.split('.')[0]}</td>
                  <td>{d.idPesanan}</td>
                  <td>{d.idPesanan}</td>
                  <td>{d.idMeja}</td>
                  <td>{d.statusPesanan == 4 ? 'done' : 'cancelled'}</td>

                </tr>
              )}
            </table>
          </div>
        </>
    )
}

export async function getStaticProps(){
  const query = `SELECT "Pesanan"."idPesanan", "Pesanan"."statusPesanan", "Pesanan"."idMeja", "Pesanan"."tanggal", "Pesanan"."jam", "Menu"."harga", "TerdiriPesanan"."isiPesanan", "TerdiriPesanan"."jumlah" FROM "Pesanan" INNER JOIN "TerdiriPesanan" ON "Pesanan"."idPesanan" = "TerdiriPesanan"."idPesanan" INNER JOIN "Menu" ON "Menu"."idMenu" = "TerdiriPesanan"."isiPesanan" WHERE "Pesanan"."selesai" = 1`
  const result = await conn.query(query)
  const dataTransaksi = result.rows

  dataTransaksi.map(d => d.tanggal = String(d.tanggal).substring(0,15))
  console.log(dataTransaksi[0].tanggal)

  return{
    props:{
      dataTransaksi
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