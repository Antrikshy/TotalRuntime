<style lang="scss">
  main {
    height: calc(100vh - 6rem);
    margin: 3rem;
    display: grid;
    grid-template-columns: 2fr 3fr;
    grid-template-rows: 4fr 6fr;
    background-color: lightblue;
    grid-template-areas:
      "poster runtime-summary"
      "episode-info episode-info";
  }

  .active-series-poster {
    grid-area: poster;

    .poster {
      max-height: 100%;
    }
  }

  .runtime-summary {
    display: flex;
    flex-direction: column;
    text-align: center;
    grid-area: runtime-summary;

    .search-area {
      width: calc(100% - 2rem);
      padding: 1rem;
      display: inline-block;
      box-sizing: border-box;
      background-color: lightcyan;
      transition: 0.25s ease-in;
      &.elevated {
        transform: scale(1.05);
      }

      .search-bar {
        height: 2rem;
        width: calc(100% - 2rem);
        padding: 1rem;
        position: relative;
        border: 1px solid black;
        border-radius: 5px;
        font-size: 2rem;
        transition: 0.15s;
        &:focus {
          outline: none;
          box-shadow: #aaa 0px 5px 15px;
        }
      }
      .search-results {
        position: absolute;
        width: 100%;

        .search-result {
          .poster {
            height: 4rem;
          }

          // Is a <button> for accessibility, resetting styles
          all: initial;
          font: inherit;
          color: inherit;

          width: 100%;
          padding: 0.5rem;
          display: flex;
          gap: 1rem;
          align-items: center;
          background-color: #fff;
        }
      }
    }

    .active-series-runtime {
      height: 100%;
      padding: 3rem;
      display: flex;
      align-items: center;
      justify-items: center;

      big {
        font-size: 5rem;
      }
    }
  }

  .active-series-episodes {
    grid-area: episode-info;
    background-color: lightcoral;
  }
</style>

<script>
  // @hmr:keep-all

  import axios from "axios"
  import humanizeDuration from "humanize-duration"

  // Raw data
  let activeSeries = null
  let searchResults = []
  let selectedSeries = []

  // Processed data for render cycle
  let activeSeriesHumanizedRuntime = ""
  let activeSeriesEpisodesBySeason = {}

  // Form fields
  let searchQuery = ""

  function fetchSearchResults() {
    /* Uses current value of searchQuery */
    axios.get(`${window.location.protocol}//${window.location.hostname}:3000/search?q=${searchQuery}`).then(res => {
      searchResults = res.data
    }).catch(err => {
      // TODO
      console.error(err)
    })
  }

  function fetchEpisodeMetadata() {
    /* Uses current activeSeries */
    axios.get(`${window.location.protocol}//${window.location.hostname}:3000/episodes?id=${activeSeries.tvdbId}`).then(res => {
      activeSeries.episodes = res.data  // Also updates selectedSeries by reference
    }).catch(err => {
      // TODO
      console.error(err)
    })
  }

  function selectTitle(result) {
    activeSeries = result
    selectedSeries.push(result)
    searchQuery = ""
    searchResults = []
    activeSeriesHumanizedRuntime = ""
    activeSeriesEpisodesBySeason = {}
    fetchEpisodeMetadata()
  }

  $: if (activeSeries?.episodes) {
    activeSeriesHumanizedRuntime = humanizeDuration(
      // humanize-duration accepts milliseconds
      activeSeries.episodes.reduce((total, ep) => total + ep.runtime, 0) * 60 * 1000,
      { largest: 2, round: true, conjunction: " and ", serialComma: false }
    )
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
  }
</script>

<main>
  <section class="active-series-poster">
    {#if activeSeries}
      <img src={activeSeries.thumbnail} class="poster" alt="Poster for {activeSeries.title} ({activeSeries.year})"/>
    {:else}
      <img src="https://placehold.co/400x600.png" class="poster" alt="Placeholder poster"/>
    {/if}
  </section>
  <section class="runtime-summary">
    <aside class="search-area {searchQuery.length ? "elevated" : ""}">
      <form role="search" on:submit={fetchSearchResults}>
        <input
          type="text"
          class="search-bar"
          placeholder="Search"
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          bind:value={searchQuery}
        />
      </form>
      {#if searchResults.length}
        <div class="search-results">
          {#each searchResults as result}
            <button class="search-result" on:click={_ => selectTitle(result)}>
              <img src={result.thumbnail || "https://placehold.co/40x60.png"} class="poster" alt="Poster for {result.title} ({result.year})"/>
              <span>
                <strong>{result.title}</strong>
                <br>
                {result.year}
              </span>
            </button>
          {/each}
        </div>
      {/if}
    </aside>
    <section class="active-series-runtime">
      {#if activeSeriesHumanizedRuntime}
        <big>It will take you {activeSeriesHumanizedRuntime} to watch {activeSeries.title}</big>
      {:else}
        <strong>Search to begin.</strong>
      {/if}
    </section>
  </section>
  <div class="active-series-episodes">
    {#if (Object.keys(activeSeriesEpisodesBySeason).length)}
      {#each Object.entries(activeSeriesEpisodesBySeason) as [seasonNum, season]}
        <div>
          {seasonNum}
          <br/>
          <span>{season.totalRuntime}</span>
          <br/>
          {#each Object.values(season.episodes) as episode}
            <div>{JSON.stringify(episode)}</div>
          {/each}
        </div>
      {/each}
    {/if}
  </div>
</main>
