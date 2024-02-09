import { messageType } from "../types";

const maxMessageLoadTimeout = 5000;
export default async function repeatLoad(messageLoadTimeout: number): Promise<messageType[]> {
  try {
    const response = await fetch(`http://${import.meta.env.VITE_SERVER_IP}:${import.meta.env.VITE_SERVER_PORT}/messages`);
    const data = await response.json();
    return data; 
  } catch (error) {
    await new Promise<void>((resolve) => setTimeout(() => resolve(), messageLoadTimeout));
    return repeatLoad(Math.min(messageLoadTimeout * 2, maxMessageLoadTimeout));
  }
}