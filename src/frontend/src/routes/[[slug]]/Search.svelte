<style lang="scss">
  @use '../../lib/responsive.scss' as *;

  .search-bar {
    height: 4rem;
    width: 100%;
    padding: 1rem;
    position: relative;
    box-sizing: border-box;
    border: none;
    border-radius: 1rem;
    font-size: 2rem;
    font-family: inherit;
    transition: 0.15s;
    @include override-for-smaller-than(md-screen) {
      height: 3rem;
      font-size: 1.5rem;
    }
    @include override-for-smaller-than(sm-screen) {
      height: 2.5rem;
      font-size: 1.3rem;
    }
    &:not(.elevated):not(.fresh-start):not(.no-poster) {
      border-radius: unset;
      border-top-right-radius: 1rem;
      @include override-for-smaller-than(md-screen) {
        border-top-left-radius: 1rem;
      }
    }
    &:focus,
    &.fresh-start {
      outline: none;
      box-shadow: #3b3b3b80 0px 3px 10px;
    }
    &.fresh-start {
      margin-top: 25vh;
    }
    &.no-poster {
      border-top-left-radius: 1rem;
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
    @include override-for-smaller-than(md-screen) {
      font-size: smaller;
    }

    .search-result {
      // Is a <button> for accessibility, resetting styles
      all: initial;
      font: inherit;

      min-height: 5rem;
      width: 100%;
      padding: 0.5rem 1rem;
      margin: 0.5rem 0;
      box-sizing: border-box;
      display: flex;
      gap: 1rem;
      align-items: center;
      cursor: pointer;
      color: var(--DarkColor);
      @include override-for-smaller-than(sm-screen) {
        min-height: 3rem;
        padding: 0.15rem 1rem;
      }
      &.hovered {
        background-color: var(--DarkVibrant, var(--DarkColor));
        color: var(--DarkVibrantTextColor, #fff);
      }

      .poster {
        height: 4rem;
        @include override-for-smaller-than(sm-screen) {
          height: 3rem;
        }
      }
    }
  }
</style>

<script>
  import { createEventDispatcher } from "svelte"
  import { afterNavigate } from "$app/navigation"
  import { page } from "$app/stores"
  import { PUBLIC_BACKEND_PORT } from '$env/static/public';

  import axios from "axios"
  import debounce from "debounce"

  const dispatch = createEventDispatcher()

  export let searchQuery
  export let freshStart = true
  export let noPoster = true

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
    axios.get(`${$page.url.protocol}//${$page.url.hostname}:${PUBLIC_BACKEND_PORT}/search?q=${searchQuery}`).then(res => {
      searchResults = res.data
    }).catch(err => {
      // TODO
      console.error(err)
    })
  }

  function fetchSeriesMetadata(id) {
    if (!id) return
    axios.get(`${$page.url.protocol}//${$page.url.hostname}:${PUBLIC_BACKEND_PORT}/series?id=${id}`).then(res => {
      selectTitle(res.data)
    }).catch(err => {
      // TODO
      console.error(err)
    })
  }

  function fetchEpisodeMetadata(id) {
    if (!id) return
    axios.get(`${$page.url.protocol}//${$page.url.hostname}:${PUBLIC_BACKEND_PORT}/episodes?id=${id}`).then(res => {
      dispatch("resultEpisodes", res.data)
    }).catch(err => {
      // TODO
      console.error(err)
    })
  }

  function selectTitle(result) {
    hoveredSearchResult = 0
    dispatch("resultSeries", result)
    searchQuery = ""
    searchResults = []
    fetchEpisodeMetadata(result.tvdbId)
    dispatch("newUrlPath", result.slug)
  }
</script>

<form role="search" on:submit={e => {e.preventDefault(); fetchSearchResults();}}>
  <!-- svelte-ignore a11y-autofocus -->
  <input
    type="text"
    class={`search-bar ${searchQuery.length || freshStart ? " elevated" : ""} ${freshStart ? " fresh-start" : ""} ${noPoster ? "no-poster" : ""}`}
    placeholder="Search for series"
    autofocus={freshStart}
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
        if (searchResults.length) {
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