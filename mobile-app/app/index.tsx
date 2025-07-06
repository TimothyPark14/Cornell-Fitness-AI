import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'expo-router';

export default function Index() {
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Small delay to ensure router is ready
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isReady && pathname === '/') {
      router.replace('/(auth)/sign-in');
    }
  }, [isReady, pathname, router]);

  return null; // or a loading spinner
}