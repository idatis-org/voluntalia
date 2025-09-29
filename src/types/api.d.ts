// Respuesta genérica de la API
export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}
