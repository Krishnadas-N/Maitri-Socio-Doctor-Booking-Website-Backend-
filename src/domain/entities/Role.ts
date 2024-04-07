interface IRole {
    _id?: string;
    name: string;
    permissions: string[];
    createdAt: Date;
    updatedAt: Date;
  }
  
  class Role implements IRole {
    _id?: string;
    name: string;
    permissions: string[];
    createdAt: Date;
    updatedAt: Date;
  
    constructor(name: string, permissions: string[], createdAt: Date = new Date(Date.now()), updatedAt: Date = new Date(Date.now()), id?: string) {
      this._id = id;
      this.name = name;
      this.permissions = permissions;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
    }
  
    static fromJSON(json: any): Role {
      return new Role(json.id, json.name, json.permissions, json.createdAt, json.updatedAt);
    }
  
    toJSON(): any {
      return {
        id: this._id,
        name: this.name,
        permissions: this.permissions,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
      };
    }
  }
  
  export default Role;