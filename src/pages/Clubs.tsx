import { useMemo, useState } from 'react';
import StudentLayout from '@/ui/StudentLayout';
import { Button, Card, Input, Select } from '@/ui';

export default function ClubsPage() {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('all');
  const clubs = useMemo(() => [
    { id: '1', name: 'BARS Checkmat', address: 'Nazarbayev 10', access: 'Public', sections: 3 },
    { id: '2', name: 'Downtown Boxing', address: 'Main Ave 23', access: 'Private', sections: 2 },
  ], []);

  return (
    <StudentLayout title="Clubs">
      <div className="px-4 py-4 space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className="col-span-3"><Input placeholder="Search clubs" value={query} onChange={e => setQuery(e.target.value)} /></div>
          <Select value={type} onChange={e => setType(e.target.value)} options={[{ value: 'all', label: 'All' }, { value: 'public', label: 'Public' }, { value: 'private', label: 'Private' }]} />
        </div>

        <div className="space-y-3">
          {clubs.map(c => (
            <Card key={c.id} className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">{c.name}</div>
                <div className="text-xs text-gray-500">{c.address} • {c.sections} sections • {c.access}</div>
              </div>
              <Button>{c.access === 'Public' ? 'Join' : 'Request access'}</Button>
            </Card>
          ))}
        </div>
      </div>
    </StudentLayout>
  );
}


