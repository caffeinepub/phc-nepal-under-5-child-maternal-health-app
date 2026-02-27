import React from 'react';
import { Loader2 } from 'lucide-react';

export default function SplashScreen() {
  return (
    <div className="min-h-screen bg-phc-green-deep flex flex-col items-center justify-center gap-6">
      <img
        src="/assets/generated/phc-nepal-logo.dim_256x256.png"
        alt="PHC Nepal"
        className="h-24 w-24 rounded-full border-4 border-phc-saffron object-cover shadow-xl"
      />
      <div className="text-center">
        <h1 className="text-white font-bold text-2xl">PHC Nepal</h1>
        <p className="text-phc-saffron text-sm mt-1">HealthGuide</p>
      </div>
      <Loader2 className="h-8 w-8 text-phc-saffron animate-spin" />
    </div>
  );
}
