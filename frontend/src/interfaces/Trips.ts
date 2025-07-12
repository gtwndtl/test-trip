import type { ShortestpathInterface } from "./Shortestpath";

export interface TripInterface {
  ID?: number;              // ตรงกับ gorm.Model.ID (uint)
  CreatedAt?: string;       // gorm.Model.CreatedAt (string ISO date)
  UpdatedAt?: string;       // gorm.Model.UpdatedAt (string ISO date)
  DeletedAt?: string | null;// gorm.Model.DeletedAt (soft delete)

  Name?: string;            // Name
  Types?: string;           // Types
  Days?: number;            // Days

  Con_id?: number;          // Foreign key Condition ID
  Acc_id?: number;          // Foreign key Accommodation ID


  ShortestPaths?: ShortestpathInterface[]; // Array ของ Shortestpath
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