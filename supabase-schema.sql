create table if not exists public.users (
  id text primary key,
  name text not null,
  email text not null unique,
  role text not null check (role in ('admin', 'student')),
  salt text not null,
  password_hash text not null,
  client_id bigint,
  created_at timestamptz not null default now()
);

create table if not exists public.clients (
  id bigint primary key,
  coach_id text not null references public.users(id) on delete cascade,
  user_id text references public.users(id) on delete set null,
  name text not null,
  goal text not null default 'hipertrofia',
  level text not null default 'iniciante',
  adherence integer not null default 100,
  risk text not null default 'ok',
  next_action text not null default 'Preencher avaliacao',
  profile jsonb not null default '{}'::jsonb,
  plan jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.checkins (
  id bigint generated always as identity primary key,
  client_id bigint not null references public.clients(id) on delete cascade,
  energy integer not null,
  sleep integer not null,
  soreness integer not null,
  readiness integer not null,
  note text,
  created_at timestamptz not null default now()
);

insert into public.users (id, name, email, role, salt, password_hash, client_id)
values
  ('u_admin', 'Marc Ribeiro', 'admin@treinai.app', 'admin', 'treinai_admin_salt', 'ed70ba575b2dc24b39f7ae10309e3c889478f25e1f25cd869f6139aacc2ab041', null),
  ('u_marina', 'Marina Costa', 'marina@treinai.app', 'student', 'treinai_student_salt', 'a8f9c7d0cdb83a494c2eb30df7f065753568c76d48acf89c5ecb9f260b201cba', 1)
on conflict (id) do update set
  name = excluded.name,
  email = excluded.email,
  role = excluded.role,
  salt = excluded.salt,
  password_hash = excluded.password_hash,
  client_id = excluded.client_id;

insert into public.clients (id, coach_id, user_id, name, goal, level, adherence, risk, next_action, profile, plan)
values (
  1,
  'u_admin',
  'u_marina',
  'Marina Costa',
  'hipertrofia',
  'intermediario',
  86,
  'ok',
  'Aumentar carga',
  '{
    "age": 32,
    "weight": 68,
    "height": 166,
    "sex": "feminino",
    "days": 4,
    "sessionDuration": 55,
    "equipment": "academia",
    "limitations": "joelho sensivel",
    "injuries": "tendinite patelar leve em 2024",
    "medical": "sem medicamentos, pressao normal",
    "preferences": "prefere maquinas e evita corrida",
    "schedule": "treina segunda, terca, quinta e sabado",
    "nutritionNotes": "Dificuldade em bater proteina no cafe da manha.",
    "intensity": 7
  }'::jsonb,
  null
)
on conflict (id) do nothing;

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists clients_set_updated_at on public.clients;
create trigger clients_set_updated_at
before update on public.clients
for each row execute function public.set_updated_at();
