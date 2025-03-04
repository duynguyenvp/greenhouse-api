import { SelectQueryBuilder } from "typeorm";

export function checkExistedWhereCondition(
  queryBuilder: SelectQueryBuilder<any>
): boolean {
  const query = queryBuilder.getQuery();
  return query.includes("WHERE");
}
