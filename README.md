# Main Site Porting Angular

## Prerequisites
2. Install Angular CLI: `npm i -g @angular/cli`
3. From project root folder install all the dependencies: `npm i`

## Running in Dev

There are 5 ways to launch the dev server :
* `npm run fe` : tenant YOLO & real call to the tenant API
* `npm run fe-mock` : tenant YOLO & **mocked** call to the tenant API (cf. *tenantMock.json* & mock environment)
* `npm run fe-cb-mock` : tenant Chebanca & **mocked** call to the tenant API
* `npm run fe-cb-ssl` : tenant Chebanca, server launched in SSL, SSO on, real call to the tenant API

Anyway, a window will automatically open at [localhost:4200](http://localhost:4200). Angular files are being watched. Any change automatically creates a new bundle, restart server and reload your browser.

## Production mode
`npm run prod`: run the project with a production bundle and AOT compilation

## Running frontend unit tests
Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running TSLint
Run `ng lint` (frontend) and `npm run lintbe` (backend) to execute the linter via [TSLint](https://palantir.github.io/tslint/).

#Deploy Info

## Install Docker on your machine
Docker desktop `https://hub.docker.com/`.

##Install AWS on ypur machine
AWS CLI `https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html`

## Running  aws configuration
Run `aws configure`.

#Deploy SYS

## Deploying APP on AWS - ECR
Run `aws ecr get-login --region eu-central-1 --no-include-email` and `docker login` to authenticate or directly `$(aws ecr get-login --region eu-central-1 --no-include-email)`.

Run `npm run prepush:sys`.
Run `npm run push:sys`.

# Deploy Production

## Advance and tag version
Run `npm version minor` for minor version or `npm version major` for major version.
Than run `git push` to push the new version.

## Deploying APP on AWS - ECR
Run `aws ecr get-login --region eu-central-1 --no-include-email` and `docker login` to authenticate or directly `$(aws ecr get-login --region eu-central-1 --no-include-email)`.
Than Run `npm run push:prod`

##AWS Deploy
1) Go on `https://eu-central-1.signin.aws.amazon.com/oauth?SignatureVersion=4&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJ2JMA3Q2BNMHUUKA&X-Amz-Date=2019-04-29T08%3A38%3A19.947Z&X-Amz-Signature=964f944fbeca47a6f61ad58005ecacaf3e942c0fd2cbebf29cac0ac797315198&X-Amz-SignedHeaders=host&client_id=arn%3Aaws%3Aiam%3A%3A015428540659%3Auser%2Fecs&redirect_uri=https%3A%2F%2Feu-central-1.console.aws.amazon.com%2Fecs%2Fhome%3Fregion%3Deu-central-1%26state%3DhashArgs%2523%252Fclusters%252Fyolo-sys-wl-cluster%252Fservices%26isauthcode%3Dtrue&region=eu-central-1&response_type=code&state=hashArgs%23%2Fclusters%2Fyolo-sys-wl-cluster%2Fservices`
2) Insert your credentials and login
3) Open Services > ECS and select the cluster (SYS: yolo-sys-wl-cluster or PRODUCTION: yolo-pro-wl-cluster)
4) click on Tasks tab and select the frontend task clicking on `Task definition`
5) click on `Create new revision`. During the creation update the image name url with the right version by clicking on chapter Container definition `frontend`. Then click on `Create`.
6) then go back to the Forntend service (Clusters > yolo-sys-wl-cluster or yolo-pro-wl-cluster > frontend) and click on `update`.
7) During the update select the right revision (should be the latest) and keep going with the update.


##SSO
1) Switch between SSO authentication and nromal authentication depends on tenantInfo sso required (tenantInfo.sso.requried) flag.
2) To locally and SYS test SSO authentication tou have to map on your /etc/hosts file the following ips:
    127.0.0.1       devprotezione.chebanca.it (local Only)

    10.217.230.115  devclienti.chebanca.it
    10.217.230.108  devcdnapi.chebanca.net
    10.217.230.108  devcdn.chebanca.net
    # 3.122.213.31  devprotezione.chebanca.it (uncomment if testing SYS and comment 127.0.0.1);

3) During the SSO test, when the redirect for SSO client is completed just replace `devclienti.chebanca.it` with `10.217.230.115`from url.
   Then insert the following credentials:
    - 101506248 (not confirmed user) || 101521565 (normal user)
    - 01/01/1980
    - 00000
    
    
# Recaptha

#Settings

- Login to your google account
- Go to the recaptcha admin console (as explained here: https://developers.google.com/recaptcha/docs/settings)
- Configure your version of recaptcha (2.0)
- Configure domains allowed to use the feature (eg: 127.0.0.1)
- Copy and paste the siteKey into environment.ts under `recaptchaSiteKey`

