<style lang="scss">
  .search-bar {
    height: 4rem;
    width: 100%;
    padding: 1rem;
    position: relative;
    box-sizing: border-box;
    border: none;
    border-radius: 1rem;
    font-size: 2rem;
    // TODO
    font-family: "Pathway Extreme", sans-serif;
    transition: 0.15s;
    &:not(.elevated):not(.fresh-start) {
      border-radius: unset;
      border-top-right-radius: 1rem;
    }
    &:focus,
    &.fresh-start {
      outline: none;
      box-shadow:
        #3b3b3b80 0px 3px 10px,
        #3b3b3b10 0px -2px 3px 2px inset;
    }
  }

  .search-results {
    width: 100%;
    margin-top: 1rem;
    position: absolute;
    box-sizing: border-box;
    border-radius: 1rem;
    background-color: #fff;
    box-shadow: #3b3b3b80 0px 3px 10px;

    .search-result {
      .poster {
        height: 4rem;
      }

      // Is a <button> for accessibility, resetting styles
      all: initial;
      font: inherit;
      color: inherit;

      min-height: 5rem;
      width: 100%;
      padding: 0.5rem 1rem;
      margin: 0.5rem 0;
      box-sizing: border-box;
      display: flex;
      gap: 1rem;
      align-items: center;
      cursor: pointer;

      &.hovered {
        background-color: var(--DarkVibrant, #000);
        color: var(--DarkVibrantTextColor, #fff);
      }
    }
  }
</style>

<script>
  import { createEventDispatcher } from "svelte"
  import { afterNavigate } from "$app/navigation"
  import { page } from "$app/stores"

  import axios from "axios"
  import debounce from "debounce"

  const dispatch = createEventDispatcher()

  export let searchQuery
  export let freshStart = true

  let searchResults = []
  let hoveredSearchResult = 0

  afterNavigate(e => {
    const tvdbId = e?.to?.params?.slug?.split("-")[0]
    if (tvdbId && !isNaN(tvdbId)) {
      fetchSeriesMetadata(tvdbId)
    }
  })

  function fetchSearchResults() {
    if (searchQuery.length < 3) {
      searchResults = []
      return
    }
    /* Uses current value of searchQuery */
    axios.get(`${$page.url.protocol}//${$page.url.hostname}:3000/search?q=${searchQuery}`).then(res => {
      searchResults = res.data
    }).catch(err => {
      // TODO
      console.error(err)
    })
  }

  function fetchSeriesMetadata(id) {
    if (!id) return
    axios.get(`${$page.url.protocol}//${$page.url.hostname}:3000/series?id=${id}`).then(res => {
      selectTitle(res.data)
    }).catch(err => {
      // TODO
      console.error(err)
    })
  }

  function fetchEpisodeMetadata(id) {
    if (!id) return
    axios.get(`${$page.url.protocol}//${$page.url.hostname}:3000/episodes?id=${id}`).then(res => {
      dispatch("resultEpisodes", res.data)
    }).catch(err => {
      // TODO
      console.error(err)
    })
  }

  function selectTitle(result) {
    dispatch("resultSeries", result)
    searchQuery = ""
    searchResults = []
    fetchEpisodeMetadata(result.tvdbId)
    dispatch("newUrlPath", result.slug)
  }
</script>

<form role="search" on:submit={fetchSearchResults}>
  <!-- svelte-ignore a11y-autofocus -->
  <input
    type="text"
    class={"search-bar" + (searchQuery.length || freshStart ? " elevated" : "") + (freshStart ? " fresh-start" : "")}
    placeholder="Search for series"
    autofocus={true}
    auAvoidtocomplete="off"
    autocorrect="off"
    autocapitalize="off"
    bind:value={searchQuery}
    on:keydown={e => {
      if (e.key == "Escape") {
        searchQuery = ""
        searchResults = []
      } else if (e.key == "ArrowDown") {
        hoveredSearchResult++
      } else if (e.key == "ArrowUp") {
        hoveredSearchResult--
      } else if (e.key == "Enter") {
        if (hoveredSearchResult > -1) {
          selectTitle(searchResults[hoveredSearchResult])
        }
      }
    }}
    on:input={debounce(fetchSearchResults, 500)}
  />
</form>
{#if searchResults.length}
  <div class="search-results">
    {#each searchResults as result, i}
      <button
        class={"search-result" + (hoveredSearchResult == i ? " hovered" : "")}
        on:click={_ => selectTitle(result)}
        on:focusin={_ => hoveredSearchResult = i}
        on:focusout={_ => hoveredSearchResult = -1}
        on:pointerenter={_ => hoveredSearchResult = i}
        on:pointerleave={_ => hoveredSearchResult = -1}
      >
        {#if result.thumbnail}
          <img src={result.thumbnail} class="poster" alt="Poster for {result.title}"/>
        {/if}
        <span>
          <strong>{result.title}</strong>
          <br>
          {result.year ?? ""}
        </span>
      </button>
    {/each}
  </div>
{/if}