import Layout from '../../component/layout'
import {conn} from '../../lib/pg.ts';


export default function AntrianPesanan({dataOrder, dataMenu}){
    return(
        <>
          {console.log(dataOrder)}
          {console.log(dataMenu)}

        </>
    )
}

export async function getServerSideProps(){
  const queryOrder = `SELECT * FROM "PendingOrder"`
  const resOrder = await conn.query(queryOrder)
  const dataOrder = resOrder.rows

  const queryMenu = `SELECT * FROM "Menu"`
  const resMenu = await conn.query(queryMenu)
  const dataMenu = resMenu.rows
  return{
    props:{
      dataMenu,
      dataOrder
    }
  }
}

AntrianPesanan.getLayout = function getLayout(page) {
    return (
      <Layout>
        {page}
      </Layout>
    )
}