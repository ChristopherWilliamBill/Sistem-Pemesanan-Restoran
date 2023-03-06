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

  const query = `INSERT INTO "Admin" ("username", "password", "role") VALUES ('${request.username}', '${request.password}', '${request.role}')`

  try{
    const result = await conn.query(query)
    res.status(200).json({ message: 'Insert Success' })
  }catch(err){
    console.log(err)
    res.status(400).send({ message: 'Insert Failed' })
  }

  return

}