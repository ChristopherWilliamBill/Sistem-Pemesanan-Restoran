import {conn} from '../../../module/pg';
import { getToken } from "next-auth/jwt"

export default async (req, res) => {
    console.log('masuk')

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
        case 'POST': //Tambah menu
            let imageUrl = ''
            if(request.image){
                imageUrl = request.image.substring(49, request.image.length)
            }else{
                imageUrl = '/v1678896383/nophoto.jpg'
            }

            const queryPOST = `INSERT INTO "Menu" ("namaMenu", "deskripsiMenu", "harga", "idAdmin", "aktif", "gambar", "idKategori", "isSpicy", "isFavorite", "discount") VALUES ('${request.namaMenu}', '${request.deskripsiMenu}', ${request.harga}, '${request.idAdmin}', 1, '${imageUrl}', ${request.category}, ${request.isSpicy}, ${request.isFavorite}, ${request.discount}) RETURNING "idMenu"`
            console.log(queryPOST)
            try{
                const result = await conn.query(queryPOST)
                const idMenu = result.rows[0].idMenu
                if(request.paket.length > 0){
                for(let i = 0; i < request.paket.length; i++){
                    let queryPaket = `INSERT INTO "TerdiriMenu" VALUES (${idMenu}, ${request.paket[i].isiMenu}, ${request.paket[i].jumlah})`
                    let resultPaket = await conn.query(queryPaket)
                }
                }

                const datarevalidate = {secret: process.env.REVALIDATE_TOKEN, path: ['/', '/admin/editmenu', '/admin/addmenu']}
                const JSONdata = JSON.stringify(datarevalidate)
                const endpoint = 'http://localhost:3000/api/revalidate'
                const options = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSONdata
                }

                const resRevalidate = await fetch(endpoint, options)
                const revalidated = await resRevalidate.json()

                res.status(200).json({ message: 'Menu Added', revalidated: revalidated})  
            }catch(err){
                console.log(err)
                res.status(400).send({ message: 'Failed' })
            }
            
            break
        case 'PUT': //Edit data menu
            let query = ''
            if(!request.image){
                query = `UPDATE "Menu" SET "namaMenu" = '${request.namaMenu}', "deskripsiMenu" = '${request.deskripsiMenu}', "harga" = ${request.harga}, "idAdmin" = ${request.idAdmin}, "idKategori" = ${request.category}, "isSpicy" = ${request.isSpicy}, "isFavorite" = ${request.isFavorite}, "discount" = ${request.discount} WHERE "idMenu" = ${request.idMenu}`
            }else{
                const imageUrl = request.image.substring(49, request.image.length)
                query = `UPDATE "Menu" SET "namaMenu" = '${request.namaMenu}', "deskripsiMenu" = '${request.deskripsiMenu}', "harga" = ${request.harga}, "idAdmin" = ${request.idAdmin}, "gambar" = '${imageUrl}', "idKategori" = ${request.category}, "isSpicy" = ${request.isSpicy}, "isFavorite" = ${request.isFavorite}, "discount" = ${request.discount} WHERE "idMenu" = ${request.idMenu}`
            }

            const queryCheckIsOrdered = `SELECT "Menu"."harga" FROM "Pesanan" INNER JOIN "TerdiriPesanan" ON "Pesanan"."idPesanan" = "TerdiriPesanan"."idPesanan" INNER JOIN "Menu" ON "Menu"."idMenu" = "TerdiriPesanan"."isiPesanan" WHERE "TerdiriPesanan"."isiPesanan" = ${request.idMenu} AND "Pesanan"."selesai" = 0`
            const queryCheckIsiPaket = `SELECT * FROM "TerdiriMenu" WHERE "idMenu" = ${request.idMenu}`
            const queryCheck = `SELECT DISTINCT "idMenu" FROM "TerdiriMenu"`
            const queryJumlahPaket = `SELECT COUNT(*) FROM "TerdiriMenu" WHERE "idMenu" = ${request.idMenu}`

            try{
                //tidak bisa nambahin harga waktu menu udah dipesen
                const resultCheckIsOrdered = await conn.query(queryCheckIsOrdered)
                if(resultCheckIsOrdered.rows.length > 0){
                    if(request.harga > resultCheckIsOrdered.rows[0].harga){
                        res.status(403).json({ message: 'Cannot increase price while menu is being ordered' })
                        return
                    }
                }
                
                //menu bertipe paket tidak boleh tidak memiliki isi menu
                const resultCheck = await conn.query(queryCheck)
                if(resultCheck.rows.some(r => r.idMenu == request.idMenu)){
                const resultJumlah = await conn.query(queryJumlahPaket) //cek menu punya berapa isipaket
                if(request.deletedPaket.length >= parseInt(resultJumlah.rows[0].count) && request.paket.length == 0){ //jika jumlah paket yg dihapus = jumlah paket saat ini, dan tidak ditambahkan lagi dengan paket lain, maka invalid
                    res.status(403).json({ message: 'Package must consist of at least 1 menu' })
                    return
                }
                }

                if(request.deletedPaket.length > 0){
                for(let i = 0; i < request.deletedPaket.length; i++){
                    let isiMenu = request.deletedPaket[i]
                    console.log("isimenu:" + isiMenu)
                    let queryDelete = `DELETE FROM "TerdiriMenu" WHERE "idMenu" = ${request.idMenu} AND "isiMenu" = ${isiMenu}`
                    let resultDelete = await conn.query(queryDelete)
                }
                }

                const resultIsiPaket = await conn.query(queryCheckIsiPaket)
                let queryAdd = ''
                if(request.paket.length > 0){
                for(let i = 0; i < request.paket.length; i++){
                    let isiMenu = request.paket[i].isiMenu
                    if(resultIsiPaket.rows.some(r => r.isiMenu === isiMenu)){ //jika paket sudah memiliki isi menu yg sama, ganti jumlahnya saja
                    queryAdd = `UPDATE "TerdiriMenu" SET "jumlah" = ${request.paket[i].jumlah} WHERE "isiMenu" = ${isiMenu} AND "idMenu" = ${request.idMenu}`
                    }else{ //jika tidak, insert baru
                    queryAdd = `INSERT INTO "TerdiriMenu" VALUES (${request.idMenu}, ${isiMenu}, ${request.paket[i].jumlah})`
                    }
                    let resultAdd = await conn.query(queryAdd)
                }
                }

                const result = await conn.query(query)

                const datarevalidate = {secret: process.env.REVALIDATE_TOKEN, path: ['/', '/admin/editmenu', '/admin/addmenu']}
                const JSONdata = JSON.stringify(datarevalidate)
                const endpoint = 'http://localhost:3000/api/revalidate'
                const options = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSONdata
                }

                const resRevalidate = await fetch(endpoint, options)
                const revalidated = await resRevalidate.json()

                res.status(200).json({ message: 'Data Updated', revalidated: revalidated})
            }catch(err){
                console.log(err)
                res.status(400).send({ message: 'Failed' })
            }
            
            break
        default:
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}