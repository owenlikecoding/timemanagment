'use client';

import React from 'react';
import { WeekSchedule, ScheduledTask } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { format } from 'date-fns';

interface ScheduleViewProps {
  schedule: WeekSchedule;
}

export function ScheduleView({ schedule }: ScheduleViewProps) {
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const getBlockColor = (type: string) => {
    switch (type) {
      case 'school': return 'bg-blue-200 border-blue-400';
      case 'practice': return 'bg-green-200 border-green-400';
      case 'sleep': return 'bg-gray-200 border-gray-400';
      case 'available': return 'bg-white border-gray-300';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  const formatTime = (hour: number, minute: number) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Schedule</CardTitle>
        <CardDescription>
          {format(schedule.startDate, 'MMM d')} - {format(schedule.endDate, 'MMM d, yyyy')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {schedule.days.map((day) => (
            <div key={day.day} className="border rounded-lg p-3">
              <h3 className="font-semibold mb-2 text-sm">
                {dayNames[day.day]}
                <span className="text-xs text-muted-foreground ml-2">
                  {format(day.date, 'MMM d')}
                </span>
              </h3>
              <div className="space-y-1">
                {/* Show fixed blocks */}
                {day.blocks
                  .filter(b => b.locked)
                  .sort((a, b) => {
                    const aStart = a.startHour * 60 + a.startMinute;
                    const bStart = b.startHour * 60 + b.startMinute;
                    return aStart - bStart;
                  })
                  .map((block) => (
                    <div
                      key={block.id}
                      className={`text-xs p-2 rounded border ${getBlockColor(block.type)}`}
                    >
                      <div className="font-medium">{block.title}</div>
                      <div className="text-muted-foreground">
                        {formatTime(block.startHour, block.startMinute)} -{' '}
                        {formatTime(block.endHour, block.endMinute)}
                      </div>
                    </div>
                  ))}
                
                {/* Show scheduled tasks */}
                {day.scheduledTasks.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {day.scheduledTasks.map((scheduled, idx) => (
                      <div
                        key={idx}
                        className="text-xs p-2 rounded border bg-purple-50 border-purple-300"
                      >
                        <div className="font-medium text-purple-900">
                          {scheduled.task.title}
                        </div>
                        <div className="text-purple-700">
                          {formatTime(scheduled.block.startHour, scheduled.block.startMinute)}
                          {' '}({scheduled.task.estimatedMinutes}m)
                        </div>
                        {scheduled.task.business && (
                          <div className="text-purple-600 text-xs mt-1">
                            {scheduled.task.business === 'palmetto-home-care' ? 'PHC' : 'Nirvo'}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Show if day has available time */}
                {day.scheduledTasks.length === 0 && 
                 day.blocks.filter(b => !b.locked).length > 0 && (
                  <div className="text-xs text-muted-foreground italic p-2">
                    Available time slots
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
