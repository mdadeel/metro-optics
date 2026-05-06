// Base Repository Class
export class BaseRepository {
  constructor(firestoreService) {
    this.firestore = firestoreService
    this.collection = null
  }
  
  // Generic CRUD operations
  async create(data) {
    try {
      const docRef = await this.firestore.addDoc(this.collection, data)
      return { id: docRef.id, ...data }
    } catch (error) {
      throw new Error(`Failed to create document: ${error.message}`)
    }
  }
  
  async getAll(options = {}) {
    try {
      let query = this.collection
      
      if (options.orderBy) {
        query = this.firestore.query(query, this.firestore.orderBy(options.orderBy.field, options.orderBy.direction || 'asc'))
      }
      
      if (options.where) {
        options.where.forEach(condition => {
          query = this.firestore.query(query, this.firestore.where(condition.field, condition.operator, condition.value))
        })
      }
      
      if (options.limit) {
        query = this.firestore.query(query, this.firestore.limit(options.limit))
      }
      
      const snapshot = await this.firestore.getDocs(query)
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    } catch (error) {
      throw new Error(`Failed to fetch documents: ${error.message}`)
    }
  }
  
  async getById(id) {
    try {
      const docRef = this.firestore.doc(this.collection, id)
      const docSnap = await this.firestore.getDoc(docRef)
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() }
      }
      return null
    } catch (error) {
      throw new Error(`Failed to fetch document: ${error.message}`)
    }
  }
  
  async update(id, data) {
    try {
      const docRef = this.firestore.doc(this.collection, id)
      await this.firestore.updateDoc(docRef, data)
      return { id, ...data }
    } catch (error) {
      throw new Error(`Failed to update document: ${error.message}`)
    }
  }
  
  async delete(id) {
    try {
      const docRef = this.firestore.doc(this.collection, id)
      await this.firestore.deleteDoc(docRef)
      return true
    } catch (error) {
      throw new Error(`Failed to delete document: ${error.message}`)
    }
  }
  
  // Real-time subscription
  subscribe(callback, options = {}) {
    try {
      let query = this.collection
      
      if (options.orderBy) {
        query = this.firestore.query(query, this.firestore.orderBy(options.orderBy.field, options.orderBy.direction || 'asc'))
      }
      
      if (options.where) {
        options.where.forEach(condition => {
          query = this.firestore.query(query, this.firestore.where(condition.field, condition.operator, condition.value))
        })
      }
      
      return this.firestore.onSnapshot(query, (snapshot) => {
        const documents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        callback(documents)
      })
    } catch (error) {
      throw new Error(`Failed to subscribe to collection: ${error.message}`)
    }
  }
}