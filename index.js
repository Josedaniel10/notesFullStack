const config = require('./utils/config.js');
const app = require('./app.js');
const logger = require('./utils/logger.js');

app.listen(config.PORT, () => {
  logger.info(`Ejecutando servidor desde http://localhost:${config.PORT}`);
})