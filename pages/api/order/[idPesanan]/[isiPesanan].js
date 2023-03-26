import {conn} from '../../../../module/pg.js';
import { getToken } from "next-auth/jwt"

export default async (req, res) => {
    //Handle MENU 1 PER 1 BERDASARKAN idPesanan dan isiPesanan
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

    if(tipe === 'deliver'){ //deliver parsial dari kitchen
        const queryCheck = `SELECT "TerdiriPesanan"."status" FROM "TerdiriPesanan" INNER JOIN "Pesanan" ON "Pesanan"."idPesanan" = "TerdiriPesanan"."idPesanan" WHERE "Pesanan"."idPesanan" = ${idPesanan} AND "Pesanan"."statusPesanan" = 2`
        const queryDeliver = `UPDATE "TerdiriPesanan" SET "delivered" = "delivered" + ${request.jumlah} WHERE "idPesanan" = ${idPesanan} AND "isiPesanan" = ${isiPesanan} RETURNING "jumlah", "delivered", "idPesanan", "isiPesanan"`
        const query = `UPDATE "TerdiriPesanan" SET "status" = 2 WHERE "idPesanan" = ${idPesanan} AND "isiPesanan" = ${isiPesanan}`
        const queryFinish = `UPDATE "Pesanan" SET "statusPesanan" = 3 WHERE "idPesanan" = ${idPesanan}`
        const queryKelola = `INSERT INTO "KelolaPesanan" ("idPesanan", "idAdmin", "aksi", "jam") VALUES (${idPesanan}, ${request.idAdmin}, 3, current_timestamp)`

        try{
            //antar pesanan
            const resultDeliver = await conn.query(queryDeliver)
            console.log(resultDeliver.rows)

            //kalau semua sudah diantar (jumlah pesanan == jumlah delivered), semua terdiripesanan jadi statusnya 2
            if(resultDeliver.rows[0].jumlah == resultDeliver.rows[0].delivered){
            const result = await conn.query(query)
            }

            //cek jika semua terdiripesanan statusnya 2
            const resultCheck = await conn.query(queryCheck)
            console.log(resultCheck.rows)

            //jika ya, status pesanan = 3 (deliverd all)
            if(resultCheck.rows.every(r => r.status == 2)){
            const resultFinish = await conn.query(queryFinish)
            const resultKelola = await conn.query(queryKelola)
            }

            res.status(200).json({ message: 'Update Success' })

        }catch(err){
            console.log(err)
            res.status(400).send({ message: 'Update Failed' })
        }
        
    }else if(tipe === 'reject'){ //reject parsial dari kitchen  
        const queryCheck = `SELECT "TerdiriPesanan"."status" FROM "TerdiriPesanan" INNER JOIN "Pesanan" ON "Pesanan"."idPesanan" = "TerdiriPesanan"."idPesanan" WHERE "Pesanan"."idPesanan" = ${idPesanan} AND "Pesanan"."statusPesanan" = 2`
        const query = `UPDATE "TerdiriPesanan" SET "status" = 2 WHERE "idPesanan" = ${idPesanan} AND "isiPesanan" = ${isiPesanan}`
        const queryFinish = `UPDATE "Pesanan" SET "statusPesanan" = 3 WHERE "idPesanan" = ${idPesanan}`
        const queryKelola = `INSERT INTO "KelolaPesanan" ("idPesanan", "idAdmin", "aksi", "jam") VALUES (${idPesanan}, ${request.idAdmin}, 3, current_timestamp)`
        const queryReject = `UPDATE "TerdiriPesanan" SET "jumlah" = "jumlah" - ${request.jumlah} WHERE "idPesanan" = ${idPesanan} AND "isiPesanan" = ${isiPesanan} RETURNING "jumlah", "delivered", "idPesanan", "isiPesanan"`
        const queryDelete = `DELETE FROM "TerdiriPesanan" WHERE "idPesanan" = ${idPesanan} AND "isiPesanan" = ${isiPesanan}`
        const queryCheckIsi = `SELECT * FROM "TerdiriPesanan" WHERE "idPesanan" = ${idPesanan}`
        const querySetCancel = `UPDATE "Pesanan" SET "statusPesanan" = 5, "selesai" = 1 WHERE "idPesanan" = ${idPesanan}`

        try{
            //reject pesanan
            const resultReject = await conn.query(queryReject)
            console.log(resultReject.rows)

            //kalau semua sudah diantar (jumlah pesanan == jumlah delivered), semua terdiripesanan jadi statusnya 2
            if(resultReject.rows[0].jumlah == resultReject.rows[0].delivered){
                const result = await conn.query(query)
            }

            //kalau semua direject, hapus terdiripesanan
            if(resultReject.rows[0].jumlah == 0){
                const resultDelete = await conn.query(queryDelete)
                const resultCheckIsi = await conn.query(queryCheckIsi) //jika tidak ada lagi terdiripesanan
                if(resultCheckIsi.rows.length === 0){
                    const resultSetCancel = await conn.query(querySetCancel) //set status pesanan = 5 (dicancel)
                    res.status(200).json({ message: 'Update Success' })
                    return
                }
            }

            //cek jika semua terdiripesanan statusnya 2
            const resultCheck = await conn.query(queryCheck)
            console.log(resultCheck.rows)

            //jika ya, status pesanan = 3 (deliverd all)
            if(resultCheck.rows.every(r => r.status == 2)){
                const resultFinish = await conn.query(queryFinish)
                const resultKelola = await conn.query(queryKelola)
            }

            res.status(200).json({ message: 'Update Success' })

        }catch(err){
            console.log(err)
            res.status(400).send({ message: 'Update Failed' })
        }
    }else if(tipe === 'cancel'){
        const queryDecrease = `UPDATE "TerdiriPesanan" SET "jumlah" = "jumlah" - ${request.jumlah} WHERE "idPesanan" = ${idPesanan} AND "isiPesanan" = ${isiPesanan} RETURNING "jumlah"`
        const queryDelete = `DELETE FROM "TerdiriPesanan" WHERE "idPesanan" = ${idPesanan} AND "isiPesanan" = ${isiPesanan}`
        const queryCheck = `SELECT * FROM "TerdiriPesanan" WHERE "idPesanan" = ${idPesanan}`
        const queryCancelAll = `UPDATE "Pesanan" SET "statusPesanan" = 5, "selesai" = 1 WHERE "idPesanan" = ${idPesanan}`

        try{
            const resultDecrease = await conn.query(queryDecrease)
            console.log(resultDecrease.rows[0])
            if(resultDecrease.rows[0].jumlah == 0){
                const resultDelete = await conn.query(queryDelete)
            }

            const resultCheck = await conn.query(queryCheck)
            console.log(resultCheck.rows)

            if(resultCheck.rows.length == 0){
                const resultCancelAll = await conn.query(queryCancelAll)
                res.status(200).json({ message: 'All menu cancelled' })
                return
            }

            res.status(200).json({ message: 'Update Success' })
        }catch(err){
            console.log(err)
            res.status(400).send({ message: 'Update Failed' })
        }
    }
    
    return
}