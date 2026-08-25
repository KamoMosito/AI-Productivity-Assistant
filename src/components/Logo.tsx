import logo from "@/assets/rooted-ai-logo.png";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  showTagline = false,
}: {
  className?: string;
  showTagline?: boolean;
}) {
  return (
    <div className={cn("flex flex-col items-start gap-1", className)}>
      <img
        src={logo}
        alt="Rooted AI logo — a leaf and root mark above the words Rooted AI"
        width={504}
        height={337}
        className="h-11 w-auto object-contain sm:h-14"
      />

      {showTagline ? (
        <span className="text-xs text-muted-foreground">Smarter business. Rooted in care.</span>
      ) : null}
    </div>
  );
}
