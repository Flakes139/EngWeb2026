const pug = require('pug');

// Helper para compilar e renderizar
function renderPug(fileName, data) {
    return pug.renderFile(`./views/${fileName}.pug`, data);
}

exports.treinosListPage = (tlist, d) => renderPug('index', { list: tlist, date: d });
exports.treinoFormPage = (d) => renderPug('form', { date: d });
exports.treinoFormEditPage = (t, d) => renderPug('form', { treino: t, date: d });
exports.errorPage = (msg, d) => renderPug('error', { message: msg, date: d });
