import { Server } from 'Socket.IO'
import {conn} from '../../module/pg.js';
import { getToken } from "next-auth/jwt"
import { orderFormatter } from '../../module/orderformatter.js';

export default (req, res) => {
    if (res.socket.server.io) {
        console.log('Socket is already running')
    } else {
        console.log('Socket is initializing')
        const io = new Server(res.socket.server)
        res.socket.server.io = io

        io.on('connection', socket => {
            socket.on('notify-antrian', async msg => {
                const queryMenu = `SELECT * FROM "Menu"`
                const queryOrder = `SELECT "Pesanan"."idPesanan", "Pesanan"."uuid", "Pesanan"."statusPesanan", "Pesanan"."jam", "Pesanan"."idMeja", "Pesanan"."selesai", "TerdiriPesanan"."isiPesanan", "TerdiriPesanan"."jumlah", "TerdiriPesanan"."status", "TerdiriPesanan"."delivered", "TerdiriPesanan"."requestcancel" FROM "Pesanan" LEFT JOIN "TerdiriPesanan" ON "Pesanan"."idPesanan" = "TerdiriPesanan"."idPesanan" ORDER BY "TerdiriPesanan"."status", "TerdiriPesanan"."jumlah", "TerdiriPesanan"."isiPesanan"`
                const queryOrderTambahan = `SELECT "Pesanan"."idPesanan", "Pesanan"."statusPesanan", "Pesanan"."jam", "Pesanan"."idMeja", "Pesanan"."selesai", "PesananTambahan"."isiPesanan", "PesananTambahan"."jumlah", "PesananTambahan"."status", "PesananTambahan"."delivered" FROM "Pesanan" INNER JOIN "PesananTambahan" ON "Pesanan"."idPesanan" = "PesananTambahan"."idPesanan" ORDER BY "PesananTambahan"."isiPesanan" ASC`
                const queryPaket = `SELECT "Menu"."idMenu", "TerdiriMenu"."isiMenu", "TerdiriMenu"."jumlah" FROM "Menu" INNER JOIN "TerdiriMenu" ON "Menu"."idMenu" = "TerdiriMenu"."idMenu"`

                try{
                    const resMenu = await conn.query(queryMenu)
                    const resPaket = await conn.query(queryPaket)
                    const resOrderUtama = await conn.query(queryOrder)
                    const resOrderTambahan = await conn.query(queryOrderTambahan)

                    const dataOrderUtama = resOrderUtama.rows
                    const dataOrderTambahan = resOrderTambahan.rows

                    const dataMenu = resMenu.rows
                    const dataPaket = resPaket.rows

                    const dataOrder = dataOrderUtama.concat(dataOrderTambahan)

                    for(let i = 0; i < dataMenu.length; i++){
                        dataMenu[i].isiMenu = []
                        dataMenu[i].jumlahMenu = []
                    }

                    dataMenu.sort((a,b) => a.idMenu - b.idMenu)

                    for(let i = 0; i < dataPaket.length; i++){
                      dataMenu[dataPaket[i].idMenu - 1].isiMenu.push(dataPaket[i].isiMenu)
                      dataMenu[dataPaket[i].idMenu - 1].jumlahMenu.push(dataPaket[i].jumlah)
                    }

                    const order = orderFormatter(dataOrder, dataMenu)

                    if(msg === 'table'){
                        console.log('notify antrian diterima dari table') //maka meja membroadcast ke kitchen (broadcast == send back to everyone)
                        socket.broadcast.emit('sendorders', order)
                    }

                    if(msg === 'kitchen'){
                        console.log('notify antrian diterima dari kitchen sendiri') //maka kirim ke diri sendiri (emit == send back to sender)
                        socket.emit('sendorders', order)
                    }
                }catch(err){
                    console.log(err)
                }
            })

            socket.on('notify-kitchen', async msg => {
                const queryKitchen = `SELECT "isiPesanan", SUM("TerdiriPesanan"."jumlah") - SUM("delivered") AS "sisa" FROM "TerdiriPesanan" INNER JOIN "Pesanan" ON "Pesanan"."idPesanan" = "TerdiriPesanan"."idPesanan" WHERE "Pesanan"."statusPesanan" = 2 AND "TerdiriPesanan"."status" = 1 OR "TerdiriPesanan"."status" = 5 GROUP BY "isiPesanan", "Pesanan"."statusPesanan" ORDER BY "sisa" DESC`
                const resKitchen = await conn.query(queryKitchen)
                const dataKitchen = resKitchen.rows
                socket.broadcast.emit('datakitchen', dataKitchen)
            })


            socket.on('handleorder', async msg => {
                try{
                    const statusorder = 'statusorder' + msg.idMeja
                    socket.broadcast.emit(statusorder, msg)
                }catch(err){
                    console.log(err)
                }
            })
        })
    }
    res.end()
}
