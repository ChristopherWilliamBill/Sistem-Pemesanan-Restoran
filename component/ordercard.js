import styles from "../styles/OrderCard.module.css"
import { useSWRConfig } from 'swr'

export default function OrderCard({order, orderOcc, setOrder, i, setI}){
    
    const handleSubmit = async (e) => {

        e.preventDefault()
        const data = {orderOcc}
    
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

        alert(result.message)
    }

    return(
        <div className={styles.ordercontainer}>
            <h2>Your Order</h2>

            {order.length > 0 ?
            <ul>
              {(orderOcc).map((menu =>
                <li key={menu.index} className={styles.orderlist}>
                <p>{menu.name} </p>
                <p>{menu.count}</p>
                <button onClick={
                    () => {setOrder((order) => order.filter(o => o.index != menu.index.split(',')[menu.index.split(',').length - 1])); console.log(orderOcc)}
                }>-</button> 

                <button onClick={
                    () => {setOrder([...order, {name: menu.name, index: i.toString(), id: menu.id, harga: menu.harga}]); setI(1); console.log(order)}
                }>+</button>
                </li>  
              ))}
            </ul>
            : <p>You have no order</p>}

            <h3>Total: IDR {orderOcc.reduce(function(totalharga, curmenu){return totalharga + (curmenu.harga * curmenu.count)}, 0).toLocaleString()}</h3>
            <div>
                <button onClick={() => {setOrder([]); setI(-i)}}>clear</button>
                <button onClick={handleSubmit}>make order</button>
            </div>
        </div>
    )
}