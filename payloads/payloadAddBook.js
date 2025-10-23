export function payloadAddBook(userId) {
  return {
    'userId': userId,
    'collectionOfIsbns': [{ isbn: "9781449325862" }]
  };
}
