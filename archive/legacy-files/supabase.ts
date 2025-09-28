// 重新导出 supabase 客户端，保持向后兼容
export {
  supabase,
  isSupabaseConfigured,
  getSupabaseConfig,
  getSupabaseClient,
  withSupabase
} from './supabase-client'

// 为了向后兼容，保留原有的导出
import { supabase as supabaseClient } from './supabase-client'
export { supabaseClient as createClientComponentClient }
export { supabaseClient as createServerComponentClient }
