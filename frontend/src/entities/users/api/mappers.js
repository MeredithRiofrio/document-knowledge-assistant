// FE model
export function fromUserDTO(dto) {
  return {
    idUser: dto.user_id,
    // name: dto.name,
    // email: dto.email,
  };
}

export function toCreateUserDTO(model) {
  return {
    email: model.email,
    password: model.password,
  };
}

export function toLoginDTO(model) {
  return {
    email: model.email,
    password: model.password,
  };
}

export function fromLoginDTO(model) {
  return {
    access_token: model.access_token,
    refresh_token: model.refresh_token,
  };
}
