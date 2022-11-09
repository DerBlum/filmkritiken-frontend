######################
### Stage 2: Build ###
######################
FROM node:12.22.12-alpine as build

WORKDIR /usr/src/app

COPY ./ ./

RUN npm ci --quiet && npm run build-prod

####################
### Stage 2: Run ###
####################

FROM nginx:1.19.10-alpine

RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /usr/src/app/dist/filmkritiken-frontend /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
