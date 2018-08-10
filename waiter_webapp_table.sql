drop table if exists waiter CASCADE;

create table waiter (
	id serial not null primary key,
  user_name text not null ,
	full_name text not null,
  position text not null
);

drop table if exists weekdays CASCADE ;

create table weekdays (
	id serial not null primary key,
  day_name varchar(20)
);

drop table if exists shifts ;

create table shifts(
  id serial not null primary key,
  waiter_id int not null,
  weekday_id int not null,
  foreign key (waiter_id) references waiter(id),
  foreign key (weekday_id) references weekdays(id)
);


INSERT INTO weekdays (day_name) VALUES ('Monday');
INSERT INTO weekdays (day_name) VALUES ('Tuesday');
INSERT INTO weekdays (day_name) VALUES ('Wednesday');
INSERT INTO weekdays (day_name) VALUES ('Thursday');
INSERT INTO weekdays (day_name) VALUES ('Friday');
INSERT INTO weekdays (day_name) VALUES ('Saturday');
INSERT INTO weekdays (day_name) VALUES ('Sunday');

INSERT INTO waiter (user_name, full_name, position) VALUES('greg', 'Greg Foulkes', 'admin');
INSERT INTO waiter (user_name, full_name, position) VALUES('ayabonga', 'Ayabonga Booi', 'waiter');
INSERT INTO waiter (user_name, full_name, position) VALUES('luvuyo', 'Luvuyo Sono', 'waiter');
INSERT INTO waiter (user_name, full_name, position) VALUES('aviwe', 'Aviwe Mbekeni', 'waiter');


-- INSERT INTO waiter(user_name, name) VALUES('gregfoulkes', 'Greg');

-- INSERT INTO shifts(waiter_id, weekday_id) VALUES(1, 1);

select * from waiter;

select * from weekdays;

-- select * from shifts;

--
--
-- INSERT INTO shift_day (mon) VALUES ('Luvuyo');
-- -- SELECT * FROM shift_day
--
-- INSERT INTO shift_day (mon) VALUES ('Greg');
--
-- INSERT INTO shift_day (tues) VALUES ('Aviwe');
-- INSERT INTO shift_day (tues) VALUES ('Greg');
--
-- INSERT INTO shift_day (wed) VALUES ('Aviwe');
-- INSERT INTO shift_day (wed) VALUES ('Luvuyo');
