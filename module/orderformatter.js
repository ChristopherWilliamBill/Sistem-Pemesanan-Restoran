export function orderFormatter(dataO, dataMenu){

    /* ----------------------------------------------------------------
        Format awal dataO (dari query database):
        idPesanan   isiPesanan  jumlah  ...
        1           2           2
        1           3           1
        1           4           3
        2           3           3  
        2           5           3 

        ...

        Format keluaran:
        [
            {idPesanan: 1, isiPesanan: [2, 3, 4], jumlah: [2, 1, 3], ...},
            {idPesanan: 2, isiPesanan: [3, 5], jumlah: [3, 3], ...},
            ...
        ]
    ------------------------------------------------------------------*/ 


    let order = dataO.reduce((order, {idPesanan, uuid, isiPesanan, jumlah, statusPesanan, jam, idMeja, status, delivered, requestcancel}) => {
        //loop setiap dataO, jika belum dibuat order dengan index idPesanan - 1, maka isi elemen tersebut dengan objek awal
        if(!order[idPesanan -1]){
          order[idPesanan -1] = {idPesanan: idPesanan, uuid: uuid, isiPesanan: [], jumlah: [], status: [], isiPaket: [], delivered: [], requestcancel: []}
        }

        //untuk setiap idPesanan yang sama, isi objek dengan value yang ditemukan
        order[idPesanan - 1].isiPesanan.push(isiPesanan)
        order[idPesanan - 1].jumlah.push(jumlah)
        order[idPesanan - 1].statusPesanan = statusPesanan
        order[idPesanan - 1].jam = jam
        order[idPesanan - 1].idMeja = idMeja
        order[idPesanan - 1].status.push(status)
        order[idPesanan - 1].delivered.push(delivered)
        order[idPesanan - 1].requestcancel.push(requestcancel)
    
        return order;
    }, []);
    
    //loop setiap order yang sudah difilter (bukan order yang dicancel)
    order.filter(or => or.status[0] != null).map(o => { 
        o.isiPesanan.map( isi => { //lihat setiap isi pesanannya
            dataMenu[isi - 1].isiMenu.length > 0 ? //kalau isi pesanannya punya isi menu lagi (artinya pesanan ini = paket)
            o.isiPaket.push(dataMenu[isi - 1].isiMenu) //array isiPaket diisi array isiMenu (daftar menu dari paketnya)
            : o.isiPaket.push(0) //kalau tidak, isi angka 0 (artinya bukan paket)
        })
    })
    
    return order
}
