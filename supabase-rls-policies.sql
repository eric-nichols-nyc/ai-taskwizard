-- Enable RLS on all tables
ALTER TABLE boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE columns ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE kanban_cards ENABLE ROW LEVEL SECURITY;

-- Boards policies
CREATE POLICY "Users can view their own boards" ON boards
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own boards" ON boards
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own boards" ON boards
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own boards" ON boards
    FOR DELETE USING (auth.uid() = user_id);

-- Columns policies
CREATE POLICY "Users can view columns of their boards" ON columns
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM boards
            WHERE boards.id = columns.board_id
            AND boards.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert columns in their boards" ON columns
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM boards
            WHERE boards.id = columns.board_id
            AND boards.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update columns in their boards" ON columns
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM boards
            WHERE boards.id = columns.board_id
            AND boards.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete columns in their boards" ON columns
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM boards
            WHERE boards.id = columns.board_id
            AND boards.user_id = auth.uid()
        )
    );

-- Tasks policies
CREATE POLICY "Users can view their own tasks" ON tasks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tasks" ON tasks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks" ON tasks
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks" ON tasks
    FOR DELETE USING (auth.uid() = user_id);

-- Kanban cards policies (if you're using them)
CREATE POLICY "Users can view kanban cards for their tasks" ON kanban_cards
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM tasks
            WHERE tasks.id = kanban_cards.task_id
            AND tasks.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert kanban cards for their tasks" ON kanban_cards
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM tasks
            WHERE tasks.id = kanban_cards.task_id
            AND tasks.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update kanban cards for their tasks" ON kanban_cards
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM tasks
            WHERE tasks.id = kanban_cards.task_id
            AND tasks.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete kanban cards for their tasks" ON kanban_cards
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM tasks
            WHERE tasks.id = kanban_cards.task_id
            AND tasks.user_id = auth.uid()
        )
    );