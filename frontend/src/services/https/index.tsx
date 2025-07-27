import axios, { AxiosError, type AxiosResponse } from "axios";

import type { AccommodationInterface } from "../../interfaces/Accommodation";
import type { ConditionInterface } from "../../interfaces/Condition";
import type { ShortestpathInterface } from "../../interfaces/Shortestpath";
import type { TripInterface } from "../../interfaces/Trips";
import type { LandmarkInterface } from "../../interfaces/Landmark";
import type { RestaurantInterface } from "../../interfaces/Restaurant";
import type { UserInterface } from "../../interfaces/User";
import type { SignInInterface } from "../../interfaces/SignIn";
import type { GroqResponse } from "../../interfaces/Groq";
import type { ChangePasswordInput } from "../../interfaces/ChangePassword";

const apiUrl = "http://localhost:8080";
const Authorization = localStorage.getItem("token");
const Bearer = localStorage.getItem("token_type");

const requestOptions = {

    headers: {

        "Content-Type": "application/json",

        Authorization: `${Bearer} ${Authorization}`,

    },

};

async function GetAllAccommodations(): Promise<AccommodationInterface[]> {
    try {
        const response = await axios.get<AccommodationInterface[]>(`${apiUrl}/accommodations`, requestOptions);
        return response.data;
    } catch (error) {
        throw new Error((error as AxiosError).message);
    }
}

async function GetAccommodationById(id: number): Promise<AccommodationInterface> {
    try {
        const response = await axios.get<AccommodationInterface>(`${apiUrl}/accommodations/${id}`, requestOptions);
        return response.data;
    } catch (error) {
        throw new Error((error as AxiosError).message);
    }
}

async function CreateAccommodation(accommodation: AccommodationInterface): Promise<AccommodationInterface> {
    try {
        const response = await axios.post<AccommodationInterface>(`${apiUrl}/accommodations`, accommodation, requestOptions);
        return response.data;
    } catch (error) {
        throw new Error((error as AxiosError).message);
    }
}

async function UpdateAccommodation(id: number, accommodation: AccommodationInterface): Promise<AccommodationInterface> {
    try {
        const response = await axios.put<AccommodationInterface>(`${apiUrl}/accommodations/${id}`, accommodation, requestOptions);
        return response.data;
    } catch (error) {
        throw new Error((error as AxiosError).message);
    }
}

async function DeleteAccommodation(id: number): Promise<void> {
    try {
        await axios.delete(`${apiUrl}/accommodations/${id}`, requestOptions);
    } catch (error) {
        throw new Error((error as AxiosError).message);
    }
}

async function GetAllConditions(): Promise<ConditionInterface[]> {
    try {
        const response = await axios.get<ConditionInterface[]>(`${apiUrl}/conditions`, requestOptions);
        return response.data;
    }
    catch (error) {
        throw new Error((error as AxiosError).message);
    }
}

async function GetConditionById(id: number): Promise<ConditionInterface> {
    try {
        const response = await axios.get<ConditionInterface>(`${apiUrl}/conditions/${id}`, requestOptions);
        return response.data;
    } catch (error) {
        throw new Error((error as AxiosError).message);
    }
}

async function CreateCondition(condition: ConditionInterface): Promise<ConditionInterface> {
    try {
        const response = await axios.post<ConditionInterface>(`${apiUrl}/conditions`, condition, requestOptions);
        return response.data;
    }
    catch (error) {
        throw new Error((error as AxiosError).message);
    }
}

async function UpdateCondition(id: number, condition: ConditionInterface): Promise<ConditionInterface> {
    try {
        const response = await axios.put<ConditionInterface>(`${apiUrl}/conditions/${id}`, condition, requestOptions);
        return response.data;
    } catch (error) {
        throw new Error((error as AxiosError).message);
    }
}

async function DeleteCondition(id: number): Promise<void> {
    try {
        await axios.delete(`${apiUrl}/conditions/${id}`, requestOptions);
    } catch (error) {
        throw new Error((error as AxiosError).message);
    }
}

async function GetAllShortestPaths(): Promise<ShortestpathInterface[]> {
    try {
        const response = await axios.get<ShortestpathInterface[]>(`${apiUrl}/shortest-paths`, requestOptions);
        return response.data;
    } catch (error) {
        throw new Error((error as AxiosError).message);
    }
}

async function GetShortestPathById(id: number): Promise<ShortestpathInterface> {
    try {
        const response = await axios.get<ShortestpathInterface>(`${apiUrl}/shortest-paths/${id}`, requestOptions);
        return response.data;
    } catch (error) {
        throw new Error((error as AxiosError).message);
    }
}

async function CreateShortestPath(shortestPath: ShortestpathInterface): Promise<ShortestpathInterface> {
    try {
        const response = await axios.post<ShortestpathInterface>(`${apiUrl}/shortest-paths`, shortestPath, requestOptions);
        return response.data;
    } catch (error) {
        throw new Error((error as AxiosError).message);
    }
}

async function UpdateShortestPath(id: number, shortestPath: ShortestpathInterface): Promise<ShortestpathInterface> {
    try {
        const response = await axios.put<ShortestpathInterface>(`${apiUrl}/shortest-paths/${id}`, shortestPath, requestOptions);
        return response.data;
    } catch (error) {
        throw new Error((error as AxiosError).message);
    }
}

async function DeleteShortestPath(id: number): Promise<void> {
    try {
        await axios.delete(`${apiUrl}/shortest-paths/${id}`, requestOptions);
    } catch (error) {
        throw new Error((error as AxiosError).message);
    }
}

async function GetAllTrips(): Promise<TripInterface[]> {
    try {
        const response = await axios.get<TripInterface[]>(`${apiUrl}/trips`, requestOptions);
        return response.data;
    } catch (error) {
        throw new Error((error as AxiosError).message);
    }
}

async function GetTripById(id: number): Promise<TripInterface> {
    try {
        const response = await axios.get<TripInterface>(`${apiUrl}/trips/${id}`, requestOptions);
        return response.data;
    } catch (error) {
        throw new Error((error as AxiosError).message);
    }
}

async function CreateTrip(trip: TripInterface): Promise<TripInterface> {
    try {
        const response = await axios.post<TripInterface>(`${apiUrl}/trips`, trip, requestOptions);
        return response.data;
    } catch (error) {
        throw new Error((error as AxiosError).message);
    }
}

async function UpdateTrip(id: number, trip: TripInterface): Promise<TripInterface> {
    try {
        const response = await axios.put<TripInterface>(`${apiUrl}/trips/${id}`, trip, requestOptions);
        return response.data;
    } catch (error) {
        throw new Error((error as AxiosError).message);
    }
}

async function DeleteTrip(id: number): Promise<void> {
    try {
        await axios.delete(`${apiUrl}/trips/${id}`, requestOptions);
    } catch (error) {
        throw new Error((error as AxiosError).message);
    }
}

async function GetAllLandmarks(): Promise<LandmarkInterface[]> {
    try {
        const response = await axios.get<LandmarkInterface[]>(`${apiUrl}/landmarks`, requestOptions);
        return response.data;
    } catch (error) {
        throw new Error((error as AxiosError).message);
    }
}

async function GetLandmarkById(id: number): Promise<LandmarkInterface> {
    try {
        const response = await axios.get<LandmarkInterface>(`${apiUrl}/landmarks/${id}`, requestOptions);
        return response.data;
    } catch (error) {
        throw new Error((error as AxiosError).message);
    }
}

async function CreateLandmark(landmark: LandmarkInterface): Promise<LandmarkInterface> {
    try {
        const response = await axios.post<LandmarkInterface>(`${apiUrl}/landmarks`, landmark, requestOptions);
        return response.data;
    } catch (error) {
        throw new Error((error as AxiosError).message);
    }
}

async function UpdateLandmark(id: number, landmark: LandmarkInterface): Promise<LandmarkInterface> {
    try {
        const response = await axios.put<LandmarkInterface>(`${apiUrl}/landmarks/${id}`, landmark, requestOptions);
        return response.data;
    } catch (error) {
        throw new Error((error as AxiosError).message);
    }
}

async function DeleteLandmark(id: number): Promise<void> {
    try {
        await axios.delete(`${apiUrl}/landmarks/${id}`, requestOptions);
    } catch (error) {
        throw new Error((error as AxiosError).message);
    }
}

async function GetAllRestaurants(): Promise<RestaurantInterface[]> {
    try {
        const response = await axios.get<RestaurantInterface[]>(`${apiUrl}/restaurants`, requestOptions);
        return response.data;
    } catch (error) {
        throw new Error((error as AxiosError).message);
    }
}

async function GetRestaurantById(id: number): Promise<RestaurantInterface> {
    try {
        const response = await axios.get<RestaurantInterface>(`${apiUrl}/restaurants/${id}`, requestOptions);
        return response.data;
    } catch (error) {
        throw new Error((error as AxiosError).message);
    }
}

async function CreateRestaurant(restaurant: RestaurantInterface): Promise<RestaurantInterface> {
    try {
        const response = await axios.post<RestaurantInterface>(`${apiUrl}/restaurants`, restaurant, requestOptions);
        return response.data;
    } catch (error) {
        throw new Error((error as AxiosError).message);
    }
}

async function UpdateRestaurant(id: number, restaurant: RestaurantInterface): Promise<RestaurantInterface> {
    try {
        const response = await axios.put<RestaurantInterface>(`${apiUrl}/restaurants/${id}`, restaurant, requestOptions);
        return response.data;
    } catch (error) {
        throw new Error((error as AxiosError).message);
    }
}

async function DeleteRestaurant(id: number): Promise<void> {
    try {
        await axios.delete(`${apiUrl}/restaurants/${id}`, requestOptions);
    } catch (error) {
        throw new Error((error as AxiosError).message);
    }
}

async function GetAllUsers(): Promise<UserInterface[]> {
    try {
        const response = await axios.get<UserInterface[]>(`${apiUrl}/users`, requestOptions);
        return response.data;
    } catch (error) {
        throw new Error((error as AxiosError).message);
    }
}

async function GetUserById(id: number): Promise<UserInterface> {
    try {
        const response = await axios.get<UserInterface>(`${apiUrl}/users/${id}`, requestOptions);
        return response.data;
    } catch (error) {
        throw new Error((error as AxiosError).message);
    }
}

async function CreateUser(user: UserInterface): Promise<UserInterface> {
    try {
        const response = await axios.post<UserInterface>(`${apiUrl}/users`, user, requestOptions);
        return response.data;
    } catch (error) {
        throw new Error((error as AxiosError).message);
    }
}

async function UpdateUser(
    id: number,
    user: UserInterface
): Promise<AxiosResponse<UserInterface>> {
    try {
        const response = await axios.put<UserInterface>(
            `${apiUrl}/users/${id}`,
            user,
            requestOptions
        );
        return response;
    } catch (error) {
        throw new Error((error as AxiosError).message);
    }
}

async function DeleteUser(id: number): Promise<void> {
    try {
        await axios.delete(`${apiUrl}/users/${id}`, requestOptions);
    } catch (error) {
        throw new Error((error as AxiosError).message);
    }
}

async function SignInUser(signInData: SignInInterface): Promise<{
    message(message: any): unknown; token: string; token_type: string; id: number
}> {
    try {
        const response = await axios.post<{ token: string; token_type: string; id: number }>(
            `${apiUrl}/signinuser`,
            signInData,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        // ตรวจสอบว่าข้อมูลครบถ้วนก่อนใช้งาน
        if (!response.data.token || !response.data.token_type || !response.data.id) {
            throw new Error("Invalid response from server");
        }

        const { token, token_type, id } = response.data;

        localStorage.setItem("token", token);
        localStorage.setItem("token_type", token_type);
        localStorage.setItem("user_id", id.toString());

        return {
            message: () => undefined,
            token,
            token_type,
            id
        };
    } catch (error) {
        const errorData = (error as AxiosError).response?.data as { error?: string } | undefined;
        throw new Error(errorData?.error || (error as AxiosError).message);
    }
}

async function ChangePassword(data: ChangePasswordInput): Promise<{ message: string }> {
    try {
        const response = await axios.put<{ message: string }>(
            `${apiUrl}/users/me/password`,
            data,
            requestOptions
        );
        return response.data;
    } catch (error) {
        const errorData = (error as AxiosError).response?.data as { error?: string } | undefined;
        throw new Error(errorData?.error || (error as AxiosError).message);
    }
}

// Async function สำหรับเรียกเส้นทางทริป
async function GetRouteFromAPI(startId: number, days: number) {
    try {
        const response = await axios.get(
            `http://localhost:8080/gen-route?start=P${startId}&days=${days}`
        );
        return response.data; // ส่งคืนข้อมูลที่ frontend ต้องใช้
    } catch (error) {
        console.error('เกิดข้อผิดพลาดขณะเรียก API เส้นทาง:', error);
        throw error; // ส่ง error กลับไปให้ component ไปจัดการ
    }
}

async function PostGroq(prompt: string): Promise<GroqResponse> {
    try {
        const response = await axios.post<GroqResponse>(
            `${apiUrl}/api/groq`,
            { prompt },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error) {
        throw new Error((error as AxiosError).message);
    }
}

// ฟังก์ชันส่ง OTP
async function SendOTP(email: string): Promise<{ message: string }> {
  try {
    const response = await axios.post<{ message: string }>(
      `${apiUrl}/send-otp`,
      { email },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    const errorData = (error as AxiosError).response?.data as { error?: string } | undefined;
    throw new Error(errorData?.error || (error as AxiosError).message);
  }
}

// ฟังก์ชันยืนยัน OTP
async function VerifyOTP(email: string, otp: string): Promise<{ message: string }> {
  try {
    const response = await axios.post<{ message: string }>(
      `${apiUrl}/verify-otp`,
      { email, otp },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    const errorData = (error as AxiosError).response?.data as { error?: string } | undefined;
    throw new Error(errorData?.error || (error as AxiosError).message);
  }
}


export {
    SignInUser,
    GetAllAccommodations,
    GetAccommodationById,
    CreateAccommodation,
    UpdateAccommodation,
    DeleteAccommodation,
    GetAllConditions,
    GetConditionById,
    CreateCondition,
    UpdateCondition,
    DeleteCondition,
    GetAllShortestPaths,
    GetShortestPathById,
    CreateShortestPath,
    UpdateShortestPath,
    DeleteShortestPath,
    GetAllTrips,
    GetTripById,
    CreateTrip,
    UpdateTrip,
    DeleteTrip,
    GetAllLandmarks,
    GetLandmarkById,
    CreateLandmark,
    UpdateLandmark,
    DeleteLandmark,
    GetAllRestaurants,
    GetRestaurantById,
    CreateRestaurant,
    UpdateRestaurant,
    DeleteRestaurant,
    GetAllUsers,
    GetUserById,
    CreateUser,
    UpdateUser,
    DeleteUser,
    ChangePassword,
    GetRouteFromAPI,
    PostGroq,
    VerifyOTP,
    SendOTP,
}