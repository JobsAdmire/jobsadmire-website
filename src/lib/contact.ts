/** Contact hrefs. WhatsApp is co-primary with the phone across the chrome, so the prefill
 *  text always comes from `sys.whatsapp.prefill` — never a hard-coded greeting. */
export const waLink = (number: string, text: string) =>
  `https://wa.me/${number}?text=${encodeURIComponent(text)}`;

export const telLink = (phone: string) => `tel:${phone}`;

export const mailLink = (email: string, subject?: string) =>
  `mailto:${email}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`;
