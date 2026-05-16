-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.events (
  id integer NOT NULL,
  name text NOT NULL,
  category text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT events_pkey PRIMARY KEY (id)
);
CREATE TABLE public.players (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  name text NOT NULL UNIQUE,
  nickname text,
  image_link text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT players_pkey PRIMARY KEY (id)
);
CREATE TABLE public.points (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  date_added date NOT NULL,
  player_id integer NOT NULL,
  points integer NOT NULL DEFAULT 0,
  event_id integer NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT points_pkey PRIMARY KEY (id),
  CONSTRAINT points_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.players(id),
  CONSTRAINT points_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id)
);