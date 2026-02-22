-- =============================================================================
-- M4 OPS Commander × ZeroClaw — Database Schema
-- =============================================================================
-- Run against your Supabase/PostgreSQL database

-- Agent task queue
CREATE TABLE IF NOT EXISTS agent_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_slug TEXT NOT NULL,
  department TEXT NOT NULL,
  message TEXT NOT NULL,
  priority INTEGER NOT NULL DEFAULT 5 CHECK (priority BETWEEN 1 AND 10),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed')),
  source_agent TEXT,
  result TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agent_tasks_slug ON agent_tasks(agent_slug);
CREATE INDEX IF NOT EXISTS idx_agent_tasks_status ON agent_tasks(status);
CREATE INDEX IF NOT EXISTS idx_agent_tasks_priority ON agent_tasks(priority DESC);

-- Agent logs
CREATE TABLE IF NOT EXISTS agent_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_slug TEXT NOT NULL,
  level TEXT NOT NULL DEFAULT 'info' CHECK (level IN ('info', 'warn', 'error', 'heartbeat')),
  message TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agent_logs_slug ON agent_logs(agent_slug);
CREATE INDEX IF NOT EXISTS idx_agent_logs_level ON agent_logs(level);
CREATE INDEX IF NOT EXISTS idx_agent_logs_created ON agent_logs(created_at DESC);

-- Agent metrics (time-series)
CREATE TABLE IF NOT EXISTS agent_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_slug TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'offline' CHECK (status IN ('online', 'offline', 'error', 'paused')),
  uptime_seconds INTEGER NOT NULL DEFAULT 0,
  memory_bytes BIGINT NOT NULL DEFAULT 0,
  tasks_completed INTEGER NOT NULL DEFAULT 0,
  tasks_failed INTEGER NOT NULL DEFAULT 0,
  last_heartbeat TIMESTAMPTZ,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agent_metrics_slug ON agent_metrics(agent_slug);
CREATE INDEX IF NOT EXISTS idx_agent_metrics_recorded ON agent_metrics(recorded_at DESC);

-- Agent memory tables (one per agent, auto-created by ZeroClaw)
-- These are listed here for reference but ZeroClaw creates them automatically:
-- agent_memory_ops_commander
-- agent_memory_marketing_command
-- agent_memory_sales_command
-- agent_memory_estimating_command
-- agent_memory_precon_command
-- agent_memory_pm_command
-- agent_memory_accounting_command
-- agent_memory_document_command
-- agent_memory_permit_command
-- agent_memory_hr_command
-- agent_memory_investor_command

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_agent_tasks_updated_at
  BEFORE UPDATE ON agent_tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row-level security (Supabase)
ALTER TABLE agent_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_metrics ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (agents connect via service role)
CREATE POLICY "Service role full access on agent_tasks"
  ON agent_tasks FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access on agent_logs"
  ON agent_logs FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access on agent_metrics"
  ON agent_metrics FOR ALL
  USING (auth.role() = 'service_role');

-- Allow admins to read
CREATE POLICY "Admins can read agent_tasks"
  ON agent_tasks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Admins can read agent_logs"
  ON agent_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Admins can read agent_metrics"
  ON agent_metrics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_role IN ('admin', 'manager')
    )
  );
