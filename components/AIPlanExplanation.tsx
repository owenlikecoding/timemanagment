'use client';

import React from 'react';
import { Task } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generatePlanExplanation } from '@/lib/taskScoring';

interface AIPlanExplanationProps {
  tasks: Task[];
}

export function AIPlanExplanation({ tasks }: AIPlanExplanationProps) {
  const activeTasks = tasks.filter(t => !t.completed);
  const explanation = generatePlanExplanation(activeTasks);

  if (activeTasks.length === 0) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>🤖</span>
          <span>AI Plan Explanation</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed whitespace-pre-line">
          {explanation}
        </p>
      </CardContent>
    </Card>
  );
}
