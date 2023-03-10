CREATE TABLE user (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(60) NOT NULL,
  last_name VARCHAR(60) NULL,
  email VARCHAR(60) NOT NULL UNIQUE,
  mobile BIGINT NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  type_of_user ENUM('DRIVER', 'CUSTOMER') NOT NULL,
  date_of_birth DATE NULL,
  city VARCHAR(60) NULL,
  location POINT NULL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE INDEX email_UNIQUE (email ASC) VISIBLE,
  UNIQUE INDEX mobile_UNIQUE (mobile ASC) VISIBLE)
ENGINE = InnoDB;
