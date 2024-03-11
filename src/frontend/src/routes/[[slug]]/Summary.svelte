<style lang="scss">
  .comparable-series-summary {
    height: 8rem;
    width: 30rem;
    padding: 1rem;
    list-style: none;
    border-radius: 1rem;
    background-color: #fff;

    .poster {
      height: 100%;

    }
  }
</style>

<script>
  import { humanizeRuntime } from "$lib/util.js"

  export let seriesMetadata
  export let rank
</script>

<li class="comparable-series-summary">
  {rank}
  <heading>{seriesMetadata.title}</heading>
  <img src={seriesMetadata.thumbnail} class="poster" alt="Poster for {seriesMetadata.title} ({seriesMetadata.year})"/>
  {humanizeRuntime(seriesMetadata.totalRuntime)}
</li>