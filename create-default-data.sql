-- Create default board and columns for testing
-- Replace 'your-user-id' with your actual user ID from auth.users table

-- First, get your user ID from the auth.users table
-- You can find this in Supabase Dashboard → Authentication → Users

-- Insert default board
INSERT INTO public.boards (id, name, description, user_id, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    'Personal',
    'My personal kanban board',
    'your-user-id', -- Replace this with your actual user ID
    NOW(),
    NOW()
);

-- Get the board ID we just created and insert default columns
DO $$
DECLARE
    board_id UUID;
BEGIN
    SELECT id INTO board_id FROM public.boards WHERE name = 'Personal' LIMIT 1;

    -- Insert default columns
    INSERT INTO public.columns (id, board_id, name, position, color, created_at)
    VALUES
        (gen_random_uuid(), board_id, 'To Do', 0, '#6366f1', NOW()),
        (gen_random_uuid(), board_id, 'In Progress', 1, '#f59e0b', NOW()),
        (gen_random_uuid(), board_id, 'Done', 2, '#10b981', NOW());
END $$;