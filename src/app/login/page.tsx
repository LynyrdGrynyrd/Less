"use client";

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabase/client';
import { useTheme } from 'next-themes';
import { useData } from '@/context/DataContext';
import { useAuthRedirect } from '@/hooks/use-auth-redirect';
import { FullScreenLoader } from '@/components/shared/FullScreenLoader';

const Login = () => {
  useAuthRedirect();
  const { theme } = useTheme();
  const { authLoading } = useData();

  if (authLoading) {
    return <FullScreenLoader />;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8">
        <div>
          <h1 className="text-center text-3xl font-bold text-gray-900 dark:text-white">
            Welcome to Less
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Sign in to save your progress and access it anywhere.
          </p>
        </div>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
          theme={theme === 'dark' ? 'dark' : 'light'}
          socialLayout="horizontal"
        />
      </div>
    </div>
  );
};

export default Login;