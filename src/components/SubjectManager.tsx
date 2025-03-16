
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SUBJECTS } from '@/data/mockData';
import { Subject } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Edit2, Plus, Trash2 } from 'lucide-react';
import SubjectPeriodForm from './SubjectPeriodForm';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const SubjectManager: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>(SUBJECTS);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [deleteSubjectId, setDeleteSubjectId] = useState<string | null>(null);
  const [newSubject, setNewSubject] = useState({
    name: '',
    id: '',
    colorClass: 'subject-default'
  });
  const { toast } = useToast();

  // Color classes for new subjects
  const colorClasses = [
    'subject-red', 'subject-blue', 'subject-green', 'subject-purple', 
    'subject-yellow', 'subject-indigo', 'subject-pink', 'subject-orange'
  ];

  // Load subjects from localStorage if available
  useEffect(() => {
    try {
      const savedSubjects = localStorage.getItem('subjects');
      if (savedSubjects) {
        setSubjects(JSON.parse(savedSubjects));
      }
    } catch (error) {
      console.error('Failed to load subjects from localStorage:', error);
    }
  }, []);

  // Save subjects to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('subjects', JSON.stringify(subjects));
    } catch (error) {
      console.error('Failed to save subjects to localStorage:', error);
    }
  }, [subjects]);

  const handleEditSubject = (subject: Subject) => {
    setEditingSubject(subject);
  };

  const handleSaveSubject = (updatedSubject: Subject) => {
    const updatedSubjects = subjects.map(s => 
      s.id === updatedSubject.id ? updatedSubject : s
    );
    
    setSubjects(updatedSubjects);
    setEditingSubject(null);
    
    toast({
      title: "Subject Updated",
      description: `${updatedSubject.name} has been updated successfully.`
    });
  };

  const handleCancelEdit = () => {
    setEditingSubject(null);
  };

  const handleAddNewSubject = () => {
    // Validate inputs
    if (!newSubject.name.trim()) {
      toast({
        title: "Error",
        description: "Subject name is required",
        variant: "destructive"
      });
      return;
    }

    // Create ID from name if empty
    const subjectId = newSubject.id.trim() || newSubject.name.toLowerCase().replace(/\s+/g, '_');
    
    // Check if ID already exists
    if (subjects.some(s => s.id === subjectId)) {
      toast({
        title: "Error",
        description: "A subject with this ID already exists",
        variant: "destructive"
      });
      return;
    }

    // Create new subject with empty periods
    const periodsPerWeek: Record<number, number> = {};
    for (let i = 1; i <= 12; i++) {
      periodsPerWeek[i] = 0;
    }

    const subject: Subject = {
      id: subjectId,
      name: newSubject.name,
      colorClass: newSubject.colorClass,
      periodsPerWeek
    };

    setSubjects([...subjects, subject]);
    setIsAddDialogOpen(false);
    setNewSubject({ name: '', id: '', colorClass: 'subject-default' });

    toast({
      title: "Subject Added",
      description: `${subject.name} has been added successfully.`
    });
  };

  const handleDeleteSubject = (subjectId: string) => {
    // First, check if this subject is being used in any class
    try {
      const savedClasses = localStorage.getItem('classes');
      if (savedClasses) {
        const classes = JSON.parse(savedClasses);
        const isUsed = classes.some((c: any) => 
          c.subjects.some((s: any) => s.id === subjectId)
        );
        
        if (isUsed) {
          toast({
            title: "Cannot Delete Subject",
            description: "This subject is currently used in one or more classes. Remove it from classes first.",
            variant: "destructive"
          });
          setDeleteSubjectId(null);
          return;
        }
      }
    } catch (error) {
      console.error('Error checking subject usage:', error);
    }
    
    // If not used, proceed with deletion
    const updatedSubjects = subjects.filter(s => s.id !== subjectId);
    setSubjects(updatedSubjects);
    setDeleteSubjectId(null);
    
    toast({
      title: "Subject Deleted",
      description: "The subject has been removed successfully."
    });
  };

  if (editingSubject) {
    return (
      <SubjectPeriodForm 
        subject={editingSubject}
        onSave={handleSaveSubject}
        onCancel={handleCancelEdit}
      />
    );
  }

  const subjectToDelete = subjects.find(s => s.id === deleteSubjectId);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Manage Subjects</CardTitle>
        <Button 
          onClick={() => setIsAddDialogOpen(true)} 
          size="sm"
          className="gap-1"
        >
          <Plus className="h-4 w-4" /> Add Subject
        </Button>
      </CardHeader>
      <CardContent>
        {subjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <p className="text-muted-foreground mb-4">No subjects defined yet. Add your first subject to get started.</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <Plus className="h-4 w-4" /> Add Subject
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="border p-2 text-left">Subject</th>
                  <th className="border p-2 text-left">Color</th>
                  <th className="border p-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((subject) => (
                  <tr key={subject.id} className="hover:bg-muted/50">
                    <td className="border p-2">
                      <div className="font-medium">{subject.name}</div>
                      <div className="text-xs text-muted-foreground">ID: {subject.id}</div>
                    </td>
                    <td className="border p-2">
                      <div className={`w-6 h-6 rounded ${subject.colorClass}`}></div>
                    </td>
                    <td className="border p-2 text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditSubject(subject)}
                          title="Edit Period Hours"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteSubjectId(subject.id)}
                          title="Delete Subject"
                          className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>

      {/* Add Subject Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Subject</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="subject-name">Subject Name</Label>
              <Input 
                id="subject-name" 
                value={newSubject.name}
                onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
                placeholder="e.g., Mathematics"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subject-id">Subject ID (optional)</Label>
              <Input 
                id="subject-id" 
                value={newSubject.id}
                onChange={(e) => setNewSubject({...newSubject, id: e.target.value})}
                placeholder="e.g., math (auto-generated if empty)"
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to auto-generate from name
              </p>
            </div>
            
            <div className="space-y-2">
              <Label>Subject Color</Label>
              <div className="grid grid-cols-4 gap-2">
                {colorClasses.map((colorClass) => (
                  <button
                    key={colorClass}
                    type="button"
                    className={`w-full h-10 rounded-md border-2 ${
                      newSubject.colorClass === colorClass ? 'border-primary' : 'border-transparent'
                    }`}
                    onClick={() => setNewSubject({...newSubject, colorClass})}
                  >
                    <div className={`w-full h-full rounded-sm ${colorClass}`}></div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddNewSubject}>
              Add Subject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Subject Confirmation */}
      <AlertDialog open={!!deleteSubjectId} onOpenChange={(open) => !open && setDeleteSubjectId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Subject</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {subjectToDelete?.name}? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteSubjectId && handleDeleteSubject(deleteSubjectId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default SubjectManager;
