import PaginatedResponse from "../types/PaginatedResponse";
import UserDTO from "./user.dto";

export default class PaginatedUsers extends PaginatedResponse<UserDTO>() {
}
