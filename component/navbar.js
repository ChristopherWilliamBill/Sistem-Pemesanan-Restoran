import styles from '../styles/NavBar.module.css'
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

export default function NavBar({currentPath}){
    const router = useRouter()

    const inititalSelectedPage = {
        '/admin': false,
        '/admin/table': false,
        '/admin/transactionhistory': false,
        '/admin/editmenu': false,
        '/admin/addmenu': false,
        '/admin/editemployee': false,
        '/admin/addemployee': false,
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

                <div className={styles.card} onClick={() => handleClick("/admin/orderqueue")}>
                    Order Queue
                </div>

                <div className={styles.card} onClick={() => handleClick("/admin/kitchen")}>
                    Kitchen
                </div>

                <div className={selectedPage['/admin/table'] ? styles.selected : styles.card} onClick={() => handleClick("/admin/table")}>
                    Table
                </div>

                {session.role === "manager" && 
                    <div className={selectedPage['/admin/transactionhistory'] ? styles.selected : styles.card} onClick={() => handleClick("/admin/transactionhistory")}>
                        Transaction History
                    </div>
                }
            </div>

            <div className={styles.section}>
                <h3>Menu</h3>
                <div className={selectedPage['/admin/editmenu'] ? styles.selected : styles.card} onClick={() => handleClick("/admin/editmenu")}>
                    Edit Menu
                </div>

                <div className={selectedPage['/admin/addmenu'] ? styles.selected : styles.card} onClick={() => handleClick("/admin/addmenu")}>
                    Add Menu
                </div>

                <div className={styles.card} onClick={() => handleClick("/")}>
                    Menu
                </div>
            </div>

            {session.role === "manager" && 
                <div className={styles.section}>
                    <h3>Employee</h3>

                    <div className={selectedPage['/admin/editemployee'] ? styles.selected : styles.card} onClick={() => handleClick("/admin/editemployee")}>
                    Edit Employee
                    </div>

                    <div className={selectedPage['/admin/addemployee'] ? styles.selected : styles.card} onClick={() => handleClick("/admin/addemployee")}>
                    Add Employee
                    </div>
                </div>
            }
        </div>
    )
}