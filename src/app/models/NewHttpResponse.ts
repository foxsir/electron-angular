export default interface NewHttpResponse<T> {
  data: T;
  msg: string;
  status: number;
}
