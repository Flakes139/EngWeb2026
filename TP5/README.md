# TP5

## 04 de Março 2026

### Por:

    - Vasco Gonçalves
    - a104527

### Resumo

Criar uma aplicação web para consulta de um dataset de Cinema com Express.

A página inicial apresenta a listagem de todos os filmes com o título, ano, número de géneros e número de atores associados.

As funcionalidades incluem visualização detalhada de cada filme, listagem de atores com o número de filmes em que participam, visualização do perfil de cada ator e listagem de géneros com os filmes associados.

---

### Rotas Implementadas

| Método | Rota           | Descrição                          |
| ------ | -------------- | ---------------------------------- |
| GET    | `/`            | Listagem de todos os filmes        |
| GET    | `/filmes/:id`  | Detalhe de um filme                |
| GET    | `/atores`      | Listagem de atores e nº de filmes  |
| GET    | `/atores/:id`  | Perfil de um ator                  |
| GET    | `/generos`     | Listagem de géneros e nº de filmes |
| GET    | `/generos/:id` | Detalhe de um género               |

---
