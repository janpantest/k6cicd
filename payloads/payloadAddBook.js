export function payloadAddBook(userId, isbnValue) {
  return {
    'userId': userId,
    'collectionOfIsbns': [{ isbn: isbnValue }]
  };
}
