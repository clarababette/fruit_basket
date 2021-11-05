create table fruit_basket (
  id serial primary key,
  type varchar(50) not null,
  qty int,
  unit_price numeric
)