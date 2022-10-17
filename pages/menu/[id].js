import { useRouter } from "next/router";
import styles from '../../styles/Menu.module.css'
import {conn} from '../../lib/pg.ts';

export default function MenuDetail({dataMenu}){
    const router = useRouter();
    const {id} = router.query;
    return(
      <>
      halo
      </>
    )
}

// export async function getStaticPaths(){
//   // const pgp = require('pg-promise')({
//   //   noWarnings: true
//   // })
//   // const db = pgp("postgres://christopher@localhost:5432/christopher")
//   // const dataPath = await db.any(`SELECT id FROM "Menu"`)
//   // const paths = dataPath.map((path) => ([{params: {id: path.id.toString()}}])).flat()
//   // console.log(dataPath)

//   const query = `SELECT id FROM "Menu"`
//   const res = await conn.query(query)
//   const paths = res.rows.map((path) => ([{params: {id: path.id.toString()}}])).flat()
//   return{
//     paths,
//     fallback: false
//   }

//   // return{
//   //   paths: [{params: {id: '1'}}],
//   //   fallback: false
//   // }
// }

// export async function getStaticProps({params}){ 
//   // const pgp = require('pg-promise')({
//   //   noWarnings: true
//   // })
//   // const db = pgp("postgres://christopher@localhost:5432/christopher")
//   // const dataMenu = await db.any(`SELECT * FROM "Menu" WHERE id = ${parseInt(params.id)}`)

//   const query = `SELECT * FROM "Menu" WHERE id = ${parseInt(params.id)}`
//   const res = await conn.query(query)
//   const dataMenu = res.rows
//   return{
//     props:{
//       dataMenu
//     }
//   }   
// }