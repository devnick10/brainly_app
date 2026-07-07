import { Search } from 'lucide-react';
import { Input } from './ui/input';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="px-6 pt-6 pb-4">
      <div className="mx-auto max-w-2xl">
        <p className="mb-3 text-center text-xl mt-2 block bg-linear-to-r from-primary via-primary/80 to-purple-500 bg-clip-text text-transparent">
          Search with intent — find meaning, not just keywords
        </p>
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search your brain..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-14 w-full rounded-xl border-2 pl-12 text-base shadow-sm transition-all duration-200 placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
          />
        </div>
      </div>
    </div>
  );
}
