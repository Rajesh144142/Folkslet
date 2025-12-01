import React from "react";
import { Link } from "react-router-dom";
const Upcomingfeatures = () => {
  return (
    <div className="mx-auto flex w-full max-w-screen-xl flex-col items-center gap-6 px-4 pb-12 lg:px-8">
      <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-4 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-12 text-center shadow-sm">
        <p className="text-3xl font-semibold text-[var(--color-text-base)] md:text-4xl">This feature is coming soon</p>
        <p className="text-sm text-[var(--color-text-muted)]">
          We are putting the finishing touches on some exciting updates. Stay tuned!
        </p>
      </div>
    </div>
  );
};

export default Upcomingfeatures;
