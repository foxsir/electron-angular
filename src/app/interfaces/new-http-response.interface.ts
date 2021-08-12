/**
 * 新接口应该使用此模型
 */
export default interface NewHttpResponseInterface<T> {
  data: T;
  msg: string;
  status: number;
}
