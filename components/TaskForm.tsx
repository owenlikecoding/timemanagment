'use client';

import React, { useState } from 'react';
import { Task } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

interface TaskFormProps {
  onAddTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void;
}

export function TaskForm({ onAddTask }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [estimatedMinutes, setEstimatedMinutes] = useState('60');
  const [business, setBusiness] = useState<'nirvo-ai' | 'palmetto-home-care' | ''>('');
  const [revenue, setRevenue] = useState('');
  const [urgency, setUrgency] = useState('5');
  const [energyRequired, setEnergyRequired] = useState<'low' | 'medium' | 'high'>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !deadline) {
      alert('Please fill in title and deadline');
      return;
    }

    onAddTask({
      title,
      description: description || undefined,
      deadline: new Date(deadline),
      estimatedMinutes: parseInt(estimatedMinutes),
      business: business || undefined,
      revenue: revenue ? parseFloat(revenue) : undefined,
      urgency: parseInt(urgency),
      energyRequired,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setDeadline('');
    setEstimatedMinutes('60');
    setBusiness('');
    setRevenue('');
    setUrgency('5');
    setEnergyRequired('medium');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Task</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Task Title *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Complete project proposal"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Additional details..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Deadline *</label>
              <Input
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Estimated Time (minutes)</label>
              <Input
                type="number"
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(e.target.value)}
                min="15"
                step="15"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Business</label>
              <select
                value={business}
                onChange={(e) => setBusiness(e.target.value as any)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">None</option>
                <option value="nirvo-ai">Nirvo AI (SaaS)</option>
                <option value="palmetto-home-care">Palmetto Home Care</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Expected Revenue ($)</label>
              <Input
                type="number"
                value={revenue}
                onChange={(e) => setRevenue(e.target.value)}
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Urgency: {urgency}
              </label>
              <input
                type="range"
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                min="1"
                max="10"
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Energy Required</label>
              <select
                value={energyRequired}
                onChange={(e) => setEnergyRequired(e.target.value as any)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <Button type="submit" className="w-full">
            Add Task
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
