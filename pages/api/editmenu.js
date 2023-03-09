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

  console.log(request)

  const query = `UPDATE "Menu" SET "namaMenu" = '${request.namaMenu}', "deskripsiMenu" = '${request.deskripsiMenu}', "harga" = ${request.harga}, "idAdmin" = ${request.idAdmin} WHERE "idMenu" = ${request.idMenu}`
  const queryCheck = `SELECT DISTINCT "idMenu" FROM "TerdiriMenu"`
  const queryJumlahPaket = `SELECT COUNT(*) FROM "TerdiriMenu" WHERE "idMenu" = ${request.idMenu}`

  try{
    const result = await conn.query(query)

    if(request.addPaket.length > 0){
      for(let i = 0; i < request.addPaket.length; i++){
        let isiMenu = request.addPaket[i]
        let queryAdd = `INSERT INTO "TerdiriMenu" VALUES (${request.idMenu}, ${isiMenu})`
        let resultAdd = await conn.query(queryAdd)
      }
    }

    //paket tidak boleh tidak memiliki isi menu
    const resultCheck = await conn.query(queryCheck)
    if(resultCheck.rows.some(r => r == request.idMenu)){
      const resultJumlah = await conn.query(queryJumlahPaket)
      if(request.deletedPaket.length >= resultJumlah.rows){
        res.status(200).json({ message: 'Packet must consist of at least 1 menu' })
      }
    }

    if(request.deletedPaket.length > 0){
      for(let i = 0; i < request.deletedPaket.length; i++){
        let isiMenu = request.deletedPaket[i]
        console.log("isimenu:" + isiMenu)
        let queryDelete = `DELETE FROM "TerdiriMenu" WHERE "idMenu" = ${request.idMenu} AND "isiMenu" = ${isiMenu} LIMIT 1`
        let resultDelete = await conn.query(queryDelete)
      }
    }

    res.status(200).json({ message: 'Update Success' })
  }catch(err){
    console.log(err)
    res.status(400).send({ message: 'Update Failed' })
  }

  return

}