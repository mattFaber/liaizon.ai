# liaizon.ai

SvelteKit 2 + Svelte 5 + TypeScript starter with Firestore persistence and Cloud Run serverless hosting on GCP.

## Local development

Install and run:

```sh
npm install
npm run dev
```

Validation commands:

```sh
npm run check
npm run lint
```

## Coding Standards

See [.github/CODING_STANDARDS.md](.github/CODING_STANDARDS.md) for conventions on formatting, TypeScript, Svelte 5 runes, naming, and code organization.

## GCP architecture

- Hosting: Cloud Run
- Runtime output: SvelteKit Node adapter (`@sveltejs/adapter-node`)
- NoSQL storage: Firestore Native mode
- Persist endpoint: `POST /api/submissions`

## Environment variables

Required in Cloud Run:

- `FIRESTORE_DATABASE_ID` (use `(default)` unless you created a named Firestore database)

Usually provided automatically in Cloud Run:

- `GOOGLE_CLOUD_PROJECT`
- `PORT`

For local server-side Firestore usage, use Application Default Credentials:

```sh
gcloud auth application-default login
```

Or set:

```sh
export GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/to/service-account.json
```

## One-time GCP setup

```sh
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com firestore.googleapis.com
```

Create Firestore database (skip if already created):

```sh
gcloud firestore databases create --location=nam5 --type=firestore-native
```

## Deploy to Cloud Run

From repo root:

```sh
gcloud run deploy liaizon-web \
	--source . \
	--region us-central1 \
	--allow-unauthenticated \
	--set-env-vars FIRESTORE_DATABASE_ID="(default)"
```

## GitHub Actions with OIDC (recommended)

This repo includes:

- `.github/workflows/ci.yml` for PR validation (`check` + `build`)
- `.github/workflows/deploy-production.yml` for production deploys on `main`

The deploy workflow uses Workload Identity Federation (OIDC), so no long-lived JSON key is stored in GitHub.

### 1) Create Workload Identity Federation in GCP

Set these values first:

```sh
PROJECT_ID="liaizon-ai"
PROJECT_NUMBER="$(gcloud projects describe "$PROJECT_ID" --format='value(projectNumber)')"
POOL_ID="github-pool"
PROVIDER_ID="github-provider"
REPO="mattFaber/liaizon.ai"
SERVICE_ACCOUNT_NAME="liaizon-web-sa"
SERVICE_ACCOUNT_EMAIL="${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"
```

Create pool + provider:

```sh
gcloud iam workload-identity-pools create "$POOL_ID" \
	--project="$PROJECT_ID" \
	--location="global" \
	--display-name="GitHub Actions Pool"

gcloud iam workload-identity-pools providers create-oidc "$PROVIDER_ID" \
	--project="$PROJECT_ID" \
	--location="global" \
	--workload-identity-pool="$POOL_ID" \
	--display-name="GitHub OIDC Provider" \
	--issuer-uri="https://token.actions.githubusercontent.com" \
	--attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository,attribute.ref=assertion.ref"
```

Allow only this repo (and main branch) to impersonate the service account:

```sh
gcloud iam service-accounts add-iam-policy-binding "$SERVICE_ACCOUNT_EMAIL" \
	--project="$PROJECT_ID" \
	--role="roles/iam.workloadIdentityUser" \
	--member="principalSet://iam.googleapis.com/projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/${POOL_ID}/attribute.repository/${REPO}"
```

Grant runtime deploy permissions:

```sh
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
	--member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}" \
	--role="roles/run.admin"

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
	--member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}" \
	--role="roles/artifactregistry.writer"

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
	--member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}" \
	--role="roles/cloudbuild.builds.editor"

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
	--member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}" \
	--role="roles/iam.serviceAccountUser"
```

Build provider resource name for GitHub secret:

```sh
echo "projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/${POOL_ID}/providers/${PROVIDER_ID}"
```

### 2) Configure GitHub repository settings

Create GitHub Actions secrets:

- `GCP_WORKLOAD_IDENTITY_PROVIDER`: output from command above
- `GCP_SERVICE_ACCOUNT`: `liaizon-web-sa@YOUR_PROJECT_ID.iam.gserviceaccount.com`

Create GitHub Actions variables:

- `GCP_PROJECT_ID`: your GCP project id
- `GCP_REGION`: Cloud Run region (for example `us-central1`)
- `CLOUD_RUN_SERVICE`: Cloud Run service name (for example `liaizon-web`)
- `FIRESTORE_DATABASE_ID`: optional, defaults to `(default)` if omitted

### 3) Protect production deployments

In GitHub: `Settings -> Environments -> production`

- Add required reviewers for manual production approvals.
- Optionally restrict deployment branches to `main`.

## IAM hardening (recommended)

Create a dedicated service account and grant minimum Firestore write/read access:

```sh
gcloud iam service-accounts create liaizon-web-sa

gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
	--member serviceAccount:liaizon-web-sa@YOUR_PROJECT_ID.iam.gserviceaccount.com \
	--role roles/datastore.user

gcloud run services update liaizon-web \
	--region us-central1 \
	--service-account liaizon-web-sa@YOUR_PROJECT_ID.iam.gserviceaccount.com
```

## Data model

Current collection:

- `submissions_v1`

Stored fields:

- `fullName`
- `email`
- `phone` (optional)
- `role`
- `contactMethod`
- `notes` (optional)
- `priority` (optional)
- `agreeToTerms`
- `createdAt` (server timestamp)
