"use client";

import type { Meeting } from '@/types';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, PlusCircle, Trash2, Clock } from 'lucide-react';

interface MeetingSchedulerProps {
  initialMeetings?: Meeting[];
  onMeetingsChange?: (meetings: Meeting[]) => void;
}

export default function MeetingScheduler({ initialMeetings = [], onMeetingsChange }: MeetingSchedulerProps) {
  const [meetings, setMeetings] = useState<Meeting[]>(initialMeetings);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingNotes, setMeetingNotes] = useState('');

  const handleAddMeeting = () => {
    if (!selectedDate || meetingTitle.trim() === '') return;
    const newMeeting: Meeting = {
      id: Date.now().toString(),
      title: meetingTitle.trim(),
      date: selectedDate,
      notes: meetingNotes.trim(),
    };
    const updatedMeetings = [...meetings, newMeeting].sort((a,b) => a.date.getTime() - b.date.getTime());
    setMeetings(updatedMeetings);
    onMeetingsChange?.(updatedMeetings);
    setMeetingTitle('');
    setMeetingNotes('');
    setSelectedDate(new Date()); // Reset date picker
  };
  
  const deleteMeeting = (id: string) => {
    const updatedMeetings = meetings.filter(meeting => meeting.id !== id);
    setMeetings(updatedMeetings);
    onMeetingsChange?.(updatedMeetings);
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Clock className="mr-2 h-6 w-6 text-primary" />
          Schedule Meetings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 p-4 border rounded-md">
          <h4 className="font-medium">Add New Meeting</h4>
          <Input 
            placeholder="Meeting Title (e.g., Investor Pitch Prep)" 
            value={meetingTitle} 
            onChange={(e) => setMeetingTitle(e.target.value)} 
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={`w-full justify-start text-left font-normal ${!selectedDate && "text-muted-foreground"}`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Textarea 
            placeholder="Optional notes..." 
            value={meetingNotes}
            onChange={(e) => setMeetingNotes(e.target.value)}
            rows={3}
          />
          <Button onClick={handleAddMeeting} className="w-full sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Meeting
          </Button>
        </div>

        <div>
          <h4 className="font-medium mb-2">Upcoming Meetings:</h4>
          {meetings.length === 0 && <p className="text-sm text-muted-foreground">No meetings scheduled yet.</p>}
          <ul className="space-y-2">
            {meetings.map(meeting => (
              <li key={meeting.id} className="flex items-start justify-between p-3 rounded-md border bg-background hover:bg-muted/30">
                <div>
                  <p className="font-semibold text-foreground">{meeting.title}</p>
                  <p className="text-sm text-muted-foreground">{format(meeting.date, "PPP 'at' h:mm a")}</p>
                  {meeting.notes && <p className="text-xs text-muted-foreground mt-1 whitespace-pre-wrap">Notes: {meeting.notes}</p>}
                </div>
                <Button variant="ghost" size="icon" onClick={() => deleteMeeting(meeting.id)} aria-label="Delete meeting">
                  <Trash2 className="h-4 w-4 text-destructive/70 hover:text-destructive" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
