import Image from "next/image"
import nomenu from '../public/nomenu.png'
import { useState } from "react";

export default function CobaGambar() {
    const [imageSrc, setImageSrc] = useState();

    const handleImage = (v) => {
        console.log(v)
        setImageSrc(v)
        // const reader = new FileReader();

        // reader.onload = function(onLoadEvent) {
        //   setImageSrc(onLoadEvent.target.result);
        // }
    
        // reader.readAsDataURL(changeEvent.target.files[0]);
    }

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('file', imageSrc);
        formData.append('upload_preset', 'preset')
        
        const endpoint = 'https://api.cloudinary.com/v1_1/dpggxjyay/image/upload'
 
        const options = {
            method: 'POST',
            body: formData
        }
    
        const response = await fetch(endpoint, options)
        const result = await response.json()    
        console.log(result.secure_url)
    }

    const handleError = () => {
        setImageSrc("/nomenu.png");
    };

    return(
        <>
            <h1>halo</h1>
            <input type="file" name="gambarmenu" onChange={({target}) => handleImage(target.files[0])}></input>
            <Image 
                //src="/v1678782861/chickenriedrice_qm9nwp.jpg"
                src={nomenu}
                width={500}
                height={500}
                //onError={handleError}
            />


            {/* {imageSrc && <img src={URL.createObjectURL(imageSrc)}></img>} */}

            <button onClick={handleUpload}>upload</button>
        </>
    )
}