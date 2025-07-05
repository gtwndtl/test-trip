export interface AccommodationInterface {
     ID?: number;
     PlaceID: number;
    Name?: string;
    Category?: string;
    Lat?: number;
    Lon?: number; 
    StatusID?: number;
    Address?: string;
    Province?: string;
    District?: string;
    SubDistrict?: string;
    Postcode?: string;
    ThumbnailURL?: string;
    CreatedAt?: string;
    UpdatedAt?: string;
    Time_open?: string;
    Time_close?: string;
    Total_people?: number;
    Price?: number;
    Review?: number;
  }
