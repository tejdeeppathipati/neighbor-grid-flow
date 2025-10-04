/**
 * Debug version of AdminLive to identify the white screen issue
 */

import { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Activity, AlertTriangle } from "lucide-react";

export default function AdminLiveDebug() {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const runDebugChecks = async () => {
      try {
        setLoading(true);
        setError(null);

        // Test 1: Check if backend is accessible
        const backendTest = await fetch('http://localhost:3001/state/admin');
        const backendData = backendTest.ok ? await backendTest.json() : null;

        // Test 2: Check if Supabase is accessible
        let supabaseTest = null;
        try {
          const { supabase } = await import('@/integrations/supabase/client');
          const { data, error } = await supabase
            .from('microgrids')
            .select('id, name')
            .limit(1);
          supabaseTest = { data, error };
        } catch (err) {
          supabaseTest = { error: err };
        }

        setDebugInfo({
          backend: {
            accessible: backendTest.ok,
            status: backendTest.status,
            data: backendData ? Object.keys(backendData) : null
          },
          supabase: supabaseTest,
          timestamp: new Date().toISOString()
        });

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    runDebugChecks();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-12 w-12 animate-pulse mx-auto text-primary" />
          <p className="mt-4 text-muted-foreground">Running debug checks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader microgridId="00000000-0000-0000-0000-000000000001" />

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Debug Information</h1>
          <p className="text-muted-foreground mt-1">
            Checking system connectivity and data sources
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Backend Status */}
          <Card>
            <CardHeader>
              <CardTitle>Backend API Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Accessible:</span>
                  <span className={debugInfo.backend?.accessible ? "text-green-600" : "text-red-600"}>
                    {debugInfo.backend?.accessible ? "✅ Yes" : "❌ No"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Status Code:</span>
                  <span>{debugInfo.backend?.status || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Data Keys:</span>
                  <span className="text-sm">
                    {debugInfo.backend?.data ? debugInfo.backend.data.join(", ") : "None"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Supabase Status */}
          <Card>
            <CardHeader>
              <CardTitle>Database Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Connection:</span>
                  <span className={debugInfo.supabase?.error ? "text-red-600" : "text-green-600"}>
                    {debugInfo.supabase?.error ? "❌ Error" : "✅ Connected"}
                  </span>
                </div>
                {debugInfo.supabase?.error && (
                  <div className="text-sm text-red-600">
                    {debugInfo.supabase.error.message || "Connection failed"}
                  </div>
                )}
                {debugInfo.supabase?.data && (
                  <div className="text-sm text-green-600">
                    Found {debugInfo.supabase.data.length} microgrids
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Raw Debug Data */}
        <Card>
          <CardHeader>
            <CardTitle>Raw Debug Data</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded text-xs overflow-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
