# Content bundle contract

`website-bundle.v1.ts` is the single source of truth for what Operations serves and the site consumes.
It is vendored byte-identically into `jobsadmire-operations/packages/validators/src/website-bundle.v1.ts`
together with the fixture; both repos run a hash test.

Changing it: (1) edit the schema here, (2) update the fixture, (3) run `npm run test -- contract`, copy the
new SHA-256 into `CONTRACT_FILE_SHA256`, (4) bump `CONTRACT_VERSION` (`1.1` for additive, `2.0` for breaking),
(5) copy both files into Operations in the same day and update its hash constant. Additive = new optional
fields or new collection keys; anything else is breaking.

The hash is computed over the Prettier-formatted file; Operations must prettier-ignore its vendored copy so the bytes stay identical.
