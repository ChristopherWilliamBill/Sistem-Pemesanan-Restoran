import {conn} from '../../lib/pg.ts';

export default async (req, res) => {
  if(req.method !== "POST"){
    res.status(405)
    return
  }

  const request = JSON.parse(JSON.stringify(req.body)).orderOcc

  const idMenu = request.map(r => r.id).join(",")
  const count = request.map(r => r.count).join(",")

  const query = `INSERT INTO "PendingOrder" ("idMenu", "count", "idMeja", "time") VALUES ('${idMenu}', '${count}', 1, current_timestamp)`

  try{
    const result = await conn.query(query)
    res.status(201).json({ message: 'Order Success' })
  }catch(err){
    console.log(err)
    res.status(400).send({ message: 'Order Failed' })
  }

  return

}