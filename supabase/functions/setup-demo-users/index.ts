import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0'

const DEMO_MICROGRID_ID = '550e8400-e29b-41d4-a716-446655440000';

Deno.serve(async (req) => {
  try {
    // Create admin client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Create demo admin user
    const { data: adminAuthData, error: adminAuthError } = await supabaseAdmin.auth.admin.createUser({
      email: 'admin@demo.com',
      password: 'demo123',
      email_confirm: true
    });

    if (adminAuthError) throw adminAuthError;

    // Insert admin user record
    const { error: adminUserError } = await supabaseAdmin
      .from('users')
      .upsert({
        id: adminAuthData.user.id,
        email: 'admin@demo.com',
        role: 'admin',
        microgrid_id: DEMO_MICROGRID_ID,
        home_id: null
      });

    if (adminUserError) throw adminUserError;

    // Create demo regular user
    const { data: userAuthData, error: userAuthError } = await supabaseAdmin.auth.admin.createUser({
      email: 'user@demo.com',
      password: 'demo123',
      email_confirm: true
    });

    if (userAuthError) throw userAuthError;

    // Insert regular user record
    const { error: userUserError } = await supabaseAdmin
      .from('users')
      .upsert({
        id: userAuthData.user.id,
        email: 'user@demo.com',
        role: 'user',
        microgrid_id: DEMO_MICROGRID_ID,
        home_id: 'H1'
      });

    if (userUserError) throw userUserError;

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Demo users created successfully',
        users: {
          admin: {
            email: 'admin@demo.com',
            password: 'demo123',
            role: 'admin'
          },
          user: {
            email: 'user@demo.com',
            password: 'demo123',
            role: 'user',
            home_id: 'H1'
          }
        }
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
