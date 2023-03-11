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

    const queryDecrease = `UPDATE "PesananTambahan" SET "jumlah" = "jumlah" - ${request.jumlah} WHERE "idPesanan" = ${request.idPesanan} AND "isiPesanan" = ${request.isiPesanan} RETURNING "jumlah"`
    const queryDelete = `DELETE FROM "PesananTambahan" WHERE "idPesanan" = ${request.idPesanan} AND "isiPesanan" = ${request.isiPesanan}`

    try{
        const resultDecrease = await conn.query(queryDecrease)
        if(resultDecrease.rows[0].jumlah == 0){
            const resultDelete = await conn.query(queryDelete)
        }
        
        res.status(200).json({ message: 'Update Success' })
    }catch(err){
        console.log(err)
        res.status(400).send({ message: 'Update Failed' })
    }
    return
}