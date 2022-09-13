import styles from '../styles/MenuCard.module.css'

export default function MenuCard({menu, addToOrder, learnMore}){

    return(
        <div key={menu.id} className={styles.menucard}>
            <h3>{menu.namaMenu}</h3>
            <p>{menu.deskripsiMenu}</p>
            <p>IDR {menu.harga}</p>
            <div>
                <button onClick={() => learnMore(menu)}>learn more</button>
                <button onClick={() => addToOrder(menu)}>add to order</button>
            </div>
        </div>
    )
}