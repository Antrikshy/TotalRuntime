<style lang="scss">
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Gilda+Display&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Literata:ital,opsz,wght@0,7..72,200..900;1,7..72,200..900&family=Pathway+Extreme:ital,opsz,wght@0,8..144,100..900;1,8..144,100..900&display=swap');

  main {
    min-height: 100vh;
    padding: 3rem;
    box-sizing: border-box;
    background-color: var(--DarkVibrant);
    transition: 0.5s;

    // TODO
    font-family: "Pathway Extreme", sans-serif;
    font-optical-sizing: auto;
    font-weight: 400;
    font-style: normal;
  }

  .top-area,
  .bottom-area {
    border-radius: 1.5rem;
    background-color: var(--Muted);
    transition: 0.5s;
    &:not(.fresh-start) {
      box-shadow:#00000080 0px 3px 15px;
    }
  }

  .top-area {
    display: flex;

    .active-series-poster {
      height: 30rem;
      max-width: 21rem;
      z-index: 0;

      .poster {
        height: 100%;
        display: block;
        border-top-left-radius: 1.5rem;
        border-bottom-left-radius: 1.5rem;
      }
    }

    .runtime-summary {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      text-align: center;
      z-index: 1;

      .search-area {
        width: 100%;
        display: inline-block;
        box-sizing: border-box;
        position: relative;
        &::before {
          content: "";
          position: fixed;
          top: 0;
          left: 0;
          backdrop-filter: none;
          -webkit-backdrop-filter: none;
          transition: 0.15s ease-in;
        }
        &.elevated {
          &::before {
            height: 100vh;
            width: 100vw;
            backdrop-filter: blur(15px) saturate(65%);
            -webkit-backdrop-filter: blur(15px) saturate(65%);
          }
        }
      }

      .active-series-runtime {
        height: 24rem;
        padding: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom-right-radius: 1.5rem;
        background: linear-gradient(to right, transparent, 10%, var(--Muted) 25%);
        color: var(--MutedTextColor);

        // TODO
        font-family: "Gilda Display", serif;
        font-optical-sizing: auto;
        // font-weight: 600;
        font-style: normal;
        line-height: 3.5rem;

        big {
          font-size: 3.5rem;

          strong {
            font-family: "Libre Baskerville", serif;
            font-family: "DM Serif Display", serif;
            font-weight: 800;
          }
        }
      }
    }
  }

  .bottom-area {
    margin-top: 1.5rem;
    padding: 2rem;
  }
</style>

<script>
  import { goto } from "$app/navigation"
  import { page } from "$app/stores"

  import Vibrant from "node-vibrant"
  import { textContrast } from "text-contrast"

  import { humanizeRuntime } from "$lib/util.js"

  import Search from "./Search.svelte"
  import Seasons from "./Seasons.svelte"

  let activeSeries = null
  let selectedSeries = {}

  let searchQuery = ""

  let paletteDarkMuted
  let paletteDarkVibrant
  let paletteLightMuted
  let paletteLightVibrant
  let paletteMuted
  let paletteVibrant
  let paletteMutedTextColor

  function handleShallowRouting(e) {
    if ($page.params.slug != e.detail) {
      goto(e.detail)
    }
  }

  function handleFoundSeriesMetadata(e) {
    const series = e.detail
    activeSeries = series
    selectedSeries[series.tvdbId] = series
  }

  function handleFoundSeriesEpisodes(e) {
    const episodes = e.detail
    activeSeries.episodes = episodes  // Also updates selectedSeries by reference
  }

  async function inferColorPalette() {
    const palette = await Vibrant.from(activeSeries.thumbnail).getPalette()
    paletteDarkMuted = palette["DarkMuted"]?.hex
    paletteDarkVibrant = palette["DarkVibrant"]?.hex
    paletteLightMuted = palette["LightMuted"]?.hex
    paletteLightVibrant = palette["LightVibrant"]?.hex
    paletteMuted = palette["Muted"]?.hex
    paletteVibrant = palette["Vibrant"]?.hex
    if (textContrast.isLightOrDark(paletteMuted) === "dark") {
      paletteMutedTextColor = "#fff"
    } else {
      paletteMutedTextColor = "#000"
    }
  }

  let activeSeriesHumanizedRuntime = ""
  let activeSeriesEpisodesBySeason = {}
  $: if (activeSeries?.episodes) {
    activeSeriesHumanizedRuntime = humanizeRuntime(activeSeries.episodes.reduce((total, ep) => total + ep.runtime, 0))
    activeSeriesEpisodesBySeason = {}
    activeSeries.episodes.forEach(ep => {
      const { season, episode } = ep
      if (!activeSeriesEpisodesBySeason[season]) {
        activeSeriesEpisodesBySeason[season] = {
          totalRuntime: 0,
          episodes: []
        }
      }
      activeSeriesEpisodesBySeason[season]["episodes"][episode] = ep
      activeSeriesEpisodesBySeason[season]["totalRuntime"] += ep.runtime
    })
    if (activeSeries.thumbnail) {
      inferColorPalette()
    }
  }
</script>

<main style="
  --DarkMuted: {paletteDarkMuted};
  --DarkVibrant: {paletteDarkVibrant};
  --LightMuted: {paletteLightMuted};
  --LightVibrant: {paletteLightVibrant};
  --Muted: {paletteMuted};
  --Vibrant: {paletteVibrant};
  --MutedTextColor: {paletteMutedTextColor};
">
  <section class="top-area {activeSeries == null ? " fresh-start" : ""}">
    <section class="active-series-poster">
      {#if activeSeries?.thumbnail}
        <img src={activeSeries.thumbnail} class="poster" alt="Poster for {activeSeries.title} ({activeSeries.year})"/>
      {:else}
        <div class="poster"/>
      {/if}
    </section>
    <summary class="runtime-summary">
      <aside class="search-area {searchQuery.length ? "elevated" : ""}">
        <Search
          freshStart={activeSeries == null}
          bind:searchQuery
          on:newUrlPath={handleShallowRouting}
          on:resultSeries={handleFoundSeriesMetadata}
          on:resultEpisodes={handleFoundSeriesEpisodes}
        />
      </aside>
      <section class="active-series-runtime">
        {#if activeSeriesHumanizedRuntime}
          <big>
            It will take you
            <br/>
            <strong>{activeSeriesHumanizedRuntime}</strong>
            <br/>
            to watch
            <br/>
            <strong>{activeSeries.title}</strong>
          </big>
        {:else}
          <big>Search to begin.</big>
        {/if}
      </section>
    </summary>
  </section>
  <section class="bottom-area {activeSeries == null ? " fresh-start" : ""}">
    {#if (Object.keys(activeSeriesEpisodesBySeason).length)}
      <Seasons activeSeriesEpisodesBySeason={activeSeriesEpisodesBySeason}/>
    {/if}
  </section>
</main>
