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

    const queryDecrease = `UPDATE "PesananTambahan" SET "jumlah" = "jumlah" - ${request.jumlah} WHERE "idPesanan" = ${request.idPesanan} AND "isiPesanan" = ${request.isiPesanan} RETURNING "jumlah"`
    const queryDelete = `DELETE FROM "PesananTambahan" WHERE "idPesanan" = ${request.idPesanan} AND "isiPesanan" = ${request.isiPesanan}`
    const queryCheckAdditional = `SELECT * FROM "PesananTambahan" WHERE "idPesanan" = ${request.idPesanan}`
    const queryCheck = `SELECT "status" FROM "TerdiriPesanan" WHERE "idPesanan" = ${request.idPesanan}`
    const queryFinish = `UPDATE "Pesanan" SET "statusPesanan" = 3 WHERE "idPesanan" = ${request.idPesanan}`

    try{
        const resultDecrease = await conn.query(queryDecrease)
        if(resultDecrease.rows[0].jumlah === 0){
            const resultDelete = await conn.query(queryDelete)
        }
        const resultAdditional = await conn.query(queryCheckAdditional)
        if(resultAdditional.rows.length === 0){ //jika tidak ada pesanan tambahan lain
            const resultCheck = await conn.query(queryCheck)
            if(resultCheck.rows.every(r => r.status === 2)){
                const resultFinish = await conn.query(queryFinish)
            }
        }
        
        res.status(200).json({ message: 'Update Success' })
    }catch(err){
        console.log(err)
        res.status(400).send({ message: 'Update Failed' })
    }
    return
}