"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AuthCard from "@/components/AuthCard";
import SectionHeading from "@/components/SectionHeading";

function LoginFormContent() {
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "register" ? "register" : "login";
  const redirectTo = searchParams.get("redirect") || "/quiz";

  return <AuthCard initialMode={initialMode} redirectTo={redirectTo} />;
}

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-8 w-full max-w-[640px] mx-auto px-4 py-12">
      <SectionHeading icon="ℹ" label="autentikasi" />
      <Suspense
        fallback={
          <div className="p-8 text-center text-mist text-[14px] font-jetbrains-mono">
            memproses...
          </div>
        }
      >
        <LoginFormContent />
      </Suspense>
    </div>
  );
}
