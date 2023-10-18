import express, { request } from 'express';
import path from 'path'
import { Pool } from 'pg'
import { generateHTML } from './generator';
import * as crypto from 'crypto'

const app = express()
const PORT = 3000;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Students',
  password: 'postgres',
  port: 5432
})

app.use(express.urlencoded({ extended: true }));

app.get('/', (request: express.Request, response: express.Response) => {
  response.sendFile(path.join(__dirname, 'public/homepage.html'))
});

app.post('/form', (request: express.Request, response: express.Response) => {
  response.sendFile(path.join(__dirname, 'public/sendToDB.html'))
})

app.post('/submit', async (request: express.Request, response: express.Response) => {
  try {
    const { name, species, age } = request.body
    const token = crypto.randomBytes(16).toString('base64url')
    const date = new Date(Date.now())
    const insertQuery = `
      INSERT INTO test (name, species, age, created_at, token)
      VALUES ($1, $2, $3, $4, $5)
    `
    const selectQuery = `SELECT * FROM test WHERE token = '${token}'`
    const values = [name, species, age, date, token]
    // console.log([name, species, age, token]) 
    const client = await pool.connect()
    await client.query(insertQuery, values)
    const result = await client.query(selectQuery)
    const data = result.rows
    const html = await generateHTML(data)
    client.release()
    console.log('success')
    response.send(html)
  } catch (error) {
    console.error('error: ', error)
    response.status(500).send('Internal server error')
  }
})

app.get('/show-patients', async (request: express.Request, response: express.Response) => {
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT * FROM test')
    const data = result.rows
    const html = await generateHTML(data)
    response.send(html)
  } catch (error) {
    console.error('error: ', error)
    response.status(500).send('Internal server error')
  }
})

app.post('/update-patient', (request: express.Request, response: express.Response) => {
  try {
    response.sendFile(path.join(__dirname, 'public/editPatient.html'))
  }catch (error) {
    console.error('error: ', error)
    response.status(500).send('Internal server error')
  }
})

app.get('/update-patient-status', async (request: express.Request, response: express.Response) => {
  try {
    const { token, status } = request.body
    const client = await pool.connect()
    await client.query('UPDATE test SET status = $1 WHERE token = $2', [status, token])
    response.redirect(`/show-patients`)

  } catch (error) {
    console.error('error: ', error)
    response.status(500).send('Internal server error')
  }
})

app.listen(PORT, () => {
  console.log(`its alive on http://localhost:${PORT}`)
})

//note for tomorrow: add feature where at status update, it also edits the updated_at column.