var winston = require('winston');

const mysql = require('mysql');

// var logger = new (winston.createLogger)({
//   transports: [
//     new winston.transports.Console(),
//     new winston.transports.File({ filename: './all-logs.log' }),
//   ],
//   exceptionHandlers: [
//     new winston.transports.File({ filename: './exceptions.log' })
//   ]
// });

const express = require("express")
const server = express()
const nunjucks = require("nunjucks")
const Pool = require('pg').Pool

const db = new Pool({
    user: 'admin',
    password: 'admin1234',
    host: 'myrdsdemo.czs5dtq7qb7g.us-east-1.rds.amazonaws.com',
    port: 3306,
    database: 'doasangue'
})

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

server.get( "/", function(req, res) {

    connection.query( "SELECT * FROM donors", (err, result) => {
        if (err) return res.send("Erro de banco de dados parte 1: " + err );

        console.log( 'result' )
        console.log( result )

        result.forEach( e => {
            console.log('test')
            console.log( e )
            console.log( e['name'] )
            console.log( e['email'] )
            console.log( e['blood'] )
        });

        const donors = result
        return res.render("index.html", { donors })
    })

    donors = []



    db.query("SELECT * FROM donors", function(err, result){
        if (err) return res.send("Erro de banco de dados parte 1");

        // logger.warn('Banco de dados error'); 
        const donors = result.rows;
        return res.render("index.html", { donors })
    })

    donors = []

    res.render("index.html", { })
    
})

server.post("/", function(req, res){
    // pegar dados do formulário // 
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if (name == "" || email == "" || blood == ""){
	// logger.warn('Todos os campos sao obrigatorios');    
        res.send("Todos os campos são obrigatórios.")
    }

    const query = `INSERT INTO "donors" ("name","email", "blood") 
                    VALUES ($1, $2, $3)`

    const values = [name, email, blood]
    db.query(query, values, function(err, ){

        if (err) return res.send("Erro no Banco de dados")

        return res.redirect("/")

    })

})
server.listen(80,'0.0.0.0', function() {
    console.log("Iniciei o servidor")
})
