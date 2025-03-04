import { GraphQLResolveInfo } from "graphql";

// Hàm đệ quy để lấy tất cả các field path dạng "field-level1.field-level2..."
export function getFieldPaths(info: GraphQLResolveInfo): string[] {
  const paths: string[] = [];

  // Hàm đệ quy để duyệt qua các selections
  function getSelections(selections: any[], parentPath: string = ""): void {
    for (const selection of selections) {
      const fieldName = selection.name.value;
      const currentPath = parentPath ? `${parentPath}.${fieldName}` : fieldName;

      paths.push(currentPath);

      // Nếu có nested fields, tiếp tục đệ quy
      if (selection.selectionSet) {
        getSelections(selection.selectionSet.selections, currentPath);
      }
    }
  }

  // Duyệt qua tất cả các fieldNodes trong info
  for (const fieldNode of info.fieldNodes) {
    if (fieldNode.selectionSet) {
      getSelections(fieldNode.selectionSet.selections as any[]);
    }
  }

  return paths;
}

// Hàm kiểm tra xem field path có tồn tại trong query không
export function hasRequestedField(info: GraphQLResolveInfo, fieldPath: string): boolean {
  const fieldPaths = getFieldPaths(info);
  return fieldPaths.includes(fieldPath);
}
