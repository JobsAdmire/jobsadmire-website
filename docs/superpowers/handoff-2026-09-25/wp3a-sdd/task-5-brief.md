### Task 5: `Inquiry.contactName` end to end (DTOs, service create/update/search, conversion → `Lead.contactPerson`, frontend types/list/detail/form)

Scope per RC1: Task 5 = `Inquiry.contactName` and nothing else. It produces **no** guard, config service, website file, seed or docs edit. The "Consumes (Task 5 guards)" / "Consumes (Task 5 — integrations config)" / "Task 5/7/12 append their controllers" lines in the Task 1/8/9/10/11 drafts were stale numbering (check.md, ordering_problems): the guard is Task 2's (`src/modules/website/guards/website-module-enabled.guard.ts`), `WebsiteApiGuard` + `WebsiteIntegrationConfigService` + `WebsitePingService` are Task 4's, the inbox controller is Task 7's. This task touches only the Sales module and its two frontend pages. Docs: Task 3 already documents the column in PRD §8; Task 12 owns the PRD §5.1 prose for `contactName` (RC10) — nothing is written here.

**Files:**
- Create `apps/backend/src/modules/sales/inquiry.contact-name.spec.ts`
- Modify `apps/backend/src/modules/sales/dto/create-inquiry.dto.ts` — one property inserted after the block ending `  companyName?: string;` (followed today by a blank line and the `  @ApiPropertyOptional()` of the `country` block)
- Modify `apps/backend/src/modules/sales/dto/update-inquiry.dto.ts` — same insertion after its `  companyName?: string;`
- Modify `apps/backend/src/modules/sales/inquiry.service.ts` — five anchors: `        companyName: dto.companyName,` (create mapping); `        { companyName: { contains: search, mode: 'insensitive' } },` (search `OR`); `    if (dto.companyName !== undefined) data.companyName = dto.companyName;` (update mapping); `      companyName: string | null;` inside the `convertToLeadInternal(` input type; `        email: inquiry.email,` inside its `prisma.lead.create` data
- Modify `apps/frontend/src/lib/api/sales.ts` — three anchors: `  companyName: string | null;` inside `export interface Inquiry {`; `  companyName?: string;` inside `export interface CreateInquiryPayload {`; `  companyName?: string;` inside `export interface UpdateInquiryPayload {`
- Modify `apps/frontend/src/app/[locale]/admin/sales/inquiries/page.tsx` — six anchors: `  companyName: z.string().max(120).optional().or(z.literal('')),` (zod schema); `      companyName: '',` (defaultValues); `      companyName: values.companyName || undefined,` (onSubmit); `      cell: ({ row }) => row.original.companyName ?? '—',` (Company column); `            searchPlaceholder="Company, phone, email…"`; the create form's first `          <div className="grid grid-cols-2 gap-3">` (the Company/Country grid right after the `source` `FormField`)
- Modify `apps/frontend/src/app/[locale]/admin/sales/inquiries/[id]/page.tsx` — two anchors: `            <p className="text-muted-foreground">{inquiry.companyName || 'Unknown Company'}</p>` (header); the detail-grid `Company` row (the first `<div>` inside `        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">`)
- Test: the new spec; `apps/backend/src/modules/sales/inquiry.walink.spec.ts` stays byte-identical and green (no new `InquiryService` constructor dependency); `apps/backend` then `apps/frontend` `tsc --noEmit`

**Interfaces:**
- Consumes (Task 3 — RC1; the draft's "Task 2" was the stale reference check.md flagged): Prisma column `Inquiry.contactName String?` — `schema.prisma` `model Inquiry` carries `  contactName     String?` directly after `  companyName     String?`; migration `20260925120000_website_intake_door/migration.sql` (RC10) carries `ALTER TABLE "inquiries" ADD COLUMN IF NOT EXISTS "contactName" TEXT;`; after `prisma generate` the `Inquiry` row type, `Prisma.InquiryCreateInput`, `Prisma.InquiryUpdateInput` and `Prisma.InquiryWhereInput` all carry `contactName`. This task cannot type-check before Task 3's commit is in the checkout and the client is regenerated.
- Consumes (repo, unchanged signatures, verified against `inquiry.service.ts`): constructor `(prisma: PrismaService, assignmentEngine: AssignmentEngineService, waLinks: WaContactLinkService)` (:28-33); `create(dto: CreateInquiryDto, currentUser: AuthenticatedUser)` (:51) returning `{ data, meta: { assignmentMode } }`; `findAll(query: QueryInquiriesDto)` (:95); `update(id: string, dto: UpdateInquiryDto)` (:183); `classify(id, dto: ClassifyInquiryDto, currentUser)` (:249) and `convertToLead(id, currentUser)` (:286) — the only two callers of `convertToLeadInternal`, both passing full Prisma rows; `AuthenticatedUser { userId, email, roleId, roleSlug }` (auth/interfaces/authenticated-user.interface.ts); `Lead.contactPerson String?` (schema.prisma:1782); frontend `salesInquiriesApi.list/get/create/update/classify/convertToLead` (lib/api/sales.ts:272-282) and the detail page's `editData: Record<string, string>` posted through `updateMutation` (`[id]/page.tsx:73,86-92`).
- Produces:
  - `CreateInquiryDto.contactName?: string` (`@ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(200)`), written by `InquiryService.create` as `contactName: dto.contactName` — consumed by **Task 7** (RC1: Task 7 = the INQUIRY/CALLBACK/VISIT/CALCULATOR_QUOTE handlers; the draft said Task 8): `buildWebsiteInquiryDto()` sets `contactName: f.name` on the typed `CreateInquiryDto` it hands to `InquiryService.create` (P4). Task 7's "Pre-flight: grep … if not, stop" is removed per RC1 — the property exists after this task's commit, which precedes Task 7 in branch order.
  - `UpdateInquiryDto.contactName?: string` (same validators), mapped by `InquiryService.update` only when `!== undefined`.
  - `InquiryService.findAll` adds `{ contactName: { contains: search, mode: 'insensitive' } }` to `where.OR`; `convertToLeadInternal` input type gains `contactName: string | null` and writes `Lead.contactPerson = inquiry.contactName ?? null`.
  - Frontend `lib/api/sales.ts`: `Inquiry.contactName: string | null`, `CreateInquiryPayload.contactName?: string`, `UpdateInquiryPayload.contactName?: string` (no frontend file constructs a typed `Inquiry` literal — verified by grep — so the required field is `tsc`-safe). List page: a "Contact" column after "Company", a "Contact name" field in the create form, search placeholder names it. Detail page: header renders `contactName · companyName` (either alone when the other is null, `Unknown Company` when both are), and an editable "Contact" row after "Company". **Task 13** G-step "open each inquiry in `/admin/sales/inquiries`, confirm `contactName` renders in the header" reads this header — it shows the person whether or not the form also carried a company.
  - Not produced here (belongs elsewhere): the `system:website` actor and `InquirySource.WEBSITE_FORM` mapping (Task 7); `WebsiteNotifyService.formReceived({ contactName })` reads `fields.name` from the website payload, not this column (RC6, Task 10); Task 11's `websitePayloadSummary` reads the website payload's `contactName` key, not this column.

- [ ] **Step 1: Write the failing test**

`apps/backend/src/modules/sales/inquiry.contact-name.spec.ts` (full file):

```ts
// apps/backend/src/modules/sales/inquiry.contact-name.spec.ts
/**
 * WP3a T5 — `Inquiry.contactName` (ruling P4, spec D11). The website forms carry a
 * PERSON, not only a company; the column must be written on create, mapped on
 * update, searchable from the list, and carried to `Lead.contactPerson` on
 * conversion — the same bug class as the 2026-08-05 "contact details silently
 * dropped" fix in convertToLeadInternal. Constructed exactly as
 * inquiry.walink.spec.ts does: three stubs, no new constructor dependency.
 */
import { InquiryService } from './inquiry.service';

const EXISTING = {
  id: 'iq1',
  phoneNumber: '+905550000001',
  country: 'TR',
  classification: 'HR_AGENCY',
  status: 'NEW',
  companyName: null,
  contactName: 'Ayşe Yılmaz',
  email: 'ayse@example.com',
  assignedAgentId: 'u2',
};

function make() {
  const prisma = {
    inquiry: {
      findFirst: jest.fn(async () => EXISTING),
      findMany: jest.fn(async () => []),
      count: jest.fn(async () => 0),
      create: jest.fn(async (args: { data: Record<string, unknown> }) => ({ id: 'iq-new', ...args.data })),
      update: jest.fn(async (args: { data: Record<string, unknown> }) => ({ ...EXISTING, ...args.data })),
    },
    lead: {
      create: jest.fn(async () => ({ id: 'ld-new', leadNumber: 'LEAD-2026-0001' })),
      findMany: jest.fn(async () => []),
    },
  };
  const waLinks = { onPhoneChanged: jest.fn(async () => undefined) };
  const assignmentEngine = { assignInquiry: jest.fn(async () => ({ assignedAgentId: 'u2', mode: 'RULE_BASED' })) };
  return { svc: new InquiryService(prisma as never, assignmentEngine as never, waLinks as never), prisma };
}

const USER = { userId: 'u1', email: 'a@b.c', roleId: 'r1', roleSlug: 'sales-manager' };

describe('InquiryService → contactName', () => {
  it('writes contactName on create', async () => {
    const { svc, prisma } = make();
    await svc.create(
      { source: 'WEBSITE_FORM', date: new Date().toISOString(), contactName: 'Ayşe Yılmaz', email: 'ayse@example.com' } as never,
      USER as never,
    );
    const data = (prisma.inquiry.create.mock.calls[0][0] as { data: Record<string, unknown> }).data;
    expect(data.contactName).toBe('Ayşe Yılmaz');
  });

  it('maps contactName on update, and leaves it alone when absent', async () => {
    const a = make();
    await a.svc.update('iq1', { contactName: 'Mehmet Kaya' } as never);
    expect((a.prisma.inquiry.update.mock.calls[0][0] as { data: Record<string, unknown> }).data).toMatchObject({ contactName: 'Mehmet Kaya' });

    const b = make();
    await b.svc.update('iq1', { notes: 'called back' } as never);
    expect((b.prisma.inquiry.update.mock.calls[0][0] as { data: Record<string, unknown> }).data).not.toHaveProperty('contactName');
  });

  it('search finds people, not only companies', async () => {
    const { svc, prisma } = make();
    await svc.findAll({ search: 'Ayşe' } as never);
    const where = (prisma.inquiry.findMany.mock.calls[0][0] as { where: { OR?: Record<string, unknown>[] } }).where;
    expect(where.OR).toEqual(expect.arrayContaining([{ contactName: { contains: 'Ayşe', mode: 'insensitive' } }]));
  });

  it('carries contactName to Lead.contactPerson on conversion', async () => {
    const { svc, prisma } = make();
    await svc.convertToLead('iq1', USER as never);
    const data = (prisma.lead.create.mock.calls[0][0] as { data: Record<string, unknown> }).data;
    expect(data.contactPerson).toBe('Ayşe Yılmaz');
    expect(data.companyName).toBe('Unknown'); // the existing `|| 'Unknown'` fallback is untouched
    expect(data.email).toBe('ayse@example.com');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website/apps/backend && npx jest src/modules/sales/inquiry.contact-name.spec.ts --maxWorkers=2 --forceExit
```

Expected: 4 tests, 4 failures — `writes contactName on create` fails with `expect(received).toBe(expected) … Expected: "Ayşe Yılmaz" Received: undefined` (`create()` never maps the field); `maps contactName on update` fails on the first `toMatchObject` (the update `data` is `{}`); `search finds people` fails with `arrayContaining` not satisfied (`OR` has four entries, none `contactName`); `carries contactName to Lead.contactPerson` fails with `contactPerson` undefined. (`jest.config.js`: `roots: ['<rootDir>/src', '<rootDir>/test']`, `testRegex '.*\.spec\.ts$'`; `--maxWorkers=2` per the Mac Studio rule; `--forceExit` per CLAUDE.md's backend jest note.) The spec passes its stubs as `never`, so it compiles against the current service without the field.

- [ ] **Step 3: Implement**

`apps/backend/src/modules/sales/dto/create-inquiry.dto.ts` (full final file — one property added after `companyName`):

```ts
import {
  IsString,
  IsEnum,
  IsOptional,
  IsDateString,
  IsEmail,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InquiryClassification, InquirySource } from '@prisma/client';

export class CreateInquiryDto {
  @ApiProperty({ enum: InquirySource })
  @IsEnum(InquirySource)
  source: InquirySource;

  @ApiProperty({ description: 'Date/time the inquiry was received' })
  @IsDateString()
  date: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  phoneNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  companyName?: string;

  @ApiPropertyOptional({ description: 'Person who wrote in — the website forms carry a name, not only a company (WP3a)' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  contactName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  language?: string;

  @ApiPropertyOptional({ description: 'First message or call summary' })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  messagePreview?: string;

  @ApiPropertyOptional({
    enum: InquiryClassification,
    description: 'Caller/inquiry type — drives rule-based assignment (e.g. sourcing → PK team)',
  })
  @IsOptional()
  @IsEnum(InquiryClassification)
  classification?: InquiryClassification;

  @ApiPropertyOptional({ description: 'Team assignment' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  assignedTeam?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;
}
```

`apps/backend/src/modules/sales/dto/update-inquiry.dto.ts` (full final file — one property added after `companyName`):

```ts
import {
  IsString,
  IsEnum,
  IsOptional,
  IsDateString,
  IsEmail,
  MaxLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { InquirySource, InquiryStatus } from '@prisma/client';

export class UpdateInquiryDto {
  @ApiPropertyOptional({ enum: InquirySource })
  @IsOptional()
  @IsEnum(InquirySource)
  source?: InquirySource;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  phoneNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  companyName?: string;

  @ApiPropertyOptional({ description: 'Person who wrote in (WP3a)' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  contactName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  language?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  messagePreview?: string;

  @ApiPropertyOptional({ enum: InquiryStatus })
  @IsOptional()
  @IsEnum(InquiryStatus)
  status?: InquiryStatus;

  @ApiPropertyOptional({ description: 'Reassign to a different agent (user ID)' })
  @IsOptional()
  @IsString()
  assignedAgentId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  assignedTeam?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;
}
```

`apps/backend/src/modules/sales/inquiry.service.ts` (full final file — imports, constructor and every other method are unchanged; the diff against `main` is +11/−1: `contactName: dto.contactName,` in `create`, the comment + `contactName` term in `findAll`'s `OR`, the `contactName` line in `update`, `contactName: string | null;` in the `convertToLeadInternal` input type, and the comment + `contactPerson` line in its `lead.create`):

```ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InquiryClassification, InquiryStatus, Prisma, WaContactLinkType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { AssignmentEngineService } from './assignment-engine.service';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { UpdateInquiryDto } from './dto/update-inquiry.dto';
import { ClassifyInquiryDto } from './dto/classify-inquiry.dto';
import { QueryInquiriesDto } from './dto/query-inquiries.dto';
import { nextSequenceNumber } from './sales-number.logic';
import { WaContactLinkService } from '../whatsapp/wa-contact-link.service';

const CONVERTIBLE_CLASSIFICATIONS: InquiryClassification[] = [
  InquiryClassification.DIRECT_EMPLOYER,
  InquiryClassification.HR_AGENCY,
  InquiryClassification.SOURCING_PARTNER,
];

@Injectable()
export class InquiryService {
  private readonly logger = new Logger(InquiryService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly assignmentEngine: AssignmentEngineService,
    // @Global WaLinkModule — Sales never imports WhatsappModule.
    private readonly waLinks: WaContactLinkService,
  ) {}

  /**
   * The WhatsApp phone→record matcher (WP2b T3).
   *
   * `onPhoneChanged` is documented never-throwing and a spec in
   * `wa-contact-link.service.spec.ts` pins that, but the call is wrapped here
   * as well: no future change inside someone else's module may ever fail a
   * inquiry write. The warn names the record, never the phone — no PII in logs.
   */
  private async rematchWhatsapp(id: string, phone: string | null | undefined, country: string | null | undefined): Promise<void> {
    try {
      await this.waLinks.onPhoneChanged(WaContactLinkType.INQUIRY, id, phone, country);
    } catch (err) {
      this.logger.warn(`WhatsApp re-match failed for inquiry ${id}: ${(err as Error)?.message}`);
    }
  }

  async create(dto: CreateInquiryDto, currentUser: AuthenticatedUser) {
    const inquiryNumber = await this.generateInquiryNumber();

    // Run assignment engine
    const assignment = await this.assignmentEngine.assignInquiry({
      source: dto.source,
      country: dto.country,
      language: dto.language,
      companyName: dto.companyName,
      classification: dto.classification,
    });

    const inquiry = await this.prisma.inquiry.create({
      data: {
        inquiryNumber,
        source: dto.source,
        date: new Date(dto.date),
        phoneNumber: dto.phoneNumber,
        email: dto.email,
        companyName: dto.companyName,
        contactName: dto.contactName,
        country: dto.country,
        language: dto.language,
        messagePreview: dto.messagePreview,
        assignedAgentId: assignment.assignedAgentId,
        assignedTeam: dto.assignedTeam,
        classification: dto.classification,
        notes: dto.notes,
        status: InquiryStatus.NEW,
      },
      include: {
        assignedAgent: { select: { id: true, fullName: true, email: true } },
      },
    });

    // A phone that just appeared (or changed) may belong to a WhatsApp contact
    // that has been sitting unlinked. Never throws — see WaContactLinkService —
    // so awaiting it cannot fail this write.
    await this.rematchWhatsapp(inquiry.id, inquiry.phoneNumber, inquiry.country);
    return {
      data: inquiry,
      meta: { assignmentMode: assignment.mode },
    };
  }

  async findAll(query: QueryInquiriesDto) {
    const {
      page = 1,
      limit = 20,
      sortBy = 'date',
      sortOrder = 'desc',
      status,
      source,
      classification,
      assignedAgentId,
      dateFrom,
      dateTo,
      search,
    } = query;

    const where: Prisma.InquiryWhereInput = {
      deletedAt: null,
    };

    if (status) where.status = status;
    if (source) where.source = source;
    if (classification) where.classification = classification;
    if (assignedAgentId) where.assignedAgentId = assignedAgentId;

    if (dateFrom || dateTo) {
      where.date = {};
      if (dateFrom) where.date.gte = new Date(dateFrom);
      if (dateTo) where.date.lte = new Date(dateTo);
    }

    if (search) {
      // No scope fragment is spread into `where` in this list, so `OR` is free
      // for the search terms. The moment a row-level scope is wired into
      // findAll, nest these under `where.AND` (CLAUDE.md, the 2026-08-10 leak).
      where.OR = [
        { companyName: { contains: search, mode: 'insensitive' } },
        { contactName: { contains: search, mode: 'insensitive' } },
        { phoneNumber: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { inquiryNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    const allowedSortFields = ['date', 'createdAt', 'status', 'source', 'inquiryNumber'];
    const orderField = allowedSortFields.includes(sortBy) ? sortBy : 'date';

    const [items, total] = await Promise.all([
      this.prisma.inquiry.findMany({
        where,
        orderBy: { [orderField]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          assignedAgent: { select: { id: true, fullName: true, email: true } },
        },
      }),
      this.prisma.inquiry.count({ where }),
    ]);

    return {
      data: items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const inquiry = await this.prisma.inquiry.findFirst({
      where: { id, deletedAt: null },
      include: {
        assignedAgent: { select: { id: true, fullName: true, email: true } },
        convertedLead: true,
        communications: {
          orderBy: { date: 'desc' },
          include: {
            agent: { select: { id: true, fullName: true, email: true } },
          },
        },
      },
    });

    if (!inquiry) {
      throw new NotFoundException(`Inquiry ${id} not found`);
    }

    return { data: inquiry };
  }

  async update(id: string, dto: UpdateInquiryDto) {
    const existing = await this.prisma.inquiry.findFirst({
      where: { id, deletedAt: null },
    });

    if (!existing) {
      throw new NotFoundException(`Inquiry ${id} not found`);
    }

    const data: Prisma.InquiryUpdateInput = {};

    if (dto.source !== undefined) data.source = dto.source;
    if (dto.date !== undefined) data.date = new Date(dto.date);
    if (dto.phoneNumber !== undefined) data.phoneNumber = dto.phoneNumber;
    if (dto.email !== undefined) data.email = dto.email;
    if (dto.companyName !== undefined) data.companyName = dto.companyName;
    if (dto.contactName !== undefined) data.contactName = dto.contactName;
    if (dto.country !== undefined) data.country = dto.country;
    if (dto.language !== undefined) data.language = dto.language;
    if (dto.messagePreview !== undefined) data.messagePreview = dto.messagePreview;
    if (dto.status !== undefined) data.status = dto.status;
    if (dto.assignedTeam !== undefined) data.assignedTeam = dto.assignedTeam;
    if (dto.notes !== undefined) data.notes = dto.notes;

    if (dto.assignedAgentId !== undefined) {
      data.assignedAgent = dto.assignedAgentId
        ? { connect: { id: dto.assignedAgentId } }
        : { disconnect: true };
    }

    const updated = await this.prisma.inquiry.update({
      where: { id },
      data,
      include: {
        assignedAgent: { select: { id: true, fullName: true, email: true } },
      },
    });

    // A phone that just appeared (or changed) may belong to a WhatsApp contact
    // that has been sitting unlinked. Never throws — see WaContactLinkService —
    // so awaiting it cannot fail this write.
    // Only when the phone ACTUALLY moved. `undefined` is "not part of this
    // update" and an identical value is not a change at all — re-matching either
    // would run five indexed lookups on every unrelated field edit.
    if (dto.phoneNumber !== undefined && dto.phoneNumber !== existing.phoneNumber) {
      await this.rematchWhatsapp(updated.id, updated.phoneNumber, updated.country);
    }
    return { data: updated };
  }

  async remove(id: string) {
    const existing = await this.prisma.inquiry.findFirst({
      where: { id, deletedAt: null },
    });

    if (!existing) {
      throw new NotFoundException(`Inquiry ${id} not found`);
    }

    await this.prisma.inquiry.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { data: { message: 'Inquiry deleted' } };
  }

  async classify(id: string, dto: ClassifyInquiryDto, currentUser: AuthenticatedUser) {
    const existing = await this.prisma.inquiry.findFirst({
      where: { id, deletedAt: null },
    });

    if (!existing) {
      throw new NotFoundException(`Inquiry ${id} not found`);
    }

    if (existing.status === InquiryStatus.CONVERTED_TO_LEAD) {
      throw new BadRequestException('Cannot classify an inquiry that is already converted to a lead');
    }

    const inquiry = await this.prisma.inquiry.update({
      where: { id },
      data: {
        classification: dto.classification,
        status: InquiryStatus.CLASSIFIED,
      },
      include: {
        assignedAgent: { select: { id: true, fullName: true, email: true } },
      },
    });

    // Optionally convert to lead
    if (dto.convertToLead) {
      if (!CONVERTIBLE_CLASSIFICATIONS.includes(dto.classification)) {
        throw new BadRequestException(
          `Classification "${dto.classification}" cannot be converted to a lead. Only business classifications are allowed.`,
        );
      }
      return this.convertToLeadInternal(inquiry, currentUser);
    }

    return { data: inquiry };
  }

  async convertToLead(id: string, currentUser: AuthenticatedUser) {
    const inquiry = await this.prisma.inquiry.findFirst({
      where: { id, deletedAt: null },
    });

    if (!inquiry) {
      throw new NotFoundException(`Inquiry ${id} not found`);
    }

    if (inquiry.status === InquiryStatus.CONVERTED_TO_LEAD) {
      throw new BadRequestException('Inquiry is already converted to a lead');
    }

    if (!inquiry.classification) {
      throw new BadRequestException('Inquiry must be classified before converting to a lead');
    }

    if (!CONVERTIBLE_CLASSIFICATIONS.includes(inquiry.classification)) {
      throw new BadRequestException(
        `Classification "${inquiry.classification}" cannot be converted to a lead`,
      );
    }

    return this.convertToLeadInternal(inquiry, currentUser);
  }

  private async convertToLeadInternal(
    inquiry: {
      id: string;
      companyName: string | null;
      contactName: string | null;
      country: string | null;
      classification: InquiryClassification | null;
      assignedAgentId: string | null;
      phoneNumber: string | null;
      email: string | null;
    },
    currentUser: AuthenticatedUser,
  ) {
    const leadNumber = await this.generateLeadNumber();

    const lead = await this.prisma.lead.create({
      data: {
        leadNumber,
        companyName: inquiry.companyName || 'Unknown',
        country: inquiry.country,
        classification: inquiry.classification!,
        leadOwnerId: inquiry.assignedAgentId || currentUser.userId,
        addedById: currentUser.userId,
        // Carry the inquiry's contact details — they used to be silently
        // dropped, leaving converted leads with no phone/email. contactName
        // (WP3a, the website forms) rides along as the lead's contactPerson;
        // `?? null` also covers rows stubbed without the column in specs.
        phone: inquiry.phoneNumber,
        email: inquiry.email,
        contactPerson: inquiry.contactName ?? null,
      },
    });

    // Link inquiry to lead and update status
    const updatedInquiry = await this.prisma.inquiry.update({
      where: { id: inquiry.id },
      data: {
        convertedLeadId: lead.id,
        status: InquiryStatus.CONVERTED_TO_LEAD,
      },
      include: {
        assignedAgent: { select: { id: true, fullName: true, email: true } },
        convertedLead: true,
      },
    });

    // ONE re-match does both halves of the conversion (never throws):
    //  · the contact's AUTO link to this inquiry is dropped — the inquiry is now
    //    CONVERTED_TO_LEAD with `convertedLeadId` set, which is exactly the
    //    `supersededByLeadId` state the ranker refuses;
    //  · the new lead carries the inquiry's phone and is OPEN, so it is confirmed,
    //    linked and takes the primary.
    // Without it the chat keeps pointing at the closed inquiry for ever:
    // `linkOnFirstContact` short-circuits on the next message because the contact
    // already HAS a link, so nothing self-heals. The lead is created here with a
    // bare `prisma.lead.create`, not through `LeadService.create`, so it misses
    // that service's own hook.
    await this.rematchWhatsapp(inquiry.id, inquiry.phoneNumber, inquiry.country);

    return { data: updatedInquiry, meta: { leadId: lead.id, leadNumber } };
  }

  private async generateInquiryNumber(): Promise<string> {
    const prefix = `INQ-${new Date().getFullYear()}-`;
    const existing = await this.prisma.inquiry.findMany({
      where: { inquiryNumber: { startsWith: prefix } },
      select: { inquiryNumber: true },
    });
    return nextSequenceNumber(prefix, existing.map((r) => r.inquiryNumber));
  }

  private async generateLeadNumber(): Promise<string> {
    const prefix = `LEAD-${new Date().getFullYear()}-`;
    const existing = await this.prisma.lead.findMany({
      where: { leadNumber: { startsWith: prefix } },
      select: { leadNumber: true },
    });
    return nextSequenceNumber(prefix, existing.map((r) => r.leadNumber));
  }
}
```

Why `contactName: string | null` is *required* on the `convertToLeadInternal` input type and still safe for `inquiry.walink.spec.ts`: both real callers (`classify` passes the `prisma.inquiry.update` result, `convertToLead` passes the `findFirst` row) hand over full Prisma `Inquiry` rows, which carry `contactName` once Task 3's client is generated, so the stricter type is what the code already guarantees. The walink spec's `EXISTING` stub lacks the field but reaches the service through `prisma as never`, so `tsc` and ts-jest never check it against this signature; at runtime `inquiry.contactName ?? null` writes `null`. That spec stays byte-identical.

`apps/frontend/src/lib/api/sales.ts` — three one-line insertions, each directly after the `companyName` line of its interface. The three interfaces in full final form (the rest of the file is untouched):

```ts
export interface Inquiry {
  id: string;
  inquiryNumber: string;
  source: InquirySource;
  date: string;
  phoneNumber: string | null;
  email: string | null;
  companyName: string | null;
  contactName: string | null;
  country: string | null;
  language: string | null;
  messagePreview: string | null;
  assignedAgentId: string | null;
  assignedAgent: UserRef | null;
  assignedTeam: string | null;
  classification: InquiryClassification | null;
  status: InquiryStatus;
  notes: string | null;
  convertedLeadId: string | null;
  convertedLead: Lead | null;
  communications: SalesCommunication[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateInquiryPayload {
  source: InquirySource;
  date: string;
  phoneNumber?: string;
  email?: string;
  companyName?: string;
  contactName?: string;
  country?: string;
  language?: string;
  messagePreview?: string;
  assignedTeam?: string;
  notes?: string;
}

export interface UpdateInquiryPayload {
  source?: InquirySource;
  date?: string;
  phoneNumber?: string;
  email?: string;
  companyName?: string;
  contactName?: string;
  country?: string;
  language?: string;
  messagePreview?: string;
  status?: InquiryStatus;
  assignedAgentId?: string;
  assignedTeam?: string;
  notes?: string;
}
```

`apps/frontend/src/app/[locale]/admin/sales/inquiries/page.tsx` (full final file — imports unchanged, `Input`, `FormField` and `CountrySelect` were already imported; diff against `main` is +13/−1: `contactName` in the zod schema, `defaultValues` and `onSubmit`, the "Contact" column after "Company", the search placeholder, and the full-width "Contact name" field above the Company/Country grid). The page's pre-existing `toLocaleDateString()` and `window.confirm` lines are outside this task and are neither touched nor copied:

```tsx
'use client';

import { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ArrowRightCircle,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Tag,
  Trash2,
} from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PageShell } from '@/components/ui/page-shell';
import { DataTable } from '@/components/ui/data-table';
import { FilterBar, type FilterDef, type FilterValue } from '@/components/ui/filter-bar';
import { SidePanel, SidePanelFooter } from '@/components/ui/side-panel';
import { StatusPill, type StatusTone } from '@/components/ui/status-pill';
import { UserChip } from '@/components/ui/user-chip';
import { FormField } from '@/components/ui/form-field';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { StateEmpty } from '@/components/ui/state-empty';
import { PinButton } from '@/components/ui/pin-button';
import { useCommandRegistry } from '@/components/ui/command-palette';

import { PageGuide } from '@/components/shared/PageGuide';
import { TablePagination } from '@/components/shared/TablePagination';
import { CountrySelect, CountryName } from '@/components/shared/reference-selects';
import { Can } from '@/components/auth/can';
import {
  salesInquiriesApi,
  type Inquiry,
  type InquirySource,
  type InquiryStatus,
  type InquiryClassification,
  type CreateInquiryPayload,
  INQUIRY_SOURCE_LABELS,
  INQUIRY_STATUS_LABELS,
  CLASSIFICATION_LABELS,
} from '@/lib/api/sales';

const ALL_SOURCES: InquirySource[] = [
  'WEBSITE_FORM', 'WHATSAPP_CRM', 'TURKEY_CALL_CENTER', 'INTERNATIONAL_CALL_CRM',
  'EMAIL', 'REFERRAL', 'EXPO_MEETING', 'AI_CALLING_CAMPAIGN', 'MANUAL_ENTRY',
];
const ALL_STATUSES: InquiryStatus[] = ['NEW', 'IN_PROGRESS', 'CLASSIFIED', 'CONVERTED_TO_LEAD', 'CLOSED'];
const ALL_CLASSIFICATIONS: InquiryClassification[] =
  ['DIRECT_EMPLOYER', 'HR_AGENCY', 'SOURCING_PARTNER', 'JOB_SEEKER', 'SPAM'];
const BUSINESS_CLASSIFICATIONS = new Set<InquiryClassification>(
  ['DIRECT_EMPLOYER', 'HR_AGENCY', 'SOURCING_PARTNER'],
);

function inquiryStatusTone(s: InquiryStatus): StatusTone {
  switch (s) {
    case 'CONVERTED_TO_LEAD': return 'success';
    case 'CLOSED': return 'neutral';
    case 'CLASSIFIED': return 'info';
    case 'IN_PROGRESS': return 'in-progress';
    case 'NEW': return 'warning';
    default: return 'neutral';
  }
}

function classificationTone(c: InquiryClassification): StatusTone {
  if (c === 'SPAM') return 'destructive';
  if (c === 'JOB_SEEKER') return 'warning';
  return 'info';
}

const inquirySchema = z.object({
  source: z.enum([
    'WEBSITE_FORM', 'WHATSAPP_CRM', 'TURKEY_CALL_CENTER', 'INTERNATIONAL_CALL_CRM',
    'EMAIL', 'REFERRAL', 'EXPO_MEETING', 'AI_CALLING_CAMPAIGN', 'MANUAL_ENTRY',
  ]),
  contactName: z.string().max(120).optional().or(z.literal('')),
  companyName: z.string().max(120).optional().or(z.literal('')),
  country: z.string().max(80).optional().or(z.literal('')),
  phoneNumber: z.string().max(40).optional().or(z.literal('')),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  language: z.string().max(40).optional().or(z.literal('')),
  messagePreview: z.string().max(2000).optional().or(z.literal('')),
});
type InquiryFormValues = z.infer<typeof inquirySchema>;

export default function InquiriesPage() {
  const router = useRouter();
  const { locale } = useParams() as { locale: string };
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, FilterValue>>({});
  const [createOpen, setCreateOpen] = useState(false);
  const [classifyFor, setClassifyFor] = useState<Inquiry | null>(null);
  const [selectedClassification, setSelectedClassification] =
    useState<InquiryClassification>('DIRECT_EMPLOYER');
  const [convertOnClassify, setConvertOnClassify] = useState(false);

  const search = searchValue.trim() || undefined;
  const statusFilter = (filterValues.status as string | undefined) || undefined;
  const sourceFilter = (filterValues.source as string | undefined) || undefined;
  const classificationFilter = (filterValues.classification as string | undefined) || undefined;

  const { data, isLoading } = useQuery({
    queryKey: ['sales-inquiries', page, search, statusFilter, sourceFilter, classificationFilter],
    queryFn: () => salesInquiriesApi.list({
      page,
      limit: 20,
      search,
      status: statusFilter as InquiryStatus | undefined,
      source: sourceFilter as InquirySource | undefined,
      classification: classificationFilter as InquiryClassification | undefined,
    }),
  });

  const inquiries: Inquiry[] = data?.data ?? [];
  const meta = {
    total: data?.meta?.total ?? 0,
    page: data?.meta?.page ?? 1,
    totalPages: data?.meta?.totalPages ?? 1,
  };

  const createMutation = useMutation({
    mutationFn: (payload: CreateInquiryPayload) => salesInquiriesApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales-inquiries'] });
      setCreateOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => salesInquiriesApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sales-inquiries'] }),
  });

  const classifyMutation = useMutation({
    mutationFn: ({
      id, classification, convertToLead,
    }: { id: string; classification: InquiryClassification; convertToLead: boolean }) =>
      salesInquiriesApi.classify(id, { classification, convertToLead }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales-inquiries'] });
      setClassifyFor(null);
    },
  });

  const convertMutation = useMutation({
    mutationFn: (id: string) => salesInquiriesApi.convertToLead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sales-inquiries'] }),
  });

  const form = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      source: 'MANUAL_ENTRY',
      contactName: '',
      companyName: '',
      country: '',
      phoneNumber: '',
      email: '',
      language: '',
      messagePreview: '',
    },
  });

  const onSubmit = (values: InquiryFormValues) => {
    const payload: CreateInquiryPayload = {
      source: values.source,
      contactName: values.contactName || undefined,
      companyName: values.companyName || undefined,
      country: values.country || undefined,
      phoneNumber: values.phoneNumber || undefined,
      email: values.email || undefined,
      language: values.language || undefined,
      messagePreview: values.messagePreview || undefined,
      date: new Date().toISOString(),
    } as CreateInquiryPayload;
    createMutation.mutate(payload, { onSuccess: () => form.reset() });
  };

  const columns = useMemo<ColumnDef<Inquiry, unknown>[]>(() => [
    {
      accessorKey: 'inquiryNumber',
      header: 'Inquiry #',
      cell: ({ row }) => (
        <span className="font-mono text-xs text-muted-foreground">
          {row.original.inquiryNumber}
        </span>
      ),
      size: 110,
    },
    {
      accessorKey: 'source',
      header: 'Source',
      cell: ({ row }) => (
        <Badge variant="secondary" className="text-[10px]">
          {INQUIRY_SOURCE_LABELS[row.original.source] ?? row.original.source}
        </Badge>
      ),
    },
    {
      accessorKey: 'companyName',
      header: 'Company',
      cell: ({ row }) => row.original.companyName ?? '—',
    },
    {
      accessorKey: 'contactName',
      header: 'Contact',
      cell: ({ row }) => row.original.contactName ?? '—',
    },
    {
      accessorKey: 'country',
      header: 'Country',
      cell: ({ row }) => <CountryName code={row.original.country} />,
    },
    {
      accessorKey: 'assignedAgent',
      header: 'Agent',
      enableSorting: false,
      cell: ({ row }) => {
        const agent = row.original.assignedAgent;
        if (!agent) {
          return <span className="text-xs italic text-muted-foreground">Unassigned</span>;
        }
        return (
          <UserChip
            user={{ id: agent.id, fullName: agent.fullName, email: agent.email }}
            size="xs"
            noHoverCard
          />
        );
      },
    },
    {
      accessorKey: 'classification',
      header: 'Classification',
      cell: ({ row }) => {
        const c = row.original.classification;
        if (!c) return '—';
        return (
          <StatusPill
            tone={classificationTone(c)}
            label={CLASSIFICATION_LABELS[c]}
            size="xs"
          />
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <StatusPill
          tone={inquiryStatusTone(row.original.status)}
          label={INQUIRY_STATUS_LABELS[row.original.status]}
          size="xs"
        />
      ),
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => new Date(row.original.date).toLocaleDateString(),
    },
    {
      id: '__actions',
      header: '',
      enableSorting: false,
      enableHiding: false,
      size: 40,
      cell: ({ row }) => {
        const inq = row.original;
        const canConvert =
          inq.classification &&
          inq.status !== 'CONVERTED_TO_LEAD' &&
          BUSINESS_CLASSIFICATIONS.has(inq.classification);
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreHorizontal className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
              {!inq.classification && inq.status !== 'CONVERTED_TO_LEAD' && (
                <Can module="sales.inquiries" action="EDIT">
                  <DropdownMenuItem
                    onClick={() => {
                      setClassifyFor(inq);
                      setSelectedClassification('DIRECT_EMPLOYER');
                      setConvertOnClassify(false);
                    }}
                  >
                    <Tag className="mr-2 h-3.5 w-3.5" />
                    Classify…
                  </DropdownMenuItem>
                </Can>
              )}
              {canConvert && (
                <Can module="sales.inquiries" action="EDIT">
                  <DropdownMenuItem onClick={() => convertMutation.mutate(inq.id)}>
                    <ArrowRightCircle className="mr-2 h-3.5 w-3.5" />
                    Convert to Lead
                  </DropdownMenuItem>
                </Can>
              )}
              <Can module="sales.inquiries" action="DELETE">
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => {
                    if (window.confirm(`Delete inquiry ${inq.inquiryNumber}?`)) {
                      deleteMutation.mutate(inq.id);
                    }
                  }}
                >
                  <Trash2 className="mr-2 h-3.5 w-3.5" />
                  Delete
                </DropdownMenuItem>
              </Can>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ], [convertMutation, deleteMutation]);

  const filterDefs: FilterDef[] = useMemo(() => [
    {
      id: 'status',
      label: 'Status',
      type: 'status',
      pinned: true,
      options: ALL_STATUSES.map((s) => ({ value: s, label: INQUIRY_STATUS_LABELS[s] })),
    },
    {
      id: 'source',
      label: 'Source',
      type: 'select',
      options: ALL_SOURCES.map((s) => ({ value: s, label: INQUIRY_SOURCE_LABELS[s] })),
    },
    {
      id: 'classification',
      label: 'Classification',
      type: 'select',
      options: ALL_CLASSIFICATIONS.map((c) => ({ value: c, label: CLASSIFICATION_LABELS[c] })),
    },
  ], []);

  useCommandRegistry([
    {
      id: 'sales-inquiries.new',
      section: 'create',
      label: 'New Inquiry',
      icon: Plus,
      onSelect: () => setCreateOpen(true),
    },
    {
      id: 'sales-inquiries.refresh',
      section: 'actions',
      label: 'Refresh inquiries',
      icon: RefreshCw,
      onSelect: () => queryClient.invalidateQueries({ queryKey: ['sales-inquiries'] }),
    },
  ]);

  return (
    <>
      <PageGuide guideKey="admin_sales_inquiries" />

      <PageShell
        title="Inquiries"
        subtitle="Inbound interest — classify, qualify, and convert."
        actions={
          <>
            <PinButton
              id="sales.inquiries"
              label="Sales — Inquiries"
              href={`/${locale}/admin/sales/inquiries`}
              module="sales"
              iconName="messageSquare"
            />
            <Can module="sales.inquiries" action="CREATE">
              <Button size="sm" onClick={() => setCreateOpen(true)}>
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                New Inquiry
              </Button>
            </Can>
          </>
        }
        filters={
          <FilterBar
            filters={filterDefs}
            values={filterValues}
            onChange={(id, v) => { setFilterValues((s) => ({ ...s, [id]: v })); setPage(1); }}
            onReset={() => { setFilterValues({}); setSearchValue(''); setPage(1); }}
            showSearch
            searchValue={searchValue}
            onSearchChange={(v) => { setSearchValue(v); setPage(1); }}
            searchPlaceholder="Contact, company, phone, email…"
          />
        }
      >
        <div className="space-y-2">
          <DataTable
            columns={columns}
            data={inquiries}
            rowKey={(row) => row.id}
            loading={isLoading}
            onRowClick={(row) => router.push(`/${locale}/admin/sales/inquiries/${row.id}`)}
            emptyState={
              <StateEmpty
                title="No inquiries match your filters"
                description="New inquiries land here as they come in via web, WhatsApp, calls, or email."
                action={{ label: 'New Inquiry', onClick: () => setCreateOpen(true) }}
              />
            }
          />
          {inquiries.length > 0 && (
            <TablePagination
              page={page}
              totalPages={meta.totalPages ?? 1}
              total={meta.total}
              limit={20}
              onPageChange={setPage}
            />
          )}
        </div>
      </PageShell>

      <SidePanel
        open={createOpen}
        onOpenChange={(open) => {
          setCreateOpen(open);
          if (!open) form.reset();
        }}
        title="New Inquiry"
        subtitle="Log an incoming inquiry — fill in what you have."
        footer={
          <SidePanelFooter
            left={
              form.formState.isSubmitting
                ? <span>Saving…</span>
                : <span>Source is required; everything else is optional.</span>
            }
          >
            <Button type="button" variant="ghost" size="sm" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              form="inquiry-create-form"
              disabled={form.formState.isSubmitting || createMutation.isPending}
            >
              {createMutation.isPending ? 'Creating…' : 'Create Inquiry'}
            </Button>
          </SidePanelFooter>
        }
      >
        <form id="inquiry-create-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField control={form.control} name="source" label="Source" required>
            {(field) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ALL_SOURCES.map((s) => (
                    <SelectItem key={s} value={s}>{INQUIRY_SOURCE_LABELS[s]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </FormField>

          <FormField control={form.control} name="contactName" label="Contact name">
            {(field) => <Input {...field} placeholder="Ayşe Yılmaz" />}
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField control={form.control} name="companyName" label="Company name">
              {(field) => <Input {...field} placeholder="Acme Hospitality GmbH" />}
            </FormField>
            <FormField control={form.control} name="country" label="Country">
              {(field) => (
                <CountrySelect
                  value={(field.value as string) ?? ''}
                  onChange={field.onChange}
                  placeholder="Select country"
                />
              )}
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField control={form.control} name="phoneNumber" label="Phone">
              {(field) => <Input {...field} placeholder="+90 …" />}
            </FormField>
            <FormField control={form.control} name="email" label="Email">
              {(field) => <Input {...field} type="email" placeholder="contact@example.com" />}
            </FormField>
          </div>

          <FormField control={form.control} name="language" label="Language" description="e.g. English, Turkish">
            {(field) => <Input {...field} placeholder="English" />}
          </FormField>

          <FormField control={form.control} name="messagePreview" label="Message / summary">
            {(field) => (
              <textarea
                {...field}
                rows={3}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                placeholder="What did they ask about?"
              />
            )}
          </FormField>
        </form>
      </SidePanel>

      <Dialog open={!!classifyFor} onOpenChange={(open) => !open && setClassifyFor(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Classify inquiry</DialogTitle>
            <DialogDescription>
              {classifyFor && `Set the type of inquiry ${classifyFor.inquiryNumber}.`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1">
              <Label>Classification</Label>
              <Select
                value={selectedClassification}
                onValueChange={(v) => setSelectedClassification(v as InquiryClassification)}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ALL_CLASSIFICATIONS.map((c) => (
                    <SelectItem key={c} value={c}>{CLASSIFICATION_LABELS[c]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {BUSINESS_CLASSIFICATIONS.has(selectedClassification) && (
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={convertOnClassify}
                  onChange={(e) => setConvertOnClassify(e.target.checked)}
                  className="h-3.5 w-3.5"
                />
                Also convert to Lead
              </label>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setClassifyFor(null)}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  if (!classifyFor) return;
                  classifyMutation.mutate({
                    id: classifyFor.id,
                    classification: selectedClassification,
                    convertToLead:
                      convertOnClassify &&
                      BUSINESS_CLASSIFICATIONS.has(selectedClassification),
                  });
                }}
                disabled={classifyMutation.isPending}
              >
                {classifyMutation.isPending ? 'Classifying…' : 'Classify'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
```

`apps/frontend/src/app/[locale]/admin/sales/inquiries/[id]/page.tsx` (full final file — diff against `main` is +3/−1: the header line and its comment, and the "Contact" row after "Company"; `editData` is `useState<Record<string, string>>` and `updateMutation` posts it through `salesInquiriesApi.update(id, payload)`, so `contactName` flows into `UpdateInquiryPayload.contactName` with no other change). The page's pre-existing `toLocaleString()` is outside this task and is neither touched nor copied:

```tsx
'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft, Tag, ArrowRightCircle, MessageCircle, Pencil, UserPlus, MessageSquare, Save, X,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WhatsAppThreadEmbed } from '@/components/shared/WhatsAppThreadEmbed';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { PageGuide } from '@/components/shared/PageGuide';
import { CountryName } from '@/components/shared/reference-selects';
import { Can } from '@/components/auth/can';
import { CallButton } from '@/components/shared/CallButton';
import { LeadCallHistoryCard } from '@/components/sales/LeadCallHistoryCard';
import { SalesCommunicationTimeline } from '@/components/sales/SalesCommunicationTimeline';
import {
  salesInquiriesApi, salesCommunicationsApi,
  type InquiryClassification, type CreateCommunicationPayload,
  INQUIRY_SOURCE_LABELS, INQUIRY_STATUS_LABELS, CLASSIFICATION_LABELS,
} from '@/lib/api/sales';

const BUSINESS_CLASSIFICATIONS: InquiryClassification[] = ['DIRECT_EMPLOYER', 'HR_AGENCY', 'SOURCING_PARTNER'];
const ALL_CLASSIFICATIONS: InquiryClassification[] = [...BUSINESS_CLASSIFICATIONS, 'JOB_SEEKER', 'SPAM'];

const INQUIRY_STATUS_VARIANT_MAP: Record<string, 'success' | 'warning' | 'destructive' | 'info' | 'secondary'> = {
  NEW: 'info',
  IN_PROGRESS: 'warning',
  CLASSIFIED: 'secondary',
  CONVERTED_TO_LEAD: 'success',
  CLOSED: 'secondary',
};

const INQUIRY_SOURCE_VARIANT_MAP: Record<string, 'success' | 'warning' | 'destructive' | 'info' | 'secondary'> = {
  WEBSITE_FORM: 'info',
  WHATSAPP_CRM: 'success',
  TURKEY_CALL_CENTER: 'warning',
  INTERNATIONAL_CALL_CRM: 'secondary',
  EMAIL: 'info',
  REFERRAL: 'warning',
  EXPO_MEETING: 'secondary',
  AI_CALLING_CAMPAIGN: 'info',
  MANUAL_ENTRY: 'secondary',
};

const CLASSIFICATION_VARIANT_MAP: Record<string, 'success' | 'warning' | 'destructive' | 'info' | 'secondary'> = {
  DIRECT_EMPLOYER: 'info',
  HR_AGENCY: 'info',
  SOURCING_PARTNER: 'success',
  JOB_SEEKER: 'warning',
  SPAM: 'destructive',
};

export default function InquiryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const id = params.id as string;
  const queryClient = useQueryClient();

  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState<Record<string, string>>({});
  const [showClassifyDialog, setShowClassifyDialog] = useState(false);
  const [selectedClassification, setSelectedClassification] = useState<InquiryClassification>('DIRECT_EMPLOYER');
  const [showCommDialog, setShowCommDialog] = useState(false);
  const [newComm, setNewComm] = useState<Partial<CreateCommunicationPayload>>({ channel: 'Manual Note', date: new Date().toISOString() });

  const { data, isLoading } = useQuery({
    queryKey: ['sales-inquiry', id],
    queryFn: () => salesInquiriesApi.get(id),
  });

  const inquiry = data?.data;

  const updateMutation = useMutation({
    mutationFn: (payload: Record<string, string>) => salesInquiriesApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales-inquiry', id] });
      setEditing(false);
    },
  });

  const classifyMutation = useMutation({
    mutationFn: ({ classification, convertToLead }: { classification: InquiryClassification; convertToLead: boolean }) =>
      salesInquiriesApi.classify(id, { classification, convertToLead }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales-inquiry', id] });
      setShowClassifyDialog(false);
    },
  });

  const convertMutation = useMutation({
    mutationFn: () => salesInquiriesApi.convertToLead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sales-inquiry', id] }),
  });

  const commMutation = useMutation({
    mutationFn: (payload: CreateCommunicationPayload) => salesCommunicationsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales-inquiry', id] });
      setShowCommDialog(false);
      setNewComm({ channel: 'Manual Note', date: new Date().toISOString() });
    },
  });

  /**
   * WP2b T9 — "this WhatsApp chat happened" on the sales record, by HAND for the
   * same reason as on the lead page: `SalesCommunication` carries a User FK, so
   * an automatic row would attribute a customer's message to whoever opened the
   * page. Same payload the Communications dialog above sends.
   */
  const logWhatsappComm = useMutation({
    mutationFn: () =>
      salesCommunicationsApi.create({
        channel: 'WhatsApp CRM',
        date: new Date().toISOString(),
        summary: 'WhatsApp conversation (see the WhatsApp tab for the thread)',
        linkedInquiryId: id,
      } as CreateCommunicationPayload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales-inquiry', id] });
      queryClient.invalidateQueries({ queryKey: ['sales-communications', 'inquiry', id] });
      toast.success('Logged to sales communications');
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : 'Could not log the conversation'),
  });

  if (isLoading) return <div className="py-12 text-center text-muted-foreground">Loading...</div>;
  if (!inquiry) return <div className="py-12 text-center text-muted-foreground">Inquiry not found</div>;

  const isConverted = inquiry.status === 'CONVERTED_TO_LEAD';
  const canConvert = inquiry.classification && BUSINESS_CLASSIFICATIONS.includes(inquiry.classification) && !isConverted;

  return (
    <div className="space-y-6">
      <PageGuide guideKey="admin_sales_inquiry_detail" />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          <button className="rounded-lg border p-2 hover:bg-accent transition-colors" onClick={() => router.push(`/${locale}/admin/sales/inquiries`)}>
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">{inquiry.inquiryNumber}</h1>
            {/* WP3a: the person first, then the company — a website inquiry may carry either or both. */}
            <p className="text-muted-foreground">{[inquiry.contactName, inquiry.companyName].filter(Boolean).join(' · ') || 'Unknown Company'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CallButton phone={inquiry.phoneNumber} />
          {!isConverted && !inquiry.classification && (
            <Can module="sales.inquiries" action="EDIT">
              <Button variant="outline" onClick={() => setShowClassifyDialog(true)}>
                <Tag className="mr-2 h-4 w-4" /> Classify
              </Button>
            </Can>
          )}
          {canConvert && (
            <Can module="sales.inquiries" action="EDIT">
              <Button onClick={() => convertMutation.mutate()}>
                <ArrowRightCircle className="mr-2 h-4 w-4" /> Convert to Lead
              </Button>
            </Can>
          )}
          {!editing ? (
            <Can module="sales.inquiries" action="EDIT">
              <Button variant="outline" onClick={() => { setEditing(true); setEditData({}); }}>
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </Button>
            </Can>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setEditing(false)}><X className="mr-1 h-3 w-3" /> Cancel</Button>
              <Button size="sm" onClick={() => updateMutation.mutate(editData)}><Save className="mr-1 h-3 w-3" /> Save</Button>
            </div>
          )}
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border bg-card p-6 shadow-card">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Status</h3>
          <Badge variant={INQUIRY_STATUS_VARIANT_MAP[inquiry.status] || 'secondary'}>{INQUIRY_STATUS_LABELS[inquiry.status]}</Badge>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-card">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Source</h3>
          <Badge variant={INQUIRY_SOURCE_VARIANT_MAP[inquiry.source] || 'secondary'}>{INQUIRY_SOURCE_LABELS[inquiry.source]}</Badge>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-card">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Classification</h3>
          {inquiry.classification ? (
            <Badge variant={CLASSIFICATION_VARIANT_MAP[inquiry.classification] || 'secondary'}>{CLASSIFICATION_LABELS[inquiry.classification]}</Badge>
          ) : <span className="text-muted-foreground">Not classified</span>}
        </div>
      </div>

      {/* Detail Grid */}
      <div className="rounded-xl border bg-card p-6 shadow-card">
        <h3 className="text-sm font-semibold mb-4">Inquiry Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div><span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Company</span> <span className="ml-2 font-medium">{editing ? <Input className="inline w-48" defaultValue={inquiry.companyName || ''} onChange={(e) => setEditData({ ...editData, companyName: e.target.value })} /> : inquiry.companyName || '—'}</span></div>
          <div><span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Contact</span> <span className="ml-2 font-medium">{editing ? <Input className="inline w-48" defaultValue={inquiry.contactName || ''} onChange={(e) => setEditData({ ...editData, contactName: e.target.value })} /> : inquiry.contactName || '—'}</span></div>
          <div><span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Country</span> <span className="ml-2 font-medium"><CountryName code={inquiry.country} /></span></div>
          <div><span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Phone</span> <span className="ml-2 font-medium">{inquiry.phoneNumber || '—'}</span></div>
          <div><span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</span> <span className="ml-2 font-medium">{inquiry.email || '—'}</span></div>
          <div><span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Language</span> <span className="ml-2 font-medium">{inquiry.language || '—'}</span></div>
          <div><span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Assigned Agent</span> <span className="ml-2 font-medium">{inquiry.assignedAgent?.fullName || 'Unassigned'}</span></div>
          <div><span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</span> <span className="ml-2 font-medium">{new Date(inquiry.date).toLocaleString()}</span></div>
          {isConverted && inquiry.convertedLead && (
            <div>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Converted Lead</span>
              <Button variant="link" className="ml-1 p-0 h-auto" onClick={() => router.push(`/${locale}/admin/sales/leads/${inquiry.convertedLeadId}`)}>
                {inquiry.convertedLead.leadNumber}
              </Button>
            </div>
          )}
        </div>
        {inquiry.messagePreview && (
          <div className="mt-4 rounded-md bg-muted p-3">
            <p className="text-sm text-muted-foreground font-medium mb-1">Message Preview</p>
            <p className="text-sm">{inquiry.messagePreview}</p>
          </div>
        )}
        {inquiry.notes && (
          <div className="mt-2 text-sm">
            <span className="text-muted-foreground">Notes:</span>
            {/* pre-wrap: AI call transcripts land here as multi-line "Agent:/Caller:" blocks */}
            <div className="mt-1 whitespace-pre-wrap rounded-md bg-muted/50 p-3">{inquiry.notes}</div>
          </div>
        )}
      </div>

      <LeadCallHistoryCard inquiryId={id} />

      {/* Tabs */}
      <Tabs defaultValue="communications">
        <TabsList className="w-full">
          <TabsTrigger value="communications" className="data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
            <MessageSquare className="mr-2 h-4 w-4" /> Communications ({inquiry.communications?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="whatsapp" className="data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
            <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
          </TabsTrigger>
        </TabsList>
        <TabsContent value="communications">
          <SalesCommunicationTimeline entityType="inquiry" entityId={id} communications={inquiry.communications} />
        </TabsContent>
        {/* WP2b T9 — the inquiry's WhatsApp thread. No ActivityEvent is written
            for an inquiry; the manual button is the write-back. */}
        <TabsContent value="whatsapp">
          <div className="mb-2 flex justify-end">
            <Button
              size="sm"
              variant="outline"
              onClick={() => logWhatsappComm.mutate()}
              disabled={logWhatsappComm.isPending}
            >
              {logWhatsappComm.isPending ? 'Logging…' : 'Log to sales communications'}
            </Button>
          </div>
          <WhatsAppThreadEmbed entityType="INQUIRY" entityId={id} />
        </TabsContent>
      </Tabs>

      {/* Classify Dialog */}
      <Dialog open={showClassifyDialog} onOpenChange={setShowClassifyDialog}>
        <DialogContent>
          <DialogHeader className="px-6 py-4">
            <DialogTitle>Classify Inquiry</DialogTitle>
            <DialogDescription>Set the type of this inquiry</DialogDescription>
          </DialogHeader>
          <div className="px-6 py-5 space-y-5">
            <Select value={selectedClassification} onValueChange={(v) => setSelectedClassification(v as InquiryClassification)}>
              <SelectTrigger className="bg-background rounded-lg"><SelectValue /></SelectTrigger>
              <SelectContent>
                {ALL_CLASSIFICATIONS.map((c) => <SelectItem key={c} value={c}>{CLASSIFICATION_LABELS[c]}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-muted/30">
            <Button variant="outline" onClick={() => setShowClassifyDialog(false)}>Cancel</Button>
            <Button onClick={() => classifyMutation.mutate({ classification: selectedClassification, convertToLead: false })}>
              Classify
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Log Communication Dialog */}
      <Dialog open={showCommDialog} onOpenChange={setShowCommDialog}>
        <DialogContent>
          <DialogHeader className="px-6 py-4">
            <DialogTitle>Log Communication</DialogTitle>
            <DialogDescription>Record a sales interaction</DialogDescription>
          </DialogHeader>
          <div className="px-6 py-5 space-y-5">
            <div>
              <Label>Channel</Label>
              <Select value={newComm.channel} onValueChange={(v) => setNewComm({ ...newComm, channel: v })}>
                <SelectTrigger className="bg-background rounded-lg"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['Turkey Call Center', 'International Call CRM', 'WhatsApp CRM', 'Email', 'Manual Note', 'AI Campaigns'].map((ch) => (
                    <SelectItem key={ch} value={ch}>{ch}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Summary</Label>
              <textarea
                className="w-full bg-background rounded-lg border px-3 py-2 text-sm"
                rows={3}
                value={newComm.summary || ''}
                onChange={(e) => setNewComm({ ...newComm, summary: e.target.value })}
              />
            </div>
            <div>
              <Label>Next Step</Label>
              <Input value={newComm.nextStep || ''} onChange={(e) => setNewComm({ ...newComm, nextStep: e.target.value })} />
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-muted/30">
            <Button variant="outline" onClick={() => setShowCommDialog(false)}>Cancel</Button>
            <Button
              disabled={!newComm.summary || commMutation.isPending}
              onClick={() => commMutation.mutate({ ...newComm, linkedInquiryId: id, summary: newComm.summary! } as CreateCommunicationPayload)}
            >
              Log Communication
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Plus(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
```

- [ ] **Step 4: Run tests**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website/apps/backend && npx jest src/modules/sales --maxWorkers=2 --forceExit
```

Expected: `inquiry.contact-name.spec.ts` 4/4 green; `inquiry.walink.spec.ts` 6/6 green with no edit (`git diff --stat apps/backend/src/modules/sales/inquiry.walink.spec.ts` prints nothing); `assignment-condition.spec.ts`, `lead-scope.spec.ts`, `lead.walink.spec.ts`, `sales-number.logic.spec.ts` unchanged and green.

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website/apps/backend && npx tsc --noEmit
```

Expected: no errors. `Property 'contactName' does not exist on type 'InquiryCreateInput'` (or on `InquiryWhereInput` / the `Inquiry` row) means Task 3's commit or its `prisma generate` is missing from this checkout — land Task 3 first (`cd apps/backend && npx prisma generate`); never cast around it.

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website/apps/frontend && npx tsc --noEmit
```

Expected: no errors. Run it after the backend check has finished — one typecheck job at a time on this machine.

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website && git diff --numstat -- apps/backend/src/modules/sales apps/frontend/src/lib/api/sales.ts "apps/frontend/src/app/[locale]/admin/sales/inquiries"
```

Expected (added/removed per file): `create-inquiry.dto.ts` 6/0, `update-inquiry.dto.ts` 6/0, `inquiry.service.ts` 11/1, `sales.ts` 3/0, `inquiries/page.tsx` 13/1, `inquiries/[id]/page.tsx` 3/1; the new spec is untracked until `git add`. Anything else in the list means a file outside this task was touched.

- [ ] **Step 5: Commit**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website && git add apps/backend/src/modules/sales/dto/create-inquiry.dto.ts apps/backend/src/modules/sales/dto/update-inquiry.dto.ts apps/backend/src/modules/sales/inquiry.service.ts apps/backend/src/modules/sales/inquiry.contact-name.spec.ts apps/frontend/src/lib/api/sales.ts "apps/frontend/src/app/[locale]/admin/sales/inquiries/page.tsx" "apps/frontend/src/app/[locale]/admin/sales/inquiries/[id]/page.tsx" && git commit -m "feat(sales): Inquiry.contactName — the person's name survives from the form to the lead

Website forms carry a person, not only a company (WP3a, ruling P4). The column
(Task 3's migration) is written on create, mapped on update, searchable from
the inquiries list, shown as its own column, form field and detail row, named
in the detail header, and carried to Lead.contactPerson on conversion so it is
never silently dropped. No new InquiryService dependency; inquiry.walink.spec.ts
is untouched.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

---

