import program from "commander";
import { generateCsv } from "./csv";
import { Faculty } from "./models";
import { fetchFaculties } from "./runner";

import { description, version } from "../package.json";

program.version(version).description(description);

program
  .command("faculties")
  .description("scrape faculties")
  .action(async () => {
    const faculties: Faculty[] = await fetchFaculties();

    const csv = await generateCsv(faculties);
    console.log(csv);
  });

program.on("command:*", () => {
  console.error(
    ` Invalid command: ${program.args.join(
      " "
    )}\nSee --help for a list of available commands.`
  );
  process.exit(1);
});

if (process.argv.length <= 2) {
  program.help();
}

program.parse(process.argv);
