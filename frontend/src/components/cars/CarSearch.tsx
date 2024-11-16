import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface CarSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function CarSearch({ value, onChange }: CarSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10"
        placeholder="Search cars by title, description, or tags..."
      />
    </div>
  );
}