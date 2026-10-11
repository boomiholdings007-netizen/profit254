-- Offline setup for the owner's external Supabase project. Not deployed or connected.
-- Run once on a fresh project. No real trades, wallets or payments are enabled by this file.
begin;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  phone text check (phone ~ '^\+254[17][0-9]{8}$'),
  username text not null unique check (username ~ '^[a-z0-9_]{3,24}$'),
  currency text not null default 'kes' check (currency in ('kes','usd','eur')),
  balance numeric(18,2) not null default 0 check (balance >= 0),
  created_at timestamptz not null default now()
);
revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy own_profile on public.profiles for select to authenticated using ((select auth.uid()) = id);

create table public.trades (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete restrict,
  asset text not null check (asset in ('btc','eth','gold','scom','usd/kes')),
  direction text not null check (direction in ('up','down')),
  stake numeric(18,2) not null check (stake > 0),
  entry_price numeric(24,8) not null check (entry_price > 0),
  target_price numeric(24,8) not null check (target_price > 0),
  close_price numeric(24,8) check (close_price > 0),
  multiplier numeric(12,6) not null check (multiplier >= 1),
  payout numeric(18,2) check (payout >= 0),
  won boolean,
  status text not null default 'open' check (status in ('open','closed','void')),
  balance_after numeric(18,2) check (balance_after >= 0),
  round_start timestamptz not null,
  created_at timestamptz not null default now(),
  settled_at timestamptz,
  check ((status = 'open' and payout is null and won is null and settled_at is null)
      or (status = 'closed' and close_price is not null and payout is not null and won is not null and settled_at is not null)
      or (status = 'void' and payout = stake and settled_at is not null))
);
revoke all on public.trades from anon, authenticated;
grant select on public.trades to authenticated;
grant all on public.trades to service_role;
alter table public.trades enable row level security;
create policy own_trades on public.trades for select to authenticated using ((select auth.uid()) = user_id);
create index trades_user_created on public.trades(user_id, created_at desc);

create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete restrict,
  type text not null check (type in ('deposit','withdrawal')),
  amount numeric(18,2) not null check (amount > 0),
  fee numeric(18,2) not null default 0 check (fee >= 0),
  status text not null default 'pending' check (status in ('pending','processing','completed','failed','reversed')),
  palpluss_ref text unique,
  idempotency_key uuid not null unique default gen_random_uuid(),
  created_at timestamptz not null default now(),
  completed_at timestamptz
);
revoke all on public.transactions from anon, authenticated;
grant select on public.transactions to authenticated;
grant all on public.transactions to service_role;
alter table public.transactions enable row level security;
create policy own_transactions on public.transactions for select to authenticated using ((select auth.uid()) = user_id);
create index transactions_user_created on public.transactions(user_id, created_at desc);

commit;
-- Before enabling money: implement authenticated server-side operations, atomic wallet
-- debits/settlement, authoritative shared round prices, and verified, idempotent Palpluss
-- webhooks. Never expose service-role keys or accept client-calculated payouts/balances.