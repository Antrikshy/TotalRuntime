import Fastify from "fastify"
import axios from "axios"

const fastify = Fastify({
  logger: true
})

const tvdb = axios.create({
  baseURL: "https://api4.thetvdb.com/v4",
  headers: {
    "accept": "application/json",
    "Content-Type": "application/json"
  }
})
tvdb.interceptors.response.use(res => res, err => {
  if (err.response.status == 401) {
    return axios.post("https://api4.thetvdb.com/v4/login", { "apikey": process.env.TVDB_API_KEY }).then(res => {
      const token = res.data?.["data"]?.["token"]
      tvdb.defaults.headers.common['Authorization'] = `Bearer ${token}`
      // Retry the original request
      return tvdb(err.config)
    }).catch(err => {
      // TODO
      fastify.log.error(`Couldn't fetch token! ${err}`)
    })
  } else {
    Promise.reject(err)
  }
})

fastify.get("/search", (request, reply) => {
  reply.header("Access-Control-Allow-Origin", "*")
  reply.header("Access-Control-Allow-Methods", "GET")
  const searchQuery = request.query.q.trim()
  if (!searchQuery) { reply.code(404).send() }
  tvdb.get("/search", { params: { query: searchQuery, type: "series", limit: 5, lang: "eng" } }).then(res => {
    const compactResults = res.data["data"].map(result => ({
      "title": result["translations"]?.["eng"] ?? result["name"],
      "year": result["year"],
      "tvdbId": result["tvdb_id"],
      "remoteIds": result["remote_ids"],
      "thumbnail": result["thumbnail"]
    })).filter(Boolean)
    if (compactResults.length) {
      reply.send(compactResults)
    } else {
      reply.code(204).send()
    }
  }).catch(err => {
    // TODO
    fastify.log.error(err.response.status)
    reply.code(500).send("Internal server error")
  })
})

fastify.get("/episodes", (request, reply) => {
  reply.header("Access-Control-Allow-Origin", "*")
  reply.header("Access-Control-Allow-Methods", "GET")
  const tvdbId = request.query.id
  if (!tvdbId) { reply.code(404).send() }
  tvdb.get(`/series/${tvdbId}/episodes/official`, { params: { page: 0 } }).then(res => {
    const compactEpisodes = res.data["data"]?.["episodes"]
      .filter(episode =>
        // Skipping season 0 (often bonus content)
        episode["seasonNumber"] && episode["seasonNumber"] != 0 &&
        episode["runtime"]
      )
      .map(episode => ({
        "season": episode["seasonNumber"],
        "episode": episode["number"],
        "runtime": episode["runtime"]
      }))
    if (compactEpisodes.length) {
      reply.send(compactEpisodes)
    } else {
      reply.code(204).send()
    }
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
