import { fetch } from "./fetcher";
import {
  Course,
  CourseType,
  CourseUnit,
  CourseUnitSearch,
  Faculty,
  IncompleteCourse,
  Period
} from "./models";
import { scrapeClasses } from "./spiders/classes";
import { scrapeCourse, scrapeCourses } from "./spiders/courses";
import { scrapeCourseUnitInfo, scrapeSearchPages } from "./spiders/courseUnits";
import { scrapeFaculties } from "./spiders/faculties";
import { scrapeSchedule } from "./spiders/schedule";
import {
  generateClassesUrl,
  generateClassScheduleUrl,
  generateCoursesUrl,
  generateCourseUnitInfoUrl,
  generateCourseUnitSearchUrl,
  generateCourseUrl,
  generateFacultyUrl
} from "./url-generator";

export async function fetchFaculties(): Promise<Faculty[]> {
  const url = generateFacultyUrl();

  const html = await fetch(url);

  return scrapeFaculties(html);
}

async function fetchCoursesByType(
  faculty: Faculty,
  courseType: CourseType,
  year: number
): Promise<IncompleteCourse[]> {
  const url = generateCoursesUrl(faculty.acronym, courseType, year);

  const html = await fetch(url);

  return scrapeCourses(html, faculty.acronym);
}

async function fetchCourseInfo(
  faculty: Faculty,
  referer: IncompleteCourse,
  year: number
) {
  const url = generateCourseUrl(faculty.acronym, referer.id, year);

  const html = await fetch(url);

  return scrapeCourse(html, referer);
}

async function fetchCourses(faculty: Faculty, year: number): Promise<Course[]> {
  const courseTypes: CourseType[] = ["MI", "M", "L", "D"];

  const coursesPromises: Array<Promise<IncompleteCourse[]>> = courseTypes.map(
    courseType => fetchCoursesByType(faculty, courseType, year)
  );

  const incompleteCourses: IncompleteCourse[] = ([] as IncompleteCourse[]).concat(
    ...(await Promise.all(coursesPromises))
  );

  const courseInfoPromises = incompleteCourses.map(c =>
    fetchCourseInfo(faculty, c, year)
  );

  return (await Promise.all(courseInfoPromises)).filter(
    c => c !== null
  ) as Course[];
}

async function fetchCourseUnits(
  faculty: Faculty,
  course: Course,
  year: number,
  periodId: Period
): Promise<CourseUnit[]> {
  let url = generateCourseUnitSearchUrl(
    faculty.acronym,
    course.id,
    year,
    periodId,
    1
  );
  const html = await fetch(url);
  const { courseUnitIds, lastPage }: CourseUnitSearch = scrapeSearchPages(html);

  for (let i = 2; i <= lastPage; i++) {
    url = generateCourseUnitSearchUrl(
      faculty.acronym,
      course.id,
      year,
      periodId,
      i
    );

    const { courseUnitIds: ids }: CourseUnitSearch = scrapeSearchPages(
      await fetch(url)
    );

    courseUnitIds.push(...ids);
  }

  const unitsUrls = courseUnitIds.map(id =>
    generateCourseUnitInfoUrl(faculty.acronym, id)
  );

  const results: Array<CourseUnit | null> = await Promise.all(
    unitsUrls.map(async uri => scrapeCourseUnitInfo(await fetch(uri), course))
  );

  return results.filter(cu => cu !== null) as CourseUnit[];
}

async function fetchClasses(
  faculty: Faculty,
  courseId: number,
  year: number,
  periodId: Period
) {
  const url = generateClassesUrl(faculty.acronym, courseId, year, periodId);

  const html = await fetch(url, { cookieNeeded: true });

  return scrapeClasses(html);
}

async function fetchClassesSchedule(
  faculty: Faculty,
  year: number,
  periodId: Period,
  classId: number
) {
  const url = generateClassScheduleUrl(
    faculty.acronym,
    year,
    periodId,
    classId
  );

  const html = await fetch(url, { cookieNeeded: true });

  return scrapeSchedule(html);
}
