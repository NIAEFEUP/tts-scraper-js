// tslint:disable-next-line no-var-requires
const querystring = require("querystring");
// tslint:disable-next-line no-var-requires
const assert = require("assert");
import * as cheerio from "cheerio";
import { IncompleteLesson, Lesson } from "../models";

function scrapeLesson(
  $: CheerioStatic,
  lessonElem: CheerioElement
): IncompleteLesson {
  let lessonType = $(lessonElem)
    .find("b")
    .text();

  // Lesson type is something like "AOCO (TP)" and we want to obtain the "TP" part
  lessonType = lessonType
    .replace(")", "")
    .substring(lessonType.indexOf("(") + 1);

  const clazz = $(lessonElem).find("span > a");
  const className = $(clazz).text();

  const table = $(lessonElem).find("table > tbody > tr");
  const room = $(table)
    .find("td > a")
    .text();
  const professor = $(table)
    .find("td.textod a")
    .text();

  return {
    lessonType,
    className,
    room,
    professor
  };
}

// This array represents the rowspans left in the current row
// It is used because when a row has rowspan > 1, the table
// will seem to be missing a column and can cause out of sync errors
// between the HTML table and its memory representation
/**
 * Scrapes a schedule row
 * @param $ cheerio
 * @param rows all rows but the header
 * @param rowspans a 6 dimension array that stores the rowspan of the column, decremented every iteration.
 * @param rowIndex current row index in the rows array. Also used for calculating class start time.
 * @return {*}
 */
function scrapeRow(
  $: CheerioStatic,
  rows: Cheerio,
  rowspans = [0, 0, 0, 0, 0, 0],
  rowIndex = 0
): Lesson[] {
  if (rows.length === rowIndex) {
    return [];
  }

  const classes = [];

  // First column is the time, so must be removed.
  const columns = $(rows[rowIndex])
    .children("td")
    .slice(1);

  const newRowspans = [];
  const DAYS_OF_WEEK = 6; // 0 -> Monday, 1 -> Tuesday, ..., 5 -> Saturday (No sunday)
  let currentColumn = 0;
  for (let i = 0; i < DAYS_OF_WEEK; i += 1) {
    newRowspans[i] = Math.max(0, rowspans[i] - 1);

    if (newRowspans[i] === 0) {
      const column = columns[currentColumn];

      const rowspan = parseInt($(column).attr("rowspan"), 10);

      // The rowspan indicates how much time a class takes
      // If there is no rowspan, it means it is a blank cell
      if (rowspan > 0) {
        const href = $(column)
          .find("b > acronym > a")
          .attr("href");

        const queryString = querystring.parse(
          href.substring(href.indexOf("?") + 1)
        );

        const courseUnitId = parseInt(queryString.pv_ocorrencia_id, 10);

        // Every lesson must have a course unit id
        assert(!isNaN(courseUnitId));

        newRowspans[i] = rowspan;
        classes.push({
          courseUnitId,
          dayOfTheWeek: i,
          startTime: 8 + rowIndex / 2,
          duration: rowspan / 2.0,
          ...scrapeLesson($, column)
        });
      }

      currentColumn += 1;
    }
  }

  return classes.concat(scrapeRow($, rows, newRowspans, rowIndex + 1));
}

export function scrapeSchedule(html: string): Lesson[] {
  const $ = cheerio.load(html);

  if ($("div#erro > h2").text() === "Sem Resultados") {
    return [];
  }

  const schedule = $("table.horario > tbody");

  // The first tr is the days of the week, so must be removed.
  const rows: Cheerio = $(schedule)
    .children("tr")
    .slice(1);

  return scrapeRow($, rows);
}
