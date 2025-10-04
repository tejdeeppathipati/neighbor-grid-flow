import { AdminHeader } from '@/components/admin/AdminHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Admin() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Images */}
      <div className="absolute inset-0 z-0">
        {/* Main background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50" />
        
        {/* Floating energy elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-200/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-green-200/20 rounded-full blur-lg animate-pulse delay-1000" />
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-teal-200/20 rounded-full blur-2xl animate-pulse delay-2000" />
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-emerald-200/20 rounded-full blur-xl animate-pulse delay-3000" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(34, 197, 94, 0.3) 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }} />
        </div>
      </div>

      <div className="relative z-10">
        <AdminHeader microgridId="admin" />

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
              <p className="text-lg text-gray-600">
                Monitor and manage the NeighborGrid energy community
              </p>
            </div>

            {/* Single Live Dashboard Card */}
            <div className="flex justify-center">
              <Card className="w-full max-w-md shadow-xl border border-emerald-200 bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                <CardHeader className="text-center pb-4">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse" />
                    <Activity className="h-6 w-6 text-emerald-600" />
                    <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse" />
                  </div>
                  <CardTitle className="text-2xl text-gray-800">Live Energy Simulator</CardTitle>
                  <CardDescription className="text-gray-600 text-base">
                    Real-time energy flow monitoring with 20 homes streaming every minute
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Link to="/admin/live">
                    <Button className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold py-3 text-lg transition-all duration-300 transform hover:scale-105">
                      Launch Live Dashboard
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Additional info cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <Card className="bg-white/80 backdrop-blur-sm border border-emerald-100">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-emerald-600">20</div>
                  <div className="text-sm text-gray-600">Connected Homes</div>
                </CardContent>
              </Card>
              <Card className="bg-white/80 backdrop-blur-sm border border-green-100">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">Real-time</div>
                  <div className="text-sm text-gray-600">Data Updates</div>
                </CardContent>
              </Card>
              <Card className="bg-white/80 backdrop-blur-sm border border-teal-100">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-teal-600">100%</div>
                  <div className="text-sm text-gray-600">Renewable Energy</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
