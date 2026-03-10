
-- App roles enum
CREATE TYPE public.app_role AS ENUM ('super_admin', 'central_admin', 'branch_manager', 'cashier', 'sales_executive', 'goldsmith', 'accountant', 'inventory_manager');

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Get user role function
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT role FROM public.user_roles WHERE user_id = _user_id LIMIT 1
$$;

-- RLS for user_roles - users can view their own role, admins can manage
CREATE POLICY "Users can view own role" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'super_admin'));

-- Branches table
CREATE TABLE public.branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  address TEXT,
  city TEXT NOT NULL DEFAULT 'Bangalore',
  phone TEXT,
  manager_id UUID REFERENCES auth.users(id),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view branches" ON public.branches FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage branches" ON public.branches FOR ALL USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'central_admin'));

-- Gold rates table
CREATE TABLE public.gold_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rate_per_gram NUMERIC(12,2) NOT NULL,
  karat INTEGER NOT NULL DEFAULT 24,
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.gold_rates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view rates" ON public.gold_rates FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can update rates" ON public.gold_rates FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'central_admin'));

-- Audit log table
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  module TEXT NOT NULL,
  details JSONB,
  ip_address TEXT DEFAULT '192.168.1.' || floor(random() * 255)::text,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view audit logs" ON public.audit_logs FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'central_admin'));
CREATE POLICY "Authenticated users can insert audit logs" ON public.audit_logs FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_branches_updated_at BEFORE UPDATE ON public.branches FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed 5 Bangalore branches
INSERT INTO public.branches (name, code, address, phone) VALUES
  ('Kalyan Jewellers - Jayanagar', 'KJ-JAY', '4th Block, Jayanagar, Bangalore - 560041', '+91 80 2653 1234'),
  ('Kalyan Jewellers - Rajajinagar', 'KJ-RAJ', 'Rajajinagar Main Road, Bangalore - 560010', '+91 80 2338 5678'),
  ('Kalyan Jewellers - Marathahalli', 'KJ-MAR', 'Outer Ring Road, Marathahalli, Bangalore - 560037', '+91 80 2572 9012'),
  ('Kalyan Jewellers - Whitefield', 'KJ-WHT', 'ITPL Main Road, Whitefield, Bangalore - 560066', '+91 80 2845 3456'),
  ('Kalyan Jewellers - Koramangala', 'KJ-KOR', '80 Feet Road, Koramangala, Bangalore - 560034', '+91 80 2553 7890');

-- Seed initial gold rate
INSERT INTO public.gold_rates (rate_per_gram, karat) VALUES (7250.00, 24), (6650.00, 22), (5550.00, 18);
