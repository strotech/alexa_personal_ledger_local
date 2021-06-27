import * as cdk from '@aws-cdk/core';
import {Code, Runtime, Function, LayerVersion} from "@aws-cdk/aws-lambda";
import {LambdaRestApi} from "@aws-cdk/aws-apigateway";

export class AlexaStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const alexaLayerIac = new LayerVersion(this, 'alexa-layer-iac', {
      code: Code.fromAsset('src/layer'),
      compatibleRuntimes: [Runtime.NODEJS_14_X],
      license: 'Apache-2.0',
      description: 'A layer that enables Alexa',
    });

    const personalLedgerLambdaIaC = new Function(this, 'personal-ledger-lambda-iac', {
      runtime: Runtime.NODEJS_14_X,
      code: Code.fromAsset('src/program'),
      handler: 'name.handler',
      layers: [alexaLayerIac],
    })

    // API Gateway 
    new LambdaRestApi(this, 'Endpoint', {
      handler: personalLedgerLambdaIaC
    });

  }
}
