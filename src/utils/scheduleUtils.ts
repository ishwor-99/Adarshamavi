
import { ClassGrade, ClassSchedule, Day, FullSchedule, ScheduleDay, ScheduleSlot, Subject, Teacher, TeacherSchedule } from "../types";
import { DAYS, MOCK_CLASSES, SCHEDULE_STRUCTURE, SUBJECTS } from "../data/mockData";

/**
 * Get the current list of teachers from localStorage or use MOCK_TEACHERS as fallback
 */
export const getCurrentTeachers = (): Teacher[] => {
  try {
    const savedTeachers = localStorage.getItem('teachers');
    if (savedTeachers) {
      const teachers = JSON.parse(savedTeachers);
      console.log("Retrieved teachers from localStorage:", teachers);
      return teachers;
    }
    // Only use mock data if nothing in localStorage
    console.log("No teachers found in localStorage, returning empty array");
    return [];
  } catch (error) {
    console.error('Failed to get teachers from localStorage:', error);
    return [];
  }
};

/**
 * Get the current list of subjects from localStorage or use SUBJECTS as fallback
 */
export const getCurrentSubjects = (): Subject[] => {
  try {
    const savedSubjects = localStorage.getItem('subjects');
    if (savedSubjects) {
      return JSON.parse(savedSubjects);
    }
    return SUBJECTS;
  } catch (error) {
    console.error('Failed to get subjects from localStorage:', error);
    return SUBJECTS;
  }
};

/**
 * Check if a teacher can teach the given subject for the specific class
 */
export const canTeachSubjectForClass = (teacher: Teacher, subjectId: string, classGrade: number): boolean => {
  // If teacher has class-specific subjects defined, use that
  if (teacher.classSubjects && teacher.classSubjects[classGrade]) {
    const canTeach = teacher.classSubjects[classGrade].includes(subjectId);
    console.log(`Teacher ${teacher.name} can teach ${subjectId} for class ${classGrade}: ${canTeach}`);
    return canTeach;
  }
  
  // Fallback to general subject capability (for backward compatibility)
  return canTeachSubject(teacher, subjectId) && canTeachClass(teacher, classGrade);
};

/**
 * Check if a teacher can teach the given subject
 */
export const canTeachSubject = (teacher: Teacher, subjectId: string): boolean => {
  return teacher.subjects.some(subject => {
    // Handle both object with id and direct string id
    const subjId = typeof subject === 'object' ? subject.id : subject;
    return subjId === subjectId;
  });
};

/**
 * Check if a teacher can teach in the given class grade
 */
export const canTeachClass = (teacher: Teacher, classGrade: number): boolean => {
  return teacher.classes.includes(classGrade);
};

/**
 * Initialize an empty schedule
 */
export const initializeEmptySchedule = (): FullSchedule => {
  const classes: Record<string, ClassSchedule> = {};
  const teachers: Record<string, TeacherSchedule> = {};
  const currentTeachers = getCurrentTeachers();
  
  console.log("Initializing empty schedule with teachers:", currentTeachers);

  // Initialize class schedules
  MOCK_CLASSES.forEach(classGrade => {
    const emptySchedule: Record<Day, ScheduleSlot[]> = {
      'Sunday': [],
      'Monday': [],
      'Tuesday': [],
      'Wednesday': [],
      'Thursday': [],
      'Friday': [],
    };
    
    DAYS.forEach(day => {
      const dayStructure = SCHEDULE_STRUCTURE.find(s => s.day === day);
      if (dayStructure) {
        emptySchedule[day] = dayStructure.periods.map(period => ({
          teacherId: null,
          subjectId: null,
          classId: classGrade.id,
          isBreak: period.isBreak,
          isLunch: period.isLunch
        }));
      }
    });

    classes[classGrade.id] = {
      classId: classGrade.id,
      schedule: emptySchedule
    };
  });

  // Initialize teacher schedules
  currentTeachers.forEach(teacher => {
    const emptySchedule: Record<Day, ScheduleSlot[]> = {
      'Sunday': [],
      'Monday': [],
      'Tuesday': [],
      'Wednesday': [],
      'Thursday': [],
      'Friday': [],
    };
    
    DAYS.forEach(day => {
      const dayStructure = SCHEDULE_STRUCTURE.find(s => s.day === day);
      if (dayStructure) {
        emptySchedule[day] = dayStructure.periods.map(period => ({
          teacherId: teacher.id,
          subjectId: null,
          classId: null,
          isBreak: period.isBreak,
          isLunch: period.isLunch
        }));
      }
    });

    teachers[teacher.id] = {
      teacherId: teacher.id,
      schedule: emptySchedule
    };
  });

  return { classes, teachers };
};

/**
 * Check if a teacher is available at a specific slot
 */
export const isTeacherAvailable = (
  schedule: FullSchedule,
  teacherId: string,
  day: Day,
  periodIndex: number
): boolean => {
  const teacherSchedule = schedule.teachers[teacherId];
  if (!teacherSchedule) return false;
  
  const slot = teacherSchedule.schedule[day][periodIndex];
  return slot && slot.classId === null && !slot.isBreak && !slot.isLunch;
};

/**
 * Check if a class has a scheduled subject at a specific slot
 */
export const isClassAvailable = (
  schedule: FullSchedule,
  classId: string,
  day: Day,
  periodIndex: number
): boolean => {
  const classSchedule = schedule.classes[classId];
  if (!classSchedule) return false;
  
  const slot = classSchedule.schedule[day][periodIndex];
  return slot && slot.subjectId === null && !slot.isBreak && !slot.isLunch;
};

/**
 * Count how many periods a teacher has been assigned
 */
export const countTeacherPeriods = (
  schedule: FullSchedule,
  teacherId: string
): number => {
  const teacherSchedule = schedule.teachers[teacherId];
  if (!teacherSchedule) return 0;
  
  let count = 0;
  DAYS.forEach(day => {
    teacherSchedule.schedule[day].forEach(slot => {
      if (slot.classId !== null && !slot.isBreak && !slot.isLunch) {
        count++;
      }
    });
  });
  
  return count;
};

/**
 * Count how many periods of a specific subject are assigned to a class
 */
export const countSubjectPeriodsForClass = (
  schedule: FullSchedule,
  classId: string,
  subjectId: string
): number => {
  const classSchedule = schedule.classes[classId];
  if (!classSchedule) return 0;
  
  let count = 0;
  DAYS.forEach(day => {
    classSchedule.schedule[day].forEach(slot => {
      if (slot.subjectId === subjectId) {
        count++;
      }
    });
  });
  
  return count;
};

/**
 * Check if a teacher is already teaching a subject to a specific class on a given day
 */
export const isTeacherTeachingSubjectForClassOnDay = (
  schedule: FullSchedule,
  teacherId: string,
  subjectId: string,
  classId: string,
  day: Day
): boolean => {
  const teacherSchedule = schedule.teachers[teacherId];
  if (!teacherSchedule) return false;
  
  return teacherSchedule.schedule[day].some(slot => 
    slot.classId === classId && slot.subjectId === subjectId
  );
};

/**
 * Find all teachers who can teach a specific subject to a specific class
 */
export const findEligibleTeachers = (
  subject: Subject,
  classGrade: number
): Teacher[] => {
  const currentTeachers = getCurrentTeachers();
  const eligibleTeachers = currentTeachers.filter(teacher => 
    canTeachSubjectForClass(teacher, subject.id, classGrade)
  );
  
  console.log(`Found ${eligibleTeachers.length} eligible teachers for subject ${subject.name} in class ${classGrade}`);
  if (eligibleTeachers.length === 0) {
    console.log(`No eligible teachers found for subject ${subject.name} in class ${classGrade}`);
    console.log(`Available teachers:`, currentTeachers);
  }
  
  return eligibleTeachers;
};

/**
 * Generate a school schedule with improved distribution logic
 * Ensures teachers aren't assigned same subject to same class more than once per day
 * Limits teachers to max 24 periods per week
 */
export const generateSchedule = (): FullSchedule => {
  console.log("Starting to generate schedule...");
  const schedule = initializeEmptySchedule();
  const currentTeachers = getCurrentTeachers();
  const currentSubjects = getCurrentSubjects();
  
  console.log(`Teachers available for schedule generation: ${currentTeachers.length}`);
  
  // If no teachers are available, show a meaningful error
  if (currentTeachers.length === 0) {
    throw new Error("No teachers available. Please add teachers before generating a schedule.");
  }

  // Log teacher information
  currentTeachers.forEach(teacher => {
    console.log(`Teacher: ${teacher.name}, ID: ${teacher.id}`);
    console.log(`- Teaches subjects: ${teacher.subjects.map(s => typeof s === 'object' ? s.name : s).join(', ')}`);
    console.log(`- Can teach classes: ${teacher.classes.join(', ')}`);
    if (teacher.classSubjects) {
      console.log(`- Class-specific subjects:`, teacher.classSubjects);
    }
  });
  
  // Track teacher's assignments
  const teacherAssignments: Record<string, {
    weeklyCount: number;
    dailyClasses: Record<Day, Set<string>>;
    dailySubjects: Record<Day, Map<string, Set<string>>>;
    dailySubjectClassCombos: Record<Day, Set<string>>;
  }> = {};
  
  // Initialize teacher assignments tracking
  currentTeachers.forEach(teacher => {
    const dailyClasses: Record<Day, Set<string>> = {
      'Sunday': new Set(),
      'Monday': new Set(),
      'Tuesday': new Set(),
      'Wednesday': new Set(),
      'Thursday': new Set(),
      'Friday': new Set()
    };
    
    const dailySubjects: Record<Day, Map<string, Set<string>>> = {
      'Sunday': new Map(),
      'Monday': new Map(),
      'Tuesday': new Map(),
      'Wednesday': new Map(),
      'Thursday': new Map(),
      'Friday': new Map()
    };
    
    const dailySubjectClassCombos: Record<Day, Set<string>> = {
      'Sunday': new Set(),
      'Monday': new Set(),
      'Tuesday': new Set(),
      'Wednesday': new Set(),
      'Thursday': new Set(),
      'Friday': new Set()
    };
    
    teacherAssignments[teacher.id] = {
      weeklyCount: 0,
      dailyClasses,
      dailySubjects,
      dailySubjectClassCombos
    };
  });

  // Create a copy of MOCK_CLASSES with enriched subject data from teachers' classSubjects
  const enhancedClasses = MOCK_CLASSES.map(classGrade => {
    const classSubjects: Subject[] = [];
    
    // For each class, check which teachers can teach subjects for this class
    currentTeachers.forEach(teacher => {
      if (teacher.classes.includes(classGrade.grade) && teacher.classSubjects && teacher.classSubjects[classGrade.grade]) {
        // Add each subject the teacher can teach for this class
        teacher.classSubjects[classGrade.grade].forEach(subjectId => {
          // Find the subject details
          const subject = currentSubjects.find(s => s.id === subjectId);
          if (subject && !classSubjects.some(s => s.id === subjectId)) {
            classSubjects.push(subject);
          }
        });
      }
    });
    
    console.log(`Enhanced Class ${classGrade.grade}${classGrade.section} with subjects:`, classSubjects.map(s => s.name));
    
    return {
      ...classGrade,
      subjects: classSubjects
    };
  });

  // First pass: For each class, assign subjects based on required periods per week
  enhancedClasses.forEach(classGrade => {
    console.log(`Processing class ${classGrade.grade}${classGrade.section}`);
    
    // For each subject taught in this class
    classGrade.subjects.forEach(subject => {
      // Get the number of periods needed for this subject in this class
      const periodsNeeded = subject.periodsPerWeek[classGrade.grade] || 0;
      if (periodsNeeded === 0) {
        console.log(`Subject ${subject.name} not needed for class ${classGrade.grade}`);
        return;
      }
      
      console.log(`Subject ${subject.name} needs ${periodsNeeded} periods per week for class ${classGrade.grade}`);
      
      // Find eligible teachers for this subject and class
      const eligibleTeachers = findEligibleTeachers(subject, classGrade.grade);
      if (eligibleTeachers.length === 0) {
        console.log(`No eligible teachers found for ${subject.name} in class ${classGrade.grade}`);
        return;
      }
      
      let periodsAssigned = 0;
      
      // Try to distribute one period per day first
      DAYS.forEach(day => {
        if (periodsAssigned >= periodsNeeded) return;
        
        const dayStructure = SCHEDULE_STRUCTURE.find(s => s.day === day);
        if (!dayStructure) return;
        
        // Try to find an available teacher who hasn't reached limits
        for (const teacher of eligibleTeachers) {
          // Skip if teacher has reached weekly limit
          if (teacherAssignments[teacher.id].weeklyCount >= teacher.maxPeriods) {
            console.log(`Teacher ${teacher.name} has reached max periods (${teacher.maxPeriods})`);
            continue;
          }
          
          // Skip if teacher is already teaching this subject to this class today
          const subjectClassKey = `${subject.id}-${classGrade.id}`;
          if (teacherAssignments[teacher.id].dailySubjectClassCombos[day as Day].has(subjectClassKey)) {
            console.log(`Teacher ${teacher.name} already teaches ${subject.name} to class ${classGrade.grade} on ${day}`);
            continue;
          }
          
          // Find an available period for both teacher and class
          for (let periodIndex = 0; periodIndex < dayStructure.periods.length; periodIndex++) {
            const period = dayStructure.periods[periodIndex];
            if (period.isBreak || period.isLunch) continue;
            
            if (
              isTeacherAvailable(schedule, teacher.id, day as Day, periodIndex) &&
              isClassAvailable(schedule, classGrade.id, day as Day, periodIndex)
            ) {
              // Assign the period
              schedule.classes[classGrade.id].schedule[day as Day][periodIndex] = {
                teacherId: teacher.id,
                subjectId: subject.id,
                classId: classGrade.id,
                isBreak: false,
                isLunch: false
              };
              
              schedule.teachers[teacher.id].schedule[day as Day][periodIndex] = {
                teacherId: teacher.id,
                subjectId: subject.id,
                classId: classGrade.id,
                isBreak: false,
                isLunch: false
              };
              
              // Update teacher assignment tracking
              teacherAssignments[teacher.id].weeklyCount++;
              teacherAssignments[teacher.id].dailyClasses[day as Day].add(classGrade.id);
              
              if (!teacherAssignments[teacher.id].dailySubjects[day as Day].has(subject.id)) {
                teacherAssignments[teacher.id].dailySubjects[day as Day].set(subject.id, new Set());
              }
              teacherAssignments[teacher.id].dailySubjects[day as Day].get(subject.id)!.add(classGrade.id);
              
              // Mark this subject-class combo as assigned for this teacher on this day
              teacherAssignments[teacher.id].dailySubjectClassCombos[day as Day].add(subjectClassKey);
              
              periodsAssigned++;
              console.log(`Assigned ${subject.name} to teacher ${teacher.name} for class ${classGrade.grade} on ${day}, period ${period.id}`);
              break;
            }
          }
          
          if (periodsAssigned >= periodsNeeded) break;
        }
      });
      
      // Second pass: Fill in remaining periods needed
      while (periodsAssigned < periodsNeeded) {
        let assignedInThisIteration = false;
        
        // For each day, try to assign additional periods as needed
        for (const day of DAYS) {
          if (periodsAssigned >= periodsNeeded) break;
          
          const dayStructure = SCHEDULE_STRUCTURE.find(s => s.day === day);
          if (!dayStructure) continue;
          
          // Find teachers who can still teach today
          const availableTeachers = eligibleTeachers.filter(teacher => {
            return teacherAssignments[teacher.id].weeklyCount < teacher.maxPeriods;
          });
          
          if (availableTeachers.length === 0) continue;
          
          // Check if we already assigned this subject to this class on this day
          const alreadyAssignedTeachers = new Set<string>();
          
          for (const teacher of availableTeachers) {
            const subjectClassKey = `${subject.id}-${classGrade.id}`;
            if (teacherAssignments[teacher.id].dailySubjectClassCombos[day as Day].has(subjectClassKey)) {
              alreadyAssignedTeachers.add(teacher.id);
            }
          }
          
          // If all available teachers already teach this subject to this class today,
          // try another day
          if (alreadyAssignedTeachers.size === availableTeachers.length) {
            continue;
          }
          
          // Try to assign one more period for this day with a different teacher
          for (const teacher of availableTeachers) {
            // Skip if teacher is already teaching this subject to this class today
            const subjectClassKey = `${subject.id}-${classGrade.id}`;
            if (teacherAssignments[teacher.id].dailySubjectClassCombos[day as Day].has(subjectClassKey)) {
              continue;
            }
            
            // Find an available period for both teacher and class
            for (let periodIndex = 0; periodIndex < dayStructure.periods.length; periodIndex++) {
              const period = dayStructure.periods[periodIndex];
              if (period.isBreak || period.isLunch) continue;
              
              if (
                isTeacherAvailable(schedule, teacher.id, day as Day, periodIndex) &&
                isClassAvailable(schedule, classGrade.id, day as Day, periodIndex)
              ) {
                // Assign the period
                schedule.classes[classGrade.id].schedule[day as Day][periodIndex] = {
                  teacherId: teacher.id,
                  subjectId: subject.id,
                  classId: classGrade.id,
                  isBreak: false,
                  isLunch: false
                };
                
                schedule.teachers[teacher.id].schedule[day as Day][periodIndex] = {
                  teacherId: teacher.id,
                  subjectId: subject.id,
                  classId: classGrade.id,
                  isBreak: false,
                  isLunch: false
                };
                
                // Update teacher assignment tracking
                teacherAssignments[teacher.id].weeklyCount++;
                teacherAssignments[teacher.id].dailyClasses[day as Day].add(classGrade.id);
                
                if (!teacherAssignments[teacher.id].dailySubjects[day as Day].has(subject.id)) {
                  teacherAssignments[teacher.id].dailySubjects[day as Day].set(subject.id, new Set());
                }
                teacherAssignments[teacher.id].dailySubjects[day as Day].get(subject.id)!.add(classGrade.id);
                
                // Mark this subject-class combo as assigned for this teacher on this day
                teacherAssignments[teacher.id].dailySubjectClassCombos[day as Day].add(subjectClassKey);
                
                periodsAssigned++;
                assignedInThisIteration = true;
                break;
              }
            }
            
            if (assignedInThisIteration || periodsAssigned >= periodsNeeded) break;
          }
          
          if (periodsAssigned >= periodsNeeded) break;
        }
        
        // If we can't assign any more periods, break to avoid infinite loop
        if (!assignedInThisIteration) {
          console.warn(`Could not assign all periods for ${subject.name} in Class ${classGrade.grade}. 
                       Needed: ${periodsNeeded}, Assigned: ${periodsAssigned}`);
          break;
        }
      }
    });
  });
  
  console.log("Schedule generation completed!");
  return schedule;
};

export const getTeacherById = (teacherId: string): Teacher | undefined => {
  const currentTeachers = getCurrentTeachers();
  return currentTeachers.find(teacher => teacher.id === teacherId);
};

export const getClassById = (classId: string): ClassGrade | undefined => {
  return MOCK_CLASSES.find(classGrade => classGrade.id === classId);
};

export const getSubjectById = (subjectId: string): Subject | undefined => {
  const currentSubjects = getCurrentSubjects();
  return currentSubjects.find(subject => subject.id === subjectId);
};

export const getScheduleDayPeriods = (day: Day) => {
  return SCHEDULE_STRUCTURE.find(d => d.day === day)?.periods || [];
};
