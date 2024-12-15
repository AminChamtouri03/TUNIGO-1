interface WikipediaConfig {
  lang?: string;
  title: string;
}

function getWikipediaApiUrl(lang: string = "en") {
  return `https://${lang}.wikipedia.org/w/api.php`;
}

export async function getWikipediaInfo({
  lang = "en",
  title,
}: WikipediaConfig) {
  try {
    const formattedTitle = title.replace(/ /g, "_");

    // First get the page info and extract
    const summaryUrl = new URL(getWikipediaApiUrl(lang));
    summaryUrl.search = new URLSearchParams({
      action: "query",
      format: "json",
      titles: formattedTitle,
      prop: "extracts|pageimages|info",
      exintro: "true",
      explaintext: "true",
      inprop: "url",
      pithumbsize: "1000",
      origin: "*",
    }).toString();

    const response = await fetch(summaryUrl.toString());
    if (!response.ok) throw new Error("Wikipedia article not found");

    const data = await response.json();
    const page = Object.values(data.query.pages)[0] as any;

    // Then get all images
    const imagesUrl = new URL(getWikipediaApiUrl(lang));
    imagesUrl.search = new URLSearchParams({
      action: "query",
      format: "json",
      titles: formattedTitle,
      prop: "images",
      imlimit: "50",
      origin: "*",
    }).toString();

    const imagesResponse = await fetch(imagesUrl.toString());
    const imagesData = await imagesResponse.json();
    const imagesPage = Object.values(imagesData.query.pages)[0] as any;

    // Filter and get actual image URLs
    const imagesList = (imagesPage.images || [])
      .filter((img: any) => {
        const title = img.title.toLowerCase();
        return (
          title.endsWith(".jpg") ||
          title.endsWith(".jpeg") ||
          title.endsWith(".png")
        );
      })
      .slice(0, 5);

    const imageUrls = [];
    if (imagesList.length > 0) {
      const fileUrl = new URL(getWikipediaApiUrl(lang));
      fileUrl.search = new URLSearchParams({
        action: "query",
        format: "json",
        titles: imagesList.map((img: any) => img.title).join("|"),
        prop: "imageinfo",
        iiprop: "url",
        origin: "*",
      }).toString();

      const fileResponse = await fetch(fileUrl.toString());
      const fileData = await fileResponse.json();
      const filePages = Object.values(fileData.query.pages);

      imageUrls.push(
        ...filePages
          .filter((p: any) => p.imageinfo)
          .map((p: any) => p.imageinfo[0].url),
      );
    }

    return {
      extract: page.extract,
      thumbnail: page.thumbnail?.source || imageUrls[0],
      url: page.fullurl,
      additionalImages: imageUrls.slice(1),
    };
  } catch (error) {
    console.error("Error fetching Wikipedia data:", error);
    return null;
  }
}
