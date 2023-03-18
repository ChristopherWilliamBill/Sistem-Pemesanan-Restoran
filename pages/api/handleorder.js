import {conn} from '../../lib/pg.js';
import { getToken } from "next-auth/jwt"

export default async (req, res) => {

  if(req.method !== "PUT"){
    res.status(405).send({ message: 'Method not allowed'})
    return
  }

  const token = await getToken({ req })
  if (token) {
    console.log("JSON Web Token", JSON.stringify(token, null, 2))
  } else {
    res.status(401).send({message: "Not signed in"})
    return
  }

  const request = JSON.parse(JSON.stringify(req.body))
  console.log(request.idPesanan)

  let query = `UPDATE "Pesanan" SET "statusPesanan" = ${request.status} WHERE "idPesanan" = ${request.idPesanan}`

  if(request.status > 3){
    query = `UPDATE "Pesanan" SET "statusPesanan" = ${request.status}, "selesai" = 1 WHERE "idPesanan" = ${request.idPesanan}`
  }

  const queryGetIsi = `SELECT "isiPesanan", "jumlah" FROM "TerdiriPesanan" WHERE "idPesanan" = ${request.idPesanan}`
  const queryStatus = `UPDATE "TerdiriPesanan" SET "status" = 2 WHERE "idPesanan" = ${request.idPesanan}`
  const queryKelola = `INSERT INTO "KelolaPesanan" ("idPesanan", "idAdmin", "aksi", "jam") VALUES (${request.idPesanan}, ${request.idAdmin}, ${request.status}, current_timestamp)`
  const queryCheckAdditional = `SELECT * FROM "PesananTambahan" WHERE "idPesanan" = ${request.idPesanan}`

  try{
    if(request.status !== 3) {
      const result = await conn.query(query)
    }

    const resultKelola = await conn.query(queryKelola)

    if(request.status === 3){
      const resultGetIsi = await conn.query(queryGetIsi)
      for(let i = 0; i < resultGetIsi.rows.length; i++){
        let queryDeliverAll = `UPDATE "TerdiriPesanan" SET "delivered" = ${resultGetIsi.rows[i].jumlah} WHERE "idPesanan" = ${request.idPesanan} AND "isiPesanan" = ${resultGetIsi.rows[i].isiPesanan}`
        let resultDeliverAll = await conn.query(queryDeliverAll)
      }
      const resultStatus = await conn.query(queryStatus)

      const resultCheckAdditional = await conn.query(queryCheckAdditional)
      //jika tidak ada pesanan tambahan
      if(resultCheckAdditional.rows.length === 0){
        const resultStatus3 = await conn.query(query)
      }
    }
    
    res.status(200).json({ mesage: 'Success'})
  }catch(err){
    console.log(err)
    res.status(400).send({ message: 'Update Failed' })
  }

  return

}