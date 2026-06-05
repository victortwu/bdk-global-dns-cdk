# BDK Global DNS CDK — Steering

## Project Identity
- **Package name**: bdk-global-dns-cdk
- **Purpose**: Shared DNS infrastructure for `eatbdk.com` — Route 53 hosted zone, ACM wildcard certificate, SES domain verification
- **Domain**: `eatbdk.com` (restaurant operations domain for BDK projects)
- **Region**: `us-east-1` (CloudFront requires certs in us-east-1)
- **Consumers**: DataManagement frontend, OrderGoods frontend, any future BDK service needing the domain

## Architecture Philosophy
- **Deploy once, consume everywhere**: This stack creates stable DNS resources (hosted zone, cert) that other stacks reference by hardcoded ARN/ID.
- **No cross-stack CDK references**: Consumer stacks import zone ID and cert ARN as constants in their own config — not via CloudFormation exports or SSM lookups at deploy time.
- **Minimal scope**: Only DNS and domain-level concerns. No application resources.

## What This Stack Creates
- Route 53 Public Hosted Zone for `eatbdk.com`
- ACM wildcard certificate (`*.eatbdk.com` + `eatbdk.com`) with DNS validation
- (Future) SES domain identity with DKIM/SPF/DMARC records

## Stage Configuration
- Single deployment (no multi-stage) — DNS is global infrastructure, not per-environment
- Stack name: `BDK-GlobalDnsStack`

## Coding Conventions
- Always use arrow functions (`const fn = () => {}`) — no `function` keyword
- CDK stacks in `lib/stacks/`, entry point in `bin/`
- Tests in `test/`, one test file per stack
- Prettier: single quotes, no semicolons, trailing commas, 100 char width, 2-space indent
- TypeScript strict mode, ES2022 target
- aws-cdk-lib peer-aligned with DataManagement CDK (2.251.0)

## Outputs
After deployment, record these values for consumer stacks:
- Hosted Zone ID → used in Route 53 alias records
- Certificate ARN → used in CloudFront distributions and ALBs

## Memory Bank
**After every task or significant conversation, update `.kiro/memory-bank.md` with a summary of what was discussed, decided, or built. Prioritize recency — newest content at the top.**
