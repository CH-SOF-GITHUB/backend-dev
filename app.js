const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')

// appel les méthodes de route
const categorieRouter = require('./routes/categorie.route');
const scategorieRouter = require('./routes/scategorie.route');
const articleRouter = require('./routes/article.route');

// Authentification Token
const userRouter = require('./routes/user.route.js');

// stripe
const paymentRouter =require("./routes/payment.route.js"); 

const app = express()

// c'est un middleaware
app.use(express.json())

// config dotenv
dotenv.config()

// Les cors
app.use(cors({
  origin: "*"
}))
/*
app.use(cors({
  origin:"http://localhost/3000"
}))
*/
// BodyParser Middleware
app.use(express.json())

// Connexion à la base de données
// .then promise si connection success passe au suivant.
// .catch si on a un erreur

mongoose
  .connect(process.env.DATABASECLOUD)
  .then(() => {
    console.log('Connexion à la base de données réussie')
  })
  .catch(err => {
    console.log('Impossible de se connecter à la base de données')
    process.exit()
  })

  /*
mongoose
  .connect(process.env.DATABASE)
  .then(() => {
    console.log('Database Successfully Connected')
  })
  .catch(err => {
    console.log('Unable to connect to database', err)
    process.exist()
  })
*/

// les apis
app.use("/api/categories", categorieRouter);
app.use("/api/scategories", scategorieRouter);
app.use("/api/articles", articleRouter);

// authentification
app.use("/api/users", userRouter);

//stripe
app.use('/api/payment', paymentRouter); 

app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port ${process.env.PORT}`)
})

// requete
app.get('/', (req, res) => {
  res.send("page d'accueil")
})

app.get('/contact', (req, res) => {
  res.send('page contact')
})

// Il faut ajouter dans le serveur app.js à la fin du code. 
module.exports = app