# Install AWS Command Line Interface
apk add --update python3 python3-dev py-pip
pip install awscli --upgrade

docker pull $CI_REGISTRY_IMAGE:latest

# Set AWS config variables used during the AWS get-login command below
export AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
export AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY

# Log into AWS docker registry
$(aws ecr get-login --no-include-email --region $AWS_REGION | tr -d '\r')

if [[ "$CI_COMMIT_REF_NAME" == 'update/angular' ]]; then
#   PACKAGE_VERSION=`cat package.json | grep '"version"' | cut -d'"' -f4`
#   docker tag $CI_REGISTRY_IMAGE:latest $AWS_REGISTRY_IMAGE:$PACKAGE_VERSION
#   docker push $AWS_REGISTRY_IMAGE:$PACKAGE_VERSION
# else
  docker tag $CI_REGISTRY_IMAGE:latest $AWS_TEST_REGISTRY_IMAGE:sysNewLatest
  docker push $AWS_TEST_REGISTRY_IMAGE:sysNewLatest
fi
