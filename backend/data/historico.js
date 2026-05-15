const { readData, writeData } = require('./fileDb');

module.exports = {
  get: () => readData('historico.json'),
  set: (data) => writeData('historico.json', data)
};