<style lang="scss">
  main {
    padding: 3rem;
    box-sizing: border-box;
    background-color: var(--DarkVibrant);
    transition: 0.5s;
  }

  .top-area {
    display: flex;
    border-radius: 1.5rem;
    background-color: var(--Muted);

    .active-series-poster {
      height: 30rem;
      width: 20rem;
      z-index: 0;

      .poster {
        height: 100%;
        max-width: 100%;
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

        &::before {
          content: "";
          position: absolute;
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
        height: 26rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom-right-radius: 1.5rem;
        background: linear-gradient(to right, transparent, 10%, var(--Muted) 25%);
        color: var(--RuntimeSummaryTextColor);

        big {
          font-size: 3rem;
        }
      }
    }
  }

  .bottom-area {
    margin-top: 1.5rem;
    padding: 3rem;
    border-radius: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 1rem;
    background-color: var(--Muted);
    transition: 0.5s;

    .season {
      height: 20rem;
      width: 20rem;
      padding: 1rem 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      background-color: #fff;

      .episode-list {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        justify-content: center;
        overflow-x: scroll;

        .episode {
          width: 5rem;
          display: inline;
        }
      }
    }
  }
</style>

<script>
  import humanizeDuration from "humanize-duration"
  import Vibrant from "node-vibrant"
  import contrast from "contrast"

  import Search from "./Search.svelte"

  let activeSeries = null
  let selectedSeries = []

  let searchQuery = ""

  let paletteDarkMuted
  let paletteDarkVibrant
  let paletteLightMuted
  let paletteLightVibrant
  let paletteMuted
  let paletteVibrant
  let paletteRuntimeSummaryTextColor

  function handleFoundSeriesMetadata(e) {
    const series = e.detail
    activeSeries = series
    selectedSeries.push(series)
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
    if (contrast(paletteMuted) === "dark") {
      paletteRuntimeSummaryTextColor = "#fff"
    } else {
      paletteRuntimeSummaryTextColor = "#000"
    }
  }

  function humanizeRuntime(runtimeMinutes, largest=2) {
    return humanizeDuration(
      // humanize-duration accepts milliseconds
      runtimeMinutes * 60 * 1000,
      { largest: 2, round: true, conjunction: " and ", serialComma: false }
    )
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
  --RuntimeSummaryTextColor: {paletteRuntimeSummaryTextColor};
">
  <section class="top-area">
    <section class="active-series-poster">
      {#if activeSeries}
        <img src={activeSeries.thumbnail} class="poster" alt="Poster for {activeSeries.title} ({activeSeries.year})"
        />
      {:else}
        <div class="poster"/>
      {/if}
    </section>
    <summary class="runtime-summary">
      <aside class="search-area {searchQuery.length ? "elevated" : ""}">
        <Search
          bind:searchQuery
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
          <strong>Search to begin.</strong>
        {/if}
      </section>
    </summary>
  </section>
  <section class="bottom-area">
    {#if (Object.keys(activeSeriesEpisodesBySeason).length)}
      {#each Object.entries(activeSeriesEpisodesBySeason) as [seasonNum, season]}
        <div class="season">
          <div><strong>Season {seasonNum}</strong></div>
          <div>{humanizeRuntime(season.totalRuntime)}</div>
          <div class="episode-list">
            {#each Object.values(season.episodes) as episode}
              <div class="episode">
                <strong>Episode {episode.episode}</strong>
                <br/>
                {episode.runtime} minutes
              </div>
            {/each}
          </div>
        </div>
      {/each}
    {/if}
  </section>
</main>
