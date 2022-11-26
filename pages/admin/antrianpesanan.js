import useSWR from 'swr';
import Layout from '../../component/layout'
import PendingOrderCard from '../../component/pendingordercard';
import {conn} from '../../lib/pg.ts';
import styles from '../../styles/AntrianPesanan.module.css'

export default function AntrianPesanan({dataMenu}){    

  const fetcher = async () => {
    const response = await fetch('http://localhost:3000/api/getOrder')
    const dataOrder = await response.json()
    return dataOrder
  }

  const { data, error } = useSWR('order', fetcher, { refreshInterval: 10000})

  if(!data){
    return <h1>LOADING</h1>
  }

  return(
    <>
      <h2>Pending</h2>
      <div className={styles.container}>
        {
          data.map(
            d => <PendingOrderCard d={d} dataMenu={dataMenu}></PendingOrderCard>
          )
        }
      </div>

      <hr></hr>

      <h2>Processing</h2>
      <div className={styles.container}>
        {
          data.map(
            d => <PendingOrderCard d={d} dataMenu={dataMenu}></PendingOrderCard>
          )
        }
      </div>
    </>
  )
}

export async function getStaticProps(){

  const queryMenu = `SELECT * FROM "Menu"`
  const resMenu = await conn.query(queryMenu)
  const dataMenu = resMenu.rows
  dataMenu.sort((a,b) => a.id - b.id)
  
  return{
    props:{
      dataMenu,
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