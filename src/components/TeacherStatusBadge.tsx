import type { TeacherStatus } from '@/lib/supabase';
import { useI18n } from '@/lib/i18n';

const STYLES: Record<TeacherStatus, string> = {
  draft: 'bg-stone-100 text-stone-600',
  pending: 'bg-amber-100 text-amber-700',
  published: 'bg-emerald-100 text-emerald-700',
};

export function TeacherStatusBadge({ status }: { status: TeacherStatus }) {
  const { t } = useI18n();
  return (
    <span className={`inline-block flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${STYLES[status]}`}>
      {t(`teachers.status.${status}`)}
    </span>
  );
}
