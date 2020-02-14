-- data model for schools; intended for postgres

DROP TABLE IF EXISTS public.school CASCADE;
DROP TABLE IF EXISTS public.teacher CASCADE;
DROP TABLE IF EXISTS public.student CASCADE;
DROP TABLE IF EXISTS public.subject CASCADE;
DROP TABLE IF EXISTS public.course CASCADE;
DROP TABLE IF EXISTS public.class CASCADE;
DROP TABLE IF EXISTS public.grade CASCADE;



CREATE TABLE public.school (
    school_id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE public.teacher (
    teacher_id SERIAL PRIMARY KEY,
    school_id INTEGER REFERENCES school(school_id) ON UPDATE CASCADE ON DELETE SET NULL,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE public.student (
    student_id SERIAL PRIMARY KEY,
    school_id INTEGER REFERENCES school(school_id) ON UPDATE CASCADE ON DELETE SET NULL,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE public.subject (
    subject_id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE public.course (
    course_id SERIAL PRIMARY KEY,
    subject_id INTEGER REFERENCES subject(subject_id) ON UPDATE CASCADE ON DELETE SET NULL,
    credits DECIMAL(4,2) NOT NULL DEFAULT 3.0,
    name TEXT UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE public.class (
    class_id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES course(course_id) ON UPDATE CASCADE ON DELETE SET NULL,
    teacher_id INTEGER REFERENCES teacher(teacher_id) ON UPDATE CASCADE ON DELETE SET NULL,
    block INTEGER NOT NULL,
    note TEXT
);

CREATE TABLE public.grade (
    student_id INTEGER REFERENCES student(student_id) ON UPDATE CASCADE ON DELETE SET NULL,
    class_id INTEGER REFERENCES class(class_id) ON UPDATE CASCADE ON DELETE SET NULL,
    percent DECIMAL(5,2) NOT NULL DEFAULT 0.0,
    note TEXT
);



INSERT INTO school (school_id, name) VALUES
  (1, 'Burnaby South'),
  (2, 'Burnaby North');

INSERT INTO teacher (teacher_id, school_id, name) VALUES
  (1, 1, 'Teacher A of South'),
  (2, 1, 'Teacher B of South'),
  (3, 2, 'Teacher A of North'),
  (4, 2, 'Teacher B of North');

INSERT INTO student (student_id, school_id, name) VALUES
  (1, 1, 'Student A of South'),
  (2, 1, 'Student B of South'),
  (3, 1, 'Student C of South'),
  (4, 1, 'Student D of South'),
  (5, 2, 'Student A of North'),
  (6, 2, 'Student B of North'),
  (7, 2, 'Student C of North'),
  (8, 2, 'Student D of North');

INSERT INTO subject (subject_id, name) VALUES
  (1, 'Math'),
  (2, 'Computer Science');

INSERT INTO course (course_id, subject_id, name) VALUES
  (1, 1, 'Math 12'),
  (2, 2, 'AP CS P'),
  (3, 2, 'AP CS A');

INSERT INTO class (class_id, course_id, teacher_id, block) VALUES
  (1, 1, 1, 1),
  (2, 1, 1, 2),
  (3, 2, 2, 1),
  (4, 3, 2, 2);

INSERT INTO grade (student_id, class_id, percent) VALUES
  (1, 1, 70),
  (1, 4, 90),
  (2, 1, 75),
  (2, 4, 85),
  (3, 1, 75),
  (3, 2, 80),
  (4, 1, 95),
  (4, 2, 65);



-- all grades in school 1
/*
SELECT * FROM school
  INNER JOIN student ON school.school_id = student.school_id
  INNER JOIN grade ON student.student_id = grade.student_id
  WHERE school.school_id = 1;
*/

-- stats per school
/*
SELECT
    school.name,
    count(DISTINCT grade.student_id) AS number_of_students,
    avg(grade.percent) AS avg_grade
  FROM school
  INNER JOIN student ON school.school_id = student.school_id
  INNER JOIN grade ON student.student_id = grade.student_id
  GROUP BY school.school_id;
*/

-- stats per school and course
/*
SELECT
    school.name,
    course.name,
    count(DISTINCT grade.student_id) AS number_of_students,
    avg(grade.percent) AS avg_grade
  FROM school
  INNER JOIN student ON school.school_id = student.school_id
  INNER JOIN grade ON student.student_id = grade.student_id
  INNER JOIN class ON grade.class_id = class.class_id
  INNER JOIN course ON class.course_id = course.course_id
  GROUP BY school.school_id, course.course_id;
*/
