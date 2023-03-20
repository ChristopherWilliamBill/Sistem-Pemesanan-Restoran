import {conn} from '../../module/pg.js';
import { getToken } from "next-auth/jwt"

export default async (req, res) => {
    if(req.method !== "PUT"){
        res.status(405).send({ message: 'Method not allowed'})
        return
    }

    const token = await getToken({ req })
    if (token) {
        console.log("JSON Web Token", JSON.stringify(token, null, 2))
    } else {
        res.status(401).send({message: "Not signed in"})
        return
    }

    const request = JSON.parse(JSON.stringify(req.body))

    const queryCheck = `SELECT "TerdiriPesanan"."idPesanan", "TerdiriPesanan"."isiPesanan" FROM "TerdiriPesanan" WHERE "idPesanan" = ${request.idPesanan} AND "isiPesanan" = ${request.isiPesanan}`
    const queryDecrease = `UPDATE "PesananTambahan" SET "jumlah" = "jumlah" - ${request.jumlah} WHERE "idPesanan" = ${request.idPesanan} AND "isiPesanan" = ${request.isiPesanan} RETURNING "jumlah"`
    const queryDelete = `DELETE FROM "PesananTambahan" WHERE "idPesanan" = ${request.idPesanan} AND "isiPesanan" = ${request.isiPesanan}`

    try{
        let queryAccept = ''
        const resultCheck = await conn.query(queryCheck) // cek pesanan tambahan sudah pernah dipesan sebelumnya / tidak
        console.log(resultCheck.rows)
        if(resultCheck.rows.length > 0){
            queryAccept = `UPDATE "TerdiriPesanan" SET "jumlah" = "jumlah" + ${request.jumlah} WHERE "idPesanan" = ${request.idPesanan} AND "isiPesanan" = ${request.isiPesanan}`
        }else{
            queryAccept = `INSERT INTO "TerdiriPesanan" VALUES (${request.idPesanan}, ${request.isiPesanan}, ${request.jumlah}, 1, 0, 0)`
        }  

        const resultAccept = await conn.query(queryAccept)
        const resultDecrease = await conn.query(queryDecrease)
        if(resultDecrease.rows[0].jumlah === 0){
            const resultDelete = await conn.query(queryDelete)
        }
     
        res.status(200).json({ message: 'Update Success' })
    }catch(err){
        console.log(err)
        res.status(400).send({ message: 'Update Failed' })
    }
    return
}