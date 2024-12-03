-- Create transaction functions
CREATE OR REPLACE FUNCTION begin_transaction()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Start a new transaction
    -- This is a no-op since we're already in a transaction,
    -- but it's here for completeness
    NULL;
END;
$$;

CREATE OR REPLACE FUNCTION commit_transaction()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Commit the current transaction
    -- This is a no-op since the transaction will be committed automatically,
    -- but it's here for completeness
    NULL;
END;
$$;

CREATE OR REPLACE FUNCTION rollback_transaction()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Rollback the current transaction
    ROLLBACK;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION begin_transaction() TO authenticated;
GRANT EXECUTE ON FUNCTION commit_transaction() TO authenticated;
GRANT EXECUTE ON FUNCTION rollback_transaction() TO authenticated;
