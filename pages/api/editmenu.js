import {conn} from '../../lib/pg.js';
import { getToken } from "next-auth/jwt"

export default async (req, res) => {

  if(req.method !== "PUT"){
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

  console.log(request)

  const query = `UPDATE "Menu" SET "namaMenu" = '${request.namaMenu}', "deskripsiMenu" = '${request.deskripsiMenu}', "harga" = ${request.harga}, "idAdmin" = ${request.idAdmin} WHERE "idMenu" = ${request.idMenu}`
  const queryCheckIsiPaket = `SELECT * FROM "TerdiriMenu" WHERE "idMenu" = ${request.idMenu}`
  const queryCheck = `SELECT DISTINCT "idMenu" FROM "TerdiriMenu"`
  const queryJumlahPaket = `SELECT COUNT(*) FROM "TerdiriMenu" WHERE "idMenu" = ${request.idMenu}`

  try{
    //paket tidak boleh tidak memiliki isi menu
    const resultCheck = await conn.query(queryCheck)
    if(resultCheck.rows.some(r => r.idMenu == request.idMenu)){
      const resultJumlah = await conn.query(queryJumlahPaket) //cek menu punya berapa isipaket
      if(request.deletedPaket.length >= parseInt(resultJumlah.rows[0].count) && request.paket.length == 0){ //jika jumlah paket yg dihapus = jumlah paket saat ini, dan tidak ditambahkan lagi dengan paket lain, maka invalid
        res.status(200).json({ message: 'Packet must consist of at least 1 menu' })
        return
      }
    }

    if(request.deletedPaket.length > 0){
      for(let i = 0; i < request.deletedPaket.length; i++){
        let isiMenu = request.deletedPaket[i]
        console.log("isimenu:" + isiMenu)
        let queryDelete = `DELETE FROM "TerdiriMenu" WHERE "idMenu" = ${request.idMenu} AND "isiMenu" = ${isiMenu}`
        let resultDelete = await conn.query(queryDelete)
      }
    }

    const resultIsiPaket = await conn.query(queryCheckIsiPaket)
    console.log(resultIsiPaket)
    let queryAdd = ''
    if(request.paket.length > 0){
      for(let i = 0; i < request.paket.length; i++){
        let isiMenu = request.paket[i].isiMenu
        if(resultIsiPaket.rows.some(r => r.isiMenu === isiMenu)){ //jika paket sudah memiliki isi menu yg sama, ganti jumlahnya saja
          queryAdd = `UPDATE "TerdiriMenu" SET "jumlah" = ${request.paket[i].jumlah} WHERE "isiMenu" = ${isiMenu} AND "idMenu" = ${request.idMenu}`
        }else{ //jika tidak, insert baru
          queryAdd = `INSERT INTO "TerdiriMenu" VALUES (${request.idMenu}, ${isiMenu}, ${request.paket[i].jumlah})`
        }
        let resultAdd = await conn.query(queryAdd)
      }
    }

    const result = await conn.query(query)


    res.status(200).json({ message: 'Data Updated' })
  }catch(err){
    console.log(err)
    res.status(400).send({ message: 'Failed' })
  }

  return

}