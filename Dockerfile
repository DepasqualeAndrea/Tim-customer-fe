FROM node:14-alpine as builder

WORKDIR /ng-app

COPY . .

ARG env=production

RUN npm i && node --max_old_space_size=8192 --memory-reducer --optimize-for-size node_modules/@angular/cli/bin/ng build --configuration ${env} --source-map=false --subresource-integrity

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /ng-app/dist/public/yolo /usr/share/nginx/yolo
