import { useMemo, useState } from 'react';
import StudentLayout from '@/ui/StudentLayout';
import { Button, Card, Select } from '@/ui';
import { Calendar as CalendarIcon } from 'lucide-react';

export default function SchedulePage() {
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [filters, setFilters] = useState({ club: 'all', section: 'all', coach: 'all', time: 'all' });

  const sessions = useMemo(() => [
    { id: '1', title: 'BJJ – Gi', coach: 'Lee', time: 'Today 20:00', location: 'Dojo', capacity: '18/24', status: 'Booked', eligible: true },
    { id: '2', title: 'Futsal', coach: 'Ada', time: 'Tomorrow 14:00', location: 'Main Hall', capacity: '12/16', status: 'Eligible', eligible: true },
    { id: '3', title: 'HIIT', coach: 'Raj', time: 'Fri 18:30', location: 'Studio B', capacity: 'Full', status: 'Waitlist', eligible: true },
  ], []);

  return (
    <StudentLayout title="Schedule">
      <div className="px-4 py-4 space-y-4">
        <div className="sticky top-0 z-10 -mx-4 px-4 py-2 bg-[var(--tg-bg)]/95 backdrop-blur border-b border-gray-100">
          <div className="grid grid-cols-2 gap-2">
            <Select value={filters.club} onChange={e => setFilters({ ...filters, club: e.target.value })} options={[{ value: 'all', label: 'All Clubs' }]} />
            <Select value={filters.section} onChange={e => setFilters({ ...filters, section: e.target.value })} options={[{ value: 'all', label: 'All Sections' }]} />
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <Select value={filters.coach} onChange={e => setFilters({ ...filters, coach: e.target.value })} options={[{ value: 'all', label: 'Any Coach' }]} />
            <Select value={filters.time} onChange={e => setFilters({ ...filters, time: e.target.value })} options={[{ value: 'all', label: 'Any Time' }]} />
          </div>
          <div className="flex gap-2 mt-2">
            <Button variant={view === 'list' ? 'primary' : 'secondary'} onClick={() => setView('list')}>List</Button>
            <Button variant={view === 'calendar' ? 'primary' : 'secondary'} onClick={() => setView('calendar')} icon={CalendarIcon}>Calendar</Button>
          </div>
        </div>

        {view === 'list' && (
          <div className="space-y-3">
            {sessions.map(s => (
              <Card key={s.id} className="flex items-center justify-between">
                <div>
                  <div className="text-gray-900 font-medium">{s.title}</div>
                  <div className="text-xs text-gray-500">{s.coach} • {s.time} • {s.location}</div>
                  <div className="text-xs text-gray-500">Capacity {s.capacity}</div>
                </div>
                <div className="flex gap-2">
                  {s.status === 'Booked' && <Button size="sm" variant="secondary">Cancel</Button>}
                  {s.status === 'Eligible' && <Button size="sm">Book</Button>}
                  {s.status === 'Waitlist' && <Button size="sm" variant="secondary">Join Waitlist</Button>}
                </div>
              </Card>
            ))}
          </div>
        )}

        {view === 'calendar' && (
          <div className="p-6 text-center text-gray-500">Calendar view (mini-grid) TBD</div>
        )}
      </div>
    </StudentLayout>
  );
}


