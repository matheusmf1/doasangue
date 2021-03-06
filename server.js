const mysql = require('mysql');

const express = require("express")
const server = express()
const nunjucks = require("nunjucks")

server.use(express.static('public'))
server.use(express.urlencoded({extended: true}))

nunjucks.configure("./", {
    express: server,
    noCache: true
})

const connection = mysql.createConnection({
  host     : 'myrdsdemo.czs5dtq7qb7g.us-east-1.rds.amazonaws.com',
  user     : 'admin',
  password : 'admin1234',
  port     : 3306,
  database: 'doasangue'
});

connection.connect(function(err) {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }

  console.log('Connected to database.');
});

server.get( "/", (req, res) => {

    connection.query( "SELECT * FROM donors", (err, result) => {
        if (err) return res.send("Erro de banco de dados parte 1: " + err );

        const donors = []

        result.forEach( e => donors.push( e ) );

        return res.render("index.html", { donors })
    })
    
})

server.post("/", (req, res) => {
    // pegar dados do formulário // 
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    console.log(  )

    if ( name == "" || email == "" || blood == ""){
	// logger.warn('Todos os campos sao obrigatorios');    
    // res.send("Todos os campos são obrigatórios.")
        return res.redirect("/")
    }

    connection.query( `INSERT INTO donors ( name, email, blood ) VALUES ("${name}", "${email}", "${blood}");`, (err, result ) => {

        if (err) return res.send( `Erro no Banco de dados: ${err}`)

        return res.redirect("/")

    })

})
server.listen(80,'0.0.0.0', function() {
    console.log("Iniciei o servidor")
})
