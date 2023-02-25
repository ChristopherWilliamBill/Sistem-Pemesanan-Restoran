import {conn} from '../../lib/pg.js';

export default async (req, res) => {

  if(req.method !== "PUT"){
    res.status(405)
    return
  }

  const request = JSON.parse(JSON.stringify(req.body))

  const query = `UPDATE "TerdiriPesanan" SET "status" = 2 WHERE "idPesanan" = ${request.idPesanan} AND "isiPesanan" = ${request.isiPesanan}`
  const queryCheck = `SELECT "TerdiriPesanan"."status" FROM "TerdiriPesanan" INNER JOIN "Pesanan" ON "Pesanan"."idPesanan" = "TerdiriPesanan"."idPesanan" WHERE "Pesanan"."idPesanan" = ${request.idPesanan} AND "Pesanan"."statusPesanan" = 1`
  const queryCancelAll = `UPDATE "Pesanan" SET "statusPesanan" = 5, "selesai" = 1 WHERE "idPesanan" = ${request.idPesanan}`


  try{
    const result = await conn.query(query)
    const resultCheck = await conn.query(queryCheck)
    console.log(resultCheck.rows)

    if(resultCheck.rows.every(r => r.status == 2)){
      const resultCancel = await conn.query(queryCancelAll)
      res.status(200).json({ message: 'All menu cancelled' })
    }

    res.status(200).json({ message: 'Update Success' })
  }catch(err){
    console.log(err)
    res.status(400).send({ message: 'Update Failed' })
  }

  return

}