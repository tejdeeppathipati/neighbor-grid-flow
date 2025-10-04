import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Home, Users, Zap, ArrowRight, Activity, Battery, TrendingUp, Sun, Wind, Power } from 'lucide-react';

export default function RootRedirect() {
  const { isAuthenticated, role } = useAuth();

  // If already logged in, redirect to appropriate dashboard
  if (isAuthenticated) {
    if (role === 'admin') {
      window.location.href = '/admin';
      return null;
    } else {
      window.location.href = '/app/live';
      return null;
    }
  }

  // Show login choice page
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 relative overflow-hidden">
      {/* Subtle Green Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-emerald-200/20 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-20 w-24 h-24 bg-green-200/20 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-32 w-16 h-16 bg-teal-200/20 rounded-full animate-pulse delay-2000"></div>
        <div className="absolute bottom-32 right-10 w-28 h-28 bg-emerald-200/15 rounded-full animate-pulse delay-500"></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-green-200/25 rounded-full animate-pulse delay-1500"></div>
        <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-teal-200/20 rounded-full animate-pulse delay-3000"></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-6 bg-gradient-to-r from-emerald-500 to-green-600 rounded-3xl shadow-xl">
              <Zap className="h-16 w-16 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
            WattShare
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Smart energy sharing platform for connected communities
          </p>
          <div className="flex justify-center gap-3 mt-6">
            <Badge variant="secondary" className="text-sm bg-emerald-100 text-emerald-700 border-emerald-200">⚡ Smart Grid</Badge>
            <Badge variant="secondary" className="text-sm bg-green-100 text-green-700 border-green-200">🔋 Energy Storage</Badge>
            <Badge variant="secondary" className="text-sm bg-teal-100 text-teal-700 border-teal-200">🌐 Connected</Badge>
          </div>
        </div>

        {/* Login Choice Cards */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* User Login */}
          <Card className="group hover:shadow-2xl transition-all duration-300 border border-emerald-200 shadow-lg bg-white/90 backdrop-blur-sm hover:bg-white">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-emerald-100 rounded-2xl group-hover:scale-110 transition-transform">
                  <Home className="h-10 w-10 text-emerald-600" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold text-gray-800">
                Home Dashboard
              </CardTitle>
              <CardDescription className="text-gray-600">
                Monitor your home's energy consumption and generation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <Sun className="h-4 w-4 text-yellow-500" />
                  <span>Solar generation tracking</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <Battery className="h-4 w-4 text-emerald-500" />
                  <span>Energy storage management</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                  <span>Real-time consumption analytics</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span>Smart energy flows</span>
                </div>
              </div>
              <Link to="/login/user" className="block">
                <Button className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-medium py-3 group-hover:scale-105 transition-transform">
                  <Home className="h-4 w-4 mr-2" />
                  Access Home Dashboard
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Admin Login */}
          <Card className="group hover:shadow-2xl transition-all duration-300 border border-green-200 shadow-lg bg-white/90 backdrop-blur-sm hover:bg-white">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-green-100 rounded-2xl group-hover:scale-110 transition-transform">
                  <Users className="h-10 w-10 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold text-gray-800">
                Control Center
              </CardTitle>
              <CardDescription className="text-gray-600">
                Manage the smart energy grid and community
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <Users className="h-4 w-4 text-green-500" />
                  <span>20 connected homes</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <Activity className="h-4 w-4 text-emerald-500" />
                  <span>Live grid monitoring</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <Wind className="h-4 w-4 text-teal-500" />
                  <span>Load balancing controls</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <Power className="h-4 w-4 text-yellow-500" />
                  <span>Grid optimization</span>
                </div>
              </div>
              <Link to="/login/admin" className="block">
                <Button className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-medium py-3 group-hover:scale-105 transition-transform">
                  <Users className="h-4 w-4 mr-2" />
                  Access Control Center
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Energy Features */}
        <Card className="max-w-5xl mx-auto shadow-xl border border-emerald-200 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold text-gray-800">
              ⚡ Smart Energy Features
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Advanced energy management for modern communities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-emerald-50 rounded-xl border border-emerald-100">
                <div className="text-4xl mb-3">🌞</div>
                <div className="text-lg font-medium text-gray-800">Solar Integration</div>
                <div className="text-sm text-emerald-600">Smart solar generation</div>
              </div>
              
              <div className="text-center p-6 bg-green-50 rounded-xl border border-green-100">
                <div className="text-4xl mb-3">⚡</div>
                <div className="text-lg font-medium text-gray-800">Grid Intelligence</div>
                <div className="text-sm text-green-600">AI-powered optimization</div>
              </div>
              
              <div className="text-center p-6 bg-teal-50 rounded-xl border border-teal-100">
                <div className="text-4xl mb-3">🔋</div>
                <div className="text-lg font-medium text-gray-800">Energy Storage</div>
                <div className="text-sm text-teal-600">Smart battery management</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}