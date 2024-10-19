-- PostgreSQL version

-- -----------------------------------------------------
-- Table `timemanagement`.`account`
-- -----------------------------------------------------
DROP TABLE IF EXISTS account CASCADE;

CREATE TABLE account (
    account_id SERIAL PRIMARY KEY,
    account_firstname CHARACTER VARYING NOT NULL,
    account_lastname CHARACTER VARYING NOT NULL,
    account_email CHARACTER VARYING NOT NULL,
    account_password CHARACTER VARYING NOT NULL
);

-- -----------------------------------------------------
-- Table `timemanagement`.`course`
-- -----------------------------------------------------
DROP TABLE IF EXISTS course;

CREATE TABLE course (
    course_id SERIAL PRIMARY KEY,
    course_name CHARACTER VARYING NOT NULL,
    course_credit_amount INT NOT NULL,
    course_day_selection CHARACTER VARYING NOT NULL,
    course_end_time TIME NOT NULL,
    course_start_time TIME NOT NULL,
    account_id INT NOT NULL,
    CONSTRAINT fk_course_account FOREIGN KEY (account_id)
        REFERENCES account (account_id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
);

-- -----------------------------------------------------
-- Table `timemanagement`.`job`
-- -----------------------------------------------------
DROP TABLE IF EXISTS job;

CREATE TABLE job (
    job_id SERIAL PRIMARY KEY,
    job_name CHARACTER VARYING NOT NULL,
    job_day_selection CHARACTER VARYING NOT NULL,
    job_start_time TIME NOT NULL,
    job_end_time TIME NOT NULL,
    account_id INT NOT NULL,
    CONSTRAINT fk_job_account FOREIGN KEY (account_id)
        REFERENCES account (account_id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
);

-- -----------------------------------------------------
-- Table `timemanagement`.`study`
-- -----------------------------------------------------
DROP TABLE IF EXISTS study;

CREATE TABLE study (
    study_id SERIAL PRIMARY KEY,
    study_selection CHARACTER VARYING NOT NULL,
    study_start_time TIME NOT NULL,
    study_end_time TIME NOT NULL,
    account_id INT NOT NULL,
    CONSTRAINT fk_study_account FOREIGN KEY (account_id)
        REFERENCES account (account_id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
);



-- -----------------------------------------------------
-- Table `timemanagement`.`assignment`
-- -----------------------------------------------------
DROP TABLE IF EXISTS assignment;

CREATE TABLE assignment (
    assignment_id SERIAL PRIMARY KEY,
    assignment_name CHARACTER VARYING NOT NULL,
    assignment_due_date DATE NOT NULL,
    course_id INT NOT NULL,
    CONSTRAINT fk_assignment_course FOREIGN KEY (course_id)
        REFERENCES course (course_id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
);