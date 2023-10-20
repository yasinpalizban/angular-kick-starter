
export function convertSign(sign:any):string {
  switch (sign) {
    case '=':
      return 'eq';
    case '>=':
      return 'gte';
    case '>':
      return 'gt';
    case '<=':
      return 'lte';
    case '<':
      return 'lt';
    case '!=':
      return 'ne';
    default:
      return 'eq'

  }
}





