import Layout from '../../component/layout'
import { useRouter } from 'next/router'
import { useState } from 'react'
import styles from '../../styles/TambahKaryawan.module.css'
import { useSession } from 'next-auth/react'

export default function TambahKaryawan(){
  const router = useRouter()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('')

  const { data: session, status } = useSession()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = {
        username: username,
        password: password,
        role: role
    }

    const JSONdata = JSON.stringify(data)

    const endpoint = '../api/tambahkaryawan'

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
    router.push('../admin')
  }

  if (status === "authenticated") {
    return(
      <div className={styles.container}>
        <h1>Tambah Karyawan</h1>

          <form className={styles.form} onSubmit={handleSubmit}>
              <label>
                  Username
                  <input type='text' value={username} onChange={({target}) => setUsername(target.value)} name="username"></input>
              </label>

              <label>
                  Password
                  <input type='text' value={password} onChange={({target}) => setPassword(target.value)} name="password"></input>
              </label>

              <label>Role:</label>

              <label>
                  <input type='radio' value={"karyawan"} onChange={({target}) => setRole(target.value)} name="role"></input> Karyawan
                  <input type='radio' value={"manager"} onChange={({target}) => setRole(target.value)} name="role"></input> Manager
              </label>

              <input type='submit' className={styles.submitbtn}></input>
          </form>

          <button onClick={() => router.push('/admin')}>Back</button>
      </div>
    )
  }
}

TambahKaryawan.getLayout = function getLayout(page) {
    return (
      <Layout>
        {page}
      </Layout>
    )
}