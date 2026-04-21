"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { TextFlippingBoard } from "../TextFliping";
const MESSAGES = [
  "STAY HUNGRY \nSTAY IN BED \n- STEVE JOBS",

  "DONT WORRY \nBE HAPPY FFS.",
];

export default function TextFlippingBoardDemo() {
  const [msgIdx, setMsgIdx] = useState(0);
  // 🚀 PERFORMANCE FIX #2: Intersection Observer
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef(null);

  const next = useCallback(() => setMsgIdx((i) => (i + 1) % MESSAGES.length), []);

  // Timer logic - Only run when isVisible is true
  useEffect(() => {
    if (!isVisible) return; // DON'T RUN if not visible!

    const id = setInterval(next, 6000);
    return () => clearInterval(id);
  }, [next, isVisible]);

  // Observer Logic - Detect when this component enters the viewport
  useEffect(() => {
    observerRef.current = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    });

    if (componentRef.current) {
      observerRef.current.observe(componentRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const componentRef = useRef(null);

  return (
    // Height: Set height to 100vh so it has room for its animations
    <div
      ref={componentRef}
      className="h-screen w-full flex flex-col items-center justify-center gap-8 py-20 px-4"
    >
      {/* Important: The underlying TextFlippingBoard component also uses many 
        timers internally (StepMs). Ideally, you'd pass a Prop to it, like 
        start={isVisible}, so it also stops rendering its children until visible.
        This main wrapper will help a lot, though!
      */}
      <TextFlippingBoard text={MESSAGES[msgIdx]} />
    </div>
  );
}