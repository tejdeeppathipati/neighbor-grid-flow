import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, ArrowLeft, Home, Users } from 'lucide-react';

export default function Forbidden() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 to-orange-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-red-500/20 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-20 w-24 h-24 bg-orange-500/20 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-32 w-16 h-16 bg-red-500/20 rounded-full animate-pulse delay-2000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <Card className="shadow-2xl border-0 bg-white/10 backdrop-blur-md">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-red-500/20 rounded-2xl">
                <Shield className="h-10 w-10 text-red-400" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-white">
              Access Denied
            </CardTitle>
            <CardDescription className="text-red-200">
              You don't have permission to access this page
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-red-300 mb-4">
                This page requires specific permissions. Please log in with the correct account type.
              </p>
            </div>

            <div className="space-y-3">
              <Link to="/login/user" className="block">
                <Button variant="outline" className="w-full border-blue-400/30 text-blue-300 hover:bg-blue-500/20 bg-white/10">
                  <Home className="h-4 w-4 mr-2" />
                  Home Dashboard
                </Button>
              </Link>
              
              <Link to="/login/admin" className="block">
                <Button variant="outline" className="w-full border-cyan-400/30 text-cyan-300 hover:bg-cyan-500/20 bg-white/10">
                  <Users className="h-4 w-4 mr-2" />
                  Control Center
                </Button>
              </Link>
            </div>

            <div className="pt-4 border-t border-white/20">
              <Link to="/" className="block">
                <Button variant="ghost" className="w-full text-blue-300 hover:text-blue-100 hover:bg-blue-500/20">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to WattShare
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}