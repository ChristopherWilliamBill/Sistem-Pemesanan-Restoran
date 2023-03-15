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

  const queryDelete = `DELETE FROM "PesananTambahan" WHERE "idPesanan" = ${request.idPesanan} RETURNING *`
  const queryCheckMultiple = `SELECT "isiPesanan" FROM "TerdiriPesanan" WHERE "idPesanan" = ${request.idPesanan}`

  try{
    const resultCheck = await conn.query(queryCheckMultiple)
    const resultDelete = await conn.query(queryDelete)
    const checkMultiple = resultCheck.rows

    for(let i = 0; i < resultDelete.rows.length; i++){
        let idMenu = resultDelete.rows[i].isiPesanan
        let jumlah = resultDelete.rows[i].jumlah

        //JIKA PESANAN TAMBAHAN MENUNYA SUDAH ADA DI ORDER UTAMA, UPDATE JUMLAHNYA SAJA
        if(checkMultiple.filter(r => r.isiPesanan == idMenu).length > 0){
            let queryUpdateTP = `UPDATE "TerdiriPesanan" SET "status" = 1, "jumlah" = "jumlah" + ${jumlah} WHERE "idPesanan" = ${request.idPesanan} AND "isiPesanan" = ${idMenu}`
            let resultUpdateTP = await conn.query(queryUpdateTP)
        }else{ //JIKA TIDAK, INSERT BARU
            let queryTerdiriPesanan = `INSERT INTO "TerdiriPesanan" ("idPesanan", "isiPesanan", "jumlah", "status", "delivered", "requestcancel") VALUES (${request.idPesanan}, ${idMenu}, ${jumlah}, 1, 0, 0)`
            let resultTerdiriPesanan = await conn.query(queryTerdiriPesanan)
        }
    }

    res.status(200).json({ message: 'Update Success' })

  }catch(err){
    console.log(err)
    res.status(400).send({ message: 'Update Failed' })
  }
}