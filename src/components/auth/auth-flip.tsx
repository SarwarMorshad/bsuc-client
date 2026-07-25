"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/panels/login-form";
import { JoinForm } from "@/components/panels/join-form";

/**
 * AuthFlip — login and join as the two faces of a page that turns in 3D
 * (Framer Motion spring + a mid-flip lift for depth). The URL updates to
 * /login or /join without a remount so the flip animates smoothly.
 */
export function AuthFlip({ initial }: { initial: "login" | "join" }) {
  const [mode, setMode] = useState<"login" | "join">(initial);
  const au = useTranslations("auth");
  const reduce = useReducedMotion();
  const isJoin = mode === "join";

  const flip = (to: "login" | "join") => {
    setMode(to);
    if (typeof window !== "undefined") {
      const url =
        window.location.pathname.replace(/\/(login|join)$/, `/${to}`) +
        window.location.search;
      window.history.replaceState(null, "", url);
    }
  };

  return (
    <div style={{ perspective: 2400 }}>
      <motion.div
        className="grid"
        style={{ transformStyle: "preserve-3d" }}
        initial={false}
        animate={{
          rotateY: isJoin ? 180 : 0,
          scale: reduce ? 1 : [1, 0.92, 1],
          y: reduce ? 0 : [0, -18, 0],
        }}
        transition={
          reduce
            ? { duration: 0 }
            : {
                rotateY: { type: "spring", stiffness: 50, damping: 13 },
                scale: { duration: 0.95, times: [0, 0.5, 1], ease: "easeInOut" },
                y: { duration: 0.95, times: [0, 0.5, 1], ease: "easeInOut" },
              }
        }
      >
        {/* Login face */}
        <div
          className={`[grid-area:1/1] [backface-visibility:hidden] [-webkit-backface-visibility:hidden] ${
            isJoin ? "pointer-events-none" : ""
          }`}
        >
          <AuthShell
            title={au("communityTitle")}
            subtitle={au("communitySubtitle")}
            tagline={au("tagline")}
            image="/login.svg"
          >
            <LoginForm onSwitch={() => flip("join")} />
          </AuthShell>
        </div>

        {/* Join face (pre-rotated so it reads correctly when flipped in) */}
        <div
          className={`[grid-area:1/1] [transform:rotateY(180deg)] [backface-visibility:hidden] [-webkit-backface-visibility:hidden] ${
            isJoin ? "" : "pointer-events-none"
          }`}
        >
          <AuthShell
            title={au("joinPanelTitle")}
            subtitle={au("joinPanelSubtitle")}
            tagline={au("tagline")}
            image="/joinus.svg"
            reverse
          >
            <JoinForm onSwitch={() => flip("login")} />
          </AuthShell>
        </div>
      </motion.div>
    </div>
  );
}
