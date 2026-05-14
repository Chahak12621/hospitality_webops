'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserRole } from '@/lib/getUser';
import { canAccessPage } from '@/lib/roles';
import type { UserRole } from '@/types/database.types';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  redirectTo?: string;
}

export default function RoleGuard({
  children,
  allowedRoles,
  redirectTo = '/auth/login',
}: RoleGuardProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkAuth() {
      const role = await getUserRole();
      if (!role || !allowedRoles.includes(role)) {
        router.push(redirectTo);
      } else {
        setIsAuthorized(true);
      }
    }
    checkAuth();
  }, [allowedRoles, router, redirectTo]);

  if (isAuthorized === null) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-pink-500"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
