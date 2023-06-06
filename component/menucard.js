import styles from '../styles/MenuCard.module.css'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPepperHot } from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';

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
            <h3>
                {menu.namaMenu}             
            </h3>
            <p className={styles.deskripsi}>{menu.deskripsiMenu}</p>

            <div className={styles.info}>
                {aktif === 1 && <p><b>IDR {menu.discount > 0 ? <><del className={styles.diskon}>{menu.harga.toLocaleString()}</del>{(menu.harga - (menu.harga * menu.discount/100)).toLocaleString()}</> : menu.harga.toLocaleString()}</b></p>}
                {aktif === 0 && <p><b>Sold Out</b></p>}
            </div>

            <div className={styles.iconcontainer}>
                {menu.isSpicy === 1 && <FontAwesomeIcon icon={faPepperHot} className={styles.icon}/>}
                {menu.isFavorite === 1 && <FontAwesomeIcon icon={faThumbsUp} className={styles.icon}/>}
            </div>
        </div>
    )
}