# UPorto Timetable Scraper

CLI tool for University of Porto Information System (SIGARRA) that scrapes the timetables for every course in the system.
This is a new version of the [old Python scraper](https://github.com/NIAEFEUP/uporto-timetable-scrapper/) aiming to be easier to maintain and update.
In order to achieve this, the project uses TypeScript to provide type annotations while keeping a syntax similar to JavaScript, has an extensive test suite to avoid regressions and allow for a better understanding of the code.

## Help

```
Usage:  [options] [command]

Timetable scraper for University of Porto's Information System (SIGARRA)

Options:

  -V, --version  output the version number
  -h, --help     output usage information

Commands:

  faculties      scrape faculties
```

## Running 

The tool is supposed to output the result to `stdout`. This allows for composition, such as piping into a file.

To scrape faculties, run `npm start --silent -- -f`. 

To scrape faculties and save the result to a file named `faculties.csv` inside the `results` directory, run `npm start --silent -- -f > results/faculties.csv`.

### Tests

To run the tests, execute `npm test`.

### Notes about SIGARRA Database
* A year represents the lowest number of a school year (e.g.: `2017` represents `2017/2018`);
* Faculties are indexed by their acronym (`feup`, `fcup`, etc.);
* Courses are identified by a course id and year;
* Course units are identified by a single id. Each year the id changes, even though its name and acronym may be the same
* Schedules are identified by the course unit id. 
