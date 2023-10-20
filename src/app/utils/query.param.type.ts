export function queryParamType(argument?: number | string | object | null): { params: any, queries: string } {

  let params: any = {};
  let queries: string = '';
  if (typeof argument === 'number') {
    queries = '/' + argument.toString();
  } else if (typeof argument === 'string') {
    queries = '?' + argument;
  } else if (typeof argument === 'object') {
    params = argument;
  }
  return {params, queries};
}
