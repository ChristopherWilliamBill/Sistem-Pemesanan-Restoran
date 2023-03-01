import styles from "../styles/OrderCard.module.css"
import { useState } from "react";
import { useEffect } from "react";

export default function OrderCard({order, addToOrder, reduceOrder, resetOrder, notifyKitchen, isWaiting, setIsWaiting, meja, idPesanan, getCurrentOrder, setExtendOrder, extendOrder}){
    
    const handleSubmit = async (e) => {

        if( order.reduce((i, o) => {return i + o.count}, 0) == 0 ){
            alert("Order your desired menu by clicking the menu card on the left.")
            return
        }

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
            getCurrentOrder(meja.substring(6, meja.length))
            setIsWaiting(true)
        }

        alert(result.message)
    }

    const cancelMenu = async (menu) => {
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

        getCurrentOrder(meja.substring(6, meja.length))
        notifyKitchen()

        if(result.message === "All menu cancelled"){
            resetOrder()
            setIsWaiting(false)
            setExtendOrder(false)
        }
    }

    return(
        <div className={styles.ordercontainer}>

            { isWaiting ? 
                <>
                    {order.some(o => o.statusPesanan == 1 ) && <h3>Waiting for comfirmation.</h3>}
                    {order.some(o => o.statusPesanan == 2 ) && <h3>Your order is being prepared.</h3>}
                    {order.some(o => o.statusPesanan == 3 ) && <h3>Enjoy your meals.</h3>}

                    {order.reduce((i, o) => {return i + o.count}, 0) != 0 ?
                        <ul className={styles.ul}>
                            {order.filter(o => o.count > 0).map(or => 
                            <>
                                <li key={or.id} className={styles.orderlistfinished}>
                                    <p>{or.namaMenu}</p>
                                    <p>x {or.count}</p>
                                    {or.statusPesanan == 1 ? <button className='btn-danger' onClick={() => cancelMenu(or)}>cancel</button> : null}
                                    {or.status == 0 && or.statusPesanan == 2 ? <p>waiting</p> : null}
                                    {or.status == 1 ? <p>delivered</p> : null}
                                </li>
                                {or.isiMenu.length > 0 && <>{or.isiMenu.map(o => <p>{order[o - 1].namaMenu}</p>)}</>}
                            </>
                            )}
                        </ul>
                    : <p style={{textAlign: "center"}}>Order your desired menu by clicking the menu card on the left.</p>}
                    <h4>Total: IDR {order.filter(o => o.count > 0).reduce(function(totalharga, curmenu){return totalharga + (curmenu.harga * curmenu.count)}, 0).toLocaleString()}</h4>
                    {!extendOrder && <button onClick={() => setExtendOrder(true)} className='btn-primary'>Add more order</button>}
                </>
            : 
                <>
                    {!extendOrder ? <h3>Your Order</h3> : <h3>Additional Order</h3>}

                    {order.reduce((i, o) => {return i + o.count}, 0) != 0 ?
                        <ul className={styles.ul}>
                            {order.filter(o => o.count > 0).map(or => 
                                <>
                                    <li key={or.id} className={styles.orderlist}>
                                        <p>{or.namaMenu}</p>
                                        <p>x {or.count}</p>
                                        <button onClick={() => addToOrder(or)}>+</button>
                                        <button onClick={() => reduceOrder(or)}>-</button>
                                    </li>
                                    {or.isiMenu.length > 0 && <>{or.isiMenu.map(o => <p>{order[o].namaMenu}</p>)}</>}
                                </>

                            )}
                        </ul>
                    : <p style={{textAlign: "center"}}>Order your desired menu by clicking the menu card on the left.</p>}

                    {<h3>Total: IDR {order.filter(o => o.count > 0).reduce(function(totalharga, curmenu){return totalharga + (curmenu.harga * curmenu.count)}, 0).toLocaleString()}</h3>}
                    <div>
                        <button onClick={resetOrder} className='btn-danger'>clear</button>
                        <button onClick={handleSubmit} className="btn-primary">make order</button>
                    </div>
                </>
            }
        </div>
    )
}