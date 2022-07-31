--
-- PostgreSQL database dump
--

-- Dumped from database version 14.4
-- Dumped by pg_dump version 14.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: etlsheetjs; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE etlsheetjs WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'English_Zambia.1252';


ALTER DATABASE etlsheetjs OWNER TO postgres;

\connect etlsheetjs

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: config; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA config;


ALTER SCHEMA config OWNER TO postgres;

--
-- Name: month_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.month_enum AS ENUM (
    'january',
    'february',
    'march',
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'october',
    'november',
    'december'
);


ALTER TYPE public.month_enum OWNER TO postgres;

--
-- Name: month_or_null_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.month_or_null_enum AS ENUM (
    'january',
    'february',
    'march',
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'october',
    'november',
    'december',
    ''
);


ALTER TYPE public.month_or_null_enum OWNER TO postgres;

--
-- Name: get_tax(uuid); Type: FUNCTION; Schema: config; Owner: postgres
--

CREATE FUNCTION config.get_tax(p_uuid uuid) RETURNS TABLE(uuid uuid, name text)
    LANGUAGE sql STABLE
    AS $$
  SELECT t.uuid, t.name
  FROM config.taxes AS t 
  WHERE uuid = p_uuid;
$$;


ALTER FUNCTION config.get_tax(p_uuid uuid) OWNER TO postgres;

--
-- Name: get_taxes(); Type: FUNCTION; Schema: config; Owner: postgres
--

CREATE FUNCTION config.get_taxes() RETURNS TABLE(uuid uuid, name text)
    LANGUAGE sql STABLE
    AS $$
  SELECT t.uuid, t.name
  FROM config.taxes AS t;
$$;


ALTER FUNCTION config.get_taxes() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: expirations; Type: TABLE; Schema: config; Owner: postgres
--

CREATE TABLE config.expirations (
    tax_id integer NOT NULL,
    year smallint NOT NULL,
    month public.month_enum NOT NULL,
    taxpayer_financial_year_close public.month_or_null_enum NOT NULL,
    exp_0 smallint,
    exp_1 smallint,
    exp_2 smallint,
    exp_3 smallint,
    exp_4 smallint,
    exp_5 smallint,
    exp_6 smallint,
    exp_7 smallint,
    exp_8 smallint,
    exp_9 smallint
);


ALTER TABLE config.expirations OWNER TO postgres;

--
-- Name: upload_expirations(jsonb, smallint); Type: FUNCTION; Schema: config; Owner: postgres
--

CREATE FUNCTION config.upload_expirations(p_expirations jsonb, p_year smallint) RETURNS SETOF config.expirations
    LANGUAGE plpgsql
    AS $$
DECLARE  
obj_exp json;
v_tfyc month_or_null_enum;
BEGIN   
  IF (p_expirations IS NOT NULL) THEN 
  
  	-- remove all the old expirations from the year to upload
  	DELETE FROM config.expirations WHERE year = p_year; 
 
    -- insert new expirations 
  	INSERT INTO config.expirations
  		SELECT
			(obj_exp."value" ->> 'tax_id')::int, 
 	 		(obj_exp."value" ->> 'year')::smallint, 
 	 		(obj_exp."value" ->> 'month')::month_enum, 
 	 		CASE 
 	 			WHEN obj_exp."value" ->> 'taxpayer_financial_year_close' IS NULL THEN ''
 	 			ELSE (obj_exp."value" ->> 'taxpayer_financial_year_close')::month_or_null_enum
 	 		END,
 	    	(obj_exp."value" ->> 'exp_0')::smallint,
 	    	(obj_exp."value" ->> 'exp_1')::smallint,
 	    	(obj_exp."value" ->> 'exp_2')::smallint,
 	    	(obj_exp."value" ->> 'exp_3')::smallint,
 	    	(obj_exp."value" ->> 'exp_4')::smallint,
 	   		(obj_exp."value" ->> 'exp_5')::smallint,
 	   		(obj_exp."value" ->> 'exp_6')::smallint,
 	   		(obj_exp."value" ->> 'exp_7')::smallint,
 	   		(obj_exp."value" ->> 'exp_8')::smallint,
 	   		(obj_exp."value" ->> 'exp_9')::smallint
		FROM jsonb_array_elements (p_expirations) obj_exp; 
  
    -- return expirations
    RETURN QUERY
    SELECT * FROM config.expirations;
  END IF; 
END
$$;


ALTER FUNCTION config.upload_expirations(p_expirations jsonb, p_year smallint) OWNER TO postgres;

--
-- Name: uuid_generate_v4(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.uuid_generate_v4() RETURNS uuid
    LANGUAGE c STRICT
    AS '$libdir/uuid-ossp', 'uuid_generate_v4';


ALTER FUNCTION public.uuid_generate_v4() OWNER TO postgres;

--
-- Name: taxes; Type: TABLE; Schema: config; Owner: postgres
--

CREATE TABLE config.taxes (
    id integer NOT NULL,
    name text NOT NULL,
    uuid uuid DEFAULT public.uuid_generate_v4() NOT NULL
);


ALTER TABLE config.taxes OWNER TO postgres;

--
-- Name: upload_taxes(text[]); Type: FUNCTION; Schema: config; Owner: postgres
--

CREATE FUNCTION config.upload_taxes(p_taxes text[]) RETURNS SETOF config.taxes
    LANGUAGE plpgsql
    AS $$
DECLARE 
v_tax text;  
v_tax_id int;
BEGIN   
  IF (p_taxes IS NOT NULL) THEN 
  	--
    -- insert taxes or update if it comes with the same name but different case
  	--
  	FOREACH v_tax IN ARRAY p_taxes
	LOOP  
 	  v_tax_id = (SELECT id FROM config.taxes WHERE LOWER(name) = LOWER(v_tax));  
 	 
  	  IF (v_tax_id IS NOT NULL) THEN
  	    UPDATE config.taxes SET name = v_tax WHERE LOWER(name) = LOWER(v_tax);
  	  ELSIF (v_tax_id IS NULL) THEN 
  	    INSERT INTO config.taxes(name) SELECT v_tax;
  	  END IF;   
  	END LOOP;    
  
  	--
    -- delete taxes that there are not in the new array of taxes
	--
    DELETE FROM config.taxes WHERE NOT (name ILIKE ANY(p_taxes));
   
  	--
    -- return taxes
  	--
    RETURN QUERY
    SELECT * FROM config.taxes;
  END IF; 
END
$$;


ALTER FUNCTION config.upload_taxes(p_taxes text[]) OWNER TO postgres;

--
-- Name: taxes_id_seq; Type: SEQUENCE; Schema: config; Owner: postgres
--

CREATE SEQUENCE config.taxes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE config.taxes_id_seq OWNER TO postgres;

--
-- Name: taxes_id_seq; Type: SEQUENCE OWNED BY; Schema: config; Owner: postgres
--

ALTER SEQUENCE config.taxes_id_seq OWNED BY config.taxes.id;


--
-- Name: taxes id; Type: DEFAULT; Schema: config; Owner: postgres
--

ALTER TABLE ONLY config.taxes ALTER COLUMN id SET DEFAULT nextval('config.taxes_id_seq'::regclass);


--
-- Name: expirations expirations_pkey; Type: CONSTRAINT; Schema: config; Owner: postgres
--

ALTER TABLE ONLY config.expirations
    ADD CONSTRAINT expirations_pkey PRIMARY KEY (tax_id, year, month, taxpayer_financial_year_close);


--
-- Name: taxes taxes_pkey; Type: CONSTRAINT; Schema: config; Owner: postgres
--

ALTER TABLE ONLY config.taxes
    ADD CONSTRAINT taxes_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

