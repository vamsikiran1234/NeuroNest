import React from 'react';

export default function App() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-cream-100 text-ink-900">
      <div className="max-w-xl text-center space-y-4 bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-sage-200 shadow-sm">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sage-100 text-sage-500 mb-2">
          🌱
        </div>
        <h1 className="text-3xl font-bold font-sans tracking-tight text-ink-900">
          NeuroNest
        </h1>
        <p className="text-lg text-ink-500 font-reading">
          "A space where every mind finds its way."
        </p>
        <p className="text-sm text-ink-300">
          Personalized learning, calm sensory experiences, interactive skill-building, and daily routines.
        </p>
      </div>
    </main>
  );
}
