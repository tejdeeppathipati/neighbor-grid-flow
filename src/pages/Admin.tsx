import { AdminHeader } from '@/components/admin/AdminHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Admin() {
  return (
    <div className="min-h-screen">
      <AdminHeader microgridId="MG-001" />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage and monitor the NeighborGrid community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <CardTitle>Community Dashboard</CardTitle>
                </div>
                <CardDescription>
                  View multi-home energy flows, routing, and analytics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/admin/community">
                  <Button className="w-full">
                    View Community Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-green-500/50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                  <CardTitle>Live Simulator</CardTitle>
                </div>
                <CardDescription>
                  Real-time energy flow with 20 homes streaming every 0.5s
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/admin/live">
                  <Button className="w-full">
                    View Live Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
