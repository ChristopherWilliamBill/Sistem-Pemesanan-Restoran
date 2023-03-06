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

  try{
    const result = await conn.query(query)
    res.status(200).json({ message: 'Update Success' })
  }catch(err){
    console.log(err)
    res.status(400).send({ message: 'Update Failed' })
  }

  return

}