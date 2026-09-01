import {redirect} from "next/navigation";
import {DOCTOR_WEBSITE_URL} from "../config/doctorReferral";

export default function FindADoctor(){
 redirect(DOCTOR_WEBSITE_URL);
}
