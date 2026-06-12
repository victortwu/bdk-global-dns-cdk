import * as cdk from 'aws-cdk-lib'
import { Template } from 'aws-cdk-lib/assertions'
import { BdkGlobalDnsStack } from '../lib/stacks/dns-stack'

describe('BdkGlobalDnsStack', () => {
  const app = new cdk.App()
  const stack = new BdkGlobalDnsStack(app, 'TestDnsStack', {
    env: { account: '653102291240', region: 'us-east-1' },
  })
  const template = Template.fromStack(stack)

  it('creates an ACM certificate with wildcard SAN', () => {
    template.hasResourceProperties('AWS::CertificateManager::Certificate', {
      DomainName: 'eatbdk.com',
      SubjectAlternativeNames: ['*.eatbdk.com'],
      ValidationMethod: 'DNS',
    })
  })

  it('creates an SES email identity for the domain', () => {
    template.hasResourceProperties('AWS::SES::EmailIdentity', {
      EmailIdentity: 'eatbdk.com',
    })
  })

  it('creates an MX record pointing to SES inbound', () => {
    template.hasResourceProperties('AWS::Route53::RecordSet', {
      Type: 'MX',
      ResourceRecords: ['10 inbound-smtp.us-east-1.amazonaws.com'],
    })
  })

  it('creates a DMARC TXT record', () => {
    template.hasResourceProperties('AWS::Route53::RecordSet', {
      Type: 'TXT',
      Name: '_dmarc.eatbdk.com.',
    })
  })

  it('exports hosted zone ID and certificate ARN', () => {
    template.hasOutput('HostedZoneId', {})
    template.hasOutput('CertificateArn', {})
  })
})
