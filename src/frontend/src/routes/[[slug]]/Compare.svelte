<style lang="scss">
  .compare-screen {
    height: 100vh;
    width: 100vw;
    padding: 3rem;
    box-sizing: border-box;
    position: fixed;
    top: 0;
    left: 0;
    overflow-y: scroll;
    background-color: lightcoral;

    ol {
      padding: 0;
      display: flex;
      gap: 2rem;
      flex-wrap: wrap;
      justify-content: center;
    }

    .close-button {
      all: initial;
      height: 2rem;
      width: 2rem;
      border-radius: 50%;
      position: absolute;
      top: 1.5rem;
      right: 1.5rem;
      text-align: center;
      line-height: 2rem;
      cursor: pointer;
      background-color: #fff;
    }
  }
</style>

<script>
  import { createEventDispatcher } from "svelte"
  import { fly } from "svelte/transition"

  import Summary from "./Summary.svelte"

  const dispatch = createEventDispatcher()

  export let selectedSeries

  let sortedSummaries = []

  $: sortedSummaries = Object.values(selectedSeries).sort((l, r) => l.totalRuntime - r.totalRuntime)
</script>

<section
  class="compare-screen"
  in:fly={{ x: "100vw", duration: 500, delay: 100 }}
  out:fly={{ x: "100vw", duration: 500, delay: 100 }}
>
  <button class="close-button" on:click={_ => dispatch("closeCompareScreen")}>✖</button>
  <ol>
    {#each sortedSummaries as series, rank}
      <Summary seriesMetadata={series} rank={rank + 1}/>
    {/each}
  </ol>
</section>