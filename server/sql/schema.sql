-- PostgreSQL production schema. Apply through a versioned migration runner, never at request time.
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS citext;

CREATE TABLE organizations (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, country_code char(2) NOT NULL, status text NOT NULL DEFAULT 'pending_verification', created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE users (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), identity_subject text UNIQUE NOT NULL, email citext UNIQUE NOT NULL, country_code char(2) NOT NULL, email_verified_at timestamptz, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE roles (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text UNIQUE NOT NULL);
CREATE TABLE permissions (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text UNIQUE NOT NULL);
CREATE TABLE role_permissions (role_id uuid REFERENCES roles(id) ON DELETE CASCADE, permission_id uuid REFERENCES permissions(id) ON DELETE CASCADE, PRIMARY KEY(role_id, permission_id));
CREATE TABLE memberships (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES users(id), organization_id uuid NOT NULL REFERENCES organizations(id), role_id uuid NOT NULL REFERENCES roles(id), status text NOT NULL DEFAULT 'active', created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(user_id, organization_id, role_id));
CREATE TABLE sessions (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES users(id), token_hash text UNIQUE NOT NULL, expires_at timestamptz NOT NULL, revoked_at timestamptz, created_at timestamptz NOT NULL DEFAULT now(), last_seen_at timestamptz, ip inet, user_agent text);
CREATE TABLE farms (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL REFERENCES organizations(id), owner_user_id uuid NOT NULL REFERENCES users(id), country_code char(2) NOT NULL, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE resource_shares (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), resource_type text NOT NULL, resource_id uuid NOT NULL, owner_user_id uuid NOT NULL REFERENCES users(id), recipient_user_id uuid REFERENCES users(id), recipient_organization_id uuid REFERENCES organizations(id), permission_scope text NOT NULL, purpose text NOT NULL, expires_at timestamptz, revoked_at timestamptz, created_at timestamptz NOT NULL DEFAULT now(), CHECK (recipient_user_id IS NOT NULL OR recipient_organization_id IS NOT NULL));
CREATE TABLE delegated_access_grants (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), grantor_user_id uuid NOT NULL REFERENCES users(id), delegate_organization_id uuid NOT NULL REFERENCES organizations(id), farm_id uuid NOT NULL REFERENCES farms(id), permission_scope text NOT NULL, purpose text NOT NULL, expires_at timestamptz, revoked_at timestamptz, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE consent_records (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), subject_user_id uuid NOT NULL REFERENCES users(id), organization_id uuid NOT NULL REFERENCES organizations(id), data_category text NOT NULL, purpose text NOT NULL, status text NOT NULL, granted_at timestamptz NOT NULL DEFAULT now(), withdrawn_at timestamptz, expires_at timestamptz);
CREATE TABLE audit_logs (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), occurred_at timestamptz NOT NULL DEFAULT now(), actor_user_id uuid REFERENCES users(id), organization_id uuid REFERENCES organizations(id), action text NOT NULL, resource_type text NOT NULL, resource_id uuid, request_id text, ip inet, metadata jsonb NOT NULL DEFAULT '{}');
CREATE INDEX sessions_active_idx ON sessions(user_id, expires_at) WHERE revoked_at IS NULL;
CREATE INDEX shares_lookup_idx ON resource_shares(resource_type, resource_id, recipient_user_id) WHERE revoked_at IS NULL;
CREATE INDEX audit_logs_lookup_idx ON audit_logs(organization_id, occurred_at DESC);
CREATE FUNCTION prevent_audit_mutation() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'audit logs are immutable'; END; $$;
CREATE TRIGGER audit_logs_immutable BEFORE UPDATE OR DELETE ON audit_logs FOR EACH ROW EXECUTE FUNCTION prevent_audit_mutation();
