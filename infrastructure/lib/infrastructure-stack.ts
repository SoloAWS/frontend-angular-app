import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';
import * as path from 'path';

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Step 1: Create an S3 bucket for storing Angular build artifacts
    const hostingBucket = new s3.Bucket(this, 'AngularHostingBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL, // Keep bucket private
    });

    // Step 2: Create an Origin Access Identity for CloudFront to securely access the S3 bucket
    const originAccessIdentity = new cloudfront.OriginAccessIdentity(
      this,
      'AngularHostingOAI',
      {
        comment: 'OAI for Angular Hosting Bucket',
      }
    );
    hostingBucket.grantRead(originAccessIdentity); // Grant read access to CloudFront

    // Step 3: Create a CloudFront distribution to serve the Angular app
    const distribution = new cloudfront.Distribution(
      this,
      'AngularHostingDistribution',
      {
        defaultBehavior: {
          origin: new origins.S3Origin(hostingBucket, {
            originAccessIdentity: originAccessIdentity,
          }),
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
        defaultRootObject: 'index.html',
        errorResponses: [
          {
            httpStatus: 404,
            responseHttpStatus: 200,
            responsePagePath: '/index.html', // For SPA fallback in Angular
          },
        ],
      }
    );

    // Step 4: Deploy Angular app to the S3 bucket
    new s3deploy.BucketDeployment(this, 'DeployAngularApp', {
      sources: [
        s3deploy.Source.asset(
          path.join(__dirname, '../../dist/frontend-angular')
        ),
      ],
      destinationBucket: hostingBucket,
      distribution,
      distributionPaths: ['/*'],
    });

    // Step 5: Output CloudFront URL for easy access
    new cdk.CfnOutput(this, 'CloudFrontURL', {
      value: distribution.domainName,
      description: 'CloudFront URL for the Angular App',
    });
  }
}
