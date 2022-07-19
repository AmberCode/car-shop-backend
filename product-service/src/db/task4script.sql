create extension if not exists "uuid-ossp";

create table product (
	id uuid not null default uuid_generate_v4() primary key,
	title text not null,
	description text,
	price integer
);

create table stock (
	product_id uuid not null primary key,
	count integer,
	foreign key (product_id) references product(id)
);


INSERT INTO public.product
(id, title, description, price)
VALUES('7567ec4b-b10c-48c5-9345-fc73c48a80aa', 'product title1', 'This product1', 1);

INSERT INTO public.product
(id, title, description, price)
VALUES('7567ec4b-b10c-48c5-9345-fc73c48a80a0', 'product title2', 'This product2', 2);

INSERT INTO public.product
(id, title, description, price)
VALUES('7567ec4b-b10c-48c5-9345-fc73c48a80a2', 'product title3', 'This product3', 3);

INSERT INTO public.product
(id, title, description, price)
VALUES('7567ec4b-b10c-48c5-9345-fc73c48a80a1', 'product title4', 'This product4', 4);

INSERT INTO public.product
(id, title, description, price)
VALUES('7567ec4b-b10c-48c5-9345-fc73c48a80a3', 'product title5', 'This product5', 5);

INSERT INTO public.stock
(product_id, count)
VALUES('7567ec4b-b10c-48c5-9345-fc73c48a80aa', 1);

INSERT INTO public.stock
(product_id, count)
VALUES('7567ec4b-b10c-48c5-9345-fc73c48a80a0', 5);

INSERT INTO public.stock
(product_id, count)
VALUES('7567ec4b-b10c-48c5-9345-fc73c48a80a2', 0);

INSERT INTO public.stock
(product_id, count)
VALUES('7567ec4b-b10c-48c5-9345-fc73c48a80a1', 10);

INSERT INTO public.stock
(product_id, count)
VALUES('7567ec4b-b10c-48c5-9345-fc73c48a80a3', 55);
