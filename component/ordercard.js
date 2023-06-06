import styles from "../styles/OrderCard.module.css"
import OrderItem from './orderitem';
import Swal from "sweetalert2";

export default function OrderCard({order, orderTambahan, addToOrder, reduceOrder, resetOrder, notifyKitchen, occupyTable, isWaiting, setIsWaiting, meja, idPesanan, getCurrentOrder, setExtendOrder, extendOrder, jumlahCancel, setJumlahCancel, jumlahCancelAdditional, setJumlahCancelAdditional, uuid}){
    
    const handleSubmit = async (tipe) => {
        if(order.reduce((i, o) => {return i + o.count}, 0) == 0){
            Swal.fire({title: "Order your desired menu by clicking the menu card on the left.", timer: 2000, showConfirmButton: false, icon: "info"})
            return
        }

        const dataOrder = order.filter(o => o.count > 0)
        const idMeja = meja.substring(6, meja.length)

        let JSONdata = null
        let endpoint = ''

        if(tipe === 'additional'){
            const data = {
                idMeja: idMeja,
                dataOrder: dataOrder,
                idPesanan: idPesanan
            }
                
            JSONdata = JSON.stringify(data)
            endpoint = '../api/order/additional'
        }else{
            const data = {
                idMeja: idMeja,
                dataOrder: dataOrder,
            }
                
            JSONdata = JSON.stringify(data)
            endpoint = '../api/order'
        }

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSONdata
        }

        Swal.fire({
            title: 'Make Order?',
            showCancelButton: true,
            confirmButtonText: 'Order',
            denyButtonText: 'Cancel',
        }).then(async (result) => {
            if(result.isConfirmed){
                const response = await fetch(endpoint, options)
                const result = await response.json()
                if(result.message === "Order Success"){
                    if(tipe === 'new'){
                        occupyTable()
                    }
                    notifyKitchen()
                    resetOrder()
                    getCurrentOrder(meja.substring(6, meja.length))
                    setIsWaiting(true)
                    setExtendOrder(false)
                    Swal.fire({title: result.message, timer: 1500, showConfirmButton: false, icon: "success"})
                }
            }
        })
    }

    const requestCancel = async (menu, jumlah) => {
        if(jumlah === 0){ return }
        const data = {
            idPesanan: idPesanan,
            isiPesanan: menu.idMenu,
            jumlah: jumlah
        }

        const JSONdata = JSON.stringify(data)
        const endpoint = '../api/cancellationrequest'
        const options = {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSONdata
        }

        Swal.fire({
            title: 'Cancel menu?',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then(async (result) => {
            if(result.isConfirmed){
                const response = await fetch(endpoint, options)
                const result = await response.json()

                setJumlahCancel([])
                getCurrentOrder(meja.substring(6, meja.length))
                notifyKitchen()
            }
        })
    }

    const cancelMenu = async (menu, jumlah) => {
        if(jumlah === 0){ return }
        const data = {
            tipe: 'cancel',
            jumlah: jumlah
        }

        const JSONdata = JSON.stringify(data)
        const endpoint = `../api/order/${idPesanan}/${menu.idMenu}`
        const options = {
            method: "PUT",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSONdata
        }

        Swal.fire({
            title: 'Cancel menu?',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then(async (result) => {
            if(result.isConfirmed){
                const response = await fetch(endpoint, options)
                const result = await response.json()

                setJumlahCancel([])
                getCurrentOrder(meja.substring(6, meja.length))
                notifyKitchen()

                if(result.message === "All menu cancelled"){
                    resetOrder()
                    setIsWaiting(false)
                    setExtendOrder(false)
                }
            }
        })
    }

    const cancelAdditional = async (menu, jumlah) => {
        if(jumlah === 0){ return }
        const data = {
            jumlah: jumlah
        }

        const JSONdata = JSON.stringify(data)
        const endpoint = `../api/order/additional/${idPesanan}/${menu.idMenu}`
        const options = {
            method: "PUT",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSONdata
        }
        const response = await fetch(endpoint, options)
        const result = await response.json()

        setJumlahCancelAdditional([])
        getCurrentOrder(meja.substring(6, meja.length))
        notifyKitchen()

        if(result.message === "All menu cancelled"){
            resetOrder()
            setIsWaiting(false)
            setExtendOrder(false)
        }
    }

    const handleClick = (aksi, index, max) => {
        const temp = [...jumlahCancel]

        if(aksi === '-'){ temp[index]-- }
        if(aksi === '+'){ temp[index]++ }

        if(temp[index] > max){ temp[index] = max }
        if(temp[index] < 0){ temp[index] = 0 }

        setJumlahCancel(temp)
    }

    const handleClickAdditional = (aksi, index, max) => {
        const temp = [...jumlahCancelAdditional]

        if(aksi === '-'){ temp[index]-- }
        if(aksi === '+'){ temp[index]++ }

        if(temp[index] > max){ temp[index] = max }
        if(temp[index] < 0){ temp[index] = 0 }

        setJumlahCancelAdditional(temp)
    }

    return(
        <div className={styles.ordercontainer}>
            { isWaiting ? 
                <>
                    {order.some(o => o.statusPesanan == 1 ) && <h3>Waiting for comfirmation.</h3>}
                    {order.some(o => o.statusPesanan == 2 ) && <h3>Your order is being prepared.</h3>}
                    {order.some(o => o.statusPesanan == 3 ) && <h3>Enjoy your meals.</h3>}
                    
                    <p className={styles.uuid}>Order ID: {uuid}</p>
                    
                    {order.reduce((i, o) => {return i + o.count}, 0) != 0 ? //cek jumlah count > 0 (ada pesanan)
                        <ul className={styles.ul}>
                            {order.filter(o => o.count > 0).map((or, index) => 
                                <OrderItem key={or.idMenu} or={or} order={order} jumlahCancel={jumlahCancel} jumlahCancelAdditional={jumlahCancelAdditional} index={index} handleClick={handleClick} handleClickAdditional={handleClickAdditional} cancelMenu={cancelMenu} requestCancel={requestCancel} cancelAdditional={cancelAdditional}></OrderItem>
                            )}
                        </ul>
                    : <p style={{textAlign: "center"}}>Order your desired menu by clicking the menu card on the left.</p>}

                    <h4>Total + Tax and Services: IDR {
                        order.filter(o => o.count > 0).reduce(function(totalharga, curmenu){return totalharga + (((curmenu.harga - (curmenu.harga * curmenu.discount/100)) * curmenu.count) * 1.15)}, 0).toLocaleString()}
                    </h4>

                    
                    {orderTambahan.reduce((i, o) => {return i + o.count}, 0) != 0 && //cek jumlah count > 0 (ada pesanan tambahan)
                        <> 
                            <h3>Additional Order</h3>
                            <h5>Waiting For Confirmation</h5>
                            <ul className={styles.ul}>
                            {orderTambahan.filter(ot => ot.count > 0).map((or, index) => 
                                <OrderItem key={or.idMenu} or={or} order={order} jumlahCancel={jumlahCancel} jumlahCancelAdditional={jumlahCancelAdditional} index={index}  handleClick={handleClick} handleClickAdditional={handleClickAdditional} cancelMenu={cancelMenu} requestCancel={requestCancel} cancelAdditional={cancelAdditional}></OrderItem>
                            )}
                            </ul>
                        </>
                    }

                    {orderTambahan.reduce((i, o) => {return i + o.count}, 0) != 0 && 
                    <h4>Total + Tax and Services: IDR {
                        orderTambahan.filter(ot => ot.count > 0).reduce(function(totalTambahan, curmenu){return totalTambahan + (((curmenu.harga - (curmenu.harga * curmenu.discount/100)) * curmenu.count) * 1.15)}, 0).toLocaleString()}
                    </h4>
                    }
                    {!extendOrder && <button onClick={() => setExtendOrder(true)} className='btn-primary'>Add more order</button>}
                </>
            : 
                <>
                    {!extendOrder ? <h3>Your Order</h3> : <h3>Additional Order</h3>}

                    {order.reduce((i, o) => {return i + o.count}, 0) != 0 ?
                        <ul className={styles.ul}>
                            {order.filter(o => o.count > 0).map(or => 
                                <div key={or.idMenu}>
                                    <li className={styles.orderlist}>
                                        <p>{or.namaMenu}</p>
                                        <p>x {or.count}</p>
                                        <button className="btn-primary" onClick={() => addToOrder(or)}>+</button>
                                        <button className="btn-danger" onClick={() => reduceOrder(or)}>-</button>
                                    </li>
                                    {or.isiMenu.length > 0 && <>{or.isiMenu.map(o => <p className={styles.isiPaket} key={o.isiMenu}>{order[o.isiMenu - 1].namaMenu} x {o.jumlah * or.count}</p>)}</>}
                                </div>
                            )}
                        </ul>
                    : <p style={{textAlign: "center"}}>Order your desired menu by clicking the menu card on the left.</p>}

                    {<h4>Total + Tax and Services: IDR {order.filter(o => o.count > 0).reduce(function(totalharga, curmenu){return totalharga + (((curmenu.harga - (curmenu.harga * curmenu.discount/100)) * curmenu.count) * 1.15)}, 0).toLocaleString()}</h4>}
                    <div>
                        <button onClick={resetOrder} className='btn-danger'>clear</button>
                        <button onClick={() => !extendOrder ? handleSubmit('new') : handleSubmit('additional')} className="btn-primary">make order</button>
                    </div>
                </>
            }
        </div>
    )
}