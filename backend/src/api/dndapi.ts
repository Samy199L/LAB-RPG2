import axios from "axios";
export const dndAPI = axios.create({
  baseURL: "https://www.dnd5eapi.co/api/2014/monsters/",
  timeout: 5000,
});
