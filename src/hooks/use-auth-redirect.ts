"use client";

import { useEffect } from 'react';
import { useData } from '@/context/DataContext';
import { usePathname, useRouter } from 'next/navigation';

export const useAuthRedirect = () => {
    const { user, authLoading } = useData();
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (authLoading) return;

        const isAuthPage = pathname === '/login';

        if (!user && !isAuthPage) {
            router.push('/login');
        } else if (user && isAuthPage) {
            router.push('/');
        }
    }, [user, authLoading, pathname, router]);
};