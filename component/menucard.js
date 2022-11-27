import styles from '../styles/MenuCard.module.css'

export default function MenuCard({menu, addToOrder, learnMore}){

    return(
        <div className={styles.menucard} onClick={() => addToOrder(menu)}>
            <h3>{menu.namaMenu}</h3>
            <p>{menu.deskripsiMenu}</p>
            <p>IDR {menu.harga}</p>
        </div>
    )
}