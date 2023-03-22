import {conn} from '../../module/pg.js';
import { getToken } from "next-auth/jwt"

export default async (req, res) => {

  if(req.method !== "PUT"){
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

  const query = `UPDATE "Menu" SET "aktif" = ${request.action}, "idAdmin" = '${request.idAdmin}' WHERE "idMenu" = ${request.idMenu}`

  try{
    const result = await conn.query(query)

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

    res.status(200).json({ message: 'Data Updated', revalidated: revalidated})  
  }catch(err){
    console.log(err)
    res.status(400).send({ message: 'Update Failed' })
  }

  return

}