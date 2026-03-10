# TPC2

## 11 de Fevereiro 2026

### Por:

    - Vasco Gonçalves
    - a104527

<img src="../vascogoncalves.jpg" width="30%" alt="Foto de Perfil"/>

### Resumo

Criar um json-server com o dataset das reparações e um servidor aplicacional na porta 7777 com os seguintes serviços, que consomem os dados da REST API em `localhost:3000`:

- `/reparacoes` ou `/` — Tabela HTML com: Nome, NIF, Data, Viatura (marca + modelo), Matrícula e Nº Intervenções

- `/intervencoes` — Tabela HTML com os diferentes tipos de intervenções sem repetições (comparadas por `codigo`), ordenadas por código, com: Código, Nome, Descrição e Nº de vezes realizada

- `/viaturas` — Duas tabelas HTML:
  - Marcas ordenadas alfabeticamente: Marca e Nº de reparações
  - Modelos ordenados alfabeticamente: Modelo, Marca e Nº de reparações
