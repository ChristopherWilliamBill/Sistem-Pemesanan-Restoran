import { useState, useEffect } from "react";
import styles from "../styles/FormMenu.module.css"
import Router, { useRouter } from "next/router";
import Image from "next/image";

export default function FormMenu({selectedMenu, dataMenu, idAdmin}){
    const router = useRouter()
    const [namaMenu, setNamaMenu] = useState("")
    const [deskripsi, setDeskripsi] = useState("")
    const [harga, setHarga] = useState(0)
    const [paket, setPaket] = useState([])
    const [deletedPaket, setDeletedPaket] = useState([])
    const [selectedPaket, setSelectedPaket] = useState(0)
    const [imageSrc, setImageSrc] = useState();

    useEffect(() => {
        if (selectedMenu) {
            setNamaMenu(selectedMenu.namaMenu)
            setHarga(selectedMenu.harga)
            setPaket(selectedMenu.isiMenu)
            setDeskripsi(selectedMenu.deskripsiMenu)
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
            if(selectedMenu) {
                setDeskripsi(selectedMenu.deskripsiMenu)
            }else{
                setDeskripsi('')
            }
        }

        if(paket.length == 0 && deletedPaket.length > 0){
            setDeskripsi('-')
        }
    }, [paket])

    const menuActivation = async (action) => {
        const data = { idMenu: selectedMenu.idMenu, action: action, idAdmin: idAdmin }
        const JSONdata = JSON.stringify(data)
        const endpoint = '../api/menuactivation'
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

    const handleSubmit = async () => {
        const data = {
            namaMenu: namaMenu,
            deskripsiMenu: deskripsi,
            harga: harga,
            idMenu: selectedMenu.idMenu,
            idAdmin: idAdmin,
            deletedPaket: deletedPaket,
            paket: paket
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

    const handleSubmitNew = async () => {
        const data = {
            namaMenu: namaMenu,
            deskripsiMenu: deskripsi,
            harga: harga,
            idAdmin: idAdmin,
            paket: paket
        }    
        const JSONdata = JSON.stringify(data)
        const endpoint = '../api/tambahmenu'
        const options = {
            method: 'POST',
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

    const handleImage = (v) => {
        setImageSrc(v)
    }

    const handleChange = (e) => {
        setPaket(paket => [...paket, {isiMenu: parseInt(e.target.value), jumlah: 1}])
        setSelectedPaket(0)
    }

    const removePaket = (index, id) => {
        if(selectedMenu){
            if(!deletedPaket.includes(id)){ //supaya deletedPaket isinya tidak ada yg double
                if(selectedMenu.isiMenu.some(s => s.isiMenu === id)){ //yang akan dikirim ke server untuk dihapus hanya isimenu yang sudah terdaftar di database
                    setDeletedPaket(deletedPaket => [...deletedPaket, id])
                }
            }
        }
        setPaket(paket => paket.filter((p, i) => i !== index))
    }

    const checkPaket = (id) => {
        return !paket.some(p => p.isiMenu == id)
    }

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
            {selectedMenu ? <h3>Updated menu data: </h3> : <h3>Add menu: </h3>}
            <div className={styles.tambahmenuform}>
                <div className={styles.inputcontainer}>
                    <p>Name</p>
                    <input type='text' placeholder={selectedMenu ? selectedMenu.namaMenu : 'Menu name'} value={namaMenu} onChange={({target}) => setNamaMenu(target.value)} name="namaMenu" required></input> 
                </div>

                {paket.length === 0 && deletedPaket.length === 0 ?
                    <div className={styles.inputcontainer}>
                        <p>Description</p>
                        <input type='text' placeholder={selectedMenu ? selectedMenu.deskripsiMenu : 'Menu description'} value={deskripsi} onChange={({target}) => setDeskripsi(target.value)} name="deskripsi" required></input>
                    </div>
                    :
                    <div className={styles.inputcontainer}>
                        <p>Description</p>
                        <p>{deskripsi}</p>
                    </div>
                }

                <div className={styles.inputcontainer}>
                    <p>Price</p>
                    <input type='number' placeholder={selectedMenu && selectedMenu.harga} value={harga} onChange={({target}) => setHarga(target.value)} name="harga" required></input>
                </div>

                {(paket.length > 0 || deletedPaket.length > 0 || !selectedMenu) &&
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

                            <div className={styles.paketlist}>
                                <p>Add more: </p>
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

                <div className={styles.inputcontainer}>
                    <p>Picture</p>
                    <input type="file" name="gambarmenu" onChange={({target}) => handleImage(target.files[0])}></input>
                </div>

                {(!imageSrc && selectedMenu) && <Image className={styles.image} width={600} height={400} src={selectedMenu.gambar}></Image>}
                {imageSrc && <img className={styles.image} src={URL.createObjectURL(imageSrc)}></img>}

                <div className={styles.finishbutton}>
                    {selectedMenu? 
                        <>
                            <button className={'btn-primary'} onClick={handleSubmit}>Submit</button>
                            {selectedMenu.aktif === 1 && <button className={'btn-danger'} onClick={() => menuActivation(0)}>Deactivate Menu</button>}
                            {selectedMenu.aktif === 0 && <button className={'btn-primary'} onClick={() => menuActivation(1)}>Activate Menu</button>}
                        </>
                    : <button className={'btn-primary'} onClick={handleSubmitNew}>Submit</button>}
                </div>
                
            </div>
        </div>
    )
}