#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { BdkGlobalDnsStack } from '../lib/stacks/dns-stack'
import { config } from '../config'

const app = new cdk.App()

new BdkGlobalDnsStack(app, 'BDK-GlobalDnsStack', {
  env: { region: config.region },
})
