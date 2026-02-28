// treinos_server.js
// EW2025 : 2025-02-24
// by jcr

var http = require('http')
var axios = require('axios')
const { parse } = require('querystring');

var templates = require('./templates.js')           // Necessario criar e colocar na mesma pasta
var static = require('./static.js')                 // Colocar na mesma pasta

// Aux functions
function collectRequestBodyData(request, callback) {
    if(request.headers['content-type'] === 'application/x-www-form-urlencoded') {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            callback(parse(body));
        });
    }
    else {
        callback(null);
    }
}

// Server creation

var treinosServer = http.createServer((req, res) => {
    // Logger: what was requested and when it was requested
    var d = new Date().toISOString().substring(0, 16)
    console.log(req.method + " " + req.url + " " + d)

    // Handling request
    if(static.staticResource(req)){
        static.serveStaticResource(req, res)
    }
    else{
        switch(req.method){
            case "GET": 
                // GET /treinos ------------------------------------------------------------------
                if(req.url == '/' || req.url == '/treinos'){
                    axios.get("http://localhost:3000/treinos?_sort=data")
                    .then(resp => {
                        var treinos = resp.data 
                        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                        res.end(templates.treinosListPage(treinos, d))
                    })
                }
                // GET /treinos/:id --------------------------------------------------------------
                
                // GET /treinos/register ---------------------------------------------------------
                else if(req.url == '/treinos/register'){
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                    res.end(templates.treinoFormPage(d))
                }
                // GET /treinos/edit/:id ---------------------------------------------------------
                else if(/\/treinos\/edit\/[0-9a-zA-Z_]+$/.test(req.url)){
                    var idTreino = req.url.split('/')[3]
                    axios.get('http://localhost:3000/treinos/' + idTreino)
                    .then(resp => {
                        var treino = resp.data
                        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                        res.end(templates.treinoFormEditPage(treino, d))
                    })
                    .catch(erro => {
                        res.writeHead(505, {'Content-Type': 'text/html; charset=utf-8'})
                        res.write('<p>Não foi possível obter o registo...</p>')
                        res.write('<p>' + erro + '</p>')
                        res.end('<address><a href="/">Voltar</a></address>')
                    })
                }
                // GET /treinos/delete/:id -------------------------------------------------------
                else if(/\/treinos\/delete\/[0-9a-zA-Z_]+$/.test(req.url)){
                    var idTreino = req.url.split('/')[3]
                    axios.delete('http://localhost:3000/treinos/' + idTreino)
                    .then(resp => {
                        res.writeHead(302, {'Location': '/'}) // Redireciona para a lista
                        res.end()
                    })
                    .catch(erro => {
                        res.writeHead(505, {'Content-Type': 'text/html; charset=utf-8'})
                        res.write('<p>Não foi possível apagar o registo...</p>')
                        res.write('<p>' + erro + '</p>')
                        res.end('<address><a href="/">Voltar</a></address>')
                    })
                }
                // GET /treinos/:personID --------------------------------------------------------
                
                // GET ? -> Lancar um erro
                break
            case "POST":
                // POST /treinos --------------------------------------------------------------------
                if(req.url == '/treinos'){
                    collectRequestBodyData(req, result => {
                        if(result){
                            axios.post('http://localhost:3000/treinos', result)
                            .then(resp => {
                                res.writeHead(201, {'Content-Type': 'text/html; charset=utf-8'})
                                res.write('<p>Registo inserido com sucesso: ' + JSON.stringify(resp.data) + '</p>')
                                res.end('<address><a href="/">Voltar</a></address>')
                            })
                            .catch(erro => {
                                res.writeHead(503, {'Content-Type': 'text/html; charset=utf-8'})
                                res.write('<p>Não foi possível insrir o registo...</p>')
                                res.write('<p>' + erro + '</p>')
                                res.end('<address><a href="/">Voltar</a></address>')
                            })
                        }
                        else{
                            res.writeHead(502, {'Content-Type': 'text/html; charset=utf-8'})
                            res.write('<p>Não foi possível obter os dados do body...</p>')
                            res.end('<address><a href="/">Voltar</a></address>')
                        }
                    })
                }
                // POST /treinos/:id - Alterar um registo
                else if(/\/treinos\/[0-9a-zA-Z_]+$/.test(req.url)){
                    collectRequestBodyData(req, result => {
                        if(result){
                            axios.put('http://localhost:3000/treinos/' + result.id, result)
                            .then(resp => {
                                res.writeHead(201, {'Content-Type': 'text/html; charset=utf-8'})
                                res.write('<p>Registo alterado com sucesso: ' + JSON.stringify(resp.data) + '</p>')
                                res.end('<address><a href="/">Voltar</a></address>')
                            })
                            .catch(erro => {
                                res.writeHead(503, {'Content-Type': 'text/html; charset=utf-8'})
                                res.write('<p>Não foi possível alterar o registo...</p>')
                                res.write('<p>' + erro + '</p>')
                                res.end('<address><a href="/">Voltar</a></address>')
                            })
                        }
                        else{
                            res.writeHead(502, {'Content-Type': 'text/html; charset=utf-8'})
                            res.write('<p>Não foi possível obter os dados do body...</p>')
                            res.end('<address><a href="/">Voltar</a></address>')
                        }
                    })
                }
                // POST ? -> Lancar um erro
                
            default: 
                // Outros metodos nao sao suportados
        }
    }
})

treinosServer.listen(7777, ()=>{
    console.log("Servidor à escuta na porta 7777...")
})



