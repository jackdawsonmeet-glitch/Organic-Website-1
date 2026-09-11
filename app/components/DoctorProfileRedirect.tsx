"use client";

import { useEffect, useRef, useState } from "react";
import { AD_LINK_URL } from "../config/advertisement";
import { DOCTOR_REDIRECT_DELAY_MS, DOCTOR_WEBSITE_URL } from "../config/doctorReferral";
import { configuredWebsiteUrl } from "../lib/configured-website-url";
import { setupDoctorProfile } from "../lib/doctor-profile";
import styles from "./DoctorProfile.module.css";

const doctorUrl = configuredWebsiteUrl(DOCTOR_WEBSITE_URL);
const advertisementUrl = configuredWebsiteUrl(AD_LINK_URL);

export default function DoctorProfileRedirect() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const controlsRef = useRef<ReturnType<typeof setupDoctorProfile> | null>(null);
  const [destination, setDestination] = useState<string | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!doctorUrl || !dialog || typeof dialog.showModal !== "function") return;
    const controls = setupDoctorProfile({
      doctorUrl,
      advertisementUrl,
      delayMs: DOCTOR_REDIRECT_DELAY_MS,
      onOpen: setDestination,
      onFullscreen: () => {
        // A new fullscreen layer can cover an already-open modal. Reopen the
        // same dialog above it without remounting or reloading the iframe.
        if (dialog.open) {
          dialog.close();
          dialog.showModal();
        }
      },
    });
    controlsRef.current = controls;
    return () => {
      controls.dispose();
      controlsRef.current = null;
    };
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!destination || !dialog) return;
    dialog.showModal();
    return () => { if (dialog.open) dialog.close(); };
  }, [destination]);

  const closeProfile = () => {
    controlsRef.current?.cancelOpening();
    setDestination(null);
  };

  if (!doctorUrl) return null;

  return <dialog
    ref={dialogRef}
    className={styles.dialog}
    aria-labelledby="doctor-profile-title"
    onCancel={event => { event.preventDefault(); closeProfile(); }}
  >
    <div className={styles.toolbar}>
      <div className={styles.context}>
        <strong id="doctor-profile-title">Doctor profile</strong>
        <span>Esc exits fullscreen</span>
      </div>
      <div className={styles.actions}>
        <button type="button" autoFocus onClick={closeProfile}>Back to MyVeta</button>
        <button type="button" onClick={() => { void controlsRef.current?.requestFullscreen(); }}>Fullscreen</button>
        <a href={destination ?? doctorUrl} target="_blank" rel="noopener noreferrer">Open separately</a>
      </div>
    </div>
    {destination && <iframe
      key={destination}
      src={destination}
      title="Doctor profile"
      className={styles.frame}
      allow="fullscreen"
      allowFullScreen
      referrerPolicy="strict-origin-when-cross-origin"
    />}
  </dialog>;
}
