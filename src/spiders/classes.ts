import * as cheerio from "cheerio";
import { URLSearchParams } from "url";
import { Class, Course } from "../models";

export function scrapeClasses(html: string, courseId: Course["id"]): Class[] {
  const $ = cheerio.load(html);

  return ($("table.tabela > tbody > tr.d > td a")
    .map((_, elem) => {
      const className = $(elem).text();
      const href = $(elem).attr("href");

      const searchPart = href.substring(href.indexOf("?") + 1);

      const queryParams = new URLSearchParams(searchPart);

      return {
        id: parseInt(queryParams.get("pv_turma_id") as string, 10),
        className,
        courseId
      };
    })
    .get() as any) as Class[];
}
