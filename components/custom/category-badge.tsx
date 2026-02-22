import { Badge } from "@/components/ui/badge";
import { toPascalCase } from "@/utils/string";

interface CategoryBadgeProps {
  name: string;
  color?: string | null;
}

export function CategoryBadge({ name, color }: CategoryBadgeProps) {
  const c = color ?? "#6b7280";
  return (
    <Badge
      style={{
        backgroundColor: `${c}22`,
        color: c,
        borderColor: `${c}44`,
      }}
      className="border text-xs font-semibold hover:opacity-90"
    >
      {toPascalCase(name)}
    </Badge>
  );
}
