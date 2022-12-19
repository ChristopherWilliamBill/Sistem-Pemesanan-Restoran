import {conn} from '../../lib/pg.js';

export default async (req, res) => {

  if(req.method !== "POST"){
    res.status(405)
    return
  }

  const request = JSON.parse(JSON.stringify(req.body))

  const query = `INSERT INTO "Menu" ("namaMenu", "deskripsiMenu", "harga", "idAdmin") VALUES ('${request.namaMenu}', '${request.deskripsi}', ${request.harga}, '${request.idAdmin}')`

  try{
    const result = await conn.query(query)
    res.status(200).json({ message: 'Insert Success' })
  }catch(err){
    console.log(err)
    res.status(400).send({ message: 'Insert Failed' })
  }

  return

}