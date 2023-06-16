import { useState, useEffect } from "react";
import styles from "../styles/FormMenu.module.css"
import { useRouter } from "next/router";
import Image from "next/image";
import io from 'socket.io-client'
import sha256 from 'crypto-js/sha256';
import Swal from "sweetalert2";

let socket = null

export default function FormMenu({selectedMenu, dataMenu, idAdmin}){
    const router = useRouter()
    const [namaMenu, setNamaMenu] = useState(selectedMenu ? selectedMenu.namaMenu : '')
    const [deskripsi, setDeskripsi] = useState(selectedMenu ? selectedMenu.deskripsiMenu : '')
    const [harga, setHarga] = useState(selectedMenu ? selectedMenu.harga : 0)
    const [discount, setDiscount] = useState(selectedMenu ? selectedMenu.discount : 0)
    const [paket, setPaket] = useState(selectedMenu ? selectedMenu.isiMenu : [])
    const [deletedPaket, setDeletedPaket] = useState([])
    const [category, setCategory] = useState(selectedMenu ? selectedMenu.idKategori : 1)
    const [isSpicy, setIsSpicy] = useState(selectedMenu ? selectedMenu.isSpicy : 0)
    const [isFavorite, setIsFavorite] = useState(selectedMenu ? selectedMenu.isFavorite : 0)
    const [imageSrc, setImageSrc] = useState();
    
    const socketInitializer = async () => {
        await fetch('/api/socket')
        socket = io()
    
        socket.on('connect', () => {
          console.log('connected')
        })
    }

    const socketCleanUp = () => {
        if(socket){
            socket.removeAllListeners()
            socket.disconnect()
        }
    }
    
    useEffect(() => {
        socketInitializer()
        return () => {
            socketCleanUp()
        }
    }, [])

    const menuActivation = async (action) => {
        const data = { action: action, idAdmin: idAdmin }
        const JSONdata = JSON.stringify(data)
        const endpoint = `../api/menu/activation/${selectedMenu.idMenu}`
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        body: JSONdata
        }
    
        const response = await fetch(endpoint, options)
        const result = await response.json()
        console.log(result)
        if(result.revalidated){
            socket.emit('newmenukitchen', 'activate')
            Swal.fire({title: "Menu Updated", timer: 2000, showConfirmButton: false, icon: "success"}).then(async() => {
                router.reload()
            })
        }
    } 

    const uploadImage = async () => {
        if(!imageSrc){
            return null
        }

        const timestamp = Math.round(new Date().getTime() / 1000)
        const signatureString = `timestamp=${timestamp}${process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET}`
        const signature = sha256(signatureString);

        const formData = new FormData();
        formData.append('file', imageSrc)
        formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY)
        formData.append('timestamp', timestamp)
        formData.append('signature', signature)
        
        const endpoint = 'https://api.cloudinary.com/v1_1/dpggxjyay/image/upload'
        const options = {
            method: 'POST',
            body: formData
        }
    
        const response = await fetch(endpoint, options)
        const result = await response.json()   

        return result.secure_url 
    }

    const handleSubmit = async () => {
        let desc = ''
        if (paket.length > 0 || deletedPaket.length > 0){
            for(let i = 0; i < paket.length; i++){
                if(i !== paket.length - 1){
                    desc = desc + `${paket[i].jumlah} x ${dataMenu[paket[i].isiMenu - 1].namaMenu}, `
                }else{
                    desc = desc + `${paket[i].jumlah} x ${dataMenu[paket[i].isiMenu - 1].namaMenu}`
                }
            }
        }else{
            desc = deskripsi
        }

        if(namaMenu === '' || desc === '' || harga === '0' || discount > 99 || discount < 0){
            Swal.fire({title: "Invalid name, description, discount, or price", timer: 1500, showConfirmButton: false, icon: "error"})
            return
        }

        if(selectedMenu.idKategori === 3 && paket.length === 0){
            Swal.fire({title: "Invalid Package Contents", timer: 1500, showConfirmButton: false, icon: "error"})
            return
        }

        const resultImage = await uploadImage()
        const data = {
            namaMenu: namaMenu,
            deskripsiMenu: desc,
            harga: harga,
            idMenu: selectedMenu.idMenu,
            idAdmin: idAdmin,
            deletedPaket: deletedPaket,
            paket: paket,
            category: category,
            image: resultImage,
            discount: discount,
            isSpicy: isSpicy,
            isFavorite: isFavorite
        }   

        const JSONdata = JSON.stringify(data)
        const endpoint = '../api/menu'
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSONdata
        }
    
        const response = await fetch(endpoint, options)
        const result = await response.json()

        if(result.message === 'Cannot change menu details while menu is being ordered'){
            Swal.fire({title: 'Cannot change menu details while menu is being ordered', timer: 2000, showConfirmButton: false, icon: "error"})
        }

        if(result.revalidated){
            socket.emit('newmenukitchen', 'edit')
            Swal.fire({title: "Menu Updated", timer: 2000, showConfirmButton: false, icon: "success"}).then(async() => {
                router.reload()
            })
        }
    }

    const handleSubmitNew = async () => {
        let desc = ''
        if (paket.length > 0 || deletedPaket.length > 0){
            for(let i = 0; i < paket.length; i++){
                if(i !== paket.length - 1){
                    desc = desc + `${paket[i].jumlah} x ${dataMenu[paket[i].isiMenu - 1].namaMenu}, `
                }else{
                    desc = desc + `${paket[i].jumlah} x ${dataMenu[paket[i].isiMenu - 1].namaMenu}`
                }
            }
        }else{
            desc = deskripsi
        }

        const resultImage = await uploadImage()
        const data = {
            namaMenu: namaMenu,
            deskripsiMenu: desc,
            harga: harga,
            idAdmin: idAdmin,
            paket: paket,
            image: resultImage,
            category: category,
            discount: discount,
            isSpicy: isSpicy,
            isFavorite: isFavorite
        }
        console.log(data)

        if(namaMenu === '' || desc === '' || harga === '0' || !resultImage || discount > 99 || discount < 0){
            Swal.fire({title: "Invalid name, description, image, discount, or price", timer: 1500, showConfirmButton: false, icon: "error"})
            return
        }

        const JSONdata = JSON.stringify(data)
        const endpoint = '../api/menu'
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSONdata
        }
    
        const response = await fetch(endpoint, options)
        console.log(response)

        const result = await response.json()
        console.log(result)

        if(result.revalidated){
            socket.emit('newmenukitchen', 'new')
            Swal.fire({title: "Menu Added", timer: 2000, showConfirmButton: false, icon: "success"}).then(async() => {
                router.reload()
            })
        }
    }

    const handleChange = (e) => {
        setPaket(paket => [...paket, {isiMenu: parseInt(e.target.value), jumlah: 1}])
        setCategory(3)
    }

    const handleChangeCategory = (e) => {
        if(paket.length > 0){
            setCategory(3)
        }else{
            setCategory(e.target.value)
        }
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
        <div className={styles.form}>
            {selectedMenu ? <h3>Updated menu data: </h3> : <h3>Add menu: </h3>}
            <div className={styles.container}>
                <div className={styles.left}> 
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
                                {paket.length > 0 ? 
                                    <p>
                                        {paket.map((p,i) => (i !== paket.length - 1 ? `${p.jumlah} x ${dataMenu[p.isiMenu - 1].namaMenu}, ` : `${p.jumlah} x ${dataMenu[p.isiMenu - 1].namaMenu}`))}
                                    </p>
                                    : <p>-</p>
                                }
                            </div>
                        }

                        <div className={styles.inputcontainer}>
                            <p>Price</p>
                            <input type='number' placeholder={selectedMenu && selectedMenu.harga} value={harga} onChange={({target}) => setHarga(target.value)} name="harga" required></input>
                        </div>

                        {(!selectedMenu || selectedMenu.idKategori !== 3) && 
                        <div className={styles.inputcontainer}>
                            <p>Category</p>
                            <select onChange={handleChangeCategory} value={category}>
                                {paket.length === 0 && <option value={1}>Food</option>}
                                {paket.length === 0 && <option value={2}>Drinks</option>}
                                {paket.length > 0 && <option value={3}>Package</option>}
                            </select>
                        </div>}
                        
                        {(paket.length > 0 || deletedPaket.length > 0 || !selectedMenu) &&
                            <div className={styles.inputpaketcontainer}>
                                <p>Packet</p>
                                <div className={styles.paketcontainer}>
                                    {paket.map((p, index)=> 
                                        <div key={p.isiMenu} className={styles.paketlist}>
                                            <p>{dataMenu[p.isiMenu - 1].namaMenu}</p> 
                                            <div className={styles.jumlahpaket}>
                                                <input type='number' onWheel={(e) => e.target.blur()} min="0" value={p.jumlah} onChange={({target}) => handleJumlahPaket(target.value, p.isiMenu, index)}></input>
                                                <button className="btn-danger" onClick={() => removePaket(index, p.isiMenu)}>x</button> 
                                            </div>
                                        </div>
                                    )}

                                    <div className={styles.paketlist}>
                                        <p>Add more: </p>
                                        <select onChange={handleChange} value={0}>
                                            <option value={0}> select menu </option>
                                            {/* yang dapat menjadi option isi paket hanyalah menu yang bukan berupa paket dan belum ditambahkan jadi isi paketnya*/}
                                            {dataMenu.filter(d => checkPaket(d.idMenu)).filter(d => d.isiMenu.length == 0).map(d => 
                                                <option key={d.idMenu} value={d.idMenu}>{d.namaMenu}</option>
                                            )}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        }

                        <div className={styles.inputcontainer}>
                            <p>Picture</p>
                            <input type="file" name="gambarmenu" onChange={({target}) => setImageSrc(target.files[0])}></input>
                        </div>

                        <div className={styles.inputinfo}>
                            <p>Spicy</p>
                            <input type="checkbox" checked={Boolean(isSpicy)} onChange={(event) => setIsSpicy(event.target.checked ? 1 : 0)}></input>

                            <p>Favorite</p>
                            <input type="checkbox" checked={Boolean(isFavorite)} onChange={(event) => setIsFavorite(event.target.checked ? 1 : 0)}></input>
                        </div>

                        <div className={styles.inputcontainer}>
                            <p>Discount</p>
                            <input type='number' placeholder={selectedMenu && selectedMenu.discount} value={discount} onChange={({target}) => setDiscount(target.value)} name="discount" required max={99} min={0}></input>
                        </div>
                    </div>
                </div>

                <div className={styles.right}>
                    {(!imageSrc && selectedMenu) && <Image className={styles.image} width={600} height={400} src={selectedMenu.gambar}></Image>}
                    {imageSrc && <img className={styles.image} src={URL.createObjectURL(imageSrc)}></img>}
                    <br></br>
                    {selectedMenu && <label>Last edited by: {selectedMenu.username}</label>}
                </div>
            </div>

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
    )
}