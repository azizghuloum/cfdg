#!/bin/bash

if [ "$DEV" == "1" ]
then
  exec npm start
else
  exec serve build
fi
