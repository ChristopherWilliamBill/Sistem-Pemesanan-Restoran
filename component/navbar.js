import styles from '../styles/NavBar.module.css'
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function NavBar({currentPath}){

    const selectedPage = {
        '/admin': false,
        '/admin/table': false,
        '/admin/transactionhistory': false,
        '/admin/editmenu': false,
        '/admin/addmenu': false,
        '/admin/editemployee': false,
        '/admin/addemployee': false,
    }

    const { data: session, status } = useSession()
    selectedPage[currentPath] = true

    return(
        <div className={styles.container}>
            <div className={styles.section}>
                <h3>Operational</h3>

                <Link href='/admin'>
                    <a className={selectedPage['/admin'] ? styles.selected : styles.card}>Home</a>
                </Link>

                <Link href="/admin/orderqueue">
                    <a className={styles.card}>Order Queue</a>
                </Link>

                <Link href="/admin/kitchen">
                    <a className={styles.card}>Kitchen</a>
                </Link>

                <Link href="/admin/table">
                    <a className={selectedPage['/admin/table'] ? styles.selected : styles.card}>Table</a>
                </Link>

                {session.role === "manager" && 
                    <Link href="/admin/transactionhistory">
                        <a className={selectedPage['/admin/transactionhistory'] ? styles.selected : styles.card}>Transaction History</a>
                    </Link>
                }
            </div>

            {session.role === "manager" && <>
                <div className={styles.section}>
                    <h3>Menu</h3>
                    <Link href="/admin/editmenu">
                        <a className={selectedPage['/admin/editmenu'] ? styles.selected : styles.card}>Edit Menu</a>
                    </Link>

                    <Link href="/admin/addmenu">
                        <a className={selectedPage['/admin/addmenu'] ? styles.selected : styles.card}>Add Menu</a>
                    </Link>

                    <Link href="/">
                        <a className={styles.card}>Menu</a>
                    </Link>
                </div>

                <div className={styles.section}>
                    <h3>Employee</h3>

                    <Link href="/admin/editemployee">
                        <a className={selectedPage['/admin/editemployee'] ? styles.selected : styles.card}>Edit Employee</a>
                    </Link>

                    <Link href="/admin/addemployee">
                        <a className={selectedPage['/admin/addemployee'] ? styles.selected : styles.card}>Add Employee</a>
                    </Link>
                </div>
            </>}
        </div>
    )
}