import styles from '../styles/OrderItem.module.css'

export default function OrderItem({or, jumlahCancel, jumlahCancelAdditional, index, handleChange, handleChangeAdditional, cancelMenu, requestCancel, cancelAdditional}){

    return(
        <li className={styles.orderlistfinished}>
            <p>{or.namaMenu}</p>
            {(or.statusPesanan == 1 || or.statusPesanan > 2) && <p>x {or.count}</p>}

            {or.statusPesanan == 1 && <div className={styles.aksicontainer}>
                <input type="number" min="0" value={jumlahCancel[index]} max={or.count - or.delivered} onChange={({target}) => handleChange(target.value, index, or.count - or.delivered)}></input>
                <button className='btn-danger' onClick={() => cancelMenu(or, jumlahCancel[index])}>cancel</button>
            </div>}

            {(or.statusPesanan > 1) && <p>{or.delivered}/{or.count}</p>} 
            {(or.statusPesanan == 2 && or.count == or.delivered) && <p>delivered</p>}
            {(or.statusPesanan == 2 && or.count != or.delivered) && 
                <div className={styles.aksicontainer}>
                    {/* <button className='btn-danger' onClick={() => requestCancel(or, jumlahCancelAdditional[index])}>cancel</button> */}
                    {typeof or.requestcancel !== 'undefined' ?
                        <>
                            <input type="number" min="0" value={jumlahCancel[index]} max={or.count - or.delivered - or.requestcancel} onChange={({target}) => handleChange(target.value, index, or.count - or.delivered - or.requestcancel)}></input>
                            <button className='btn-danger' onClick={() => requestCancel(or, jumlahCancel[index])}>cancel</button>
                        </> 
                    :
                        <>
                            <input type="number" min="0" value={jumlahCancelAdditional[index]} max={or.count - or.delivered} onChange={({target}) => handleChangeAdditional(target.value, index, or.count - or.delivered)}></input>
                            <button className='btn-danger' onClick={() => cancelAdditional(or, jumlahCancelAdditional[index])}>cancel</button>
                        </>
                    }
                </div>
            }
            {or.requestcancel > 0 && <p>x {or.requestcancel} requested to cancel</p>}
        </li>
    )
}