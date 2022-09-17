#!/bin/bash -eu
cd $(dirname $0)/..

docker build -t nextjs-docker .
docker run -p 3000:3000 nextjs-docker