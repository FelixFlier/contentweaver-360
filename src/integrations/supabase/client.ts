// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://zxhziuydweffrcwhoodd.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4aHppdXlkd2VmZnJjd2hvb2RkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0MjMxMzQsImV4cCI6MjA1Njk5OTEzNH0.CaW9Xkq6P2SLP1FrXsOpAoCqmybKchX5P3WzsEpSQ9U";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);