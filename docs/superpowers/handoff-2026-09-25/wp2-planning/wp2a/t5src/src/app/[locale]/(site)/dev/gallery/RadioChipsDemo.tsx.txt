'use client';
import { useState } from 'react';
import { RadioChips, Tabs } from '@/design/primitives';

/** The two primitives whose props are functions need a client wrapper in the gallery. */
export function RadioChipsDemo() {
  const [role, setRole] = useState<string | null>('general');
  const [tab, setTab] = useState('t1');
  return (
    <div className="flex w-full flex-col gap-6">
      <RadioChips
        name="role"
        legend="Role (RadioChips)"
        value={role}
        onChange={setRole}
        options={[
          { value: 'general', label: 'General worker' },
          { value: 'skilled', label: 'Skilled' },
          { value: 'specialist', label: 'Specialist' },
        ]}
      />
      <p className="text-body-sm m-0 text-text-secondary">{`selected: ${role ?? 'none'}`}</p>
      <Tabs
        defaultId="t1"
        onChange={setTab}
        tabs={[
          { id: 't1', label: 'One', panel: <p>Panel one.</p> },
          { id: 't2', label: 'Two', panel: <p>Panel two.</p> },
        ]}
      />
      <p className="text-body-sm m-0 text-text-secondary">{`Tabs onChange → ${tab}`}</p>
    </div>
  );
}
