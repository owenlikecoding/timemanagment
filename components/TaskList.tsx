'use client';

import React from 'react';
import { Task } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { scoreTask } from '@/lib/taskScoring';
import { format } from 'date-fns';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export function TaskList({ tasks, onToggleComplete, onDeleteTask }: TaskListProps) {
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return scoreTask(b) - scoreTask(a);
  });

  const getBusinessBadgeColor = (business?: string) => {
    if (business === 'palmetto-home-care') return 'bg-green-100 text-green-800';
    if (business === 'nirvo-ai') return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getBusinessLabel = (business?: string) => {
    if (business === 'palmetto-home-care') return 'PHC';
    if (business === 'nirvo-ai') return 'Nirvo';
    return 'Personal';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tasks ({tasks.filter(t => !t.completed).length} active)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedTasks.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No tasks yet. Add your first task to get started!
            </p>
          ) : (
            sortedTasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 border rounded-lg ${
                  task.completed ? 'bg-muted opacity-60' : 'bg-card'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => onToggleComplete(task.id)}
                      className="mt-1 h-4 w-4 rounded border-gray-300"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4
                          className={`font-medium ${
                            task.completed ? 'line-through' : ''
                          }`}
                        >
                          {task.title}
                        </h4>
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${getBusinessBadgeColor(
                            task.business
                          )}`}
                        >
                          {getBusinessLabel(task.business)}
                        </span>
                        {task.revenue && (
                          <span className="text-xs px-2 py-0.5 rounded bg-yellow-100 text-yellow-800">
                            ${task.revenue}
                          </span>
                        )}
                      </div>
                      {task.description && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {task.description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span>⏰ {format(task.deadline, 'MMM d, h:mm a')}</span>
                        <span>⏱️ {task.estimatedMinutes} min</span>
                        <span>📊 Urgency: {task.urgency}/10</span>
                        <span>⚡ Energy: {task.energyRequired}</span>
                        {!task.completed && (
                          <span className="font-medium text-primary">
                            Score: {Math.round(scoreTask(task))}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteTask(task.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
