import { Teacher, ClassGrade, Subject, ScheduleDay, Period, Day } from "../types";

export const DAYS: Day[] = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
];

export const PERIODS_REGULAR: Period[] = [
  { id: 1, startTime: '10:20', endTime: '11:00', isBreak: false, isLunch: false },
  { id: 2, startTime: '11:00', endTime: '11:40', isBreak: false, isLunch: false },
  { id: 0, startTime: '11:40', endTime: '11:50', isBreak: true, isLunch: false }, // Break
  { id: 3, startTime: '11:50', endTime: '12:30', isBreak: false, isLunch: false },
  { id: 4, startTime: '12:30', endTime: '13:10', isBreak: false, isLunch: false },
  { id: 0, startTime: '13:10', endTime: '13:50', isBreak: false, isLunch: true }, // Lunch
  { id: 5, startTime: '13:50', endTime: '14:30', isBreak: false, isLunch: false },
  { id: 6, startTime: '14:30', endTime: '15:10', isBreak: false, isLunch: false },
  { id: 7, startTime: '15:10', endTime: '15:50', isBreak: false, isLunch: false },
  { id: 8, startTime: '15:50', endTime: '16:30', isBreak: false, isLunch: false },
];

export const PERIODS_FRIDAY: Period[] = [
  { id: 1, startTime: '10:20', endTime: '11:00', isBreak: false, isLunch: false },
  { id: 2, startTime: '11:00', endTime: '11:40', isBreak: false, isLunch: false },
  { id: 0, startTime: '11:40', endTime: '11:50', isBreak: true, isLunch: false }, // Break
  { id: 3, startTime: '11:50', endTime: '12:30', isBreak: false, isLunch: false },
  { id: 4, startTime: '12:30', endTime: '13:10', isBreak: false, isLunch: false },
  { id: 5, startTime: '13:10', endTime: '13:50', isBreak: false, isLunch: false },
];

export const SCHEDULE_STRUCTURE: ScheduleDay[] = [
  { day: 'Sunday', periods: PERIODS_REGULAR },
  { day: 'Monday', periods: PERIODS_REGULAR },
  { day: 'Tuesday', periods: PERIODS_REGULAR },
  { day: 'Wednesday', periods: PERIODS_REGULAR },
  { day: 'Thursday', periods: PERIODS_REGULAR },
  { day: 'Friday', periods: PERIODS_FRIDAY },
];

export const SUBJECTS: Subject[] = [
  { 
    id: 'bangla', 
    name: 'Bangla', 
    colorClass: 'bg-red-100',
    periodsPerWeek: {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
      6: 0, 7: 0, 8: 0, 9: 0, 10: 0,
      11: 0, 12: 0
    }
  },
  { 
    id: 'english', 
    name: 'English', 
    colorClass: 'bg-blue-100',
    periodsPerWeek: {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
      6: 0, 7: 0, 8: 0, 9: 0, 10: 0,
      11: 0, 12: 0
    }
  },
  { 
    id: 'math', 
    name: 'Mathematics', 
    colorClass: 'bg-purple-100',
    periodsPerWeek: {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
      6: 0, 7: 0, 8: 0, 9: 0, 10: 0,
      11: 0, 12: 0
    }
  },
  { 
    id: 'science', 
    name: 'Science', 
    colorClass: 'bg-green-100',
    periodsPerWeek: {
      1: 0, 2: 0, 3: 6, 4: 6, 5: 6,
      6: 6, 7: 6, 8: 6, 9: 6, 10: 6,
      11: 0, 12: 0
    }
  },
  { 
    id: 'social', 
    name: 'Social Science', 
    colorClass: 'bg-yellow-100',
    periodsPerWeek: {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
      6: 0, 7: 0, 8: 0, 9: 0, 10: 0,
      11: 0, 12: 0
    }
  },
  { 
    id: 'religion', 
    name: 'Religion', 
    colorClass: 'bg-orange-100',
    periodsPerWeek: {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
      6: 0, 7: 0, 8: 0, 9: 0, 10: 0,
      11: 0, 12: 0
    }
  },
  { 
    id: 'ict', 
    name: 'ICT', 
    colorClass: 'bg-cyan-100',
    periodsPerWeek: {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
      6: 0, 7: 0, 8: 0, 9: 0, 10: 0,
      11: 0, 12: 0
    }
  },
  { 
    id: 'agri', 
    name: 'Agriculture', 
    colorClass: 'bg-lime-100',
    periodsPerWeek: {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
      6: 0, 7: 0, 8: 0, 9: 0, 10: 0,
      11: 0, 12: 0
    }
  },
  { 
    id: 'physics', 
    name: 'Physics', 
    colorClass: 'bg-indigo-100',
    periodsPerWeek: {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
      6: 0, 7: 0, 8: 0, 9: 0, 10: 0,
      11: 0, 12: 0
    }
  },
  { 
    id: 'chemistry', 
    name: 'Chemistry', 
    colorClass: 'bg-pink-100',
    periodsPerWeek: {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
      6: 0, 7: 0, 8: 0, 9: 0, 10: 0,
      11: 0, 12: 0
    }
  },
  { 
    id: 'biology', 
    name: 'Biology', 
    colorClass: 'bg-emerald-100',
    periodsPerWeek: {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
      6: 0, 7: 0, 8: 0, 9: 0, 10: 0,
      11: 0, 12: 0
    }
  },
  {
    id: 'higher_math',
    name: 'Higher Math',
    colorClass: 'bg-red-100',
    periodsPerWeek: {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
      6: 0, 7: 0, 8: 0, 9: 0, 10: 0,
      11: 0, 12: 0
    }
  },
  {
    id: 'business',
    name: 'Business Studies',
    colorClass: 'bg-blue-100',
    periodsPerWeek: {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
      6: 0, 7: 0, 8: 0, 9: 0, 10: 0,
      11: 0, 12: 0
    }
  },
  {
    id: 'accounting',
    name: 'Accounting',
    colorClass: 'bg-purple-100',
    periodsPerWeek: {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
      6: 0, 7: 0, 8: 0, 9: 0, 10: 0,
      11: 0, 12: 0
    }
  },
  {
    id: 'finance',
    name: 'Finance',
    colorClass: 'bg-green-100',
    periodsPerWeek: {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
      6: 0, 7: 0, 8: 0, 9: 0, 10: 0,
      11: 0, 12: 0
    }
  },
  {
    id: 'economics',
    name: 'Economics',
    colorClass: 'bg-yellow-100',
    periodsPerWeek: {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
      6: 0, 7: 0, 8: 0, 9: 0, 10: 0,
      11: 0, 12: 0
    }
  },
  {
    id: 'fca',
    name: 'FCA',
    colorClass: 'bg-red-100',
    periodsPerWeek: {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
      6: 0, 7: 0, 8: 0, 9: 7, 10: 0,
      11: 0, 12: 0
    }
  },
  {
    id: 'cherm',
    name: 'CHERM',
    colorClass: 'bg-blue-100',
    periodsPerWeek: {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
      6: 0, 7: 0, 8: 0, 9: 0, 10: 7,
      11: 0, 12: 0
    }
  },
  {
    id: 'electro',
    name: 'Electro',
    colorClass: 'bg-blue-100',
    periodsPerWeek: {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
      6: 0, 7: 0, 8: 0, 9: 7, 10: 0,
      11: 0, 12: 0
    }
  },
  {
    id: 'dbms',
    name: 'DBMS',
    colorClass: 'bg-yellow-100',
    periodsPerWeek: {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
      6: 0, 7: 0, 8: 0, 9: 0, 10: 7,
      11: 0, 12: 0
    }
  }
];

export const MOCK_TEACHERS: Teacher[] = [];

export const MOCK_CLASSES: ClassGrade[] = Array.from({ length: 12 }, (_, i) => ({
  id: `class-${i + 1}`,
  grade: i + 1,
  section: 'A',
  subjects: []
}));
