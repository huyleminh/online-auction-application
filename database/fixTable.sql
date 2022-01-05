use online_auction_app;

alter table user_account modify address text;

ALTER TABLE product
ADD FULLTEXT(product_name);

ALTER TABLE category
ADD FULLTEXT(cat_name);
