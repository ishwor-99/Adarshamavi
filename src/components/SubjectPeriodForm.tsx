
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Subject } from '@/types';
import { MOCK_CLASSES } from '@/data/mockData';

interface SubjectPeriodFormProps {
  subject: Subject;
  onSave: (updatedSubject: Subject) => void;
  onCancel: () => void;
}

const SubjectPeriodForm: React.FC<SubjectPeriodFormProps> = ({
  subject,
  onSave,
  onCancel
}) => {
  const [periodsPerWeek, setPeriodsPerWeek] = useState({ ...subject.periodsPerWeek });
  const { toast } = useToast();

  const handleInputChange = (grade: number, value: string) => {
    const numValue = parseInt(value) || 0;
    setPeriodsPerWeek(prev => ({
      ...prev,
      [grade]: numValue
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create updated subject
    const updatedSubject: Subject = {
      ...subject,
      periodsPerWeek
    };
    
    onSave(updatedSubject);
    
    toast({
      title: "Periods Updated",
      description: `Periods for ${subject.name} have been updated successfully.`
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Edit Period Hours for {subject.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} id="period-form">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-2">
              Set the number of periods per week for each grade level:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {MOCK_CLASSES.map((classGrade) => (
                <div key={classGrade.id} className="space-y-2">
                  <Label htmlFor={`grade-${classGrade.grade}`}>
                    Grade {classGrade.grade}
                  </Label>
                  <Input
                    id={`grade-${classGrade.grade}`}
                    type="number"
                    min="0"
                    max="10"
                    value={periodsPerWeek[classGrade.grade] || 0}
                    onChange={(e) => handleInputChange(classGrade.grade, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" form="period-form">
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SubjectPeriodForm;
