import styles from '../styles/PendingOrderCard.module.css'


export default function PendingOrderCard({d, dataMenu}){

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
                <button>Accept</button>
            </div>

        </div>
    )
}
