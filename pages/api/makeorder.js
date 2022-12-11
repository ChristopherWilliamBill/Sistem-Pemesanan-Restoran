import {conn} from '../../lib/pg.ts';

export default async (req, res) => {
  if(req.method !== "POST"){
    res.status(405)
    return
  }

  const request = JSON.parse(JSON.stringify(req.body))

  const idMenu = request.map(r => r.id).join(",")
  const count = request.map(r => r.count).join(",")

  const queryPesanan = `INSERT INTO "Pesanan" ("idMeja", "jam", "status") VALUES (1, current_timestamp, 1) RETURNING "idPesanan"`

  try{
    const result = await conn.query(queryPesanan)
    const currentOrder = result.rows[0].idPesanan

    for(let i = 0; i < request.length; i++){
      let idMenu = request[i].idMenu
      let jumlah = request[i].count
  
      let queryTP = `INSERT INTO "TerdiriPesanan" ("idPesanan", "isiPesanan", "jumlah") VALUES (${currentOrder}, ${idMenu}, ${jumlah})`
      let resultTerdiriPesanan = await conn.query(queryTP)
    }

    res.status(201).json({ message: 'Order Success' })
  }catch(err){
    console.log(err)
    res.status(400).send({ message: 'Order Failed' })
  }

  return

}