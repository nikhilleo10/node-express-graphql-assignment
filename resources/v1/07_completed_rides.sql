CREATE TABLE IF NOT EXISTS completed_rides (
  id INT NOT NULL AUTO_INCREMENT,
  pickup_time TIMESTAMP NOT NULL,
  dropoff_time TIMESTAMP NULL,
  duration_travelled FLOAT NULL,
  actual_fare FLOAT NULL,
  tip FLOAT NULL,
  trip_id INT NOT NULL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP,
  PRIMARY KEY (id),
  INDEX trip_id_idx (trip_id ASC) VISIBLE,
  CONSTRAINT trip_id_com
    FOREIGN KEY (trip_id)
    REFERENCES requested_rides (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB