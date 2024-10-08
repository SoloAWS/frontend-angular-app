import * as cdk from 'aws-cdk-lib';
import { Stack, StackProps, RemovalPolicy, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {
  Bucket,
  BucketAccessControl,
  BlockPublicAccess,
} from 'aws-cdk-lib/aws-s3';
import {
  Distribution,
  OriginAccessIdentity,
  ViewerProtocolPolicy,
  AllowedMethods,
  CachedMethods,
} from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';

export class CdkFrontendStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create an S3 bucket for the website
    const websiteBucket = new Bucket(this, 'WebsiteBucket', {
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      accessControl: BucketAccessControl.PRIVATE,
      removalPolicy: RemovalPolicy.DESTROY, // Change to RETAIN for production
      autoDeleteObjects: true, // Be careful with this in production
    });

    // Create an Origin Access Identity for CloudFront
    const originAccessIdentity = new OriginAccessIdentity(
      this,
      'OriginAccessIdentity'
    );
    websiteBucket.grantRead(originAccessIdentity);

    // Create a CloudFront distribution
    const distribution = new Distribution(this, 'WebsiteDistribution', {
      defaultRootObject: 'index.html',
      defaultBehavior: {
        origin: new S3Origin(websiteBucket, {
          originAccessIdentity: originAccessIdentity,
        }),
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachedMethods: CachedMethods.CACHE_GET_HEAD_OPTIONS,
      },
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.minutes(5),
        },
      ],
    });

    // Output the CloudFront distribution domain name
    new CfnOutput(this, 'DistributionDomainName', {
      value: distribution.domainName,
    });
  }
}
