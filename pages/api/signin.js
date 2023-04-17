import {conn} from '../../module/pg.js';
import { getToken } from "next-auth/jwt"

export default async (req, res) => {
  if(req.method !== "POST"){
    res.status(405).send({ message: 'Method not allowed'})
    return
  }

  const request = JSON.parse(req.body)
  let query = ""

  if(request.role === "admin"){
    query = `SELECT * FROM "Admin" WHERE "username" = '${request.username}' AND "password" = '${request.password}'`
  }

  if(request.role === "meja"){
    query = `SELECT * FROM "Meja" WHERE "username" = '${request.username}' AND "password" = '${request.password}'`
  }

  const result = await conn.query(query)
  const user = result.rows
  console.log(request)


  //user = array, user.length ngecek ada user atau ga
  if(user.length){
    if(request.role === "meja"){
      user[0].role = "meja"
    }

    res.status(200).json(user)
    return
  }
  console.log(user)

  res.status(401).send({ message: 'username or password invalid' })
}