import express from "express"

const app = express()

app.get("/", (req, res) => {
    res.json({
        message: "Hello world"
    })
})

app.listen(5000, () => {
    console.log(`Sever running at http:localhost:5000`)
})