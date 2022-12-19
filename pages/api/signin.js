import {conn} from '../../lib/pg.js';

export default async (req, res) => {
  if(req.method !== "POST"){
    res.status(405)
    return
  }

  const request = JSON.parse(req.body)

  const query = `SELECT * FROM "Admin" WHERE "username" = '${request.username}' AND "password" = '${request.password}'`
  const result = await conn.query(query)
  const user = result.rows

  //user = array, user.length ngecek ada user atau ga
  if(user.length){
    res.status(200).json(user)
    return
  }

  res.status(401).send({ message: 'username or password invalid' })
}