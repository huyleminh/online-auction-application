use online_auction_app;

alter table user_account modify address text;

ALTER TABLE product
ADD FULLTEXT(product_name);

ALTER TABLE category
ADD FULLTEXT(cat_name);

alter table `newsletter_subscriber`
drop constraint `FK_SUBSCRIBER_USER_ACCOUNT`;
