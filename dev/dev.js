'use strict';
const { Fpm } = require('yf-fpm-server');
const plugin = require('../src');
let app = new Fpm()

let biz = app.createBiz('0.0.1');

biz.addSubModules('test',{
	foo: args => {
    app.REDIS.set('test', '111', 'EX', 1000, (err, reply) => {
      console.log(err, reply);
    });
    app.REDIS.pttl('test', function (err, res) {
      console.log(err, res);
    });
		return Promise.reject({errno: -3001})
	}
})
app.addBizModules(biz);
const ref = plugin.bind(app)

// this plugin should run when INIT , but we cant run it in Dev Mode, so We should Run It Manually
app.runAction('INIT', app)

app.subscribe('#someevent', (topic, data)=>{
	console.log(topic, data)
});
app.run()
  .then(() => {
    console.info('the plugin ref:', ref)
  })
