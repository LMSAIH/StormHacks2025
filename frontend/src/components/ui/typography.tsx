import * as React from "react"
import { cn } from "@/lib/utils"
import { TextAnimate } from "./text-animate"

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
}

// Headers using Quattrocento
export function H1({ className, children, ...props }: TypographyProps) {
  return (
    <h1
      className={cn(
        "scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl xl:text-6xl",
        "font-['Quattrocento',serif] text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </h1>
  )
}

export function H2({ className, children, ...props }: TypographyProps) {
  return (
    <h2
      className={cn(
        "scroll-m-20 text-3xl font-bold tracking-tight lg:text-4xl xl:text-5xl",
        "font-['Quattrocento',serif] text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </h2>
  )
}

export function H3({ className, children, ...props }: TypographyProps) {
  return (
    <h3
      className={cn(
        "scroll-m-20 text-2xl font-bold tracking-tight lg:text-3xl",
        "font-['Quattrocento',serif] text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  )
}

export function H4({ className, children, ...props }: TypographyProps) {
  return (
    <h4
      className={cn(
        "scroll-m-20 text-xl font-bold tracking-tight lg:text-2xl",
        "font-['Quattrocento',serif] text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </h4>
  )
}

export function H5({ className, children, ...props }: TypographyProps) {
  return (
    <h5
      className={cn(
        "scroll-m-20 text-lg font-bold tracking-tight lg:text-xl",
        "font-['Quattrocento',serif] text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </h5>
  )
}

export function H6({ className, children, ...props }: TypographyProps) {
  return (
    <h6
      className={cn(
        "scroll-m-20 text-base font-bold tracking-tight lg:text-lg",
        "font-['Quattrocento',serif] text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </h6>
  )
}

// Paragraphs using Roboto Mono
export function P({ className, children, ...props }: TypographyProps) {
  return (
    <p
      className={cn(
        "leading-7 font-['Roboto_Mono',monospace] text-foreground",
        "text-base font-normal",
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
}

export function PLarge({ className, children, ...props }: TypographyProps) {
  return (
    <p
      className={cn(
        "text-lg leading-8 font-['Roboto_Mono',monospace] text-foreground",
        "font-normal",
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
}

export function PSmall({ className, children, ...props }: TypographyProps) {
  return (
    <p
      className={cn(
        "text-sm leading-6 font-['Roboto_Mono',monospace] text-muted-foreground",
        "font-normal",
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
}

export function PMuted({ className, children, ...props }: TypographyProps) {
  return (
    <p
      className={cn(
        "text-base leading-7 font-['Roboto_Mono',monospace] text-muted-foreground",
        "font-normal",
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
}

export function Lead({ className, children, ...props }: TypographyProps) {
  return (
    <p
      className={cn(
        "font-['Roboto_Mono',monospace] text-white",
        "font-light ",
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
}

export function Blockquote({ className, children, ...props }: TypographyProps) {
  return (
    <blockquote
      className={cn(
        "mt-6 border-l-4 border-primary pl-6 italic",
        "font-['Roboto_Mono',monospace] text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </blockquote>
  )
}

export function Code({ className, children, ...props }: TypographyProps) {
  return (
    <code
      className={cn(
        "relative rounded bg-muted px-[0.3rem] py-[0.2rem] text-sm",
        "font-['Roboto_Mono',monospace] font-semibold text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </code>
  )
}

// Animated paragraph component using TextAnimate
interface PAnimatedProps {
  children: string
  className?: string
  animation?: "fadeIn" | "blurIn" | "blurInUp" | "slideUp" | "slideDown"
  delay?: number
  duration?: number
}

export function PAnimated({ 
  className, 
  children, 
  animation = "blurInUp",
  delay = 0,
  duration = 0,
}: PAnimatedProps) {
  return (
    <TextAnimate
      as="p"
      animation={animation}
      by="word"
      delay={delay}
      duration={duration}
      className={cn(
        "leading-7 font-['Roboto_Mono',monospace] text-foreground",
        "text-base font-normal",
        className
      )}
    >
      {children}
    </TextAnimate>
  )
}
