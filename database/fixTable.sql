use online_auction_app;

alter table user_account modify address text;

alter table `newsletter_subscriber`
drop constraint `FK_SUBSCRIBER_USER_ACCOUNT`;
