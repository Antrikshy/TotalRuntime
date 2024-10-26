<style lang="scss">
  @use '../../lib/responsive.scss' as *;

  .compare-screen {
    height: 100vh;
    width: 100vw;
    padding: 5rem 3rem 15rem;
    box-sizing: border-box;
    position: fixed;
    top: 0;
    left: 0;
    overflow-y: scroll;
    background-color: #fff;
    color: var(--DarkColor);
    @include override-for-smaller-than(md-screen) {
      padding-left: 1.5rem;
      padding-right: 1.5rem;
    }

    ol {
      padding: 0;
      display: flex;
      gap: 2rem;
      flex-wrap: wrap;
      justify-content: center;
    }

    .top-right-buttons {
      position: absolute;
      top: 1.5rem;
      right: 1.5rem;

      button {
        all: initial;
        height: 2rem;
        padding: 0 0.5rem;
        border-radius: 1rem;
        font-family: inherit;
        text-align: center;
        line-height: 2rem;
        cursor: pointer;
        box-shadow:#00000080 0px 3px 6px;
        background-color: #fff;
      }
    }

    .sort-controls {
      padding: 1rem;
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      align-items: stretch;
      position: fixed;
      bottom: 4rem;
      left: 50%;
      transform: translateX(-50%);
      border-radius: 1rem;
      box-shadow:#00000080 0px 3px 10px;
      background-color: #fff;
      @include override-for-smaller-than(md-screen) {
        gap: 0.5rem;
        bottom: 3rem;
      }
      @include override-for-larger-than(md-screen) {
        select {
          font-size: 1.5rem;
        }
      }
    }
  }
</style>

<script>
  import { createEventDispatcher } from "svelte"
  import { blur } from "svelte/transition"

  import Summary from "./Summary.svelte"
  import { humanizeRuntime } from "$lib/util.js"

  const dispatch = createEventDispatcher()

  const sortModes = [
    // name: "Sort by" string
    // fetcher: function to fetch sort-comparable value
    // transformer: function to transform fetched value to UI-friendly
    {
      name: "Total runtime",
      fetcher: series => series.totalRuntime,
      transformer: value => humanizeRuntime(value)
    },
    {
      name: "Release year",
      fetcher: series => series.year,
      transformer: value => value
    },
    {
      name: "Number of seasons",
      fetcher: series => Object.keys(series.episodesBySeason || {}).length ?? undefined,
      transformer: value => `${value} season${value != 1 ? "s" : ""}`
    },
    {
      name: "Number of episodes",
      fetcher: series => Object.values(series.episodesBySeason || {}).reduce((total, season) => total += season.episodes.length, 0) ?? undefined,
      transformer: value => `${value} episode${value != 1 ? "s" : ""}`
    }
  ]

  export let selectedSeries

  let sortedSummaries = []
  let sortMode = sortModes[0]
  let sortAscending = true

  $: sortedSummaries = Object.values(selectedSeries).sort((l, r) => {
    const [a, b] = sortAscending ? [l, r] : [r, l]
    return sortMode.fetcher(a) - sortMode.fetcher(b)
  })
  $: if (!Object.keys(selectedSeries).length) {
    dispatch("closeCompareScreen")
  }
</script>

<section
  class="compare-screen"
  transition:blur={{ duration: 500, delay: 100, amount: 10 }}
>
  <div class="top-right-buttons">
    <button on:click={_ => {
      Object.values(selectedSeries).forEach(series => dispatch("deselectSeries", series.tvdbId))
      dispatch("closeCompareScreen")
    }}>Clear All</button>
    <button on:click={_ => dispatch("closeCompareScreen")}>Close ✖</button>
  </div>
  <ol>
    {#each sortedSummaries as series, rank}
      <Summary
        seriesMetadata={series}
        context={sortMode.transformer(sortMode.fetcher(series))}
        rank={rank + 1}
        on:deselectSeries
      />
    {/each}
  </ol>
  <form class="sort-controls">
    <label>
      Sort by
      <br/>
      <select bind:value={sortMode}>
        {#each sortModes as mode}
          <option value={mode}>{mode.name}</option>
        {/each}
      </select>
    </label>
    <label>
      Sort order
      <br/>
      <select bind:value={sortAscending}>
        <option value={true}>Ascending</option>
        <option value={false}>Descending</option>
      </select>
    </label>
  </form>
</section>