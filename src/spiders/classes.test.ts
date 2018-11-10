import fs from "fs";
import { Class } from "../models";
import { scrapeClasses } from "./classes";

const classes = fs.readFileSync("./examples/classes.html", "latin1").toString();

describe("classes", () => {
  test("are scraped correctly", () => {
    const courseId = 1;

    const expected: Class[] = [
      { className: "1MIEIC01", id: 207783, courseId },
      { className: "1MIEIC02", id: 207784, courseId },
      { className: "1MIEIC03", id: 207785, courseId },
      { className: "1MIEIC04", id: 207786, courseId },
      { className: "1MIEIC05", id: 207787, courseId },
      { className: "1MIEIC06", id: 207788, courseId },
      { className: "1MIEIC07", id: 207789, courseId },
      { className: "1MIEIC08", id: 207790, courseId },
      { className: "2MIEIC01", id: 207792, courseId },
      { className: "2MIEIC02", id: 207793, courseId },
      { className: "2MIEIC03", id: 207794, courseId },
      { className: "2MIEIC04", id: 207795, courseId },
      { className: "2MIEIC05", id: 207796, courseId },
      { className: "2MIEIC06", id: 207797, courseId },
      { className: "2MIEIC07", id: 207798, courseId },
      { className: "2MIEIC08", id: 207799, courseId },
      { className: "3MIEIC01", id: 207800, courseId },
      { className: "3MIEIC02", id: 207801, courseId },
      { className: "3MIEIC03", id: 207802, courseId },
      { className: "3MIEIC04", id: 207803, courseId },
      { className: "3MIEIC05", id: 207804, courseId },
      { className: "3MIEIC06", id: 207805, courseId },
      { className: "3MIEIC07", id: 207806, courseId },
      { className: "4MIEIC01", id: 207807, courseId },
      { className: "4MIEIC02", id: 207808, courseId },
      { className: "4MIEIC03", id: 207809, courseId },
      { className: "4MIEIC04", id: 207810, courseId },
      { className: "4MIEIC05", id: 207811, courseId },
      { className: "5MIEIC01", id: 207814, courseId },
      { className: "5MIEIC02", id: 207815, courseId }
    ];

    expect(scrapeClasses(classes, courseId)).toEqual(expected);
  });
});
