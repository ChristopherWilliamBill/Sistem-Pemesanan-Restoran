import {conn} from '../../lib/pg.ts';
import { useRouter } from 'next/router'

export default async (req, res) => {

  if(req.method !== "POST"){
    res.status(405)
    return
  }

  const request = JSON.parse(JSON.stringify(req.body))

  const query = `INSERT INTO "Menu" ("namaMenu", "deskripsiMenu", "harga") VALUES ('${request.namaMenu}', '${request.deskripsi}', ${request.harga})`

  try{
    const result = await conn.query(query)
    res.status(200).json({ message: 'Insert Success' })
  }catch(err){
    console.log(err)
    res.status(400).send({ message: 'Insert Failed' })
  }

  return

}