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
    return axios.post("https://api4.thetvdb.com/v4/login", { "apikey": "" }).then(res => {
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
  const searchQuery = request.query.q.trim()
  tvdb.get("/search", { params: { query: searchQuery, type: "series", limit: 5 } }).then(res => {
    const compactResults = res.data["data"].map(result => ({
      "title": result["name"],
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
  const tvdbId = request.query.id
  tvdb.get(`/series/${tvdbId}/episodes/official`, { params: { page: 0 } }).then(res => {
    const compactEpisodes = res.data["data"]?.["episodes"]
      .filter(episode => episode["seasonNumber"] && episode["seasonNumber"] != 0)
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