# Install AWS Command Line Interface
apk add --update python3 python3-dev py-pip gettext
pip install awscli --upgrade

# docker pull $CI_REGISTRY_IMAGE:$CI_COMMIT_REF_NAME

# The AWS registry now has our new container, but our cluster isn't aware that a new version
if [[ $CI_COMMIT_REF_NAME == 'update/angular' ]]; then
#   export PACKAGE_VERSION=`cat package.json | grep '"version"' | cut -d'"' -f4`
#   envsubst < aws/yolo-frontend-task-staging-definition.json > aws/yolo-frontend-task-staging-versioned-definition.json
#   aws ecs register-task-definition --cli-input-json file://aws/yolo-frontend-task-staging-versioned-definition.json --region $AWS_REGION
# else
  aws ecs register-task-definition --cli-input-json file://aws/yolo-frontend-task-sys-13-definition.json --region $AWS_REGION
fi

# Tell our service to use the latest version of task definition.
aws ecs update-service --cluster $CI_CLUSTER --service frontend-13 --task-definition $CI_TASK --region $AWS_REGION
