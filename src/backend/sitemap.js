const baseUrl = "https://totalruntime.antrikshy.com"

/*
  Generates an XML sitemap containing a number of arbitrary,
  currently relevant shows as sample pages on this site.
*/
export async function generate(tvdb) {
  const sitemapDataBySeriesId = {}
  const responses = await Promise.all(
    [
      // Getting top series from the last 5 years
      ...Array.from({length: 5}, (_, i) => new Date().getFullYear() - i)
        .map(year => getTopSeries(year, "eng", "usa", tvdb)),
      // Getting top series regardless of release year
      getTopSeries(undefined, "eng", "usa", tvdb)
    ]
  )
  responses.flat().forEach(series => { sitemapDataBySeriesId[series.id] = series })
  const sitemapEntries = Object.values(sitemapDataBySeriesId).map(data =>
    // Assumes received date format to be yyyy-mm-dd hh:mm:ss
    `<url><loc>${baseUrl}/${data.id}-${data.slug}</loc><lastmod>${data.lastUpdated.split(" ")[0]}</lastmod></url>`
  )
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${sitemapEntries.join('')}
    </urlset>
  `
}

async function getTopSeries(year, lang, country, tvdb) {
  return (await tvdb.get("/series/filter", {params: {
    sort: "score",
    sortType: "desc",
    lang: lang,
    country: country,
    year: year
  }})).data.data.map(({ id, slug, lastUpdated }) => ({ id, slug, lastUpdated }))
}
