import API from "../utils/api";

export const toggleFollow = async (
  id
) => {

  const { data } =
    await API.put(
      `/users/follow/${id}`
    );

  return data;

};