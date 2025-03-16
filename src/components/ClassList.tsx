
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GraduationCap, Edit, Plus, Pencil, Trash2 } from 'lucide-react';
import { Subject, ClassGrade } from '@/types';
import { useToast } from '@/hooks/use-toast';
import ClassSubjectForm from './ClassSubjectForm';
import ClassForm from './ClassForm';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const ClassList = () => {
  const [classes, setClasses] = useState<ClassGrade[]>([]);
  const [editingClass, setEditingClass] = useState<ClassGrade | null>(null);
  const [addingNewClass, setAddingNewClass] = useState(false);
  const [editingClassInfo, setEditingClassInfo] = useState<ClassGrade | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [confirmDeleteClass, setConfirmDeleteClass] = useState<ClassGrade | null>(null);
  const { toast } = useToast();

  // Load classes and subjects from localStorage on initial render
  useEffect(() => {
    try {
      // Load subjects first
      const savedSubjects = localStorage.getItem('subjects');
      const loadedSubjects = savedSubjects ? JSON.parse(savedSubjects) : [];
      setSubjects(loadedSubjects);
      
      // Then load classes
      const savedClasses = localStorage.getItem('classes');
      if (savedClasses) {
        const parsedClasses = JSON.parse(savedClasses);
        
        // Normalize classes to ensure their subjects are up-to-date
        const normalizedClasses = parsedClasses.map((classGrade: ClassGrade) => {
          // For each class, make sure the subjects are actual objects, not just IDs
          // And make sure they still exist in our current subjects list
          const validSubjects = classGrade.subjects
            .map((subject: Subject | any) => {
              const subjectId = typeof subject === 'object' ? subject.id : subject;
              return loadedSubjects.find((s: Subject) => s.id === subjectId);
            })
            .filter(Boolean); // Remove any undefined subjects (they may have been deleted)
          
          return {
            ...classGrade,
            subjects: validSubjects
          };
        });
        
        setClasses(normalizedClasses);
      } else {
        // Initialize with empty classes array instead of mock data
        setClasses([]);
      }
    } catch (error) {
      console.error('Failed to load data from localStorage:', error);
      setClasses([]);
    }
  }, []);

  // Save classes to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('classes', JSON.stringify(classes));
      
      // Dispatch a custom event to notify other components that class data has changed
      window.dispatchEvent(new CustomEvent('classesUpdated', {
        detail: { classes }
      }));
    } catch (error) {
      console.error('Failed to save classes to localStorage:', error);
    }
  }, [classes]);

  const handleEditClass = (classGrade: ClassGrade) => {
    setEditingClass(classGrade);
  };

  const handleEditClassInfo = (classGrade: ClassGrade) => {
    setEditingClassInfo(classGrade);
  };

  const handleAddNewClass = () => {
    setAddingNewClass(true);
  };

  const handleSaveClass = (updatedClass: ClassGrade) => {
    const updatedClasses = classes.map(c => 
      c.id === updatedClass.id ? updatedClass : c
    );
    
    setClasses(updatedClasses);
    setEditingClass(null);
    
    toast({
      title: "Class Updated",
      description: `Class ${updatedClass.grade}${updatedClass.section} subjects have been updated successfully.`
    });
  };

  const handleSaveClassInfo = (classData: ClassGrade) => {
    if (editingClassInfo) {
      // Update existing class
      const updatedClasses = classes.map(c => 
        c.id === classData.id ? classData : c
      );
      
      setClasses(updatedClasses);
      setEditingClassInfo(null);
      
      toast({
        title: "Class Updated",
        description: `Class ${classData.grade}${classData.section} has been updated successfully.`
      });
    } else {
      // Add new class
      // Check if class with same grade and section already exists
      const existingClass = classes.find(
        c => c.grade === classData.grade && c.section === classData.section
      );
      
      if (existingClass) {
        toast({
          title: "Class Already Exists",
          description: `Class ${classData.grade}${classData.section} already exists.`,
          variant: "destructive"
        });
        return;
      }
      
      setClasses([...classes, classData]);
      setAddingNewClass(false);
      
      toast({
        title: "Class Added",
        description: `Class ${classData.grade}${classData.section} has been added successfully.`
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingClass(null);
  };

  const handleCancelClassInfo = () => {
    setEditingClassInfo(null);
    setAddingNewClass(false);
  };

  const handleDeleteClass = (classGrade: ClassGrade) => {
    setConfirmDeleteClass(classGrade);
  };

  const confirmDelete = () => {
    if (confirmDeleteClass) {
      const updatedClasses = classes.filter(c => c.id !== confirmDeleteClass.id);
      setClasses(updatedClasses);
      setConfirmDeleteClass(null);
      
      toast({
        title: "Class Deleted",
        description: `Class ${confirmDeleteClass.grade}${confirmDeleteClass.section} has been deleted.`
      });
    }
  };

  if (editingClass) {
    return (
      <ClassSubjectForm 
        classGrade={editingClass}
        onSave={handleSaveClass}
        onCancel={handleCancelEdit}
      />
    );
  }

  if (addingNewClass || editingClassInfo) {
    return (
      <ClassForm
        onSave={handleSaveClassInfo}
        onCancel={handleCancelClassInfo}
        classData={editingClassInfo || undefined}
        isEditing={!!editingClassInfo}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Classes</h2>
        <Button onClick={handleAddNewClass} className="flex items-center gap-1">
          <Plus className="h-4 w-4" /> Add Class
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.length > 0 ? (
          classes.map((classGrade) => (
            <Card key={classGrade.id} className="neo-card animate-hover">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <GraduationCap className="mr-2 h-5 w-5 text-primary" />
                    Class {classGrade.grade}{classGrade.section}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditClassInfo(classGrade)}
                      title="Edit Class Details"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditClass(classGrade)}
                      title={classGrade.subjects.length > 0 ? "Edit Class Subjects" : "Add Subjects"}
                    >
                      {classGrade.subjects.length > 0 ? (
                        <Edit className="h-4 w-4" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClass(classGrade)}
                      title="Delete Class"
                      className="text-destructive hover:text-destructive/90"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {classGrade.subjects && classGrade.subjects.length > 0 ? (
                  <>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Subjects:</h3>
                    <div className="flex flex-wrap gap-1">
                      {classGrade.subjects.map((subject: Subject) => (
                        <Badge key={subject.id} variant="secondary" className={subject.colorClass}>
                          {subject.name}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Periods per week:</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Subject</TableHead>
                            <TableHead className="text-right">Periods</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {classGrade.subjects.map((subject: Subject) => (
                            <TableRow key={subject.id}>
                              <TableCell>{subject.name}</TableCell>
                              <TableCell className="text-right">
                                {subject.periodsPerWeek[classGrade.grade]}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 text-center">
                    <p className="text-muted-foreground mb-4">No subjects assigned to this class yet.</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-1"
                      onClick={() => handleEditClass(classGrade)}
                    >
                      <Plus className="h-4 w-4" /> Add Subjects
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 p-6 bg-muted/20 rounded-lg text-center">
            <p className="text-muted-foreground mb-4">No classes configured yet.</p>
            <p className="text-sm">Click the "Add Class" button to create your first class.</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={confirmDeleteClass !== null} 
        onOpenChange={(open) => !open && setConfirmDeleteClass(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete Class {confirmDeleteClass?.grade}{confirmDeleteClass?.section}? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteClass(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClassList;
