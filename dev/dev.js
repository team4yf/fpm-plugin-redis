'use strict';
const { Fpm } = require('yf-fpm-server');
const plugin = require('../src');
let app = new Fpm()

let biz = app.createBiz('0.0.1');

biz.addSubModules('test',{
	foo: args => {
    app.REDIS.set('test:a1', '1113', 'EX', 10);
    app.REDIS.set('test:a2', '1114', 'EX', 10);
    app.REDIS.set('test:a3', '1115', 'EX', 10);
		return 1;
	}
})
app.addBizModules(biz);
const ref = plugin.bind(app)

// this plugin should run when INIT , but we cant run it in Dev Mode, so We should Run It Manually
app.runAction('INIT', app)

app.subscribe('#redis/message', (topic, data)=>{
	console.log(topic, data)
});
app.run()
  .then(() => {
    console.info('the plugin ref:', ref)
  })
