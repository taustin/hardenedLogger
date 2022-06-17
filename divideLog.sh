#!/bin/zsh

N=10000

for i in {1..20}
do
  H="$(($i*$N))"
  CMD="head -n ${H} access.log | tail -n ${N} > access.log_${i}"
  echo ${CMD}
  eval ${CMD}
done

