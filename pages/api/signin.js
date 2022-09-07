// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

// export default function handler(req, res) {
//   res.status(200).json({ name: 'John Doe' })
// }




import {conn} from '../../lib/pg.ts';


export default async (req, res) => {
  if(req.method !== "POST"){
    res.status(405)
    return
  }

  const request = JSON.parse(req.body)

  const query = `SELECT * FROM "Admin" WHERE "username" = '${request.username}' AND "password" = '${request.password}'`
  const result = await conn.query(query)
  const user = result.rows

  //user = array, user.length ngecek ada user atau ga
  if(user.length){
    res.status(200).json(user)
    return
  }

  res.status(405).send({ message: 'username salah' })
}