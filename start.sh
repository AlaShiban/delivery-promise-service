#!/bin/bash
set -e

export DD_APM_ENABLED=${DD_APM_ENABLED:-true}
export DD_APM_NON_LOCAL_TRAFFIC=false
export DD_LOG_LEVEL=${DD_LOG_LEVEL:-info}
export DD_HOSTNAME=${DD_HOSTNAME:-delivery-promise-service}
export DD_SERVICE=${DD_SERVICE:-delivery-promise-service}
export DD_ENV=${DD_ENV:-production}
export DD_REMOTE_CONFIGURATION_ENABLED=${DD_REMOTE_CONFIGURATION_ENABLED:-true}
export DD_DYNAMIC_INSTRUMENTATION_ENABLED=${DD_DYNAMIC_INSTRUMENTATION_ENABLED:-true}
export DD_TRACE_DEBUG=${DD_TRACE_DEBUG:-true}
export DD_TRACE_STARTUP_LOGS=${DD_TRACE_STARTUP_LOGS:-true}

# Render's containers aren't Kubernetes/ECS/etc, but the Agent auto-detects
# these features from the environment anyway and then spams the logs with
# failed kubelet/orchestrator/process checks. Turn them off explicitly.
# Remote Config + the trace-agent (needed for Live Debugger) are untouched.
export DD_AUTOCONFIG_EXCLUDE_FEATURES=${DD_AUTOCONFIG_EXCLUDE_FEATURES:-kubernetes,kube_orchestratorexplorer,kubelet_config_orchestrator_check,process}
export DD_PROCESS_CONFIG_ENABLED=${DD_PROCESS_CONFIG_ENABLED:-false}

echo "Starting Datadog Agent..."
/opt/datadog-agent/bin/agent/agent run -c /etc/datadog-agent/datadog.yaml &

echo "Starting Datadog trace-agent..."
/opt/datadog-agent/embedded/bin/trace-agent run -c /etc/datadog-agent/datadog.yaml &

for i in $(seq 1 20); do
  if curl -sf http://127.0.0.1:8126/info >/dev/null 2>&1; then
    echo "Datadog Agent trace-agent is ready."
    break
  fi
  echo "Waiting for Datadog Agent trace-agent... ($i)"
  sleep 1
done

echo "Starting Node app..."
exec node server.js
