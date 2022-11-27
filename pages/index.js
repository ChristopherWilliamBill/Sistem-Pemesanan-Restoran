import styles from '../styles/Home.module.css'
import { useRouter } from 'next/router';
import React, { useState,useEffect } from 'react';
import {conn} from '../lib/pg.ts';
import MenuCard from '../component/menucard';
import OrderCard from '../component/ordercard';
import Layout from '../component/layout'

export default function Home({dataMenu}) {

  const router = useRouter()

  const [order, setOrder] = useState(dataMenu);

  const resetOrder = () =>{
    setOrder(dataMenu)
  }

  const addToOrder = (menu) => {
    setOrder([...order].map(o => {
      if(o.id === menu.id) {
        return {
          ...o,
          count: o.count + 1,
        }
      }
      else return o;
    }))
  }

  const reduceOrder = (menu) => {
    setOrder([...order].map(o => {
      if(o.id === menu.id) {
        return {
          ...o,
          count: o.count - 1,
        }
      }
      else return o;
    }))
  }

  const learnMore = (menu) => {router.push(`/menu/${menu.id}`)}

  return (
    <> 
      <h1 className={styles.title}>Welcome!</h1>

      <div className={styles.container}>
        <div className={styles.menucontainer}>
          {dataMenu.map((menu) => (
            <MenuCard key={menu.id} menu={menu} addToOrder={addToOrder} learnMore={learnMore}></MenuCard>
          ))}
        </div>

        <OrderCard order={order} addToOrder={addToOrder} reduceOrder={reduceOrder} resetOrder={resetOrder}></OrderCard>
      </div>
    </>
  )
}

export async function getServerSideProps(){
  const query = `SELECT * FROM "Menu"`
  const res = await conn.query(query)
  const dataMenu = res.rows

  for(let i = 0; i < dataMenu.length; i++){
    dataMenu[i].count = 0
  }

  return{
    props:{
      dataMenu
    }
  }
}

// Home.getLayout = function getLayout(page) {
//   return (
//     <Layout>
//       {page}
//     </Layout>
//   )
// }