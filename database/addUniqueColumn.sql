use online_auction_app;

alter table user_account add constraint UC_USER_ACCOUNT_USERNAME unique(username);
