import styles from "../styles/OrderCard.module.css"
import { useState } from "react";
import { useEffect } from "react";

export default function OrderCard({order, addToOrder, reduceOrder, resetOrder, notifyKitchen, isWaiting, setIsWaiting, meja, idPesanan, getCurrentOrder}){
    
    const handleSubmit = async (e) => {

        if( order.reduce((i, o) => {return i + o.count}, 0) == 0 ){
            alert("Order your desired menu by clicking the menu card on the left.")
            return
        }

        e.preventDefault()

        const dataOrder = order.filter(o => o.count > 0)

        const idMeja = meja.substring(6, meja.length)
        const data = {
            idMeja: idMeja,
            dataOrder: dataOrder
        }
            
        const JSONdata = JSON.stringify(data)
        const endpoint = '../api/makeorder'
    
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSONdata
        }
    
        const response = await fetch(endpoint, options)
        const result = await response.json()

        if(result.message === "Order Success"){
            notifyKitchen()
            setIsWaiting(true)
        }

        alert(result.message)
    }

    const cancelMenu = async (menu) => {
        console.log(menu)
        console.log(idPesanan)

        const data = {
            idPesanan: idPesanan,
            isiPesanan: menu.idMenu
        }

        const JSONdata = JSON.stringify(data)
        const endpoint = '../api/cancelmenu'
        const options = {
            method: "PUT",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSONdata
        }
        const response = await fetch(endpoint, options)
        const result = await response.json()
        resetOrder()
        getCurrentOrder(meja.substring(6, meja.length))
        notifyKitchen()

        console.log(result)
    }

    return(
        <div className={styles.ordercontainer}>

            { isWaiting ? 
                <>
                    <h3>Your order is being prepared.</h3> 
                    <h5>Order ID: {idPesanan}</h5>
                    {order.reduce((i, o) => {return i + o.count}, 0) != 0 ?
                        <ul>
                            {order.filter(o => o.count > 0).map(or => 
                                <li key={or.id} className={styles.orderlistfinished}>
                                    <p>{or.namaMenu}</p>
                                    <p>x {or.count}</p>
                                    {or.statusPesanan == 1 ? <button className={styles.cancelbtn} onClick={() => cancelMenu(or)}>cancel</button> : null}
                                </li>
                            )}
                        </ul>
                    : <p style={{textAlign: "center"}}>Order your desired menu by clicking the menu card on the left.</p>}
                    <h3>Total: IDR {order.filter(o => o.count > 0).reduce(function(totalharga, curmenu){return totalharga + (curmenu.harga * curmenu.count)}, 0).toLocaleString()}</h3>
                    {/* <button onClick={() => {setIsWaiting(false); resetOrder()}}>Done</button> */}
                </>
            : 
                <>
                    <h2>Your Order</h2>
                    {order.reduce((i, o) => {return i + o.count}, 0) != 0 ?
                        <ul>
                            {order.filter(o => o.count > 0).map(or => 
                                <li key={or.id} className={styles.orderlist}>
                                    <p>{or.namaMenu}</p>
                                    <p>x {or.count}</p>
                                    <button onClick={() => addToOrder(or)}>+</button>
                                    <button onClick={() => reduceOrder(or)}>-</button>
                                </li>
                            )}
                        </ul>
                    : <p style={{textAlign: "center"}}>Order your desired menu by clicking the menu card on the left.</p>}

                    {<h3>Total: IDR {order.filter(o => o.count > 0).reduce(function(totalharga, curmenu){return totalharga + (curmenu.harga * curmenu.count)}, 0).toLocaleString()}</h3>}
                    <div>
                        <button onClick={resetOrder}>clear</button>
                        <button onClick={handleSubmit}>make order</button>
                    </div>
                </>
            }
        </div>
    )
}