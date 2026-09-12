# Production implementation runbook

1. Provision managed PostgreSQL, KMS, Redis, a transactional-email provider, and an OIDC identity provider in separate development, staging, and production accounts.
2. Apply `server/sql/schema.sql` via a reviewed migration pipeline; enable encrypted backups and test point-in-time restoration before importing customer data.
3. Configure `OIDC_ISSUER`, `OIDC_AUDIENCE`, database credentials, KMS keys, mail credentials, trusted proxy CIDRs, allowed browser origins, and region/data-residency policies only through the deployment secret manager.
4. Replace the local prototype identity adapter with the OIDC/PostgreSQL adapter before production. Do not expose self-service government or platform-admin role assignment; those roles require verified invitations and approval.
5. Require policy checks for each resource read/mutation and use normalized resource shares, delegated grants, and consent records. Audit every sensitive decision.
6. Enable CSRF protection for cookie sessions, Redis-backed account/IP rate limits, WAF rules, structured redacted logs, SIEM export, alerting, dependency scanning, SAST/DAST, and an independent penetration test.
7. Complete email verification, password reset delivery, MFA recovery codes, passkeys for privileged users, session/device management, and incident-response runbooks before launch.
