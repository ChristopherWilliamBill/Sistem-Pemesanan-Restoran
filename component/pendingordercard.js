import styles from '../styles/PendingOrderCard.module.css'
import { useState, useEffect } from 'react';

export default function PendingOrderCard({d, dataMenu, status, notifyKitchen, notifyTable, idAdmin, index, printOrder}){
    const [jumlahDeliver, setJumlahDeliver] = useState(new Array(d.isiPesanan.length).fill(0))
    const [jumlahReject, setJumlahReject] = useState(new Array(d.isiPesanan.length).fill(0))
    const [jumlahAdditionalReject, setJumlahAdditionalReject] = useState(new Array(d.isiPesanan.length).fill(0))
    const [printAdditional, setPrintAdditional] = useState(0)

    const handleOrder = async (status) => {
        const data = {idPesanan: d.idPesanan, status: status, idAdmin: idAdmin}
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

    const handleChangeDeliver = (jumlah, index, max) => {
        const temp = jumlahDeliver.slice()

        if(jumlah > max){ jumlah = max}
        if(!jumlah){ jumlah = 0 }

        temp[index] = jumlah
        setJumlahDeliver(temp)
    }

    const handleChangeReject = (jumlah, index, max) => {
        const temp = jumlahReject.slice()

        if(jumlah > max){ jumlah = max }

        if(!jumlah){ jumlah = 0 }

        temp[index] = jumlah
        setJumlahReject(temp)
    }

    const handleChangeAdditionalReject = (jumlah, index, max) => {
        const temp = jumlahAdditionalReject.slice()

        if(jumlah > max){ jumlah = max }

        if(!jumlah){ jumlah = 0 }

        temp[index] = jumlah
        setJumlahAdditionalReject(temp)
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
        setJumlahReject(new Array(d.isiPesanan.length).fill(0))
    }

    const cancelMenu = async (isiPesanan, jumlah) => {
        const data = {
            idPesanan: d.idPesanan,
            isiPesanan: isiPesanan,
            jumlah: jumlah
        }

        console.log(data)

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

        notifyKitchen()
        notifyTable(d.idMeja)
        setJumlahReject(new Array(d.isiPesanan.length).fill(0))
        setJumlahDeliver(new Array(d.isiPesanan.length).fill(0))
    }

    const cancelMenuTambahan = async (isiPesanan, jumlah) => {
        const data = {
            idPesanan: d.idPesanan,
            isiPesanan: isiPesanan,
            jumlah: jumlah
        }

        const JSONdata = JSON.stringify(data)
        const endpoint = '../api/cancelmenutambahan'

        const options = {
            method: "PUT",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSONdata
        }
        const response = await fetch(endpoint, options)
        const result = await response.json()

        notifyKitchen()
        notifyTable(d.idMeja)
        setJumlahAdditionalReject(new Array(d.isiPesanan.length).fill(0))
    }

    const rejectOneOrder = async (isiPesanan, jumlah) => {
        const data = {idPesanan: d.idPesanan, isiPesanan: isiPesanan, idAdmin: idAdmin, jumlah:jumlah}
        const JSONdata = JSON.stringify(data)
        const endpoint = '../api/rejectorder'
    
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
        setJumlahReject(new Array(d.isiPesanan.length).fill(0))
        setJumlahDeliver(new Array(d.isiPesanan.length).fill(0))
    }

    const acceptAdditionalOrder = async () => {
        setPrintAdditional(1)
        const data = {idPesanan: d.idPesanan, idAdmin: idAdmin}
        const JSONdata = JSON.stringify(data)
        const endpoint = '../api/acceptadditionalorder'
    
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
        setJumlahReject(new Array(d.isiPesanan.length).fill(0))
        setJumlahAdditionalReject(new Array(d.isiPesanan.length).fill(0))
    }

    const rejectAdditionalOrder = async () => {
        const data = {idPesanan: d.idPesanan, idAdmin: idAdmin}
        const JSONdata = JSON.stringify(data)
        const endpoint = '../api/rejectadditionalorder'
    
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
        setJumlahReject(new Array(d.isiPesanan.length).fill(0))
        setJumlahAdditionalReject(new Array(d.isiPesanan.length).fill(0))
    }

    const handleRequestCancel = async (aksi) => {
        const data = {aksi: aksi}
        const JSONdata = JSON.stringify(data)
        const endpoint = '../api/handlerequestcancel'

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

    useEffect(() => {
        if(print == 2) {
            window.print()
            setPrint(1)
        }
    },[print])

    useEffect(() => {
        setJumlahDeliver(new Array(d.isiPesanan.length).fill(0))
        setJumlahReject(new Array(d.isiPesanan.length).fill(0))
        setJumlahAdditionalReject(new Array(d.isiPesanan.length).fill(0))
    },[d])

    useEffect(() => {
        if(printAdditional === 1){
            printOrder(index)
            window.onafterprint = () => {
                setPrintAdditional(0)
            }
        }
    },[printAdditional]) 

    return(
        <div className={styles.ordercard}> 
            <div className={styles.orderinfo}>
                <p><b>Table: {d.idMeja}</b></p>
                <p><b>ID: {d.idPesanan}</b></p>
                {d.statusPesanan < 3 ? <p><b>Waiting Time: {toHMS(toSeconds(time) - toSeconds(d.jam.split(".")[0]))}</b></p> : null}
            </div>
            
            <div className={printAdditional === 0 ? styles.orderlistcontainer : styles.dontprint}>
                <div className={styles.orderlist}>
                {d.isiPesanan.map((order, index) => 
                    (d.status[index] != 4 && d.status[index] != 3) &&
                    <>
                        {
                            // status: 1 => TerdiriPesanan baru
                            // status: 2 => TerdiriPesanan delivered
                            // status: 3 => TerdiriPesanan additional order
                            // status: 4 => TerdiriPesanan cancelled order
                            // status: 5 => TerdiriPesanan asking to be cancelled order
                        }

                        <div key={index} className={styles.orderitem}>
                            <p className={d.status[index] == 3 && styles.additionalorder}>{dataMenu[order - 1].namaMenu}</p> {/* nama menu */}
                            {d.statusPesanan == 1 && <p className={styles.orderjumlah}>x {d.jumlah[index]}</p>} {/* jumlah (x 3) */}
                            {d.statusPesanan > 1 && <p className={styles.orderjumlah}>{d.delivered[index]}/{d.jumlah[index]}</p>} {/* delivered (1/3) */}

                            {d.requestcancel[index] == 0 &&
                                <div className={styles.orderaction}>
                                    {(d.delivered[index] == d.jumlah[index] && d.statusPesanan) == 2 && <p>delivered</p>}
                                    {d.statusPesanan == 1 && <><input type='number' min="0" className={styles.inputnumber} onChange={({target}) => handleChangeReject(target.value, index, d.jumlah[index] - d.delivered[index])} value={jumlahReject[index]}></input><button onClick={() => {cancelMenu(d.isiPesanan[index], jumlahReject[index])}}>reject</button></>}

                                    <div className={styles.orderinput}> 
                                        {(d.statusPesanan == 2 && d.delivered[index] < d.jumlah[index]) && 
                                        <>
                                            <input type='number' min="0" className={styles.inputnumber} onChange={({target}) => handleChangeDeliver(target.value, index, d.jumlah[index] - d.delivered[index])} value={jumlahDeliver[index]}></input>
                                            <input type='number' min="0" className={styles.inputnumber} onChange={({target}) => handleChangeReject(target.value, index, d.jumlah[index] - d.delivered[index])} value={jumlahReject[index]}></input>
                                        </>}
                                    </div>

                                    <div className={styles.orderbutton}> 
                                        {(d.delivered[index] != d.jumlah[index]) && d.statusPesanan == 2 && 
                                        <>
                                            <button onClick={() => deliverOneOrder(d.isiPesanan[index], jumlahDeliver[index])}>deliver</button>
                                            <button onClick={() => rejectOneOrder(d.isiPesanan[index], jumlahReject[index])}>reject</button>
                                        </>}
                                    </div>
                                </div>
                            }
                        </div>

                        {d.requestcancel[index] > 0 && 
                            <div className={styles.requestcancel}>
                                <p>Cancellation requested </p>
                                <p> x {d.requestcancel[index]}</p>
                                <button onClick={() => handleRequestCancel('approve')}>Approve</button>
                                <button onClick={() => handleRequestCancel('reject')}>Reject</button>
                            </div>
                        }

                        {d.isiPaket[index].length > 0 && d.isiPaket[index].map( isi => <p className={styles.isiPaket}>{dataMenu[isi - 1].namaMenu}</p>)}

                        <div className={styles.garisbawah}></div>
                    </>
                )}
                </div>
            </div>

            <div>
                {status == 1 && <button className={styles.btnaccept} onClick={() => handleOrder(2)}>Accept</button>}
                {status == 2 && <button className={styles.btnaccept} onClick={() => handleOrder(3)}>Deliver All</button>}   
                {status == 2 && <button className={styles.btnaccept} onClick={() => printOrder(index)}>Print</button>}     
                {status == 3 && <button className={styles.btnaccept} onClick={() => handleOrder(4)}>Done</button>}    
            </div>

            {/* ADDITIONAL ORDER */}
            {d.status.some( s => s == 3) && 
                <div className={printAdditional === 1 ? styles.printadditional : styles.dontprint}>
                    <div className={styles.additionalordercontainer}>
                        <h4>Additional Order</h4>
                        <div className={styles.orderlisttambahan}>
                            {d.isiPesanan.map((order, index) => (d.status[index] == 3) && 
                                <div key={index} className={styles.orderitem}>
                                    <p className={d.status[index] == 3 && styles.additionalorder}>{dataMenu[order - 1].namaMenu}</p> 
                                    <p className={styles.orderjumlah}>x {d.jumlah[index]}</p>
                                    <div className={styles.orderaction}>
                                        <input type='number' min="0" className={styles.inputnumber} onChange={({target}) => handleChangeAdditionalReject(target.value, index, d.jumlah[index] - d.delivered[index])} value={jumlahAdditionalReject[index]}></input>
                                        <button onClick={() => {cancelMenuTambahan(d.isiPesanan[index], jumlahAdditionalReject[index])}}>reject</button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div>
                            <button className={styles.btnaccept} onClick={acceptAdditionalOrder}>Accept All</button>
                            <button className={styles.btnaccept} onClick={rejectAdditionalOrder}>Reject All</button>
                            <button className={styles.btnaccept} onClick={() => setPrintAdditional(1)}>Print</button>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}