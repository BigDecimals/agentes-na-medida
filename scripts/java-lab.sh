#!/usr/bin/env bash
set -euo pipefail

ROOT=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)
PROJECT="$ROOT/examples/order-service"
IMAGE='maven:3.9.9-eclipse-temurin-21@sha256:3a4ab3276a087bf276f79cae96b1af04f53731bec53fb2e651aca79e4b10211e'
JAR="$PROJECT/target/order-service.jar"

# Nothing from the host environment or another project's Maven cache is forwarded.
# Jansi extracts a native library: this bounded tmpfs must allow executable mappings.
COMMON=(--rm --init --cpus=1 --memory=1g --pids-limit=128
  --user "$(id -u):$(id -g)" --cap-drop=ALL --security-opt=no-new-privileges
  --read-only --tmpfs /tmp:rw,nosuid,exec,size=256m --entrypoint timeout)

maven() {
  mkdir -p "$PROJECT/.cache/m2"
  docker run "${COMMON[@]}" -e MAVEN_OPTS='-Xmx384m -Duser.home=/tmp' \
    -v "$PROJECT:/workspace" -w /workspace "$IMAGE" --signal=TERM --kill-after=5s 240s \
    mvn -B -ntp -Dmaven.repo.local=/workspace/.cache/m2 "$@" >&2
}

case "${1:-}" in
  verify)
    shift
    maven clean test "$@"
    ;;
  build)
    shift
    maven package "$@"
    ;;
  test)
    shift
    maven test "$@"
    ;;
  *)
    # Rebuild explicitly after changing sources; a fresh checkout builds on first use.
    if [[ ! -f "$JAR" ]]; then maven package; fi
    docker run "${COMMON[@]}" --network=none \
      -v "$JAR:/app/order-service.jar:ro" -w /app \
      "$IMAGE" --signal=TERM --kill-after=5s 30s \
      java -Xmx256m -jar /app/order-service.jar "$@"
    ;;
esac
