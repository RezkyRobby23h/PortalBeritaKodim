import { Badge } from "@/components/ui/badge";

interface BreakingNewsProps {
  text: string;
}

export function BreakingNews({ text }: BreakingNewsProps) {
  return (
    <div className="bg-linear-to-r from-red-600 to-red-500 rounded-xl px-4 py-2.5">
      <div className="mx-auto flex max-w-7xl items-center gap-3">
        <Badge className="shrink-0 animate-pulse bg-white font-extrabold uppercase tracking-widest text-red-600">
          Breaking
        </Badge>
        <p className="animate-pulse truncate text-sm font-medium text-white">
          {text}
        </p>
      </div>
    </div>
  );
}
