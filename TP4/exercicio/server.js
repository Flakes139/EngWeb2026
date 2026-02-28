// treinos_server.js
// EW2025 : 2025-02-24
// by jcr

var http = require('http')
var axios = require('axios')
const { parse } = require('querystring');

var templates = require('./template.js')           // Necessario criar e colocar na mesma pasta
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
    var d = new Date().toISOString().substring(0, 16)
    console.log(req.method + " " + req.url + " " + d)

    // Handling request
    if(static.staticResource(req)){
        static.serveStaticResource(req, res)
    }
    else{
        switch(req.method){
            case "GET": 
                // GET /emd ------------------------------------------------------------------
                if(req.url == '/' || req.url == '/emd' || req.url.startsWith('/emd?')){
                    var sort = 'dataEMD'
                    if(req.url.includes('sort=nome')) sort = 'nome.primeiro'
                    axios.get("http://localhost:3000/emd?_sort=" + sort)
                    .then(resp => {
                        var emd = resp.data 
                        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                        res.end(templates.emdListPage(emd, d, sort))
                    })
                }

                 // GET /emd/register ---------------------------------------------------------
                else if(req.url == '/emd/register'){
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                    res.end(templates.emdFormPage(d))
                }

                // GET /emd/edit/:id ---------------------------------------------------------
                else if(/\/emd\/edit\/[0-9a-zA-Z_]+$/.test(req.url)){
                    var idEmd = req.url.split('/')[3]
                    axios.get("http://localhost:3000/emd?id=" + idEmd)
                    .then(resp => {
                        var emd = resp.data[0] 
                        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                        res.end(templates.emdFormEditPage(emd, d))
                    })
                    .catch(erro => {
                        res.writeHead(505, {'Content-Type': 'text/html; charset=utf-8'})
                        res.write('<p>Não foi possível ver o registo...</p>')
                        res.write('<p>' + erro + '</p>')
                        res.end('<address><a href="/">Voltar</a></address>')

                    })

                }

                // GET /emd/delete/:id -------------------------------------------------------
                else if(/\/emd\/delete\/[0-9a-zA-Z_]+$/.test(req.url)){
                    var idEmd = req.url.split('/')[3]
                    console.log("DELETE id:", idEmd) 
                    axios.delete('http://localhost:3000/emd/' + idEmd)
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
                // GET /emd/stats  ← adiciona AQUI, antes do /:id
                else if(req.url == '/emd/stats'){
                    axios.get("http://localhost:3000/emd")
                    .then(resp => {
                        var emd = resp.data
                        try {
                            var html = templates.emdStatsPage(emd, d)  // ← render ANTES do writeHead
                            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                            res.end(html)
                        } catch(erro) {
                            console.log("Erro no template stats:", erro)
                            res.writeHead(500, {'Content-Type': 'text/html; charset=utf-8'})
                            res.end('<p>Erro no template: ' + erro + '</p>')
                        }
                    })
                    .catch(erro => {
                        res.writeHead(505, {'Content-Type': 'text/html; charset=utf-8'})
                        res.end('<p>Erro: ' + erro + '</p>')
                    })
                }

                // GET /emd/:id --------------------------------------------------------------
                else if(/\/emd\/[0-9a-zA-Z_]+$/.test(req.url)){
                    var idEmd = req.url.split('/')[2]
                    axios.get("http://localhost:3000/emd?id=" + idEmd)
                    .then(resp => {
                        var emd = resp.data[0] 
                        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                        res.end(templates.emdIDPage(emd, d))
                    })
                    .catch(erro => {
                        res.writeHead(505, {'Content-Type': 'text/html; charset=utf-8'})
                        res.write('<p>Não foi possível ver o registo...</p>')
                        res.write('<p>' + erro + '</p>')
                        res.end('<address><a href="/">Voltar</a></address>')

                    })

                }

               
                

                break
            case "POST":
                // POST /emd --------------------------------------------------------------------
                if(req.url == '/emd'){
                    collectRequestBodyData(req, result => {
                        if(result){
                            var novoRegisto = {
                                dataEMD: result.dataEMD,
                                nome: { 
                                    primeiro: result['nome[primeiro]'], 
                                    último: result['nome[ultimo]'] 
                                },
                                idade: parseInt(result.idade),
                                género: result.género,
                                morada: result.morada,
                                modalidade: result.modalidade,
                                clube: result.clube,
                                email: result.email,
                                federado: result.federado === 'on',
                                resultado: result.resultado === 'on'
                            }
                            axios.post('http://localhost:3000/emd', novoRegisto)
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
                // POST /emd/:id - Alterar um registo
                else if(/\/emd\/[0-9a-zA-Z_]+$/.test(req.url)){
                    var idEmd = req.url.split('/')[2]
                    console.log("UPDATE id:", idEmd) 
                    collectRequestBodyData(req, result => {
                        if(result){
                            var novoRegisto = {
                                dataEMD: result.dataEMD,
                                nome: { 
                                    primeiro: result['nome[primeiro]'], 
                                    último: result['nome[ultimo]'] 
                                },
                                idade: parseInt(result.idade),
                                género: result.género,
                                morada: result.morada,
                                modalidade: result.modalidade,
                                clube: result.clube,
                                email: result.email,
                                federado: result.federado === 'on',
                                resultado: result.resultado === 'on'
                            }
                            axios.put('http://localhost:3000/emd/' + idEmd, novoRegisto)
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
                break
            default: 
                // Outros metodos nao sao suportados
        }
    }
})

treinosServer.listen(7777, ()=>{
    console.log("Servidor à escuta na porta 7777...")
})



