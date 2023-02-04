import {conn} from '../../lib/pg.js';

export default async (req, res) => {

  if(req.method !== "POST"){
    res.status(405)
    return
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