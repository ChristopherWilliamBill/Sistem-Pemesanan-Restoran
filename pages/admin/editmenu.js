import Layout from '../../component/layout'

export default function EditMenu(){
    return(
        <>
            ini edit menu
        </>
    )
}

EditMenu.getLayout = function getLayout(page) {
    return (
      <Layout>
        {page}
      </Layout>
    )
}