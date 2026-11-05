#!/usr/bin/env bash
# Deploy Saathi to Google Cloud Run (Columbus, Ohio: next to the Neon database in AWS us-east-2).
# Usage: ./deploy.sh            (needs gcloud logged in and env.yaml filled in)
set -euo pipefail
cd "$(dirname "$0")"

REGION="${REGION:-us-east5}"
SERVICE="${SERVICE:-saathi}"

if [ ! -f env.yaml ]; then
  echo "Missing env.yaml. Copy env.yaml.example to env.yaml and fill it in." >&2
  exit 1
fi

gcloud run deploy "$SERVICE" \
  --source . \
  --region "$REGION" \
  --allow-unauthenticated \
  --env-vars-file env.yaml \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 3 \
  --port 8080
