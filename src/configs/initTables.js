const pool = require("../services/db");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const callback = (error, results, fields) => {
  if (error) {
    console.error("Error creating tables:", error);
  } else {
    console.log("Tables created successfully");
  }
  process.exit();
}

bcrypt.hash('1234', saltRounds, (error, hash) => {
  if (error) {
    console.error("Error hashing password:", error);
  } else {
    console.log("Hashed password:", hash);

    const SQLSTATEMENT = `
    DROP TABLE IF EXISTS User;
    DROP TABLE IF EXISTS Task;
    DROP TABLE IF EXISTS TaskProgress;
    DROP TABLE IF EXISTS Messages;
    
    DROP TABLE IF EXISTS Elemental;
    DROP TABLE IF EXISTS ElementalDex;

    CREATE TABLE User (
      id INT PRIMARY KEY AUTO_INCREMENT,
      username TEXT NOT NULL,
      email TEXT NOT NULL,
      password TEXT NOT NULL,
      active_elemental INT,
      Elemunchies INT,
      created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_login_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE Task (
    task_id INT PRIMARY KEY AUTO_INCREMENT,
    title TEXT,
    description TEXT,
    points INT
    );
    
    CREATE TABLE TaskProgress (
    progress_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    task_id INT NOT NULL,
    completion_date TIMESTAMP,
    notes TEXT
    );

    CREATE TABLE Messages (
      id INT PRIMARY KEY AUTO_INCREMENT,
      message_text TEXT NOT NULL,
      user_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
      
    
    -- Create Elemental table
    CREATE TABLE Elemental (
      id INT PRIMARY KEY AUTO_INCREMENT,
      owner_id INT NOT NULL,
      dex_num INT NOT NULL,
      energy INT,
      created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Create ElementalDex table
    CREATE TABLE ElementalDex (
      number INT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL
    );
    
    INSERT INTO Task (title, description, points) VALUES
    ("Plant a Tree", "Plant a tree in your neighbourhood or a designated green area.", 50),
    ("Use Public Transportation", "Use public transportation or carpool instead of driving alone.", 30),
    ("Reduce Plastic Usage ", "Commit to using reusable bags and containers.", 40),
    ("Energy Conservation", "Turn off lights and appliances when not in use.", 25),
    ("Composting", "Start composting kitchen scraps to create natural fertilizer.", 35); 

    INSERT INTO User (username, email, password, Elemunchies) VALUES
      ('admin', 'a@a.com', '${hash}', 50),
      ('riley', 'riley@gmail.com', '${hash}', 50),
      ('k', 'k@k', '${hash}', 50);

    INSERT INTO Messages (message_text, user_id) VALUES
    ("Hello world!", 1),
    ("Yummy!", 2),  
    ("I am the one", 3),
    ("This is a new message for user 1", 1),
    ("Another message for user 2", 2),
    ("User 3 has a new message", 3),
    ("Message for user 1 - Part 2", 1),
    ("Exciting update for user 2", 2),
    ("User 3's latest thought", 3),
    ("Important announcement for user 1", 1),
    ("User 2 shares a fun fact", 2),
    ("Thought of the day from user 3", 3),
    ("More news for user 1", 1),
    ("User 2's weekend plans", 2),
    ("A mysterious message from user 3", 3),
    ("Celebration time for user 1", 1),
    ("User 2's favorite quote", 2),
    ("Reflecting on life by user 3", 3),
    ("Surprise for user 1", 1),
    ("User 2's travel adventure", 2);
  

    INSERT INTO ElementalDex (number, name, type) VALUES
  (1, 'Blaze', 'Fire'),
  (2, 'Torrent', 'Water'),
  (3, 'Zephyr', 'Wind'),
  (4, 'Terra', 'Earth'),
  (5, 'Ember', 'Fire'),
  (6, 'Ripple', 'Water'),
  (7, 'Breeze', 'Wind'),
  (8, 'Stone', 'Earth'),
  (9, 'Pyro', 'Fire'),
  (10, 'Aqua', 'Water'),
  (11, 'Gale', 'Wind'),
  (12, 'Gaia', 'Earth'),
  (13, 'Cinder', 'Fire'),
  (14, 'Drizzle', 'Water'),
  (15, 'Zephyra', 'Wind'),
  (16, 'Granite', 'Earth'),
  (17, 'Ignis', 'Fire'),
  (18, 'Aquaflare', 'Water'),
  (19, 'Cyclone', 'Wind'),
  (20, 'Geo', 'Earth'),
  (21, 'Inferno', 'Fire'),
  (22, 'Splash', 'Water'),
  (23, 'Whisper', 'Wind'),
  (24, 'Pebble', 'Earth'),
  (25, 'Vulcan', 'Fire');
    `;

    pool.query(SQLSTATEMENT, callback);
  }
});
