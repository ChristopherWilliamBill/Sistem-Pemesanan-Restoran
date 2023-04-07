import { getToken } from "next-auth/jwt"

export default async (req, res) => {
    if(req.method !== "POST"){
        res.status(405).send({ message: 'Method not allowed'})
        return
    }

    const token = await getToken({ req })
    if (token) {
        console.log("JSON Web Token", JSON.stringify(token, null, 2))
    } else {
        res.status(401).send({message: "Not signed in"})
        return
    }

    const request = JSON.parse(JSON.stringify(req.body))


    const escpos = require('escpos');
    escpos.USB = require('escpos-usb');
    const vid = escpos.USB.findPrinter()[0].deviceDescriptor.idVendor //2501
    const pid = escpos.USB.findPrinter()[0].deviceDescriptor.idProduct //22750

    // const device = escpos.USB(vid,pid);
    const device = escpos.USB()
    console.log('DEVICE: ')
    console.log()
    //console.log(device.command.MODEL.QSPRINTER)
    console.log(await escpos.USB.getDevice())
 
    const options = { encoding: "GB18030" /* default */ }
    const printer = new escpos.Printer(device, options);


    // console.log('PRINTER: ')
    // console.log()
    // console.log(printer)
 
    const print = () => {
        try{
            device.open(
                function(error){
                    printer
                    .font('a')
                    .align('ct')
                    .style('bu')
                    .size(1, 1)
                    .text('The quick brown fox jumps over the lazy dog')
                    // .text('敏捷的棕色狐狸跳过懒狗')
                    // .barcode('1234567', 'EAN8')
                    // .table(["One", "Two", "Three"])
                    // .tableCustom(
                    //     [
                    //         { text:"Left", align:"LEFT", width:0.33, style: 'B' },
                    //         { text:"Center", align:"CENTER", width:0.33},
                    //         { text:"Right", align:"RIGHT", width:0.33 }
                    //     ],
                    //     { encoding: 'cp857', size: [1, 1] } // Optional
                    // )
                }
            );

        }catch(err){
            console.log(err)
        }

    }

    console.log(request)

    try{
        print()
        res.status(200).json({ message: 'Print Success' })
    }catch(err){
        console.log(err)
        res.status(400).send({ message: 'Print Failed' })
    }

    return
}