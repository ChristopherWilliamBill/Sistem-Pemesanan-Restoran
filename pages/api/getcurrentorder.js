import {conn} from '../../lib/pg.js';

export default async (req, res) => {

  if(req.method !== "POST"){
    res.status(405)
    return
  }

  const idMeja = req.body.idMeja

  const query = `SELECT * FROM "Pesanan" WHERE "idMeja" = ${idMeja} AND selesai = 0`
  const queryMenu = `SELECT * FROM "Menu"`

  try{
    const pesanan = await conn.query(query)
    const menu = await conn.query(queryMenu)
    const idPesanan = pesanan.rows[0].idPesanan

    const queryOrder = `SELECT * FROM "Pesanan" INNER JOIN "TerdiriPesanan" ON "Pesanan"."idPesanan" = "TerdiriPesanan"."idPesanan" WHERE "Pesanan"."idPesanan" = ${idPesanan}`
    const result = await conn.query(queryOrder)

    res.status(200).send({ message: result.rows})
  }catch(err){
    console.log(err)
    res.status(400).send({ message: 'Failed' })
  }

  return

}