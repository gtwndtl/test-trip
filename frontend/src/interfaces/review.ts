export interface ReviewInterface {
    ID?: number; // Optional ID for the recommendation, can be used for updates
    Day?: string; // Date of the review in 'YYYY-MM-DD' format
    Rate?: number; // Rating for the review, should be between 1 and 5
    TripID?: number; // Optional reference to the trip ID
    Trip?: any; // Optional reference to the trip object, can be of any type or
    Comment?: string; // Optional comment for the review, max length 1000 characters
    User_id?: number; // Optional reference to the user ID who made the review
    User?: any; // Optional reference to the user object, can be of any type or interface
}



// Day    time.Time `binding:"required"`               // วันที่รีวิว
// 	Rate   int       `binding:"required,gte=1,lte=5"` // คะแนนรีวิว 1-5 ดาว

// 	TripID uint   `binding:"required"`             // ต้องระบุ trip ที่รีวิว
// 	Trip   *Trips `gorm:"foreignKey:TripID"`

// 	Comment string `binding:"omitempty,max=1000"`  // คอมเมนต์ ไม่บังคับ แต่จำกัดความยาว

// 	User_id uint  `binding:"required"`              // ผู้ใช้ที่รีวิว
// 	User   *User `gorm:"foreignKey:User_id"` // foreign key อ้างอิง User