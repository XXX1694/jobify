import { Search, X } from 'lucide-react';
import { SKILL_SUGGESTIONS } from '@/lib/constants';
import { Input } from '@/components/ui/Input';
import { Switch } from '@/components/ui/Switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { SkillTag } from '@/components/common/SkillTag';
import { EMPTY_JOB_FILTERS, type JobFilterValue } from './filters';

const SALARY_OPTIONS = [
  { value: '0', label: 'Any salary' },
  { value: '3000', label: '$3K+ / month' },
  { value: '5000', label: '$5K+ / month' },
  { value: '8000', label: '$8K+ / month' },
  { value: '12000', label: '$12K+ / month' },
];

interface JobFiltersProps {
  value: JobFilterValue;
  onChange: (next: JobFilterValue) => void;
}

export function JobFilters({ value, onChange }: JobFiltersProps) {
  const activeCount =
    value.skills.length + (value.remote ? 1 : 0) + (value.salaryMin > 0 ? 1 : 0);

  function toggleSkill(skill: string) {
    onChange({
      ...value,
      skills: value.skills.includes(skill)
        ? value.skills.filter((item) => item !== skill)
        : [...value.skills, skill],
    });
  }

  return (
    <div className="space-y-4 rounded-2xl border border-line bg-surface p-4 sm:p-5">
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
        <Input
          icon={<Search />}
          placeholder="Refine loaded results by title or company…"
          value={value.search}
          onChange={(event) => onChange({ ...value, search: event.target.value })}
          className="sm:flex-1"
        />
        <div className="flex items-center gap-2">
          <Select
            value={String(value.salaryMin)}
            onValueChange={(next) => onChange({ ...value, salaryMin: Number(next) })}
          >
            <SelectTrigger className="w-[10.5rem]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SALARY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex h-10 items-center gap-2 rounded-xl border border-line bg-canvas px-3">
            <Switch
              id="remote-filter"
              checked={value.remote}
              onCheckedChange={(checked) => onChange({ ...value, remote: checked })}
            />
            <label
              htmlFor="remote-filter"
              className="cursor-pointer select-none text-sm text-fg-muted"
            >
              Remote
            </label>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-2.5 flex items-center justify-between">
          <p className="mono-label">Filter by stack</p>
          {activeCount > 0 && (
            <button
              type="button"
              onClick={() => onChange(EMPTY_JOB_FILTERS)}
              className="flex items-center gap-1 text-2xs font-medium text-fg-faint transition-colors hover:text-fg"
            >
              <X className="size-3" />
              Clear {activeCount} filter{activeCount > 1 ? 's' : ''}
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {SKILL_SUGGESTIONS.map((skill) => (
            <SkillTag
              key={skill}
              label={skill}
              size="sm"
              variant={value.skills.includes(skill) ? 'matched' : 'neutral'}
              onClick={() => toggleSkill(skill)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
