# UPorto Timetable Scraper

CLI tool for University of Porto Information System (SIGARRA) that scrapes the timetables for every course in the system.
This is a new version of the [old Python scraper](https://github.com/NIAEFEUP/uporto-timetable-scrapper/) aiming to be easier to maintain and update.
In order to achieve this, the project uses TypeScript to provide type annotations while keeping a syntax similar to JavaScript, has an extensive test suite to avoid regressions and allow for a better understanding of the code.

## Help

```
Usage:  [options] [command]

CLI tool for scraping timetable on University of Porto's Information System (SIGARRA), outputting the results as comma-separated values (CSV).

Options:

  -V, --version  output the version number
  -h, --help     output usage information

Commands:

  faculties      scrape faculties
```

## Running 

To scrape faculties and output to `stdout`, run `npm start --silent -- faculties`. 

To scrape faculties and save the result to a file named `faculties.csv` inside the `results` directory, run `npm start --silent -- faculties > results/faculties.csv`.

Note: The result is output as CSV to `stdout`.

### Tests

To run tests once, execute `npm test`.
To run tests and rerun them on file changes, run `npm test -- --watch`.

### Examples 

#### Scrape faculties and output to stdout
```bash
$ npm start --silent -- faculties
acronym,name
faup,Faculdade de Arquitetura (FAUP)
fbaup,Faculdade de Belas Artes (FBAUP)
fcup,Faculdade de Ciências (FCUP)
fcnaup,Faculdade de Ciências da Nutrição e da Alimentação (FCNAUP)
fadeup,Faculdade de Desporto (FADEUP)
fdup,Faculdade de Direito (FDUP)
fep,Faculdade de Economia (FEP)
feup,Faculdade de Engenharia (FEUP)
ffup,Faculdade de Farmácia (FFUP)
flup,Faculdade de Letras (FLUP)
fmup,Faculdade de Medicina (FMUP)
fmdup,Faculdade de Medicina Dentária (FMDUP)
fpceup,Faculdade de Psicologia e de Ciências da Educação (FPCEUP)
icbas,Instituto de Ciências Biomédicas Abel Salazar (ICBAS)
pbs,Porto Business School

```

Note: the output will always have a newline at the end.

## Scraping Flow

The scraping flow is as follows:
1. Scrape faculties
1. Given a year: for each faculty, scrape its courses
1. Given a year and a period: for each course:
   1. scrape its course units
   1. scrape its classes
       1. for each class, scrape its schedule
    
Note: Steps 3.i. and 3.ii. can be run in parallel as they only depend on a course.

## Notes about SIGARRA Database
* A year represents the lowest number of a school year (e.g.: `2017` represents `2017/2018`);
* Faculties are indexed by their acronym (`feup`, `fcup`, etc.);
* Courses are identified by a course id and year;
* Course units are identified by a single id. Each year the id changes, even though its name and acronym may be the same
* Schedules are identified by the course unit id. 
