/**
 * Models representing scraped entities
 */

export interface Faculty {
  acronym: string;
  name: string;
}

export interface IncompleteCourse {
  facultyAcronym: string;
  id: number;
  year: number;
}

export interface Course extends IncompleteCourse {
  acronym: string;
  name: string;
  planId: number;
}

export interface Class {
  id: number;
  className: string;
  courseId: number;
}

export interface CourseUnit {
  id: number;
  acronym: string;
  name: string;
  courseYear: number;
  courseId: number;
  year: number;
  semesters: Period[];
}

export interface CourseUnitSearch {
  currentPage: number;
  lastPage: number;
  courseUnitIds: number[];
}

export interface IncompleteLesson {
  lessonType: LessonType;
  className: string;
  room: string;
  professor: string;
}

export interface Lesson extends IncompleteLesson {
  courseUnitId: CourseUnit["id"];
  dayOfTheWeek: number;
  startTime: number;
  duration: number;
}

export type LessonType = "TP" | "T" | string;

/**
 * MI: Integrated Master's Degree (Mestrado Integrado)
 * M: Master's Degree (Mestrado)
 * L: Bachelor's Degree (Licenciatura)
 * D: PhD (Doutoramento)
 */
export type CourseType = "MI" | "M" | "L" | "D";

/** @param 1 for annual, 2 for first semester, 3 for second semester */
export enum Period {
  ANNUAL = 1,
  FIRST_SEMESTER = 2,
  SECOND_SEMESTER = 3
}
