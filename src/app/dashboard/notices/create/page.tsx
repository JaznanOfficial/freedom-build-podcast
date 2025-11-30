'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  CalendarDays,
  Users,
  CreditCard,
  Megaphone,
  AlertCircle,
  GraduationCap,
  UserSquare,
  Sparkles,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';

const categories = [
  { id: 'exam', name: 'Exam Notice', icon: FileText, color: 'from-blue-500 to-cyan-500' },
  { id: 'holiday', name: 'Holiday Notice', icon: CalendarDays, color: 'from-green-500 to-teal-500' },
  { id: 'meeting', name: 'Parent Meeting', icon: Users, color: 'from-purple-500 to-pink-500' },
  { id: 'fee', name: 'Fee Deadline', icon: CreditCard, color: 'from-orange-500 to-red-500' },
  { id: 'event', name: 'Event Announcement', icon: Megaphone, color: 'from-indigo-500 to-purple-500' },
  { id: 'disciplinary', name: 'Disciplinary Notice', icon: AlertCircle, color: 'from-red-500 to-pink-500' },
  { id: 'staff', name: 'Staff Meeting', icon: UserSquare, color: 'from-gray-500 to-slate-500' },
  { id: 'admission', name: 'Admission Notice', icon: GraduationCap, color: 'from-teal-500 to-cyan-500' },
];

export default function CreateNoticePage() {
  const [step, setStep] = useState<'category' | 'form' | 'preview'>('category');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setStep('form');
  };

  const category = categories.find((c) => c.id === selectedCategory);

  return (
    <div className="py-4 md:py-6 px-4 lg:px-6">
      <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Notice</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {step === 'category' && 'Select a category to get started'}
            {step === 'form' && 'Fill in the details for your notice'}
            {step === 'preview' && 'Review and generate your notice'}
          </p>
        </div>
        {step !== 'category' && (
          <Button variant="outline" onClick={() => setStep(step === 'preview' ? 'form' : 'category')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        )}
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-2">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'category' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
          1
        </div>
        <div className="w-16 h-1 bg-gray-200" />
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'form' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
          2
        </div>
        <div className="w-16 h-1 bg-gray-200" />
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'preview' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
          3
        </div>
      </div>

      {/* Category Selection */}
      {step === 'category' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Card
                key={cat.id}
                className="cursor-pointer hover:border-indigo-600 transition-all hover:shadow-lg group"
                onClick={() => handleCategorySelect(cat.id)}
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{cat.name}</CardTitle>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      )}

      {/* Form Step */}
      {step === 'form' && category && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                {/* @ts-ignore */}
                <category.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle>{category.name}</CardTitle>
                <CardDescription>Fill in the required details</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Notice Title</Label>
                <Input id="title" placeholder="Enter notice title" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="bn">Bengali</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="audience">Audience</Label>
                <Select defaultValue="students">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="students">Students</SelectItem>
                    <SelectItem value="parents">Parents</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="all">All</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="class">Class/Department</Label>
                <Input id="class" placeholder="e.g., Class 10A or Science Dept" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="details">Additional Details</Label>
              <Textarea
                id="details"
                placeholder="Provide any additional information that should be included in the notice"
                rows={5}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setStep('category')}>
                Cancel
              </Button>
              <Button
                onClick={() => setStep('preview')}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Notice
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview Step */}
      {step === 'preview' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Generated Notice</CardTitle>
              <CardDescription>AI-generated content based on your input</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert max-w-none">
                <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border min-h-[400px]">
                  <h2 className="text-xl font-bold mb-4">Exam Schedule Announcement</h2>
                  <p className="mb-4">Dear Students and Parents,</p>
                  <p className="mb-4">
                    This is to inform you that the final examination for Class 10A will commence from 15th December 2024. 
                    Please find the detailed schedule below and prepare accordingly.
                  </p>
                  <p className="mb-4">
                    All students are required to arrive at the examination hall 15 minutes before the scheduled time. 
                    Please bring your admit card and necessary stationery.
                  </p>
                  <p className="mt-6">
                    Best regards,<br />
                    Springfield High School Administration
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recipients</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <span className="font-medium">Students (Class 10A)</span>
                  <Badge>45 recipients</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                  <span className="font-medium">Parents</span>
                  <Badge>45 recipients</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  Edit Notice
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Regenerate
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Download PDF
                </Button>
                <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                  Publish & Send Emails
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
