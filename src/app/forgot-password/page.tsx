"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Mail, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const redirectUrl =
        typeof window !== "undefined" ? `${window.location.origin}/login` : undefined;

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (resetError) {
        throw resetError;
      }

      setSubmitted(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Unable to send reset instructions. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link
          href="/"
          className="font-serif text-3xl md:text-4xl tracking-wider text-charcoal hover:opacity-90 transition-opacity"
        >
          SREESHA ELEGANCE
        </Link>
        <div className="flex items-center justify-center gap-2 mt-3">
          <div className="h-[1px] w-8 bg-gold-primary/50" />
          <Sparkles className="w-3.5 h-3.5 text-gold-primary" />
          <div className="h-[1px] w-8 bg-gold-primary/50" />
        </div>
        <h1 className="mt-4 text-xl font-serif text-charcoal">Recover Your Atelier Access</h1>
        <p className="mt-2 text-xs font-sans tracking-wide text-charcoal-muted uppercase">
          Enter your registered email to receive recovery instructions
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-gold-light/40 sm:rounded-lg sm:px-10">
          {submitted ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-base font-serif text-charcoal">Instructions Dispatched</h2>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                If an account exists for{" "}
                <span className="font-semibold text-charcoal">{email}</span>, a secure password
                reset link has been dispatched to your inbox.
              </p>
              <div className="pt-4">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-wider text-charcoal hover:text-gold-primary transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Return to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
                  {error}
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-medium uppercase tracking-wider text-charcoal mb-1.5"
                >
                  Registered Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-charcoal-muted/60">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="block w-full pl-10 pr-3 py-2.5 text-sm border border-stone-200 rounded focus:border-gold-primary focus:outline-none bg-stone-50/50"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded shadow-sm text-xs font-medium uppercase tracking-widest text-white bg-charcoal hover:bg-black focus:outline-none transition-all disabled:opacity-50"
              >
                {loading ? "Transmitting..." : "Send Reset Instructions"}
              </button>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-charcoal-muted hover:text-charcoal transition-colors uppercase tracking-wider font-medium"
                >
                  <ArrowLeft className="w-3 h-3" /> Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
