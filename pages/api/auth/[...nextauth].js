import NextAuth from "next-auth";
import CredentialsProviders from "next-auth/providers/credentials"

export const authOptions = {
    providers: [
        CredentialsProviders({
            name: "username and password",
            credentials: {
                username: {label: "Username", type: "text"},
                password: {label: "Password", type: "password"}
            },
            authorize: async (credentials) => {
                const res = await fetch('http://localhost:3000/api/signin ',{ // http://localhost:3000/api/signin 
                    method: "POST",
                    body: JSON.stringify(credentials)
                })
                const hasil = await res.json();
                
                if(res.ok && hasil){
                    return { //hasil return disimpan di properti user di jwt
                        idAdmin: hasil[0].idAdmin,
                        name: hasil[0].username,
                        role: hasil[0].role,
                    };
                }

                return null  
            }
        })
    ],
    callbacks: {
        jwt: async({token, user}) => {
            if(user){
                token.idAdmin = user.idAdmin
                token.role = user.role
            }

            return token
        },
        session: ({token, session}) => {
            // kirim ke client
            if(token){
                session.idAdmin = token.idAdmin
                session.role = token.role
            }

            return session
        }
    },
    session: {
        strategy: 'jwt',
        maxAge: 60 * 60 * 12
    },
    jwt: {
        maxAge: 60 * 60 * 12,
        encryption: true
    },
    pages: {
        signIn: '/auth/signin',
    }
}

export default NextAuth(authOptions)