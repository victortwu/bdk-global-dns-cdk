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
├── .kiro/
│   ├── memory-bank.md
│   └── steering/
│       └── steering.md
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

After deployment, grab the `HostedZoneId` and `CertificateArn` from stack outputs and hardcode them into consumer stack configs (DataMgmt frontend, OrderGoods, etc.).

## Consumer Pattern

Consumer stacks reference the DNS resources by hardcoded values in their own `config.ts`:

```typescript
export const dnsConfig = {
  hostedZoneId: 'Z0123456789ABCDEFGHIJ', // from BDK-GlobalDnsStack output
  certificateArn: 'arn:aws:acm:us-east-1:653102291240:certificate/...', // from output
  domainName: 'eatbdk.com',
}
```

No cross-stack CDK references — these values are stable after initial deployment.
