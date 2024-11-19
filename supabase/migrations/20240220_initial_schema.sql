-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user_data table
CREATE TABLE user_data (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    teaching_level TEXT CHECK (teaching_level IN ('maternelle', 'elementaire', 'college', 'lycee')),
    is_beta_tester BOOLEAN DEFAULT false,
    preferences JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create tools table
CREATE TABLE tools (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT valid_slug CHECK (slug ~ '^[a-z0-9-]+$')
);

-- Create QCM table
CREATE TABLE qcm (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users NOT NULL,
    title TEXT NOT NULL,
    questions JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create sequences table
CREATE TABLE sequences (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users NOT NULL,
    title TEXT NOT NULL,
    level TEXT NOT NULL,
    subject TEXT NOT NULL,
    objectives TEXT[] NOT NULL,
    sessions JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create vocabulary_lists table
CREATE TABLE vocabulary_lists (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users NOT NULL,
    title TEXT NOT NULL,
    level TEXT NOT NULL,
    words JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create daily_metrics table
CREATE TABLE daily_metrics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    date DATE DEFAULT CURRENT_DATE,
    tool_id UUID REFERENCES tools NOT NULL,
    uses_count INTEGER DEFAULT 0,
    unique_users INTEGER DEFAULT 0,
    CONSTRAINT unique_daily_tool_metric UNIQUE (date, tool_id)
);

-- Enable Row Level Security
ALTER TABLE user_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE qcm ENABLE ROW LEVEL SECURITY;
ALTER TABLE sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocabulary_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_metrics ENABLE ROW LEVEL SECURITY;

-- Create policies
-- user_data policies
CREATE POLICY "Users can view own data" ON user_data
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON user_data
    FOR UPDATE USING (auth.uid() = id);

-- tools policies
CREATE POLICY "Anyone can view active tools" ON tools
    FOR SELECT USING (is_active = true);

-- qcm policies
CREATE POLICY "Users can view own QCM" ON qcm
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create QCM" ON qcm
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own QCM" ON qcm
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own QCM" ON qcm
    FOR DELETE USING (auth.uid() = user_id);

-- sequences policies
CREATE POLICY "Users can view own sequences" ON sequences
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create sequences" ON sequences
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own sequences" ON sequences
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own sequences" ON sequences
    FOR DELETE USING (auth.uid() = user_id);

-- vocabulary_lists policies
CREATE POLICY "Users can view own vocab lists" ON vocabulary_lists
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create vocab lists" ON vocabulary_lists
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own vocab lists" ON vocabulary_lists
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own vocab lists" ON vocabulary_lists
    FOR DELETE USING (auth.uid() = user_id);

-- daily_metrics policies
CREATE POLICY "Beta testers can view metrics" ON daily_metrics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_data
            WHERE id = auth.uid()
            AND is_beta_tester = true
        )
    );

-- Create function to update metrics
CREATE OR REPLACE FUNCTION update_tool_metrics(p_tool_id UUID, p_date DATE)
RETURNS void AS $$
BEGIN
    INSERT INTO daily_metrics (date, tool_id, uses_count, unique_users)
    VALUES (
        p_date,
        p_tool_id,
        1,
        (SELECT COUNT(DISTINCT user_id) 
         FROM qcm 
         WHERE DATE(created_at) = p_date)
    )
    ON CONFLICT (date, tool_id)
    DO UPDATE SET 
        uses_count = daily_metrics.uses_count + 1,
        unique_users = (
            SELECT COUNT(DISTINCT user_id)
            FROM qcm
            WHERE DATE(created_at) = p_date
        );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert default tools
INSERT INTO tools (name, slug, description) VALUES
    ('Générateur de QCM', 'qcm-generator', 'Création de questionnaires à choix multiples'),
    ('Générateur de Vocabulaire', 'vocab-generator', 'Création de listes de vocabulaire personnalisées'),
    ('Assistant Progression', 'progression-helper', 'Aide à la création de progressions pédagogiques'),
    ('Assistant Différenciation', 'differenciation-helper', 'Adaptation des contenus aux besoins des élèves');

-- Create trigger function for user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_data (id, email)
    VALUES (new.id, new.email);
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();