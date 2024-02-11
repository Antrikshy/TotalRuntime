<style lang="scss">
  main {
    height: calc(100vh - 6rem);
    margin: 3rem;
    background-color: lightblue;
  }

  .search-area {
    margin: 1rem;
    padding: 1rem;
    position: fixed;
    right: 3rem;
    text-align: right;
    background-color: aqua;
    transition: 1s;
    &.elevated {
      transform: scale(1.05);
    }

    .search-bar {
      height: 2rem;
      width: 50rem;
      padding: 1rem;
      border: 1px solid black;
      border-radius: 5px;
      font-size: 2rem;
      transition: 0.15s;
      &:focus {
        outline: none;
        box-shadow: #aaa 0px 5px 15px;
      }
    }

    .search-result {
      .poster {
        height: 4rem;
      }

      // Is a <button> for accessibility, resetting styles
      all: initial;
      font: inherit;
      color: inherit;
      text-align: inherit;

      width: 100%;
      padding: 0.5rem;
      display: grid;
      grid-template-columns: 1fr 5fr;
    }
  }
</style>

<script>
  import axios from "axios"

  let activeSeries = null
  let searchResults = []
  let selectedSeries = []

  let searchQuery = ""

  function search() {
    axios.get(`${window.location.protocol}//${window.location.hostname}:3000/search?q=${searchQuery}`).then(res => {
      searchResults = res.data
    }).catch(err => {
      // TODO
    })
  }

  function selectTitle(result) {
    activeSeries = result
    selectedSeries.append(result)
    searchResults = []
  }
</script>

<main>
  <aside class="search-area {searchResults.length ? 'elevated' : ''}">
    <form role="search" on:submit={search}>
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
            <img src={result.thumbnail} class="poster" alt="Poster for {result.title} ({result.year})"/>
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
</main>

