import { useRef, useState } from 'react';
import { Loader2, ImagePlus, Trash2, AlertCircle } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { validateStudioImage, uploadStudioImage } from '@/lib/studioImageUpload';

type Props = {
  value: string;
  onChange: (url: string) => void;
};

export function ImageUploadField({ value, onChange }: Props) {
  const { t } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    const problem = validateStudioImage(file);
    if (problem) {
      setError(t(problem === 'invalidType' ? 'upload.invalidType' : 'upload.tooLarge'));
      return;
    }

    setError(null);
    setUploading(true);
    try {
      onChange(await uploadStudioImage(file));
    } catch {
      setError(t('upload.failed'));
    } finally {
      setUploading(false);
    }
  };

  const openPicker = () => inputRef.current?.click();

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFile}
        className="hidden"
      />

      {value ? (
        <div className="relative h-36 rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
          <img src={value} alt="" className="w-full h-full object-cover" />
          <div className="absolute bottom-2 right-2 flex gap-2">
            <button
              type="button"
              onClick={openPicker}
              disabled={uploading}
              className="px-3 py-1.5 rounded-lg bg-white/95 text-stone-700 text-xs font-semibold shadow-sm hover:bg-white transition-colors disabled:opacity-60"
            >
              {t('upload.change')}
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              disabled={uploading}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/95 text-rose-600 text-xs font-semibold shadow-sm hover:bg-white transition-colors disabled:opacity-60"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {t('upload.remove')}
            </button>
          </div>
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70">
              <Loader2 className="w-6 h-6 text-teal-600 animate-spin" />
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={openPicker}
          disabled={uploading}
          className="w-full flex flex-col items-center justify-center gap-1.5 h-28 rounded-xl border-2 border-dashed border-stone-300 bg-stone-50 text-stone-600 hover:border-teal-400 hover:text-teal-700 hover:bg-teal-50/40 transition-colors disabled:opacity-60"
        >
          {uploading ? (
            <Loader2 className="w-6 h-6 text-teal-600 animate-spin" />
          ) : (
            <ImagePlus className="w-6 h-6" />
          )}
          <span className="text-sm font-semibold">
            {uploading ? t('upload.uploading') : t('upload.choose')}
          </span>
          {!uploading && <span className="text-xs text-stone-400">{t('upload.hint')}</span>}
        </button>
      )}

      {error && (
        <div className="flex items-start gap-2 text-xs text-rose-600 font-medium">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-px" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
