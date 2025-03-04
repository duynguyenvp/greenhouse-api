export function removeEmptyFields(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};

  for (const key in obj) {
      // Kiểm tra nếu key là thuộc tính của object (không phải từ prototype chain)
      if (obj.hasOwnProperty(key)) {
          const value = obj[key];
          
          // Giữ lại giá trị nếu nó là false (kiểu boolean) hoặc có giá trị hợp lệ
          if (value !== undefined && value !== null && (value !== '' || typeof value === 'boolean')) {
              result[key] = value;
          }
      }
  }

  return result;
}