import { useState } from 'react';
import { ArrowLeft, ArrowRight, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';
import type { ClassItem, BookingInput } from '@/lib/supabase';
import { useI18n } from '@/lib/i18n';

type Props = {
  cls: ClassItem;
  onBack: () => void;
  onSubmit: (input: BookingInput) => Promise<void>;
};

const today = new Date().toISOString().split('T')[0];

export function BookingForm({ cls, onBack, onSubmit }: Props) {
  const { t, tArea } = useI18n();
  const [participantName, setParticipantName] = useState('');
  const [participantAge, setParticipantAge] = useState('');
  const [isMinor, setIsMinor] = useState(false);
  const [guardianName, setGuardianName] = useState('');
  const [bookerName, setBookerName] = useState('');
  const [bookerEmail, setBookerEmail] = useState('');
  const [bookerPhone, setBookerPhone] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const age = parseInt(participantAge, 10);
    if (isNaN(age) || age < 0) {
      setError(t('booking.errorAge'));
      return;
    }
    if (age < cls.age_min) {
      setError(`${t('booking.errorMinAge')} ${cls.age_min}.`);
      return;
    }
    if (cls.age_max !== null && age > cls.age_max) {
      setError(`${t('booking.errorMaxAge')} ${cls.age_max}.`);
      return;
    }
    if (age < 18 && !guardianName.trim()) {
      setError(t('booking.errorGuardian'));
      return;
    }
    if (!preferredDate) {
      setError(t('booking.errorDate'));
      return;
    }
    if (!bookerEmail.includes('@')) {
      setError(t('booking.errorEmail'));
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        class_id: cls.id,
        participant_name: participantName.trim(),
        participant_age: age,
        guardian_name: age < 18 ? guardianName.trim() : null,
        booker_name: bookerName.trim(),
        booker_email: bookerEmail.trim(),
        booker_phone: bookerPhone.trim(),
        preferred_date: preferredDate,
        notes: notes.trim() || null,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : t('booking.errorGeneric'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleAgeChange = (val: string) => {
    setParticipantAge(val);
    const age = parseInt(val, 10);
    setIsMinor(!isNaN(age) && age < 18);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-500 hover:text-teal-600 transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> {t('booking.back')}
      </button>

      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-teal-50 border-b border-teal-100 px-6 py-5">
          <h1 className="text-xl font-bold text-stone-900 mb-1">{t('booking.bookTitle')} {cls.title}</h1>
          <p className="text-sm text-stone-600">
            {cls.store?.name} &middot; {tArea(cls.store?.area ?? '')} &middot; €{Number(cls.price_eur).toFixed(0)}/session
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Participant section */}
          <div>
            <h2 className="text-sm font-bold text-stone-700 uppercase tracking-wide mb-3">
              {t('booking.participant')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label={t('booking.participantName')} required>
                <input
                  type="text"
                  value={participantName}
                  onChange={(e) => setParticipantName(e.target.value)}
                  required
                  placeholder={t('booking.participantNamePh')}
                  className={inputClass}
                />
              </Field>
              <Field label={t('booking.participantAge')} required>
                <input
                  type="number"
                  value={participantAge}
                  onChange={(e) => handleAgeChange(e.target.value)}
                  required
                  min={0}
                  max={120}
                  placeholder={t('booking.participantAgePh')}
                  className={inputClass}
                />
              </Field>
            </div>
          </div>

          {/* Guardian section (conditional) */}
          {isMinor && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-sm text-amber-800 mb-3">
                {t('booking.minorWarning')}
              </p>
              <Field label={t('booking.guardianName')} required>
                <input
                  type="text"
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                  required
                  placeholder={t('booking.guardianNamePh')}
                  className={inputClass}
                />
              </Field>
            </div>
          )}

          {/* Contact section */}
          <div>
            <h2 className="text-sm font-bold text-stone-700 uppercase tracking-wide mb-3">
              {t('booking.contactDetails')}
            </h2>
            <div className="space-y-4">
              <Field label={t('booking.yourName')} required>
                <input
                  type="text"
                  value={bookerName}
                  onChange={(e) => setBookerName(e.target.value)}
                  required
                  placeholder={t('booking.yourNamePh')}
                  className={inputClass}
                />
              </Field>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label={t('booking.email')} required>
                  <input
                    type="email"
                    value={bookerEmail}
                    onChange={(e) => setBookerEmail(e.target.value)}
                    required
                    placeholder={t('booking.emailPh')}
                    className={inputClass}
                  />
                </Field>
                <Field label={t('booking.phone')} required>
                  <input
                    type="tel"
                    value={bookerPhone}
                    onChange={(e) => setBookerPhone(e.target.value)}
                    required
                    placeholder={t('booking.phonePh')}
                    className={inputClass}
                  />
                </Field>
              </div>
            </div>
          </div>

          {/* Date */}
          <div>
            <h2 className="text-sm font-bold text-stone-700 uppercase tracking-wide mb-3">
              {t('booking.preferredDate')}
            </h2>
            <Field label={t('booking.whenStart')} required>
              <input
                type="date"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                required
                min={today}
                className={inputClass}
              />
            </Field>
            <p className="text-xs text-stone-400 mt-1.5">
              {t('booking.scheduleHint')} {cls.weekly_schedule}
            </p>
          </div>

          {/* Notes */}
          <Field label={t('booking.notes')}>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder={t('booking.notesPh')}
              className={`${inputClass} resize-none`}
            />
          </Field>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-teal-600 text-white font-semibold text-base hover:bg-teal-700 active:scale-[0.98] transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> {t('booking.submitting')}
                </>
              ) : (
                <>
                  {t('booking.submit')} <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
            <p className="flex items-center justify-center gap-1.5 text-xs text-stone-400 mt-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              {t('booking.secure')}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputClass =
  'w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 placeholder:text-stone-400 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all text-sm';

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-stone-700 mb-1.5">
        {label}
        {required && <span className="text-rose-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}
