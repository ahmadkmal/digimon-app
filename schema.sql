DROP TABLE IF EXISTS digi;
CREATE TABLE digi(
    id serial primary key,
    name varchar(255),
    img text,
    level varchar(255)
)