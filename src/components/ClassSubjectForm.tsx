
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ClassGrade, Subject } from '@/types';
import { AlertCircle, Plus } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ClassSubjectFormProps {
  classGrade: ClassGrade;
  onSave: (updatedClass: ClassGrade) => void;
  onCancel: () => void;
}

const ClassSubjectForm: React.FC<ClassSubjectFormProps> = ({
  classGrade,
  onSave,
  onCancel
}) => {
  // State to track selected subject IDs
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<Set<string>>(new Set());
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const { toast } = useToast();

  // Load subjects from localStorage if available and initialize selected subjects
  useEffect(() => {
    try {
      // Load all subjects
      const savedSubjects = localStorage.getItem('subjects');
      const allSubjects = savedSubjects ? JSON.parse(savedSubjects) : [];
      setSubjects(allSubjects);
      
      // Find which subjects are already selected for this class
      // and initialize the selectedSubjectIds Set
      if (classGrade.subjects && classGrade.subjects.length > 0) {
        const initialSubjectIds = new Set(
          classGrade.subjects
            .map(subject => typeof subject === 'object' ? subject.id : subject)
            .filter(id => allSubjects.some((s: Subject) => s.id === id))
        );
        setSelectedSubjectIds(initialSubjectIds);
      }
    } catch (error) {
      console.error('Failed to load subjects from localStorage:', error);
      setSubjects([]);
    }
  }, [classGrade]);

  // Get all available subjects for this grade level
  const availableSubjects = subjects.filter(subject => 
    subject.periodsPerWeek && 
    subject.periodsPerWeek[classGrade.grade] > 0
  );

  const handleSubjectToggle = (subjectId: string) => {
    setSelectedSubjectIds(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(subjectId)) {
        newSelected.delete(subjectId);
      } else {
        newSelected.add(subjectId);
      }
      return newSelected;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create updated class with selected subjects
    const selectedSubjects = subjects.filter(subject => 
      selectedSubjectIds.has(subject.id)
    );
    
    // Create updated class
    const updatedClass: ClassGrade = {
      ...classGrade,
      subjects: selectedSubjects
    };
    
    onSave(updatedClass);
  };

  const noSubjectsConfigured = subjects.length === 0 || 
    subjects.every(subject => !subject.periodsPerWeek || subject.periodsPerWeek[classGrade.grade] === 0);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {classGrade.subjects.length > 0 
            ? `Edit Subjects for Class ${classGrade.grade}${classGrade.section}`
            : `Add Subjects to Class ${classGrade.grade}${classGrade.section}`
          }
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form id="class-subject-form" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-2">
              Select the subjects to be taught in this class:
            </p>
            
            {noSubjectsConfigured && (
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No subjects configured</AlertTitle>
                <AlertDescription>
                  You need to create subjects and set their periods per week for Grade {classGrade.grade} first.
                  Go to the "Subjects" tab, create subjects, and then edit each subject to set the number of periods for this grade.
                </AlertDescription>
              </Alert>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {availableSubjects.map((subject) => (
                <div key={subject.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`subject-${subject.id}`}
                    checked={selectedSubjectIds.has(subject.id)}
                    onCheckedChange={() => handleSubjectToggle(subject.id)}
                  />
                  <Label 
                    htmlFor={`subject-${subject.id}`} 
                    className={`cursor-pointer ${subject.colorClass}`}
                  >
                    {subject.name} ({subject.periodsPerWeek[classGrade.grade]}/week)
                  </Label>
                </div>
              ))}
            </div>

            {availableSubjects.length === 0 && !noSubjectsConfigured && (
              <div className="text-center p-4 bg-muted rounded-md">
                No subjects available for this class grade. Configure subjects first by adding periods per week for this grade level.
              </div>
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" form="class-subject-form">
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ClassSubjectForm;
