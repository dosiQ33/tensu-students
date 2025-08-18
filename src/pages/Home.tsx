import { useEffect, useMemo, useState } from 'react';
import StudentLayout from '@/ui/StudentLayout';
import { Button, Card, EmptyState } from '@/ui';
import { Calendar, QrCode, MapPin } from 'lucide-react';
import SliderCheckIn from '@/components/SliderCheckIn';
import { useTelegramUI } from '@/telegram/TelegramProvider';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const { hapticSuccess } = useTelegramUI();
  const navigate = useNavigate();
  const [geoDistanceMeters] = useState(120);
  const [withinWindow, setWithinWindow] = useState(false);
  const [hasAnyAccess] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setWithinWindow(true), 600);
    return () => clearTimeout(t);
  }, []);

  const nextSessions = useMemo(() => (
    [
      { id: '1', title: 'BJJ – Gi', coach: 'Coach Lee', time: 'Today 20:00–21:00', location: 'Downtown Dojo', capacity: '18/24', status: 'Booked' },
      { id: '2', title: 'Futsal', coach: 'Coach Ada', time: 'Tomorrow 14:00–16:00', location: 'Main Hall', capacity: '12/16', status: 'Eligible' },
      { id: '3', title: 'HIIT', coach: 'Coach Raj', time: 'Fri 18:30–19:30', location: 'Studio B', capacity: 'Waitlist', status: 'Waitlist' },
    ]
  ), []);

  const onSlideConfirm = () => {
    hapticSuccess();
    // toast etc
  };

  return (
    <StudentLayout title="Home">
      <div className="px-4 py-4 space-y-6">
        {!hasAnyAccess && (
          <EmptyState
            icon={Calendar}
            title="Join a club to get started"
            description="Scan a club QR, enter invite code, or search clubs."
            action={{ label: 'Find Clubs', onClick: () => navigate('/clubs') }}
          />
        )}

        {hasAnyAccess && (
          <>
            <div className="space-y-3">
              <SliderCheckIn
                enabled={withinWindow}
                onConfirm={onSlideConfirm}
                label={withinWindow ? 'Slide to Check‑In' : 'Check‑in opens soon'}
                disabledHint={`You’re ${geoDistanceMeters} m away`}
              />
              <Button variant="secondary" fullWidth icon={QrCode} onClick={() => navigate('/qr')}>
                Scan QR instead
              </Button>
              <div className="text-xs text-gray-500 flex items-center gap-1"><MapPin size={14} /> You’re {geoDistanceMeters} m away</div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700">Next sessions</h3>
              {nextSessions.map(s => (
                <Card key={s.id} className="flex items-center justify-between">
                  <div>
                    <div className="text-gray-900 font-medium">{s.title}</div>
                    <div className="text-xs text-gray-500">{s.coach} • {s.time}</div>
                    <div className="text-xs text-gray-500">{s.location} • {s.capacity}</div>
                  </div>
                  <div className="text-xs text-emerald-600 font-medium">{s.status}</div>
                </Card>
              ))}
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700">Tasks</h3>
              <Card className="flex items-center justify-between">
                <div className="text-sm text-gray-800">Renew expiring pass</div>
                <Button size="sm">Review</Button>
              </Card>
              <Card className="flex items-center justify-between">
                <div className="text-sm text-gray-800">2 visits left on your pack</div>
                <Button size="sm" variant="secondary">Buy visits</Button>
              </Card>
            </div>
          </>
        )}
      </div>
    </StudentLayout>
  );
}


