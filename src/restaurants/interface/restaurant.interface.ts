import { LocationDto } from "../dto/location.dto";
import { User } from "../../../resource/db/entities/User";
import { Restaurant } from "resource/db/entities/Restaurant";

export interface RestaurantInterface {
  // 5-1 유저의 경도 위도 저장
  createUserLocation(locationdto: LocationDto): Promise<User>;

  // 5-2 유저의 경도 위도 수정
  updateUserLocation(locationdto: LocationDto): Promise<User>;

  // 5-3 3km 이내 음식점 정보 조회
  getrestaurantlist(userIdx: number): Promise<Restaurant[]>;
}
