import express, { json } from 'express'
import cors from 'cors'
const app = express()
app.use(cors())
app.use(express.text())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.get('/track', (req, res) => {
	console.log(req)
	res.send('ok')
})
app.post('/track', (req, res) => {
	const data = JSON.parse(req.body)
	console.log(data)
	res.send('ok')
})
app.listen(9000, () => {
	console.log('http://localhost:9000')
})
