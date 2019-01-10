FROM node:11 as builder 
COPY . /code
RUN cd /code && bash npm_build.sh intchngfe
RUN cd /code && bash npm_build.sh mohfe
RUN cd /code && bash npm_build.sh Tier3

FROM nginx:1.12.2-alpine

ARG CONT_BUILD_SHA
LABEL build_commit_sha ${CONT_BUILD_SHA:-unknown}
LABEL maintainer "Level11, Inc"

RUN rm -rf /usr/share/nginx/html

COPY --from=builder /code/intchngfe/build   /usr/share/nginx/intchngfe/
COPY --from=builder /code/mohfe/build       /usr/share/nginx/mohfe/
COPY --from=builder /code/Tier3/build       /usr/share/nginx/Tier3/

COPY nginx/vhost.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
