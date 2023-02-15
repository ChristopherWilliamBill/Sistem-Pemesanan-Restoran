import {conn} from '../../lib/pg.js';

export default async (req, res) => {
  if(req.method !== "POST"){
    res.status(405)
    return
  }

  const request = req.body

  console.log(request)

  const idMeja = parseInt(request.idMeja)

  const queryPesanan = `INSERT INTO "Pesanan" ("idMeja", "jam", "status", "selesai") VALUES (${idMeja}, current_timestamp, 1, 0) RETURNING "idPesanan"`

  try{
    const result = await conn.query(queryPesanan)
    const currentOrder = result.rows[0].idPesanan

    for(let i = 0; i < request.dataOrder.length; i++){
      let idMenu = request.dataOrder[i].idMenu
      let jumlah = request.dataOrder[i].count
  
      let queryTP = `INSERT INTO "TerdiriPesanan" ("idPesanan", "isiPesanan", "jumlah", "selesai") VALUES (${currentOrder}, ${idMenu}, ${jumlah}, 0)`
      let resultTerdiriPesanan = await conn.query(queryTP)
    }

    res.status(201).json({ message: 'Order Success' })
  }catch(err){
    console.log(err)
    res.status(400).send({ message: 'Order Failed' })
  }

  return

}