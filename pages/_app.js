import { SessionProvider } from 'next-auth/react'
import '../styles/globals.css'
import { SWRConfig, useSWRConfig } from 'swr'
import useSWR from 'swr'


function MyApp({ Component, pageProps }) {

  const getLayout = Component.getLayout || ((page) => page)

  return (
    <SessionProvider>
      {getLayout(<Component {...pageProps} />)}
    </SessionProvider>
  )
}

export default MyApp
