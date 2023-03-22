import {conn} from '../../module/pg.js';
import { getToken } from "next-auth/jwt"

export default async (req, res) => {

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

  let imageUrl = ''

  if(request.image){
    imageUrl = request.image.substring(49, request.image.length)
  }else{
    imageUrl = '/v1678896383/nophoto.jpg'
  }

  const query = `INSERT INTO "Menu" ("namaMenu", "deskripsiMenu", "harga", "idAdmin", "aktif", "gambar") VALUES ('${request.namaMenu}', '${request.deskripsiMenu}', ${request.harga}, '${request.idAdmin}', 1, '${imageUrl}') RETURNING "idMenu"`

  try{
    const result = await conn.query(query)
    const idMenu = result.rows[0].idMenu
    if(request.paket.length > 0){
      for(let i = 0; i < request.paket.length; i++){
        let queryPaket = `INSERT INTO "TerdiriMenu" VALUES (${idMenu}, ${request.paket[i].isiMenu}, ${request.paket[i].jumlah})`
        let resultPaket = await conn.query(queryPaket)
      }
    }

    const datarevalidate = {secret: process.env.REVALIDATE_TOKEN, path: '/'}
    const JSONdata = JSON.stringify(datarevalidate)
    const endpoint = 'http://localhost:3000/api/revalidate'
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSONdata
    }

    const resRevalidate = await fetch(endpoint, options)
    const revalidated = await resRevalidate.json()

    res.status(200).json({ message: 'Menu Added', revalidated: revalidated})  
  }catch(err){
    console.log(err)
    res.status(400).send({ message: 'Failed' })
  }

  return

}