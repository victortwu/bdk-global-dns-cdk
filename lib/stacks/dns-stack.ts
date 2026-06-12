import * as cdk from 'aws-cdk-lib'
import * as route53 from 'aws-cdk-lib/aws-route53'
import * as acm from 'aws-cdk-lib/aws-certificatemanager'
import { Construct } from 'constructs'
import { config } from '../../config'

export class BdkGlobalDnsStack extends cdk.Stack {
  public readonly hostedZone: route53.IHostedZone
  public readonly certificate: acm.Certificate

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

    new cdk.CfnOutput(this, 'HostedZoneId', { value: this.hostedZone.hostedZoneId })
    new cdk.CfnOutput(this, 'CertificateArn', { value: this.certificate.certificateArn })
  }
}
