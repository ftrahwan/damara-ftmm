'use client';

import React from 'react';

export function JobCardSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="glass-card rounded-3xl p-6 flex flex-col justify-between h-64 animate-pulse"
        >
          <div>
            <div className="flex gap-2 mb-4">
              <div className="h-6 w-24 rounded-full bg-white/10" />
              <div className="h-6 w-20 rounded-full bg-white/10" />
            </div>
            <div className="h-6 w-3/4 rounded-lg bg-white/15 mb-3" />
            <div className="h-4 w-1/2 rounded-md bg-white/10 mb-4" />
            <div className="h-3 w-full rounded bg-white/10 mb-2" />
            <div className="h-3 w-5/6 rounded bg-white/10" />
          </div>
          <div className="pt-3 border-t border-white/10 flex justify-between items-center">
            <div className="h-3 w-24 rounded bg-white/10" />
            <div className="h-8 w-28 rounded-xl bg-white/15" />
          </div>
        </div>
      ))}
    </div>
  );
}
