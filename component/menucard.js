import styles from '../styles/MenuCard.module.css'
import Image from 'next/image'

export default function MenuCard({aktif, menu, addToOrder, addToInputOrderTambahan, extendOrder}){

    const handleOrder = (menu) => {
        if(aktif === 0){ return }

        if(extendOrder){
            addToInputOrderTambahan(menu)
        }else{
            addToOrder(menu)
        }
    }

    return(
        <div className={aktif === 1 ? styles.menucard : styles.unavailable} onClick={() => handleOrder(menu)}>
            <div className={styles.imagecontainer}>
                <Image 
                    src={menu.gambar}
                    width={600}
                    height={400}
                />
            </div>
            <h3>{menu.namaMenu}</h3>
            {aktif === 1 && <p>{menu.deskripsiMenu}</p>}
            {aktif === 0 && <p>unavailable</p>}

            <p><b>IDR {menu.harga.toLocaleString()}</b></p>
        </div>
    )
}