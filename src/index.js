const _ = require('lodash');
const redis = require('redis');

module.exports = {
  bind: (fpm) => {
    let client;
    // Run When Server Init
    fpm.registerAction('INIT', () => {
      const c = fpm.getConfig('redis', {
        host: 'localhost',
        port: 6379,
        auth: {
          password: 'admin123'
        }
      });

      client = redis.createClient({
        host: c.host,
        port: c.port,
        password: c.auth.password,

      });
    })

    fpm.registerAction('BEFORE_SERVER_START', () => {
      fpm.REDIS = client;
    })
    return client;
  }
}
