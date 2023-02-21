import { signOut } from 'next-auth/react';
import Router, { useRouter } from 'next/router';

export default function LogOutPage() {

    const router = useRouter()
    
    return (
        <>
            <button onClick={signOut}>Sign Out</button>
            <button onClick={() => router.push('/')} >Home</button>
        </>
    )
}
