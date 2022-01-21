<script>
  import { onMount } from "svelte";
  import Card from "./Card.svelte";

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
</script>

<main>
  <h1>Humble Bundle Library with {bundles.length} bundles</h1>
  <div class="bundles">
    {#each bundles as bundle}
      <Card {bundle} />
    {/each}
  </div>
</main>

<style>
  main {
    padding: 1em;
    /* max-width: 240px; */
    /* margin: 0 auto; */
  }

  h1 {
    text-align: center;
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
  }
</style>
