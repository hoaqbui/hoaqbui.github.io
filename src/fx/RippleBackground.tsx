"use client";

import styles from "./ripple.module.css";

export default function RippleBackground({ running }: { running: boolean }) {
  const containerClass = `${styles.field}${running ? "" : ` ${styles.paused}`}`;

  return (
    <div aria-hidden="true" className={containerClass}>
      <div className={styles.center}>
        <div className={styles.ring} style={{ animationDelay: "0s" }} />
        <div
          className={`${styles.ring} ${styles.amber}`}
          style={{ animationDelay: "-3.5s" }}
        />
        <div className={styles.ring} style={{ animationDelay: "-7s" }} />
        <div
          className={`${styles.ring} ${styles.amber}`}
          style={{ animationDelay: "-10.5s" }}
        />
      </div>
      <div className={styles.veil} />
    </div>
  );
}
