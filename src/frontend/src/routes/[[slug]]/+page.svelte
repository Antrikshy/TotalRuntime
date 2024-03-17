<style lang="scss">
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Gilda+Display&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Literata:ital,opsz,wght@0,7..72,200..900;1,7..72,200..900&family=Pathway+Extreme:ital,opsz,wght@0,8..144,100..900;1,8..144,100..900&display=swap');

  main {
    // TODO
    // ::selection

    min-height: 100vh;
    padding: 1rem 3rem;
    box-sizing: border-box;
    position: relative;
    background-color: var(--DarkVibrant);
    transition: 0.25s;

    // TODO
    font-family: "Pathway Extreme", sans-serif;
    font-optical-sizing: auto;
    font-weight: 400;
    font-style: normal;
  }

  h1.logo {
    text-align: center;
    margin-top: 0;
    cursor: default;

    a {
      color: var(--DarkVibrantTextColor);
      text-decoration: none;
    }
  }

  .top-area,
  .bottom-area {
    margin-right: 2rem;
    border-radius: 1.5rem;
    background-color: var(--Muted);
    transition: 0.25s;
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
        flex-direction: column;
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
    margin-bottom: 2.5rem;
    padding: 2rem;
  }

  .compare-screen-pull-tab {
    height: 50vh;
    min-height: 12rem;
    width: 3rem;
    position: fixed;
    top: 25vh;
    right: 0;
    border-top-left-radius: 1.5rem;
    border-bottom-left-radius: 1.5rem;
    writing-mode: vertical-lr;
    background-color: lightcoral;
    transition: 0.1s;
    &:hover {
      width: 3.5rem;
    }

    button {
      all: unset;
      height: 100%;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
  }

  footer {
    width: calc(100vw - 6rem);
    margin: 1rem 0;
    position: absolute;
    bottom: 0;
    box-sizing: border-box;
    text-align: center;
    color: var(--DarkVibrantTextColor);

    a {
      color: var(--DarkVibrantTextColor);
    }
  }
</style>

<script>
  import { scale, fly } from "svelte/transition"
  import { goto, afterNavigate } from "$app/navigation"
  import { page } from "$app/stores"

  import Vibrant from "node-vibrant"
  import { textContrast } from "text-contrast"

  import { humanizeRuntime } from "$lib/util.js"

  import Search from "./Search.svelte"
  import Seasons from "./Seasons.svelte"
  import Compare from "./Compare.svelte"

  let activeSeries = null
  let selectedSeries = {}
  let inCompareMode = false

  let searchQuery = ""

  let paletteDarkMuted
  let paletteDarkVibrant
  let paletteLightMuted
  let paletteLightVibrant
  let paletteMuted
  let paletteVibrant
  let paletteMutedTextColor
  let paletteDarkVibrantTextColor

  afterNavigate(e => {
    if (e?.to?.url?.pathname == "/" && e?.from) {
      showCompareScreen(false)
      location.reload();
    }
    const slug = e?.to?.params?.slug
    if (slug == "compare") {
      showCompareScreen(true)
    } else {
      showCompareScreen(false)
    }
  })

  function showCompareScreen(show) {
    if (inCompareMode == show) { return; }
    if (show) {
      inCompareMode = true
      handleShallowRouting({detail: "compare"})
    } else {
      inCompareMode = false
    }
  }

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
    // Function also updates selectedSeries by reference
    const episodes = e.detail
    activeSeries.numOfEpisodes = episodes.length
    activeSeries.episodesBySeason = {}
    if (!episodes.length) {
      return;
    }
    activeSeries.totalRuntime = episodes.reduce((total, ep) => total + ep.runtime, 0)
    episodes.forEach(ep => {
      const { season, episode } = ep
      if (!activeSeries.episodesBySeason[season]) {
        activeSeries.episodesBySeason[season] = {
          totalRuntime: 0,
          episodes: []
        }
      }
      activeSeries.episodesBySeason[season]["episodes"][episode] = ep
      activeSeries.episodesBySeason[season]["totalRuntime"] += ep.runtime
    })
  }

  async function inferColorPalette() {
    const palette = await Vibrant.from(activeSeries.thumbnail).getPalette()
    paletteDarkMuted = palette["DarkMuted"]?.hex
    paletteDarkVibrant = palette["DarkVibrant"]?.hex
    paletteLightMuted = palette["LightMuted"]?.hex
    paletteLightVibrant = palette["LightVibrant"]?.hex
    paletteMuted = palette["Muted"]?.hex
    paletteVibrant = palette["Vibrant"]?.hex
    paletteMutedTextColor = textContrast.isLightOrDark(paletteMuted) === "dark" ? "#fff" : "#000"
    paletteDarkVibrantTextColor = textContrast.isLightOrDark(paletteDarkVibrant) === "dark" ? "#fff" : "#000"
  }

  let activeSeriesHumanizedRuntime = null
  $: {
    if (activeSeries) {
      if (activeSeries.totalRuntime) {
        activeSeriesHumanizedRuntime = humanizeRuntime(activeSeries.totalRuntime)
        if (activeSeries.thumbnail) {
          inferColorPalette()
        }
      } else {
        activeSeriesHumanizedRuntime = ""
      }
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
  --DarkVibrantTextColor: {paletteDarkVibrantTextColor};
">
  <h1 class="logo"><a href="/">Total Runtime</a></h1>
  {#if !inCompareMode}
    <!-- TODO: Figure out staggered scaling -->
    <div role="presentation" transition:scale={{ start: 0.8, opacity: 0.8 }}>
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
            {:else if activeSeriesHumanizedRuntime == ""}
              <big>
                Runtime data unavailable for
                <br/>
                <strong>{activeSeries.title}</strong>
              </big>
            {:else}
              <strong>Check and compare TV series runtimes, by season or in their entirety.</strong>
              <big>Search to begin.</big>
            {/if}
          </section>
        </summary>
      </section>
      {#if (Object.keys(activeSeries?.episodesBySeason || {}).length)}
        <section
          class="bottom-area {activeSeries == null ? " fresh-start" : ""}"
          out:scale={{ start: 0.8, opacity: 0.5 }}
          in:scale={{ start: 0.8, opacity: 0.5 }}
        >
          <Seasons activeSeriesEpisodesBySeason={activeSeries.episodesBySeason}/>
        </section>
      {/if}
    </div>
  {/if}
  {#if Object.keys(selectedSeries).length > 1 && !inCompareMode}
    <nav class="compare-screen-pull-tab" in:fly={{ x: "100vw", duration: 250 }}>
      <button on:click={_ => showCompareScreen(true)}>
        Compare {Object.keys(selectedSeries).length} series
      </button>
    </nav>
  {/if}
  {#if inCompareMode}
    <Compare
      bind:selectedSeries
      on:closeCompareScreen={_ => {
        history.back()
        showCompareScreen(false)
      }}
      on:unselectSeries={e => {
        selectedSeries = Object.fromEntries(
          Object.entries(selectedSeries).filter(([k]) => k != e.detail)
        )
      }}
    />
  {/if}
  <footer>
    <small>Designed by Antriksh Yadav. Source <a href="https://github.com/Antrikshy/TotalRuntime" target="_blank">on GitHub</a>. Data from <a href="https://thetvdb.com" target="_blank">TheTVDB</a>.</small>
  </footer>
</main>
