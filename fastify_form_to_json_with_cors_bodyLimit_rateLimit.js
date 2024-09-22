/*
Sources: 
https://fastify.dev/docs/latest/Guides/Getting-Started/
https://github.com/fastify/fastify-formbody
https://github.com/fastify/fastify-cors
https://github.com/fastify/fastify-rate-limit
*/

import Fastify from 'fastify'

const fastify = Fastify({
  logger: true,
  bodyLimit: 10000
})

await fastify.register(import('@fastify/rate-limit'), {
  max: 2,
  timeWindow: '1 minute'  
})

fastify.register(import('@fastify/formbody'))

fastify.register(import('@fastify/cors'))

fastify.post('/', (req, reply) => {
  reply.send(req.body)
})

fastify.get('/', get_handler)

fastify.listen({ port: 8000, host: '0.0.0.0' }, (err) => {
  if (err) throw err
})

// This function is hoisted
function get_handler(req, reply){
    reply.send("hi there")
}
