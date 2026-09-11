"use client";

import { useEffect, useRef, useState } from "react";
import { AD_LINK_URL } from "../config/advertisement";
import { DOCTOR_REDIRECT_DELAY_MS, DOCTOR_WEBSITE_URL } from "../config/doctorReferral";
import { setupWebsiteChoice } from "../lib/website-choice";
import { configuredWebsiteUrl } from "../lib/configured-website-url";
import styles from "./WebsiteChoice.module.css";

const doctorUrl = configuredWebsiteUrl(DOCTOR_WEBSITE_URL);
const advertisementUrl = configuredWebsiteUrl(AD_LINK_URL);

export default function TimedDoctorRedirect() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [destination, setDestination] = useState(doctorUrl ?? "");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !doctorUrl) return;
    return setupWebsiteChoice(dialog, {
      doctorUrl,
      advertisementUrl: advertisementUrl ?? doctorUrl,
      delayMs: DOCTOR_REDIRECT_DELAY_MS,
      onDestinationChange: setDestination,
    });
  }, []);

  // An unset profile must not start a timer, intercept clicks, or show a prompt.
  if (!doctorUrl) return null;

  return <dialog
    ref={dialogRef}
    className={styles.dialog}
    aria-labelledby="website-choice-title"
    aria-describedby="website-choice-description website-choice-destination"
  >
    <p className={styles.brand}>MyVeta Health</p>
    <h2 id="website-choice-title" className={styles.title}>Stay on this website?</h2>
    <p id="website-choice-description" className={styles.description}>
      Keep browsing MyVeta Health, or leave to visit:
    </p>
    <p id="website-choice-destination" className={styles.destination}>{destination}</p>
    <form method="dialog" className={styles.actions}>
      <button className={styles.stay} value="stay" autoFocus>Stay on MyVeta</button>
      <button className={styles.leave} value="leave">Leave website</button>
    </form>
  </dialog>;
}
