## FPM-PLUGIN-REDIS
用于 redis 的插件

### Install
```bash
npm i fpm-plugin-redis --save
```

### Useage

- config
  ```javascript
  {
    //
    {
      "host": "localhost",
      "port": 6379,
      "auth": {
        "password": "admin123"
      }
    }
  }
  ```

- docker compose
  ```yml
  redis:
    container_name: redis_server
    restart: always
    ports:
      - 6379:6379
    image: redis
    command: redis-server --requirepass admin123
  ```

- subscribe
  ```javascript
  fpm.subscribe('#redis/message', (topic, data)=>{
    console.log(topic, data);
  });
  // it'll print
  // #redis/message { channel: 'test', message: 'demoaaaa' }
  ```

- run redis command

  it'll support the `redis.run` function.

  the command list: [https://redis.io/commands](https://redis.io/commands)

  ```javascript
  new Func('redis.run')
    .invoke({ command: 'setAsync', param: ['ddd', 'aaa'] })
  ```
