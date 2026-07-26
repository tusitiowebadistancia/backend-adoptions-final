export class MemoryUserRepository {
  constructor(initialUsers = []) {
    this.users = new Map(initialUsers.map((user) => [user._id, structuredClone(user)]));
  }

  async getById(id) {
    const user = this.users.get(id);
    return user ? structuredClone(user) : null;
  }

  async update(id, changes) {
    const current = this.users.get(id);

    if (!current) {
      return null;
    }

    const updated = { ...current, ...structuredClone(changes) };
    this.users.set(id, updated);
    return structuredClone(updated);
  }
}
