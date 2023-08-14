export async function getChatById(id) {
  try {
    if (id) {
      let found = await WAPI.getChat(id);
      if (found) {
        return WAPI._serializeChatObj(found);
      }
    }
    throw false;
  } catch {
    return false;
  }
}
