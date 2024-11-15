#!/bin/bash
cd /home/ec2-user/lerna-monorepo
aws s3 cp --recursive s3://lerna-monorepo-secrets/prod/certs ./certs
cd /home/ec2-user/lerna-monorepo/packages/grpc-auth-node-deploy
aws s3 cp s3://lerna-monorepo-secrets/prod/prod.json prod.json
NODE_ENV=production
MONGO_DB=`jq ".MONGO_DB" prod.json | sed -e 's/^"//' -e 's/"$//'`
REDIS=`jq ".REDIS" prod.json | sed -e 's/^"//' -e 's/"$//'`
GRPC_AUTH=`jq ".GRPC_AUTH" prod.json | sed -e 's/^"//' -e 's/"$//'`
REFRESHSECRET=`jq ".REFRESHSECRET" prod.json | sed -e 's/^"//' -e 's/"$//'`
ACCESSSECRET=`jq ".ACCESSSECRET" prod.json | sed -e 's/^"//' -e 's/"$//'`
AWS_MAIN_KEY=`jq ".AWS_MAIN_KEY" prod.json | sed -e 's/^"//' -e 's/"$//'`
AWS_REGION=`jq ".AWS_REGION" prod.json | sed -e 's/^"//' -e 's/"$//'`
AWS_MAIN_SECRET=`jq ".AWS_MAIN_SECRET" prod.json | sed -e 's/^"//' -e 's/"$//'`
rm prod.json
(AWS_MAIN_KEY=$AWS_MAIN_KEY AWS_REGION=$AWS_REGION AWS_MAIN_SECRET=$AWS_MAIN_SECRET REFRESHSECRET=$REFRESHSECRET ACCESSSECRET=$ACCESSSECRET GRPC_AUTH=$GRPC_AUTH MONGO_DB=$MONGO_DB NODE_ENV=$NODE_ENV REDIS=$REDIS pnpm serve > /dev/null 2> /dev/null < /dev/null &)