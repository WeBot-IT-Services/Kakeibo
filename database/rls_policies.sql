-- Kakeibo 应用行级安全策略 (RLS Policies)
-- 在 Supabase SQL 编辑器中执行此文件

-- 启用所有表的行级安全
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE savings_goals ENABLE ROW LEVEL SECURITY;

-- 用户配置表策略
CREATE POLICY "Users can view own profile" ON user_profiles 
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles 
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles 
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 账户表策略
CREATE POLICY "Users can view own accounts" ON accounts 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own accounts" ON accounts 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own accounts" ON accounts 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own accounts" ON accounts 
  FOR DELETE USING (auth.uid() = user_id);

-- 分类表策略
CREATE POLICY "Users can view own categories" ON categories 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own categories" ON categories 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own categories" ON categories 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own categories" ON categories 
  FOR DELETE USING (auth.uid() = user_id);

-- 交易表策略
CREATE POLICY "Users can view own transactions" ON transactions 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions" ON transactions 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions" ON transactions 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions" ON transactions 
  FOR DELETE USING (auth.uid() = user_id);

-- 预算表策略
CREATE POLICY "Users can view own budgets" ON budgets 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own budgets" ON budgets 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own budgets" ON budgets 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own budgets" ON budgets 
  FOR DELETE USING (auth.uid() = user_id);

-- 提醒表策略
CREATE POLICY "Users can view own reminders" ON reminders 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reminders" ON reminders 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reminders" ON reminders 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reminders" ON reminders 
  FOR DELETE USING (auth.uid() = user_id);

-- 储蓄目标表策略
CREATE POLICY "Users can view own savings goals" ON savings_goals 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own savings goals" ON savings_goals 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own savings goals" ON savings_goals 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own savings goals" ON savings_goals 
  FOR DELETE USING (auth.uid() = user_id);
