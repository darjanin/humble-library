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
  let files;
  let copied = false;

  const tabs = ["library", "script"];
  let activeTab = "library";

  function copyShellScript() {
    const scriptTextarea = document.querySelector("#shellScript");
    scriptTextarea.select();
    document.execCommand("copy");
    copied = true;
    scriptTextarea.blur();
    setTimeout(() => {
      copied = false;
    }, 1000);
  }

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

  function readUploadedJson(files) {
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        bundles = Object.values(JSON.parse(event.target.result)).map(
          (value) => value
        );
      };
      reader.readAsText(files[0]);
    }
  }

  $: readUploadedJson(files);
</script>

<main>
  <h1>
    Humble Bundle Library with {bundles.length} bundles
  </h1>
  <p class="headline">
    Total size of downloadable content is {totalSize}.
  </p>
  <header>
    <input type="file" bind:files />
    <h2>{activeTab}</h2>
    <div>
      <button
        on:click={() => {
          activeTab = "library";
        }}>Library</button
      >
      <button
        on:click={() => {
          activeTab = "script";
        }}>Download Script</button
      >
    </div>
  </header>

  {#if activeTab === "library"}
    <div class="bundles">
      {#each bundles as bundle}
        <Card {bundle} />
      {/each}
    </div>
  {:else}
    <header>
      <h2>Your download script</h2>
      <button on:click={copyShellScript} disabled={copied}>
        {#if copied}
          Copied
        {:else}
          Copy to clipboard
        {/if}
      </button>
    </header>
    <textarea id="shellScript"
      >{generateShellScript(mappedProducts(bundles))}</textarea
    >
  {/if}
</main>

<style>
  main {
    padding: 1em;
  }

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
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

  textarea {
    height: 400px;
    width: 100%;
    font-family: monospace;
  }

  @media (min-width: 640px) {
  }
</style>
