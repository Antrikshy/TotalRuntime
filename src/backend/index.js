const fastify = require("fastify")({ logger: true })
const axios = require("axios")

const tvdb = axios.create({
  baseURL: "https://api4.thetvdb.com/v4",
  headers: {
    "accept": "application/json",
    "Content-Type": "application/json"
  }
})

fastify.get("/token", (_, reply) => {
  // TODO
  tvdb.post("/login", { "apikey": "" }).then(res => {
    reply.send(res?.data?.["data"]?.["token"])
  }).catch(err => {
    // TODO
    fastify.log.error(err.response.status)
    reply.code(500).send("Internal server error")
  })
})

fastify.listen({ port: 3000 }, (err) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})
