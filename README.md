# bdk-global-dns-cdk

Shared DNS infrastructure for `eatbdk.com` — Route 53 hosted zone and ACM wildcard certificate.

## What It Creates

- **Route 53 Public Hosted Zone** for `eatbdk.com`
- **ACM Wildcard Certificate** covering `eatbdk.com` + `*.eatbdk.com` (DNS-validated)
- **CfnOutputs**: `HostedZoneId`, `CertificateArn`, `NameServers`

Deploys to `us-east-1` (CloudFront requires certs in this region).

## Project Structure

```
bdk-global-dns-cdk/
├── bin/
│   └── bdk-global-dns-cdk.ts
├── lib/
│   └── stacks/
│       └── dns-stack.ts
├── test/
│   └── dns-stack.test.ts
├── config.ts
├── .gitignore
├── .prettierrc
├── cdk.json
├── jest.config.js
├── package.json
└── tsconfig.json
```

## Usage

```bash
npm install
npm run build
npm test
npx cdk deploy
```

After deployment, grab the `HostedZoneId` and `CertificateArn` from stack outputs and hardcode them into consumer stack configs.
