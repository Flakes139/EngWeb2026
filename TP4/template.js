const pug = require('pug');

// Helper para compilar e renderizar
function renderPug(fileName, data) {
    return pug.renderFile(`./views/${fileName}.pug`, data);
}

exports.emdListPage = (elist, d, sort) => renderPug('index', { list: elist, date: d , sort: sort});
exports.emdIDPage = (emd, d) => renderPug('emd', { emd: emd, date: d });
exports.emdFormPage = (d) => renderPug('form', { date: d });
exports.emdFormEditPage = (emd, d) => renderPug('form', { emd: emd, date: d });
exports.errorPage = (msg, d) => renderPug('error', { message: msg, date: d });
