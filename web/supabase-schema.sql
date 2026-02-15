-- =============================================================================
-- BrixUp Supabase Schema
-- =============================================================================
-- Run this in your Supabase SQL Editor to set up all tables.
-- Go to: https://supabase.com/dashboard → Your Project → SQL Editor
-- =============================================================================

-- Profiles (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL DEFAULT '',
  phone TEXT,
  avatar_url TEXT,
  user_role TEXT NOT NULL DEFAULT 'investor' CHECK (user_role IN ('investor', 'builder', 'dealmaker', 'admin', 'manager')),
  wallet_address TEXT,
  kyc_status TEXT NOT NULL DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'verified', 'rejected')),
  email_notifications BOOLEAN NOT NULL DEFAULT true,
  sms_notifications BOOLEAN NOT NULL DEFAULT true,
  push_notifications BOOLEAN NOT NULL DEFAULT false,
  language TEXT NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'es')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Deals
CREATE TABLE IF NOT EXISTS public.deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip TEXT DEFAULT '',
  property_type TEXT NOT NULL CHECK (property_type IN ('Flip', 'New Build', 'Value-Add', 'Wholesale', 'Land')),
  status TEXT NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'Funding', 'Funded', 'Active', 'Completed')),
  source TEXT DEFAULT 'BrixUp',
  asking_price NUMERIC NOT NULL,
  rehab_budget NUMERIC NOT NULL,
  arv NUMERIC NOT NULL,
  total_capital_needed NUMERIC NOT NULL,
  funded_amount NUMERIC NOT NULL DEFAULT 0,
  projected_roi NUMERIC,
  projected_timeline TEXT,
  investor_interest_rate NUMERIC DEFAULT 10,
  beds INTEGER DEFAULT 0,
  baths NUMERIC DEFAULT 0,
  sqft INTEGER DEFAULT 0,
  year_built INTEGER,
  lot_size TEXT,
  description TEXT,
  dealmaker_id UUID REFERENCES public.profiles(id),
  gc_id UUID REFERENCES public.profiles(id),
  listed_date TIMESTAMPTZ DEFAULT now(),
  funding_deadline TIMESTAMPTZ,
  est_completion TEXT,
  investor_count INTEGER DEFAULT 0,
  min_investment NUMERIC DEFAULT 500,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Investments
CREATE TABLE IF NOT EXISTS public.investments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_id UUID NOT NULL REFERENCES public.profiles(id),
  deal_id UUID NOT NULL REFERENCES public.deals(id),
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Contractors
CREATE TABLE IF NOT EXISTS public.contractors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  primary_trade TEXT NOT NULL,
  years_experience INTEGER DEFAULT 0,
  license_number TEXT,
  insurance_provider TEXT,
  brix_score INTEGER DEFAULT 500,
  location TEXT,
  w9_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Transactions
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  type TEXT NOT NULL CHECK (type IN ('investment', 'yield', 'staking_reward', 'conversion', 'received', 'send', 'stake', 'unstake', 'buy')),
  amount NUMERIC NOT NULL,
  description TEXT,
  from_address TEXT,
  to_address TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed')),
  tx_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- Row Level Security (RLS)
-- =============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Deals: everyone can read, only dealmakers can create
CREATE POLICY "Anyone can view deals" ON public.deals FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create deals" ON public.deals FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Dealmakers can update their deals" ON public.deals FOR UPDATE USING (auth.uid() = dealmaker_id);

-- Investments: users can read their own, anyone authenticated can create
CREATE POLICY "Users can view own investments" ON public.investments FOR SELECT USING (auth.uid() = investor_id);
CREATE POLICY "Users can create investments" ON public.investments FOR INSERT WITH CHECK (auth.uid() = investor_id);

-- Contractors: users can manage their own
CREATE POLICY "Users can view own contractor profile" ON public.contractors FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create contractor profile" ON public.contractors FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update contractor profile" ON public.contractors FOR UPDATE USING (auth.uid() = user_id);

-- Transactions: users can read their own
CREATE POLICY "Users can view own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can create transactions" ON public.transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =============================================================================
-- Auto-create profile on signup (trigger)
-- =============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, user_role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'user_role', 'investor')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================================================
-- Admin Account Setup
-- =============================================================================
-- Run this AFTER signing up with your admin email to promote to admin role.
-- Replace the email below with your admin email address.
--
-- UPDATE public.profiles
--   SET user_role = 'admin', kyc_status = 'verified'
--   WHERE email = 'mph.cordero@gmail.com';
--
-- If you need to update the CHECK constraint on an existing database:
-- ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_user_role_check;
-- ALTER TABLE public.profiles ADD CONSTRAINT profiles_user_role_check
--   CHECK (user_role IN ('investor', 'builder', 'dealmaker', 'admin', 'manager'));
--
-- ALTER TABLE public.transactions DROP CONSTRAINT IF EXISTS transactions_type_check;
-- ALTER TABLE public.transactions ADD CONSTRAINT transactions_type_check
--   CHECK (type IN ('investment', 'yield', 'staking_reward', 'conversion', 'received', 'send', 'stake', 'unstake', 'buy'));
-- =============================================================================
