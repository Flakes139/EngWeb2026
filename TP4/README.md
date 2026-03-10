# TPC4

## 25 de Fevereiro 2026

### Por:

    - Vasco Gonçalves
    - a104527

<img src="../vascogoncalves.jpg" width="30%" alt="Foto de Perfil"/>

### Resumo

Criar uma aplicação web para gestão de um dataset de Exames Médicos Desportivos.

A página inicial apresenta a listagem de todos os registos EMD com opções de ordenação por data ou por nome.

As funcionalidades incluem visualização detalhada de cada registo, inserção de novos registos, edição de registos existentes e eliminação de registos.

Existe também uma página de estatísticas com a distribuição dos registos por sexo, modalidade, clube, resultado e federado.

---

### Rotas Implementadas

| Método | Rota              | Descrição              |
| ------ | ----------------- | ---------------------- |
| GET    | `/emd`            | Listagem geral         |
| GET    | `/emd/:id`        | Detalhe de um registo  |
| GET    | `/emd/register`   | Formulário de inserção |
| GET    | `/emd/edit/:id`   | Formulário de edição   |
| GET    | `/emd/delete/:id` | Eliminar registo       |
| GET    | `/emd/stats`      | Página de estatísticas |
| POST   | `/emd`            | Inserir registo        |
| POST   | `/emd/:id`        | Editar registo         |
