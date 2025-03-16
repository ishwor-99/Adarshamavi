import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DAYS, MOCK_CLASSES, SCHEDULE_STRUCTURE } from '@/data/mockData';
import { getScheduleDayPeriods, getSubjectById, getTeacherById, getClassById } from '@/utils/scheduleUtils';
import { FullSchedule, Day } from '@/types';
import { cn } from '@/lib/utils';

interface ScheduleViewProps {
  schedule: FullSchedule;
}

const ScheduleView: React.FC<ScheduleViewProps> = ({ schedule }) => {
  // Get classes from localStorage
  const savedClasses = localStorage.getItem('classes');
  const customClasses = savedClasses ? JSON.parse(savedClasses) : [];
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">School Schedule</h2>
      </div>
      
      <div className="bg-white rounded-xl shadow-md p-4">
        <Tabs defaultValue={DAYS[0]} className="w-full">
          <TabsList className="w-full mb-6">
            {DAYS.map((day) => (
              <TabsTrigger key={day} value={day} className="flex-1">
                {day.toUpperCase()}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {DAYS.map((day) => (
            <TabsContent key={day} value={day} className="animate-fade-in">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr>
                      <th className="border p-2 bg-gray-800 text-white font-medium text-center sticky left-0 z-10">Class</th>
                      {getScheduleDayPeriods(day as Day).map((period, index) => {
                        if (period.isBreak) {
                          return (
                            <th key={`break-${index}`} className="border p-2 bg-gray-300 font-medium text-center w-24">
                              Break<br/>
                              <span className="text-xs">{period.startTime}-{period.endTime}</span>
                            </th>
                          );
                        }
                        if (period.isLunch) {
                          return (
                            <th key={`lunch-${index}`} className="border p-2 bg-amber-200 font-medium text-center w-24">
                              Lunch<br/>
                              <span className="text-xs">{period.startTime}-{period.endTime}</span>
                            </th>
                          );
                        }
                        return (
                          <th key={`period-${period.id}`} className="border p-2 bg-blue-700 text-white font-medium text-center w-24">
                            Period {period.id}<br/>
                            <span className="text-xs">{period.startTime}-{period.endTime}</span>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {customClasses.length > 0 ? (
                      customClasses.map((classGrade: any) => {
                        const classSchedule = schedule.classes[classGrade.id];
                        if (!classSchedule) return null;
                        
                        return (
                          <tr key={classGrade.id} className="hover:bg-gray-50">
                            <td className="border p-2 bg-gray-100 font-medium text-center sticky left-0 z-10">
                              Class {classGrade.grade}{classGrade.section}
                            </td>
                            
                            {getScheduleDayPeriods(day as Day).map((period, periodIndex) => {
                              const slot = classSchedule.schedule[day as Day][periodIndex];
                              if (!slot) return <td key={periodIndex} className="border p-2 text-center"></td>;
                              
                              if (slot.isBreak) {
                                return <td key={periodIndex} className="border p-2 bg-gray-100 text-center"></td>;
                              }
                              
                              if (slot.isLunch) {
                                return <td key={periodIndex} className="border p-2 bg-amber-50 text-center"></td>;
                              }
                              
                              if (!slot.teacherId || !slot.subjectId) {
                                return <td key={periodIndex} className="border p-2 text-center"></td>;
                              }
                              
                              const teacher = getTeacherById(slot.teacherId);
                              const subject = getSubjectById(slot.subjectId);
                              
                              const teacherInitials = teacher ? teacher.name.split(' ').map(part => part[0]).join('') : '';
                              const teacherShortId = teacher ? `(${teacher.id.replace('t', '')})` : '';
                              
                              return (
                                <td key={periodIndex} className={cn("border p-1 text-center text-xs", subject?.colorClass || "bg-gray-50")}>
                                  <div className="font-medium">{teacherInitials}{teacherShortId}</div>
                                  <div>{subject?.name || 'Unknown'}</div>
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })
                    ) : (
                      MOCK_CLASSES.map((classGrade) => {
                        const classSchedule = schedule.classes[classGrade.id];
                        if (!classSchedule) return null;
                        
                        return (
                          <tr key={classGrade.id} className="hover:bg-gray-50">
                            <td className="border p-2 bg-gray-100 font-medium text-center sticky left-0 z-10">
                              Class {classGrade.grade}{classGrade.section}
                            </td>
                            
                            {getScheduleDayPeriods(day as Day).map((period, periodIndex) => {
                              const slot = classSchedule.schedule[day as Day][periodIndex];
                              if (!slot) return <td key={periodIndex} className="border p-2 text-center"></td>;
                              
                              if (slot.isBreak) {
                                return <td key={periodIndex} className="border p-2 bg-gray-100 text-center"></td>;
                              }
                              
                              if (slot.isLunch) {
                                return <td key={periodIndex} className="border p-2 bg-amber-50 text-center"></td>;
                              }
                              
                              if (!slot.teacherId || !slot.subjectId) {
                                return <td key={periodIndex} className="border p-2 text-center"></td>;
                              }
                              
                              const teacher = getTeacherById(slot.teacherId);
                              const subject = getSubjectById(slot.subjectId);
                              
                              const teacherInitials = teacher ? teacher.name.split(' ').map(part => part[0]).join('') : '';
                              const teacherShortId = teacher ? `(${teacher.id.replace('t', '')})` : '';
                              
                              return (
                                <td key={periodIndex} className={cn("border p-1 text-center text-xs", subject?.colorClass || "bg-gray-50")}>
                                  <div className="font-medium">{teacherInitials}{teacherShortId}</div>
                                  <div>{subject?.name || 'Unknown'}</div>
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default ScheduleView;
