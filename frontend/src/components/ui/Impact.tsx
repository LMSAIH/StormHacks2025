// src/ui/Impact.tsx

import React from 'react';
import { H2, P } from './typography';
import TerminalFade from './TerminalFade';

const Impact: React.FC = () => {
  return (
  <section id="impact" className="relative flex min-h-[60vh] w-full items-center justify-center overflow-hidden px-4 py-16 scroll-mt-14 lg:scroll-mt-18">
    <div className="max-w-6xl w-full flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
      <div className="flex-1 w-full">
        <TerminalFade />
      </div>
      <div className="flex-1 space-y-6 text-center lg:text-left">
        <H2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Measure Meaningful Impact</H2>
        <P className="text-base text-muted-foreground sm:text-lg">
          Dive into localized datasets to understand how development projects influence affordability,
          transit access, and long-term community health. Turn what&apos;s often hidden in spreadsheets
          into insights every stakeholder can act on.
        </P>
      </div>
    </div>
  </section>
  );
};


export default Impact;