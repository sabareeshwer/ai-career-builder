const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { getDBStatus } = require('./db');

const dataDir = path.join(__dirname, '..', '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

class LocalCollection {
  constructor(collectionName) {
    this.filePath = path.join(dataDir, `${collectionName}.json`);
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([], null, 2));
    }
  }

  _read() {
    try {
      const data = fs.readFileSync(this.filePath, 'utf8');
      return JSON.parse(data || '[]');
    } catch {
      return [];
    }
  }

  _write(data) {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
  }

  async find(filter = {}) {
    const items = this._read();
    return items.filter(item => {
      for (const key of Object.keys(filter)) {
        if (filter[key] === undefined) continue;
        if (key === '_id' && item._id !== filter[key] && item.id !== filter[key]) return false;
        if (item[key] !== filter[key]) return false;
      }
      return true;
    }).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }

  async findOne(filter = {}) {
    const items = await this.find(filter);
    return items[0] || null;
  }

  async findById(id) {
    const items = this._read();
    return items.find(item => item._id === id || item.id === id) || null;
  }

  async create(docData) {
    const items = this._read();
    const newDoc = {
      _id: crypto.randomBytes(12).toString('hex'),
      ...docData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    items.push(newDoc);
    this._write(items);
    return newDoc;
  }

  async findByIdAndUpdate(id, updateData, options = {}) {
    const items = this._read();
    const index = items.findIndex(item => item._id === id || item.id === id);
    if (index === -1) return null;
    
    // Handle $set if provided or direct object
    const payload = updateData.$set ? { ...items[index], ...updateData.$set } : { ...items[index], ...updateData };
    payload.updatedAt = new Date().toISOString();
    items[index] = payload;
    this._write(items);
    return payload;
  }

  async findByIdAndDelete(id) {
    const items = this._read();
    const item = items.find(item => item._id === id || item.id === id);
    if (!item) return null;
    const remaining = items.filter(i => i._id !== id && i.id !== id);
    this._write(remaining);
    return item;
  }

  async countDocuments(filter = {}) {
    const matches = await this.find(filter);
    return matches.length;
  }
}

// Wrapper to switch seamlessly between Mongoose model and LocalCollection
function createModelAdapter(mongooseModel, collectionName) {
  const localColl = new LocalCollection(collectionName);

  return {
    get isMongoose() {
      return getDBStatus().isConnected;
    },
    async find(filter = {}) {
      if (getDBStatus().isConnected) {
        return mongooseModel.find(filter).sort({ createdAt: -1 });
      }
      return localColl.find(filter);
    },
    async findOne(filter = {}) {
      if (getDBStatus().isConnected) {
        return mongooseModel.findOne(filter);
      }
      return localColl.findOne(filter);
    },
    async findById(id) {
      if (getDBStatus().isConnected) {
        return mongooseModel.findById(id);
      }
      return localColl.findById(id);
    },
    async create(data) {
      if (getDBStatus().isConnected) {
        return mongooseModel.create(data);
      }
      return localColl.create(data);
    },
    async findByIdAndUpdate(id, data, options = { new: true }) {
      if (getDBStatus().isConnected) {
        return mongooseModel.findByIdAndUpdate(id, data, options);
      }
      return localColl.findByIdAndUpdate(id, data, options);
    },
    async findByIdAndDelete(id) {
      if (getDBStatus().isConnected) {
        return mongooseModel.findByIdAndDelete(id);
      }
      return localColl.findByIdAndDelete(id);
    },
    async countDocuments(filter = {}) {
      if (getDBStatus().isConnected) {
        return mongooseModel.countDocuments(filter);
      }
      return localColl.countDocuments(filter);
    }
  };
}

module.exports = { createModelAdapter, LocalCollection };
