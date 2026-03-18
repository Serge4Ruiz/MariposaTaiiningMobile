import { useEffect, useRef, useState } from 'react';
import { getLectureSoid, findOrCreateLecture, getLectureInfo, getCourseDetail, getCourseAudioUrl, createInstance } from '../../services/courseService';

function getResumeSlide(instances) {
  if (!instances || instances.length === 0) return 0;
  const best = instances.reduce((prev, cur) =>
    (cur.LatestSlide ?? 0) > (prev.LatestSlide ?? 0) ? cur : prev
  );
  return Math.max(0, (best.LatestSlide ?? 1) - 1);
}

export function useCourseLoader({ course, lectures, memberSoid, skipCourseContent = false }) {
  const lectureSoidRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [slides, setSlides] = useState([]);
  const [courseNumber, setCourseNumber] = useState(null);
  const [startSlide, setStartSlide] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError('');

        let lsoid = getLectureSoid(lectures, course.Soid);
        if (!lsoid) {
          const created = await findOrCreateLecture(memberSoid, course.Soid);
          lsoid = created?.Soid;
        }
        if (!lsoid) throw new Error('Could not find or create a lecture for this course.');
        lectureSoidRef.current = lsoid;

        if (skipCourseContent) {
          if (!cancelled) setLoading(false);
          return;
        }

        await createInstance(lsoid);
        const lectureInfo = await getLectureInfo(lsoid);
        const lectureForCourse = lectures.find((l) => l.Soid === lsoid);
        const resumeFrom = lectureForCourse?.Viewed === true ? 0 : getResumeSlide(lectureInfo?.Instances);

        const courseDetail = await getCourseDetail(course.Soid);
        const slideList = courseDetail?.Slides ?? [];
        if (slideList.length === 0) throw new Error('No slides found for this course.');
        const channel = courseDetail.Channel;
        if (!channel) throw new Error('Course has no audio channel.');

        if (cancelled) return;

        const safeStart = Math.min(resumeFrom, slideList.length - 1);
        setSlides(slideList);
        setCourseNumber(courseDetail.Number ?? course.Number ?? null);
        setStartSlide(safeStart);
        setAudioUrl(getCourseAudioUrl(channel));
        setLoading(false);
      } catch (e) {
        console.error('useCourseLoader error:', e);
        if (!cancelled) {
          setError(e.message || 'Failed to load course. Please try again.');
          setLoading(false);
        }
      }
    };

    load();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { loading, error, slides, courseNumber, startSlide, audioUrl, lectureSoidRef };
}
