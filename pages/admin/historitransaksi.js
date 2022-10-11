import Layout from '../../component/layout'

export default function HistoriTransaksi(){
    return(
        <>
            ini histori
        </>
    )
}

HistoriTransaksi.getLayout = function getLayout(page) {
    return (
      <Layout>
        {page}
      </Layout>
    )
}