<style lang="scss">
  @use '../../lib/responsive.scss' as *;
  @use '../../lib/typography.scss' as type;

  main {
    --DarkColor: #252525;
    --LightColor: #f9f9f9;

    // Defaults to light mode
    --TextColor: var(--DarkColor);
    --BackgroundColor: var(--LightColor);
    @media (prefers-color-scheme: dark) {
      // Flips if user prefers dark mode
      --TextColor: var(--LightColor);
      --BackgroundColor: var(--DarkColor);
    }

    :global(::selection) {
      background-color: var(--LightVibrant, var(--TextColor));
      color: var(--LightVibrantTextColor, var(--BackgroundColor));
    }

    min-height: 100vh;
    padding: 1rem 3rem;
    box-sizing: border-box;
    position: relative;
    background: linear-gradient(var(--DarkVibrant, var(--BackgroundColor)) 0, var(--DarkMuted, var(--BackgroundColor)) 125%);
    color: var(--DarkVibrantTextColor, var(--TextColor));
    transition: 0.25s;
    @include override-for-smaller-than(md-screen) {
      padding: 1rem 1.5rem;
    }

    @include type.base;  // Base typography

    &.compare-available {
      @include override-for-larger-than(md-screen) {
        padding-right: 4.5rem;
      }
    }
  }

  // For tooltips, initialized in $lib
  :global(.tippy-box) {
    padding: 0.35rem;
    border-radius: 0.5rem;
    font-size: small;
    text-align: center;
    box-shadow: #00000080 0px 2px 8px;
    background-color: var(--DarkVibrant);
    color: var(--DarkVibrantTextColor);
  }

  h1.logo {
    margin-top: 0;
    text-align: center;
    cursor: default;

    a {
      text-decoration: none;

      &>:nth-child(1) {
        @include type.regular-classy;
      }
      &>:nth-child(2) {
        @include type.bold-classy;
        font-size: 2.2rem;
      }
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

    &.fresh-start {
      width: 75%;
      @include override-for-smaller-than(md-screen) {
        width: 90%;
      }
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
          &:not(.fresh-start) {
            justify-content: end;
          }
        }
        @include override-for-larger-than(md-screen) {
          background: linear-gradient(to right, transparent, var(--Muted) 25%) !important;
        }

        .intro-text {
          font-size: 1.5rem;
          @include override-for-smaller-than(md-screen) {
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
    margin-bottom: 0.5rem;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    text-align: center;
    transition: 0.25s;
    img {
      vertical-align: middle;
      height: 1.25rem;
      transform: translateY(-3px);
    }
    @include override-for-smaller-than(lg-screen) {
      margin-bottom: 1.75rem;
    }
    @include override-for-smaller-than(md-screen) {
      padding: 0 3rem;
      font-size: small;
      line-height: 0.8rem;
      &.compare-available {
        margin-bottom: 3rem;
      }
      img {
        height: 1rem;
      }
    }
    &.compare-active {
      display: none;
    }
  }
</style>

<script>
  import { scale, fly } from "svelte/transition"
  import { goto, afterNavigate } from "$app/navigation"
  import { page } from "$app/stores"
  import { tippy } from "$lib/tooltips"

  import { Vibrant } from "node-vibrant/browser"
  import { textContrast } from "text-contrast"

  import { humanizeRuntime } from "$lib/util.js"

  import Search from "./Search.svelte"
  import Seasons from "./Seasons.svelte"
  import Compare from "./Compare.svelte"

  let activeSeries = null
  let seriesMayBeAiring = false
  let activeSeriesHumanizedRuntime = null
  let selectedSeries = {}
  let inCompareMode = false
  let pageTitle = "Total Runtime"
  let pageDescription = null

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
      location.reload()
    }
    const slug = e?.to?.params?.slug
    if (slug == "compare") {
      showCompareScreen(true)
    } else {
      showCompareScreen(false)
    }
  })

  function showCompareScreen(show) {
    if (inCompareMode == show) { return }
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
    activeSeries = e.detail
  }

  function handleFoundSeriesEpisodes(e) {
    const episodes = e.detail
    activeSeries.episodesBySeason = {}
    if (!episodes.length) {
      return
    }
    // Calculating series-level total runtime upfront
    activeSeries.totalRuntime = episodes.reduce((total, ep) => total + ep.runtime, 0)
    activeSeries.runtimeWasImputed = false
    // Cumulative low-confidence runtime total at the end of the series, if applicable
    let fuzzyTrailingRuntime = 0
    // Season numbers that were included in fuzzy trailing runtime, if applicable
    let fuzzySeasons = new Set()
    episodes.forEach(ep => {
      const { season } = ep
      // Creating empty season to build upon
      if (!activeSeries.episodesBySeason[season]) {
        activeSeries.episodesBySeason[season] = {
          totalRuntime: 0,
          runtimeWasImputed: false,
          mayBeAiring: false,
          episodes: []
        }
      }
      // Pushing each episode into season metadata
      activeSeries.episodesBySeason[season]["episodes"].push(ep)
      activeSeries.episodesBySeason[season]["totalRuntime"] += ep.runtime
      if (ep.runtimeQuality != "fetchedRaw") {
        // Runtime is of low confidence
        activeSeries.runtimeWasImputed = true
        activeSeries.episodesBySeason[season]["runtimeWasImputed"] = true
        fuzzyTrailingRuntime += ep.runtime
        fuzzySeasons.add(season)
      } else {
        // Runtime is of high confidence; any fuzziness before was a gap
        fuzzyTrailingRuntime = 0
        fuzzySeasons = new Set()
      }
    })
    // Represents catch-up runtime; may be airing if last episodes have low confidence runtimes
    activeSeries.totalWatchableRuntime = activeSeries.totalRuntime - fuzzyTrailingRuntime
    seriesMayBeAiring = activeSeries.totalRuntime != activeSeries.totalWatchableRuntime
    if (fuzzySeasons.size) {
      fuzzySeasons.forEach(season => {
        activeSeries.episodesBySeason[season]["mayBeAiring"] = true
      })
    }
    // Used for the compare screen
    selectedSeries[activeSeries.tvdbId] = activeSeries
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
  }

  $: {
    pageTitle = "Total Runtime"  // Reset
    pageDescription = "Find and compare how long it will take you to watch TV shows, by season or start to end."  // Reset
    if (activeSeries) {
      // Get humanized runtime, color palette
      if (activeSeries.totalRuntime) {
        activeSeriesHumanizedRuntime = seriesMayBeAiring
          ? humanizeRuntime(activeSeries.totalWatchableRuntime)
          : humanizeRuntime(activeSeries.totalRuntime)
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
      // Set page title and description (latter for SEO)
      const decoratedTitle = `"${activeSeries.title}"${activeSeries.year ? ` (${activeSeries.year})` : ""}`
      const numSeasons = activeSeries.episodesBySeason ? Object.keys(activeSeries.episodesBySeason).length : null
      pageTitle = `${decoratedTitle} - ${pageTitle}`
      pageDescription = `How many weeks, days or hours will it take you to watch all ${numSeasons && numSeasons > 1 ? `${numSeasons} seasons` : "episodes"} of ${decoratedTitle}? Plus, find other shows to compare!`
    }
  }
</script>

<svelte:head>
	<!-- Dynamic head tags for the whole site are set here -->

  <title>{pageTitle}</title>
  <meta name="description" content={pageDescription} />
  <meta name="theme-color" content={paletteDarkVibrant ?? "#252525"} />

  <meta property="og:site_name" content="Total Runtime" />
  <meta property="og:title" content={pageTitle} />
  <meta property="og:description" content={pageDescription} />

  {#if activeSeries}
    <link rel="canonical" href={`https://totalruntime.antrikshy.com/${activeSeries.tvdbId}-${activeSeries.slug}`}/>
    <link rel="alternate" href={`https://totalruntime.antrikshy.com/${activeSeries.tvdbId}`}/>

    <meta property="og:video:release_date" content={activeSeries.year} />
    <meta property="og:video:duration" content={activeSeries.totalRuntime ? activeSeries.totalRuntime * 60 : null} />
    <meta property="og:image" content={activeSeries.thumbnail} />
    <meta property="og:type" content="video:tv_show" />
  {:else}
    <link rel="canonical" href="https://totalruntime.antrikshy.com"/>

    <meta property="og:image" content="/og-image.png" />
    <meta property="og:type" content="website" />
  {/if}
</svelte:head>

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
  <!-- spans used for styling the logo -->
  <h1 class="logo"><a href="/" tabindex="-1"><span>Total</span> <span>Runtime</span></a></h1>
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
                    <span
                      class="help-text"
                      tabindex="-1"
                      use:tippy={{content: seriesMayBeAiring
                        ? "Series may currently be airing. This is estimated time to catch up with the latest episode."
                        : "This series' runtime had gaps that were filled in with approximation."
                      }}
                    >*</span>
                  {/if}
                  </strong>
                <br/>
                <span>to {seriesMayBeAiring ? "catch up with" : "watch"}</span>
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
          in:scale={{ start: 0.8, opacity: 0.5 }}
        >
          <Seasons activeSeriesEpisodesBySeason={activeSeries.episodesBySeason}/>
        </section>
      {/if}
    </div>
  {/if}
  {#if Object.keys(selectedSeries).length > 1 && !inCompareMode}
    <nav class="compare-screen-pull-tab" in:fly={{ x: "100vw" }}>
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
    <small>
      <picture>
        <source srcset="/personal-insignia-dark.png" media="(prefers-color-scheme: dark)">
        <img src={(activeSeries && !inCompareMode) ? "/personal-insignia-dark.png" : "/personal-insignia-light.png"} alt="Antriksh Yadav's personal insignia">
      </picture>
      Designed by <a href="https://antrikshy.com">Antriksh Yadav</a>. Source <a href="https://github.com/Antrikshy/TotalRuntime" target="_blank">on GitHub</a>. Data from <a href="https://thetvdb.com" target="_blank">TheTVDB</a>. Uses <a href="https://support.google.com/analytics/answer/6004245?sjid=1476110778839677937-NC" target="_blank">Google Analytics</a>.</small>
  </footer>
</main>
