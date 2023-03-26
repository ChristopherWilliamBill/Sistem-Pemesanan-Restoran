import {conn} from '../../../module/pg';
import { getToken } from "next-auth/jwt"

export default async (req, res) => {
    // membuat pesanan baru
    if(req.method !== "POST"){
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

    const idMeja = parseInt(request.idMeja)
    const queryPesanan = `INSERT INTO "Pesanan" ("idMeja", "jam", "statusPesanan", "selesai", "tanggal", "uuid") VALUES (${idMeja}, current_timestamp, 1, 0, now(), gen_random_uuid()) RETURNING "idPesanan"`
    
    try{
        const result = await conn.query(queryPesanan)
        const currentOrder = result.rows[0].idPesanan
        
        for(let i = 0; i < request.dataOrder.length; i++){
            let idMenu = request.dataOrder[i].idMenu
            let jumlah = request.dataOrder[i].count
        
            let queryTerdiriPesanan = `INSERT INTO "TerdiriPesanan" ("idPesanan", "isiPesanan", "jumlah", "status", "delivered", "requestcancel") VALUES (${currentOrder}, ${idMenu}, ${jumlah}, 1, 0, 0)`
            let resultTerdiriPesanan = await conn.query(queryTerdiriPesanan)
        }

        res.status(201).json({ message: 'Order Success' })
    }catch(err){
        console.log(err)
        res.status(400).send({ message: 'Order Failed' })
    }
 
}