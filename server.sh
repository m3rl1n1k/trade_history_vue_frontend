#!/bin/bash

  if [[ $1 == "start" ]]; then
      npm run dev;
  fi
  if [[ $1 == "restart" ]]; then
	sudo lsof -i :5173
	echo "Run: sudo kill -9 <PID>"
  fi
