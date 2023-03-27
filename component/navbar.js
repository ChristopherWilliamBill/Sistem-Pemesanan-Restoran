import styles from '../styles/NavBar.module.css'
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

export default function NavBar({currentPath}){
    const router = useRouter()

    const inititalSelectedPage = {
        '/admin': false,
        '/admin/meja': false,
        '/admin/riwayattransaksi': false,
        '/admin/editmenu': false,
        '/admin/tambahmenu': false,
        '/admin/editkaryawan': false,
        '/admin/tambahkaryawan': false,
    }

    const { data: session, status } = useSession()
    const [current, setCurrent] = useState(currentPath)
    inititalSelectedPage[current] = true

    const [selectedPage, setSelectedPage] = useState(inititalSelectedPage)

    const handleClick = (path) => {
        setSelectedPage({[path]: true})
        router.push(path)
    }

    return(
        <div className={styles.container}>
            <div className={styles.section}>
                <h3>Operational</h3>

                <div className={selectedPage['/admin'] ? styles.selected : styles.card} onClick={() => handleClick("/admin")}>
                    Home
                </div>

                <div className={styles.card} onClick={() => handleClick("/admin/antrianpesanan")}>
                    Order Queue
                </div>

                <div className={styles.card} onClick={() => handleClick("/admin/kitchen")}>
                    Kitchen
                </div>

                <div className={selectedPage['/admin/meja'] ? styles.selected : styles.card} onClick={() => handleClick("/admin/meja")}>
                    Table
                </div>

                {session.role === "manager" && 
                    <div className={selectedPage['/admin/riwayattransaksi'] ? styles.selected : styles.card} onClick={() => handleClick("/admin/riwayattransaksi")}>
                        Transaction History
                    </div>
                }
            </div>

            <div className={styles.section}>
                <h3>Menu</h3>
                <div className={selectedPage['/admin/editmenu'] ? styles.selected : styles.card} onClick={() => handleClick("/admin/editmenu")}>
                    Edit Menu
                </div>

                <div className={selectedPage['/admin/tambahmenu'] ? styles.selected : styles.card} onClick={() => handleClick("/admin/tambahmenu")}>
                    Add Menu
                </div>

                <div className={styles.card} onClick={() => handleClick("/")}>
                    Menu
                </div>
            </div>

            {session.role === "manager" && 
                <div className={styles.section}>
                    <h3>Employee</h3>

                    <div className={selectedPage['/admin/editkaryawan'] ? styles.selected : styles.card} onClick={() => handleClick("/admin/editkaryawan")}>
                    Edit Employee
                    </div>

                    <div className={selectedPage['/admin/tambahkaryawan'] ? styles.selected : styles.card} onClick={() => handleClick("/admin/tambahkaryawan")}>
                    Add Employee
                    </div>
                </div>
            }
        </div>
    )
}