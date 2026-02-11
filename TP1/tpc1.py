import json, os, shutil

def open_json(filename):
    with open(filename, encoding='utf-8') as f:
        data = json.load(f)
    return data

def mk_dir(relative_path):
    if not os.path.exists(relative_path):
        os.mkdir(relative_path)
    else:
        shutil.rmtree(relative_path)
        os.mkdir(relative_path)

def new_file(filename, content):
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)

# ----------------- Script Principal ----------------- #

data = open_json('dataset_reparacoes.json')

secoes = [
    {"chave": "reparacoes",    "nome": "Reparações"},
    {"chave": "intervencoes",  "nome": "Intervenções"},
    {"chave": "marcasemodelos", "nome": "Marcas e Modelos"},
]

lista_links = ""
for s in secoes:
    lista_links += f'''
    <li><a href="{s["chave"]}.html">{s["nome"]}</a></li>
    '''

html = f'''
<html>
    <head>
        <title>Consulta</title>
        <meta charset="utf-8"/>
    </head>
    
    <body>
        <h3>Dados de possível consulta</h3>
        <ul>
            {lista_links}
        </ul>    
    </body>
</html>
'''
mk_dir('output')
new_file('output/index.html', html)


# ----------------- Scripts Individuais ----------------- #

reparacoes = data['reparacoes']
reparacoes_ordenadas = sorted(reparacoes, key=lambda r: r['data'])

lista_links1 = ""
for r in reparacoes_ordenadas:
    data = r['data']
    nome = r['nome']
    nif = r['nif']
    marca = r['viatura']['marca']
    modelo = r['viatura']['modelo']
    matricula = r['viatura']['matricula']
    nr_intervencoes = r['nr_intervencoes']
    lista_links1 += f'''<li><a href="reparacao_{matricula}.html">{data} - {nome} - {marca} {modelo} ({matricula}) - {nr_intervencoes} intervenções</a></li>'''

html = f'''
<html>
    <head>
        <title>Reparações</title>
        <meta charset="utf-8"/>
    </head>
    <body>
        <h3>Reparações</h3>
        <a href="index.html">Voltar</a>

        <ul>
            {lista_links1}
        </ul>

    </body>
</html>
'''
new_file('output/reparacoes.html', html)

# Reparação Individual


for r in reparacoes:
    data = r['data']
    nome = r['nome']
    nif = r['nif']
    marca = r['viatura']['marca']
    modelo = r['viatura']['modelo']
    matricula = r['viatura']['matricula']
    nr_intervencoes = r['nr_intervencoes']

    lista_intervencoes = ""
    for i in r['intervencoes']:
        codigo = i['codigo']
        nome_i = i['nome']
        lista_intervencoes += f'''<li><a href="intervencao_{codigo}.html">{codigo} - {nome_i}</a></li>'''

    html = f'''
    <html>
        <head>
            <title>Reparação {matricula}</title>
            <meta charset="utf-8"/>
        </head>
        <body>
        <h3>Reparação {matricula}</h3>
        <a href="index.html">Voltar ao indice</a>
        
            <table border="1">
                <tr>
                    <th>Data</th>
                    <td>{data}</td>
                </tr>
                <tr>
                    <th>Nome</th>
                    <td>{nome}</td>
                </tr>
                <tr>
                    <th>NIF</th>
                    <td>{nif}</td>
                </tr>
                <tr>
                    <th>Marca</th>
                    <td>{marca}</td>
                </tr>
                <tr>
                    <th>Modelo</th>
                    <td>{modelo}</td>
                </tr>
                <tr>
                    <th>Número de Intervenções</th>
                    <td>{nr_intervencoes}</td>
                </tr>
            </table>
            <h4>Intervenções</h4>
            <ul>
                {lista_intervencoes}
            </ul>
        </body>
    </html>
    '''
    new_file(f'output/reparacao_{matricula}.html', html)


# Intervenções

intervencoes = []
for r in reparacoes:
    for i in r['intervencoes']:
        if i not in intervencoes:
            intervencoes.append(i)

intervencoes_ordenadas = sorted(intervencoes, key=lambda i: i['codigo'])
lista_links2 = ""
for i in intervencoes_ordenadas:
    codigo = i['codigo']
    nome = i['nome']
    lista_links2 += f'''<li><a href="intervencao_{codigo}.html">{codigo} - {nome}</a></li>'''
html = f'''
<html>
    <head>
        <title>Intervenções</title>
        <meta charset="utf-8"/>
    </head>
    <body>
        <h3>Intervenções:</h3>
        <a href="index.html">Voltar</a>
        <ul>
            {lista_links2}
        </ul>
    </body>
</html>
'''
new_file('output/intervencoes.html', html)

# Intervenção Individual

for i in intervencoes:
    codigo = i['codigo']
    nome = i['nome']
    descricao = i['descricao']
    lista_reparacoes = ""
    for r in reparacoes:
        for interv in r['intervencoes']:
            if interv['codigo'] == codigo:
                nome_r = r['nome']
                matricula = r['viatura']['matricula']
                marca = r['viatura']['marca']
                modelo = r['viatura']['modelo']
                lista_reparacoes += f'''<li><a href="reparacao_{matricula}.html">{r['data']} - {nome_r} - {marca} {modelo} ({matricula}) - {r['nr_intervencoes']} intervenções</a></li>'''
    html = f'''
     <html>
        <head>
            <title>Intervenção {codigo}</title>
            <meta charset="utf-8"/>
        </head>
        <body>
            <h3>Intervenção {codigo}</h3>
            <a href="index.html">Voltar ao indice</a>
            <table border="1">
                <tr>
                    <th>Código</th>
                    <td>{codigo}</td>
                </tr>
                <tr>
                    <th>Nome</th>
                    <td>{nome}</td>
                </tr>
                <tr>
                    <th>Descrição</th>
                    <td>{descricao}</td>
                </tr>
            </table>
            <h4>Reparações em que foi utilizada:</h4>
            <ul>
               {lista_reparacoes}
            </ul>
        </body>
    </html>
    '''
    new_file(f'output/intervencao_{codigo}.html', html)
    




# Marcas e Modelos

marcas = []
modelos = {}
contador = {}

for r in reparacoes:
    marca = r['viatura']['marca']
    modelo = r['viatura']['modelo']
    if marca not in marcas:
        marcas.append(marca)
        contador[marca] = 1
    else:
        contador[marca] += 1

    if marca not in modelos:
        modelos[marca] = []
    if modelo not in modelos[marca]:
        modelos[marca].append(modelo)
        contador[modelo] = 1
    else:
        contador[modelo] += 1
marcas_ordenadas = sorted(marcas)
modelos_ordenados = sorted(modelos)
lista_links3 = ""
for m in marcas_ordenadas:
    lista_links3 += f'''<li>{m} - {contador[m]} reparações</li>'''

lista_links4 = ""
for m in modelos_ordenados:
    for mo in modelos[m]:
        lista_links4 += f'''<li>{m} {mo} - {contador[mo]} reparações</li>'''

html = f'''
<html>
    <head>
        <title>Marcas e Modelos</title>
        <meta charset="utf-8"/>
    </head>
    <body>
        <h3>Marcas</h3>
        <a href="index.html">Voltar</a>
        
        <ul>
            {lista_links3}
        </ul>
        <h3>Modelos</h3>
        <ul>
            {lista_links4}
        </ul>
        
    </body>
</html>
'''
new_file('output/marcasemodelos.html', html)