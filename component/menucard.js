import styles from '../styles/MenuCard.module.css'
import Image from 'next/image'

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
            <div className={styles.imagecontainer}>
                <Image 
                    src="/v1678895940/3ayamgoreng_l0ynmq.jpg"
                    width={600}
                    height={400}
                    
                    //onError={handleError}
                />
            </div>
            <h3>{menu.namaMenu}</h3>
            <p>{menu.deskripsiMenu}</p>
            <p><b>IDR {menu.harga.toLocaleString()}</b></p>
        </div>
    )
}