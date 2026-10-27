import { Suspense } from "react";
import { AuthExperience } from "@/components/auth/AuthExperience";
export default function RegisterPage() { return <Suspense fallback={<main className="auth-page"/>}><AuthExperience initialMode="register" /></Suspense>; }
