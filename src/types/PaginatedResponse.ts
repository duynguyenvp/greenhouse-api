export default function PaginatedResponse<TItem extends object>() {
  abstract class PaginatedResponseClass {
    total!: number;
    pageIndex!: number;
    pageSize!: number;
    data: TItem[];
  }
  return PaginatedResponseClass;
}