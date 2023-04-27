import {conn} from '../../../../module/pg';
import { getToken } from "next-auth/jwt"

export default async (req, res) => {
    //Handle status pesanan berdasarkan idPesanan
    if(req.method !== "PUT"){
        res.status(405).send({ message: 'Method not allowed'})
        return
    }

    const token = await getToken({ req })
    if (token) {
        console.log("JSON Web Token", JSON.stringify(token, null, 2))
    }else{
        res.status(401).send({message: "Not signed in"})
        return
    }

    const request = JSON.parse(JSON.stringify(req.body))
    const { idPesanan } = req.query

    let query = `UPDATE "Pesanan" SET "statusPesanan" = ${request.status} WHERE "idPesanan" = ${idPesanan}`
    if(request.status > 3){
        query = `UPDATE "Pesanan" SET "statusPesanan" = ${request.status}, "selesai" = 1 WHERE "idPesanan" = ${idPesanan}`
    }

    const queryGetIsi = `SELECT "isiPesanan", "jumlah" FROM "TerdiriPesanan" WHERE "idPesanan" = ${idPesanan}`
    const queryStatus = `UPDATE "TerdiriPesanan" SET "status" = 2 WHERE "idPesanan" = ${idPesanan}`
    const queryKelola = `INSERT INTO "KelolaPesanan" ("idPesanan", "idAdmin", "aksi", "jam") VALUES (${idPesanan}, ${request.idAdmin}, ${request.status}, current_timestamp)`
    const queryCheckAdditional = `SELECT * FROM "PesananTambahan" WHERE "idPesanan" = ${idPesanan}`

    try{
        if(request.status !== 3) {
            const result = await conn.query(query)
        }

        if(request.status === 3){
            const resultGetIsi = await conn.query(queryGetIsi)
            for(let i = 0; i < resultGetIsi.rows.length; i++){
                let queryDeliverAll = `UPDATE "TerdiriPesanan" SET "delivered" = ${resultGetIsi.rows[i].jumlah} WHERE "idPesanan" = ${idPesanan} AND "isiPesanan" = ${resultGetIsi.rows[i].isiPesanan}`
                let resultDeliverAll = await conn.query(queryDeliverAll)
            }
            const resultStatus = await conn.query(queryStatus)

            const resultCheckAdditional = await conn.query(queryCheckAdditional)
            //jika tidak ada pesanan tambahan
            if(resultCheckAdditional.rows.length === 0){
                const resultStatus3 = await conn.query(query)
            }
        }

        const resultKelola = await conn.query(queryKelola)

        res.status(200).json({ mesage: 'Success'})
    }catch(err){
        console.log(err)
        res.status(400).send({ message: 'Update Failed' })
    }

    return
}