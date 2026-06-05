# Memory Bank

## 2026-06-05: Project Scaffolded

### Initial Setup
- Created `bdk-global-dns-cdk` project under `/Users/victortwu/dev/projects/BDKGlobal/`
- Mirrors DataManagement CDK conventions: same prettier config, tsconfig, jest setup, arrow-function-only style
- Purpose: shared DNS infrastructure for `eatbdk.com` domain (Route 53 + ACM wildcard cert)
- Deploys to `us-east-1` (CloudFront cert requirement)
- Single stack (no multi-stage) — DNS is global infrastructure

### Architecture Decisions
- **No cross-stack CDK references**: Consumer stacks (DataMgmt frontend, OrderGoods) hardcode the zone ID and cert ARN in their own config after this stack deploys once
- **Minimal scope**: Only Route 53 hosted zone + ACM certificate. SES verification to be added later.
- **Stack name**: `BDK-GlobalDnsStack` (no stage prefix — there's only one)

### Next Steps
- Deploy stack to create hosted zone + cert
- Update Route 53 NS records at registrar (if domain was registered elsewhere) or verify delegation
- Record hosted zone ID + cert ARN for consumer stack configs
- Add SES domain identity when email ingestion is ready
