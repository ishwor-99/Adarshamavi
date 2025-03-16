
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import ClassList from '@/components/ClassList';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import SubjectManager from '@/components/SubjectManager';

const ClassesPage = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Classes & Subjects</h1>
          <p className="text-muted-foreground mt-1">Manage classes and subject periods</p>
        </div>
        
        <Tabs defaultValue="classes">
          <TabsList className="mb-4">
            <TabsTrigger value="classes">Classes</TabsTrigger>
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
          </TabsList>
          
          <TabsContent value="classes" className="animate-fade-in">
            <ClassList />
          </TabsContent>
          
          <TabsContent value="subjects" className="animate-fade-in">
            <SubjectManager />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ClassesPage;
