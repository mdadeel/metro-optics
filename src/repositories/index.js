// Repository index file - exports all repositories
import { ProductRepository } from './ProductRepository'
import { OrderRepository } from './OrderRepository'
import { UserRepository } from './UserRepository'
import { db } from '../config/firebase'
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
  where,
  limit,
  onSnapshot
} from 'firebase/firestore'

// Firestore service wrapper
class FirestoreService {
  constructor(db) {
    this.db = db
  }
  
  collection(db, collectionName) {
    return collection(db, collectionName)
  }
  
  doc(collection, docId) {
    return doc(collection, docId)
  }
  
  async addDoc(collection, data) {
    return addDoc(collection, data)
  }
  
  async updateDoc(doc, data) {
    return updateDoc(doc, data)
  }
  
  async deleteDoc(doc) {
    return deleteDoc(doc)
  }
  
  async getDoc(doc) {
    return getDoc(doc)
  }
  
  async getDocs(query) {
    return getDocs(query)
  }
  
  query(collection, ...constraints) {
    return query(collection, ...constraints)
  }
  
  orderBy(field, direction = 'asc') {
    return orderBy(field, direction)
  }
  
  where(field, operator, value) {
    return where(field, operator, value)
  }
  
  limit(count) {
    return limit(count)
  }
  
  onSnapshot(query, callback, errorCallback) {
    return onSnapshot(query, callback, errorCallback)
  }
}

// Create firestore service instance
const firestoreService = new FirestoreService(db)

// Initialize repositories
export const productRepository = new ProductRepository(firestoreService)
export const orderRepository = new OrderRepository(firestoreService)
export const userRepository = new UserRepository(firestoreService)

export {
  ProductRepository,
  OrderRepository,
  UserRepository,
  FirestoreService
}