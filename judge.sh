#!/usr/bin/env bash
set -e
PROB=$1
USER_FILE=$2
REPORT="${USER_FILE%.*}_report.json"

PASSED=0; TOTAL=0; DET="["
for tin in tests/$PROB/*.in; do
  ((TOTAL++))
  ans=${tin%.in}.ans
  python "submissions/$USER_FILE" < "$tin" > out.txt 2>/dev/null && \
  diff -Z out.txt "$ans" >/dev/null && OK=true || OK=false
  if $OK; then
    ((PASSED++)); DET+="{\"case\":\"$(basename "$tin")\",\"passed\":true},"
  else
    DET+="{\"case\":\"$(basename "$tin")\",\"passed\":false},"
  fi
done
DET="${DET%,}]"; SCORE=$((PASSED*100/TOTAL))
echo "{\"score\":$SCORE,\"passed\":$PASSED,\"total\":$TOTAL,\"details\":$DET}" > "submissions/$REPORT"