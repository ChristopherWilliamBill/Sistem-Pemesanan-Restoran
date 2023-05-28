import styles from '../styles/OrderItem.module.css'

export default function OrderItem({or, order, jumlahCancel, jumlahCancelAdditional, index, handleClick, handleClickAdditional, cancelMenu, requestCancel, cancelAdditional}){

    return(
        <li className={styles.container}>
            <p>{or.namaMenu}</p>
            {(or.statusPesanan == 1 || or.statusPesanan > 2) && <p>x {or.count}</p>}

            {or.statusPesanan == 1 && 
            <div className={styles.aksicontainer}>
                <div className={styles.jumlah}>
                    <button className='btn-primary' onClick={() => handleClick('-', index, or.count - or.delivered)}>-</button>
                    {jumlahCancel[index]}
                    <button className='btn-primary' onClick={() => handleClick('+', index, or.count - or.delivered)}>+</button>
                </div>
                

                {/* <input type="number" min="0" onFocus={handleFocus} value={jumlahCancel[index]} max={or.count - or.delivered} onChange={({target}) => handleChange(target.value, index, or.count - or.delivered)}></input> */}
                <button className='btn-danger' onClick={() => cancelMenu(or, jumlahCancel[index])}>cancel</button>
            </div>}

            {((or.statusPesanan < 3 && or.statusPesanan > 1) && or.status)  && <p>{or.delivered}/{or.count}</p>} 
            {(!or.status) && <p>x {or.count}</p>} 

            {(or.statusPesanan == 2 && or.count == or.delivered) && <p>delivered</p>}
            {or.statusPesanan == 3 && <p>delivered</p>}
            {(or.statusPesanan == 2 && or.count != or.delivered) && 
                <div className={styles.aksicontainer}>
                    {/* <button className='btn-danger' onClick={() => requestCancel(or, jumlahCancelAdditional[index])}>cancel</button> */}
                    {typeof or.requestcancel !== 'undefined' ?
                        <> 
                            <div className={styles.jumlah}>
                                <button className='btn-primary' onClick={() => handleClick('-', index, or.count - or.delivered - or.requestcancel)}>-</button>
                                {jumlahCancel[index]}
                                <button className='btn-primary' onClick={() => handleClick('+', index, or.count - or.delivered - or.requestcancel)}>+</button>
                            </div>
                            {/* <input type="number" min="0" onFocus={handleFocus} value={jumlahCancel[index]} max={or.count - or.delivered - or.requestcancel} onChange={({target}) => handleChange(target.value, index, or.count - or.delivered - or.requestcancel)}></input> */}
                            <button className='btn-danger' onClick={() => requestCancel(or, jumlahCancel[index])}>cancel</button>
                        </> 
                    :
                        <>
                            <div className={styles.jumlah}>
                                <button className='btn-primary' onClick={() => handleClickAdditional('-', index, or.count)}>-</button>
                                {jumlahCancelAdditional[index]}
                                <button className='btn-primary' onClick={() => handleClickAdditional('+', index, or.count)}>+</button>
                            </div>
                            {/* <input type="number" min="0" onFocus={handleFocus} value={jumlahCancelAdditional[index]} max={or.count - or.delivered} onChange={({target}) => handleChangeAdditional(target.value, index, or.count)}></input> */}
                            <button className='btn-danger' onClick={() => cancelAdditional(or, jumlahCancelAdditional[index])}>cancel</button>
                        </>
                    }
                </div>
            }
            <div className={styles.info}>
                {or.requestcancel > 0 && <p>x {or.requestcancel} requested to cancel</p>}
                {/* Paket utama */}
                {(or.isiMenu.length > 0 && or.status <= 1) && <>{or.isiMenu.map(o => <p key={or.isiMenu}>{order[o.isiMenu - 1].namaMenu} x {o.jumlah * or.count}</p>)}</>}
                {(or.isiMenu.length > 0 && or.status > 1) && <>{or.isiMenu.map(o => <p key={or.isiMenu}>{order[o.isiMenu - 1].namaMenu} {or.delivered * o.jumlah}/{o.jumlah * or.count}</p>)}</>}

                {/* Paket additional */}
                {(or.isiMenu.length > 0 && !or.status) && <>{or.isiMenu.map(o => <p key={or.isiMenu}>{order[o.isiMenu - 1].namaMenu} x {o.jumlah * or.count}</p>)}</>} 
            </div>
        </li>
    )
}