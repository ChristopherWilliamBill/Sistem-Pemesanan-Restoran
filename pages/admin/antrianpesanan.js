import Layout from '../../component/layout'
import Image from 'next/image';
import fotomenu from '../api/images/nasgorAPI.jpg'


export default function AntrianPesanan(){
    return(
        <>
          <Image src={fotomenu}></Image>
        </>
    )
}

AntrianPesanan.getLayout = function getLayout(page) {
    return (
      <Layout>
        {page}
      </Layout>
    )
}