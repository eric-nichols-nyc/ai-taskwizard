-- Insert default board for testing
-- Replace 'your-user-id' with the actual user ID from your auth.users table
INSERT INTO boards (id, name, description, user_id, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    'Personal',
    'My personal kanban board',
    'your-user-id', -- Replace this with actual user ID
    NOW(),
    NOW()
);

-- Get the board ID we just created
DO $$
DECLARE
    board_id UUID;
BEGIN
    SELECT id INTO board_id FROM boards WHERE name = 'Personal' LIMIT 1;

    -- Insert default columns
    INSERT INTO columns (id, board_id, name, position, color, created_at)
    VALUES
        (gen_random_uuid(), board_id, 'To Do', 0, '#6366f1', NOW()),
        (gen_random_uuid(), board_id, 'In Progress', 1, '#f59e0b', NOW()),
        (gen_random_uuid(), board_id, 'Done', 2, '#10b981', NOW());
END $$;