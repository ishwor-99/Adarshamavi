
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateSchedule, getCurrentTeachers } from '@/utils/scheduleUtils';
import { FullSchedule, Teacher } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import ScheduleView from './ScheduleView';

const ScheduleGenerator = () => {
  const [schedule, setSchedule] = useState<FullSchedule | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [conflicts, setConflicts] = useState<string[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const { toast } = useToast();

  // Load teachers on component mount and whenever they might change
  useEffect(() => {
    const loadTeachers = () => {
      const loadedTeachers = getCurrentTeachers();
      console.log("Loaded teachers in ScheduleGenerator:", loadedTeachers);
      setTeachers(loadedTeachers);
    };
    
    loadTeachers();
    
    // Add event listener for storage changes
    window.addEventListener('storage', loadTeachers);
    
    // Cleanup
    return () => {
      window.removeEventListener('storage', loadTeachers);
    };
  }, []);

  // Listen for custom events when teachers are updated
  useEffect(() => {
    const handleTeachersUpdated = () => {
      const loadedTeachers = getCurrentTeachers();
      console.log("Teachers updated event triggered, reloading teachers:", loadedTeachers);
      setTeachers(loadedTeachers);
    };
    
    window.addEventListener('teachersUpdated', handleTeachersUpdated);
    
    return () => {
      window.removeEventListener('teachersUpdated', handleTeachersUpdated);
    };
  }, []);

  const handleGenerateSchedule = () => {
    setIsGenerating(true);
    
    // Get fresh list of teachers to ensure we have the most up-to-date data
    const currentTeachers = getCurrentTeachers();
    console.log("Current teachers before generating schedule:", currentTeachers);
    
    if (currentTeachers.length === 0) {
      toast({
        title: "No Teachers Available",
        description: "Please add at least one teacher before generating a schedule.",
        variant: "destructive"
      });
      setIsGenerating(false);
      return;
    }
    
    // Check if teachers have class-specific subjects assigned
    const hasInvalidTeacherAssignments = currentTeachers.some(teacher => 
      !teacher.classSubjects || 
      Object.keys(teacher.classSubjects).length === 0 ||
      Object.values(teacher.classSubjects).some(subjects => !subjects.length)
    );
    
    if (hasInvalidTeacherAssignments) {
      toast({
        title: "Incomplete Teacher Assignments",
        description: "Some teachers don't have any subjects assigned to specific classes. Please update teacher information.",
        variant: "destructive"
      });
      setIsGenerating(false);
      return;
    }
    
    // Simulate a delay for better UX
    setTimeout(() => {
      try {
        console.log("Starting schedule generation process...");
        const newSchedule = generateSchedule();
        setSchedule(newSchedule);
        
        // In a real app, we'd check for actual conflicts
        // This is a placeholder
        setConflicts([]);
        
        toast({
          title: "Schedule Generated",
          description: "The school schedule has been created successfully!",
        });
      } catch (error) {
        console.error('Error generating schedule:', error);
        toast({
          title: "Schedule Generation Failed",
          description: error instanceof Error ? error.message : "There was an error generating the schedule. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsGenerating(false);
      }
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold">Schedule Generator</h2>
          <p className="text-muted-foreground mt-1">Create a conflict-free timetable for your school</p>
        </div>
        
        <Button 
          onClick={handleGenerateSchedule} 
          disabled={isGenerating}
          className="animate-hover"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Generate Schedule
            </>
          )}
        </Button>
      </div>
      
      {conflicts.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Schedule Conflicts Detected</AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-5 mt-2">
              {conflicts.map((conflict, index) => (
                <li key={index}>{conflict}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {teachers.length === 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>No Teachers Available</AlertTitle>
          <AlertDescription>
            Please add teachers in the Teachers section before generating a schedule.
          </AlertDescription>
        </Alert>
      )}
      
      {!schedule && !isGenerating && (
        <Card className="neo-card">
          <CardHeader>
            <CardTitle>Schedule Configuration</CardTitle>
            <CardDescription>
              The system will automatically create a schedule based on your school's requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue="rules" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="rules">Schedule Rules</TabsTrigger>
                <TabsTrigger value="periods">Period Structure</TabsTrigger>
                <TabsTrigger value="constraints">Constraints</TabsTrigger>
              </TabsList>
              
              <TabsContent value="rules" className="p-4 animate-fade-in">
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Sunday to Thursday: 8 teaching periods per day</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Friday: 5 teaching periods per day</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>10-minute break after 2nd period each day</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>40-minute lunch break after 4th period (except Friday)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Maximum 24 periods per teacher per week</span>
                  </li>
                </ul>
              </TabsContent>
              
              <TabsContent value="periods" className="p-4 animate-fade-in">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Sunday to Thursday</h3>
                    <table className="w-full mt-2 text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="py-2 text-left">Period</th>
                          <th className="py-2 text-left">Time</th>
                          <th className="py-2 text-left">Type</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b"><td className="py-2">1</td><td>10:20 - 11:00</td><td>Class</td></tr>
                        <tr className="border-b"><td className="py-2">2</td><td>11:00 - 11:40</td><td>Class</td></tr>
                        <tr className="border-b bg-gray-50"><td className="py-2">Break</td><td>11:40 - 11:50</td><td>Short Break</td></tr>
                        <tr className="border-b"><td className="py-2">3</td><td>11:50 - 12:30</td><td>Class</td></tr>
                        <tr className="border-b"><td className="py-2">4</td><td>12:30 - 13:10</td><td>Class</td></tr>
                        <tr className="border-b bg-amber-50"><td className="py-2">Lunch</td><td>13:10 - 13:50</td><td>Lunch Break</td></tr>
                        <tr className="border-b"><td className="py-2">5</td><td>13:50 - 14:30</td><td>Class</td></tr>
                        <tr className="border-b"><td className="py-2">6</td><td>14:30 - 15:10</td><td>Class</td></tr>
                        <tr className="border-b"><td className="py-2">7</td><td>15:10 - 15:50</td><td>Class</td></tr>
                        <tr className="border-b"><td className="py-2">8</td><td>15:50 - 16:30</td><td>Class</td></tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">Friday</h3>
                    <table className="w-full mt-2 text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="py-2 text-left">Period</th>
                          <th className="py-2 text-left">Time</th>
                          <th className="py-2 text-left">Type</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b"><td className="py-2">1</td><td>10:20 - 11:00</td><td>Class</td></tr>
                        <tr className="border-b"><td className="py-2">2</td><td>11:00 - 11:40</td><td>Class</td></tr>
                        <tr className="border-b bg-gray-50"><td className="py-2">Break</td><td>11:40 - 11:50</td><td>Short Break</td></tr>
                        <tr className="border-b"><td className="py-2">3</td><td>11:50 - 12:30</td><td>Class</td></tr>
                        <tr className="border-b"><td className="py-2">4</td><td>12:30 - 13:10</td><td>Class</td></tr>
                        <tr className="border-b"><td className="py-2">5</td><td>13:10 - 13:50</td><td>Class</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="constraints" className="p-4 animate-fade-in">
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Teachers will only be assigned to subjects they can teach</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Teachers will only be assigned to class grades they can teach</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>No teacher will be assigned to two different classes in the same period</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Class periods will be distributed evenly throughout the week when possible</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Each class will receive the required number of periods for each subject</span>
                  </li>
                </ul>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleGenerateSchedule} 
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : "Generate Schedule"}
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {schedule && (
        <div className="animate-scale-in mt-6">
          <ScheduleView schedule={schedule} />
        </div>
      )}
    </div>
  );
};

export default ScheduleGenerator;
