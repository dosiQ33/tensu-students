import { useEffect, useState } from 'react';
import StudentLayout from '@/ui/StudentLayout';
import { Button } from '@/ui';

export default function QRScannerPage() {
  const [permission, setPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [torch, setTorch] = useState(false);

  useEffect(() => {
    // placeholder permission simulation
    const t = setTimeout(() => setPermission('granted'), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <StudentLayout title="Scan QR" showBack>
      <div className="px-4 py-4 space-y-4">
        {permission === 'denied' && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm">
            Camera access denied. Enable camera in system settings to scan.
          </div>
        )}

        {permission === 'granted' && (
          <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-black relative">
            <div className="absolute inset-0 grid place-items-center">
              <div className="w-64 h-64 border-2 border-white/80 rounded-xl" />
            </div>
            <div className="absolute bottom-3 inset-x-3 flex justify-between">
              <Button variant="secondary" onClick={() => setTorch(v => !v)}>{torch ? 'Torch off' : 'Torch on'}</Button>
              <Button variant="secondary">Gallery</Button>
            </div>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}


