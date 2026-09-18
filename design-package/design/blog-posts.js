/* Shared article index for Blog.dc.html cards and Blog Article.dc.html.
   Loaded as a plain script in <helmet>; exposes window.JA_BLOG_POSTS. */
(function () {
  var P = [
    { slug: "turkey-work-permit-process-employer-guide", lang: "en", cat: "Work Permits", title: "Turkey work permit process for foreign workers: the complete employer's guide", excerpt: "Everything an employer needs to know before hiring overseas workers — required documents, İŞKUR criteria, costs, timelines, and the mistakes that get applications rejected.", date: "June 12, 2026", read: "8 min read", full: true },
    { slug: "hiring-from-pakistan-turkish-employers", lang: "en", cat: "Recruitment", title: "Hiring from Pakistan: what Turkish employers should know", excerpt: "Skill profiles, vetting standards and why the Pakistan corridor delivers reliable factory and agriculture workers.", date: "May 2026", read: "5 min read" },
    { slug: "iskur-rules-private-employment-agencies", lang: "en", cat: "Compliance", title: "İŞKUR rules for private employment agencies, explained", excerpt: "What permit No. 1730 means, why job seekers never pay a fee, and how to verify any agency's license.", date: "May 2026", read: "4 min read" },
    { slug: "turkey-labor-shortage-factories-hiring-overseas", lang: "en", cat: "Market News", title: "Turkey's labor shortage: why factories are hiring overseas", excerpt: "Manufacturing, tourism and agriculture are all short on workers — here's what the data says and what employers are doing.", date: "April 2026", read: "6 min read" },
    { slug: "work-permit-costs-timelines-budget", lang: "en", cat: "Work Permits", title: "Work permit costs & timelines: what employers should budget", excerpt: "Government fees, processing times and the realistic end-to-end budget for bringing one worker to your site.", date: "April 2026", read: "5 min read" },
    { slug: "onboarding-overseas-workers-first-30-days", lang: "en", cat: "Recruitment", title: "Onboarding overseas workers: the first 30 days checklist", excerpt: "Housing, SGK registration, orientation and retention — how to set new arrivals up for success from day one.", date: "March 2026", read: "5 min read" },
    { slug: "seasonal-agriculture-workforce-harvest-hiring", lang: "en", cat: "Market News", title: "Seasonal agriculture workforce: planning your harvest hiring", excerpt: "Why farms that request workers 3 months ahead never miss a season — a planning timeline for growers.", date: "March 2026", read: "4 min read" },
    { slug: "hotel-resort-staffing-2026-tourism-season", lang: "en", cat: "Recruitment", title: "Hotel & resort staffing: preparing for the 2026 tourism season", excerpt: "Antalya's hotels start recruiting in winter. A staffing timeline for housekeeping, kitchen and front-office roles.", date: "February 2026", read: "4 min read" },
    { slug: "work-permit-renewals-deadlines", lang: "en", cat: "Work Permits", title: "Work permit renewals: don't lose your workforce to missed deadlines", excerpt: "Renewal windows, required updates and how to keep a valid permit for every worker on site.", date: "February 2026", read: "3 min read" },
    { slug: "sgk-registration-foreign-workers", lang: "en", cat: "Compliance", title: "SGK registration for foreign workers: employer obligations", excerpt: "Social security registration, premiums and the 30-day rule after your worker arrives in Turkey.", date: "January 2026", read: "4 min read" },
    { slug: "work-permit-rejection-reasons", lang: "en", cat: "Work Permits", title: "Turkey work permit rejection reasons — and how to avoid them", excerpt: "The 7 most common rejection grounds we see, with the fix for each one before you file.", date: "January 2026", read: "5 min read" },
    { slug: "work-visa-vs-work-permit-turkey", lang: "en", cat: "Work Permits", title: "Work visa vs work permit in Turkey: what's the difference?", excerpt: "Two documents, two processes, one hire — how the consulate visa and ministry permit fit together.", date: "December 2025", read: "4 min read" },
    { slug: "turkey-work-permit-quota-system", lang: "en", cat: "Work Permits", title: "Turkey's work permit quota system explained for employers", excerpt: "How sector quotas and shortage-occupation lists change what you can apply for.", date: "December 2025", read: "5 min read" },
    { slug: "hire-factory-workers-turkey-overseas", lang: "en", cat: "Recruitment", title: "How to hire factory workers in Turkey from overseas", excerpt: "From skill test to shift start: a manufacturing-specific hiring walkthrough.", date: "December 2025", read: "6 min read" },
    { slug: "hiring-construction-workers-central-asia", lang: "en", cat: "Recruitment", title: "Hiring construction workers from Central Asia: a practical guide", excerpt: "Trades, certifications and mobilization timelines for building sites.", date: "November 2025", read: "5 min read" },
    { slug: "agriculture-workers-seasonal-vs-yearly-contracts", lang: "en", cat: "Recruitment", title: "Agriculture workers for Turkish farms: seasonal vs yearly contracts", excerpt: "Which contract type fits your crop calendar — and what each means for permits.", date: "November 2025", read: "4 min read" },
    { slug: "verify-recruitment-agency-turkey-checklist", lang: "en", cat: "Recruitment", title: "How to verify a recruitment agency in Turkey: 6-point checklist", excerpt: "License lookup, fee rules and red flags — protect your company from unlicensed operators.", date: "October 2025", read: "3 min read" },
    { slug: "foreign-worker-minimum-salary-thresholds-2026", lang: "en", cat: "Compliance", title: "Foreign worker minimum salary thresholds in Turkey (2026 update)", excerpt: "The ministry's role-based salary multipliers, updated for the new minimum wage.", date: "October 2025", read: "4 min read" },
    { slug: "employer-obligations-housing-insurance-contracts", lang: "en", cat: "Compliance", title: "Employer obligations: housing, insurance and contracts for foreign staff", excerpt: "What the law requires you to provide — and what good employers add on top.", date: "September 2025", read: "5 min read" },
    { slug: "turkey-2026-minimum-wage-hiring-costs", lang: "en", cat: "Market News", title: "Turkey's 2026 minimum wage: what it means for hiring costs", excerpt: "New wage floor, new permit salary thresholds — the numbers employers need.", date: "September 2025", read: "4 min read" },
    { slug: "top-5-countries-turkish-employers-recruited-2025", lang: "en", cat: "Market News", title: "Top 5 countries Turkish employers recruited from in 2025", excerpt: "Corridor-by-corridor data on where Turkey's overseas workforce came from last year.", date: "August 2025", read: "5 min read" },
    { slug: "tourism-season-2026-antalya-hotel-staffing", lang: "en", cat: "Market News", title: "Tourism season 2026: Antalya's hotel staffing outlook", excerpt: "Occupancy forecasts and what they mean for housekeeping and kitchen hiring.", date: "August 2025", read: "4 min read" },
    { slug: "yabanci-isciler-calisma-izni-rehberi", lang: "tr", cat: "İş İzinleri", title: "Yabancı işçiler için çalışma izni süreci: eksiksiz işveren rehberi", excerpt: "Yurt dışından işçi almadan önce işverenin bilmesi gereken her şey — gerekli belgeler, İŞKUR kriterleri, maliyetler, süreler ve başvuruları reddettiren hatalar.", date: "Haziran 2026", read: "8 dk okuma" },
    { slug: "pakistandan-isci-istihdami", lang: "tr", cat: "İşe Alım", title: "Pakistan'dan işçi istihdamı: Türk işverenlerin bilmesi gerekenler", excerpt: "Beceri profilleri, doğrulama standartları ve Pakistan koridorunun güvenilir fabrika ve tarım işçisi sağlamasının nedenleri.", date: "Mayıs 2026", read: "5 dk okuma" },
    { slug: "iskur-ozel-istihdam-burolari-kurallari", lang: "tr", cat: "Mevzuat", title: "Özel istihdam büroları için İŞKUR kuralları", excerpt: "1730 numaralı iznin anlamı, iş arayanlardan neden ücret alınmadığı ve bir ajansın lisansının nasıl doğrulanacağı.", date: "Mayıs 2026", read: "4 dk okuma" },
    { slug: "turkiye-de-isgucu-acigi", lang: "tr", cat: "Piyasa Haberleri", title: "Türkiye'de işgücü açığı: fabrikalar neden yurt dışından işçi alıyor?", excerpt: "İmalat, turizm ve tarımda işçi açığı büyüyor — veriler ne söylüyor, işverenler ne yapıyor?", date: "Nisan 2026", read: "6 dk okuma" }
  ];
  var COVERS = {
    "Work Permits": ["#1899D5", "#0e5f8f"], "İş İzinleri": ["#1899D5", "#0e5f8f"],
    "Recruitment": ["#16a34a", "#0b6b2f"], "İşe Alım": ["#16a34a", "#0b6b2f"],
    "Compliance": ["#7c3aed", "#4c1d95"], "Mevzuat": ["#7c3aed", "#4c1d95"],
    "Market News": ["#f59e0b", "#b45309"], "Piyasa Haberleri": ["#f59e0b", "#b45309"]
  };
  window.JA_BLOG_POSTS = P;
  window.JA_BLOG_COVER = function (cat) {
    var c = COVERS[cat] || ["#35468a", "#16202e"];
    return "linear-gradient(135deg, " + c[0] + " 0%, " + c[1] + " 100%)";
  };
  window.JA_BLOG_FIND = function (slug) {
    for (var i = 0; i < P.length; i++) if (P[i].slug === slug) return P[i];
    return P[0];
  };
})();
