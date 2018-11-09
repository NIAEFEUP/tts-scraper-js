import { fetch, login } from "./fetcher";
import {
  Class,
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
import { flatten } from "./utils";

export async function fetchFaculties(): Promise<Faculty[]> {
  const url = generateFacultyUrl();

  const html = await fetch(url);

  return scrapeFaculties(html);
}

async function fetchCoursesByType(
  facultyAcronym: Faculty["acronym"],
  courseType: CourseType,
  year: number
): Promise<IncompleteCourse[]> {
  const url = generateCoursesUrl(facultyAcronym, courseType, year);

  const html = await fetch(url);

  return scrapeCourses(html, facultyAcronym);
}

async function fetchCourseInfo(
  facultyAcronym: Faculty["acronym"],
  referer: IncompleteCourse,
  year: number
): Promise<Course | null> {
  const url = generateCourseUrl(facultyAcronym, referer.id, year);

  const html = await fetch(url);

  return scrapeCourse(html, referer);
}

export async function fetchCourses(
  facultyAcronym: Faculty["acronym"],
  year: number
): Promise<Course[]> {
  const courseTypes: CourseType[] = ["MI", "M", "L", "D"];

  const coursesPromises: Array<Promise<IncompleteCourse[]>> = courseTypes.map(
    courseType => fetchCoursesByType(facultyAcronym, courseType, year)
  );

  const incompleteCourses: IncompleteCourse[] = flatten(
    await Promise.all(coursesPromises)
  );

  const courseInfoPromises = incompleteCourses.map(c =>
    fetchCourseInfo(facultyAcronym, c, year)
  );

  const result: Array<Course | null> = await Promise.all(courseInfoPromises);

  return result.filter((c): c is Course => c !== null);
}

export async function fetchCourseUnits(
  facultyAcronym: Faculty["acronym"],
  courseId: Course["id"],
  year: number,
  period: Period
): Promise<CourseUnit[]> {
  let url = generateCourseUnitSearchUrl(
    facultyAcronym,
    courseId,
    year,
    period,
    1
  );

  const html = await fetch(url);
  const { courseUnitIds, lastPage }: CourseUnitSearch = scrapeSearchPages(html);

  for (let i = 2; i <= lastPage; i++) {
    url = generateCourseUnitSearchUrl(
      facultyAcronym,
      courseId,
      year,
      period,
      i
    );

    const { courseUnitIds: ids }: CourseUnitSearch = scrapeSearchPages(
      await fetch(url)
    );

    courseUnitIds.push(...ids);
  }

  const results: Array<CourseUnit | null> = await Promise.all(
    courseUnitIds.map(async id => {
      const uri = generateCourseUnitInfoUrl(facultyAcronym, id);
      return scrapeCourseUnitInfo(await fetch(uri), courseId, id);
    })
  );

  return results.filter(cu => cu !== null) as CourseUnit[];
}

export async function fetchClasses(
  facultyAcronym: Faculty["acronym"],
  courseId: number,
  year: number,
  periodId: Period
): Promise<Class[]> {
  const url = generateClassesUrl(facultyAcronym, courseId, year, periodId);

  const html = await fetch(url, { cookieNeeded: true });

  return scrapeClasses(html);
}

export async function fetchClassesSchedule(
  facultyAcronym: Faculty["acronym"],
  year: number,
  periodId: Period,
  classId: Class["id"]
) {
  const url = generateClassScheduleUrl(facultyAcronym, year, periodId, classId);

  const html = await fetch(url, { cookieNeeded: true });

  return scrapeSchedule(html);
}
