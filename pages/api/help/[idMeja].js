import {conn} from '../../../module/pg.js';
import { getToken } from "next-auth/jwt"

export default async (req, res) => {

    const token = await getToken({ req })
    if (token) {
        console.log("JSON Web Token", JSON.stringify(token, null, 2))
    } else {
        res.status(401).send({message: "Not signed in"})
        return
    }

    const { idMeja } = req.query
    const method = req.method
    const queryCheck = `SELECT "help" FROM "Meja" WHERE "idMeja" = ${idMeja}`

    switch (method) {
        case 'POST': // check help status
            const resultCheck = await conn.query(queryCheck)
        
            try{
                res.status(200).json({ message: parseInt(resultCheck.rows[0].help) })
            }catch(err){
                console.log(err)
                res.status(400).send({ message: 'Failed' })
            }
            break
        case 'PUT': // requesting help
            try{
                const resultCheck = await conn.query(queryCheck)
                let help = 1
                if(parseInt(resultCheck.rows[0].help) === 1){
                    help = 0
                }
                const query = `UPDATE "Meja" SET "help" = ${help} WHERE "idMeja" = ${idMeja} RETURNING "help"`
                const result = await conn.query(query)
                
                res.status(200).json({ message: result.rows[0].help })
            }catch(err){
                console.log(err)
                res.status(400).send({ message: 'Failed' })
            }
            break
        default:
            res.status(405).end(`Method ${method} Not Allowed`)
    }
    return
}