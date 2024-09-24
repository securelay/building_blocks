import * as helper from './helper.js';
import Fastify from 'fastify';

const port = parseInt(process.env.PORT);
const bodyLimit = parseInt(process.env.BODYLIMIT);
const rateLimitMax = parseInt(process.env.RATE_LIMIT_MAX);
const rateLimitTimeWindow = process.env.RATE_LIMIT_TIME_WINDOW;
const rateLimitBan = parseInt(process.env.RATE_LIMIT_BAN);
const rateLimitMax404 = parseInt(process.env.RATE_LIMIT_MAX_404);
const rateLimitTimeWindow404 = process.env.RATE_LIMIT_TIME_WINDOW_404;
const rateLimitBan404 = parseInt(process.env.RATE_LIMIT_BAN_404);

helper.setupDB();

// Impose content-length limit
const fastify = Fastify({
  logger: true,
  bodyLimit: bodyLimit
})

// Enable parser for application/x-www-form-urlencoded
fastify.register(import('@fastify/formbody'))

// Enable CORS
fastify.register(import('@fastify/cors'))

// Enable ratelimiter
await fastify.register(import('@fastify/rate-limit'), {
  global: true,
  max: rateLimitMax,
  timeWindow: rateLimitTimeWindow,
  ban: rateLimitBan
})

// Rate limits for preventing guessing of URLS through 404s
fastify.setNotFoundHandler({
  preHandler: fastify.rateLimit({
    max: rateLimitMax404,
    timeWindow: rateLimitTimeWindow404,
    ban: rateLimitBan404
  })
})

fastify.get('/keys', (request, reply) => {
    reply.send(helper.genKeyPair());
})

fastify.post('/public/:publicKey', (request, reply) => {
    const { publicKey } = request.params;
    try {
        if (helper.validate(publicKey) !== 'public') throw "Key provided is not Public";
        helper.publicProduce(publicKey, JSON.stringify(request.body));
        reply.send({status: "ok"});
    } catch (err) {
        reply.code(401);
        reply.send({status: "err", msg: err});
    }    
})

fastify.get('/private/:privateKey', (request, reply) => {
    const { privateKey } = request.params;
    try {
        if (helper.validate(privateKey) !== 'private') throw "Key provided is not Private";
        reply.send(helper.privateConsume(privateKey));
    } catch (err) {
        reply.code(401);
        reply.send({status: "err", msg: err});
    }    
})

fastify.post('/private/:privateKey', (request, reply) => {
    const { privateKey } = request.params;
    try {
        if (helper.validate(privateKey) !== 'private') throw "Key provided is not Private";
        helper.privateProduce(privateKey, JSON.stringify(request.body));
        reply.send({status: "ok"});
    } catch (err) {
        reply.code(401);
        reply.send({status: "err", msg: err});
    }    
})

fastify.get('/public/:publicKey', (request, reply) => {
    const { publicKey } = request.params;
    try {
        if (helper.validate(publicKey) !== 'public') throw "Key provided is not Public";
        reply.send(helper.publicConsume(publicKey));
    } catch (err) {
        reply.code(401);
        reply.send({status: "err", msg: err});
    }    
})

fastify.listen({ port: port, host: '0.0.0.0' }, (err) => {
  if (err) throw err
})

// Run garbage cleaner every 4 hrs
setTimeout(helper.gc, 4*3600*1000)
