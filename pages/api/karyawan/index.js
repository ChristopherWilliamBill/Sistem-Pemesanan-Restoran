import {conn} from '../../../module/pg';
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
        case 'POST': //Tambah admin
            const queryPOST = `INSERT INTO "Admin" ("username", "password", "role") VALUES ('${request.username}', '${request.password}', '${request.role}')`

            const datarevalidate = {secret: process.env.REVALIDATE_TOKEN, path: ['/admin/editkaryawan']}
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
        
            try{
                const resultPOST = await conn.query(queryPOST)
                res.status(200).json({ message: 'Employee Added', revalidated: revalidated })
            }catch(err){
                console.log(err)
                res.status(400).send({ message: 'Insert Failed' })
            }
            break
        case 'PUT': //Edit data admin
            const queryPUT = `UPDATE "Admin" SET "username" = '${request.username}', "password" = '${request.password}', "role" = '${request.role}' WHERE "idAdmin" = ${request.idAdmin}`

            try{
                const resultPUT = await conn.query(queryPUT)

                const datarevalidate = {secret: process.env.REVALIDATE_TOKEN, path: ['/admin/editkaryawan']}
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
}