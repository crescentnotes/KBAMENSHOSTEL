CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    parent_mob_num VARCHAR(15),
    rtid INTEGER UNIQUE NOT NULL, -- Ensure each RTID is unique
    rrn VARCHAR(50) UNIQUE NOT NULL -- Ensure RRN is unique for each user
);


CREATE TABLE gatepasses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    rrn VARCHAR(50) NOT NULL, -- Ensure RRN links to the user in users table
    degree VARCHAR(100),
    block_room VARCHAR(50),
    time_out TIMESTAMPTZ,
    time_in TIMESTAMPTZ,
    reason TEXT,
    student_contact VARCHAR(15),
    parent_contact VARCHAR(15),
    rt_name VARCHAR(10),
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    rtid INTEGER,
    FOREIGN KEY (rrn) REFERENCES users (rrn) ON DELETE CASCADE, -- Link RRNs
    FOREIGN KEY (rtid) REFERENCES users (rtid) ON DELETE SET NULL -- Set NULL if RTID in users is deleted
);


 CREATE TABLE rt (
    rtid INTEGER PRIMARY KEY,                  -- Unique identifier for each request, user-defined
    name VARCHAR(255) NOT NULL,                -- Name of the requester
    email VARCHAR(255) NOT NULL,               -- Email of the requester
    password VARCHAR(255) NOT NULL,            -- Password for the requester (if needed for verification)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);



CREATE TABLE logins (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255),         -- This column should exist for email
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(50)
);

CREATE TABLE housekeeping_requests (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    rrn VARCHAR(50),
    block VARCHAR(50),
    room_number VARCHAR(50),
    maintenance_done BOOLEAN DEFAULT false,
    status VARCHAR(50) DEFAULT 'pending'
);

CREATE TABLE electrical_work_requests (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    rrn VARCHAR(50),
    block VARCHAR(50),
    room_number VARCHAR(50),
    complaint TEXT,
    maintenance_done BOOLEAN DEFAULT false,
    status VARCHAR(50) DEFAULT 'pending'
);


CREATE TABLE admin (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE admin_logins (
    id SERIAL PRIMARY KEY,
    admin_id INTEGER REFERENCES admin(id) ON DELETE CASCADE,
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    success BOOLEAN NOT NULL,
    ip_address VARCHAR(45), -- For IPv6 compatibility
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE carpentry_requests (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    rrn VARCHAR(50),
    block VARCHAR(50),
    room_number VARCHAR(50),
    complaint TEXT,
    maintenance_done BOOLEAN DEFAULT false,
    status VARCHAR(50) DEFAULT 'pending'
);

