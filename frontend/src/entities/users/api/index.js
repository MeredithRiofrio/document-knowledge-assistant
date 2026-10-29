// api/categories.js
import http from "shared/libs/apiClient";
import { LoginResponseDTO, LoginReq, UserDTO, CreateUserReq } from "./schemas";
import { fromLoginDTO, fromUserDTO, toLoginDTO, toCreateUserDTO } from "./mappers";

const BASE_PATH = "/register";

export async function createUser(model, { signal } = {}) {
  const dto = toCreateUserDTO(model);
  const parsedReq = CreateUserReq.safeParse(dto);
  if (!parsedReq.success) throw new Error("Invalid CreateUserReq");
  const { data } = await http.post(BASE_PATH, dto, { signal });
  const parsedRes = UserDTO.safeParse(data.data);
  if (!parsedRes.success) throw new Error("Invalid UserDTO");
  return fromUserDTO(parsedRes.data);
}

const AUTH_PATH = "/login";

export async function login(model, { signal } = {}) {
  const dto = toLoginDTO(model);
  const parsedReq = LoginReq.safeParse(dto);
  if (!parsedReq.success) throw new Error("Invalid LoginReq");
  const { data } = await http.post(AUTH_PATH, dto, { signal });
  const parsedRes = LoginResponseDTO.safeParse(data.data);
  if (!parsedRes.success) throw new Error("Invalid LoginResponseDTO");
  return fromLoginDTO(parsedRes.data);
}
