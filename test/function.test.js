const { init, Func } = require("fpmc-jssdk");
const assert = require('assert');
init({ appkey:'123123', masterKey:'123123', endpoint: 'http://localhost:9999/api' });

describe('Function', function(){
  beforeEach(done => {
    done()
  })


  afterEach(done => {
    done()
  })
  it('Function setAsync', async () => {
    var func = new Func('redis.run');
    let data = await func.invoke({ command: 'setAsync', param: ['ddd', 'aaa'] })      
    console.log(data)   
  })

  it('Function publish', async () => {
    await new Func('redis.run')
      .invoke({ command: 'subscribe', param: ['test'] });

    await new Func('redis.run')
      .invoke({ command: 'publish', param: ['test', 'demoaaaa'] })
  })
})
