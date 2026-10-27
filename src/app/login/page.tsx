import { Suspense } from "react";
import { AuthExperience } from "@/components/auth/AuthExperience";
export default function LoginPage() { return <Suspense fallback={<main className="auth-page"/>}><AuthExperience initialMode="login" /></Suspense>; }
