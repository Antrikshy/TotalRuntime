import Fastify from "fastify"
import axios from "axios"
import median from "just-median"

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
      "thumbnail": result["thumbnail"],
      "slug": `${result["tvdb_id"]}-${result["slug"]}`
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

fastify.get("/series", (request, reply) => {
  reply.header("Access-Control-Allow-Origin", "*")
  reply.header("Access-Control-Allow-Methods", "GET")
  const tvdbId = request.query.id
  if (!tvdbId || isNaN(tvdbId)) { reply.code(404).send() }
  tvdb.get(`/series/${tvdbId}/extended`, { params: { short: true } }).then(res => {
    const rawResult = res.data["data"]
    // TODO: What if nothing found?
    reply.send({
      "title": rawResult["translations"]?.["eng"] ?? rawResult["name"],
      "year": rawResult["year"],
      "tvdbId": rawResult["id"],
      "remoteIds": rawResult["remote_ids"],
      "thumbnail": rawResult["image"],
      "slug": `${rawResult["id"]}-${rawResult["slug"]}`
    })
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
  if (!tvdbId || isNaN(tvdbId)) { reply.code(404).send() }
  function _imputeRuntimes(compactEpisodes, averageRuntime) {
    /* Smart fill for missing runtimes, only run if any runtimes are missing */
    if (averageRuntime) {
      // If TheTVDB has an average runtime for this series, keep things simple
      compactEpisodes.forEach(episode => {
        if (!episode["runtime"]) {
          episode["runtime"] = averageRuntime
          episode["runtimeQuality"] = "fetchedAverage"
        }
      })
    } else {
      // If TheTVDB does not have average runtime for this series, use season runtime averages
      const runtimesBySeason = []
      const averageBySeason = []  // For memoization
      compactEpisodes.forEach(episode => {
        // First pass - collecting runtimes in array of arrays
        if (!runtimesBySeason[episode["season"]]) {
          runtimesBySeason[episode["season"]] = []
        }
        runtimesBySeason[episode["season"]][episode["episode"]] = episode["runtime"]
      })
      compactEpisodes.forEach(episode => {
        // TODO: Future releases?
        // Second pass - imputation
        if (!episode["runtime"]) {
          const runtimeForThisSeason = runtimesBySeason[episode["season"]].filter(Boolean)  // TODO: What if all empty?
          averageBySeason[episode["season"]] ??= Math.round(median(runtimeForThisSeason))  // Memoization
          episode["runtime"] = averageBySeason[episode["season"]]
          episode["runtimeQuality"] = "computedAverage"
        }
      })
    }
  }
  tvdb.get(`/series/${tvdbId}/episodes/official`, { params: { page: 0 } }).then(res => {
    // res.data["data"]["series"]["averageRuntime"] = undefined  // TODO: For manual testing; remove
    const compactEpisodes = res.data["data"]?.["episodes"]
      // .map(episode => episode["number"] % 5 == 0 ? {...episode, runtime: undefined} : episode)  // TODO: For manual testing; remove
      .filter(episode =>
        // Skipping season 0 (often bonus content)
        episode["seasonNumber"] && episode["seasonNumber"] != 0
      )
      .map(episode => ({
        "season": episode["seasonNumber"],
        "episode": episode["number"],
        "runtime": episode["runtime"],
        "runtimeQuality": episode["runtime"] ? "fetchedRaw" : ""  // Blanks will be populated during imputation
      }))
    if (compactEpisodes.some(episode => !episode["runtime"])) {
      // If any of the episodes is missing runtime
      _imputeRuntimes(compactEpisodes, res.data["data"]?.["series"]?.["averageRuntime"])
    }
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

fastify.listen({ host: "::", port: 3000 }, (err) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})
