import {conn} from '../../lib/pg.js';

export default async (req, res) => {

  if(req.method !== "PUT"){
    res.status(405)
    return
  }

  const request = JSON.parse(JSON.stringify(req.body))

  console.log(request)

  const queryCheck = `SELECT "TerdiriPesanan"."status" FROM "TerdiriPesanan" INNER JOIN "Pesanan" ON "Pesanan"."idPesanan" = "TerdiriPesanan"."idPesanan" WHERE "Pesanan"."idPesanan" = ${request.idPesanan} AND "Pesanan"."statusPesanan" = 2`
  const query = `UPDATE "TerdiriPesanan" SET "status" = 1 WHERE "idPesanan" = ${request.idPesanan} AND "isiPesanan" = ${request.isiPesanan}`
  const queryFinish = `UPDATE "Pesanan" SET "statusPesanan" = 3 WHERE "idPesanan" = ${request.idPesanan}`
  const queryKelola = `INSERT INTO "KelolaPesanan" ("idPesanan", "idAdmin", "aksi", "jam") VALUES (${request.idPesanan}, ${request.idAdmin}, 3, current_timestamp)`

  try{
    const result = await conn.query(query)
    const resultCheck = await conn.query(queryCheck)
    console.log(resultCheck.rows)

    if(resultCheck.rows.every(r => r.status == 1)){
      const resultFinish = await conn.query(queryFinish)
      const resultKelola = await conn.query(queryKelola)
    }

    res.status(200).json({ message: 'Update Success' })

  }catch(err){
    console.log(err)
    res.status(400).send({ message: 'Update Failed' })
  }
}