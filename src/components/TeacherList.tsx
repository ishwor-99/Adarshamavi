
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { MOCK_TEACHERS, SUBJECTS } from '@/data/mockData';
import { Teacher, Subject } from '@/types';
import TeacherForm from './TeacherForm';
import { useToast } from '@/hooks/use-toast';

const TeacherList = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const { toast } = useToast();

  // Load teachers from localStorage on initial render
  useEffect(() => {
    try {
      const savedTeachers = localStorage.getItem('teachers');
      if (savedTeachers) {
        // Get the latest subjects from localStorage
        const savedSubjects = localStorage.getItem('subjects');
        const currentSubjects = savedSubjects ? JSON.parse(savedSubjects) : SUBJECTS;
        
        // Make sure subjects are fully formed objects, not just references
        const parsedTeachers = JSON.parse(savedTeachers);
        
        // Ensure each teacher has proper subject objects with all properties
        const normalizedTeachers = parsedTeachers.map((teacher: Teacher) => {
          return {
            ...teacher,
            // Find the full subject objects from current subjects using the id
            subjects: teacher.subjects
              .map((subject: Subject | any) => {
                const subjectId = typeof subject === 'object' ? subject.id : subject;
                return currentSubjects.find((s: Subject) => s.id === subjectId);
              })
              .filter(Boolean) // Remove any undefined subjects (they may have been deleted)
          };
        });
        
        setTeachers(normalizedTeachers);
      } else {
        // If no saved teachers, initialize with empty array instead of mock data
        setTeachers([]);
      }
    } catch (error) {
      console.error('Failed to parse teachers from localStorage:', error);
      setTeachers([]);
    }
  }, []);

  // Save teachers to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('teachers', JSON.stringify(teachers));
  }, [teachers]);

  const handleAddTeacher = () => {
    setEditingTeacher(null);
    setIsFormOpen(true);
  };

  const handleEditTeacher = (teacher: Teacher) => {
    // Deep clone the teacher object to prevent direct reference issues
    const teacherToEdit = {
      ...teacher,
      subjects: teacher.subjects.map(subject => ({...subject})),
      classes: [...teacher.classes],
    };
    
    setEditingTeacher(teacherToEdit);
    setIsFormOpen(true);
  };

  const handleSaveTeacher = (teacher: Teacher) => {
    if (editingTeacher) {
      // Update existing teacher
      const updatedTeachers = teachers.map(t => 
        t.id === teacher.id ? teacher : t
      );
      setTeachers(updatedTeachers);
      toast({
        title: "Success",
        description: "Teacher updated successfully"
      });
    } else {
      // Add new teacher with unique ID
      const newTeacher = {
        ...teacher,
        id: `t${Date.now()}`  // Use timestamp for guaranteed uniqueness
      };
      setTeachers([...teachers, newTeacher]);
      toast({
        title: "Success",
        description: "Teacher added successfully"
      });
    }
    setIsFormOpen(false);
    setEditingTeacher(null);
  };

  const handleDeleteTeacher = (teacherId: string) => {
    const updatedTeachers = teachers.filter(t => t.id !== teacherId);
    setTeachers(updatedTeachers);
    toast({
      title: "Success",
      description: "Teacher deleted successfully"
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-3xl font-bold">Teachers</h2>
        <Button onClick={handleAddTeacher} className="animate-hover flex items-center gap-2 w-full sm:w-auto">
          <PlusCircle className="h-4 w-4" />
          Add Teacher
        </Button>
      </div>

      {isFormOpen && (
        <Card className="animate-scale-in">
          <CardHeader>
            <CardTitle>{editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}</CardTitle>
          </CardHeader>
          <CardContent>
            <TeacherForm 
              initialTeacher={editingTeacher} 
              onSave={handleSaveTeacher} 
              onCancel={() => {
                setIsFormOpen(false);
                setEditingTeacher(null);
              }} 
            />
          </CardContent>
        </Card>
      )}

      <Card className="neo-card">
        <CardContent className="p-0 sm:p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Subjects</TableHead>
                  <TableHead className="hidden sm:table-cell">Classes</TableHead>
                  <TableHead className="hidden sm:table-cell">Max Periods</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teachers.length > 0 ? (
                  teachers.map((teacher) => (
                    <TableRow key={teacher.id} className="animate-hover">
                      <TableCell className="font-medium">
                        {teacher.name}
                        <div className="md:hidden mt-2">
                          <div className="text-sm text-muted-foreground">Max: {teacher.maxPeriods} periods</div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {teacher.subjects.map((subject: Subject) => (
                            <Badge key={subject.id} variant="secondary" className={subject.colorClass}>
                              {subject.name}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {teacher.classes.map((classGrade: number) => (
                            <Badge key={classGrade} variant="outline" className={`class-${classGrade}`}>
                              Class {classGrade}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">{teacher.maxPeriods}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="icon" onClick={() => handleEditTeacher(teacher)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="icon" onClick={() => handleDeleteTeacher(teacher.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6">
                      <p className="text-muted-foreground">No teachers added yet. Click "Add Teacher" to create your first teacher.</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherList;
