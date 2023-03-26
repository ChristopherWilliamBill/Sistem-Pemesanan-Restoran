export default async function handler(req, res) {

    if(req.method !== "POST"){
        res.status(405).send({ message: 'Method not allowed'})
        return
    }
    
    const request = JSON.parse(JSON.stringify(req.body))

    if (request.secret !== process.env.REVALIDATE_TOKEN) {
        return res.status(401).json({ message: 'Invalid token' })
    }
  
    try {
        const path = request.path
        for(let i = 0; i < path.length; i++){
            await res.revalidate(path[i])
        }
        return res.json({ revalidated: true })
    } catch (err) {
        return res.status(500).send('Error revalidating')
    }
}