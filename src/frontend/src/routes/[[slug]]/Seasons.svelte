<style lang="scss">
  @use '../../lib/responsive.scss' as *;

  .season {
    min-height: 5rem;
    margin: 0.5rem 0;
    display: grid;
    grid-template-columns: 17rem auto;
    gap: 1rem;
    color: var(--MutedTextColor);
    @include override-for-smaller-than(md-screen) {
      gap: 1rem;
      grid-template-columns: unset;
      grid-template-rows: auto auto;
      &:not(:last-child) {
        padding-bottom: 1rem;
        border-bottom: 2px solid var(--MutedTextColor);
      }
    }

    .season-summary {
      font-size: 1.3rem;
      line-height: 1.5rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      @include override-for-smaller-than(md-screen) {
        text-align: center;
        font-size: 1rem;
        line-height: 1.2rem;
      }

      big {
        font-weight: bold;
      }
    }

    .episode-list {
      padding-right: 10%;
      display: flex;
      gap: 0.5rem;
      font-size: 1.15rem;
      line-height: 1.5rem;
      overflow: scroll hidden;
      align-items: center;
      mask-image: linear-gradient(90deg, #000 90%, transparent 100%);
      scrollbar-width: thin;
      scrollbar-color: var(--MutedTextColor) var(--Muted);
      @include override-for-smaller-than(md-screen) {
        gap: 0.15rem;
        font-size: 0.85rem;
        line-height: 1.15rem;
      }

      .episode {
        min-width: 8rem;
        @include override-for-smaller-than(md-screen) {
          min-width: 5.5rem;
        }

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

  import { tooltip } from "@svelte-plugins/tooltips";

  export let activeSeriesEpisodesBySeason
</script>

{#each Object.entries(activeSeriesEpisodesBySeason) as [seasonNum, season]}
  <div class="season">
    <summary class="season-summary">
      <div><big>Season {seasonNum}</big></div>
      <div><small>
        {humanizeRuntime(season.totalRuntime)}{#if season.runtimeWasImputed}
          <span class="help-text" tabindex="-1" title="This season's runtime had gaps that were filled in with approximation." use:tooltip={{animation: "slide"}}>*</span>
        {/if}
      </small></div>
      <div><small>{season.episodes.length} {`episode${season.episodes.length == 1 ? "" : "s"}`}</small></div>
    </summary>
    <div class="episode-list">
      {#each Object.values(season.episodes) as episode}
        <div class="episode">
          <strong>Episode {episode.episode}</strong>
          <br/>
          {#if episode.runtime}
            <span class={episode.runtimeQuality != "fetchedRaw" ? "low-quality-runtime" : ""}>
              {episode.runtime} minutes{#if episode.runtimeQuality == "fetchedAverage"}
                <sup class="help-text" tabindex="-1" title="Inferred from official series average runtime, as episode runtime was unavailable." use:tooltip={{position: "left", animation: "slide"}}>1</sup>
              {:else if episode.runtimeQuality == "computedAverage"}
                <sup class="help-text" tabindex="-1" title="Computed median runtime for season, as episode runtime and official series average were unavailable." use:tooltip={{position: "left", animation: "slide"}}>2</sup>
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