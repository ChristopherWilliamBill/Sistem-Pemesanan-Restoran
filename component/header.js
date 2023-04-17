import styles from '../styles/Header.module.css'
import { signOut, signIn } from "next-auth/react"
import { useRouter } from 'next/router';

export default function Header({admin, notification, setNotification, showNotification, setShowNotification, unseenNotif, setUnseenNotif}){

    const router = useRouter()

    const handleClick = () => {
        setShowNotification(!showNotification)
        setUnseenNotif(0)
    } 

    return(
        <>
            <div className={styles.container}>
                <p>Signed in as <b>{admin}</b></p>
                <div>
                    <button onClick={handleClick} className='btn-primary' style={{backgroundColor: unseenNotif > 0 && 'salmon'}}> 
                        {showNotification ? 'Hide' : 'Show'} Notification {unseenNotif > 0 && `(${unseenNotif})`}
                    </button>
                    <button onClick={() => router.push("../admin")} className='btn-primary'>Home</button>
                    <button onClick={() => signOut()} className='btn-danger'>Sign Out</button>
                </div>

                {showNotification && 
                    <div className={styles.notification}>
                        {notification.length === 0 ? 'No notification' :
                            notification.map((n, index) => <p key={index}>{n}</p>)
                        }
                        {notification.length > 0 && <button className='btn-danger' onClick={() => setNotification([])}>clear</button>}
                    </div>
                }
            </div>
        </>
    )
}