#!/usr/bin/env bash
# Runs the support migration + assertion suite on a THROWAWAY local Postgres. Never point this at Supabase.
#   PGHOST=127.0.0.1 PGPORT=54329 PGUSER=postgres supabase/tests/run_scratch.sh
# Optional: CITYCORE_APP_SCHEMA=/path/to/CityCoreSchema.sql to use the real app schema instead of the minimal stub.
set -euo pipefail
cd "$(dirname "$0")"
HOST="${PGHOST:-127.0.0.1}"; PORT="${PGPORT:-54329}"; USER_="${PGUSER:-postgres}"
case "$HOST" in *supabase.co*|*supabase.com*|*pooler*) echo "refusing: remote Supabase host" >&2; exit 2;; esac
case "$HOST" in 127.0.0.1|localhost|/*) ;; *) echo "refusing: only local hosts allowed" >&2; exit 2;; esac
MIG=../migrations/20261105000000_support_system.sql
psql_() { psql -v ON_ERROR_STOP=1 -X -q -h "$HOST" -p "$PORT" -U "$USER_" "$@"; }
mk() { psql_ -d postgres -c "drop database if exists $1" -c "create database $1"; }
base() { psql_ -d "$1" -f 00_supabase_stub.sql >/dev/null
  if [ -n "${CITYCORE_APP_SCHEMA:-}" ]; then psql_ -d "$1" -f "$CITYCORE_APP_SCHEMA" >/dev/null; else psql_ -d "$1" -f 00b_app_prereq_stub.sql >/dev/null; fi; }

echo "== fresh install + assertions"
mk cc_t1; base cc_t1
psql_ -d cc_t1 -f "$MIG" >/dev/null
psql_ -d cc_t1 -f 10_security_functional.sql 2>&1 | grep -E "ASSERTION|ERROR|PASSED|^psql" || true

echo "== idempotent re-run of v2 migration"
psql_ -d cc_t1 -f "$MIG" >/dev/null && echo "re-run OK"

echo "== conflict guard: pre-existing non-v2 support_tickets"
mk cc_t2; base cc_t2
psql_ -d cc_t2 -c "create table public.support_tickets(id int)" >/dev/null
if psql_ -d cc_t2 -f "$MIG" >/dev/null 2>/tmp/cc_guard.err; then echo "FAIL: guard did not block"; exit 1; fi
grep -q "conflict" /tmp/cc_guard.err && echo "guard blocked as expected"
psql_ -d cc_t2 -At -c "select count(*) from pg_proc where proname like 'support\_%'" | grep -qx 0 && echo "nothing partially applied"

echo "== conflict guard: pre-existing bucket"
mk cc_t3; base cc_t3
psql_ -d cc_t3 -c "insert into storage.buckets(id,name,public) values ('support-attachments','support-attachments',true)" >/dev/null
if psql_ -d cc_t3 -f "$MIG" >/dev/null 2>/tmp/cc_guard.err; then echo "FAIL: bucket guard did not block"; exit 1; fi
grep -q "bucket" /tmp/cc_guard.err && echo "bucket guard blocked as expected"

echo "== missing prerequisite"
mk cc_t4; psql_ -d cc_t4 -f 00_supabase_stub.sql >/dev/null
if psql_ -d cc_t4 -f "$MIG" >/dev/null 2>/tmp/cc_guard.err; then echo "FAIL: prereq guard did not block"; exit 1; fi
grep -q "prerequisite" /tmp/cc_guard.err && echo "prerequisite guard blocked as expected"

for d in cc_t1 cc_t2 cc_t3 cc_t4; do psql_ -d postgres -c "drop database if exists $d" >/dev/null; done
echo "DONE"
