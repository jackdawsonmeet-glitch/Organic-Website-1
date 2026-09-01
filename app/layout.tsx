import type {Metadata} from "next";import "./globals.css";import TimedDoctorRedirect from "./components/TimedDoctorRedirect";
export const metadata:Metadata={title:"MyVeta Health Public",description:"Public MyVeta Health information page without account prompts.",other:{"codex-preview":"development"}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body><TimedDoctorRedirect/>{children}</body></html>}
