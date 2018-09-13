import program from "commander";
import { isArray, isNumber } from "util";
import { description, version } from "../package.json";
import { generateCsv } from "./csv";
import { Course, Faculty } from "./models";
import { fetchCourses, fetchFaculties } from "./runner";
import { flatten, parseList } from "./utils";

program.version(version).description(description);

program
  .command("faculties")
  .description("scrape faculties")
  .action(async () => {
    const faculties: Faculty[] = await fetchFaculties();

    console.log(await generateCsv(faculties));
  });

program
  .command("courses")
  .description("scrape courses")
  .option(
    "-f, --faculties <acronyms>",
    "comma-separated array of lower case faculties' acronyms, e.g.: feup,faup,fep",
    parseList
  )
  .option(
    "-y, --year <year>",
    "School year, e.g. for 2017/18, the year is 2017.",
    parseInt
  )
  .action(async options => {
    if (!isArray(options.faculties)) {
      console.error(`Invalid command: 'faculties' must be an array`);

      process.exit(1);
    }

    if (!isNumber(options.year) || options.year < 0) {
      console.error(`Invalid command: 'year' must be a number`);

      process.exit(1);
    }

    const promises: Array<Promise<Course[]>> = options.faculties.map(
      (acronym: string) => fetchCourses(acronym, options.year)
    );

    const coursesPerFaculty = await Promise.all(promises);

    const courses: Course[] = flatten(coursesPerFaculty);

    console.log(await generateCsv(courses));
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
