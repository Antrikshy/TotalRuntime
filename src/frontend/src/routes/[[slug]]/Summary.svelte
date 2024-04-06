<style lang="scss">
  @import '../../lib/responsive.scss';

  .comparable-series-summary {
    height: 8rem;
    width: 30rem;
    position: relative;
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;
    list-style: none;
    border-radius: 1rem;
    box-shadow:#00000080 0px 3px 15px;
    background-color: #fff;
    @include override-for-smaller-than(md-screen) {
      font-size: smaller;
      height: 6rem;
    }

    .rank-indicator {
      min-width: 1.5rem;
      padding: 0.5rem;
      position: absolute;
      top: -1.5rem;
      left: -0.5rem;
      font-size: xx-large;
      text-align: center;
      border-radius: 0.5rem;
      box-shadow:#00000080 0px 3px 10px;
      color: #fff;
      background-color: var(--DarkColor);
      @include override-for-smaller-than(md-screen) {
        padding: 0.25rem;
        top: -1.25rem;
        left: -0.75rem;
        font-size: x-large;
      }
    }

    .close-button {
      all: initial;
      height: 2rem;
      width: 2rem;
      border-radius: 50%;
      position: absolute;
      top: -1rem;
      right: -1rem;
      text-align: center;
      line-height: 2rem;
      cursor: pointer;
      box-shadow:#00000080 0px 3px 10px;
      background-color: #fff;
      @include override-for-smaller-than(md-screen) {
        height: 1.5rem;
        width: 1.5rem;
        line-height: 1.5rem;
        top: -0.75rem;
        right: -0.75rem;
      }
    }

    .summary-text {
      padding: 0.5rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .poster {
      height: 100%;
      min-height: 100%;
      border-top-right-radius: 1rem;
      border-bottom-right-radius: 1rem;
    }
  }
</style>

<script>
  import { createEventDispatcher } from "svelte"

  const dispatch = createEventDispatcher()

  export let seriesMetadata
  export let context
  export let rank
</script>

<li class="comparable-series-summary">
  <strong class="rank-indicator">{rank}</strong>
  <button class="close-button" on:click={_ => dispatch("deselectSeries", seriesMetadata.tvdbId)}>✖</button>
  <div class="summary-text">
    <strong>{seriesMetadata.title}</strong>
    {context}
  </div>
  {#if seriesMetadata.thumbnail}
    <img src={seriesMetadata.thumbnail} class="poster" alt="Poster for {seriesMetadata.title} ({seriesMetadata.year})"/>
  {/if}
</li>