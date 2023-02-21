import { Server } from 'Socket.IO'
import {conn} from '../../lib/pg.js';

export default (req, res) => {
    if (res.socket.server.io) {
        console.log('Socket is already running')
    } else {
        console.log('Socket is initializing')
        const io = new Server(res.socket.server)
        res.socket.server.io = io

        io.on('connection', socket => {
            socket.on('notify-kitchen', async msg => {
                console.log('NOTIFY KITCHEN DITERIMA')
                const queryOrder = `SELECT "Pesanan"."idPesanan", "Pesanan"."statusPesanan", "Pesanan"."jam", "Pesanan"."idMeja", "Pesanan"."selesai", "TerdiriPesanan"."isiPesanan", "TerdiriPesanan"."jumlah", "TerdiriPesanan"."status" FROM "Pesanan" INNER JOIN "TerdiriPesanan" ON "Pesanan"."idPesanan" = "TerdiriPesanan"."idPesanan"`

                try{
                    const resOrder = await conn.query(queryOrder)
                    const dataOrder = resOrder.rows

                    const order = dataOrder.reduce((order, {idPesanan, isiPesanan, jumlah, statusPesanan, jam, idMeja, status}) => {
                        if(!order[idPesanan -1]){
                          order[idPesanan -1] = {idPesanan: idPesanan, isiPesanan: [], jumlah: [], status: []}
                        }
                    
                        order[idPesanan -1].isiPesanan.push(isiPesanan)
                        order[idPesanan -1].jumlah.push(jumlah)
                        order[idPesanan -1].statusPesanan = statusPesanan
                        order[idPesanan -1].jam = jam
                        order[idPesanan -1].idMeja = idMeja
                        order[idPesanan -1].status.push(status)
                    
                        return order;
                    }, []);

                    order.filter(o => o != null)
                    console.log("ORDER SOCKET:")
                    console.log(order)

                    socket.broadcast.emit('send-orders', order)


                }catch(err){
                    console.log(err)
                }
            })

            socket.on('handleorder', async msg => {
                try{
                    console.log('HANDLE')
                    socket.broadcast.emit('statusorder', msg)
                }catch(err){
                    console.log(err)
                }
            })

            socket.on('test', async msg => {
                console.log(msg)
            })
        })
    }
    res.end()
}
