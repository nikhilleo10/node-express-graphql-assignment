CREATE TABLE IF NOT EXISTS customer (
  id INT NOT NULL AUTO_INCREMENT,
  type ENUM('REGULAR', 'PREMIUM') NOT NULL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  user_id INT NOT NULL,
  PRIMARY KEY (id),
  INDEX user_id_idx (user_id ASC) VISIBLE,
  CONSTRAINT user_id_cust
    FOREIGN KEY (user_id)
    REFERENCES user(id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;