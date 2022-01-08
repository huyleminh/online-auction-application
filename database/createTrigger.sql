use online_auction_app;

drop trigger if exists after_rating_insert;
create trigger after_rating_insert
after insert
on rating for each row
update user_account
set
rating_point = round(((select count(*) from rating where rated_user_id = NEW.rated_user_id and is_positive = 1) * 100 / (select count(*) from rating where rated_user_id = NEW.rated_user_id)), 0)
where user_id = NEW.rated_user_id;

drop trigger if exists tg_bidding_history_insert;
create trigger tg_bidding_history_insert after insert
on bidding_history for each row
update product set current_bidding_count = (select count(*) from bidding_history  where product_id = NEW.product_id) where product_id = NEW.product_id;
