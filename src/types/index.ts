
export type Teacher = {
  id: string;
  name: string;
  subjects: Subject[];
  maxPeriods: number;
  assignedPeriods?: number;
  classes: number[];
  classSubjects?: Record<number, string[]>; // Class grade -> array of subject IDs
};

export type ClassGrade = {
  id: string;
  grade: number;
  section: string;
  subjects: Subject[];
};

export type Subject = {
  id: string;
  name: string;
  colorClass: string;
  periodsPerWeek: Record<number, number>; // Class grade -> periods per week
};

export type Day = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';

export type Period = {
  id: number;
  startTime: string;
  endTime: string;
  isBreak: boolean;
  isLunch: boolean;
};

export type ScheduleDay = {
  day: Day;
  periods: Period[];
};

export type ScheduleSlot = {
  teacherId: string | null;
  subjectId: string | null;
  classId: string | null;
  isBreak: boolean;
  isLunch: boolean;
};

export type ClassSchedule = {
  classId: string;
  schedule: Record<Day, ScheduleSlot[]>;
};

export type TeacherSchedule = {
  teacherId: string;
  schedule: Record<Day, ScheduleSlot[]>;
};

export type FullSchedule = {
  classes: Record<string, ClassSchedule>;
  teachers: Record<string, TeacherSchedule>;
};
