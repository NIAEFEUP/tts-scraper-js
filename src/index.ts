import program from "commander";
import { isArray, isNumber, isString } from "util";
import { description, version } from "../package.json";
import { generateCsv } from "./csv";
import { login } from "./fetcher";
import { Class, Course, CourseUnit, Faculty, Lesson } from "./models";
import {
  fetchClasses,
  fetchClassesSchedule,
  fetchCourses,
  fetchCourseUnits,
  fetchFaculties
} from "./runner";
import { flatten, parseIntegerList, parseList, readPassword } from "./utils";

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

program
  .command("course-units")
  .description("scrape course units")
  .option(
    "-f, --faculty <acronym>",
    "lower case faculty acronym where the courses belong to, e.g.: feup"
  )
  .option(
    "-c, --courses <course-ids>",
    "comma-separated array of courses's ids, e.g.: 213,214,215",
    parseIntegerList
  )
  .option(
    "-y, --year <year>",
    "School year, e.g. for 2017/18, the year is 2017.",
    parseInt
  )
  .option(
    "-p --period <period>",
    "School period, eg. 1 for annual, 2 for first semester, 3 for second semester",
    parseInt
  )
  .action(async options => {
    if (!isString(options.faculty)) {
      console.error(`Invalid command: 'faculty' must be a string`);

      process.exit(1);
    }

    if (!isArray(options.courses) || !options.courses.every(Number.isInteger)) {
      console.error(`Invalid command: 'courses' must be an array of integers`);

      process.exit(1);
    }

    if (!isNumber(options.year) || options.year < 0) {
      console.error(`Invalid command: 'year' must be a number`);

      process.exit(1);
    }

    if (!isNumber(options.period) || options.period < 1 || options.period > 3) {
      console.error(
        `Invalid command: 'period' must be a number between 1 and 3`
      );

      process.exit(1);
    }

    const promises: Array<Promise<CourseUnit[]>> = options.courses.map(
      (courseId: number) =>
        fetchCourseUnits(
          options.faculty,
          courseId,
          options.year,
          options.period
        )
    );

    const courseUnitsPerCourse = await Promise.all(promises);

    const courseUnits: CourseUnit[] = flatten(courseUnitsPerCourse);

    console.log(await generateCsv(courseUnits));
  });

program
  .command("classes")
  .description("scrape classes")
  .option(
    "-f, --faculty <acronym>",
    "lower case faculty acronym where the courses belong to, e.g.: feup"
  )
  .option(
    "-c, --courses <course-ids>",
    "comma-separated array of courses's ids, e.g.: 213,214,215",
    parseIntegerList
  )
  .option(
    "-y, --year <year>",
    "school year, e.g. for 2017/18, the year is 2017.",
    parseInt
  )
  .option(
    "-p --period <period>",
    "school period, eg. 1 for annual, 2 for first semester, 3 for second semester",
    parseInt
  )
  .option(
    "-u, --username <username>",
    "username used to login in sigarra, e.g.: up201859432"
  )
  .action(async options => {
    if (!isString(options.faculty)) {
      console.error(`Invalid command: 'faculty' must be a string`);

      process.exit(1);
    }

    if (!isArray(options.courses) || !options.courses.every(Number.isInteger)) {
      console.error(`Invalid command: 'courses' must be an array of integers`);

      process.exit(1);
    }

    if (!isNumber(options.year) || options.year < 0) {
      console.error(`Invalid command: 'year' must be a number`);

      process.exit(1);
    }

    if (!isNumber(options.period) || options.period < 1 || options.period > 3) {
      console.error(
        `Invalid command: 'period' must be a number between 1 and 3`
      );

      process.exit(1);
    }

    if (!isString(options.username)) {
      console.error(`Invalid command: 'username' must be a string`);

      process.exit(1);
    }

    await login(options.username, await readPassword());

    const promises: Array<Promise<Class[]>> = options.courses.map(
      (courseId: number) =>
        fetchClasses(options.faculty, courseId, options.year, options.period)
    );

    const classesPerCourse = await Promise.all(promises);

    const classes: Class[] = flatten(classesPerCourse);

    console.log(await generateCsv(classes));
  });

program
  .command("schedules")
  .description("scrape schedules")
  .option(
    "-f, --faculty <acronym>",
    "lower case faculty acronym where the courses belong to, e.g.: feup"
  )
  .option(
    "-c, --classes <classes-ids>",
    "comma-separated array of classes' ids, e.g.: 213,214,215",
    parseIntegerList
  )
  .option(
    "-y, --year <year>",
    "school year, e.g. for 2017/18, the year is 2017.",
    parseInt
  )
  .option(
    "-p --period <period>",
    "school period, eg. 1 for annual, 2 for first semester, 3 for second semester",
    parseInt
  )
  .option(
    "-u, --username <username>",
    "username used to login in sigarra, e.g.: up201859432"
  )
  .action(async options => {
    if (!isString(options.faculty)) {
      console.error(`Invalid command: 'faculty' must be a string`);

      process.exit(1);
    }

    if (!isArray(options.classes) || !options.classes.every(Number.isInteger)) {
      console.error(`Invalid command: 'classes' must be an array of integers`);

      process.exit(1);
    }

    if (!isNumber(options.year) || options.year < 0) {
      console.error(`Invalid command: 'year' must be a number`);

      process.exit(1);
    }

    if (!isNumber(options.period) || options.period < 1 || options.period > 3) {
      console.error(
        `Invalid command: 'period' must be a number between 1 and 3`
      );

      process.exit(1);
    }

    if (!isString(options.username)) {
      console.error(`Invalid command: 'username' must be a string`);

      process.exit(1);
    }

    await login(options.username, await readPassword());

    const promises: Array<Promise<Lesson[]>> = options.classes.map(
      (classId: number) =>
        fetchClassesSchedule(
          options.faculty,
          options.year,
          options.period,
          classId
        )
    );

    const lessonsPerClass = await Promise.all(promises);

    const lessons: Lesson[] = flatten(lessonsPerClass);

    console.log(await generateCsv(lessons));
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
