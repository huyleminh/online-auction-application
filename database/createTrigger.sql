use online_auction_app;

drop trigger if exists after_rating_insert;
create trigger after_rating_insert
after insert
on rating for each row
update user_account
set
rating_point = round(((select count(*) from rating where rated_user_id = NEW.rated_user_id and is_positive = 1) * 100 / (select count(*) from rating where rated_user_id = NEW.rated_user_id)), 0)
where user_id = NEW.rated_user_id
