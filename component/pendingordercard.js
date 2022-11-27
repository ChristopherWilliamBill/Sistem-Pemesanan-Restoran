import styles from '../styles/PendingOrderCard.module.css'


export default function PendingOrderCard({d, dataMenu, status}){

    const handleOrder = async (status) => {
        const data = {id: d.id, status: status}
        console.log(data)
    
        const JSONdata = JSON.stringify(data)
        const endpoint = '../api/handleorder'
    
        const options = {
            method: 'PUT',
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
        <div className={styles.ordercard}> 
            <div className={styles.orderinfo}>
                <p><b>Meja: {d.idMeja}</b></p>
                <p><b>Waktu dipesan: {d.time.split(".")[0]}</b></p>
            </div>

            <div className={styles.orderlistcontainer}>
                {d.idMenu.split(",").map(Number).map( //idMenu yang tadinya string dipecah menjadi array setiap kali ditemukan "," dan dijadikan int menggunakan .map(Number)
                    (order,index) => 
                    <div className={styles.orderlist}>
                        <p>{dataMenu[order - 1].namaMenu}</p> 
                        <p>x {d.count.split(",")[index]}</p>
                    </div>
                )}
            </div>

            <div>
                {status == 1 ? <button onClick={() => handleOrder(2)}>Accept</button> : <button onClick={() => handleOrder(3)}>Done</button>}    
            </div>

        </div>
    )
}
