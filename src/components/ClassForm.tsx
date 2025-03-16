
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ClassGrade } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface ClassFormProps {
  onSave: (classData: ClassGrade) => void;
  onCancel: () => void;
  classData?: ClassGrade;
  isEditing?: boolean;
}

const ClassForm: React.FC<ClassFormProps> = ({ 
  onSave, 
  onCancel, 
  classData,
  isEditing = false 
}) => {
  const [grade, setGrade] = useState<number | string>(classData?.grade || 1);
  const [section, setSection] = useState<string>(classData?.section || 'A');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert grade to number for validation
    const gradeNumber = Number(grade);
    
    if (isNaN(gradeNumber) || gradeNumber < 1 || gradeNumber > 12) {
      toast({
        title: "Invalid Grade",
        description: "Grade must be between 1 and 12",
        variant: "destructive"
      });
      return;
    }

    if (!section.trim()) {
      toast({
        title: "Invalid Section",
        description: "Section cannot be empty",
        variant: "destructive"
      });
      return;
    }

    const updatedClass: ClassGrade = {
      id: classData?.id || `class-${Date.now()}`,
      grade: gradeNumber,
      section,
      subjects: classData?.subjects || []
    };

    onSave(updatedClass);
  };

  const handleGradeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow empty input for better UX
    if (e.target.value === '') {
      setGrade('');
    } else {
      // Only update if it's a valid number
      const value = e.target.value;
      setGrade(value);
    }
  };

  return (
    <Card className="w-full animate-fade-in">
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Class' : 'Add New Class'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="class-form" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="grade">Grade</Label>
              <Input
                id="grade"
                type="number"
                min={1}
                max={12}
                value={grade}
                onChange={handleGradeChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="section">Section</Label>
              <Input
                id="section"
                value={section}
                onChange={(e) => setSection(e.target.value)}
                maxLength={1}
              />
              <p className="text-xs text-muted-foreground">Usually a single letter like A, B, C, etc.</p>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" form="class-form">
          {isEditing ? 'Save Changes' : 'Add Class'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ClassForm;
