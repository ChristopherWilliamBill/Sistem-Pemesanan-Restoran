import { Server } from 'Socket.IO'
import {conn} from '../../lib/pg.js';
import { getToken } from "next-auth/jwt"

export default (req, res) => {
    if (res.socket.server.io) {
        console.log('Socket is already running')
    } else {
        console.log('Socket is initializing')
        const io = new Server(res.socket.server)
        res.socket.server.io = io

        io.on('connection', socket => {
            socket.on('notify-kitchen', async msg => {
                const queryMenu = `SELECT * FROM "Menu"`
                const queryOrder = `SELECT "Pesanan"."idPesanan", "Pesanan"."statusPesanan", "Pesanan"."jam", "Pesanan"."idMeja", "Pesanan"."selesai", "TerdiriPesanan"."isiPesanan", "TerdiriPesanan"."jumlah", "TerdiriPesanan"."status" , "TerdiriPesanan"."delivered" FROM "Pesanan" INNER JOIN "TerdiriPesanan" ON "Pesanan"."idPesanan" = "TerdiriPesanan"."idPesanan"`
                const queryOrderTambahan = `SELECT "Pesanan"."idPesanan", "Pesanan"."statusPesanan", "Pesanan"."jam", "Pesanan"."idMeja", "Pesanan"."selesai", "PesananTambahan"."isiPesanan", "PesananTambahan"."jumlah", "PesananTambahan"."status", "PesananTambahan"."delivered" FROM "Pesanan" INNER JOIN "PesananTambahan" ON "Pesanan"."idPesanan" = "PesananTambahan"."idPesanan" ORDER BY "PesananTambahan"."isiPesanan" ASC`
                const queryPaket = `SELECT "Menu"."idMenu", "TerdiriMenu"."isiMenu" FROM "Menu" INNER JOIN "TerdiriMenu" ON "Menu"."idMenu" = "TerdiriMenu"."idMenu"`

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
                    }

                    dataMenu.sort((a,b) => a.idMenu - b.idMenu)

                    for(let i = 0; i < dataPaket.length; i++){
                      dataMenu[dataPaket[i].idMenu - 1].isiMenu.push(dataPaket[i].isiMenu)
                    }

                    const order = dataOrder.reduce((order, {idPesanan, isiPesanan, jumlah, statusPesanan, jam, idMeja, status, delivered}) => {
                        if(!order[idPesanan -1]){
                          order[idPesanan -1] = {idPesanan: idPesanan, isiPesanan: [], jumlah: [], status: [], isiPaket: [], delivered: []}
                        }
                    
                        order[idPesanan - 1].isiPesanan.push(isiPesanan)
                        order[idPesanan - 1].jumlah.push(jumlah)
                        order[idPesanan - 1].statusPesanan = statusPesanan
                        order[idPesanan - 1].jam = jam
                        order[idPesanan - 1].idMeja = idMeja
                        order[idPesanan - 1].status.push(status)
                        order[idPesanan - 1].delivered.push(delivered)
                    
                        return order;
                    }, []);

                    order.map(o => {
                        o.isiPesanan.map( isi => { //lihat setiap isi pesanannya
                          dataMenu[isi - 1].isiMenu.length > 0 ? //kalau isi pesanannya punya isi menu lagi (artinya pesanan ini = paket)
                            o.isiPaket.push(dataMenu[isi - 1].isiMenu) //array isiPaket diisi array isiMenu (daftar menu dari paketnya)
                          : o.isiPaket.push(0) //kalau tidak, isi angka 0 (artinya bukan paket)
                        })
                      })

                    order.filter(o => o != null)

                    socket.emit('sendorders', order)
                }catch(err){
                    console.log(err)
                }
            })

            socket.on('handleorder', async msg => {
                try{
                    const statusorder = 'statusorder' + msg
                    socket.broadcast.emit(statusorder, msg)
                }catch(err){
                    console.log(err)
                }
            })
        })
    }
    res.end()
}
