const { readData, writeData } = require('./fileDb');

module.exports = {
  get: () => readData('medicamentos.json'),
  set: (data) => writeData('medicamentos.json', data)
};