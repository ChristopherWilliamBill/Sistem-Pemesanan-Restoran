import {conn} from '../../module/pg.js';
import { getToken } from "next-auth/jwt"

export default async (req, res) => {
  // insert data transaksi baru
  if(req.method !== "POST"){
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

  console.log(request)

  const query = `INSERT INTO "Transaksi" ("total", "tanggal", "idMeja") VALUES ('${request.total}', current_timestamp, ${request.idMeja}) RETURNING "idTransaksi"`

  try{
    const result = await conn.query(query)
    const idTransaksi = result.rows[0].idTransaksi
    const queryTerdiri = `INSERT INTO "TerdiriTransaksi" VALUES (${idTransaksi}, ${request.idPesanan})`
    const resultTerdiri = await conn.query(queryTerdiri)

    res.status(200).json({ message: 'Insert Success' })
  }catch(err){
    console.log(err)
    res.status(400).send({ message: 'Insert Failed' })
  }

  return

}