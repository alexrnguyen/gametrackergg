// Referenced: https://www.youtube.com/watch?v=5CFafWpWwxo&t=694s

import express from 'express'
const app = express()
import fetch from 'node-fetch'
import cors from 'cors'


app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 5000
const url = "https://api.igdb.com/v4/games/"
let searchInput = ''
//const queryStr = `fields name, genres; search ${searchInput};`; // For testing purposes
var config = new Headers()

config.append("Client-ID", "a6jf2zoshruhutnu1tktwuoo0diy5y")
config.append("Authorization", "Bearer ufcuy1uskr940pbespq31qhrnlyk6j")
config.append("Content-Type", "application/json")
app.get("/", async (req, res) => {
    const response = await fetch(url, {
        method: "POST",
        headers: config,
        body: `fields name; search "${searchInput}";`
      })
    res.json(await response.json())
})

app.post('/', (req, res) => {
    searchInput = req.body.parcel
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})