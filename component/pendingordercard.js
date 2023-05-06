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

    const [jumlah, setJumlah] = useState(new Array(d.isiPesanan.length).fill(0))
    const [printAdditional, setPrintAdditional] = useState(0)
    const total = Math.ceil(calculateTotal() * 1.15)

    const handleOrder = async (status) => {
        if(status === 3 && d.requestcancel.some(r => r > 0)){
            alert('Handle cancellation request first!')
            return
        }
        const data = {status: status, idAdmin: idAdmin}
        const JSONdata = JSON.stringify(data)
        const endpoint = `../api/order/${d.idPesanan}`
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
        const endpoint = '../api/transaksi'
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

    const handleChangeJumlah = (count, index, max) => {
        const temp = jumlah.slice()
        if(count > max){ count = max}
        if(!count){ count = 0 }
        temp[index] = parseInt(count)
        setJumlah(temp)
    }

    const deliverOrder = async (isiPesanan, jumlah) => {
        if(jumlah === 0){return}
        const data = {tipe: 'deliver', idAdmin: idAdmin, jumlah:jumlah}
        const JSONdata = JSON.stringify(data)
        const endpoint = `../api/order/${d.idPesanan}/${isiPesanan}`
    
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
        setJumlah(new Array(d.isiPesanan.length).fill(0))
    }

    const rejectAdditionalOrder = async (isiPesanan, jumlah) => {
        const data = {
            tipe: 'reject',
            jumlah: jumlah
        }

        const JSONdata = JSON.stringify(data)
        const endpoint = `../api/order/additional/${d.idPesanan}/${isiPesanan}`

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
        setJumlah(new Array(d.isiPesanan.length).fill(0))
    }

    const acceptAdditionalOrder = async (isiPesanan, jumlah) => {
        if(jumlah === 0){return}
        const data = {
            tipe: 'accept',
            jumlah: jumlah
        }

        const JSONdata = JSON.stringify(data)
        const endpoint = `../api/order/additional/${d.idPesanan}/${isiPesanan}`

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
        setJumlah(new Array(d.isiPesanan.length).fill(0))
    }

    const rejectOrder = async (tipe, isiPesanan, jumlah) => {
        if(jumlah === 0){return}
        const data = {tipe: tipe, idAdmin: idAdmin, jumlah:jumlah}
        const JSONdata = JSON.stringify(data)
        const endpoint = `../api/order/${d.idPesanan}/${isiPesanan}`
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
        setJumlah(new Array(d.isiPesanan.length).fill(0))
    }

    const acceptAllAdditionalOrder = async () => {
        setPrintAdditional(1)
        const data = {tipe: 'accept', idAdmin: idAdmin}
        const JSONdata = JSON.stringify(data)
        const endpoint = `../api/order/additional/${d.idPesanan}`
    
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
        setJumlah(new Array(d.isiPesanan.length).fill(0))
    }

    const rejectAllAdditionalOrder = async () => {
        const data = {tipe: 'reject', idAdmin: idAdmin}
        const JSONdata = JSON.stringify(data)
        const endpoint = `../api/order/additional/${d.idPesanan}`
    
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
        setJumlah(new Array(d.isiPesanan.length).fill(0))
    }

    const handleRequestCancel = async (aksi, idPesanan, isiPesanan) => {
        const data = {aksi: aksi, idPesanan: idPesanan, isiPesanan: isiPesanan}
        const JSONdata = JSON.stringify(data)
        const endpoint = '../api/cancellationrequest'

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

    const formatTime = (t) => {
        const ampm = t.split(' ')
        const x = ampm[0].split(':')

        ampm[1] === "PM" ? x[0] = parseInt(x[0]) + 12 : parseInt(x[0]) + 0
        const y = (x[0]) + ":" + (x[1]) + ":" + (x[2])

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
            {d.statusPesanan === 3 && <h1 className={styles.printinfo}>Thank You!</h1>}
            <div className={styles.orderinfo}>
                <p className={styles.printinfo}>{new Date().toString().slice(0,25)}</p>
                <p className={styles.table}>Table: {d.idMeja}</p>
                {d.statusPesanan < 3 ? <p className={styles.waitingtime}><b>Waiting Time: {timeCalculator(d.jam.split('.')[0], time)}</b></p> : null}
            </div>

            <p className={styles.uuid}>ID: {d.uuid}</p>

            <div className={printAdditional === 0 ? styles.orderlistcontainer : styles.dontprint}>
                <div className={styles.orderlist}>
                {d.isiPesanan.map((order, index) => d.status[index] !== 3 && (
                    <div key={order}>
                        <div className={styles.orderitem}>
                            <p className={styles.namamenu}>{dataMenu[order - 1].namaMenu}</p> {/* nama menu */}
                            {(d.statusPesanan === 1 || d.statusPesanan === 3) && <p className={styles.orderjumlah}>x {d.jumlah[index]}</p>} {/* jumlah (x 3) */}
                            {(d.statusPesanan > 1 && d.statusPesanan !== 3) && <p className={styles.orderjumlah}>{d.delivered[index]}/{d.jumlah[index]}</p>} {/* delivered (1/3) */}
                            {d.statusPesanan === 3 && <p className={styles.harga}>Rp {dataMenu[order - 1].harga.toLocaleString()}</p>}

                            {/* Jika tidak ada request cancel...
                                Jika ada, harus ditanggapi terlebih dahulu */}
                            {d.requestcancel[index] === 0 &&
                                <div className={styles.orderaction}>
                                    {(d.delivered[index] === d.jumlah[index] && d.statusPesanan) === 2 && <p className={styles.delivered}>delivered</p>}
                                    
                                    {((d.statusPesanan === 2 && d.delivered[index] < d.jumlah[index]) || d.statusPesanan === 1) && 
                                    <div className={styles.orderinput}> 
                                        <>
                                            <input type='number' min="0" className={styles.inputnumber} onChange={({target}) => handleChangeJumlah(target.value, index, d.jumlah[index] - d.delivered[index])} value={jumlah[index]}></input>
                                        </>
                                    </div>}

                                    {d.statusPesanan === 1 && 
                                    <div className={styles.orderbutton}> 
                                        <>
                                            <button className='btn-danger' onClick={() => rejectOrder('reject', d.isiPesanan[index], jumlah[index])}>reject</button>
                                        </>
                                    </div>}

                                    {(d.delivered[index] != d.jumlah[index]) && d.statusPesanan === 2 && 
                                    <div className={styles.orderbutton}>     
                                        <>
                                            <button className='btn-primary' onClick={() => deliverOrder(d.isiPesanan[index], jumlah[index])}>deliver {jumlah[index]}</button>
                                        </>
                                    </div>}
                                </div>
                            }
                        </div>

                        {d.isiPaket[index].length > 0 && 
                            d.isiPaket[index].map((isi, i) => (d.statusPesanan === 3 || d.statusPesanan === 1) ?
                                (<p key={isi} className={styles.isiPaket}> 
                                    x {d.jumlahPaket[index][i] * (d.jumlah[index])} {dataMenu[isi - 1].namaMenu}
                                </p>)
                                :
                                (<p key={isi} className={styles.isiPaket}> 
                                    {d.jumlahPaket[index][i] * (d.delivered[index])}/{d.jumlahPaket[index][i] * (d.jumlah[index])} {dataMenu[isi - 1].namaMenu}
                                </p>)
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
                    </div>
                ))}
                </div>
            </div>

            {d.statusPesanan === 3 && 
            <div className={styles.total}>
                <label>
                    <p>Subtotal: </p> 
                    <p className={styles.rp}>Rp {calculateTotal().toLocaleString()}</p>
                </label>
                <label>
                    <p>Tax: </p> 
                    <p className={styles.rp}>Rp {(calculateTotal() * .1).toLocaleString()}</p>
                </label>
                <label>
                    <p>Services: </p> 
                    <p className={styles.rp}>Rp {(calculateTotal() * .05).toLocaleString()}</p>
                </label>
                <label>
                    <h4>Total: </h4> 
                    <h4 className={styles.rp}>Rp {total.toLocaleString()}</h4>
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
                            <div key={order} className={styles.listtambahan}>
                                <div className={styles.orderitem}>
                                    <p className={styles.additionalorder}>{dataMenu[order - 1].namaMenu}</p> 
                                    <p className={styles.orderjumlah}>x {d.jumlah[index]}</p>

                                    <div className={styles.orderaction}>
                                        <div className={styles.orderinput}> 
                                            <input type='number' min="0" className={styles.inputnumber} onChange={({target}) => handleChangeJumlah(target.value, index, d.jumlah[index] - d.delivered[index])} value={jumlah[index]}></input>
                                        </div>

                                        <div className={styles.orderbutton}> 
                                            <button className='btn-primary' onClick={() => {acceptAdditionalOrder(d.isiPesanan[index], jumlah[index])}}>accept {jumlah[index]}</button>
                                            <button className='btn-danger' onClick={() => {rejectAdditionalOrder(d.isiPesanan[index], jumlah[index])}}>reject {jumlah[index]}</button>
                                        </div>
                                    </div>
                                </div>
                                
                                {d.isiPaket[index].length > 0 && d.isiPaket[index].map((isi, i) => <p key={isi} className={styles.isiPaket}>{d.jumlahPaket[index][i] * (d.jumlah[index])} x {dataMenu[isi - 1].namaMenu}</p>)}
                            </div>
                            )}
                        </div>

                        <div className={styles.additionalbtn}>
                            <button className='btn-primary' onClick={acceptAllAdditionalOrder}>Accept All</button>
                            <button className='btn-primary' onClick={() => setPrintAdditional(1)}>Print</button>
                            <button className='btn-danger' onClick={rejectAllAdditionalOrder}>Reject All</button>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}