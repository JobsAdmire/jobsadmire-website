# Post-launch polish and owner / counsel items

Two open lists: 24 polish items, and 21 items that wait for the owner or counsel.
Taken from the QA sweep of 2026-10-03 (ruling W221, lists B and C, in `docs/superpowers/plans/2026-09-20-wp2-rulings.md`).
Not re-checked since: confirm an item is still open before working on it.

## Post-launch polish (24) — W221 B

- H-05 footer app column renders StoreBadges instead of the text pill
- HW-01 Hire steps list hidden ≤ 700 vs design (drop or D20)
- HW-02 dial/phone wrapper side by side on phones
- HW-03 TR two-line label misaligns the Sektör row at 1440 (needs a label reserve)
- HW-04 PausableMarquee pause pill overlays chips
- calc-04 FaqBlock ask card lacks number/e-mail values (or D20)
- WP-02 three hero chips orphan cell ≤ 1023
- about-04 journey band half-empty at 1440 until the founder publishes
- about-05 placeholder heights at 701–900 (W189 A5 cover mode, W217 tablet list)
- about-06 phone hero order/pill
- contact-03 701–900 band single-column vs two
- W-06 verified section alignment / after-pick CTAs ≤ 700
- ST-2 band WhatsApp glyph (W181)
- ST-3 band CTAs full-width ≤ 700
- V-05 blank under the red-flags card at 1440 (sticky)
- CAR-02 hero grid with the role card hidden
- CAR-03 four decorative glyphs
- BLOG-05 rotating-word underline width
- BLOG-06 share pills icon-only ≥ md (island + fallback, W132)
- BLOG-07 featured card "Read article →"
- SYS-01 portal brand panel spacers
- SYS-05 404 <title> (generateMetadata on the catch-all; prove with a build)
- SYS-08 TR bottom-bar label wraps at 390
- SYS-N4 portal trust row composed line (Phase B)

## Owner / counsel items (21) — W221 C

- Wording to sign: `wp.024`, `wp.083`; `verify.023/024` colon construction; `about.064` calque and `about.111` source disagreement; the CRM Login prototype TR vs the catalogue (6 ids); careers TR fragments `jt.039–041`, `jt.079`, "junior" in `jt.252`.
- Main-nav order: About fifth (conversion-first) vs the design (About first).
- Blog: the "2 languages" tick/pill above an empty TR index; `sys.seo.stories.description` present tense over the W6 empty wall.
- Metrics: three reply promises on `/adaylar` (4 working hours vs 24 h — W192 A2 class); `availworkers.106` over the empty pool.
- SEO lengths beyond the two trimmed pages (blog, noindex) — owner decides.
- Counsel: the consent label names the aydınlatma metni but links `/privacy` (W79) — confirm when the KVKK text lands (bump `CONSENT_VERSION` if changed); `/kvkk` indexable while a placeholder (noindex until counsel's text?); the placeholder pages' "Last updated" date.
- Play listing `com.jobsadmire.portal` live? (badge in every footer).
- The Hire Workers copy words (`hire.201/203/215/221`) applied in round 2 — sign or amend (the texts below).

### Trimmed SEO strings for review (W221 lengths — titles ≤ 66, descriptions ≤ 160; applied in round 2 through `scripts/content-overrides.json`)

| id                                    | locale | before (chars)                                                                                                                                                                                                                                             | after (chars)                                                                                                                                                           |
| ------------------------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `hire.264` (Hire Workers title)       | EN     | "Hire Verified Overseas Workers in Türkiye \| İŞKUR-Licensed \| JobsAdmire" (71)                                                                                                                                                                           | "Hire Verified Overseas Workers in Türkiye \| JobsAdmire" (54 — the package's own OG title `hire.266`)                                                                  |
| `hire.264`                            | TR     | "Türkiye'de belgeli yabancı işçi istihdamı \| İŞKUR İzinli \| JobsAdmire" (69)                                                                                                                                                                             | "Türkiye'de belgeli yabancı işçi istihdamı \| JobsAdmire" (54)                                                                                                          |
| `hire.265` (Hire Workers description) | EN     | "Hire skilled overseas workers in Türkiye in 6–8 weeks. İŞKUR-licensed agency (Permit No. 1730) — we file every work permit, vet every candidate, and you pay no upfront fee. Written quote in 24 hours." (199)                                            | "Hire skilled overseas workers in Türkiye in 6–8 weeks. İŞKUR permit No. 1730: permits filed, candidates vetted, no upfront fee. Written quote in 24 hours." (154)      |
| `hire.265`                            | TR     | "Türkiye'ye yurt dışından nitelikli işçi istihdamı, 6–8 haftada. İŞKUR izinli özel istihdam bürosu (İzin Belgesi No: 1730) — çalışma izni başvurularını biz yapar, her adayı biz doğrularız, peşin ücret ödemezsiniz. 24 saat içinde yazılı teklif." (242) | "Yurt dışından Türkiye'ye nitelikli işçi, 6–8 haftada. İŞKUR izinli (No: 1730) — izinleri alırız, adayları doğrularız, peşin ücret yok. 24 saatte yazılı teklif." (159) |
| `partner.222` (Partner title)         | EN     | "Recruitment Agency Partnership in Türkiye — HR Agencies, Sourcing Agents & Institutes \| JobsAdmire" (98)                                                                                                                                                 | "Recruitment Agency Partnership in Türkiye \| JobsAdmire" (54 — the three audiences stay in `partner.223`, 125)                                                         |
| `partner.222`                         | TR     | "Türkiye’de İşe Alım Ajansı Ortaklığı — İK Ajansları, Tedarik Acenteleri ve Eğitim kurumları \| JobsAdmire" (104)                                                                                                                                          | "Türkiye'de İşe Alım Ajansı Ortaklığı \| JobsAdmire" (49 — `partner.223` keeps the audiences, 124; P-08's capital K is moot)                                            |

`hire.264/265` are legal-flagged (the licence claim moved from the title into the description; the figures 6–8 weeks, 1730 and 24 hours are unchanged). The blog's titles stay (noindex until W4).

### Words authored in round 2 (sign or amend)

- **HW-06** (`hire.201` legal-flagged): `hire.201` EN "Fill the form — your requirement goes straight to our team, and you get a written proposal within 24 hours." / TR "Formu doldurun — talebiniz doğrudan ekibimize ulaşır ve 24 saat içinde yazılı teklif alırsınız."; `hire.203` EN "— your requirement reaches our team" / TR "— talebiniz ekibimize ulaşır" (after `hire.202` "Submit the form" / "Formu gönderin"); `hire.215` EN "Takes 1 minute." / TR "1 dakika sürer."; `hire.221` EN "Prefer email?" / TR "E-posta ile mi yazmak istersiniz?" (before the mailto link `hire.222`). The brief's "Prefer e-mail?" became "Prefer email?" to match `hire.213`/`hire.222`.
- **TR header CTAs, tail first (W222 (4))**: `wp.017` "İzin İçin" → "İzin İçin Başvurun"; `partner.018` "İş Ortaklığı İçin" → "İş Ortaklığı İçin Başvurun". Title case (not the brief's lower-case "izin için başvurun") because the label `Başvurun` stands alone at 901–1100 px, where the design hides the tail — the same casing as "Sahtekârı Bildir" (V-03).
- **About h1 (about-07)**: `about.022` TR "Hakkında" + `about.023` "JobsAdmire" (both locales) → TR "JobsAdmire Hakkında", EN "About JobsAdmire".
- **Other round-2 TR wording** (A 1–17): `home.228` "İŞKUR İzin Belgesi No: 1730 · İş arayanlardan hiçbir ücret alınmaz (4904 sayılı kanun) · Vergi No: 48422122" (legal — label wording only); `calc.213` "Nitelikli mesleklerde zor — kaynakçı, makine operatörü ve sezonluk işler aylarca boş kalabiliyor"; `wp.346` "…İş Ortağı Olun sayfasında…"; `wp.267` "2–6. haftalar"; `partner.048` "…Doğrudan işçi almak isteyen işverenler" + `partner.049` "sayfasından başlayabilir."; `partner.118` EN "Which professions and how many candidates can you supply?" / TR "Hangi meslekleri ve kaç aday tedarik edebilirsiniz?"; `contact.115` "…Destek ekibimiz randevunuzu bir saat içinde WhatsApp üzerinden onaylar. Kahve bizden."; `availworkers.144` EN "Which roles?" / TR "Hangi pozisyonlar?", `145` EN "Sector and target start date" / TR "Sektör ve hedef başlangıç tarihi", `151` EN "Which roles do your clients need?" / TR "Müşterileriniz hangi pozisyonlara ihtiyaç duyuyor?", `152` EN "Sectors you serve" / TR "Hizmet verdiğiniz sektörler" (the kernel prints "Optional" itself); `availworkers.016` EN "See candidates" / TR "Adayları gör"; `verify.089` "Bugün imzalamanız ya da ödeme yapmanız için baskı yapıyor." (legal — the duplicated sentence dropped); `jt.312` "pozisyonu ("; `home.219` "Kullanım Koşulları"; `home.006`/`hire.007`/`calc.316` "Başarı Hikâyeleri"; `partner.214` "© 2026 JobsAdmire".
- **New `sys.*` strings**: `sys.verify.flags.qr` EN "The QR must open this page — nothing else counts. Until the public register is published, confirm the ID with the JobsAdmire office by phone or WhatsApp." / TR "QR kodu bu sayfayı açmalıdır — başka hiçbir şey geçerli değildir. Herkese açık kayıt defteri yayımlanana kadar kimliği JobsAdmire ofisiyle telefonla ya da WhatsApp üzerinden teyit edin."; `sys.seo.thankYou.title` "Thank you | JobsAdmire" / "Teşekkürler | JobsAdmire" and `.description` (= `sys.thankYou.body`); `sys.blog.index.guides` EN "{n, plural, one {guide} other {guides}}" / TR "rehber"; `sys.legal.privacy.cookiePolicyLink` "Read the Cookie Policy" / "Çerez Politikası'nı okuyun"; the LEGAL-03/05/07 sentences as the triage gave them.
- **UK English** (`about.052` legal, spelling only): "İŞKUR licence granted — permit No. 1730"; `about.080` "…standardised, error-free, ready in seconds."
