import Layout from '../../component/layout'
import {conn} from '../../lib/pg.ts';
import styles from '../../styles/AntrianPesanan.module.css'

export default function AntrianPesanan({dataOrder, dataMenu}){
    return(
        <>
          {console.log(dataMenu)}

          <div className={styles.container}>

            {
              dataOrder.map( //untuk setiap data pesanan
                d => //membuat div yang isinya data pesanan tersebut
                  <div className={styles.ordercard}> 
                    <p>Meja: {d.idMeja}</p>
                    <p>Waktu dipesan: {d.time.split(".")[0]}</p>

                    {d.idMenu.split(",").map(Number).map( //idMenu yang tadinya string dipecah menjadi array setiap kali ditemukan "," dan dijadikan int menggunakan .map(Number)
                      (order,index) => <p>{dataMenu[order - 1].namaMenu} x {d.count.split(",")[index]}</p> //setiap idMenu yang dipesan, tampilkan namanya dari dataMenu, dan jumlahnya
                    )}
                  </div>
              )
            }
          </div>
        </>
    )
}

export async function getServerSideProps(){
  const queryOrder = `SELECT * FROM "PendingOrder"`
  const resOrder = await conn.query(queryOrder)
  const dataOrder = resOrder.rows

  const queryMenu = `SELECT * FROM "Menu"`
  const resMenu = await conn.query(queryMenu)
  const dataMenu = resMenu.rows
  dataMenu.sort((a,b) => a.id - b.id)
  return{
    props:{
      dataMenu,
      dataOrder
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