import styles from "../styles/OrderCard.module.css"
import OrderItem from './orderitem';

export default function OrderCard({order, orderTambahan, addToOrder, reduceOrder, resetOrder, notifyKitchen, isWaiting, setIsWaiting, meja, idPesanan, getCurrentOrder, setExtendOrder, extendOrder, jumlahCancel, setJumlahCancel, jumlahCancelAdditional, setJumlahCancelAdditional, uuid}){
    
    const handleSubmit = async (tipe) => {
        if(order.reduce((i, o) => {return i + o.count}, 0) == 0){
            alert("Order your desired menu by clicking the menu card on the left.")
            return
        }

        const dataOrder = order.filter(o => o.count > 0)

        const idMeja = meja.substring(6, meja.length)
        const data = {
            idMeja: idMeja,
            dataOrder: dataOrder,
            tipe: tipe,
            ...(idPesanan && {idPesanan: idPesanan})
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
            resetOrder()
            getCurrentOrder(meja.substring(6, meja.length))
            setIsWaiting(true)
            setExtendOrder(false)
        }

        alert(result.message)
    }

    const requestCancel = async (menu, jumlah) => {
        if(jumlah === 0){ return }
        const data = {
            idPesanan: idPesanan,
            isiPesanan: menu.idMenu,
            jumlah: jumlah
        }

        const JSONdata = JSON.stringify(data)
        const endpoint = '../api/requestcancel'
        const options = {
            method: "PUT",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSONdata
        }
        const response = await fetch(endpoint, options)
        const result = await response.json()

        setJumlahCancel([])
        getCurrentOrder(meja.substring(6, meja.length))
        notifyKitchen()
    }

    const cancelMenu = async (menu, jumlah) => {
        if(jumlah === 0){ return }
        const data = {
            idPesanan: idPesanan,
            isiPesanan: menu.idMenu,
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

        setJumlahCancel([])
        getCurrentOrder(meja.substring(6, meja.length))
        notifyKitchen()

        if(result.message === "All menu cancelled"){
            resetOrder()
            setIsWaiting(false)
            setExtendOrder(false)
        }
    }

    const cancelAdditional = async (menu, jumlah) => {
        if(jumlah === 0){ return }
        const data = {
            idPesanan: idPesanan,
            isiPesanan: menu.idMenu,
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

        setJumlahCancelAdditional([])
        getCurrentOrder(meja.substring(6, meja.length))
        notifyKitchen()

        if(result.message === "All menu cancelled"){
            resetOrder()
            setIsWaiting(false)
            setExtendOrder(false)
        }
    }

    const handleChange = (jumlah, index, max) => {
        let temp = [...jumlahCancel]
        if(!jumlah){ jumlah = 0 }
        if(jumlah > max){ jumlah = max }

        temp[index] = jumlah
        setJumlahCancel(temp)
    }

    const handleChangeAdditional = (jumlah, index, max) => {
        let temp = [...jumlahCancelAdditional]
        if(!jumlah){ jumlah = 0 }
        if(jumlah > max){ jumlah = max }

        temp[index] = jumlah
        setJumlahCancelAdditional(temp)
    }

    return(
        <div className={styles.ordercontainer}>
            {console.log(order)}
            { isWaiting ? 
                <>
                    {order.some(o => o.statusPesanan == 1 ) && <h3>Waiting for comfirmation.</h3>}
                    {order.some(o => o.statusPesanan == 2 ) && <h3>Your order is being prepared.</h3>}
                    {order.some(o => o.statusPesanan == 3 ) && <h3>Enjoy your meals.</h3>}
                    
                    <p className={styles.uuid}>Order ID: {uuid}</p>
                    
                    {order.reduce((i, o) => {return i + o.count}, 0) != 0 ? //cek jumlah count > 0 (ada pesanan)
                        <ul className={styles.ul}>
                            {order.filter(o => o.count > 0).map((or, index) => 
                            <>
                                <OrderItem or={or} jumlahCancel={jumlahCancel} jumlahCancelAdditional={jumlahCancelAdditional} index={index} handleChange={handleChange} handleChangeAdditional={handleChangeAdditional}cancelMenu={cancelMenu} requestCancel={requestCancel} cancelAdditional={cancelAdditional}></OrderItem>
                                {or.isiMenu.length > 0 && <>{or.isiMenu.map(o => <p>{order[o.isiMenu - 1].namaMenu} x {o.jumlah * or.count}</p>)}</>}
                            </>
                            )}
                        </ul>
                    : <p style={{textAlign: "center"}}>Order your desired menu by clicking the menu card on the left.</p>}
                    
                    {orderTambahan.reduce((i, o) => {return i + o.count}, 0) != 0 && //cek jumlah count > 0 (ada pesanan)
                        <> 
                            <h3>Additional Order</h3>
                            <ul className={styles.ul}>
                            {orderTambahan.filter(ot => ot.count > 0).map((or, index) => 
                                <>
                                    <OrderItem or={or} jumlahCancel={jumlahCancel} jumlahCancelAdditional={jumlahCancelAdditional} index={index} handleChange={handleChange} handleChangeAdditional={handleChangeAdditional}cancelMenu={cancelMenu} requestCancel={requestCancel} cancelAdditional={cancelAdditional}></OrderItem>
                                    {or.isiMenu.length > 0 && <>{or.isiMenu.map(o => <p>{order[o.isiMenu - 1].namaMenu} x {o.jumlah * or.count}</p>)}</>}
                                </>
                            )}
                            </ul>
                        </>
                    }

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
                                    {or.isiMenu.length > 0 && <>{or.isiMenu.map(o => <p>{order[o.isiMenu - 1].namaMenu} x {o.jumlah * or.count}</p>)}</>}
                                </>
                            )}
                        </ul>
                    : <p style={{textAlign: "center"}}>Order your desired menu by clicking the menu card on the left.</p>}

                    {<h3>Total: IDR {order.filter(o => o.count > 0).reduce(function(totalharga, curmenu){return totalharga + (curmenu.harga * curmenu.count)}, 0).toLocaleString()}</h3>}
                    <div>
                        <button onClick={resetOrder} className='btn-danger'>clear</button>
                        <button onClick={() => !extendOrder ? handleSubmit('new') : handleSubmit('additional')} className="btn-primary">make order</button>
                    </div>
                </>
            }
        </div>
    )
}