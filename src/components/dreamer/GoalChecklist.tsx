"use client";

import type { Goal } from '@/types';
import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Trash2, Target } from 'lucide-react';

interface GoalChecklistProps {
  initialGoals?: Goal[];
  onGoalsChange?: (goals: Goal[]) => void; // For parent component to sync
}

export default function GoalChecklist({ initialGoals = [], onGoalsChange }: GoalChecklistProps) {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [newGoalText, setNewGoalText] = useState('');

  const handleAddGoal = (e: FormEvent) => {
    e.preventDefault();
    if (newGoalText.trim() === '') return;
    const newGoal: Goal = {
      id: Date.now().toString(),
      text: newGoalText.trim(),
      completed: false,
    };
    const updatedGoals = [...goals, newGoal];
    setGoals(updatedGoals);
    onGoalsChange?.(updatedGoals);
    setNewGoalText('');
  };

  const toggleGoalCompletion = (id: string) => {
    const updatedGoals = goals.map(goal =>
      goal.id === id ? { ...goal, completed: !goal.completed } : goal
    );
    setGoals(updatedGoals);
    onGoalsChange?.(updatedGoals);
  };

  const deleteGoal = (id: string) => {
    const updatedGoals = goals.filter(goal => goal.id !== id);
    setGoals(updatedGoals);
    onGoalsChange?.(updatedGoals);
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Target className="mr-2 h-6 w-6 text-primary" />
          Project Goals
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddGoal} className="flex gap-2 mb-4">
          <Input
            type="text"
            value={newGoalText}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setNewGoalText(e.target.value)}
            placeholder="Add a new goal..."
            className="flex-grow"
          />
          <Button type="submit" size="icon" variant="outline">
            <PlusCircle className="h-5 w-5 text-primary" />
            <span className="sr-only">Add Goal</span>
          </Button>
        </form>
        {goals.length === 0 && <p className="text-sm text-muted-foreground">No goals set yet. Add your first goal to get started!</p>}
        <ul className="space-y-3">
          {goals.map(goal => (
            <li key={goal.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id={`goal-${goal.id}`}
                  checked={goal.completed}
                  onCheckedChange={() => toggleGoalCompletion(goal.id)}
                />
                <Label
                  htmlFor={`goal-${goal.id}`}
                  className={`cursor-pointer ${goal.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}
                >
                  {goal.text}
                </Label>
              </div>
              <Button variant="ghost" size="icon" onClick={() => deleteGoal(goal.id)} aria-label="Delete goal">
                <Trash2 className="h-4 w-4 text-destructive/70 hover:text-destructive" />
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
