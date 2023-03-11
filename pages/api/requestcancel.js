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

    const query = `UPDATE "TerdiriPesanan" SET "requestcancel" = "requestcancel" + ${request.jumlah}, "status" = 5 WHERE "idPesanan" = ${request.idPesanan} AND "isiPesanan" = ${request.isiPesanan} RETURNING "jumlah"`

    try{
        const result = await conn.query(query)        
        res.status(200).json({ message: 'Update Success' })
    }catch(err){
        console.log(err)
        res.status(400).send({ message: 'Update Failed' })
    }
    return
}