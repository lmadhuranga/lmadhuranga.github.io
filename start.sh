#!/usr/bin/env bash

set -euo pipefail

PORT="${PORT:-4000}" # Main site port
LIVERELOAD_PORT="${LIVERELOAD_PORT:-35730}" # Live reload websocket port

is_port_in_use() {
  local port="$1"
  lsof -iTCP -sTCP:LISTEN -n -P 2>/dev/null | grep -q ":${port}\\b"
}

kill_port_listener() {
  local port="$1"
  local pids
  pids="$(lsof -tiTCP:"$port" -sTCP:LISTEN 2>/dev/null || true)" # Listener PIDs
  if [[ -n "$pids" ]]; then
    kill $pids 2>/dev/null || true
    sleep 0.2
  fi
}

find_free_port() {
  local start="$1"
  local end="$2"
  local port
  for ((port=start; port<=end; port++)); do
    if ! is_port_in_use "$port"; then
      echo "$port"
      return 0
    fi
  done
  return 1
}

# Free the main port if something is already listening.
if is_port_in_use "$PORT"; then
  kill_port_listener "$PORT"
fi

# Fallback to an open port if the default stays busy.
if is_port_in_use "$PORT"; then
  PORT="$(find_free_port 4000 4010)"
fi

# Free the live reload port if needed.
if is_port_in_use "$LIVERELOAD_PORT"; then
  kill_port_listener "$LIVERELOAD_PORT"
fi

# Fallback to an open live reload port.
if is_port_in_use "$LIVERELOAD_PORT"; then
  LIVERELOAD_PORT="$(find_free_port 35730 35740)"
fi

jekyll serve --source . --destination _site --host 0.0.0.0 --port "$PORT" --livereload --livereload-port "$LIVERELOAD_PORT"
