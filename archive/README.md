# Archive Directory

This directory contains files that were moved from the main codebase during cleanup and organization.

## Legacy Files (`legacy-files/`)

### `supabase.ts` (moved from `src/lib/`)
- **Reason for archiving**: Redundant wrapper file
- **Description**: This was a re-export wrapper around `supabase-client.ts` that provided backward compatibility
- **Status**: All imports now use `supabase-client.ts` directly
- **Date moved**: September 26, 2025

### `settings-page.tsx` (moved from `src/app/settings/`)
- **Reason for archiving**: Used outdated auth structure
- **Description**: Settings page that used deprecated `useAuth` hook instead of `useAuthContext`
- **Status**: Functionality can be integrated into dashboard or profile pages
- **Date moved**: September 26, 2025

## Files Previously Removed
- `src/app/demo/` - Demo page with mock data (removed earlier)
- `src/app/test-db/` - Database testing page (removed earlier)
- `src/lib/database-test.ts` - Database testing utilities (removed earlier)

## Cleanup Summary
- ✅ Removed redundant Supabase wrapper
- ✅ Cleaned up demo and test files
- ✅ Removed outdated settings page
- ✅ Streamlined authentication structure
- ✅ Consolidated to use `useAuthContext` consistently

The codebase is now cleaner and more maintainable with a consistent architecture.