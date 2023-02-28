import {conn} from '../../lib/pg.js';

export default async (req, res) => {

  if(req.method !== "PUT"){
    res.status(405)
    return
  }

  const request = JSON.parse(JSON.stringify(req.body))
  console.log(request.idPesanan)

  let query = `UPDATE "Pesanan" SET "statusPesanan" = ${request.status} WHERE "idPesanan" = ${request.idPesanan}`
  //const queryOrder = `SELECT * FROM "Pesanan" INNER JOIN "TerdiriPesanan" ON "Pesanan"."idPesanan" = "TerdiriPesanan"."idPesanan"`

  if(request.status > 3){
    query = `UPDATE "Pesanan" SET "statusPesanan" = ${request.status}, "selesai" = 1 WHERE "idPesanan" = ${request.idPesanan}`
  }

  const queryStatus = `UPDATE "TerdiriPesanan" SET "status" = 1 WHERE "idPesanan" = ${request.idPesanan}`

  const queryKelola = `INSERT INTO "KelolaPesanan" ("idPesanan", "idAdmin", "aksi", "jam") VALUES (${request.idPesanan}, ${request.idAdmin}, ${request.status}, current_timestamp)`

  //const queryPesanan = `INSERT INTO "Pesanan" ("idMeja", "jam", "status") VALUES (1, current_timestamp, 1) RETURNING "idPesanan"`

  try{
    const result = await conn.query(query)
    const resultKelola = await conn.query(queryKelola)

    if(request.status == 3){
      const resultStatus = await conn.query(queryStatus)
    }
    
    res.status(200).json({ mesage: 'Success'})
  }catch(err){
    console.log(err)
    res.status(400).send({ message: 'Update Failed' })
  }

  return

}