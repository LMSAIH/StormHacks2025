import {
  Terminal,
  TypingAnimation,
  AnimatedSpan,
} from '@/components/ui/shadcn-io/terminal';
const TerminalFade = () => (
  <div className="text-left">
  <Terminal>
    <AnimatedSpan delay={0}>$ We grab neighborhood data</AnimatedSpan>
    <TypingAnimation delay={1000} duration={100}>
      $ Utilizing community data sources...
    </TypingAnimation>
    <AnimatedSpan delay={4000}>✓ Building permits indexed</AnimatedSpan>
    <AnimatedSpan delay={5000}>$ Analyze how development affects community health</AnimatedSpan>
    <TypingAnimation delay={6000} duration={80}>
      $ Translate raw data into ready-to-use insights...
    </TypingAnimation>
    <AnimatedSpan delay={10000}>📊 Map ready! Explore your community.</AnimatedSpan>
  </Terminal>
  </div>
);
export default TerminalFade;