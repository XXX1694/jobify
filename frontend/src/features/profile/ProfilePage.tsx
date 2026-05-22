import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Check, Github, Sparkles } from 'lucide-react';
import type { ProfileInput } from '@/api/types';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useUpdateProfile } from '@/hooks/useProfile';
import { SKILL_SUGGESTIONS } from '@/lib/constants';
import { PageHeader } from '@/components/common/PageHeader';
import { SkillsInput } from '@/components/common/SkillsInput';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { Switch } from '@/components/ui/Switch';
import { Avatar } from '@/components/ui/Avatar';
import { Progress } from '@/components/ui/Progress';
import { SkillTag } from '@/components/common/SkillTag';
import { cn } from '@/lib/cn';

const schema = z
  .object({
    name: z.string().max(120, 'Keep it under 120 characters'),
    bio: z.string().max(600, 'Keep it under 600 characters'),
    experience_years: z.coerce.number().min(0, 'Cannot be negative').max(60),
    salary_min: z.coerce.number().min(0, 'Cannot be negative'),
    salary_max: z.coerce.number().min(0, 'Cannot be negative'),
    remote_only: z.boolean(),
    github_url: z.union([z.literal(''), z.string().url('Enter a valid URL')]),
  })
  .refine((data) => data.salary_max === 0 || data.salary_max >= data.salary_min, {
    message: 'Max must be above the minimum',
    path: ['salary_max'],
  });

interface FormValues {
  name: string;
  bio: string;
  experience_years: number;
  salary_min: number;
  salary_max: number;
  remote_only: boolean;
  github_url: string;
}

export default function ProfilePage() {
  const profile = useAuthStore((state) => state.profile);
  const user = useAuthStore((state) => state.user);
  const updateProfile = useUpdateProfile();
  const [skills, setSkills] = useState<string[]>(profile?.skills ?? []);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: profile?.name ?? '',
      bio: profile?.bio ?? '',
      experience_years: profile?.experience_years ?? 0,
      salary_min: profile?.salary_min ?? 0,
      salary_max: profile?.salary_max ?? 0,
      remote_only: profile?.remote_only ?? false,
      github_url: profile?.github_url ?? '',
    },
  });

  useEffect(() => {
    if (!profile) return;
    reset({
      name: profile.name,
      bio: profile.bio,
      experience_years: profile.experience_years,
      salary_min: profile.salary_min,
      salary_max: profile.salary_max,
      remote_only: profile.remote_only,
      github_url: profile.github_url,
    });
    setSkills(profile.skills);
  }, [profile, reset]);

  const values = watch();
  const remoteOnly = watch('remote_only');
  const skillsDirty =
    JSON.stringify([...skills].sort()) !==
    JSON.stringify([...(profile?.skills ?? [])].sort());
  const dirty = isDirty || skillsDirty;

  const checklist = [
    { label: 'Add your name', done: values.name.trim().length > 0 },
    { label: 'Write a short bio', done: values.bio.trim().length >= 20 },
    { label: 'List at least 3 skills', done: skills.length >= 3 },
    {
      label: 'Set salary expectations',
      done: Number(values.salary_min) > 0 || Number(values.salary_max) > 0,
    },
    { label: 'Link your GitHub', done: values.github_url.trim().length > 0 },
  ];
  const completeness = Math.round(
    (checklist.filter((item) => item.done).length / checklist.length) * 100,
  );

  const onSubmit = handleSubmit((formValues) => {
    const payload: ProfileInput = {
      name: formValues.name.trim(),
      bio: formValues.bio.trim(),
      skills,
      experience_years: Number(formValues.experience_years),
      salary_min: Number(formValues.salary_min),
      salary_max: Number(formValues.salary_max),
      remote_only: formValues.remote_only,
      github_url: formValues.github_url.trim(),
    };
    updateProfile.mutate(payload, {
      onSuccess: (saved) => {
        reset({
          name: saved.name,
          bio: saved.bio,
          experience_years: saved.experience_years,
          salary_min: saved.salary_min,
          salary_max: saved.salary_max,
          remote_only: saved.remote_only,
          github_url: saved.github_url,
        });
        setSkills(saved.skills);
      },
    });
  });

  const displayName = values.name.trim() || user?.email?.split('@')[0] || 'Developer';

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Profile"
        title="Your developer profile"
        description="Jobify scores every role against this. The richer it is, the sharper your matches."
        actions={
          <Button
            type="submit"
            form="profile-form"
            variant="primary"
            loading={updateProfile.isPending}
            disabled={!dirty}
          >
            {dirty ? 'Save changes' : 'Saved'}
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <form id="profile-form" onSubmit={onSubmit} className="space-y-6 lg:col-span-2">
          <section className="space-y-4 rounded-2xl border border-line bg-surface p-6">
            <h2 className="text-sm font-semibold text-fg">Identity</h2>
            <div className="space-y-1.5">
              <Label htmlFor="name">Display name</Label>
              <Input id="name" placeholder="Ada Lovelace" {...register('name')} />
              {errors.name && (
                <p className="text-xs text-danger">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                rows={4}
                placeholder="Backend engineer who loves distributed systems and clean APIs…"
                {...register('bio')}
              />
              <p
                className={cn(
                  'text-2xs',
                  values.bio.length > 600 ? 'text-danger' : 'text-fg-faint',
                )}
              >
                {values.bio.length} / 600
              </p>
            </div>
          </section>

          <section className="space-y-3 rounded-2xl border border-line bg-surface p-6">
            <div>
              <h2 className="text-sm font-semibold text-fg">Skills</h2>
              <p className="mt-0.5 text-xs text-fg-muted">
                These power your match score on every role.
              </p>
            </div>
            <SkillsInput
              value={skills}
              onChange={setSkills}
              suggestions={SKILL_SUGGESTIONS}
            />
          </section>

          <section className="space-y-4 rounded-2xl border border-line bg-surface p-6">
            <h2 className="text-sm font-semibold text-fg">Preferences</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="experience">Years of experience</Label>
                <Input
                  id="experience"
                  type="number"
                  min={0}
                  max={60}
                  {...register('experience_years')}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="salary-min">Salary floor (USD/mo)</Label>
                <Input
                  id="salary-min"
                  type="number"
                  min={0}
                  step={500}
                  {...register('salary_min')}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="salary-max">Salary target (USD/mo)</Label>
                <Input
                  id="salary-max"
                  type="number"
                  min={0}
                  step={500}
                  {...register('salary_max')}
                />
                {errors.salary_max && (
                  <p className="text-xs text-danger">{errors.salary_max.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="github">GitHub URL</Label>
              <Input
                id="github"
                icon={<Github />}
                placeholder="https://github.com/yourhandle"
                {...register('github_url')}
              />
              {errors.github_url && (
                <p className="text-xs text-danger">{errors.github_url.message}</p>
              )}
            </div>
            <div className="flex items-center justify-between rounded-xl border border-line bg-canvas px-3.5 py-3">
              <div>
                <p className="text-sm font-medium text-fg">Remote only</p>
                <p className="text-xs text-fg-muted">
                  Surface remote-friendly roles first.
                </p>
              </div>
              <Switch
                checked={remoteOnly}
                onCheckedChange={(checked) =>
                  setValue('remote_only', checked, { shouldDirty: true })
                }
              />
            </div>
          </section>
        </form>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-line bg-surface p-6">
            <div className="mb-3 flex items-baseline justify-between">
              <h2 className="text-sm font-semibold text-fg">Profile strength</h2>
              <span className="font-mono text-lg font-semibold tabular-nums text-accent-text">
                {completeness}%
              </span>
            </div>
            <Progress value={completeness} />
            <ul className="mt-4 space-y-2">
              {checklist.map((item) => (
                <li key={item.label} className="flex items-center gap-2.5 text-sm">
                  <span
                    className={cn(
                      'grid size-4 shrink-0 place-items-center rounded-full border transition-colors',
                      item.done
                        ? 'border-accent bg-accent text-accent-ink'
                        : 'border-line text-transparent',
                    )}
                  >
                    <Check className="size-2.5" strokeWidth={3.5} />
                  </span>
                  <span className={item.done ? 'text-fg-muted line-through' : 'text-fg'}>
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-line bg-surface p-6">
            <p className="mono-label mb-3">Preview</p>
            <div className="flex items-center gap-3">
              <Avatar name={displayName} size="lg" />
              <div className="min-w-0">
                <p className="truncate font-semibold text-fg">{displayName}</p>
                <p className="truncate text-xs text-fg-muted">
                  {Number(values.experience_years) > 0
                    ? `${values.experience_years} yrs experience`
                    : 'Experience not set'}
                </p>
              </div>
            </div>
            {skills.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {skills.slice(0, 8).map((skill) => (
                  <SkillTag key={skill} label={skill} size="sm" />
                ))}
                {skills.length > 8 && (
                  <span className="inline-flex h-6 items-center rounded-lg border border-line px-2 font-mono text-2xs text-fg-faint">
                    +{skills.length - 8}
                  </span>
                )}
              </div>
            ) : (
              <p className="mt-4 flex items-center gap-1.5 text-xs text-fg-muted">
                <Sparkles className="size-3.5 text-accent-text" />
                Add skills to start matching against roles.
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
