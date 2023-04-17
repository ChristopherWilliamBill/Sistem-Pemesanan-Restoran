import Header from './header.js'
import { useSession, signIn } from "next-auth/react"
import styles from '../styles/Layout.module.css'
import { useEffect, useState } from 'react'
import io from 'socket.io-client'


export default function Layout({ children }) {
  let socket = null

  const { data: session, status } = useSession()
  const [audio, setAudio] = useState(null)
  const [notification, setNotification] = useState([])
  const [showNotification, setShowNotification] = useState(false);
  const [unseenNotif, setUnseenNotif] = useState(0)

  const socketInitializer = async () => {
    await fetch('/api/socket')
    socket = io()

    socket.on('connect', () => {
      console.log('connected')
    })

    socket.on('neworder', (msg) => {
      console.log('order baru diterima dari meja ' + msg)
      console.log(msg)
      setNotification(notification => [...notification, `New Order From Table ${msg} (${new Date().toLocaleTimeString()})`])    
      setUnseenNotif((unseenNotif) => unseenNotif + 1)
    })

    socket.on('notifyhelp', (msg) => {
      console.log(msg)
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

  if (status === "authenticated" && session.role !== "meja") {
    return(<>
      <Header admin={session.user.name} notification={notification} setNotification={setNotification} showNotification={showNotification} setShowNotification={setShowNotification} unseenNotif={unseenNotif} setUnseenNotif={setUnseenNotif}/>
      <main>{children}</main>
    </>
    )
  }

  return (
    <div className={styles.container}>
      <h1>Administrator Only</h1>
      <button className='btn-primary' onClick={signIn}>Sign In</button>
    </div>
  )
}