import {conn} from '../../lib/pg.js';

export default async (req, res) => {
  if(req.method !== "POST"){
    res.status(405)
    return
  }

  const request = req.body

  console.log(request)

  const idMeja = parseInt(request.idMeja)

  const queryPesanan = `INSERT INTO "Pesanan" ("idMeja", "jam", "statusPesanan", "selesai") VALUES (${idMeja}, current_timestamp, 1, 0) RETURNING "idPesanan"`

  try{
    //JIKA PESANAN BARU, BUKAN PESANAN TAMBAHAN
    if(request.tipe == 'new'){
      const result = await conn.query(queryPesanan)
      const currentOrder = result.rows[0].idPesanan
      
      for(let i = 0; i < request.dataOrder.length; i++){
        let idMenu = request.dataOrder[i].idMenu
        let jumlah = request.dataOrder[i].count
    
        let queryTerdiriPesanan = `INSERT INTO "TerdiriPesanan" ("idPesanan", "isiPesanan", "jumlah", "status", "delivered") VALUES (${currentOrder}, ${idMenu}, ${jumlah}, 1, 0)`
        let resultTerdiriPesanan = await conn.query(queryTerdiriPesanan)
      }
    }

    //JIKA PESANAN TAMBAHAN
    if(request.tipe == 'additional'){
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
            let queryTerdiriPesanan = `INSERT INTO "TerdiriPesanan" ("idPesanan", "isiPesanan", "jumlah", "status", "delivered") VALUES (${request.idPesanan}, ${idMenu}, ${jumlah}, 1, 0)`
            let resultTerdiriPesanan = await conn.query(queryTerdiriPesanan)
          }
        }
      }

      //JIKA PESANAN UTAMA SUDAH DIACCEPT TAPI BELUM DIMASAK
      if(status == 2){   
        const queryCheckMultiple = `SELECT "isiPesanan" FROM "TerdiriPesanan" WHERE "idPesanan" = ${request.idPesanan}`
        const resultCheckMultiple = await conn.query(queryCheckMultiple)
        const checkMultiple = resultCheckMultiple.rows  

        for(let i = 0; i < request.dataOrder.length; i++){
          let idMenu = request.dataOrder[i].idMenu
          let jumlah = request.dataOrder[i].count

          if(checkMultiple.filter(r => r.isiPesanan == request.dataOrder[i].idMenu).length > 0){
            let queryUpdateTP = `UPDATE "TerdiriPesanan" SET "jumlah" = "jumlah" + ${jumlah} WHERE "idPesanan" = ${request.idPesanan} AND "isiPesanan" = ${idMenu}`
            let resultUpdateTP = await conn.query(queryUpdateTP)
          }else{ //JIKA TIDAK, INSERT BARU  
            let queryTerdiriPesanan = `INSERT INTO "TerdiriPesanan" ("idPesanan", "isiPesanan", "jumlah", "status", "delivered") VALUES (${request.idPesanan}, ${idMenu}, ${jumlah}, 3, 0)`
            let resultTerdiriPesanan = await conn.query(queryTerdiriPesanan)
          }
        }
      }

      //JIKA PESANAN UTAMA DIANTAR SEMUA (FINISHED ORDER) TAPI BELUM DIBAYAR
      if(status == 3){    
        const queryCheckMultiple = `SELECT "isiPesanan" FROM "TerdiriPesanan" WHERE "idPesanan" = ${request.idPesanan}`
        const resultCheckMultiple = await conn.query(queryCheckMultiple)
        const checkMultiple = resultCheckMultiple.rows  
        const queryRevertStatus = `UPDATE "Pesanan" SET "statusPesanan" = 2 WHERE "idPesanan" = ${request.idPesanan}`
        const resultRevertStatus = await conn.query(queryRevertStatus)

        for(let i = 0; i < request.dataOrder.length; i++){
          let idMenu = request.dataOrder[i].idMenu
          let jumlah = request.dataOrder[i].count

          if(checkMultiple.filter(r => r.isiPesanan == request.dataOrder[i].idMenu).length > 0){
            let queryUpdateTP = `UPDATE "TerdiriPesanan" SET "jumlah" = "jumlah" + ${jumlah} WHERE "idPesanan" = ${request.idPesanan} AND "isiPesanan" = ${idMenu}`
            let resultUpdateTP = await conn.query(queryUpdateTP)
          }else{ //JIKA TIDAK, INSERT BARU  
            let queryTerdiriPesanan = `INSERT INTO "TerdiriPesanan" ("idPesanan", "isiPesanan", "jumlah", "status", "delivered") VALUES (${request.idPesanan}, ${idMenu}, ${jumlah}, 3, 0)`
            let resultTerdiriPesanan = await conn.query(queryTerdiriPesanan)
          }
        }
      }
    }

    res.status(201).json({ message: 'Order Success' })
  }catch(err){
    console.log(err)
    res.status(400).send({ message: 'Order Failed' })
  }

  return

}