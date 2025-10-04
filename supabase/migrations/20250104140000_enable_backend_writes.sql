-- Enable backend writes by allowing service role to write to tables
-- This migration allows the backend to write data to the database

-- Allow service role to insert/update tick_state
ALTER TABLE tick_state ENABLE ROW LEVEL SECURITY;

-- Create policy for service role to write tick_state
CREATE POLICY "Allow service role to write tick_state" ON tick_state
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow service role to insert/update tick_state_community  
ALTER TABLE tick_state_community ENABLE ROW LEVEL SECURITY;

-- Create policy for service role to write tick_state_community
CREATE POLICY "Allow service role to write tick_state_community" ON tick_state_community
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow service role to insert/update simulation_clock
ALTER TABLE simulation_clock ENABLE ROW LEVEL SECURITY;

-- Create policy for service role to write simulation_clock
CREATE POLICY "Allow service role to write simulation_clock" ON simulation_clock
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Also allow anon role to read data (for frontend)
CREATE POLICY "Allow anon to read tick_state" ON tick_state
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anon to read tick_state_community" ON tick_state_community
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anon to read simulation_clock" ON simulation_clock
  FOR SELECT
  TO anon
  USING (true);
