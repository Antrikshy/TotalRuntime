<style lang="scss">
  @import '../../lib/responsive.scss';
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Gilda+Display&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Literata:ital,opsz,wght@0,7..72,200..900;1,7..72,200..900&family=Pathway+Extreme:ital,opsz,wght@0,8..144,100..900;1,8..144,100..900&display=swap');

  main {
    :global(::selection) {
      background-color: var(--LightVibrant);
      color: var(--paletteLightVibrantTextColor);
    }

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
    @include override-for-smaller-than(md-screen) {
      padding: 1rem 1.5rem;
    }

    :global(.help-text) {
      cursor: help;
    }
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
    max-width: 100rem;
    margin: auto;
    box-sizing: border-box;
    border-radius: 1.5rem;
    background-color: var(--Muted);
    transition: 0.25s;
    &.compare-available {
      margin-right: 2rem;
    }
    &:not(.fresh-start) {
      box-shadow:#00000080 0px 3px 15px;
    }
  }

  .top-area {
    display: flex;
    @include override-for-smaller-than(md-screen) {
      flex-direction: column;
    }

    .active-series-poster {
      height: 30rem;
      max-width: 21rem;
      text-align: center;
      z-index: 0;
      @include override-for-smaller-than(md-screen) {
        display: none;
      }

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
        overflow: hidden;
        background-size: auto 100%;
        background-repeat: no-repeat;
        background-position: center center;
        color: var(--MutedTextColor);
        @include override-for-smaller-than(md-screen) {
          height: 18rem;
          padding: 0.5rem;
          border-bottom-left-radius: 1.5rem;
          justify-content: end;
        }
        @include override-for-larger-than(md-screen) {
          background: linear-gradient(to right, transparent, var(--Muted) 25%) !important;
        }

        // TODO
        font-family: "Gilda Display", serif;
        font-optical-sizing: auto;
        // font-weight: 600;
        font-style: normal;

        big {
          font-size: 3rem;
          line-height: 3.5rem;
          @include override-for-smaller-than(md-screen) {
            font-size: 2rem;
            line-height: 2.3rem;
            &>* {
              background-color: var(--Muted);
              padding: 0 0.25rem;
            }
          }
          @include override-for-smaller-than(sm-screen) {
            font-size: 1.5rem;
            line-height: 2rem;
          }
          @include override-for-larger-than(xl-screen) {
            font-size: 4.5rem;
            line-height: 4.5rem;
          }

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
    margin-bottom: 5rem;  // Roughly making room for footer
    padding: 2rem;
    @include override-for-smaller-than(md-screen) {
      padding: 1rem;
    }
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
    background-color: var(--Muted);
    color: var(--MutedTextColor);
    transition: 0.1s;
    &:hover {
      width: 3.5rem;
    }
    @include override-for-smaller-than(md-screen) {
      // TODO
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
    width: 100%;
    margin: 1rem 0;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    text-align: center;
    color: var(--DarkVibrantTextColor);
    @include override-for-smaller-than(sm-screen) {
      font-size: small;
    }

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
  let paletteLightVibrantTextColor

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
    activeSeries.runtimeWasImputed = false
    episodes.forEach(ep => {
      const { season, episode } = ep
      if (!activeSeries.episodesBySeason[season]) {
        activeSeries.episodesBySeason[season] = {
          totalRuntime: 0,
          runtimeWasImputed: false,
          episodes: []
        }
      }
      activeSeries.episodesBySeason[season]["episodes"][episode] = ep
      activeSeries.episodesBySeason[season]["totalRuntime"] += ep.runtime
      if (ep.runtimeQuality != "fetchedRaw") {
        activeSeries.runtimeWasImputed = true
        activeSeries.episodesBySeason[season]["runtimeWasImputed"] = true
      }
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
    paletteLightVibrantTextColor = textContrast.isLightOrDark(paletteLightVibrant) === "dark" ? "#fff" : "#000"
    document.getElementsByTagName("meta")["theme-color"].content = paletteDarkVibrant;  // Syncing browser theme
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
  --LightVibrantTextColor: {paletteLightVibrantTextColor};
">
  <h1 class="logo"><a href="/">Total Runtime</a></h1>
  {#if !inCompareMode}
    <!-- TODO: Figure out staggered scaling -->
    <div role="presentation" transition:scale={{ start: 0.8, opacity: 0.8 }}>
      <section class="top-area {activeSeries == null ? " fresh-start" : ""} {Object.keys(selectedSeries).length > 1 ? " compare-available" : ""}">
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
          <!-- CSS inline because URLs don't translate from Svelte to CSS variables well -->
          <section class="active-series-runtime" style="
            background-image: linear-gradient(to bottom, transparent 0, var(--Muted) 95%), url({activeSeries?.thumbnail});
            <!-- background-color: var(--DarkVibrant); -->
          ">
            {#if activeSeriesHumanizedRuntime}
              <big>
                <span>It will take you</span>
                <br/>
                <strong>{activeSeriesHumanizedRuntime}</strong>{#if activeSeries.runtimeWasImputed}
                  <span class="help-text" title="This series' runtime had gaps that were filled in with approximation.">*</span>
                {/if}
                <br/>
                <span>to watch</span>
                <br/>
                <span><strong>{activeSeries.title}</strong> <small>({activeSeries.year})</small></span>
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
          class="bottom-area {activeSeries == null ? " fresh-start" : ""} {Object.keys(selectedSeries).length > 1 ? " compare-available" : ""}"
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
      on:deselectSeries={e => {
        selectedSeries = Object.fromEntries(
          Object.entries(selectedSeries).filter(([k]) => k != e.detail)
        )
      }}
    />
  {/if}
  <footer>
    <small>Designed by <a href="https://antrikshy.com">Antriksh Yadav</a>. Source <a href="https://github.com/Antrikshy/TotalRuntime" target="_blank">on GitHub</a>. Data from <a href="https://thetvdb.com" target="_blank">TheTVDB</a>.</small>
  </footer>
</main>
