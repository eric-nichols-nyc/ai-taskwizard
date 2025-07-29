-- Recreate all tables for the Kanban board application (without kanban_cards)

-- Create boards table
CREATE TABLE IF NOT EXISTS public.boards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create columns table
CREATE TABLE IF NOT EXISTS public.columns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    board_id UUID REFERENCES public.boards(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    position INTEGER NOT NULL,
    color TEXT DEFAULT '#6366f1',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    column_id UUID REFERENCES public.columns(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    position INTEGER NOT NULL,
    priority TEXT DEFAULT 'Medium',
    due_date DATE DEFAULT CURRENT_DATE,
    user_id UUID REFERENCES auth.users(id) ON DELETE NO ACTION,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    status TEXT DEFAULT 'todo'
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_boards_user_id ON public.boards(user_id);
CREATE INDEX IF NOT EXISTS idx_columns_board_id ON public.columns(board_id);
CREATE INDEX IF NOT EXISTS idx_tasks_column_id ON public.tasks(column_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON public.tasks(user_id);

-- Enable Row Level Security
ALTER TABLE public.boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.columns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for boards
CREATE POLICY "Users can view their own boards" ON public.boards
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own boards" ON public.boards
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own boards" ON public.boards
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own boards" ON public.boards
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for columns
CREATE POLICY "Users can view columns of their boards" ON public.columns
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.boards
            WHERE boards.id = columns.board_id
            AND boards.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert columns in their boards" ON public.columns
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.boards
            WHERE boards.id = columns.board_id
            AND boards.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update columns in their boards" ON public.columns
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.boards
            WHERE boards.id = columns.board_id
            AND boards.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete columns in their boards" ON public.columns
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.boards
            WHERE boards.id = columns.board_id
            AND boards.user_id = auth.uid()
        )
    );

-- Create RLS policies for tasks
CREATE POLICY "Users can view their own tasks" ON public.tasks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tasks" ON public.tasks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks" ON public.tasks
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks" ON public.tasks
    FOR DELETE USING (auth.uid() = user_id);