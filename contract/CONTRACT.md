# Contracts with Operations

Three wire contracts live in this folder. Each is a Zod schema with a golden fixture and a test.

| Contract                                  | Schema                  | Fixture                           | Test                      | Read when                                                                           |
| ----------------------------------------- | ----------------------- | --------------------------------- | ------------------------- | ----------------------------------------------------------------------------------- |
| Content bundle (`CONTRACT_VERSION` `1.0`) | `website-bundle.v1.ts`  | `website-bundle.v1.fixture.json`  | `contract.test.ts`        | every page (the committed LOCAL bundle); from Operations under `CONTENT_SOURCE=OPS` |
| Blog feed (`blog.v1`)                     | `blog-feed.v1.ts`       | `blog-feed.v1.fixture.json`       | `blog-feed.test.ts`       | `BLOG_SOURCE=OPS`                                                                   |
| Candidates feed (`candidates.v1`)         | `candidates-feed.v1.ts` | `candidates-feed.v1.fixture.json` | `candidates-feed.test.ts` | `POOL_SOURCE=OPS`                                                                   |

## The content bundle

`website-bundle.v1.ts` is the shape of the bundle every page reads. Both committed LOCAL bundles (`src/content/local/bundle.<locale>.json`) validate against it.

It has no producer in Operations yet: Operations serves no bundle route and holds no copy of this file. The hash pin (`CONTRACT_FILE_SHA256` in `contract.test.ts`) is this repo's own guard: any edit to the schema fails `npm run verify` until the hash is recomputed on purpose.

Changing it:

1. Edit the schema here.
2. Update the fixture.
3. Run `npm run test -- contract` and copy the new SHA-256 into `CONTRACT_FILE_SHA256`. The hash is computed over the file as committed, which is Prettier-formatted.
4. Bump `CONTRACT_VERSION` (`1.1` for additive, `2.0` for breaking). Additive = new optional fields or new collection keys; anything else is breaking.

## The blog and candidates feeds

Operations produces both feeds. Each repo keeps its own fixture of the same shape:

- Operations: `apps/backend/src/modules/website/blog/__fixtures__/blog-feed.v1.json` and `apps/backend/src/modules/website/candidates/__fixtures__/candidates-feed.v1.json`.
- This repo: `blog-feed.v1.fixture.json` and `candidates-feed.v1.fixture.json`.

Nothing compares the two sides automatically. A shape change is therefore made in both repos in the same task:

- an added field: the producer (Operations) first, then the reader here;
- a removed field: the reader here first, then the producer.

The wire shapes and their rules are in `docs/INTEGRATIONS.md` (I21 for the blog, I7 for the candidates).
