psql postgres -c "CREATE DATABASE sapd";
psql sapd < sapd.sql
psql postgres -c "CREATE DATABASE sapd_test";
psql sapd_test < sapd.sql