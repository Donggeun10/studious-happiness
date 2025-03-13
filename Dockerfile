# build stage
FROM node:lts-alpine AS build-stage
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# production stage
FROM nginx:stable-alpine AS production-stage

ENV NODEJS_SERVER=http://172.27.6.8:4000
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 환경 변수를 Nginx 설정 파일에 주입하여 최종 설정 파일 생성
RUN envsubst '${NODEJS_SERVER}' < /etc/nginx/conf.d/default.conf > /etc/nginx/conf.d/default.conf.tmp && \
    mv /etc/nginx/conf.d/default.conf.tmp /etc/nginx/conf.d/default.conf

COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]