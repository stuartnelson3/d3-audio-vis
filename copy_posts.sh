#!/bin/bash

SRC=$GOPATH/src/blog/app/views/Posts

for f in `ls $SRC`; do
  if [ ! -f ./posts/$f ]; then
    cp $SRC/$f ./posts/$f
    echo "Copied $f"
  fi
done
