import "server-only";
import Parser from "rss-parser";

const parser = new Parser();

export async function fetchBlogFeed() {
    return parser.parseURL("https://blog.virajnikam.in/rss.xml");
}
