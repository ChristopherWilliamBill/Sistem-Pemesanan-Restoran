import styles from '../styles/Home.module.css'
import { useRouter } from 'next/router';
import React, { useState,useEffect } from 'react';
import {conn} from '../lib/pg.ts';
//import prisma from '../lib/prisma.ts';

// import {getDB} from '../lib/pgp.ts';
// const {db, pgp} = getDB();

let i = 0

export default function Home({dataMenu}) {

  const router = useRouter()

  const [order, setOrder] = useState([]);
  const [orderOcc, setOrderOcc] = useState([]);

  useEffect(() => {
    setOrderOcc(countOcc(order))
  },[order])


  return (
    <> 
      <h1 className={styles.title}>Welcome!</h1>

      <div className={styles.container}>
        <div className={styles.menucontainer}>
          {dataMenu.map((menu, index) => (
            <div key={index} className={styles.menucard}>
              <h3>{menu.namaMenu}</h3>
              <p>{menu.deskripsiMenu}</p>
              <p>IDR {menu.harga}</p>
              <div className={styles.cardbutton}>
                <button onClick={() => router.push(`/menu/${parseInt(index) + 1}`)}>learn more</button>
                <button onClick={() => {setOrder([...order, {name: menu.namaMenu, index: i.toString(), harga: menu.harga}]); i++}}>add to order</button>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.cartcontainer}>
            <h2 className={styles.title}>Your Order</h2>

            {order.length > 0 ?
            <ul>
              {(orderOcc).map((menu =>
                <li key={menu.index} className={styles.orderlist}>
                <p>{menu.name} </p>
                <p>{menu.count}</p>
                <button onClick={() => setOrder(
                    (order) => order.filter(
                      o => o.index != menu.index.split(',')[menu.index.split(',').length - 1]
                    )
                  )
                }>-</button> 

                <button onClick={
                  () => {setOrder(
                    [...order, {name: menu.name, index: i.toString(), harga: menu.harga}]
                  ); i++
                  }
                }>+</button>
                </li>  
              ))}
            </ul>
            : <p>You have no order</p>}

            <h3 className={styles.title}>Total: IDR {orderOcc.reduce(function(totalharga, curmenu){return totalharga + (curmenu.harga * curmenu.count)}, 0).toLocaleString()}</h3>
            <div className={styles.cardbutton}>
                <button onClick={() => {setOrder([]); i = 0}}>clear</button>
                <button>make order</button>
            </div>
        </div>
      </div>
     

    </>
  )
}

function countOcc(order){
  const orderOccurences = []

  const x = {
    name: '',
    count: 1,
    index: '',
    harga: 1
  }

  for (const o of order) {    
    if (orderOccurences.some(e => e['name'] === o.name)) {
      let i = orderOccurences.findIndex(e => e['name'] === o.name)
      orderOccurences[i].count++
      orderOccurences[i].index = orderOccurences[i].index.toString() + ',' + o.index.toString()
    }
    else{
      x.name = o.name
      x.count = 1
      x.index = o.index.toString() 
      x.harga = o.harga
      orderOccurences.push(Object.assign({},x))
    }
  }

  return orderOccurences
}

export async function getStaticProps(){
  // const pgp = require('pg-promise')({
  //   noWarnings: true
  // })
  // const db = pgp("postgres://christopher@localhost:5432/christopher")

  // const dataMenu = await db.any(`SELECT * FROM "Menu"`)

  const query = `SELECT * FROM "Menu"`
  const res = await conn.query(query)
  const dataMenu = res.rows
  return{
    props:{
      dataMenu
    }
  }
}


// PRISMA
// export async function getStaticProps(){
//   const dataMenu = await prisma.menu.findMany();
  
//   return{
//     props:{ 
//       dataMenu 
//     }
//   }
// }



// Dulu pake API kaya gini
// export async function getStaticProps(){
//   const options = {
//     method: 'GET',
//     headers: {
//       'X-RapidAPI-Key': 'd6859a7792msh41646aefa40cb0ep1be8c5jsnf7804535d009',
//       'X-RapidAPI-Host': 'burgers1.p.rapidapi.com'
//     }
//   };
  
//   const apiResponse = await fetch('https://burgers1.p.rapidapi.com/burgers', options)
//   const dataMenu = await apiResponse.json()

//   return{
//     props:{
//       dataMenu
//     }
//   }
// }


// 0 {id: 0, name: "Tribute Burger", restaurant: "Honest Burgers", web: "www.honestburgers.co.uk", description: "A mouth-watering honest beef burger", …}
// 1 {id: 1, name: "Pulled Mooshie", restaurant: "Mooshies", web: "www.veganburger.org", description: "Spicy vegan burger with jackfruit", …}
// 2 {id: 2, name: "Krabby Patty", restaurant: "Krusty Krab", web: "https://twitter.com/SpongeBob", description: "The only people who don't like a Krabby Patty have never tasted one.", …}
// 3 {id: 3, name: "The Good Burger", restaurant: "Good Burger", web: "https://en.wikipedia.org/wiki/Good_Burger", description: "Welcome to Good Burger, home of the Good Burger, can I take your order?", …}
// 4 {id: 4, name: "Crunchy Nacho Burger", restaurant: "Max Burgers", web: "https://www.max.se/maten/meny/burgare/crunchy-nacho-burger/", description: "The best combination of crunchiness and softness, all in one single burger", …}
// 5 {id: 5, name: "Barbie Burger", restaurant: "Flower Burger", web: "https://www.flowerburger.it/", description: "From a pink explosion was born Barbie Burger, a special edition in partnership with Mattel", …}
// 6 {id: 6, name: "Curry On My Wayward Bun", restaurant: "Bob's Burgers", web: "https://bobs-burgers.fandom.com/wiki/Burger_of_the_Day", description: "N/A", …}
// 7 {id: 7, name: "MEISTER ALLER KLASSEN", restaurant: "Burgermeister", web: "https://burger-meister.de", description: "Fast food joint located in a public toilet? Why on earth?!", …}
// 8 {id: 8, name: "Vegetarian Burger (Indian Style)", restaurant: "Indian Burgers", web: "https://www.cookwithmanali.com/vegetarian-burger-indian-style/", description: "With summer around the corner, I had to share a ve…Indian style Vegetarian Burger aka Masala Burger!", …}
// 9 {id: 9, name: "Fat Santa", restaurant: "Sky City Hamilton", web: "https://skycityhamilton.co.nz/eat-drink/eat-burger/", description: "A Christmas themed burger", …}
// 10 {id: 10, name: "Blondie", restaurant: "Yankys", web: "http://yankyslambton.co.za/menu/", description: "Delicious steak burger", …}
// 11 {id: 11, name: "Monster Burger", restaurant: "Yankys", web: "http://yankyslambton.co.za/menu/", description: "Massive meaty burger - the size of a dinner plate", …}
// 12 {id: 12, name: "Buffalo chicken burger", restaurant: "Meat Mission", web: "http://meatliquor.com/", description: "Large, messy, super tasty buffalo chicken burger", …}
// 13 {id: 13, name: "Cheatday Burger", restaurant: "Burgeramt", web: "https://www.burgeramt.com/", description: "Perfect when you need a day off from your workout routine", …}
// 14 {id: 14, name: "The Truffler (vegan)", restaurant: "Byron Burgers", web: "https://www.byron.co.uk/", description: "Beyond Meat patty, crispy onions, mushrooms, pickl… mustard, truffle ‘cheese’ fondue, truffle ‘mayo’", …}
// 15 {id: 15, name: "Aloette Buger", restaurant: "Aloette", web: "https://aloetterestaurant.com/", description: "Haute cuisine meets cravings for cheeseburgers.", …}
// 16 {id: 16, name: "BBQ Burger", restaurant: "Fresh Plant Powered", web: "https://freshplantpowered.com/", description: "Vegan burger made from whole, natural ingredients.", …}
// 17 {id: 17, name: "Carroll's Cheese Burger", restaurant: "Carroll's Pub Worms", web: "https://www.carrolls-pub-worms.de/", description: "Tasty black angus beef burger.", …}
// 18 {id: 18, name: "Mojitto Burger", restaurant: "Burger King India", web: "www.mojitto.com", description: "Burger a day keeps the fat away", …}
// 19 {id: 19, name: "Double Slab Burger", restaurant: "Slab Burgers", web: "www.slabburgers.com", description: "taste of hormone-free running cows", …}
// 20 {id: 20, name: "Du Brown", restaurant: "Du Brown Burger Café", web: "https://www.dubrown.com/", description: "Home of the no bullshit burger", …}
// 21 {id: 21, name: "Melting Potes", restaurant: "Melting Potes Nantes", web: "https://www.meltingpotesnantes.com/", description: "Home of the no bullshit burger", …}
// 22 {id: 22, name: "Big Fernand", restaurant: "Big Fernand", web: "https://bigfernand.com/", description: "L'atelier du Hamburgé - The burger workshop", …}
// 23 {id: 23, name: "PNY Burger", restaurant: "PNY Burger", web: "https://pnyburger.com/", description: "Home of the no bullshit burger", …}
// 24 {id: 24, name: "231 East", restaurant: "231 East Street", web: "https://www.231-east.fr/", description: "True New York style burger in France", …}
// 25 {id: 25, name: "Cajun Black Bean Burger", restaurant: "The Chicago Diner", web: "www.veggiediner.com", description: "a hearty veggie burger with a kick that goes great with sweet potato fries", …}
// 26 {id: 26, name: "Hatch Green Chile Bacon Burger", restaurant: "Whataburger", web: "www.whataburger.com", description: "burger with hatch green chiles, bacon and cheese", …}
// 27 {id: 27, name: "The Street Burgers and Coctail Bar Prague 1", restaurant: "The Street", web: "www.thestreet.cz", description: "American, Bar, International, European, Vegetarian Friendly", …}

