import styles from '../styles/MenuCard.module.css'

export default function MenuCard({menu, addToOrder, addToInputOrderTambahan, extendOrder}){

    const handleOrder = (menu) => {
        if(extendOrder){
            addToInputOrderTambahan(menu)
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