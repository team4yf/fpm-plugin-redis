const _ = require('lodash');
const redis = require('redis');
const bluebird = require('bluebird');

module.exports = {
  bind: (fpm) => {
    let client, subscriber;
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
      subscriber = redis.createClient({
        host: c.host,
        port: c.port,
        password: c.auth.password,
      });
      bluebird.promisifyAll(redis.RedisClient.prototype);
      bluebird.promisifyAll(redis.Multi.prototype);
      subscriber.on('message', (channel, message) => {
        fpm.publish('#redis/message', { channel, message });
      })
    })

    fpm.registerAction('BEFORE_SERVER_START', () => {
      fpm.REDIS = client;
      fpm.extendModule('redis', {
        run: async args => {
          const { command, param } = args;
          const commander = client[command];

          if(_.isFunction(commander)){
            if( command == 'subscribe'){
              await commander.apply(subscriber, param);
            }else{
              await commander.apply(client, param);
            }
            return 1;
          }else{
            return Promise.reject({ errno: -5, message: 'command not defined~'})
          }
        }
      });
    })
    return client;
  }
}
