import styles from '../styles/Home.module.css'
import { useRouter } from 'next/router';
import React, { useState,useEffect } from 'react';
import {conn} from '../lib/pg.ts';
import MenuCard from '../component/menucard';
import OrderCard from '../component/ordercard';

let i = 0

export default function Home({dataMenu}) {

  const router = useRouter()

  const [order, setOrder] = useState([]);
  const [orderOcc, setOrderOcc] = useState([]);

  useEffect(() => {
    setOrderOcc(countOcc(order))
  },[order])

  const addToOrder = (menu) => {setOrder([...order, {name: menu.namaMenu, index: i.toString(), id:menu.id, harga: menu.harga}]); i++;}

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

        <OrderCard order={order} orderOcc={orderOcc} setOrder={setOrder} i={i} setI={setI}></OrderCard>
      </div>
    </>
  )
}

function setI(x){
  i = i+x
}

function countOcc(order){
  const orderOccurences = []

  const x = {
    name: '',
    count: 1,
    index: '',
    harga: 1,
    id: 1
  }

  for (const o of order) {    
    if (orderOccurences.some(e => e['name'] === o.name)) {
      let i = orderOccurences.findIndex(e => e['name'] === o.name)
      orderOccurences[i].count++
      orderOccurences[i].index = orderOccurences[i].index.toString() + ',' + o.index
    }else{
      x.name = o.name
      x.count = 1
      x.index = o.index
      x.harga = o.harga
      x.id = o.id
      orderOccurences.push(Object.assign({},x))
    }
  }

  return orderOccurences
}

export async function getServerSideProps(){
  const query = `SELECT * FROM "Menu"`
  const res = await conn.query(query)
  const dataMenu = res.rows
  return{
    props:{
      dataMenu
    }
  }
}