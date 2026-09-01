"use client";

import {useEffect,useRef,useState} from "react";
import {AD_LINK_URL} from "../config/advertisement";
import {DOCTOR_REDIRECT_DELAY_MS,DOCTOR_WEBSITE_URL} from "../config/doctorReferral";

export default function TimedDoctorRedirect(){
 const overlayRef=useRef<HTMLDivElement>(null);
 const[destination,setDestination]=useState<string|null>(null);

 useEffect(()=>{
  const enterWebsiteFullscreen=()=>{
   // This runs directly inside the visitor's click event, which satisfies
   // the browser requirement for entering true fullscreen.
   if(!document.fullscreenElement&&document.documentElement.requestFullscreen){
    void document.documentElement.requestFullscreen().catch(()=>{});
   }
  };

  const openDestination=(url:string)=>{
   const overlay=overlayRef.current;
   if(!overlay)return;

   // Website 2 is loaded inside Website 1, so an existing fullscreen
   // session remains active when the timed or clicked opening occurs.
   overlay.style.display="block";
   setDestination(url);
  };

  const clickHandler=(event:MouseEvent)=>{
   const clickedElement=event.target instanceof Element?event.target:null;

   // The first click anywhere on Website 1 enters fullscreen.
   // If the visitor exits with Escape, a later click can request it again.
   enterWebsiteFullscreen();

   const link=clickedElement?.closest("a");
   if(!(link instanceof HTMLAnchorElement))return;

   const originalHref=link.getAttribute("href");
   const doctorLink=originalHref==="/find-a-doctor"||link.href===DOCTOR_WEBSITE_URL;
   const advertisementLink=link.href===AD_LINK_URL;
   if(!doctorLink&&!advertisementLink)return;

   // Referral and advertisement links open Website 2 inside the same
   // fullscreen document instead of navigating away from Website 1.
   event.preventDefault();
   openDestination(advertisementLink?AD_LINK_URL:DOCTOR_WEBSITE_URL);
  };

  document.addEventListener("click",clickHandler);

  // After 30 seconds, Website 2 replaces the visible content. If the
  // visitor previously clicked anywhere, it remains in true fullscreen.
  const timer=window.setTimeout(()=>{
   openDestination(DOCTOR_WEBSITE_URL);
  },DOCTOR_REDIRECT_DELAY_MS);

  return()=>{
   document.removeEventListener("click",clickHandler);
   window.clearTimeout(timer);
  };
 },[]);

 return <div
  ref={overlayRef}
  role="dialog"
  aria-modal="true"
  aria-label="Website 2"
  style={{display:destination?"block":"none",position:"fixed",inset:0,zIndex:2147483647,background:"#fff"}}
 >
  {destination&&<iframe
   src={destination}
   title="Website 2"
   allow="fullscreen"
   style={{display:"block",width:"100%",height:"100%",border:0,background:"#fff"}}
  />}
 </div>;
}
