FROM nginx:1.12.2-alpine
MAINTAINER level11.com

COPY intchngfe/build   /usr/share/nginx/intchngfe/
COPY mohfe/build       /usr/share/nginx/mohfe/
COPY nginx/vhost.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080 8081
