<style lang="scss">
  @use '../../lib/responsive.scss' as *;
  @use '../../lib/typography.scss' as type;

  main {
    --tooltip-background-color: var(--DarkVibrant, #fff);
    --tooltip-color: var(--DarkVibrantTextColor, var(--DarkColor));
    --tooltip-font-family: type.$base-font-stack;

    ::selection {
      background-color: var(--LightVibrant, #000);
      color: var(--LightVibrantTextColor, #fff);
    }

    min-height: 100vh;
    padding: 1rem 3rem;
    box-sizing: border-box;
    position: relative;
    background: linear-gradient(var(--DarkVibrant, #fff) 0, var(--DarkMuted, #fff) 125%);
    color: var(--DarkVibrantTextColor, var(--DarkColor));
    transition: 0.25s;

    @include type.base;

    &.compare-available {
      @include override-for-larger-than(md-screen) {
        padding-right: 4.5rem;
      }
    }
    @include override-for-smaller-than(md-screen) {
      padding: 1rem 1.5rem;
    }
  }

  h1.logo {
    text-align: center;
    margin-top: 0;
    cursor: default;
    font-family: type.$base-font-stack;

    a {
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
    &:not(.fresh-start) {
      box-shadow: #00000080 0px 3px 15px;
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
        gap: 2rem;
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

        .intro-text {
          font-size: 1.5rem;

          @include override-for-smaller-than(sm-screen) {
            font-size: 1rem;
          }
        }

        big {
          font-size: 3rem;
          line-height: 3.5rem;
          @include type.regular-classy;
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
            @include type.bold-classy;
          }
        }
      }
    }
  }

  .bottom-area {
    margin-top: 1.5rem;
    margin-bottom: 5rem;  // Crudely making room for footer
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
    box-shadow: #00000080 0px 0px 15px;
    background-color: var(--LightVibrant);
    color: var(--LightVibrantTextColor);
    transition: 0.1s;
    @include override-for-larger-than(md-screen) {
      &:hover {
        width: 3.5rem;
      }
    }
    @include override-for-smaller-than(md-screen) {
      height: 2rem;
      min-height: unset;
      width: 50vw;
      border-radius: 0;
      border-top-left-radius: 1.5rem;
      border-top-right-radius: 1.5rem;
      writing-mode: unset;
      top: unset;
      left: 25vw;
      right: unset;
      bottom: 0;
      &:hover {
        height: 2.5rem;
      }
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
    margin-bottom: 1rem;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    text-align: center;
    transition: 0.25s;
    @include override-for-smaller-than(md-screen) {
      font-size: small;
      &.compare-available {
        margin-bottom: 3rem;
      }
    }
    &.compare-active {
      * {
        background-color: #fff;
        color: var(--DarkColor);
      }
    }
  }
</style>

<script>
  import { scale, fly } from "svelte/transition"
  import { goto, afterNavigate } from "$app/navigation"
  import { page } from "$app/stores"

  import Vibrant from "node-vibrant"
  import { textContrast } from "text-contrast"
  import { tooltip } from "@svelte-plugins/tooltips";

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
    activeSeries.episodesBySeason = {}
    if (!episodes.length) {
      return;
    }
    activeSeries.totalRuntime = episodes.reduce((total, ep) => total + ep.runtime, 0)
    activeSeries.runtimeWasImputed = false
    episodes.forEach(ep => {
      const { season } = ep
      if (!activeSeries.episodesBySeason[season]) {
        activeSeries.episodesBySeason[season] = {
          totalRuntime: 0,
          runtimeWasImputed: false,
          episodes: []
        }
      }
      activeSeries.episodesBySeason[season]["episodes"].push(ep)
      activeSeries.episodesBySeason[season]["totalRuntime"] += ep.runtime
      if (ep.runtimeQuality != "fetchedRaw") {
        activeSeries.runtimeWasImputed = true
        activeSeries.episodesBySeason[season]["runtimeWasImputed"] = true
      }
    })
  }

  async function inferColorPalette() {
    // Only call when thumbnail is available
    const palette = await Vibrant.from(activeSeries.thumbnail).getPalette()
    paletteDarkMuted = palette["DarkMuted"]?.hex
    paletteDarkVibrant = palette["DarkVibrant"]?.hex
    paletteLightMuted = palette["LightMuted"]?.hex
    paletteLightVibrant = palette["LightVibrant"]?.hex
    paletteMuted = palette["Muted"]?.hex
    paletteVibrant = palette["Vibrant"]?.hex
    paletteMutedTextColor = textContrast.isLightOrDark(paletteMuted) === "dark" ? "#fff" : "var(--DarkColor)"
    paletteDarkVibrantTextColor = textContrast.isLightOrDark(paletteDarkVibrant) === "dark" ? "#fff" : "var(--DarkColor)"
    paletteLightVibrantTextColor = textContrast.isLightOrDark(paletteLightVibrant) === "dark" ? "#fff" : "var(--DarkColor)"
    document.getElementsByTagName("meta")["theme-color"].content = paletteDarkVibrant;  // Syncing browser theme
  }

  function resetColorPalette() {
    // Clears any color palette applied to the whole page
    paletteDarkMuted = undefined
    paletteDarkVibrant = undefined
    paletteLightMuted = undefined
    paletteLightVibrant = undefined
    paletteMuted = undefined
    paletteVibrant = undefined
    paletteMutedTextColor = undefined
    paletteDarkVibrantTextColor = undefined
    paletteLightVibrantTextColor = undefined
    document.getElementsByTagName("meta")["theme-color"].content = undefined;  // Clearing browser theme
  }

  let activeSeriesHumanizedRuntime = null
  $: {
    if (activeSeries) {
      if (activeSeries.totalRuntime) {
        activeSeriesHumanizedRuntime = humanizeRuntime(activeSeries.totalRuntime)
        if (activeSeries.thumbnail) {
          inferColorPalette()
          activeSeries.summaryBackgroundColor = paletteLightVibrant
          activeSeries.summaryTextColor = paletteLightVibrantTextColor
        } else {
          resetColorPalette()
        }
      } else {
        activeSeriesHumanizedRuntime = ""
      }
    }
  }
</script>

<main class={Object.keys(selectedSeries).length > 1 ? "compare-available" : ""} style="
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
              noPoster={activeSeries?.thumbnail == null}
              bind:searchQuery
              on:newUrlPath={handleShallowRouting}
              on:resultSeries={handleFoundSeriesMetadata}
              on:resultEpisodes={handleFoundSeriesEpisodes}
            />
          </aside>
          <!-- CSS inline because URLs don't translate from Svelte to CSS variables well -->
          <section class="active-series-runtime" style="
            background-image: linear-gradient(to bottom, transparent 0, var(--Muted) 95%), url({activeSeries?.thumbnail});
          ">
            {#if activeSeriesHumanizedRuntime}
              <big>
                <span>It will take you</span>
                <br/>
                <strong>
                  {activeSeriesHumanizedRuntime}{#if activeSeries.runtimeWasImputed}
                    <span class="help-text" tabindex="-1" title="This series' runtime had gaps that were filled in with approximation." use:tooltip={{animation: "slide"}}>*</span>
                  {/if}
                  </strong>
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
              <span class="intro-text">Find and compare TV series runtimes, by season or in their entirety.</span>
              <span class="intro-text">Search to begin.</span>
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
      on:deselectSeries={e => {
        selectedSeries = Object.fromEntries(
          Object.entries(selectedSeries).filter(([k]) => k != e.detail)
        )
      }}
    />
  {/if}
  <footer class={inCompareMode ? "compare-active" : "" + Object.keys(selectedSeries).length > 1 ? " compare-available" : ""}>
    <small>Designed by <a href="https://antrikshy.com">Antriksh Yadav</a>. Source <a href="https://github.com/Antrikshy/TotalRuntime" target="_blank">on GitHub</a>. Data from <a href="https://thetvdb.com" target="_blank">TheTVDB</a>.</small>
  </footer>
</main>
