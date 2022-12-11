import {conn} from '../../lib/pg.ts';

export default async (req, res) => {

  if(req.method !== "PUT"){
    res.status(405)
    return
  }

  const request = JSON.parse(JSON.stringify(req.body))
  console.log(request.idPesanan)

  const query = `UPDATE "Pesanan" SET "status" = ${request.status} WHERE "idPesanan" = ${request.idPesanan}`
  const queryOrder = `SELECT * FROM "Pesanan" INNER JOIN "TerdiriPesanan" ON "Pesanan"."idPesanan" = "TerdiriPesanan"."idPesanan"`

  try{
    const result = await conn.query(query)
    res.status(200).json({ mesage: 'Success'})
  }catch(err){
    console.log(err)
    res.status(400).send({ message: 'Update Failed' })
  }

  return

}