import styles from '../styles/PendingOrderCard.module.css'
import { useState, useEffect } from 'react';
import { timeCalculator } from '../module/timecalculator';

export default function PendingOrderCard({d, dataMenu, status, notifyKitchen, notifyTable, idAdmin, index, printOrder}){
    const calculateTotal = () => {
        let total = 0
        for(let i = 0; i < d.isiPesanan.length; i++){
            total += (dataMenu[d.isiPesanan[i] - 1].harga * d.jumlah[i])
        }
        return total
    }

    const [jumlahDeliver, setJumlahDeliver] = useState(new Array(d.isiPesanan.length).fill(0))
    const [jumlahReject, setJumlahReject] = useState(new Array(d.isiPesanan.length).fill(0))
    const [jumlahAdditionalAccept, setJumlahAdditionalAccept] = useState(new Array(d.isiPesanan.length).fill(0))
    const [jumlahAdditionalReject, setJumlahAdditionalReject] = useState(new Array(d.isiPesanan.length).fill(0))
    const [printAdditional, setPrintAdditional] = useState(0)
    const [total, setTotal] = useState(Math.ceil(calculateTotal() * 1.15))

    const handleOrder = async (status) => {
        if(status === 3 && d.requestcancel.length > 0){
            alert('Handle cancellation request first!')
            return
        }
        const data = {idPesanan: d.idPesanan, status: status, idAdmin: idAdmin}
        const JSONdata = JSON.stringify(data)
        const endpoint = '../api/handleorder'
        const options = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', },
            body: JSONdata
        }
    
        const response = await fetch(endpoint, options)
        const result = await response.json()

        let message = ''
        if(status === 2){ message = "Order accepted." }
        if(status === 3){ message = "All order delivered." }
        if(status === 4){ message = "Order finished." }

        notifyKitchen()
        notifyTable({idMeja: d.idMeja, message: message})
    }

    const finishOrder = async () => {
        const data = {idPesanan: d.idPesanan, idMeja: d.idMeja, idAdmin: idAdmin, total: total}
        const JSONdata = JSON.stringify(data)
        const endpoint = '../api/inserttransaksi'
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSONdata
        }
    
        const response = await fetch(endpoint, options)
        const result = await response.json()

        notifyKitchen()
        notifyTable({idMeja: d.idMeja, message: "Order finished."})
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

    const handleChangeAdditionalAccept = (jumlah, index, max) => {
        const temp = jumlahAdditionalAccept.slice()
        if(jumlah > max){ jumlah = max }
        if(!jumlah){ jumlah = 0 }
        temp[index] = jumlah
        setJumlahAdditionalAccept(temp)
        console.log(jumlahAdditionalAccept)
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
        let message = `${dataMenu[isiPesanan - 1].namaMenu} x ${jumlah} delivered`

        notifyKitchen()
        notifyTable({idMeja: d.idMeja, message: message})
        setJumlahDeliver(new Array(d.isiPesanan.length).fill(0))
        setJumlahReject(new Array(d.isiPesanan.length).fill(0))
    }

    const cancelMenu = async (isiPesanan, jumlah) => {
        const data = {
            idPesanan: d.idPesanan,
            isiPesanan: isiPesanan,
            jumlah: jumlah
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
        let message = `${dataMenu[isiPesanan - 1].namaMenu} x ${jumlah} rejected`

        notifyKitchen()
        notifyTable({idMeja: d.idMeja, message: message})
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
        const message = `Additional order ${dataMenu[isiPesanan - 1].namaMenu} x ${jumlah} rejected`

        notifyKitchen()
        notifyTable({idMeja: d.idMeja, message: message})
        setJumlahAdditionalReject(new Array(d.isiPesanan.length).fill(0))
    }

    const acceptMenuTambahan = async (isiPesanan, jumlah) => {
        const data = {
            idPesanan: d.idPesanan,
            isiPesanan: isiPesanan,
            jumlah: jumlah
        }

        const JSONdata = JSON.stringify(data)
        const endpoint = '../api/acceptmenutambahan'

        const options = {
            method: "PUT",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSONdata
        }
        const response = await fetch(endpoint, options)
        const result = await response.json()
        const message = `Additional order ${dataMenu[isiPesanan - 1].namaMenu} x ${jumlah} accepted`

        notifyKitchen()
        notifyTable({idMeja: d.idMeja, message: message})
        setJumlahAdditionalAccept(new Array(d.isiPesanan.length).fill(0))
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
        const message = `${dataMenu[isiPesanan - 1].namaMenu} x ${jumlah} rejected`

        notifyKitchen()
        notifyTable({idMeja: d.idMeja, message: message})
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
        notifyTable({idMeja: d.idMeja, message: "All additional order accepted."})
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
        notifyTable({idMeja: d.idMeja, message: "All additional order rejected."})
        setJumlahDeliver(new Array(d.isiPesanan.length).fill(0))
        setJumlahReject(new Array(d.isiPesanan.length).fill(0))
        setJumlahAdditionalReject(new Array(d.isiPesanan.length).fill(0))
    }

    const handleRequestCancel = async (aksi, idPesanan, isiPesanan) => {
        const data = {aksi: aksi, idPesanan: idPesanan, isiPesanan: isiPesanan}
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

        let message = ''
        if(aksi === 'reject') { message = `${dataMenu[isiPesanan - 1].namaMenu} cancellation request rejected`}
        if(aksi === 'approve') { message = `${dataMenu[isiPesanan - 1].namaMenu} cancellation request approved`}

        notifyKitchen()
        notifyTable({idMeja: d.idMeja, message: message})
    }

    const date = new Date()

    // const toSeconds = (t) => {
    //     let x = t.split(':');
    //     return (x[0] * 3600) + (x[1] * 60) + (x[2] * 1)
    // }

    const formatter = (n) => {return (n < 10 ? '0' : '') + n}

    // const toHMS = (secs) => {
    //     return formatter(parseInt(secs/3600)) + 'h:' + formatter(parseInt(secs%3600/60)) + 'm:' + formatter(parseInt(secs%60)) + "s"
    // }

    const formatTime = (t) => {
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
        if(printAdditional === 1){
            printOrder(index)
            window.onafterprint = () => {
                setPrintAdditional(0)
            }
        }
    },[printAdditional]) 

    return(
        <div className={styles.ordercard}> 
        {console.log(d)}
            {d.statusPesanan === 3 && <h1 className={styles.printinfo}>Thank You!</h1>}

            <div className={styles.orderinfo}>
                <p className={styles.printinfo}>{new Date().toString().slice(0,25)}</p>
                <p className={styles.table}><b>Table: {d.idMeja}</b></p>
                {/* {d.statusPesanan < 3 ? <p className={styles.waitingtime}><b>Waiting Time: {toHMS(toSeconds(time) - toSeconds(d.jam.split(".")[0]))}</b></p> : null} */}
                {d.statusPesanan < 3 ? <p className={styles.waitingtime}><b>Waiting Time: {timeCalculator(d.jam.split('.')[0], time)}</b></p> : null}
            </div>

            <p className={styles.uuid}>ID: {d.uuid}</p>

            <div className={printAdditional === 0 ? styles.orderlistcontainer : styles.dontprint}>
                <div className={styles.orderlist}>
                {d.isiPesanan.map((order, index) => 
                    (d.status[index] != 4 && d.status[index] != 3) &&
                    <>
                        {
                            // status: 1 => TerdiriPesanan baru (ongoing)
                            // status: 2 => TerdiriPesanan delivered semua
                            // status: 3 => TerdiriPesanan additional order
                            // status: 4 => TerdiriPesanan cancelled order
                            // status: 5 => TerdiriPesanan asking to be cancelled order
                        }

                        {
                            // statusPesanan 1: pesanan baru
                            // statusPesanan 2: pesanan diproses
                            // statusPesanan 3: pesanan menunggu pembayaran
                            // statusPesanan 4: pesanan sudah dibayar / selesai
                            // statusPesanan 5: pesanan dibatalkan
                            // YANG DICATET DI TABEL: KELOLAPESANAN CUMA 2 DAN 4
                        }

                        <div key={index} className={styles.orderitem}>
                            <p className={d.status[index] == 3 && styles.additionalorder}>{dataMenu[order - 1].namaMenu}</p> {/* nama menu */}
                            {d.statusPesanan == 1 && <p className={styles.orderjumlah}>x {d.jumlah[index]}</p>} {/* jumlah (x 3) */}
                            {d.statusPesanan > 1 && <p className={styles.orderjumlah}>{d.delivered[index]}/{d.jumlah[index]}</p>} {/* delivered (1/3) */}
                            {d.statusPesanan === 3 && <p className={styles.harga}>Rp {dataMenu[order - 1].harga.toLocaleString()}</p>}

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
                                            <button className='btn-primary' onClick={() => deliverOneOrder(d.isiPesanan[index], jumlahDeliver[index])}>deliver</button>
                                            <button className='btn-danger' onClick={() => rejectOneOrder(d.isiPesanan[index], jumlahReject[index])}>reject</button>
                                        </>}
                                    </div>
                                </div>
                            }
                        </div>

                        {d.isiPaket[index].length > 0 && 
                            d.isiPaket[index].map((isi, i) => 
                                <p className={styles.isiPaket}>
                                    {d.jumlahPaket[index][i] * (d.jumlah[index] - d.delivered[index]) } x {dataMenu[isi - 1].namaMenu}
                                </p>
                            )
                        }

                        {d.requestcancel[index] > 0 && 
                            <div className={styles.requestcancel}>
                                <p>Cancellation requested</p>
                                <p> x {d.requestcancel[index]}</p>
                                <button className='btn-primary' onClick={() => handleRequestCancel('approve', d.idPesanan, d.isiPesanan[index])}>Approve</button>
                                <button className='btn-danger' onClick={() => handleRequestCancel('reject', d.idPesanan, d.isiPesanan[index])}>Reject</button>
                            </div>
                        }
                        <div className={styles.garisbawah}></div>
                    </>
                )}
                </div>
            </div>

            {d.statusPesanan === 3 && 
            <div className={styles.total}>
                <label>
                    <p>Subtotal: </p> 
                    <p>Rp {calculateTotal().toLocaleString()}</p>
                </label>
                <label>
                    <p>Tax: </p> 
                    <p>Rp {(calculateTotal() * .1).toLocaleString()}</p>
                </label>
                <label>
                    <p>Services: </p> 
                    <p>Rp {(calculateTotal() * .05).toLocaleString()}</p>
                </label>
                <label>
                    <h4>Total: </h4> 
                    <h4>Rp {total.toLocaleString()}</h4>
                </label>
            </div>
            }

            <div className={styles.btn}>
                {status === 1 && <button className='btn-primary' onClick={() => handleOrder(2)}>Accept</button>}
                {status === 2 && <button className='btn-primary' onClick={() => handleOrder(3)}>Deliver All</button>}   
                {status >= 2 && <button className='btn-primary' onClick={() => printOrder(index)}>Print</button>}     
                {status === 3 && <button className='btn-primary' onClick={() => {handleOrder(4); finishOrder()}}>Done</button>}    
            </div>

            {/* ADDITIONAL ORDER */}
            {d.status.some( s => s == 3) && 
                <div className={printAdditional === 1 ? styles.printadditional : styles.dontprint}>
                    <div className={styles.additionalordercontainer}>
                        <h4>Additional Order</h4>
                        <div className={styles.orderlisttambahan}>
                            {d.isiPesanan.map((order, index) => (d.status[index] === 3) && 
                            <div className={styles.listtambahan}>
                                <div key={index} className={styles.orderitem}>
                                    <p className={styles.additionalorder}>{dataMenu[order - 1].namaMenu}</p> 
                                    <p className={styles.orderjumlah}>x {d.jumlah[index]}</p>

                                    <div className={styles.orderaction}>
                                        <div className={styles.orderinput}> 
                                            <input type='number' min="0" className={styles.inputnumber} onChange={({target}) => handleChangeAdditionalAccept(target.value, index, d.jumlah[index] - d.delivered[index])} value={jumlahAdditionalAccept[index]}></input>
                                            <input type='number' min="0" className={styles.inputnumber} onChange={({target}) => handleChangeAdditionalReject(target.value, index, d.jumlah[index] - d.delivered[index])} value={jumlahAdditionalReject[index]}></input>
                                        </div>

                                        <div className={styles.orderbutton}> 
                                            <button className='btn-primary' onClick={() => {acceptMenuTambahan(d.isiPesanan[index], jumlahAdditionalAccept[index])}}>accept</button>
                                            <button className='btn-danger' onClick={() => {cancelMenuTambahan(d.isiPesanan[index], jumlahAdditionalReject[index])}}>reject</button>
                                        </div>
                                    </div>
                                </div>
                                {d.isiPaket[index].length > 0 && d.isiPaket[index].map(isi => <p className={styles.isiPaket}>{d.jumlahPaket[index] * (d.jumlah[index] - d.delivered[index]) } x {dataMenu[isi - 1].namaMenu}</p>)}
                            </div>
                            )}
                        </div>

                        <div>
                            <button className='btn-primary' onClick={acceptAdditionalOrder}>Accept All</button>
                            <button className='btn-primary' onClick={() => setPrintAdditional(1)}>Print</button>
                            <button className='btn-danger' onClick={rejectAdditionalOrder}>Reject All</button>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}