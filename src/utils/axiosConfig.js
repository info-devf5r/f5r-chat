import axios from "axios";
import { BackendEndpoint } from "./BackendEndpoint";

export const instance = axios.create({
  baseURL: BackendEndpoint,
});

// /api/*  https://aydotcom-chat.herokuapp.com/api/:splat  200
