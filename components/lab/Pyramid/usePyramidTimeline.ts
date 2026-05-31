"use client";

import { useCallback, useEffect, useRef, type MutableRefObject } from "react";
import gsap from "gsap";
import { TIMELINE_STOPS } from "./config";

export type TimelineState = {
  progress: MutableRefObject<number>;
  activeStop: MutableRefObject<number>;
  timelineRef: MutableRefObject<gsap.core.Timeline | null>;
  seekToStop: (index: number) => void;
  nextStop: () => void;
  prevStop: () => void;
  pause: () => void;
  resume: () => void;
};

const BUILD_DURATION = 2.5;
const OVERVIEW_PAUSE = 1.0;

function computeStopTimes(): { dwellStart: number; dwellEnd: number }[] {
  let cursor = BUILD_DURATION + OVERVIEW_PAUSE;
  return TIMELINE_STOPS.map((stop) => {
    const dwellStart = cursor;
    const dwellEnd = cursor + stop.dwell;
    cursor = dwellEnd + stop.travel;
    return { dwellStart, dwellEnd };
  });
}

export const STOP_TIMES = computeStopTimes();

export function usePyramidTimeline(
  onActiveStopChange?: (index: number) => void,
): TimelineState {
  const progress = useRef(0);
  const activeStop = useRef(-1);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const onChangeRef = useRef(onActiveStopChange);
  onChangeRef.current = onActiveStopChange;

  useEffect(() => {
    const totalDuration = STOP_TIMES[STOP_TIMES.length - 1].dwellEnd;
    const proxy = { value: 0 };

    const tl = gsap.timeline({ paused: true });

    tl.to(proxy, {
      value: 1,
      duration: totalDuration,
      ease: "none",
      onUpdate: () => {
        progress.current = proxy.value;

        const currentTime = tl.time();
        let newStop = -1;
        for (let i = 0; i < STOP_TIMES.length; i++) {
          if (
            currentTime >= STOP_TIMES[i].dwellStart &&
            currentTime <= STOP_TIMES[i].dwellEnd
          ) {
            newStop = i;
            break;
          }
        }

        if (newStop !== activeStop.current) {
          activeStop.current = newStop;
          onChangeRef.current?.(newStop);
        }
      },
    });

    timelineRef.current = tl;
    tl.play();

    return () => {
      tl.kill();
    };
  }, []);

  const seekToStop = useCallback((index: number) => {
    const tl = timelineRef.current;
    if (!tl || index < 0 || index >= STOP_TIMES.length) return;
    tl.seek(STOP_TIMES[index].dwellStart);
    tl.play();
  }, []);

  const nextStop = useCallback(() => {
    const current = activeStop.current;
    const next = Math.min(current + 1, STOP_TIMES.length - 1);
    seekToStop(next);
  }, [seekToStop]);

  const prevStop = useCallback(() => {
    const current = activeStop.current;
    const prev = Math.max(current - 1, 0);
    seekToStop(prev);
  }, [seekToStop]);

  const pause = useCallback(() => {
    timelineRef.current?.pause();
  }, []);

  const resume = useCallback(() => {
    timelineRef.current?.resume();
  }, []);

  return { progress, activeStop, timelineRef, seekToStop, nextStop, prevStop, pause, resume };
}
