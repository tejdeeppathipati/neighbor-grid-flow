import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, User } from 'lucide-react';

export function RoleSwitcher() {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';

  return (
    <div className="flex gap-2">
      <Button
        asChild
        variant={isAdmin ? 'default' : 'outline'}
        size="sm"
      >
        <Link to="/admin">
          <LayoutDashboard className="mr-2 h-4 w-4" />
          Admin
        </Link>
      </Button>
      <Button
        asChild
        variant={!isAdmin ? 'default' : 'outline'}
        size="sm"
      >
        <Link to="/app">
          <User className="mr-2 h-4 w-4" />
          User
        </Link>
      </Button>
    </div>
  );
}
