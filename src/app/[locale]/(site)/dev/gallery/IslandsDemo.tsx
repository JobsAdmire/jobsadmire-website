'use client';
import { useState } from 'react';
import {
  BottomSheet,
  LazyIsland,
  PrintButton,
  ProgressBar,
  RangeSlider,
  ScrollSpyToc,
  SearchInput,
  ShareRow,
  Stepper,
  TriState,
  type TriStateValue,
} from '@/design/islands';
import { Button } from '@/design/primitives';

/** Every island needs state or a handler, which never crosses the RSC boundary — hence one
 *  client demo for the gallery, like DialogDemo. */
export function IslandsDemo() {
  const [salary, setSalary] = useState(33030);
  const [head, setHead] = useState(15);
  const [tri, setTri] = useState<TriStateValue | null>(null);
  const [q, setQ] = useState('');
  const [sheet, setSheet] = useState(false);
  return (
    <div className="print-isolate flex w-full flex-col gap-6">
      <RangeSlider
        id="g-salary"
        label="Gross salary"
        min={30000}
        max={78000}
        step={500}
        value={salary}
        onChange={setSalary}
        formatValue={(v) => `₺${v}`}
        minLabel="₺30,000"
        maxLabel="₺78,000"
      />
      <Stepper
        id="g-head"
        label="Headcount"
        value={head}
        onChange={setHead}
        min={1}
        max={500}
        decrementLabel="Fewer"
        incrementLabel="More"
        hint="1–500"
      />
      <TriState
        name="g-tri"
        legend="Paid-in capital ≥ ₺100,000?"
        value={tri}
        onChange={setTri}
        labels={{ yes: 'Yes', no: 'No', unsure: 'Not sure' }}
      />
      <ProgressBar
        value={tri ? 1 : 0}
        max={5}
        label="Checks answered"
        valueText={`${tri ? 1 : 0} / 5`}
        tone="green"
      />
      <SearchInput
        id="g-q"
        label="Search articles"
        value={q}
        onChange={setQ}
        placeholder="permit…"
        clearLabel="Clear search"
        resultText={q ? `Filtering by “${q}”` : undefined}
      />
      <ScrollSpyToc
        headings={[
          { id: 'g-a', text: 'Primitives' },
          { id: 'g-b', text: 'Islands' },
        ]}
        label="On this page"
        heading="Contents"
        readMinutes={3}
        remainingLabel={(m) => `≈ ${m} min left`}
      />
      <ShareRow
        url="https://www.jobsadmire.com/"
        title="JobsAdmire"
        labels={{
          heading: 'Share',
          share: 'Share…',
          whatsapp: 'WhatsApp',
          linkedin: 'LinkedIn',
          x: 'X',
          copy: 'Copy link',
          copied: 'Link copied',
        }}
      />
      <div className="flex gap-2">
        <Button variant="secondary" onClick={() => setSheet(true)}>
          Open bottom sheet
        </Button>
        <PrintButton label="Print this block" />
      </div>
      {/* W132: the fallback is DOM-identical to the counter's initial state; the counter loads
          once its wrapper is within 200px of the viewport and keeps its count after that. */}
      <LazyIsland
        load={() => import('./LazyCounter')}
        props={{ label: 'LazyIsland clicks' }}
        fallback={<Button variant="secondary">{'LazyIsland clicks: 0'}</Button>}
      />
      <BottomSheet
        open={sheet}
        onClose={() => setSheet(false)}
        title="Choose a role"
        closeLabel="Close"
      >
        <Button variant="primary" onClick={() => setSheet(false)}>
          Welder
        </Button>
      </BottomSheet>
    </div>
  );
}
