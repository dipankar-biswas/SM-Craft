import { ChevronRight } from 'lucide-react';

// const crumbs = ['Home', 'Shop', 'Fashion & Style', 'Boys', 'Western Wear'];
const crumbs = ['Home', 'Shop'];

export default function Breadcrumb({ title }) {
  return (
    <nav className="flex items-center gap-1 text-xs text-gray-500 mb-4 flex-wrap">
      {crumbs.map((crumb, i) => (
        <span key={crumb} className="flex items-center gap-1">
          {i > 0 && <ChevronRight size={12} className="text-gray-400" />}
          {i < crumbs.length - 1 ? (
            <a href="#" className="hover:text-orange-500 transition-colors">{crumb}</a>
          ) : (
            <span className="text-gray-400">{title}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
