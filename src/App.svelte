<script>
  import { onMount } from "svelte";
  import Card from "./Card.svelte";
  import {
    formatBytes,
    calculateTotalSize,
    mappedProducts,
    generateShellScript,
  } from "./util";

  let bundles = [];

  onMount(async () => {
    let response = await fetch("/library.json");
    bundles = Object.values(await response.json()).map((value) => value);
    response = await fetch("/library2.json");
    bundles = [
      ...bundles,
      ...Object.values(await response.json()).map((value) => value),
    ];
  });

  let totalSize = 0;

  $: totalSize = formatBytes(calculateTotalSize(mappedProducts(bundles)));
</script>

<main>
  <h1>
    Humble Bundle Library with {bundles.length} bundles
  </h1>
  <p class="headline">
    Total size of downloadable content is {totalSize}.
  </p>
  <div class="bundles">
    {#each bundles as bundle}
      <Card {bundle} />
    {/each}
  </div>
  <!-- 
  <h2>Your download script</h2>
  <pre>{generateShellScript(mappedProducts(bundles))}</pre> -->
</main>

<style>
  main {
    padding: 1em;
  }

  h1 {
    text-align: center;
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
    margin-bottom: 1rem;
  }

  .headline {
    text-align: center;
    color: #757575;
  }

  pre {
    max-height: 500px;
    overflow-x: auto;
  }

  @media (min-width: 640px) {
  }
</style>
