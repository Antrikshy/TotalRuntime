<style lang="scss">
  .season {
    min-height: 5rem;
    margin: 1rem 0;
    display: grid;
    grid-template-columns: 1fr 3fr;
    color: var(--MutedTextColor);

    .season-summary {
      font-size: 1.5rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .episode-list {
      padding-right: 10%;
      display: flex;
      gap: 1rem;
      font-size: 1.2rem;
      overflow-x: scroll;
      align-items: center;
      mask-image: linear-gradient(90deg, #000 90%, transparent 100%);

      .episode {
        min-width: 8rem;

        .low-quality-runtime {
          text-decoration: underline;
          text-decoration-style: dashed;
        }
      }
    }
  }
</style>

<script>
  import { humanizeRuntime } from "$lib/util.js"

  export let activeSeriesEpisodesBySeason
</script>

{#each Object.entries(activeSeriesEpisodesBySeason) as [seasonNum, season]}
  <div class="season">
    <summary class="season-summary">
      <div><big>Season {seasonNum}</big></div>
      <div><small>
        {humanizeRuntime(season.totalRuntime)}{#if season.runtimeWasImputed}
          <span class="help-text" title="This season's runtime had gaps that were filled in with approximation.">*</span>
        {/if}
      </small></div>
      <div><small>{season.episodes.length} episodes</small></div>
    </summary>
    <div class="episode-list">
      {#each Object.values(season.episodes) as episode}
        <div class="episode">
          <strong>Episode {episode.episode}</strong>
          <br/>
          {#if episode.runtime}
            <span class={episode.runtimeQuality != "fetchedRaw" ? "low-quality-runtime" : ""}>
              {episode.runtime} minutes{#if episode.runtimeQuality == "fetchedAverage"}
                <sup class="help-text" title="Inferred from official series average runtime, as episode runtime was unavailable.">1</sup>
              {:else if episode.runtimeQuality == "computedAverage"}
                <sup class="help-text" title="Computed median runtime for season, as episode runtime and official series average were unavailable.">2</sup>
              {/if}
            </span>
          {:else}
            (missing runtime)
          {/if}
        </div>
      {/each}
    </div>
  </div>
{/each}