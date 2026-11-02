// Public client settings. The anon key is a public key by design; the database
// only lets it call waitlist_join() (migration 045). Never put a service key here.
export const CONFIG = {
  supabaseUrl: 'https://eniiswlhqgpowdhqslyz.supabase.co',
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuaWlzd2xocWdwb3dkaHFzbHl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMyNzk1MDEsImV4cCI6MjEwODg1NTUwMX0.5IIWZssitz5veanoiU07jgc1nxgV2wef2AfQG4LyKuo',
  siteUrl: 'https://quegan.github.io/wtm412/',
};
