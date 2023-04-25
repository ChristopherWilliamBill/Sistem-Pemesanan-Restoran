import {conn} from '../../../../module/pg';
import { getToken } from "next-auth/jwt"

export default async (req, res) => {

    const token = await getToken({ req })
    if (token) {
        console.log("JSON Web Token", JSON.stringify(token, null, 2))
    } else {
        res.status(401).send({message: "Not signed in"})
        return
    }

    const method = req.method
    const request = JSON.parse(JSON.stringify(req.body))
  
    switch (method) {
        case 'POST': //Tambah additional order baru
                            
            try{            
                const queryStatus = `SELECT "statusPesanan" FROM "Pesanan" WHERE "idPesanan" = ${request.idPesanan}`
                const resultStatus = await conn.query(queryStatus)
                const status = resultStatus.rows[0].statusPesanan
            
                //JIKA PESANAN UTAMA BELUM DIACCEPT
                if(status == 1){     
                    const queryCheckMultiple = `SELECT "isiPesanan" FROM "TerdiriPesanan" WHERE "idPesanan" = ${request.idPesanan}`
                    const resultCheckMultiple = await conn.query(queryCheckMultiple)
                    const checkMultiple = resultCheckMultiple.rows
            
                    for(let i = 0; i < request.dataOrder.length; i++){
                        let idMenu = request.dataOrder[i].idMenu
                        let jumlah = request.dataOrder[i].count
                
                        //JIKA PESANAN TAMBAHAN MENUNYA SUDAH ADA DI ORDER UTAMA, UPDATE JUMLAHNYA SAJA
                        if(checkMultiple.filter(r => r.isiPesanan == request.dataOrder[i].idMenu).length > 0){
                            let queryUpdateTP = `UPDATE "TerdiriPesanan" SET "jumlah" = "jumlah" + ${jumlah} WHERE "idPesanan" = ${request.idPesanan} AND "isiPesanan" = ${idMenu}`
                            let resultUpdateTP = await conn.query(queryUpdateTP)
                        }else{ //JIKA TIDAK, INSERT BARU
                            let queryTerdiriPesanan = `INSERT INTO "TerdiriPesanan" ("idPesanan", "isiPesanan", "jumlah", "status", "delivered", "requestcancel") VALUES (${request.idPesanan}, ${idMenu}, ${jumlah}, 1, 0, 0)`
                            let resultTerdiriPesanan = await conn.query(queryTerdiriPesanan)
                        }
                    }
                }
            
                //JIKA PESANAN UTAMA SUDAH DIACCEPT TAPI BELUM DIMASAK
                if(status == 2){   
                    const queryCheckMultiple = `SELECT "isiPesanan" FROM "PesananTambahan" WHERE "idPesanan" = ${request.idPesanan}`
                    const resultCheckMultiple = await conn.query(queryCheckMultiple)
                    const checkMultiple = resultCheckMultiple.rows  
            
                    for(let i = 0; i < request.dataOrder.length; i++){
                        let idMenu = request.dataOrder[i].idMenu
                        let jumlah = request.dataOrder[i].count
                
                        //JIKA SUDAH ADA PESANAN TAMBAHAN YANG SAMA
                        if(checkMultiple.filter(r => r.isiPesanan == request.dataOrder[i].idMenu).length > 0){
                            let queryUpdateTP = `UPDATE "PesananTambahan" SET "jumlah" = "jumlah" + ${jumlah} WHERE "idPesanan" = ${request.idPesanan} AND "isiPesanan" = ${idMenu}`
                            let resultUpdateTP = await conn.query(queryUpdateTP)
                        }else{ //JIKA TIDAK, INSERT BARU  
                            let queryTerdiriPesanan = `INSERT INTO "PesananTambahan" ("idPesanan", "isiPesanan", "jumlah") VALUES (${request.idPesanan}, ${idMenu}, ${jumlah})`
                            let resultTerdiriPesanan = await conn.query(queryTerdiriPesanan)
                        }
                    }
                }
            
                //JIKA PESANAN UTAMA DIANTAR SEMUA (FINISHED ORDER) TAPI BELUM DIBAYAR
                if(status == 3){    
                    const queryCheckMultiple = `SELECT "isiPesanan" FROM "PesananTambahan" WHERE "idPesanan" = ${request.idPesanan}`
                    const resultCheckMultiple = await conn.query(queryCheckMultiple)
                    const checkMultiple = resultCheckMultiple.rows  
                    const queryRevertStatus = `UPDATE "Pesanan" SET "statusPesanan" = 2 WHERE "idPesanan" = ${request.idPesanan}`
                    const resultRevertStatus = await conn.query(queryRevertStatus)
            
                    for(let i = 0; i < request.dataOrder.length; i++){
                        let idMenu = request.dataOrder[i].idMenu
                        let jumlah = request.dataOrder[i].count
                
                        //JIKA SUDAH ADA PESANAN TAMBAHAN YANG SAMA
                        if(checkMultiple.filter(r => r.isiPesanan == request.dataOrder[i].idMenu).length > 0){
                            let queryUpdateTP = `UPDATE "PesananTambahan" SET "jumlah" = "jumlah" + ${jumlah} WHERE "idPesanan" = ${request.idPesanan} AND "isiPesanan" = ${idMenu}`
                            let resultUpdateTP = await conn.query(queryUpdateTP)
                        }else{ //JIKA TIDAK, INSERT BARU  
                            let queryTerdiriPesanan = `INSERT INTO "PesananTambahan" ("idPesanan", "isiPesanan", "jumlah") VALUES (${request.idPesanan}, ${idMenu}, ${jumlah})`
                            let resultTerdiriPesanan = await conn.query(queryTerdiriPesanan)
                        }
                    }
                }
                
                res.status(201).json({ message: 'Order Success' })
            }catch(err){
                console.log(err)
                res.status(400).send({ message: 'Order Failed' })
            }
            
            break
        default:
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}