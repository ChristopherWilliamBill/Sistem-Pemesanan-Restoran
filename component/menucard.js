import styles from '../styles/MenuCard.module.css'

export default function MenuCard({menu, addToOrder, addToOrderTambahan, extendOrder}){

    const handleOrder = (menu) => {
        if(extendOrder){
            addToOrderTambahan(menu)
        }else{
            addToOrder(menu)
        }
    }

    return(
        <div className={styles.menucard} onClick={() => handleOrder(menu)}>
            <h3>{menu.namaMenu}</h3>
            <p>{menu.deskripsiMenu}</p>
            <p>IDR {menu.harga.toLocaleString()}</p>
        </div>
    )
}