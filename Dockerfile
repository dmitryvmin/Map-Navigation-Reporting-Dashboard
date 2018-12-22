FROM nginx:1.12.2-alpine

ARG CONT_BUILD_SHA
LABEL build_commit_sha ${CONT_BUILD_SHA:-unknown}
LABEL maintainer "Level11, Inc"

COPY intchngfe   /usr/share/nginx/intchngfe/
COPY mohfe       /usr/share/nginx/mohfe/
COPY Tier3       /usr/share/nginx/Tier3/

COPY nginx/vhost.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080 8081 8082
