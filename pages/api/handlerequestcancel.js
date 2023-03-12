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

    let jumlah
    let delivered

    const queryApprove = `UPDATE "TerdiriPesanan" SET "jumlah" = "jumlah" - "requestcancel", "requestcancel" = 0 WHERE "idPesanan" = ${request.idPesanan} AND "isiPesanan" = ${request.isiPesanan} RETURNING "jumlah", "delivered"`
    const queryReject = `UPDATE "TerdiriPesanan" SET "requestcancel" = 0 WHERE "idPesanan" = ${request.idPesanan} AND "isiPesanan" = ${request.isiPesanan} RETURNING "jumlah", "delivered"`
    const queryDelete = `DELETE FROM "TerdiriPesanan" WHERE "idPesanan" = ${request.idPesanan} AND "isiPesanan" = ${request.isiPesanan}`
    const queryCheck = `SELECT "status" FROM "TerdiriPesanan" WHERE "idPesanan" = ${request.idPesanan}`
    const queryFinish = `UPDATE "Pesanan" SET "statusPesanan" = 3 WHERE "idPesanan" = ${request.idPesanan}`

    try{
        if(request.aksi === 'approve'){
            const resultApprove = await conn.query(queryApprove)
            jumlah = resultApprove.rows[0].jumlah
            delivered = resultApprove.rows[0].delivered

            // jika semua dicancel (jumlah === 0), maka delete
            if(jumlah === 0){
                const resultDelete = await conn.query(queryDelete)
            }
        }

        if(request.aksi === 'reject'){
            const resultReject = await conn.query(queryReject)

            jumlah = resultReject.rows[0].jumlah
            delivered = resultReject.rows[0].delivered
        }

        if(jumlah === delivered){ //sudah terkirim semua, set status = 2
            const queryStatus2 = `UPDATE "TerdiriPesanan" SET "status" = 2 WHERE "idPesanan" = ${request.idPesanan} AND "isiPesanan" = ${request.isiPesanan}`
            const resultStatus2 = await conn.query(queryStatus2)
            
            const resultCheck = await conn.query(queryCheck) 
            if(resultCheck.rows.every(r => r.status === 2)){ //jika semua statusnya sudah 2, finish
                const resultFinish = await conn.query(queryFinish)
            }
        }else{
            const queryStatus1 = `UPDATE "TerdiriPesanan" SET "status" = 1 WHERE "idPesanan" = ${request.idPesanan} AND "isiPesanan" = ${request.isiPesanan}`
            const resultStatus1 = await conn.query(queryStatus1)
        }

        res.status(200).json({ message: 'Update Success' })
    }catch(err){
        console.log(err)
        res.status(400).send({ message: 'Update Failed' })
    }
    return
}