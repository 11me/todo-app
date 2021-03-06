DROP SCHEMA IF EXISTS todo CASCADE;
CREATE SCHEMA todo;

CREATE TABLE todo.todo
(
  id BIGSERIAL NOT NULL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  done  BOOLEAN NOT NULL,
  createdAt DATE NOT NULL DEFAULT NOW()
);
