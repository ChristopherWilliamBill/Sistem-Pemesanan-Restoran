import Layout from '../../component/layout'

export default function TambahMenu(){
    return(
        <>
            ini tambah menu
        </>
    )
}

TambahMenu.getLayout = function getLayout(page) {
    return (
      <Layout>
        {page}
      </Layout>
    )
}