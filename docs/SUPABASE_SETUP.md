# Supabase 数据库配置指南

## 步骤 1: 创建 Supabase 项目

1. 访问 [Supabase](https://supabase.com) 并注册/登录账户
2. 点击 "New Project" 创建新项目
3. 填写项目信息：
   - **Name**: Kakeibo
   - **Database Password**: 设置一个强密码（请记住此密码）
   - **Region**: 选择离你最近的区域（如 Singapore 或 Tokyo）
4. 点击 "Create new project" 并等待项目创建完成（约2-3分钟）

## 步骤 2: 获取 API 密钥

项目创建完成后：
1. 在项目仪表板中，点击左侧菜单的 "Settings" → "API"
2. 复制以下信息：
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon public key**: `eyJ...` (很长的字符串)
   - **service_role key**: `eyJ...` (很长的字符串，保密使用)

## 步骤 3: 配置环境变量

1. 在项目根目录创建 `.env.local` 文件
2. 添加以下内容（替换为你的实际值）：

```env
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# 其他配置
NEXTAUTH_SECRET=your_random_secret_here
NEXTAUTH_URL=http://localhost:3000
```

## 步骤 4: 执行数据库初始化脚本

1. 在 Supabase 项目中，点击左侧菜单的 "SQL Editor"
2. 点击 "New query" 创建新查询
3. 复制 `database/init.sql` 文件的全部内容
4. 粘贴到 SQL 编辑器中
5. 点击 "Run" 执行脚本
6. 确认所有表和函数都创建成功

## 步骤 5: 配置行级安全策略 (RLS)

### 5.1 启用 RLS
在 SQL 编辑器中执行以下命令为所有表启用 RLS：

```sql
-- 启用所有表的行级安全
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE savings_goals ENABLE ROW LEVEL SECURITY;
```

### 5.2 创建安全策略
继续在 SQL 编辑器中执行以下策略：

```sql
-- 用户配置表策略
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- 账户表策略
CREATE POLICY "Users can manage own accounts" ON accounts FOR ALL USING (auth.uid() = user_id);

-- 分类表策略
CREATE POLICY "Users can manage own categories" ON categories FOR ALL USING (auth.uid() = user_id);

-- 交易表策略
CREATE POLICY "Users can manage own transactions" ON transactions FOR ALL USING (auth.uid() = user_id);

-- 预算表策略
CREATE POLICY "Users can manage own budgets" ON budgets FOR ALL USING (auth.uid() = user_id);

-- 提醒表策略
CREATE POLICY "Users can manage own reminders" ON reminders FOR ALL USING (auth.uid() = user_id);

-- 储蓄目标表策略
CREATE POLICY "Users can manage own savings goals" ON savings_goals FOR ALL USING (auth.uid() = user_id);
```

## 步骤 6: 验证配置

1. 在 Supabase 项目中，点击 "Table Editor"
2. 确认所有表都已创建：
   - user_profiles
   - accounts
   - categories
   - transactions
   - budgets
   - reminders
   - savings_goals

3. 点击 "Authentication" → "Settings"
4. 确认以下设置：
   - **Enable email confirmations**: 可以关闭（开发阶段）
   - **Enable phone confirmations**: 关闭
   - **Enable custom SMTP**: 可选

## 步骤 7: 测试连接

配置完成后，重启开发服务器：
```bash
npm run dev
```

访问 http://localhost:3000/dashboard，如果配置正确，应用将能够连接到 Supabase 数据库。

## 常见问题

### Q: 无法连接到数据库
A: 检查 `.env.local` 文件中的 URL 和密钥是否正确，确保没有多余的空格。

### Q: RLS 策略错误
A: 确保所有策略都正确执行，可以在 "Authentication" → "Policies" 中查看已创建的策略。

### Q: 表创建失败
A: 检查 SQL 脚本是否完整执行，可以分段执行脚本。

## 安全注意事项

1. **永远不要**将 `service_role_key` 暴露在客户端代码中
2. 确保 `.env.local` 文件已添加到 `.gitignore`
3. 在生产环境中使用强密码和 HTTPS
4. 定期更新 API 密钥
