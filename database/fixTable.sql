use online_auction_app;

alter table user_account modify address text;

ALTER TABLE product
ADD FULLTEXT(product_name);

ALTER TABLE category
ADD FULLTEXT(cat_name);

alter table `newsletter_subscriber`
drop constraint `FK_SUBSCRIBER_USER_ACCOUNT`;

-- add column to allow to bid if have not been rated
alter table product
add is_allow_all tinyint(1);

alter table product modify product_name text;