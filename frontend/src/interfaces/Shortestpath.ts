export interface ShortestpathInterface {
    ID?: number; // Unique identifier for the shortest path
    Start_node_id?: number; // Accommodation ID
    End_node_lan?: number; // Landmark ID
    End_node_res?: number; // Restaurant ID
    Time?: string; // Use string to represent time in 'YYYY-MM-DD HH:mm:ss' format
    Total_distance?: number; // Use number for total distance
}

	// Start_node_id  uint      
   	// Acc    *Accommodation  `gorm:"foreignKey:Start_node_id"`

	// End_node_lan  uint      
   	// Lan    *Landmark  `gorm:"foreignKey:End_node_lan"`

	// End_node_res  uint      
   	// Res    *Restaurant  `gorm:"foreignKey:End_node_res"`

	// Time time.Time 

	// Total_distance float32