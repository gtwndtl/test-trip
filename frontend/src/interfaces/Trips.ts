export interface TripInterface {
    ID?: number;
    Created_at?: string; // Use string to represent date in 'YYYY-MM-DD' format
    Name?: string; // Name of the trip
    Types?: string; // Type of the trip (e.g., adventure, cultural)
    Day?: string; // Use string to represent date in 'YYYY-MM-DD' format
    Con_id?: number; // Condition ID
    Acc_id?: number; // Accommodation ID
    Path_id?: number; // Shortest path ID
}
// Created_at     time.Time
// 	Name string 
// 	Types string 
// 	Day time.Time 

// 	Con_id  uint      
//    	Con    *Condition  `gorm:"foreignKey:Con_id"`

// 	Acc_id  uint      
//    	Acc    *Accommodation  `gorm:"foreignKey:Acc_id"`

// 	Path_id  uint      
//    	Path    *Shortestpath  `gorm:"foreignKey:Path_id"`