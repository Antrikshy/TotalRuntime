<style lang="scss">
  .comparable-series-summary {
    height: 8rem;
    width: 30rem;
    position: relative;
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;
    list-style: none;
    border-radius: 1rem;
    background-color: #fff;

    .rank-indicator {
      min-width: 1.5rem;
      padding: 0.5rem;
      position: absolute;
      top: -1.5rem;
      left: -0.5rem;
      font-size: xx-large;
      text-align: center;
      border-radius: 0.5rem;
      color: #fff;
      background-color: #000;
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
  import { humanizeRuntime } from "$lib/util.js"

  export let seriesMetadata
  export let rank
</script>

<li class="comparable-series-summary">
  <strong class="rank-indicator">{rank}</strong>
  <div class="summary-text">
    <strong>{seriesMetadata.title}</strong>
    {humanizeRuntime(seriesMetadata.totalRuntime)}
  </div>
  <img src={seriesMetadata.thumbnail} class="poster" alt="Poster for {seriesMetadata.title} ({seriesMetadata.year})"/>
</li>