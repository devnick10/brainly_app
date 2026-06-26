import * as cheerio from "cheerio";
import { Metadata } from ".";

export async function getArticleMetadata(url: string): Promise<Metadata> {
    const response = await fetch(url, {
        headers: {
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/137.0 Safari/537.36",
        },
    });

    const html = await response.text();

    // Parse Open Graph 
    const $ = cheerio.load(html);

    const title =
        $('meta[property="og:title"]').attr("content") ||
        $("title").text();

    const description =
        $('meta[property="og:description"]').attr("content") ||
        $('meta[name="description"]').attr("content");

    const image =
        $('meta[property="og:image"]').attr("content");

    const siteName =
        $('meta[property="og:site_name"]').attr("content");

    const author =
        $('meta[name="author"]').attr("content") ??
        $('meta[property="article:author"]').attr("content");

    console.log({
        title,
        description,
        image,
        siteName,
        author,
    });

    const searchableText = `${title} ${description || ""} ${author || ""} ${siteName || ""}`;
    return {
        title,
        description,
        searchableText,
        imageUrl: image,
        siteName,
        author: author || undefined,
    }
}