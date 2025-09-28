-- Kakeibo Personal Finance App Database Initialization Script for Malaysia

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User table (using Supabase Auth)
-- auth.users table is provided by Supabase, we create user profile table
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  currency TEXT DEFAULT 'MYR',
  timezone TEXT DEFAULT 'Asia/Kuala_Lumpur',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Accounts table
CREATE TABLE accounts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('bank', 'maybank2u', 'cimb_clicks', 'boost', 'grabpay', 'touch_n_go', 'cash', 'credit_card', 'other')) NOT NULL,
  balance DECIMAL(15,2) DEFAULT 0,
  currency TEXT DEFAULT 'MYR',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table
CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('income', 'expense')) NOT NULL,
  icon TEXT,
  color TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transaction records table
CREATE TABLE transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  account_id UUID REFERENCES accounts(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  type TEXT CHECK (type IN ('income', 'expense', 'transfer')) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  person TEXT, -- Filter by person field
  receipt_image TEXT,
  tags TEXT[],
  is_recurring BOOLEAN DEFAULT false,
  recurring_rule JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Budget table
CREATE TABLE budgets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  period TEXT CHECK (period IN ('weekly', 'monthly', 'yearly')) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  spent DECIMAL(15,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reminders table
CREATE TABLE reminders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('bill', 'budget', 'goal')) NOT NULL,
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  amount DECIMAL(15,2),
  is_completed BOOLEAN DEFAULT false,
  is_recurring BOOLEAN DEFAULT false,
  recurring_rule JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Savings goals table
CREATE TABLE savings_goals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  target_amount DECIMAL(15,2) NOT NULL,
  current_amount DECIMAL(15,2) DEFAULT 0,
  target_date DATE,
  description TEXT,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_accounts_user_id ON accounts(user_id);
CREATE INDEX idx_categories_user_id ON categories(user_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_account_id ON transactions(account_id);
CREATE INDEX idx_transactions_category_id ON transactions(category_id);
CREATE INDEX idx_budgets_user_id ON budgets(user_id);
CREATE INDEX idx_reminders_user_id ON reminders(user_id);
CREATE INDEX idx_reminders_due_date ON reminders(due_date);
CREATE INDEX idx_savings_goals_user_id ON savings_goals(user_id);

-- Create update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add update timestamp triggers for all tables
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON budgets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reminders_updated_at BEFORE UPDATE ON reminders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_savings_goals_updated_at BEFORE UPDATE ON savings_goals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to insert default categories
CREATE OR REPLACE FUNCTION create_default_categories(user_uuid UUID)
RETURNS VOID AS $$
BEGIN
  -- Income categories
  INSERT INTO categories (user_id, name, type, icon, color) VALUES
    (user_uuid, 'Salary', 'income', '💼', '#10B981'),
    (user_uuid, 'Bonus', 'income', '🎁', '#059669'),
    (user_uuid, 'Side Business', 'income', '💻', '#047857'),
    (user_uuid, 'Investment Returns', 'income', '📈', '#065F46'),
    (user_uuid, 'Freelance', 'income', '🎯', '#064E3B'),
    (user_uuid, 'Other Income', 'income', '💰', '#10B981');

  -- Expense categories
  INSERT INTO categories (user_id, name, type, icon, color) VALUES
    (user_uuid, 'Food & Dining', 'expense', '🍽️', '#EF4444'),
    (user_uuid, 'Mamak', 'expense', '🍛', '#DC2626'),
    (user_uuid, 'Groceries', 'expense', '🛒', '#B91C1C'),
    (user_uuid, 'Transportation', 'expense', '🚗', '#F97316'),
    (user_uuid, 'Petrol', 'expense', '⛽', '#EA580C'),
    (user_uuid, 'Grab/Taxi', 'expense', '🚖', '#DC2626'),
    (user_uuid, 'LRT/MRT', 'expense', '🚊', '#C2410C'),
    (user_uuid, 'Shopping', 'expense', '🛍️', '#8B5CF6'),
    (user_uuid, 'Entertainment', 'expense', '🎮', '#EC4899'),
    (user_uuid, 'Cinema', 'expense', '🎬', '#DB2777'),
    (user_uuid, 'Healthcare', 'expense', '🏥', '#06B6D4'),
    (user_uuid, 'Education', 'expense', '📚', '#3B82F6'),
    (user_uuid, 'Rent', 'expense', '🏠', '#6366F1'),
    (user_uuid, 'Utilities', 'expense', '💡', '#84CC16'),
    (user_uuid, 'TNB (Electricity)', 'expense', '⚡', '#65A30D'),
    (user_uuid, 'Water Bill', 'expense', '💧', '#0891B2'),
    (user_uuid, 'Internet/Phone', 'expense', '📱', '#22C55E'),
    (user_uuid, 'Insurance', 'expense', '🛡️', '#059669'),
    (user_uuid, 'Personal Care', 'expense', '💄', '#D946EF'),
    (user_uuid, 'Travel', 'expense', '✈️', '#0EA5E9'),
    (user_uuid, 'Other Expenses', 'expense', '📝', '#6B7280');
END;
$$ LANGUAGE plpgsql;

-- Function to insert default accounts
CREATE OR REPLACE FUNCTION create_default_accounts(user_uuid UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO accounts (user_id, name, type, balance) VALUES
    (user_uuid, 'Cash', 'cash', 0),
    (user_uuid, 'Maybank', 'bank', 0),
    (user_uuid, 'CIMB Bank', 'bank', 0),
    (user_uuid, 'Public Bank', 'bank', 0),
    (user_uuid, 'Touch ''n Go eWallet', 'touch_n_go', 0),
    (user_uuid, 'Boost', 'boost', 0),
    (user_uuid, 'GrabPay', 'grabpay', 0),
    (user_uuid, 'Credit Card', 'credit_card', 0);
END;
$$ LANGUAGE plpgsql;
