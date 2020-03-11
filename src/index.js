const _ = require('lodash');
const redis = require('redis');
const { promisify } = require("util");

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
      _.forEach(redis.RedisClient.prototype, (func, key) => {
        if(!_.isFunction(func)) return;
        redis.RedisClient.prototype[key + 'Async'] = promisify(func);
      })
      _.forEach(redis.Multi.prototype, (func, key) => {
        if(!_.isFunction(func)) return;
        redis.Multi.prototype[key + 'Async'] = promisify(func);
      })
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
