import {conn} from '../../lib/pg.js';

export default async (req, res) => {

  if(req.method !== "PUT"){
    res.status(405)
    return
  }

  const request = JSON.parse(JSON.stringify(req.body))

  console.log(request)

  const query = `UPDATE "Admin" SET "username" = '${request.username}', "password" = '${request.password}' WHERE "idAdmin" = ${request.idAdmin}`

  try{
    const result = await conn.query(query)
    res.status(200).json({ message: 'Update Success' })
  }catch(err){
    console.log(err)
    res.status(400).send({ message: 'Update Failed' })
  }

  return

}