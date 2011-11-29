#!/bin/sh

workspace=$1
namespace=$2

if [ "X"$workspace = "X" ];
then
  echo "usage: `basename $0` <workspace> <namespace>"
  exit 1
fi

ROOTDIR=/var/lib/geoserver/instance2/data/workspaces/

for np in /var/lib/geoserver/instance2/data/workspaces/$workspace/*
do
  if [ -d "$np" ]; then
    echo $np;
    dir="$(echo $np | cut -d"/" -f9-)"
    echo $dir
  echo   "http://geo.gipbe.dotgee.fr/geoserver/rest/workspaces/${workspace}/datastores/${dir}/external.shp?configure=all"
  echo  "file://${ROOTDIR}/${workspace}/${dir}"
  curl -s -u atanguy:changeme -v -XPUT -H 'Content-type: text/plain' \
     -d "file://${ROOTDIR}/${workspace}/${dir}" \
     "http://geo.gipbe.dotgee.fr/geoserver/rest/workspaces/${workspace}/datastores/${dir}/external.shp?configure=all"
  fi
done

