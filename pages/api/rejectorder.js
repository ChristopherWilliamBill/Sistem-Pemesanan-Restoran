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

  if(request.jumlah < 1){
    res.status(422)
  }

  console.log(request)

  const queryCheck = `SELECT "TerdiriPesanan"."status" FROM "TerdiriPesanan" INNER JOIN "Pesanan" ON "Pesanan"."idPesanan" = "TerdiriPesanan"."idPesanan" WHERE "Pesanan"."idPesanan" = ${request.idPesanan} AND "Pesanan"."statusPesanan" = 2`
  const queryDeliver = `UPDATE "TerdiriPesanan" SET "delivered" = "delivered" + ${request.jumlah} WHERE "idPesanan" = ${request.idPesanan} AND "isiPesanan" = ${request.isiPesanan} RETURNING "jumlah", "delivered", "idPesanan", "isiPesanan"`
  const query = `UPDATE "TerdiriPesanan" SET "status" = 2 WHERE "idPesanan" = ${request.idPesanan} AND "isiPesanan" = ${request.isiPesanan}`
  const queryFinish = `UPDATE "Pesanan" SET "statusPesanan" = 3 WHERE "idPesanan" = ${request.idPesanan}`
  const queryKelola = `INSERT INTO "KelolaPesanan" ("idPesanan", "idAdmin", "aksi", "jam") VALUES (${request.idPesanan}, ${request.idAdmin}, 3, current_timestamp)`
  const queryReject = `UPDATE "TerdiriPesanan" SET "jumlah" = "jumlah" - ${request.jumlah} WHERE "idPesanan" = ${request.idPesanan} AND "isiPesanan" = ${request.isiPesanan} RETURNING "jumlah", "delivered", "idPesanan", "isiPesanan"`
  const queryDelete = `DELETE FROM "TerdiriPesanan" WHERE "idPesanan" = ${request.idPesanan} AND "isiPesanan" = ${request.isiPesanan}`

  try{
    //reject pesanan
    const resultReject = await conn.query(queryReject)
    console.log(resultReject.rows)

    //kalau semua sudah diantar (jumlah pesanan == jumlah delivered), semua terdiripesanan jadi statusnya 2
    if(resultReject.rows[0].jumlah == resultReject.rows[0].delivered){
      const result = await conn.query(query)
    }

    //kalau semua direject, hapus terdiripesanan
    if(resultReject.rows[0].jumlah == 0){
        const resultDelete = await conn.query(queryDelete)
    }

    //cek jika semua terdiripesanan statusnya 2
    const resultCheck = await conn.query(queryCheck)
    console.log(resultCheck.rows)

    //jika ya, status pesanan = 3 (deliverd all)
    if(resultCheck.rows.every(r => r.status == 2)){
      const resultFinish = await conn.query(queryFinish)
      const resultKelola = await conn.query(queryKelola)
    }

    res.status(200).json({ message: 'Update Success' })

  }catch(err){
    console.log(err)
    res.status(400).send({ message: 'Update Failed' })
  }
}