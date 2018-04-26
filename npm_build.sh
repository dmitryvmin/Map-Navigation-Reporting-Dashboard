#!/usr/bin/env bash

set -exu -o pipefail

BASEDIR=$1

if [[ -z "$BASEDIR" ]]; then
  echo "Missing BASEDIR variable. Cannot build npm project. Exiting."
  exit 1
fi

cd $BASEDIR

npm install
npm run build
