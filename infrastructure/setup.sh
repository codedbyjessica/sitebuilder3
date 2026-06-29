#!/bin/bash
# SiteBuilder AWS Infrastructure Setup
# Run once after setting up your AWS account and CLI

set -e

REGION=${AWS_REGION:-us-east-1}
BUCKET_NAME=${S3_BUCKET:-sitebuilder-images-prod}

echo "🚀 Setting up SiteBuilder infrastructure in $REGION"

# Create DynamoDB tables
echo "📦 Creating DynamoDB tables..."
for table in sites images contacts analytics; do
  aws dynamodb create-table \
    --cli-input-json "file://$(dirname $0)/dynamodb-tables.json" \
    --query "tables[?TableName=='sitebuilder-$table'] | [0]" \
    --region $REGION 2>/dev/null || echo "  Table sitebuilder-$table may already exist"
done

# Create S3 bucket
echo "🪣 Creating S3 bucket: $BUCKET_NAME"
if [ "$REGION" = "us-east-1" ]; then
  aws s3api create-bucket --bucket $BUCKET_NAME --region $REGION 2>/dev/null || echo "  Bucket may already exist"
else
  aws s3api create-bucket --bucket $BUCKET_NAME --region $REGION \
    --create-bucket-configuration LocationConstraint=$REGION 2>/dev/null || echo "  Bucket may already exist"
fi

# Configure S3 bucket for public images
aws s3api put-bucket-cors --bucket $BUCKET_NAME --cors-configuration '{
  "CORSRules": [{
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }]
}'

echo "✅ Infrastructure setup complete!"
echo ""
echo "Next steps:"
echo "1. Set up Amazon Cognito User Pool and note the IDs"
echo "2. Create a CloudFront distribution pointing to the S3 bucket"
echo "3. Copy .env.local.example to .env.local and fill in values"
echo "4. Deploy to AWS Amplify Hosting"
