create schema if not exists online_auction_app default character set utf8mb4 default collate utf8mb4_bin;
use online_auction_app;

-- -----------------------------------------------------
-- Table `user_account`
-- -----------------------------------------------------
-- 0 is bidder, 1 is admin
create table if not exists `user_account` (
	`user_id` int unsigned auto_increment,
	`username` varchar(40) not null,
    `password` varchar(255) not null,
    `email` varchar(40) not null,
    `address` nvarchar(100), -- a string contains of all information of an address
	`dob` date,
    `role` tinyint(1) not null default 0,
    `first_name` nvarchar(20) not null,
    `last_name` nvarchar(30) not null,
    `rating_point` int,
    `seller_expired_date` timestamp,
    `created_date` timestamp default current_timestamp,

    constraint `PK_USER_ACCOUNT` primary key(`user_id`),
    constraint `UC_USER_ACCOUNT` unique (`email`)
)
engine = InnoDB
default character set = utf8mb4
default collate = utf8mb4_bin;


-- -----------------------------------------------------
-- Table `upgrade_request`
-- -----------------------------------------------------
create table if not exists `upgrade_request` (
	`user_id` int unsigned not null,
    `requested_at` timestamp default current_timestamp,

    constraint `PK_UPGRADE_REQUEST` primary key (`user_id`)
)
engine = InnoDB
default character set = utf8mb4
default collate = utf8mb4_bin;


-- -----------------------------------------------------
-- Table `rating`
-- -----------------------------------------------------
create table if not exists `rating` (
	`rating_id` int unsigned auto_increment,
	`rated_user_id` int unsigned not null,
    `evaluator_id` int unsigned not null,
    `feedback` text not null,
    `is_positive` tinyint(1) not null,
    `rated_date` timestamp default current_timestamp,

    constraint `PK_RATING` primary key (`rating_id`)
)
engine = InnoDB
default character set = utf8mb4
default collate = utf8mb4_bin;


-- -----------------------------------------------------
-- Table `category`
-- -----------------------------------------------------
create table if not exists `category` (
	`cat_id` int unsigned auto_increment,
    `cat_name` nvarchar(50) not null,
    `super_cat_id` int unsigned,
    `created_date` timestamp default current_timestamp,

    constraint `PK_CATEGORY` primary key (`cat_id`)
)
engine = InnoDB
default character set = utf8mb4
default collate = utf8mb4_bin;


-- -----------------------------------------------------
-- Table `product`
-- -----------------------------------------------------
create table if not exists `product` (
	`product_id` int unsigned auto_increment,
    `product_name` nvarchar(60) not null,
    `thumbnail` text not null,
    `current_price` int unsigned not null, -- bidding price at the current time
	`buy_now_price` int unsigned,
    `expired_date` timestamp not null,
    `cat_id` int unsigned not null,
    `max_tolerable_price` int unsigned, -- tolerable price of the winner
    `is_sold` tinyint(1),
    `won_bidder_id` int unsigned,
    `current_bidding_count` int unsigned default 0,
    `created_date` timestamp default current_timestamp,

    constraint `PK_PRODUCT` primary key (`product_id`)
)
engine = InnoDB
default character set = utf8mb4
default collate = utf8mb4_bin;


-- -----------------------------------------------------
-- Table `product_detail`
-- -----------------------------------------------------
-- auto_extend: 0 is false - 1 is true
create table if not exists `product_detail` (
    `product_id` int unsigned auto_increment,
    `step_price` int unsigned not null,
    `auto_extend` tinyint(1) default 0,
    `image_links` text not null,
    `description` text not null, -- rich content as html
    `seller_id` int unsigned not null,

    constraint `PK_PRODUCT_DETAIL` primary key (`product_id`)
)
engine = InnoDB
default character set = utf8mb4
default collate = utf8mb4_bin;


-- -----------------------------------------------------
-- Table `wishlist`
-- -----------------------------------------------------
create table if not exists `wishlist` (
	`user_id` int unsigned not null,
    `product_id` int unsigned not null,

    constraint `PK_WISHLIST` primary key (`user_id`, `product_id`)
)
engine = InnoDB
default character set = utf8mb4
default collate = utf8mb4_bin;


-- -----------------------------------------------------
-- Table `newsletter_subscriber`
-- -----------------------------------------------------
create table if not exists `newsletter_subscriber` (
	`subscriber_id` int unsigned auto_increment,
    `subscriber_email` varchar(40) not null,

    constraint `PK_NEWSLETTER_SUBCRIBER` primary key (`subscriber_id`)
)
engine = InnoDB
default character set = utf8mb4
default collate = utf8mb4_bin;


-- -----------------------------------------------------
-- Table `auto_bidding_job`
-- -----------------------------------------------------
create table if not exists `auto_bidding_job` (
	`job_id` int unsigned auto_increment,
    `product_id` int unsigned not null,
    `expired_date` timestamp not null,

    constraint `PK_AUTO_BIDDING_JOB` primary key (`job_id`)
)
engine = InnoDB
default character set = utf8mb4
default collate = utf8mb4_bin;


-- -----------------------------------------------------
-- Table `bidding_history`
-- -----------------------------------------------------
create table if not exists `bidding_history` (
	`bidding_id` int unsigned auto_increment,
    `product_id` int unsigned not null,
    `bidder_id` int unsigned not null,
    `current_price` int unsigned not null, -- current price of product when user bidding
    `bid_date` timestamp default current_timestamp,
	`bidder_fname` nvarchar(20) not null,
    `tolerable_price` int unsigned not null, -- tolerable price of bidder at bid time

    constraint `PK_BIDDING_HISTORY` primary key (`bidding_id`)
)
engine = InnoDB
default character set = utf8mb4
default collate = utf8mb4_bin;


-- -----------------------------------------------------
-- Table `join_bidder`
-- -----------------------------------------------------
create table if not exists `join_bidder` (
    `product_id` int unsigned not null,
    `bidder_id` int unsigned not null,
    `is_banned` tinyint(1) not null,

    constraint `PK_JOIN_BIDDER` primary key (`product_id`, `bidder_id`)
)
engine = InnoDB
default character set = utf8mb4
default collate = utf8mb4_bin;


-- -----------------------------------------------------
-- Create foreign keys
-- -----------------------------------------------------
alter table `upgrade_request`
add constraint `FK_UPGRADE_REQUEST_USER_ACCOUNT`
foreign key (user_id)
references `user_account`(user_id);


alter table `newsletter_subscriber`
add constraint `FK_SUBSCRIBER_USER_ACCOUNT`
foreign key (subscriber_id)
references `user_account`(user_id);


alter table `rating`
add constraint `FK_RATED_USER_ACOUNT`
foreign key (rated_user_id)
references `user_account`(user_id);

alter table `rating`
add constraint `FK_EVALUATOR_USER_ACCOUNT`
foreign key (evaluator_id)
references `user_account`(user_id);


alter table `category`
add constraint `FK_CATEGORY_SUPER`
foreign key (super_cat_id)
references `category`(cat_id);


alter table `product`
add constraint `FK_PRODUCT_CATEGORY`
foreign key (cat_id)
references `category`(cat_id);


alter table `product`
add constraint `FK_PRODUCT_USER_ACCOUNT`
foreign key (won_bidder_id)
references `user_account`(user_id);


alter table `auto_bidding_job`
add constraint `FK_PRODUCT_AUTO_BIDDING_JOB`
foreign key (product_id)
references `product`(product_id);


alter table `product_detail`
add constraint `FK_PRODUCT_DETAIL_PRODUCT`
foreign key (product_id)
references `product`(product_id);


alter table `product_detail`
add constraint `FK_PRODUCT_DETAIL_USER_ACCOUNT`
foreign key (seller_id)
references `user_account`(user_id);


alter table `wishlist`
add constraint `FK_WISHLIST_PRODUCT`
foreign key (product_id)
references `product`(product_id);


alter table `wishlist`
add constraint `FK_WISHLIST_USER`
foreign key (user_id)
references `user_account`(user_id);


alter table `join_bidder`
add constraint `FK_JOIN_BIDDER_USER`
foreign key (bidder_id)
references `user_account`(user_id);


alter table `join_bidder`
add constraint `FK_JOIN_BIDDER_PRODUCT`
foreign key (product_id)
references `product`(product_id);


alter table `bidding_history`
add constraint `FK_BIDDING_HISTORY_USER`
foreign key (bidder_id)
references `user_account`(user_id);


alter table `bidding_history`
add constraint `FK_BIDDING_HISTORY_PRODUCT`
foreign key (product_id)
references `product`(product_id);
