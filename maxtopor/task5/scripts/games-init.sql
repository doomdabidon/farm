-- users
create table users(
    id bigserial PRIMARY KEY,
    name text UNIQUE,
    password text
);

create table roles(
    id bigserial PRIMARY KEY,
    name text UNIQUE
);

create table users_roles(
    user_id bigint REFERENCES users(id),
    role_id bigint REFERENCES roles(id)
);

insert into roles (name) values
    ('USER'), 
    ('ADMIN');

insert into users (name, password) values
    ('maxtopor', '$2b$10$TEQaYjuhWdf2T4nc6nU.mOLO6KHfRQT5J2aefxWUj3Fvfprmn9Fo2'), --abc
    ('maxtoporadmin', '$2b$10$ugs0nUukmlurGVkZ3Y66.OxIyHSmpGZHbQFl1YafMvdaHYkuWInqa'); --strongabc

insert into users_roles values
    (1, 1),
    (2, 1),
    (2, 2);

-- db
create table games(
    id bigserial PRIMARY KEY,
    name TEXT
);

create table genres(
    id bigserial PRIMARY KEY,
    name text
);

create table publishers(
    id bigserial PRIMARY KEY,
    name text
);

create table games_genres(
    game_id bigint REFERENCES games(id),
    genre_id bigint REFERENCES genres(id)
);

create table games_publishers(
    game_id bigint REFERENCES games(id),
    publisher_id bigint REFERENCES publishers(id)
);

--{"name":"skyrim","genres":["open world","rpg"],"publishers":[{"id":"1","name":"Bethesda Game Studios"}],"id":1}
insert into games (name) values
    ('skyrim');

insert into genres (name) values
    ('open world'),
    ('rpg');

insert into games_genres values
    (1, 1),
    (1, 2);

insert into publishers (name) values
    ('Bethesda Game Studios');

insert into games_publishers values
    (1, 1);
