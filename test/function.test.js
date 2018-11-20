const should = require("chai").should();
const fpmc = require("yf-fpm-client-js").default;
const { Func } = fpmc;
fpmc.init({appkey: '123123', masterKey: '123123', domain: 'http://localhost:9999'});


describe('Function', function(){
  beforeEach(done => {
    done()
  })


  afterEach(done => {
    done()
  })

  it('Function A', function(done){
    var func = new Func('test.foo');
    func.invoke({})
      .then(function(data){
        console.log(data)
        done();
      }).catch(function(err){
        done(err);
      })
  })
  it('Function setAsync', function(done){
    var func = new Func('redis.run');
    func.invoke({ command: 'setAsync', param: ['ddd', 'aaa'] })
      .then(function(data){
        console.log(data)
        done();
      }).catch(function(err){
        done(err);
      })
  })

  it('Function publish', async () => {
    await new Func('redis.run')
      .invoke({ command: 'subscribe', param: ['test'] });

    await new Func('redis.run')
      .invoke({ command: 'publish', param: ['test', 'demoaaaa'] })
  })
})
