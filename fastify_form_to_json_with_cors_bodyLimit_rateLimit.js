/*
Sources: 
https://fastify.dev/docs/latest/Guides/Getting-Started/
https://github.com/fastify/fastify-formbody
https://github.com/fastify/fastify-cors
https://github.com/fastify/fastify-rate-limit
*/

import Fastify from 'fastify';
import * as env from './env.js';

const fastify = Fastify({
  logger: true,
  bodyLimit: env.bodyLimit
})

fastify.register(import('@fastify/formbody'))

fastify.register(import('@fastify/cors'))

fastify.addHook('onResponse', (request, reply, done) => {
    console.log(`I just received ${JSON.stringify(request.body)}`)
    done();
})

fastify.post('/', (req, reply) => {
  reply.send(req.body)
})

// Because we are registering the rate-limiter after registering the POST / route above, POSTs at / won't be rate-limited. But GET at / would.
await fastify.register(import('@fastify/rate-limit'), {
  max: env.rateLimitMax,
  timeWindow: env.rateLimitTimeWindow,
  ban: env.rateLimitBan
})

fastify.get('/:privatePath', get_handler)

fastify.listen({ port: env.port, host: '0.0.0.0' }, (err) => {
  if (err) throw err
})

// This function is hoisted
function get_handler(req, reply){
    const { privatePath } = req.params;
    reply.code(200); // 200 is default, i.e. sent if code is not set like this
    reply.send(`Your private path is ${privatePath}`);
}
