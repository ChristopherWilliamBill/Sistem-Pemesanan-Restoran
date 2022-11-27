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
      <h2 className={styles.category}>Pending</h2>
      <div className={styles.container}>
        {
          data.filter(d => d.status == 1).length > 0 ?
            data.filter(d => d.status == 1).map(
              d => <PendingOrderCard d={d} dataMenu={dataMenu} status={1}></PendingOrderCard>
            )
          : <p>No Order</p>
        }
      </div>

      <hr></hr>

      <h2 className={styles.category}>Processing</h2>
      <div className={styles.container}>
        {
          data.filter(d => d.status == 2).length > 0 ?
            data.filter(d => d.status == 2).map(
              d => <PendingOrderCard d={d} dataMenu={dataMenu} status={2}></PendingOrderCard>
            )
          : <p>Accept Pending Order</p>
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