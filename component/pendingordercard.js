import styles from '../styles/PendingOrderCard.module.css'
import { useState, useEffect } from 'react';

export default function PendingOrderCard({d, dataMenu, status, notifyKitchen, notifyTable, idAdmin}){

    const [jumlahDeliver, setJumlahDeliver] = useState(new Array(d.isiPesanan.length).fill(0))

    const handleOrder = async (status) => {
        const data = {idPesanan: d.idPesanan, status: status, idAdmin: idAdmin}
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

    const handleChange = (jumlah, index, max) => {
        const temp = jumlahDeliver.slice()

        if(jumlah > max){
            jumlah = max
        }

        if(!jumlah){
            jumlah = 0
        }

        temp[index] = jumlah
        setJumlahDeliver(temp)
    }

    const deliverOneOrder = async (isiPesanan, jumlah) => {
        const data = {idPesanan: d.idPesanan, isiPesanan: isiPesanan, idAdmin: idAdmin, jumlah:jumlah}
        const JSONdata = JSON.stringify(data)
        const endpoint = '../api/deliverorder'
    
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
        setJumlahDeliver(new Array(d.isiPesanan.length).fill(0))
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
                <p><b>ID: {d.idPesanan}</b></p>
                {d.statusPesanan < 3 ? <p><b>Waktu menunggu: {toHMS(toSeconds(time) - toSeconds(d.jam.split(".")[0]))}</b></p> : null}
            </div>

            <div className={styles.orderlistcontainer}>
                <div className={styles.orderlist}>
                {d.isiPesanan.map((order, index) => 
                    d.status[index] != 4 ? 
                    <>
                    {
                        // status: 1 => TerdiriPesanan baru
                        // status: 2 => TerdiriPesanan delivered
                        // status: 3 => TerdiriPesanan additional order
                        // status: 4 => TerdiriPesanan cancelled order
                    }

                    {/* {KALAU STATUSPESANAN = 2 TAPI STATUS = 3 (additional order) ARTINYA PESANAN TAMBAHAN => KASIH WARNA MERAH} */}


                    {/* BIKIN FITUR CANCEL ORDER PELANGGAN & MUNCUL NOTIFIKASI DI SISI PELANGGAN */}

                        <div key={index} className={styles.orderitem}>
                            <p className={d.status[index] == 3 ? styles.additionalorder : null}>{dataMenu[order - 1].namaMenu}</p> 
                            {d.statusPesanan == 1 && <p>x {d.jumlah[index]}</p>}
                            {d.statusPesanan > 1 && <p>{d.delivered[index]}/{d.jumlah[index]}</p>}
                            {console.log(d)}
                            {(d.statusPesanan == 2 && d.delivered[index] < d.jumlah[index]) && <input type='number' min="1" max={d.jumlah[index] - d.delivered[index]} className={styles.inputnumber} onChange={({target}) => handleChange(target.value, index, d.jumlah[index] - d.delivered[index])} value={jumlahDeliver[index]}></input>}
                            {(d.delivered[index] != d.jumlah[index]) && d.statusPesanan == 2? <button onClick={() => deliverOneOrder(d.isiPesanan[index], jumlahDeliver[index])}>deliver</button> : null}
                            {(d.delivered[index] == d.jumlah[index]) && d.statusPesanan == 2? <p>delivered</p> : null}
                        </div>

                        {d.isiPaket[index].length > 0 ? 
                            d.isiPaket[index].map( isi => <p className={styles.isiPaket}>{dataMenu[isi - 1].namaMenu}</p>)
                        : null}
                    </>

                    : null
                )}
                </div>
            </div>

            <div>
                {status == 1 && <button className={styles.btnaccept} onClick={() => handleOrder(2)}>Accept</button>}
                {status == 2 && <button className={styles.btnaccept} onClick={() => handleOrder(3)}>Deliver All</button>}    
                {status == 3 && <button className={styles.btnaccept} onClick={() => handleOrder(4)}>Done</button>}    
            </div>
        </div>
    )
}
