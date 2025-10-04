import { UserHeader } from '@/components/user/UserHeader';

export default function UserApp() {
  return (
    <div className="min-h-screen">
      <UserHeader homeId="H7" />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <p style={{ color: 'var(--text-dim)' }}>No data yet — connect backend</p>
        </div>
      </main>
    </div>
  );
}
