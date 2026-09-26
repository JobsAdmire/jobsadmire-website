import { describe, expect, it } from 'vitest';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';
import { pickClientMessages, SERVER_ONLY_SYS } from './client-messages';

describe('client messages (W90)', () => {
  it('keeps every sys.* namespace except sys.legal.* and sys.seo.*', () => {
    const fixture = {
      sys: {
        skipToContent: 'Skip to content',
        nav: { main: 'Main menu', home: 'Home' },
        legal: { privacy: { title: 'Privacy notice', body: 'Long-form copy' } },
        seo: { home: { title: 'JobsAdmire', description: 'Server-rendered only' } },
        form: { submit: { default: 'Send' } },
      },
    };
    const client = pickClientMessages(fixture);
    expect(client).toEqual({
      sys: {
        skipToContent: 'Skip to content',
        nav: { main: 'Main menu', home: 'Home' },
        form: { submit: { default: 'Send' } },
      },
    });
    expect(client.sys).not.toHaveProperty('legal');
    expect(client.sys).not.toHaveProperty('seo');
    expect(SERVER_ONLY_SYS).toEqual(['legal', 'seo']);
  });

  it('hands the provider the whole real catalogue minus the server-only namespaces', () => {
    for (const messages of [tr, en]) {
      const client = pickClientMessages(messages);
      expect(Object.keys(client)).toEqual(['sys']);
      expect(Object.keys(client.sys)).toEqual(
        Object.keys(messages.sys).filter((ns) => ns !== 'legal' && ns !== 'seo'),
      );
      expect(client.sys).not.toHaveProperty('legal');
      expect(client.sys).not.toHaveProperty('seo');
    }
  });
});
