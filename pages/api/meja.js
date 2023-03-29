import {conn} from '../../module/pg.js';
import { getToken } from "next-auth/jwt"

export default async (req, res) => {

  const token = await getToken({ req })
  if (token) {
    console.log("JSON Web Token", JSON.stringify(token, null, 2))
  } else {
    res.status(401).send({message: "Not signed in"})
    return
  }

  const method = req.method
  const request = JSON.parse(JSON.stringify(req.body))
  
    switch (method) {
      case 'POST': //Tambah data meja
        const queryInsert = `INSERT INTO "Meja" VALUES (DEFAULT, '${request.password}', '${request.username}', 0)`
        
        try{
          const resultInsert = await conn.query(queryInsert)
          const datarevalidate = {secret: process.env.REVALIDATE_TOKEN, path: ['/admin/meja']}
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
          res.status(400).send({ message: 'Insert Failed' })
        }
        break
      case 'PUT': //Edit data meja
        const queryPUT = `UPDATE "Meja" SET "password" = '${request.password}' WHERE "username" = '${request.username}' RETURNING "username"`

        try{
            const resultPUT = await conn.query(queryPUT)

            const datarevalidate = {secret: process.env.REVALIDATE_TOKEN, path: ['/admin/meja']}
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
            res.status(200).json({ message: 'Data updated', revalidated: revalidated })
        }catch(err){
          console.log(err)
          res.status(400).send({ message: 'Update Failed' })
        }
        break
      default:
        res.status(405).end(`Method ${method} Not Allowed`)
    }
  return
}