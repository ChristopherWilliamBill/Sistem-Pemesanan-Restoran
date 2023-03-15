import {conn} from '../../lib/pg.js';
import { getToken } from "next-auth/jwt"

export default async (req, res) => {

  if(req.method !== "POST"){
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
  console.log(request)

  const query = `INSERT INTO "Menu" ("namaMenu", "deskripsiMenu", "harga", "idAdmin", "aktif") VALUES ('${request.namaMenu}', '${request.deskripsiMenu}', ${request.harga}, '${request.idAdmin}', 1) RETURNING "idMenu"`

  try{
    const result = await conn.query(query)
    const idMenu = result.rows[0].idMenu
    if(request.paket.length > 0){
      for(let i = 0; i < request.paket.length; i++){
        let queryPaket = `INSERT INTO "TerdiriMenu" VALUES (${idMenu}, ${request.paket[i].isiMenu}, ${request.paket[i].jumlah})`
        let resultPaket = await conn.query(queryPaket)
      }
    }
    res.status(200).json({ message: 'Menu Added' })
  }catch(err){
    console.log(err)
    res.status(400).send({ message: 'Failed' })
  }

  return

}