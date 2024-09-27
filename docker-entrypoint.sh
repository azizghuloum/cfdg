#!/bin/bash

if [ "$DEV" == "1" ]
then
  exec npm run dev -- --port 3000 --host
else
  exec npm run preview -- --port 3000 --host
fi
