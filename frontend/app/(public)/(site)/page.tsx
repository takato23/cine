'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const SceneWrapper = dynamic(() => import('@/components/landing/SceneWrapper'), {
  ssr: false,
});

export default function HomePage() {
  return (
    <main className="w-full h-screen bg-black relative">
      <Suspense fallback={null}>
        <SceneWrapper />
      </Suspense>
    </main>
  );
}
