import styles from '../styles/Header.module.css'
import { signOut } from "next-auth/react"
import { useState, useEffect } from 'react';
import io from 'socket.io-client'
import Link from 'next/link';

export default function Header({admin}){
    let socket = null

    const handleClick = () => {
        setShowNotification(!showNotification)
        setUnseenNotif(0)
    } 

    const [audio, setAudio] = useState(null)
    const [notification, setNotification] = useState(() => {
        if (typeof window === 'undefined') {
            return []
        }
        const savedNotif = localStorage.getItem('notifHeader')
        return savedNotif ? JSON.parse(savedNotif) : [] 
    })

    const [showNotification, setShowNotification] = useState(false)
    const [unseenNotif, setUnseenNotif] = useState(0)

    const socketInitializer = async () => {
        await fetch('/api/socket')
        socket = io()

        socket.on('connect', () => {
            console.log('connected')
        })

        socket.on('neworder', (msg) => {
            setNotification(notification => {
                const newNotif = [...notification, `New Order From Table ${msg} (${new Date().toLocaleTimeString()})`]
                if(newNotif.length > 15){
                    newNotif.shift()
                }
                return newNotif
            })    
            setUnseenNotif((unseenNotif) => unseenNotif + 1)
        })

        socket.on('notifyhelp', (msg) => {
            if(msg.help === 1){
                setNotification(notification => [...notification, `Table ${msg.idMeja} requesting help (${new Date().toLocaleTimeString()})`])
                setUnseenNotif((unseenNotif) => unseenNotif + 1)
            }
        })
    }

    const socketCleanUp = () => {
        socket.removeAllListeners()
        socket.disconnect()
    }

    useEffect(() => {
        socketInitializer()
        
        return () => {
        socketCleanUp()
        }
    }, [])

    useEffect(() => setAudio(new Audio('/notification.mp3')),[])

    useEffect(() => {
        if(audio){
        audio.play()
        }
    }, [notification])

    useEffect(() => {
        localStorage.setItem('notifHeader', JSON.stringify(notification));
    }, [notification]);

    return(
        <>
            <div className={styles.container}>
                <p>Signed in as <b>{admin}</b></p>
                <div>
                    <button onClick={handleClick} className='btn-primary' style={{backgroundColor: unseenNotif > 0 && 'salmon'}}> 
                        {showNotification ? 'Hide' : 'Show'} Notification {unseenNotif > 0 && `(${unseenNotif})`}
                    </button>
                    <Link href= "../admin"><button className='btn-primary'>Home</button></Link>
                    <button onClick={() => signOut()} className='btn-danger'>Sign Out</button>
                </div>

                {showNotification && 
                    <div className={styles.notification}>
                        {notification.length === 0 ? 'No notification' :
                            notification.reverse().map((n, index) => <p key={index}>{n}</p>)
                        }
                        {notification.length > 0 && <button className='btn-danger' onClick={() => {setNotification([]); localStorage.removeItem('notifHeader')}}>clear</button>}
                    </div>
                }
            </div>
        </>
    )
}