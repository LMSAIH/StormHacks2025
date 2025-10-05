// src/ui/Impact.tsx

import React from 'react';

const Impact: React.FC = () => {
  return (
  <section id="impact" className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4 py-8 scroll-mt-14 lg:scroll-mt-18">
      <div className="max-w-3xl text-center space-y-6">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Measure Meaningful Impact</h2>
        <p className="text-base text-muted-foreground sm:text-lg">
          Dive into localized datasets to understand how development projects influence affordability,
          transit access, and long-term community health. Turn what&apos;s often hidden in spreadsheets
          into insights every stakeholder can act on.
        </p>
      </div>
    </section>
  );
};


export default Impact;