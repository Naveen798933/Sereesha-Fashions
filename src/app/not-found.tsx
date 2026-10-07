import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-20 bg-[#FAF7F2]">
      <div className="max-w-md mx-auto space-y-6">
        <span className="text-xs uppercase tracking-[0.3em] text-[#B79B63] font-medium">
          Error 404
        </span>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#1C1B19] font-normal tracking-wide">
          Page Not Found
        </h1>

        <div className="w-12 h-[1px] bg-[#B79B63] mx-auto" />

        <p className="text-xs md:text-sm text-[#5A5650] leading-relaxed">
          The ensemble or page you are looking for may have been moved, renamed, or is no longer
          part of our current season collection.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button asChild variant="primary" size="lg">
            <Link href="/">Return to Boutique</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/women/sarees">Explore Sarees</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
