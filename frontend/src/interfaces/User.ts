export interface UserInterface {
    ID?: number; // Optional ID for the user, can be used for updates
    Firstname?: string; // User's first name
    Email?: string; // User's email address
    Lastname?: string; // User's last name
    Age?: number; // User's age
    Birthday?: string; // User's birthday in 'YYYY-MM-DD' format
    Password?: string; // User's password, should be hashed in production
    Profile?: string; // User's profile picture URL or path
    Type?: 'user' | 'Google'; // User type, can be 'user' or 'Google'
}

// Firstname          string    
// 	Email            string     
// 	Lastname              string    
// 	Age               int             
// 	Birthday 	time.Time
// 	Password	string    