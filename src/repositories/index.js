// Repository index file - exports all repositories
import { ProductRepository } from './ProductRepository'
import { OrderRepository } from './OrderRepository'
import { UserRepository } from './UserRepository'
import { db, hasFirebaseConfig } from '../config/firebase'
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

// Firestore service wrapper — handles unconfigured Firebase gracefully
class FirestoreService {
  constructor(db) {
    this.db = db
    this.configured = hasFirebaseConfig
  }

  collection(db, collectionName) {
    this._guard()
    return collection(db, collectionName)
  }

  _guard() {
    if (!this.configured) {
      throw new Error('Firebase not configured. Set VITE_FIREBASE_API_KEY and VITE_FIREBASE_PROJECT_ID in .env')
    }
  }

  async addDoc(collection, data) {
    this._guard()
    return addDoc(collection, data)
  }

  async updateDoc(docRef, data) {
    this._guard()
    return updateDoc(docRef, data)
  }

  async deleteDoc(docRef) {
    this._guard()
    return deleteDoc(docRef)
  }

  async getDoc(docRef) {
    this._guard()
    return getDoc(docRef)
  }

  async getDocs(queryRef) {
    this._guard()
    return getDocs(queryRef)
  }

  orderBy(field, direction = 'asc') {
    this._guard()
    return orderBy(field, direction)
  }

  where(field, op, value) {
    this._guard()
    return where(field, op, value)
  }

  doc(collectionRef, docId) {
    this._guard()
    return doc(collectionRef, docId)
  }

  query(queryRef, ...constraints) {
    this._guard()
    return query(queryRef, ...constraints)
  }

  limit(count) {
    this._guard()
    return limit(count)
  }

  onSnapshot(queryRef, callback, errorCallback) {
    this._guard()
    return onSnapshot(queryRef, callback, errorCallback)
  }
}

// Create firestore service instance
export const firestoreService = new FirestoreService(db)

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