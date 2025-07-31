export interface RecommendInterface {
    ID?: number; // Optional ID for the recommendation, can be used for updates
    Condition?: string; // Optional condition for the recommendation, e.g., "Suitable for seniors"
    TripID?: number; // Optional reference to the trip ID
    Trip?: any; // Optional reference to the trip object, can be of any type or interface
    ReviewID?: number; // Optional reference to the review ID
    Review?: any; // Optional reference to the review object, can be of any type or interface
}

// Condition string `binding:"required,min=2,max=100"` // เงื่อนไขการแนะนำ เช่น "เหมาะกับผู้สูงอายุ"

// 	TripID uint   `binding:"required"`       // อ้างอิงทริป
// 	Trip   *Trips `gorm:"foreignKey:TripID"`

// 	ReviewID uint    `binding:"required"`  // อ้างอิงรีวิว
// 	Review   *Review `gorm:"foreignKey:ReviewID"`