import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Job, JobInput } from '@/api/types';
import { useCreateJob, useUpdateJob } from '@/hooks/useJobs';
import { SKILL_SUGGESTIONS } from '@/lib/constants';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { Switch } from '@/components/ui/Switch';
import { SkillsInput } from '@/components/common/SkillsInput';

const schema = z
  .object({
    title: z.string().min(2, 'Give the role a title'),
    company: z.string().min(1, 'Company is required'),
    description: z.string().min(10, 'Add a few words about the role'),
    location: z.string(),
    url: z.union([z.literal(''), z.string().url('Enter a valid URL')]),
    salary_min: z.coerce.number().min(0, 'Must be 0 or more'),
    salary_max: z.coerce.number().min(0, 'Must be 0 or more'),
    is_remote: z.boolean(),
  })
  .refine((data) => data.salary_max === 0 || data.salary_max >= data.salary_min, {
    message: 'Max salary must be above the minimum',
    path: ['salary_max'],
  });

type FormValues = z.input<typeof schema>;

interface JobFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job?: Job;
}

const EMPTY: FormValues = {
  title: '',
  company: '',
  description: '',
  location: '',
  url: '',
  salary_min: 0,
  salary_max: 0,
  is_remote: true,
};

export function JobFormDialog({ open, onOpenChange, job }: JobFormDialogProps) {
  const isEdit = Boolean(job);
  const [skills, setSkills] = useState<string[]>([]);
  const createJob = useCreateJob();
  const updateJob = useUpdateJob();
  const pending = createJob.isPending || updateJob.isPending;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY,
  });

  useEffect(() => {
    if (!open) return;
    if (job) {
      reset({
        title: job.title,
        company: job.company,
        description: job.description,
        location: job.location,
        url: job.url,
        salary_min: job.salary_min,
        salary_max: job.salary_max,
        is_remote: job.is_remote,
      });
      setSkills(job.skills);
    } else {
      reset(EMPTY);
      setSkills([]);
    }
  }, [open, job, reset]);

  const isRemote = watch('is_remote');

  const onSubmit = handleSubmit((values) => {
    const payload: JobInput = {
      title: values.title.trim(),
      company: values.company.trim(),
      description: values.description.trim(),
      location: values.location.trim(),
      url: values.url.trim(),
      salary_min: Number(values.salary_min),
      salary_max: Number(values.salary_max),
      is_remote: values.is_remote,
      skills,
    };
    const onDone = { onSuccess: () => onOpenChange(false) };
    if (job) {
      updateJob.mutate({ id: job.id, input: payload }, onDone);
    } else {
      createJob.mutate(payload, onDone);
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] max-w-xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit role' : 'Post a new role'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the details developers see for this opening.'
              : 'Publish an opening to the Jobify board for developers to discover.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="job-title">Role title</Label>
              <Input
                id="job-title"
                placeholder="Senior Go Engineer"
                invalid={Boolean(errors.title)}
                {...register('title')}
              />
              {errors.title && (
                <p className="text-xs text-danger">{errors.title.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="job-company">Company</Label>
              <Input
                id="job-company"
                placeholder="Cloudflare"
                invalid={Boolean(errors.company)}
                {...register('company')}
              />
              {errors.company && (
                <p className="text-xs text-danger">{errors.company.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="job-description">Description</Label>
            <Textarea
              id="job-description"
              rows={4}
              placeholder="What the role involves, the team, the stack…"
              invalid={Boolean(errors.description)}
              {...register('description')}
            />
            {errors.description && (
              <p className="text-xs text-danger">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>Required skills</Label>
            <SkillsInput
              value={skills}
              onChange={setSkills}
              suggestions={SKILL_SUGGESTIONS}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="job-salary-min">Min salary (USD / month)</Label>
              <Input
                id="job-salary-min"
                type="number"
                min={0}
                step={500}
                {...register('salary_min')}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="job-salary-max">Max salary (USD / month)</Label>
              <Input
                id="job-salary-max"
                type="number"
                min={0}
                step={500}
                invalid={Boolean(errors.salary_max)}
                {...register('salary_max')}
              />
              {errors.salary_max && (
                <p className="text-xs text-danger">{errors.salary_max.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="job-location">Location</Label>
              <Input
                id="job-location"
                placeholder={isRemote ? 'Worldwide' : 'San Francisco, USA'}
                {...register('location')}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="job-url">Apply URL</Label>
              <Input
                id="job-url"
                placeholder="https://company.com/careers"
                invalid={Boolean(errors.url)}
                {...register('url')}
              />
              {errors.url && (
                <p className="text-xs text-danger">{errors.url.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-line bg-canvas px-3.5 py-3">
            <div>
              <p className="text-sm font-medium text-fg">Remote role</p>
              <p className="text-xs text-fg-muted">Open to candidates working remotely.</p>
            </div>
            <Switch
              checked={isRemote}
              onCheckedChange={(checked) =>
                setValue('is_remote', checked, { shouldDirty: true })
              }
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={pending}>
              {isEdit ? 'Save changes' : 'Publish role'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
