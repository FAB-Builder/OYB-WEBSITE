"use client";

import type { ComponentType, MouseEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { trackEvent, type TrackingEvent } from "@/lib/analytics";

// `never` lets any element-specific handler (button, anchor, div…) satisfy the constraint.
type Clickable = { onClick?: (event: MouseEvent<never>) => void };

export type WithTrackingProps = {
  /** Event sent to GA on click, before the component's own onClick runs. */
  tracking?: TrackingEvent;
};

/**
 * Wraps any clickable component so it reports a GA event on click.
 *
 *   const TrackedCard = withTracking(Card);
 *   <TrackedCard tracking={ctaEvent("book_demo", "pricing", "Book a demo")} onClick={open} />
 */
export function withTracking<P extends Clickable>(Component: ComponentType<P>) {
  const Tracked = ({ tracking, onClick, ...props }: P & WithTrackingProps) => {
    const handleClick = (event: MouseEvent<never>) => {
      if (tracking) trackEvent(tracking.name, tracking.params);
      onClick?.(event);
    };

    return <Component {...(props as P)} onClick={handleClick} />;
  };

  Tracked.displayName = `withTracking(${Component.displayName ?? Component.name ?? "Component"})`;
  return Tracked;
}

export const TrackedButton = withTracking(Button);
export const TrackedLink = withTracking(Link);
