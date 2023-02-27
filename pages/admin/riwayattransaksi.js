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
                <th>Total</th> 
                <th>Meja</th>
              </tr>
              {dataTransaksi.map(d => 
                <tr>
                  <td>{d.tanggal}</td>
                  <td>{d.total}</td>
                  <td>{d.idMeja}</td>
                </tr>
              )}
            </table>
          </div>
        </>
    )
}

export async function getStaticProps(){
  const query = `SELECT * FROM "Transaksi"`
  const result = await conn.query(query)
  const dataTransaksi = result.rows

  dataTransaksi.map(d => d.tanggal = String(d.tanggal).substring(0,15))
  console.log(dataTransaksi)

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