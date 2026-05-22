import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipProps,
} from 'recharts';
import { APPLICATION_STATUSES, type ApplicationStatus } from '@/api/types';
import { STATUS_META } from '@/lib/constants';
import { Skeleton } from '@/components/ui/Skeleton';

const STATUS_FILL: Record<ApplicationStatus, string> = {
  saved: '#94a3b8',
  applied: '#60a5fa',
  interview: '#fbbf24',
  offer: '#a3e635',
  rejected: '#fb7185',
};

interface ChartDatum {
  name: string;
  count: number;
  status: ApplicationStatus;
}

interface PipelineChartProps {
  counts: Record<ApplicationStatus, number>;
  loading: boolean;
}

function ChartTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  const datum = payload[0]?.payload as ChartDatum | undefined;
  if (!datum) return null;
  return (
    <div className="rounded-lg border border-line bg-elevated px-2.5 py-1.5 shadow-pop">
      <p className="text-xs font-medium text-fg">{datum.name}</p>
      <p className="font-mono text-2xs text-fg-muted">
        {datum.count} role{datum.count === 1 ? '' : 's'}
      </p>
    </div>
  );
}

export function PipelineChart({ counts, loading }: PipelineChartProps) {
  const data: ChartDatum[] = APPLICATION_STATUSES.map((status) => ({
    name: STATUS_META[status].label,
    count: counts[status],
    status,
  }));
  const total = data.reduce((sum, datum) => sum + datum.count, 0);

  return (
    <section className="rounded-2xl border border-line bg-surface p-5">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-fg">Pipeline overview</h2>
        <p className="text-xs text-fg-muted">
          {total} role{total === 1 ? '' : 's'} tracked across stages
        </p>
      </div>

      {loading ? (
        <Skeleton className="h-[208px] w-full" />
      ) : total === 0 ? (
        <div className="grid h-[208px] place-items-center text-center text-sm text-fg-muted">
          Track a role to watch your funnel take shape.
        </div>
      ) : (
        <div className="h-[208px] w-full text-fg-muted">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 4, bottom: 0, left: 4 }}>
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tick={{ fill: 'currentColor', fontSize: 11 }}
                dy={6}
              />
              <YAxis hide domain={[0, 'dataMax + 1']} />
              <Tooltip
                cursor={{ fill: 'rgba(128,128,138,0.1)', radius: 6 }}
                content={<ChartTooltip />}
              />
              <Bar dataKey="count" radius={[6, 6, 2, 2]} maxBarSize={54}>
                <LabelList
                  dataKey="count"
                  position="top"
                  offset={8}
                  fill="currentColor"
                  fontSize={12}
                  fontWeight={600}
                />
                {data.map((datum) => (
                  <Cell key={datum.status} fill={STATUS_FILL[datum.status]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
