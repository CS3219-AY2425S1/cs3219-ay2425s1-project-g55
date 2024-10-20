-- The seed script for the users table
CREATE TABLE
    public.users (
        id bigint NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        username character varying(255),
        email character varying(255),
        password character varying(255),
        enabled boolean,
        verification_code character varying(255),
        verification_expiration timestamp
        with
            time zone,
            created_at timestamp
        with
            time zone DEFAULT now () NOT NULL,
            is_admin boolean DEFAULT false
    );

INSERT INTO
    public.users (
        username,
        email,
        "password",
        enabled,
        verification_code,
        verification_expiration,
        created_at,
        is_admin
    )
VALUES
    (
        'halax93460',
        'halax93460@aiworldx.com',
        '$2a$10$xBU.L2Y6gp9NvvELV7aXo.fgu03CYmjDv5hUt89.ZEesK7hm15T/S',
        true,
        NULL,
        NULL,
        '2024-10-01 17:00:20.503',
        true
    ),
    (
        'hocanet993',
        'hocanet993@adambra.com',
        '$2a$10$PD7QuKLG8EIrplpQxk9EyuZoTj5CynORTxUoNmFfEKB2VLdhH4aJm',
        true,
        NULL,
        NULL,
        '2024-10-03 20:17:50.486',
        false
    ),
    (
        'yalifel533',
        'yalifel533@craftapk.com',
        '$2a$10$lcKPQHu2HmRycJfYl7adnemlxDodp4s9bB6Bhmoaj25JZRNN2bQoO',
        false,
        '122215',
        '2024-10-05 23:26:52.907',
        '2024-10-05 23:11:56.920',
        false
    );