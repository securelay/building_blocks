/*
Sources: 
https://fastify.dev/docs/latest/Guides/Getting-Started/
https://github.com/fastify/fastify-formbody
https://github.com/fastify/fastify-cors

*/

const fastify = require('fastify')({
  logger: true
})

fastify.register(require('@fastify/formbody'))
fastify.register(require('@fastify/cors'))

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
