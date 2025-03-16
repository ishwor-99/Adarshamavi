import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Subject, Teacher } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';

interface TeacherFormProps {
  initialTeacher: Teacher | null;
  onSave: (teacher: Teacher) => void;
  onCancel: () => void;
}

// Track which subjects a teacher can teach for each class grade
interface ClassSubjects {
  [classGrade: number]: string[]; // Array of subject IDs
}

const TeacherForm: React.FC<TeacherFormProps> = ({ initialTeacher, onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [maxPeriods, setMaxPeriods] = useState(24);
  const [selectedClasses, setSelectedClasses] = useState<number[]>([]);
  const [classSubjects, setClassSubjects] = useState<ClassSubjects>({});
  const [subjects, setSubjects] = useState<Subject[]>([]); 
  const { toast } = useToast();

  // Load all subjects from localStorage
  useEffect(() => {
    try {
      const savedSubjects = localStorage.getItem('subjects');
      const parsedSubjects = savedSubjects ? JSON.parse(savedSubjects) : [];
      setSubjects(parsedSubjects);
    } catch (error) {
      console.error('Failed to load subjects from localStorage:', error);
      setSubjects([]);
    }
  }, []);

  // Group subjects by class grade for easier selection
  const subjectsByClass = React.useMemo(() => {
    const result: Record<number, Subject[]> = {};
    Array.from({ length: 12 }, (_, i) => i + 1).forEach(grade => {
      result[grade] = subjects.filter(subject => 
        subject.periodsPerWeek && 
        subject.periodsPerWeek[grade] && 
        subject.periodsPerWeek[grade] > 0
      );
    });
    return result;
  }, [subjects]);

  // Update form fields when initialTeacher changes
  useEffect(() => {
    if (initialTeacher) {
      setName(initialTeacher.name || '');
      setMaxPeriods(initialTeacher.maxPeriods || 24);
      setSelectedClasses(initialTeacher.classes ? [...initialTeacher.classes] : []);
      
      // Handle class-specific subjects
      const initialClassSubjects: ClassSubjects = {};
      
      if (initialTeacher.classSubjects) {
        // If the teacher already has classSubjects defined
        Object.entries(initialTeacher.classSubjects).forEach(([classGrade, subjectIds]) => {
          initialClassSubjects[Number(classGrade)] = [...subjectIds];
        });
      } else if (initialTeacher.subjects && initialTeacher.subjects.length > 0) {
        // Legacy format - migrate to new format
        initialTeacher.classes.forEach(classGrade => {
          initialClassSubjects[classGrade] = initialTeacher.subjects
            .map(subject => typeof subject === 'object' ? subject.id : subject)
            .filter(subjectId => {
              const fullSubject = subjects.find(s => s.id === subjectId);
              return fullSubject && fullSubject.periodsPerWeek && 
                     fullSubject.periodsPerWeek[classGrade] && 
                     fullSubject.periodsPerWeek[classGrade] > 0;
            });
        });
      }
      
      setClassSubjects(initialClassSubjects);
    } else {
      // Reset form for new teacher
      setName('');
      setMaxPeriods(24);
      setSelectedClasses([]);
      setClassSubjects({});
    }
  }, [initialTeacher, subjects]);

  const handleClassToggle = (classGrade: number) => {
    if (selectedClasses.includes(classGrade)) {
      // Remove class and its subjects
      const newSelectedClasses = selectedClasses.filter(c => c !== classGrade);
      setSelectedClasses(newSelectedClasses);
      
      // Remove class subjects
      const newClassSubjects = { ...classSubjects };
      delete newClassSubjects[classGrade];
      setClassSubjects(newClassSubjects);
    } else {
      // Add class with no subjects selected initially
      setSelectedClasses([...selectedClasses, classGrade]);
      
      // Initialize empty subject list for this class
      setClassSubjects(prev => ({
        ...prev,
        [classGrade]: []
      }));
    }
  };

  const handleSubjectToggle = (classGrade: number, subjectId: string) => {
    setClassSubjects(prev => {
      const currentSubjects = prev[classGrade] || [];
      const newSubjects = currentSubjects.includes(subjectId)
        ? currentSubjects.filter(id => id !== subjectId)
        : [...currentSubjects, subjectId];
      
      return {
        ...prev,
        [classGrade]: newSubjects
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a teacher name",
        variant: "destructive"
      });
      return;
    }
    
    // Check if at least one subject is selected for each class
    const hasNoSubjects = selectedClasses.some(classGrade => 
      !classSubjects[classGrade] || classSubjects[classGrade].length === 0
    );
    
    if (hasNoSubjects) {
      toast({
        title: "Error",
        description: "Please select at least one subject for each selected class",
        variant: "destructive"
      });
      return;
    }
    
    if (selectedClasses.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one class",
        variant: "destructive"
      });
      return;
    }
    
    // Collect all subjects from all classes (for backward compatibility)
    const allSubjectIds = new Set<string>();
    Object.values(classSubjects).forEach(subjectIds => {
      subjectIds.forEach(id => allSubjectIds.add(id));
    });
    
    const allSubjects = Array.from(allSubjectIds).map(id => {
      const subject = subjects.find(s => s.id === id);
      return subject || { id, name: id, colorClass: '', periodsPerWeek: {} };
    });
    
    const teacher = {
      id: initialTeacher?.id || `t${new Date().getTime()}`,
      name,
      subjects: allSubjects,
      maxPeriods,
      classes: selectedClasses.sort((a, b) => a - b),
      classSubjects: classSubjects
    };
    
    onSave(teacher);
    
    // Dispatch custom event to notify components about teacher update
    const teachersUpdatedEvent = new Event('teachersUpdated');
    window.dispatchEvent(teachersUpdatedEvent);
  };

  // For debugging - check what subjects are available for Class 9
  console.log('Subjects for Class 9:', subjectsByClass[9]);
  console.log('All subjects:', subjects);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Teacher Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter teacher name"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="maxPeriods">Maximum Periods per Week</Label>
          <Input
            id="maxPeriods"
            type="number"
            min={1}
            max={40}
            value={maxPeriods}
            onChange={(e) => setMaxPeriods(parseInt(e.target.value))}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label className="block mb-2">Classes</Label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {Array.from({ length: 12 }, (_, i) => i + 1).map((classGrade) => (
              <div key={classGrade} className="flex items-center space-x-2">
                <Checkbox
                  id={`class-${classGrade}`}
                  checked={selectedClasses.includes(classGrade)}
                  onCheckedChange={() => handleClassToggle(classGrade)}
                />
                <Label htmlFor={`class-${classGrade}`} className="cursor-pointer">
                  Class {classGrade}
                </Label>
              </div>
            ))}
          </div>
        </div>
        
        {selectedClasses.length > 0 && (
          <div>
            <Label className="block mb-2">Subjects by Class</Label>
            <Accordion type="multiple" className="w-full">
              {selectedClasses.map(classGrade => (
                <AccordionItem key={classGrade} value={`class-${classGrade}`}>
                  <AccordionTrigger className="text-left font-medium">
                    Class {classGrade} Subjects {subjectsByClass[classGrade]?.length === 0 && "(No subjects configured)"}
                  </AccordionTrigger>
                  <AccordionContent>
                    <Card className="p-2">
                      {subjectsByClass[classGrade]?.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {subjectsByClass[classGrade].map((subject) => (
                            <div key={subject.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={`subject-${classGrade}-${subject.id}`}
                                checked={classSubjects[classGrade]?.includes(subject.id) || false}
                                onCheckedChange={() => handleSubjectToggle(classGrade, subject.id)}
                              />
                              <Label 
                                htmlFor={`subject-${classGrade}-${subject.id}`} 
                                className={`cursor-pointer ${subject.colorClass}`}
                              >
                                {subject.name} ({subject.periodsPerWeek[classGrade]}/week)
                              </Label>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center text-muted-foreground">
                          No subjects configured for Class {classGrade}. Please add subjects with periods for this class in the Subjects tab.
                        </div>
                      )}
                    </Card>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Teacher</Button>
      </div>
    </form>
  );
};

export default TeacherForm;
