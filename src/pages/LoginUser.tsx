import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Home, ArrowLeft, Sun, Battery, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginUser() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('user@demo.com');
  const [password, setPassword] = useState('demo123');
  const [homeId, setHomeId] = useState('H1');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simple demo login - no real authentication needed
    setTimeout(() => {
      login('user', homeId || 'H1');
      navigate('/app/live');
    }, 500);
  };

  const isDisabled = !email || !password || loading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle Green Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-emerald-200/20 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-20 w-24 h-24 bg-green-200/20 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-32 w-16 h-16 bg-teal-200/20 rounded-full animate-pulse delay-2000"></div>
        <div className="absolute bottom-32 right-10 w-28 h-28 bg-emerald-200/15 rounded-full animate-pulse delay-500"></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-green-200/25 rounded-full animate-pulse delay-1500"></div>
        <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-teal-200/20 rounded-full animate-pulse delay-3000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back Button */}
        <div className="mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to WattShare
          </Link>
        </div>

        {/* Login Card */}
        <Card className="shadow-xl border border-emerald-200 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-emerald-100 rounded-2xl">
                <Home className="h-10 w-10 text-emerald-600" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-gray-800">
              Home Dashboard
            </CardTitle>
            <CardDescription className="text-gray-600">
              Access your smart energy dashboard
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pr-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-emerald-500 focus:ring-emerald-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Home ID */}
              <div className="space-y-2">
                <Label htmlFor="homeId" className="text-sm font-medium text-gray-700">
                  Home ID
                </Label>
                <Input
                  id="homeId"
                  type="text"
                  value={homeId}
                  onChange={(e) => setHomeId(e.target.value)}
                  placeholder="H1, H2, H3, etc."
                  className="w-full bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
                <p className="text-xs text-gray-500">
                  Enter your home identifier (H1-H20)
                </p>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isDisabled}
                className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-medium py-3"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing In...
                  </div>
                ) : (
                  'Access Home Dashboard'
                )}
              </Button>
            </form>

            {/* Demo Info */}
            <div className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <h4 className="text-sm font-medium text-gray-800 mb-2">
                Demo Credentials
              </h4>
              <p className="text-xs text-gray-600">
                Email: user@demo.com<br />
                Password: demo123<br />
                Home ID: H1-H20
              </p>
            </div>

            {/* Energy Features */}
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-800 mb-3">
                Smart Energy Features
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Sun className="h-3 w-3 text-yellow-500" />
                  Solar generation tracking
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Battery className="h-3 w-3 text-emerald-500" />
                  Energy storage management
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Zap className="h-3 w-3 text-yellow-500" />
                  Smart energy flows
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}