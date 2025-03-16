
import React from 'react';
import { Link } from 'react-router-dom';
import { Users, School, CalendarDays, Clock, BookOpen, GraduationCap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MOCK_TEACHERS, MOCK_CLASSES, SUBJECTS } from '@/data/mockData';

const Dashboard = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <section className="text-center mb-12">
        <div className="inline-flex items-center mb-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm">
          School Schedule Management
        </div>
        <h1 className="text-4xl font-bold mt-4 mb-2">Welcome to SchoolSync</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Efficiently manage your school's classes, teachers, and scheduling without conflicts.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="neo-card animate-hover">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5 text-primary" />
              Teachers
            </CardTitle>
            <CardDescription>Manage teaching staff</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{MOCK_TEACHERS.length}</div>
            <p className="text-sm text-muted-foreground">Active teachers</p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link to="/teachers">View Teachers</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="neo-card animate-hover">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <School className="mr-2 h-5 w-5 text-primary" />
              Classes
            </CardTitle>
            <CardDescription>Class grades 1-12</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{MOCK_CLASSES.length}</div>
            <p className="text-sm text-muted-foreground">Active classes</p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link to="/classes">View Classes</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="neo-card animate-hover">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5 text-primary" />
              Subjects
            </CardTitle>
            <CardDescription>Course curriculum</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{SUBJECTS.length}</div>
            <p className="text-sm text-muted-foreground">Different subjects</p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link to="/classes">View Subjects</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="neo-card animate-hover">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <CalendarDays className="mr-2 h-5 w-5 text-primary" />
              Schedule
            </CardTitle>
            <CardDescription>Timetable management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">6</div>
            <p className="text-sm text-muted-foreground">Days per week</p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link to="/schedule">View Schedule</Link>
            </Button>
          </CardFooter>
        </Card>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button asChild className="h-auto py-4 justify-start">
            <Link to="/schedule" className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              <div className="text-left">
                <div className="font-semibold">Generate Schedule</div>
                <div className="text-xs opacity-90">Create conflict-free timetable</div>
              </div>
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="h-auto py-4 justify-start">
            <Link to="/teachers" className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              <div className="text-left">
                <div className="font-semibold">Add New Teacher</div>
                <div className="text-xs opacity-90">Expand your teaching staff</div>
              </div>
            </Link>
          </Button>
          
          <Button asChild variant="secondary" className="h-auto py-4 justify-start">
            <Link to="/classes" className="flex items-center">
              <GraduationCap className="h-5 w-5 mr-2" />
              <div className="text-left">
                <div className="font-semibold">Manage Classes</div>
                <div className="text-xs opacity-90">Configure class subjects</div>
              </div>
            </Link>
          </Button>
        </div>
      </section>

      <section className="mt-12 glass-card rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-4">System Overview</h2>
        <p className="text-muted-foreground mb-6">
          Our school schedule management system ensures:
        </p>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <li className="flex items-start">
            <div className="rounded-full bg-primary/10 p-2 mr-3 mt-0.5">
              <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Automatic Conflict Resolution</h3>
              <p className="text-sm text-muted-foreground">Prevents double-booking teachers across classes</p>
            </div>
          </li>
          <li className="flex items-start">
            <div className="rounded-full bg-primary/10 p-2 mr-3 mt-0.5">
              <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Break Management</h3>
              <p className="text-sm text-muted-foreground">Incorporates short breaks and lunch periods</p>
            </div>
          </li>
          <li className="flex items-start">
            <div className="rounded-full bg-primary/10 p-2 mr-3 mt-0.5">
              <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Workload Balancing</h3>
              <p className="text-sm text-muted-foreground">Limits teachers to maximum 24 periods per week</p>
            </div>
          </li>
          <li className="flex items-start">
            <div className="rounded-full bg-primary/10 p-2 mr-3 mt-0.5">
              <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Different Day Structures</h3>
              <p className="text-sm text-muted-foreground">Handles different schedules for Friday vs. other days</p>
            </div>
          </li>
        </ul>
      </section>
    </div>
  );
};

export default Dashboard;
