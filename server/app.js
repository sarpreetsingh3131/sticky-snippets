import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import { config } from 'dotenv'

import { Controller } from './controller/controller'
import { BASE_URL } from './api/api'
import { DB } from './db/db'


config()

new DB().connect()
  .then(() => {
    let app = express()
    let port = process.env.PORT || 3000

    app.use(bodyParser.json())
    app.use(cookieParser())
    app.use(session({
      name: 'sticky-snippets',
      secret: 'sb223ce',
      saveUninitialized: false,
      resave: false,
      cookie: {
        domain: 'localhost',
        httpOnly: false,
        secure: false,
        maxAge: 2000 * 60 * 60 * 24
      }
    }))


    app.use(express.static(path.join(__dirname, '..', 'public')))

    // for cross-origin
    app.use((req, res, next) => {
      res.type('json')
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4000')
      res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS,PUT,DELETE')
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Cookie')
      res.setHeader('Access-Control-Allow-Credentials', 'true')
      next()
    })

    app.use(BASE_URL, new Controller())

    app.use((req, res, next) => res.status(404).send({ error: 'not found' + req.baseUrl }))

    app.use((err, req, res, next) => {
      console.log('ERROR', err.stack)
      res.status(500).send({ error: 'internal server error' })
    })

    app.listen(port, () => console.log('server runnning on http://localhost:' + port))
  })
  .catch(err => console.log(err.message))