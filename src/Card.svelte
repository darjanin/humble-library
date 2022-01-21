<script>
  export let bundle = {};

  function getPlatforms(subproduct) {
    return subproduct.downloads.reduce(
      (acc, download) => [...acc, download.platform],
      []
    );
  }

  function hasSomeDownload(bundle) {
    return bundle.subproducts.some(
      (subproduct) => subproduct.downloads.length > 0
    );
  }

  const icons = {
    windows: "🪟",
    mac: "🍎",
    linux: "🐧",
    ebook: "📖",
    video: "🎥",
    audio: "🎶",
  };
</script>

{#if bundle && bundle.subproducts.length > 0 && hasSomeDownload(bundle)}
  <div>
    <h2>{bundle.product.human_name} ({bundle.subproducts.length})</h2>
    <p />
    <ul>
      {#each bundle.subproducts as subproduct}
        {#if subproduct.downloads.length > 0 && !getPlatforms(subproduct).includes("asmjs")}
          <li>
            <a href={subproduct.url}>
              {#if subproduct.icon}
                <img src={subproduct.icon} alt="" />
              {:else}
                <span>
                  {subproduct.machine_name}
                </span>
              {/if}
            </a>
            <p>
              {#each getPlatforms(subproduct) as platform}
                {icons[platform]}
              {/each}
            </p>
          </li>
        {/if}
      {/each}
    </ul>

    <!-- <pre>
      {JSON.stringify(bundle, null, 2)}
    </pre> -->
  </div>
{/if}

<style>
  div {
    /* border: 1px solid #dadada; */
    /* border-radius: 0.25rem; */
    padding: 0.25rem;
    border-bottom: 1px solid #eaeaea;
  }

  h2 {
    font-size: 1.5rem;
    font-weight: 500;
    /* text-align: center; */
    padding-left: 1rem;
  }

  pre {
    text-align: left;
    max-width: 400px;
    overflow-y: auto;
  }

  ul {
    list-style: none;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    text-align: center;
  }

  li {
    width: 100px;
    height: 150px;
  }

  span {
    word-break: break-all;
    max-width: 100px;
    display: block;
  }

  img {
    width: 100%;
  }
</style>
