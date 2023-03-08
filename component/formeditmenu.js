import { useState, useEffect } from "react";
import styles from "../styles/FormMenu.module.css"
import Router, { useRouter } from "next/router";

export default function FormEditMenu({selectedMenu, dataMenu, idAdmin}){
    const router = useRouter()

    const [namaMenu, setNamaMenu] = useState("")
    const [deskripsi, setDeskripsi] = useState("");
    const [harga, setHarga] = useState(0)
    const [paket, setPaket] = useState([])
    const [addPaket, setAddPaket] = useState([])
    const [selectedPaket, setSelectedPaket] = useState(0);


    useEffect(() => {
        if (selectedMenu) {
            setNamaMenu(selectedMenu.namaMenu);
            setDeskripsi(selectedMenu.deskripsiMenu);
            setHarga(selectedMenu.harga);
            setPaket(selectedMenu.isiMenu);
        }
    }, [selectedMenu]); //ketika selectedMenu berubah, callback akan dieksekusi (mengupdate state menjadi menu yang sedang dipilih di parent)

    const handleSubmit = async () => {
        const data = {
            namaMenu: namaMenu,
            deskripsiMenu: deskripsi,
            harga: harga,
            idMenu: selectedMenu.idMenu,
            idAdmin: idAdmin
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
        setAddPaket(paket => [...paket, e.target.value])
        console.log(paket)
        setSelectedPaket(0)
    }

    return(
        <div>
            <h3>Updated menu data: </h3>
            <div className={styles.tambahmenuform}>
                <div className={styles.inputcontainer}>
                    <p>Name</p>
                    <input type='text' placeholder={selectedMenu.namaMenu} value={namaMenu} onChange={({target}) => setNamaMenu(target.value)} name="namaMenu" required></input>
                </div>

                <div className={styles.inputcontainer}>
                    <p>Description</p>
                    <input type='text' placeholder={selectedMenu.deskripsiMenu} value={deskripsi} onChange={({target}) => setDeskripsi(target.value)} name="deskripsi" required></input>
                </div>

                <div className={styles.inputcontainer}>
                    <p>Price</p>
                    <input type='number' placeholder={selectedMenu.harga} value={harga} onChange={({target}) => setHarga(target.value)} name="harga" required></input>
                </div>

                {paket.length > 0 &&
                    <div className={styles.inputpaketcontainer}>
                        <p>Packet</p>
                        <div className={styles.paketcontainer}>
                            {paket.map( p => 
                                <div className={styles.paketlist}>
                                    <p>{dataMenu[p - 1].namaMenu}</p> 
                                    <div>
                                        <button>x</button> 
                                    </div>
                                </div>
                            )}

                            {addPaket.map( p => 
                                <div className={styles.paketlist}>
                                    <p>{dataMenu[p - 1].namaMenu}</p> 
                                    <div>
                                        <button>x</button> 
                                    </div>
                                </div>
                            )}
                            
                            <div className={styles.paketlist}>
                                <p>Add more</p>
                                <select onChange={handleChange} value={selectedPaket}>
                                    <option value={0}> select menu </option>

                                    {dataMenu.map(d => 
                                        <option value={d.idMenu}>{d.namaMenu}</option>
                                    )}
                                </select>
                            </div>
                        </div>
                    </div>
                }

                <button className={'btn-primary'} onClick={handleSubmit}>Submit</button>
            </div>
        </div>
    )
}