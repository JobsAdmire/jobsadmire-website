'use client';
import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { useTranslations } from 'next-intl';
import { FormField } from '@/design/primitives/FormField';
import { useFieldError, useFieldId, useRegisterField } from '@/forms/client/FormErrorsContext';
import { PaperclipIcon } from './icons';
import {
  checkEvidence,
  EVIDENCE_ACCEPT,
  EVIDENCE_MAX_FILES,
  EVIDENCE_MAX_MB,
  type EvidenceUploadResult,
  type UploadEvidenceAction,
} from '../_lib/evidence';

type ItemState = 'uploading' | 'attached' | 'tooBig' | 'badType' | 'refused' | 'failed';
type Item = { id: string; name: string; state: ItemState; key?: string };

/** The catalog wire name the hidden inputs carry; the file input itself has NO name (W101). */
const KEYS_FIELD = 'evidenceKeys';

/** The native control covers the styled face and stays transparent (S4.1): the browser's own
 *  "Choose Files / No file chosen" text — English on the Turkish page — never shows, while the
 *  input keeps its name (the visually hidden label), its keyboard focus and its click target. */
const FILE_INPUT = 'absolute inset-0 size-full cursor-pointer opacity-0';

/** The face: the report box's dashed "attach" row (dark, like the fields above it). Its focus ring
 *  follows the transparent input inside it. */
const FACE =
  'relative flex min-h-[48px] items-center gap-2.5 rounded-xs border-[1.5px] border-dashed border-white/30 bg-white/[0.04] px-3.5 py-2.5 text-white/85 transition-colors hover:border-white/50 hover:bg-white/[0.08] has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-sky has-[input[aria-invalid=true]]:border-[#fca5a5]';

const TONE: Record<ItemState, string> = {
  uploading: 'text-text-secondary',
  attached: 'text-success-text',
  tooBig: 'text-danger',
  badType: 'text-danger',
  refused: 'text-danger',
  failed: 'text-danger',
};

/**
 * The fraud form's evidence (W29/W73/W101/W116): an UNNAMED file input — the bytes never ride
 * the report — whose picked files are checked in the browser (3 MiB, JPEG/PNG/WEBP/PDF, three at
 * most — `_lib/evidence.ts`, pinned to `@/forms/uploads`) and posted ONE PER SERVER-ACTION CALL,
 * one after another, to the page's `uploadEvidence`; each returned key becomes a hidden
 * `evidenceKeys` input the report then sends. While a file is in flight the report is held (a
 * native `submit` listener cancels it before React dispatches the action — the check FormShell's
 * double-submit guard relies on) and `sys.form.evidence.wait` says why. A kept key whose report
 * is never sent is an orphan the Operations purge removes after 7 days.
 */
export function EvidenceUpload({ upload }: { upload: UploadEvidenceAction }) {
  const sys = useTranslations('sys');
  const inputId = useFieldId('evidence');
  const error = useFieldError(KEYS_FIELD);
  useRegisterField(KEYS_FIELD);
  const inputRef = useRef<HTMLInputElement>(null);
  const seq = useRef(0);
  const [items, setItems] = useState<Item[]>([]);
  const [tooMany, setTooMany] = useState(false);
  const [held, setHeld] = useState(false);
  const uploading = items.some((i) => i.state === 'uploading');
  const taken = items.filter((i) => i.state === 'uploading' || i.state === 'attached').length;

  useEffect(() => {
    const form = inputRef.current?.form;
    if (!form || !uploading) return;
    const hold = (e: SubmitEvent) => {
      e.preventDefault();
      setHeld(true);
    };
    form.addEventListener('submit', hold);
    return () => form.removeEventListener('submit', hold);
  }, [uploading]);

  const settle = (id: string, result: EvidenceUploadResult) =>
    setItems((prev) =>
      prev.map((i): Item => {
        if (i.id !== id) return i;
        if (result.ok) return { ...i, state: 'attached', key: result.key };
        return { ...i, state: result.reason === 'file' ? 'refused' : 'failed' };
      }),
    );

  const onPick = async (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const picked = Array.from(input.files ?? []);
    input.value = ''; // the same file can be picked again after a removal
    setHeld(false);
    const next = (name: string, state: ItemState): Item => {
      seq.current += 1;
      return { id: `evidence-${seq.current}`, name, state };
    };
    const checked = picked.map((file) => ({ file, check: checkEvidence(file) }));
    const fine = checked.filter((c) => c.check === 'ok').map((c) => c.file);
    const room = Math.max(0, EVIDENCE_MAX_FILES - taken);
    setTooMany(fine.length > room);
    const refused = checked.flatMap((c) =>
      c.check === 'tooBig' || c.check === 'badType'
        ? [next(c.file.name, c.check)]
        : c.check === 'empty'
          ? [next(c.file.name, 'refused')]
          : [],
    );
    const queue = fine.slice(0, room).map((file) => ({ file, item: next(file.name, 'uploading') }));
    setItems((prev) => [...prev, ...refused, ...queue.map((q) => q.item)]);
    // Sequential on purpose: one file per server-action call (W73/W101).
    for (const { file, item } of queue) {
      const body = new FormData();
      body.append('file', file, file.name);
      let result: EvidenceUploadResult;
      try {
        result = await upload(body);
      } catch {
        // the browser → Vercel call itself failed (flaky data, a body over the limit)
        result = { ok: false, reason: 'door' };
      }
      settle(item.id, result);
    }
  };

  const remove = (id: string) => {
    setTooMany(false); // M2: the "up to 3" notice ends when room is made
    setItems((prev) => prev.filter((i) => i.id !== id));
  };
  const kept = items.filter((i): i is Item & { key: string } => i.state === 'attached' && !!i.key);

  return (
    <div className="flex flex-col gap-2" data-testid="fraud-evidence">
      <FormField
        id={inputId}
        label={sys('form.labels.evidence')}
        hint={sys('form.hints.evidence')}
        error={error}
        labelMode="hidden"
        hintVisible={false}
      >
        {(p) => (
          <div className={FACE}>
            <PaperclipIcon size={16} className="shrink-0 text-sky" />
            <span aria-hidden="true" className="min-w-0">
              <span className="block text-[14px] font-extrabold xl:text-[11px]">
                {sys('form.labels.evidence')}
                <span className="font-semibold text-white/65"> · {sys('form.hints.optional')}</span>
              </span>
              <span className="block text-[12px] leading-[1.45] font-semibold text-white/65 xl:text-[11px]">
                {sys('form.hints.evidence')}
              </span>
            </span>
            <input
              {...p}
              ref={inputRef}
              type="file"
              multiple
              accept={EVIDENCE_ACCEPT}
              onChange={(e) => void onPick(e)}
              className={FILE_INPUT}
            />
          </div>
        )}
      </FormField>
      <div role="status" className="flex flex-col gap-1.5">
        <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-3 rounded-xs border border-border-1 bg-pale-1 px-3 py-1 text-body-sm"
            >
              <span className={`min-w-0 break-words ${TONE[item.state]}`}>
                {sys(`form.evidence.${item.state}`, { name: item.name, maxMb: EVIDENCE_MAX_MB })}
              </span>
              {item.state === 'uploading' ? null : (
                <button
                  type="button"
                  onClick={() => remove(item.id)}
                  aria-label={sys('form.evidence.remove', { name: item.name })}
                  className="inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-pill text-body font-extrabold text-text-secondary hover:bg-white"
                >
                  ×
                </button>
              )}
            </li>
          ))}
        </ul>
        {tooMany ? (
          <p className="m-0 text-body-sm font-bold text-[#fca5a5]">
            {sys('form.evidence.tooMany', { max: EVIDENCE_MAX_FILES })}
          </p>
        ) : null}
      </div>
      {held && uploading ? (
        <p role="alert" className="m-0 text-body-sm font-bold text-[#fca5a5]">
          {sys('form.evidence.wait')}
        </p>
      ) : null}
      {kept.map((i) => (
        <input key={i.id} type="hidden" name={KEYS_FIELD} value={i.key} />
      ))}
    </div>
  );
}
