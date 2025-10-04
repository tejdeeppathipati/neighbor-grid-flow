-- Temporarily allow anon role to write to simulation tables
-- This is a temporary solution until we get the service key

-- Allow anon to insert/update tick_state
CREATE POLICY "Allow anon to write tick_state" ON tick_state
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Allow anon to insert/update tick_state_community  
CREATE POLICY "Allow anon to write tick_state_community" ON tick_state_community
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Allow anon to insert/update simulation_clock
CREATE POLICY "Allow anon to write simulation_clock" ON simulation_clock
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);
