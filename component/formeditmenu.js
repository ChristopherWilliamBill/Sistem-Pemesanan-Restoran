import { useState, useEffect } from "react";
import styles from "../styles/FormMenu.module.css"
import Router, { useRouter } from "next/router";

export default function FormEditMenu({selectedMenu, dataMenu, idAdmin}){
    const router = useRouter()

    const [namaMenu, setNamaMenu] = useState("")
    const [deskripsi, setDeskripsi] = useState("")
    const [harga, setHarga] = useState(0)
    const [paket, setPaket] = useState([])
    //const [addPaket, setAddPaket] = useState([])
    const [deletedPaket, setDeletedPaket] = useState([])
    const [selectedPaket, setSelectedPaket] = useState(0)

    useEffect(() => {
        if (selectedMenu) {
            setNamaMenu(selectedMenu.namaMenu)
            setHarga(selectedMenu.harga)
            setPaket(selectedMenu.isiMenu)
            setDeskripsi(selectedMenu.deskripsiMenu)
            //setAddPaket([])
            setDeletedPaket([])

            //deskripsi untuk menu paket adalah list nama isi paketnya
        }
    }, [selectedMenu]) //ketika selectedMenu berubah, callback akan dieksekusi (mengupdate state menjadi menu yang sedang dipilih di parent)

    useEffect(() => {
        let d = ""
        
        if(paket.length > 0){
            for(let i = 0; i < paket.length; i++){
                d += `${paket[i].jumlah} x ${dataMenu[paket[i].isiMenu - 1].namaMenu}, `
            }

            d = d.substring(0, d.length - 2)
            setDeskripsi(d)
        }else{
            setDeskripsi(selectedMenu.deskripsiMenu)
        }

        if(paket.length == 0 && deletedPaket.length > 0){
            setDeskripsi('-')
        }

        // if(addPaket.length > 0){
        //     console.log(addPaket)
        //     for(let i = 0; i < addPaket.length; i++){
        //         d += `${dataMenu[addPaket[i].isiMenu - 1].namaMenu}, `
        //     }
        // }
        
    }, [paket])

    const handleSubmit = async () => {
        const data = {
            namaMenu: namaMenu,
            deskripsiMenu: deskripsi,
            harga: harga,
            idMenu: selectedMenu.idMenu,
            idAdmin: idAdmin,
            addPaket: addPaket,
            deletedPaket: deletedPaket
        }
    
        const JSONdata = JSON.stringify(data)
    
        const endpoint = '../api/editmenu'
    
        const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSONdata
        }
    
        const response = await fetch(endpoint, options)
        const result = await response.json()
        alert(result.message)
        router.push('../')
    }

    const handleChange = (e) => {
        setPaket(paket => [...paket, {isiMenu: parseInt(e.target.value), jumlah: 1}])
        setSelectedPaket(0)
    }

    const removePaket = (index, id) => {
        if(!deletedPaket.includes(id)){
            setDeletedPaket(deletedPaket => [...deletedPaket, id])
        }
        setPaket(paket => paket.filter((p, i) => i !== index))
    }

    const checkPaket = (id) => {
        return !paket.some(p => p.isiMenu == id)
    }

    // const removeAddPaket = (index, id) => {
    //     setAddPaket(paket => paket.filter((p, i) => i !== index))
    // }

    const handleJumlahPaket = (jumlah, isiMenu, index) => {
        if(jumlah == 0){
            removePaket(index, isiMenu)
        }

        setPaket(paket => [...paket].map(p => {
            if(p.isiMenu === isiMenu) {
              return {
                ...p,
                jumlah: parseInt(jumlah)
              }
            }
            else return p;
        }))
    }

    return(
        <div>
            <h3>Updated menu data: </h3>
            <div className={styles.tambahmenuform}>
                <div className={styles.inputcontainer}>
                    <p>Name</p>
                    <input type='text' placeholder={selectedMenu.namaMenu} value={namaMenu} onChange={({target}) => setNamaMenu(target.value)} name="namaMenu" required></input>
                </div>

                {paket.length == 0 && deletedPaket.length == 0 ?
                    <div className={styles.inputcontainer}>
                        <p>Description</p>
                        <input type='text' placeholder={selectedMenu.deskripsiMenu} value={deskripsi} onChange={({target}) => setDeskripsi(target.value)} name="deskripsi" required></input>
                    </div>
                    :
                    <div className={styles.inputcontainer}>
                        <p>Description</p>
                        <p>{deskripsi}</p>
                    </div>
                }

                <div className={styles.inputcontainer}>
                    <p>Price</p>
                    <input type='number' placeholder={selectedMenu.harga} value={harga} onChange={({target}) => setHarga(target.value)} name="harga" required></input>
                </div>

                {(paket.length > 0 || deletedPaket.length > 0) &&
                    <div className={styles.inputpaketcontainer}>
                        <p>Packet</p>
                        <div className={styles.paketcontainer}>
                            {paket.map((p, index)=> 
                                <div className={styles.paketlist}>
                                    <p>{dataMenu[p.isiMenu - 1].namaMenu}</p> 
                                    <div className={styles.jumlahpaket}>
                                        <input type='number' min="0" value={p.jumlah} onChange={({target}) => handleJumlahPaket(target.value, p.isiMenu, index)}></input>
                                        <button onClick={() => removePaket(index, p.isiMenu)}>x</button> 
                                    </div>
                                </div>
                            )}

                            {/* {addPaket.length > 0 && <p className={styles.pembatas}>Additional menu</p>}

                            {addPaket.map((p, index) => 
                                <div className={styles.paketlist}>
                                    <p>{dataMenu[p.isiMenu - 1].namaMenu}</p> 
                                    <div className={styles.jumlahpaket}>
                                        <input type='number' min="0" value={p.jumlah}></input>
                                        <button onClick={() => removeAddPaket(index, p)}>x</button> 
                                    </div>
                                </div>
                            )}

                            {deletedPaket.length > 0 && <p className={styles.pembatas}>Removed menu</p>}

                            {deletedPaket.map( p => 
                                <div className={styles.paketlist}>
                                    <p><del>{dataMenu[p.isiMenu - 1].namaMenu}</del></p> 
                                </div>
                            )} */}

                            <div className={styles.paketlist}>
                                <p>Add more</p>
                                <select onChange={handleChange} value={selectedPaket}>
                                    <option value={0}> select menu </option>

                                    {/* yang dapat menjadi option isi paket hanyalah menu yang bukan berupa paket dan belum ditambahkan jadi isi paketnya*/}
                                    {dataMenu.filter(d => checkPaket(d.idMenu)).filter(d => d.isiMenu.length == 0).map(d => 
                                        <option value={d.idMenu}>{d.namaMenu}</option>
                                    )}
                                </select>
                            </div>
                        </div>
                    </div>
                }

                <div className={styles.finishbutton}>
                    <button className={'btn-primary'} onClick={handleSubmit}>Submit</button>
                    <button className={'btn-danger'}>Deactivate Menu</button>
                </div>

            </div>
        </div>
    )
}