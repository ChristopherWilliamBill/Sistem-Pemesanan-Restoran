import {conn} from '../../../../../module/pg.js';
import { getToken } from "next-auth/jwt"

export default async (req, res) => {
    //Handle MENU TAMBAHAN 1 PER 1 BERDASARKAN idPesanan dan isiPesanan
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

    const {idPesanan} = req.query
    const {isiPesanan} = req.query

    const request = JSON.parse(JSON.stringify(req.body))
    const tipe = request.tipe

    if(tipe === 'accept'){ //accept parsial dari kitchen
        const queryCheck = `SELECT "TerdiriPesanan"."idPesanan", "TerdiriPesanan"."isiPesanan" FROM "TerdiriPesanan" WHERE "idPesanan" = ${idPesanan} AND "isiPesanan" = ${isiPesanan}`
        const queryDecrease = `UPDATE "PesananTambahan" SET "jumlah" = "jumlah" - ${request.jumlah} WHERE "idPesanan" = ${idPesanan} AND "isiPesanan" = ${isiPesanan} RETURNING "jumlah"`
        const queryDelete = `DELETE FROM "PesananTambahan" WHERE "idPesanan" = ${idPesanan} AND "isiPesanan" = ${isiPesanan}`

        try{
            let queryAccept = ''
            const resultCheck = await conn.query(queryCheck) // cek pesanan tambahan sudah pernah dipesan sebelumnya / tidak
            console.log(resultCheck.rows)
            if(resultCheck.rows.length > 0){
                queryAccept = `UPDATE "TerdiriPesanan" SET "jumlah" = "jumlah" + ${request.jumlah} WHERE "idPesanan" = ${idPesanan} AND "isiPesanan" = ${isiPesanan}`
            }else{
                queryAccept = `INSERT INTO "TerdiriPesanan" VALUES (${idPesanan}, ${isiPesanan}, ${request.jumlah}, 1, 0, 0)`
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
    }else if(tipe === 'reject'){ //reject parsial dari kitchen maupun pelanggan
        const queryDecrease = `UPDATE "PesananTambahan" SET "jumlah" = "jumlah" - ${request.jumlah} WHERE "idPesanan" = ${idPesanan} AND "isiPesanan" = ${isiPesanan} RETURNING "jumlah"`
        const queryDelete = `DELETE FROM "PesananTambahan" WHERE "idPesanan" = ${idPesanan} AND "isiPesanan" = ${isiPesanan}`
        const queryCheckAdditional = `SELECT * FROM "PesananTambahan" WHERE "idPesanan" = ${idPesanan}`
        const queryCheck = `SELECT "status" FROM "TerdiriPesanan" WHERE "idPesanan" = ${idPesanan}`
        const queryFinish = `UPDATE "Pesanan" SET "statusPesanan" = 3 WHERE "idPesanan" = ${idPesanan}`

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
    }
    
    return
}