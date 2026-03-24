import { UrlShortenerForm } from "@/components/urls/url-shortener-form";
import { LandingSections } from "@/components/landing/landing-sections";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center py-24 md:py-32 px-4 sm:px-6 lg:px-8">
      <div className="w-full pt-20 md:pt-24 pb-20">
        <div className="w-full max-w-xl mx-auto text-center px-4 sm:px-6">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
          Shorten Your Links
        </h1>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-6 max-w-2xl mx-auto">
          Paste your long URL and get a shortened one. It&apos;s free and easy to
          use.
        </p>

        <div className="mt-4 space-y-3">
          <UrlShortenerForm />
        </div>
        </div>
      </div>
      <LandingSections />
    </div>
  );
}
