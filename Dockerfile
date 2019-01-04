FROM node:11 as intchngfe
COPY intchngfe /code/intchngfe
COPY npm_build.sh /code/
RUN cd /code && bash npm_build.sh intchngfe

FROM node:11 as mohfe
COPY mohfe /code/mohfe
COPY npm_build.sh /code/
RUN cd /code && bash npm_build.sh mohfe

FROM node:11 as Tier3
COPY Tier3 /code/Tier3
COPY npm_build.sh /code/
RUN cd /code && bash npm_build.sh Tier3


FROM nginx:1.12.2-alpine

ARG CONT_BUILD_SHA
LABEL build_commit_sha ${CONT_BUILD_SHA:-unknown}
LABEL maintainer "Level11, Inc"

COPY --from=intchngfe /code/intchngfe   /usr/share/nginx/intchngfe/
COPY --from=mohfe /code/mohfe       /usr/share/nginx/mohfe/
COPY --from=Tier3 /code/Tier3       /usr/share/nginx/Tier3/

COPY nginx/vhost.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080 8081 8082
