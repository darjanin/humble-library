const data = {};
const bundles = Object.values(data);

export const spendOnBundles = (bundles) =>
  bundles.reduce((total, bundle) => total + bundle.amount_spent, 0);

// {
//   machine_name: 'exploringarduino',
//   url: 'https://www.wiley.com/en-us/Exploring+Arduino%3A+Tools+and+Techniques+for+Engineering+Wizardry-p-x000650834',
//   downloads: [ [Object] ],
//   library_family_name: null,
//   payee: { human_name: 'Wiley', machine_name: 'wiley' },
//   human_name: 'Exploring Arduino: Tools and Techniques for Engineering Wizardry',
//   custom_download_page_box_css: null,
//   custom_download_page_box_html: null,
//   icon: 'https://hb.imgix.net/d3535c799cef7978dba8f4dc45806fc98116499a.png?auto=compress,format&s=9ee60c36624540da293280fe76837bd3'
// },
const allProducts = (bundles) =>
  bundles.reduce((acc, bundle) => [...acc, ...bundle.subproducts], []);

const parseDownloads = (downloads, machineName = "") => {
  return downloads.map((download) => ({
    machine_name: download.machine_name,
    platform: download.platform,
    urls: download.download_struct.map((ds) => ({
      urlWeb: ds.url ? ds.url.web : null,
      human_size: ds.human_size,
      file_size: ds.file_size || 0,
    })),
  }));
};

export const mappedProducts = (bundles) =>
  allProducts(bundles)
    .map(({ machine_name, human_name, downloads }) => ({
      machine_name,
      human_name: human_name.replace("/", "-"),
      downloads: parseDownloads(downloads, machine_name),
    }))
    .filter((product) => product.downloads.length > 0);

const print = (obj) => console.log(JSON.stringify(obj, null, 2));

const generateCurl = (download) => {
  return download.urls
    .map((urlObj) => {
      if (urlObj.urlWeb) {
        const pathname = new URL(urlObj.urlWeb).pathname;
        const filename = pathname.slice(pathname.lastIndexOf("/") + 1);
        return `# ${urlObj.human_size}\ncurl -o "${filename}" "${urlObj.urlWeb}"`;
      } else {
        return "# no link";
      }
    })
    .join("\n");
};

export const calculateTotalSize = (arr) => {
  return arr.reduce((total, product) => {
    return (
      total +
      product.downloads.reduce((subtotal, download) => {
        return (
          subtotal +
          download.urls.reduce((dt, d) => {
            return dt + d.file_size;
          }, 0)
        );
      }, 0)
    );
  }, 0);
};

export const generateShellScript = (arr) => {
  return (
    "# The file is generated by script.\n" +
    "# Making changes to it can lead to errors. \n" +
    "# Do it on your own risk. \n" +
    `# Total size is ${formatBytes(calculateTotalSize(arr))}\n` +
    "\ncd downloads\n" +
    arr
      .map(
        (product) =>
          `
mkdir "${product.human_name}"
cd "${product.human_name}"
echo "${product.human_name}"
${product.downloads.map(generateCurl).join("\n")}
cd ..
`
      )
      .join("") +
    "\ncd .."
  );
};

// https://stackoverflow.com/a/18650828
export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

function getAllPlatforms(arr) {
  return [
    ...new Set(
      arr.reduce(
        (acc, product) => [
          ...acc,
          ...product.downloads.map((download) => download.platform),
        ],
        []
      )
    ),
  ];
}

// First part of this function is not very nice to performance.
function filterByPlatform(arr, platform = "ebook") {
  return arr
    .reduce(
      (acc, product) => [
        ...acc,
        ...product.downloads.map((download) => ({
          ...download,
          human_name: product.human_name,
        })),
      ],
      []
    )
    .filter((download) => download.platform === platform);
  // .map((product) => product.human_name);
}

// console.log(formatBytes(calculateTotalSize(mappedProducts)));

// console.log(generateShellScript(mappedProducts));

function moveShellScript(arr) {
  return arr.map(
    (download) =>
      `mv "${download.human_name}" "${download.platform}/${download.human_name}"`
  );
}

function createFoldersForPlatforms(platforms) {
  return platforms.map((platform) => `mkdir "${platform}"`).join("\n");
}

// const platforms = ["video"];
// console.log(platforms);
// const moveFoldersScript =
//   createFoldersForPlatforms(platforms) +
//   "\n" +
//   platforms
//     .reduce(
//       (acc, platform) => [
//         ...acc,
//         ...moveShellScript(filterByPlatform(mappedProducts(bundles), platform)),
//       ],
//       []
//     )
//     .join("\n");
// console.log(moveFoldersScript);
// console.log(filterByPlatform(mappedProducts));
