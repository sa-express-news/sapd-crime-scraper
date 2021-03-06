--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.8
-- Dumped by pg_dump version 9.5.8

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: empty; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE empty (
    id integer NOT NULL,
    foo character varying
);


--
-- Name: empty_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE empty_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: empty_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE empty_id_seq OWNED BY empty.id;

--
-- Name: calls; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE calls (
    id integer NOT NULL,
    incidentnumber character varying(255),
    category character varying(255),
    problemtype character varying(255),
    responsedate timestamp with time zone,
    address character varying(255),
    hoa character varying(255),
    schooldistrict character varying(255),
    councildistrict integer,
    zipcode integer
);


--
-- Name: calls_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE calls_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY empty ALTER COLUMN id SET DEFAULT nextval('empty_id_seq'::regclass);


--
-- Data for Name: empty; Type: TABLE DATA; Schema: public; Owner: -
--

COPY empty (id, foo) FROM stdin;
\.


--
-- Name: empty_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('empty_id_seq', 7, true);


--
-- Name: calls_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE calls_id_seq OWNED BY calls.id;


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY calls ALTER COLUMN id SET DEFAULT nextval('calls_id_seq'::regclass);

--
-- Name: uniqueid; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY empty
    ADD CONSTRAINT uniqueid UNIQUE (id);


--
-- Name: calls_incidentNumber_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY calls
    ADD CONSTRAINT "calls_incidentnumber_key" UNIQUE ("incidentnumber");


--
-- Name: calls_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY calls
    ADD CONSTRAINT calls_pkey PRIMARY KEY (id);


--
-- Name: public; Type: ACL; Schema: -; Owner: -
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

