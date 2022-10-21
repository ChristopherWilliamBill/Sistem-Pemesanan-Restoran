export default function FormEditMenu({dataMenu}){
    return(
        <div>
            <h3>Menu yang dipilih: </h3>
            <p>{dataMenu.namaMenu}</p>
            <p>{dataMenu.deskripsiMenu}</p>
            <p>{dataMenu.harga}</p>
        </div>
    )
}