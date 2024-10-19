-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema timemanagement
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `timemanagement` ;

-- -----------------------------------------------------
-- Schema timemanagement
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `timemanagement` DEFAULT CHARACTER SET utf8 ;
USE `timemanagement` ;

-- -----------------------------------------------------
-- Table `timemanagement`.`account`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `timemanagement`.`account` ;

CREATE TABLE IF NOT EXISTS `timemanagement`.`account` (
  `account_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `account_firstname` VARCHAR(40) NOT NULL,
  `account_lastname` VARCHAR(30) NOT NULL,
  `account_email` VARCHAR(50) NOT NULL,
  `account_password` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`account_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `timemanagement`.`course`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `timemanagement`.`course` ;

CREATE TABLE IF NOT EXISTS `timemanagement`.`course` (
  `course_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `course_name` VARCHAR(100) NOT NULL,
  `course_credit_amount` INT NOT NULL,
  `course_day_selection` VARCHAR(100) NOT NULL,
  `course_end_time` TIME NOT NULL,
  `course_start_time` TIME NOT NULL,
  `account_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`course_id`),
  INDEX `fk_course_account1_idx` (`account_id` ASC) VISIBLE,
  CONSTRAINT `fk_course_account1`
    FOREIGN KEY (`account_id`)
    REFERENCES `timemanagement`.`account` (`account_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `timemanagement`.`job`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `timemanagement`.`job` ;

CREATE TABLE IF NOT EXISTS `timemanagement`.`job` (
  `job_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `job_name` VARCHAR(50) NOT NULL,
  `job_day_selection` VARCHAR(100) NOT NULL,
  `job_start_time` TIME NOT NULL,
  `job_end_time` TIME NOT NULL,
  `account_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`job_id`),
  INDEX `fk_job_account_idx` (`account_id` ASC) VISIBLE,
  CONSTRAINT `fk_job_account`
    FOREIGN KEY (`account_id`)
    REFERENCES `timemanagement`.`account` (`account_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `timemanagement`.`sleep`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `timemanagement`.`sleep` ;

CREATE TABLE IF NOT EXISTS `timemanagement`.`sleep` (
  `sleep_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `sleep_desired_amount` INT NOT NULL,
  `sleep_start_time` TIME NOT NULL,
  `sleep_end_time` TIME NOT NULL,
  `account_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`sleep_id`),
  INDEX `fk_sleep_account1_idx` (`account_id` ASC) VISIBLE,
  CONSTRAINT `fk_sleep_account1`
    FOREIGN KEY (`account_id`)
    REFERENCES `timemanagement`.`account` (`account_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
