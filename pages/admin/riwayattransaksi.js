import Layout from '../../component/layout'

export default function RiwayatTransaksi(){
    return(
        <>
            ini halaman riwayat transaksi
        </>
    )
}

RiwayatTransaksi.getLayout = function getLayout(page) {
    return (
      <Layout>
        {page}
      </Layout>
    )
}