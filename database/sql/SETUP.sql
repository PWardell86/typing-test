-- Create DB, and users.
-- Users have only the permissions they need.
CREATE DATABASE typing;

\c typing postgres;

CREATE TABLE TYPING_USER (
	username varchar(255) NOT NULL,
	displayName varchar(255) NOT NULL,
	password varchar(255) NOT NULL,
	PRIMARY KEY (username)
);

CREATE TABLE USER_SCORE (
	username varchar(255),
	accuracy FLOAT NOT NULL,
	wpm INT NOT NULL,
	elapsedTime FLOAT NOT NULL,
	date DATE NOT NULL,
	FOREIGN KEY (username) REFERENCES TYPING_USER(username)
);