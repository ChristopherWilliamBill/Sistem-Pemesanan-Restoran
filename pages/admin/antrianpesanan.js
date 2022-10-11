import Layout from '../../component/layout'

export default function AntrianPesanan(){
    return(
        <>
            ini antrian
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