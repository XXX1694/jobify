import { useState, type KeyboardEvent } from 'react';
import { SkillTag } from './SkillTag';

interface SkillsInputProps {
  value: string[];
  onChange: (skills: string[]) => void;
  suggestions?: string[];
  placeholder?: string;
  max?: number;
}

export function SkillsInput({
  value,
  onChange,
  suggestions = [],
  placeholder = 'Type a skill, press Enter…',
  max = 30,
}: SkillsInputProps) {
  const [draft, setDraft] = useState('');

  function addSkill(raw: string) {
    const skill = raw.trim().toLowerCase();
    setDraft('');
    if (!skill || value.includes(skill) || value.length >= max) return;
    onChange([...value, skill]);
  }

  function removeSkill(skill: string) {
    onChange(value.filter((item) => item !== skill));
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      addSkill(draft);
    } else if (event.key === 'Backspace' && !draft && value.length > 0) {
      removeSkill(value[value.length - 1]!);
    }
  }

  const available = suggestions.filter((skill) => !value.includes(skill)).slice(0, 12);

  return (
    <div className="space-y-2.5">
      <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-line bg-canvas p-2 transition-colors focus-within:border-accent/55 focus-within:ring-2 focus-within:ring-accent/20">
        {value.map((skill) => (
          <SkillTag
            key={skill}
            label={skill}
            variant="matched"
            size="sm"
            onRemove={() => removeSkill(skill)}
          />
        ))}
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => addSkill(draft)}
          placeholder={value.length === 0 ? placeholder : 'Add another…'}
          className="h-7 min-w-[9rem] flex-1 bg-transparent px-1 text-sm text-fg outline-none placeholder:text-fg-faint"
        />
      </div>
      {available.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {available.map((skill) => (
            <SkillTag
              key={skill}
              label={skill}
              variant="add"
              size="sm"
              onClick={() => addSkill(skill)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
