export interface CommonResponse<T>{
    data:T;
    status_code:number;
    success: boolean;
}