import axios from 'axios';
import { Platform } from 'react-native';

const BASE_URL = 'https://api.mariposatraining.com/api';
const AUDIO_BASE = 'https://admin.mariposatraining.com/Content/Presentations/Audio';

export const getLecturesOrdered = async (memberSoid) => {
  const response = await axios.get(`${BASE_URL}/Member/${memberSoid}/LecturesOrdered`);
  return response.data; // array of lectures
};

export const getCatalog = async () => {
  const response = await axios.get(`${BASE_URL}/Catalog`);
  return response.data?.Courses ?? [];
};

export const getCourseThumbnail = (courseNumber) =>
  `https://admin.mariposatraining.com/Content/Pictures/Classes/Thumbs/${courseNumber}.jpg`;

/**
 * Fetches both lectures and catalog, returns merged array:
 * Each item = lecture fields + catalog fields (instructor, length, ceu, thumbnail)
 */
export const getMergedCourses = async (memberSoid) => {
  const [lectures, catalog] = await Promise.all([
    getLecturesOrdered(memberSoid),
    getCatalog(),
  ]);

  // Build a quick lookup map for catalog by Soid
  const catalogMap = {};
  catalog.forEach((course) => {
    catalogMap[course.Soid] = course;
  });

  return lectures.map((lecture) => {
    const catalogInfo = catalogMap[lecture.CourseSoid] ?? {};
    return {
      ...lecture,
      InstructorName: catalogInfo.InstructorName ?? null,
      Length: catalogInfo.Length ?? null,
      CeuCount: catalogInfo.CeuCount ?? null,
      CourseNumber: catalogInfo.Number ?? null,
      Description: catalogInfo.Description ?? null,
      ThumbnailUrl: catalogInfo.Number
        ? getCourseThumbnail(catalogInfo.Number)
        : null,
    };
  });
};

/**
 * POST /Community/Lecture/{memberSoid}/FindOrCreateLecture
 * If no lecture exists for this member+course, the server creates one and returns it.
 * Returns the full lecture object — use `.Soid` as the lectureSoid.
 */
export const findOrCreateLecture = async (memberSoid, courseSoid) => {
  const response = await axios.post(
    `${BASE_URL}/Community/Lecture/${memberSoid}/FindOrCreateLecture`,
    { MemberSoid: memberSoid, CourseSoid: courseSoid, Price: 0, Source: '' }
  );
  return response.data; // full lecture object; use .Soid
};

/**
 * Resolves the correct lectureSoid for a given courseSoid from an already-fetched lectures array.
 * If multiple lectures share the same CourseSoid, sort by CreatedOn descending and use the latest.
 */
export const getLectureSoid = (lectures, courseSoid) => {
  const matching = lectures.filter((l) => l.CourseSoid === courseSoid);
  if (matching.length === 0) return null;
  if (matching.length === 1) return matching[0].Soid;
  // Multiple → sort by CreatedOn descending, pick the latest
  const sorted = [...matching].sort(
    (a, b) => new Date(b.CreatedOn) - new Date(a.CreatedOn)
  );
  return sorted[0].Soid;
};

/**
 * GET /Community/Lecture/{lectureSoid}
 * Returns full lecture info including Instances array (with LatestSlide).
 */
export const getLectureInfo = async (lectureSoid) => {
  const response = await axios.get(`${BASE_URL}/Community/Lecture/${lectureSoid}`);
  return response.data;
};

/**
 * GET /Catalog/Course/{courseSoid}
 * Returns course detail: Slides[], Channel, TotalSeconds, etc.
 */
export const getCourseDetail = async (courseSoid) => {
  const response = await axios.get(`${BASE_URL}/Catalog/Course/${courseSoid}`);
  return response.data;
};

/**
 * PATCH /Community/Lecture/{lectureSoid}/AdjustProgress
 * Reports the latest slide seen and time through for progress tracking.
 */
export const adjustProgress = async (lectureSoid, latestSlide, timeThrough) => {
  await axios.patch(
    `${BASE_URL}/Community/Lecture/${lectureSoid}/AdjustProgress`,
    { LectureSoid: lectureSoid, LatestSlideSeen: latestSlide, TimeThrough: timeThrough }
  );
};

/**
 * POST /Community/Lecture/{lectureSoid}/CreateInstance
 * Creates a new lecture session (instance) for the current device.
 * Must be called before getLectureInfo to get a fresh session.
 */
export const createInstance = async (lectureSoid) => {
  const response = await axios.post(
    `${BASE_URL}/Community/Lecture/${lectureSoid}/CreateInstance`,
    {
      Browser: 'Mariposa App',
      BrowserVersion: '1.0',
      Platform: `${Platform.OS === 'ios' ? 'iOS' : 'Android'} - ${Platform.Version}`,
    }
  );
  return response.data; // returns the new Instance object (with InstanceSoid etc.)
};

/**
 * Builds the full audio URL for a course given its Channel string.
 */
export const getCourseAudioUrl = (channel) => `${AUDIO_BASE}/${channel}.mp3`;

/**
 * Builds the image URL for a specific slide.
 * courseNumber = course Number field (e.g. "110"), slideNumber = Slide.SlideNumber
 */
export const getSlideImageUrl = (courseNumber, slideNumber) => {
  const padded = String(slideNumber + 1).padStart(3, '0');
  console.log(slideNumber);
  return `https://admin.mariposatraining.com/Content/Presentations/Slides/${courseNumber}/Slides/Slide${padded}.JPG`;
};
