//importo la libreria express (che è un MICROFRAMEWORK)
const express = require('express')
//importo la libreria http
const http = require('http')

const bodyParser = require("body-parser")

const {body, validationResult} = require("express-validator")


//inizializzo la libreria express
const app = express() //la libreria express esporta un'unica classe app, per definirlo creo un'istanza di express
//definisco la porta alla quale voglio associare il servizio

const PORT = 8080

const database = {
  movimenti: [
  {
    nome: 1000,
    quantity: 3,
    data: "2024-01-03"
  },
  {
    nome: 1001,
    quantity: 2,
    data: "2024-02-20"
  },
  {
    nome: 1002,
    quantity: 2,
    data: "2025-02-20"
  }
]
}

// database.movimenti[1].data

//inizializzo un server e lo istruisco ad utilizzare express per la gestione delle richieste
const server = http.createServer(app)

app.use(express.static(__dirname + "/public"))
app.set("view engine", "ejs")

// "plugin per aggiungere il corpo di un form nelle richieste POST"
app.use(bodyParser.urlencoded({extended: true}))


//funzione che risponde a richieste fatte all'indirizzo "/"
//percorso "/"
app.get("/", (richiesta, risposta) => {
  console.log(richiesta)
  risposta.render(__dirname + "/public/index.ejs", {titolo: "Home"})
})

//funzione che risponde a richieste fatte all'indirizzo "/bio"
//percorso "bio"
app.get("/bio", (richiesta, risposta) => {
  console.log(richiesta)
  risposta.render(__dirname + "/public/bio.ejs", {titolo: "Bio"})
})

app.get("/tabella", 
  (richiesta, risposta) => {
    risposta.render(__dirname + "/public/tabella.ejs", {titolo: "Contattami", movimenti: database.movimenti})
  })

const form_validators = [
  body("Nome").notEmpty().withMessage("Campo Nome vuoto")
  .trim() //viene prima processato l'html
  .escape(), //stesso discorso server side
  body("Email").notEmpty().withMessage("Campo Email vuoto"),
  body("Quantity")
  .isInt({min: 1}),
  body("Data")
  .isISO8601()
  .isDate()

]
// form validators è una funzione di middleware
app.post("/tabella", form_validators, (richiesta, risposta) => {
  //leggerò il contenuto della richiesta
  const errori = validationResult(richiesta)
  if (errori.errors.length != 0) {
    return risposta.send("Errore")
  }

  const elData = new Date().toJSON().slice(0,10).replace(/-/g,'/')
  const nuovoElemento = {
    nome: richiesta.body.Nome,
    email: richiesta.body.Email,
    quantity: richiesta.body.Quantity,
    data: elData
  }
  database.movimenti.push(nuovoElemento)
  console.log(richiesta.body)
  risposta.redirect("/tabella") // metodo GET
})

//questo l'ho scritto da terminale incredible

server.listen(PORT, () => {
  console.log(`Il server sta ascoltando alla porta ${PORT}`)
})

//si può far partire il server con nodemon per rilanciare automaticamente il server usando "npm run dev" (dev l'ho definito in package.json)



