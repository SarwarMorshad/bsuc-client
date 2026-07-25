"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { LoginForm } from "@/components/panels/login-form";
import { JoinForm } from "@/components/panels/join-form";
import { WelcomePanel } from "@/components/auth/welcome-panel";

/** Left column: moves up on → join (enter from bottom, exit to top); mirrored back. */
const leftVariants = {
  enter: (dir: number) => ({ y: dir > 0 ? "100%" : "-100%" }),
  center: { y: "0%" },
  exit: (dir: number) => ({ y: dir > 0 ? "-100%" : "100%" }),
};

/** Right column: the opposite — moves down on → join (enter from top). */
const rightVariants = {
  enter: (dir: number) => ({ y: dir > 0 ? "-100%" : "100%" }),
  center: { y: "0%" },
  exit: (dir: number) => ({ y: dir > 0 ? "100%" : "-100%" }),
};

const formCls =
  "flex items-center justify-center overflow-y-auto px-6 py-14 sm:px-10";

/**
 * AuthSlide — login and join with the form and welcome panel on opposite sides
 * (login: welcome left / form right; join: form left / welcome right). Each
 * column slides its content vertically in opposite directions, so the form and
 * panel swap sides smoothly with no horizontal jump. Driven by the URL and kept
 * in the (auth) layout, so nav and in-form links both animate the same slider.
 */
export function AuthSlide() {
  const pathname = usePathname();
  const mode = pathname.endsWith("join") ? "join" : "login";
  const isJoin = mode === "join";
  const dir = isJoin ? 1 : -1;
  const au = useTranslations("auth");
  const reduce = useReducedMotion();

  const transition = { duration: reduce ? 0 : 0.6, ease: "easeInOut" as const };

  return (
    <section className="grid min-h-[86vh] lg:grid-cols-2">
      {/* Left column — welcome on login, join form on join */}
      <div
        className={`relative overflow-hidden ${
          isJoin ? "block" : "hidden lg:block"
        }`}
      >
        <AnimatePresence custom={dir} initial={false}>
          <motion.div
            key={mode}
            custom={dir}
            variants={leftVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={transition}
            className={`absolute inset-0 ${isJoin ? formCls : ""}`}
          >
            {isJoin ? (
              <div className="w-full max-w-sm">
                <JoinForm />
              </div>
            ) : (
              <WelcomePanel
                title={au("communityTitle")}
                subtitle={au("communitySubtitle")}
                tagline={au("tagline")}
                image="/login.svg"
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Right column — login form on login, welcome on join */}
      <div
        className={`relative overflow-hidden ${
          isJoin ? "hidden lg:block" : "block"
        }`}
      >
        <AnimatePresence custom={dir} initial={false}>
          <motion.div
            key={mode}
            custom={dir}
            variants={rightVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={transition}
            className={`absolute inset-0 ${isJoin ? "" : formCls}`}
          >
            {isJoin ? (
              <WelcomePanel
                title={au("joinPanelTitle")}
                subtitle={au("joinPanelSubtitle")}
                tagline={au("tagline")}
                image="/joinus.svg"
              />
            ) : (
              <div className="w-full max-w-sm">
                <LoginForm />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
