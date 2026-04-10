import { Star } from "lucide-react";

export const Stars = ({ rating }) => (
  <div className="flex justify-center gap-0.5 text-amber-400">
    {[1, 2, 3, 4, 5].map((n) => (
      <Star key={n} className="h-4 w-4" fill={n <= Math.round(rating) ? "currentColor" : "none"} />
    ))}
  </div>
);
