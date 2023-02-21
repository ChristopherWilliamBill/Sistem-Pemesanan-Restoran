import styles from '../styles/PendingOrderCard.module.css'
import { useState, useEffect } from 'react';

export default function PendingOrderCard({d, dataMenu, status, notifyKitchen, notifyTable, idAdmin}){
    const handleOrder = async (status) => {
        const data = {idPesanan: d.idPesanan, status: status, idAdmin:idAdmin}
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

        notifyKitchen()
        notifyTable(d.idMeja)
    }

    const date = new Date()

    function toSeconds(t) {
        let x = t.split(':');
        return (x[0] * 3600) + (x[1] * 60) + (x[2] * 1)
    }

    function formatter(n){return (n < 10 ? '0' : '') + n}

    function toHMS(secs) {
        return formatter(parseInt(secs/3600)) + 'h:' + formatter(parseInt(secs%3600/60)) + 'm:' + formatter(parseInt(secs%60)) + "s"
    }

    function formatTime(t){
        const ampm = t.split(' ')
        const x = ampm[0].split(':')

        ampm == "PM" ? x[0] = parseInt(x[0]) + 12 : parseInt(x[0]) + 0

        parseInt(x[0]) < 10 ? x[0] = parseInt(x[0]) + 12 : parseInt(x[0]) + 0

        const y = formatter(x[0]) + ":" + formatter(x[1]) + ":" + formatter(x[2])

        return y.substring(0, 8) 
    }

    const [time, setTime] = useState(date.toLocaleTimeString());

    useEffect(() => {
        const interval = setInterval(() => setTime(formatTime(new Date().toLocaleTimeString()), 1000));
        return () => {
            clearInterval(interval);
        };
    }, []);

    return(
        <div className={styles.ordercard}> 
            <div className={styles.orderinfo}>
                <p><b>Meja: {d.idMeja}</b></p>
                <p><b>Waktu menunggu: {toHMS(toSeconds(time) - toSeconds(d.jam.split(".")[0]))}</b></p>
            </div>

            <div className={styles.orderlistcontainer}>
                {d.isiPesanan.map((order, index) => 
                    d.status[index] != 2 ? 
                        <div key={index} className={styles.orderlist}>
                            <p>{dataMenu[order - 1].namaMenu}</p> 
                            <p>x {d.jumlah[index]}</p>
                            {d.status[index] == 0 && d.statusPesanan == 2? <button>deliver</button>
                            : null
                            }
                        </div>
                    : null
                )}
            </div>

            <div>
                {status == 1 ? <button className={styles.btnaccept} onClick={() => handleOrder(2)}>Accept</button> : <button className={styles.btnaccept} onClick={() => handleOrder(3)}>Done</button>}    
            </div>
        </div>
    )
}
