import program from "commander";
import { generateCsv } from "./csv";
import { Faculty } from "./models";
import { fetchFaculties } from "./runner";

import { description, version } from "../package.json";

program
  .version(version)
  .description(description)
  .option("-f, --faculties", "Scrape faculties")
  .parse(process.argv);

async function run() {
  if (program.faculties) {
    const faculties: Faculty[] = await fetchFaculties();

    const csv = await generateCsv(faculties);
    console.log(csv);
  }

  if (!program.faculties) {
    program.help();
  }
}

run();
