import { Server } from 'Socket.IO'
import {conn} from '../../lib/pg.ts';

export default (req, res) => {
    if (res.socket.server.io) {
        console.log('Socket is already running')
    } else {
        console.log('Socket is initializing')
        const io = new Server(res.socket.server)
        res.socket.server.io = io

        io.on('connection', socket => {
            socket.on('notify-kitchen', async msg => {
                const queryOrder = `SELECT * FROM "PendingOrder"`

                try{
                    const result = await conn.query(queryOrder)
                    const orders = await result.rows
                    socket.broadcast.emit('send-orders', orders)

                }catch(err){
                    console.log(err)
                }

            })
        })
    }
    res.end()
}
