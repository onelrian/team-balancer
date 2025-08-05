-- Create tables for TeamBalancer system

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    discord_id VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255) NOT NULL,
    avatar VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Work portions table
CREATE TABLE work_portions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    weight INTEGER NOT NULL CHECK (weight >= 1 AND weight <= 10),
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User classes for access control
CREATE TABLE user_classes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Work portion access restrictions
CREATE TABLE work_portion_access (
    id SERIAL PRIMARY KEY,
    work_portion_id INTEGER REFERENCES work_portions(id) ON DELETE CASCADE,
    user_class_id INTEGER REFERENCES user_classes(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(work_portion_id, user_class_id)
);

-- User class assignments
CREATE TABLE user_class_assignments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    user_class_id INTEGER REFERENCES user_classes(id) ON DELETE CASCADE,
    assigned_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, user_class_id)
);

-- Work assignments
CREATE TABLE work_assignments (
    id SERIAL PRIMARY KEY,
    work_portion_id INTEGER REFERENCES work_portions(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assignment_cycle DATE NOT NULL,
    UNIQUE(work_portion_id, assignment_cycle)
);

-- User workload preferences
CREATE TABLE workload_preferences (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    work_portion_id INTEGER REFERENCES work_portions(id) ON DELETE CASCADE,
    preference_level INTEGER CHECK (preference_level >= 1 AND preference_level <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, work_portion_id)
);

-- Assignment history for analytics
CREATE TABLE assignment_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    work_portion_id INTEGER REFERENCES work_portions(id) ON DELETE CASCADE,
    assigned_date DATE NOT NULL,
    completed_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default user classes
INSERT INTO user_classes (name, description) VALUES 
('developers', 'Software developers'),
('designers', 'UI/UX designers'),
('managers', 'Project managers'),
('qa', 'Quality assurance testers');

-- Insert default admin user (will be updated with real Discord ID after OAuth)
INSERT INTO users (discord_id, username, role) VALUES 
('default_admin', 'Default Admin', 'admin');