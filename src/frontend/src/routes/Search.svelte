<style lang="scss">
  .search-bar {
    height: 4rem;
    width: 100%;
    padding: 1rem;
    position: relative;
    box-sizing: border-box;
    border: 2px solid #ddd;
    border-radius: 1rem;
    font-size: 2rem;
    transition: 0.15s;
    &:not(.elevated) {
      border-left: none;
      border-radius: unset;
      border-top-right-radius: 1rem;
    }
    &:focus {
      outline: none;
      box-shadow: #aaa 0px 5px 15px;
    }
  }

  .search-results {
    min-width: 50rem;
    margin-top: 1rem;
    position: absolute;
    box-sizing: border-box;
    border-radius: 1rem;
    background-color: #fff;

    .search-result {
      .poster {
        height: 4rem;
      }

      // Is a <button> for accessibility, resetting styles
      all: initial;
      font: inherit;
      color: inherit;

      width: 100%;
      padding: 0.5rem 1rem;
      margin: 0.5rem 0;
      box-sizing: border-box;
      display: flex;
      gap: 1rem;
      align-items: center;
      cursor: pointer;

      &:hover {
        background-color: #888;
        color: #fff;
      }
    }
  }
</style>

<script>
  import axios from "axios"
  import debounce from 'debounce'
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()

  export let searchQuery;
  let searchResults = []

  function fetchSearchResults() {
    if (searchQuery.length < 3) {
      searchResults = []
      return
    }
    /* Uses current value of searchQuery */
    axios.get(`${window.location.protocol}//${window.location.hostname}:3000/search?q=${searchQuery}`).then(res => {
      searchResults = res.data
    }).catch(err => {
      // TODO
      console.error(err)
    })
  }

  function fetchEpisodeMetadata(id) {
    /* Uses current activeSeries */
    if (!id) return
    axios.get(`${window.location.protocol}//${window.location.hostname}:3000/episodes?id=${id}`).then(res => {
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
  }
</script>

<form role="search" on:submit={fetchSearchResults}>
  <input
    type="text"
    class={"search-bar" + (searchQuery.length ? " elevated" : "")}
    placeholder="Search"
    autocomplete="off"
    autocorrect="off"
    autocapitalize="off"
    bind:value={searchQuery}
    on:input={debounce(fetchSearchResults, 500)}
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