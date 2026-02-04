import { Badge } from "@/components/ui/Badge";
import { formatNumber } from "@/lib/utils";

export function TrendBadge({ label, delta }: { label: string; delta: number }) {
  const tone = delta < 0 ? "success" : delta > 0 ? "warning" : "neutral";
  const symbol = delta > 0 ? "+" : "";
  return (
    <Badge tone={tone}>
      {label} {symbol}
      {formatNumber(delta)}
    </Badge>
  );
}
