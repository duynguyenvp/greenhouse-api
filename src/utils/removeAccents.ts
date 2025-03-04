export function removeAccents(str: string): string {
  const accentMap: { [key: string]: string } = {
    'á': 'a', 'à': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
    'é': 'e', 'è': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
    'í': 'i', 'ì': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
    'ó': 'o', 'ò': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
    'ú': 'u', 'ù': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
    'đ': 'd', 'â': 'a', 'ê': 'e', 'ô': 'o', 'ơ': 'o', 'ư': 'u',
    // Các ký tự có dấu khác
  };

  // Hàm loại bỏ dấu và giữ nguyên chữ hoa
  return str.split('').map(char => {
    // Kiểm tra nếu là chữ hoa, giữ nguyên chữ hoa sau khi loại bỏ dấu
    if (char === char.toUpperCase()) {
      return accentMap[char.toLowerCase()]?.toUpperCase() || char;  // Giữ nguyên chữ hoa
    } else {
      return accentMap[char] || char;  // Xử lý chữ thường
    }
  }).join('');
}