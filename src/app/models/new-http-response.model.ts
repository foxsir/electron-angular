/**
 * 新接口应该使用此模型
 */
export default interface NewHttpResponseModel<T> {
  data: T;
  msg: string;
  status: number;
}
