import { AdminHeader } from '@/components/admin/AdminHeader';

export default function Admin() {
  return (
    <div className="min-h-screen">
      <AdminHeader microgridId="MG-001" />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <p style={{ color: 'var(--text-dim)' }}>No data yet — connect backend</p>
        </div>
      </main>
    </div>
  );
}
