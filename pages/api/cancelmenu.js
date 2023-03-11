import {conn} from '../../lib/pg.js';
import { getToken } from "next-auth/jwt"

export default async (req, res) => {

  if(req.method !== "PUT"){
    res.status(405)
    return
  }

  const token = await getToken({ req })
  if (token) {
    console.log("JSON Web Token", JSON.stringify(token, null, 2))
  } else {
    res.status(401).send({message: "Not signed in"})
  }

  const request = JSON.parse(JSON.stringify(req.body))

  const queryDecrease = `UPDATE "TerdiriPesanan" SET "jumlah" = "jumlah" - ${request.jumlah} WHERE "idPesanan" = ${request.idPesanan} AND "isiPesanan" = ${request.isiPesanan} RETURNING "jumlah"`
  const queryDelete = `DELETE FROM "TerdiriPesanan" WHERE "idPesanan" = ${request.idPesanan} AND "isiPesanan" = ${request.isiPesanan}`
  const queryCheck = `SELECT * FROM "TerdiriPesanan" WHERE "idPesanan" = ${request.idPesanan}`

  //const query = `UPDATE "TerdiriPesanan" SET "status" = 4 WHERE "idPesanan" = ${request.idPesanan} AND "isiPesanan" = ${request.isiPesanan}`
  //const queryCheck = `SELECT "TerdiriPesanan"."status" FROM "TerdiriPesanan" INNER JOIN "Pesanan" ON "Pesanan"."idPesanan" = "TerdiriPesanan"."idPesanan" WHERE "Pesanan"."idPesanan" = ${request.idPesanan} AND "Pesanan"."statusPesanan" = 1`
  const queryCancelAll = `UPDATE "Pesanan" SET "statusPesanan" = 5, "selesai" = 1 WHERE "idPesanan" = ${request.idPesanan}`

  try{
    const resultDecrease = await conn.query(queryDecrease)
    console.log(resultDecrease.rows[0])
    if(resultDecrease.rows[0].jumlah == 0){
      const resultDelete = await conn.query(queryDelete)
    }

    const resultCheck = await conn.query(queryCheck)
    console.log(resultCheck.rows)

    if(resultCheck.rows.length == 0){
      const resultCancelAll = await conn.query(queryCancelAll)
      res.status(200).json({ message: 'All menu cancelled' })
    }

    res.status(200).json({ message: 'Update Success' })
  }catch(err){
    console.log(err)
    res.status(400).send({ message: 'Update Failed' })
  }

  return

}