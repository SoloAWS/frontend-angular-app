import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create an S3 bucket to store the Angular app
    const hostingBucket = new s3.Bucket(this, 'FrontendAngularBucket', {
      bucketName: 'frontend-angular-bucket',
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
      publicReadAccess: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // Create a CloudFront distribution
    const distribution = new cloudfront.Distribution(this, 'FrontendAngularDistribution', {
      defaultBehavior: {
        origin: new origins.S3Origin(hostingBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      defaultRootObject: 'index.html',
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
        },
      ],
    });

    // Deploy site contents to S3 bucket
    new s3deploy.BucketDeployment(this, 'DeployFrontendAngular', {
      sources: [s3deploy.Source.asset('../FrontendAngular/dist/frontend-angular')],
      destinationBucket: hostingBucket,
      distribution,
      distributionPaths: ['/*'],
    });

    // Output the CloudFront URL
    new cdk.CfnOutput(this, 'DistributionDomainName', {
      value: distribution.domainName,
      description: 'CloudFront Distribution Domain Name',
    });
  }
}
