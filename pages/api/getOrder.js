import {conn} from '../../lib/pg.ts';

export default async (req, res) => {

  if(req.method !== "GET"){
    res.status(405)
    return
  }

  const queryOrder = `SELECT * FROM "PendingOrder"`

  try{
    const result = await conn.query(queryOrder)
    const data = result.rows
    res.status(200).json(data)
  }catch(err){
    console.log(err)
    res.status(400).send({ message: 'Order Failed' })
  }

  return

}