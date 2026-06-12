import * as cdk from 'aws-cdk-lib'
import * as route53 from 'aws-cdk-lib/aws-route53'
import * as acm from 'aws-cdk-lib/aws-certificatemanager'
import * as ses from 'aws-cdk-lib/aws-ses'
import { Construct } from 'constructs'
import { config } from '../../config'

export class BdkGlobalDnsStack extends cdk.Stack {
  public readonly hostedZone: route53.IHostedZone
  public readonly certificate: acm.Certificate
  public readonly emailIdentity: ses.EmailIdentity

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    this.hostedZone = route53.HostedZone.fromLookup(this, 'HostedZone', {
      domainName: config.domainName,
    })

    this.certificate = new acm.Certificate(this, 'WildcardCert', {
      domainName: config.domainName,
      subjectAlternativeNames: [`*.${config.domainName}`],
      validation: acm.CertificateValidation.fromDns(this.hostedZone),
    })

    // SES domain identity — DKIM, SPF (via Mail From), and DMARC
    this.emailIdentity = new ses.EmailIdentity(this, 'EmailIdentity', {
      identity: ses.Identity.publicHostedZone(this.hostedZone),
    })

    // MX record — routes inbound email to SES
    new route53.MxRecord(this, 'MxRecord', {
      zone: this.hostedZone,
      values: [{ priority: 10, hostName: `inbound-smtp.${config.region}.amazonaws.com` }],
    })

    // DMARC policy
    new route53.TxtRecord(this, 'DmarcRecord', {
      zone: this.hostedZone,
      recordName: `_dmarc.${config.domainName}`,
      values: ['v=DMARC1; p=none; rua=mailto:dmarc@eatbdk.com'],
    })

    new cdk.CfnOutput(this, 'HostedZoneId', { value: this.hostedZone.hostedZoneId })
    new cdk.CfnOutput(this, 'CertificateArn', { value: this.certificate.certificateArn })
  }
}
