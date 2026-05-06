import { BaseRepository } from './BaseRepository'

export class UserRepository extends BaseRepository {
  constructor(firestoreService) {
    super(firestoreService)
    this.collection = firestoreService.collection(firestoreService.db, 'users')
  }
  
  // User-specific methods
  async createUserProfile(uid, userData) {
    const user = {
      uid,
      ...userData,
      createdAt: new Date().toISOString(),
      role: userData.role || 'customer'
    }
    return this.create(user)
  }
  
  async getUserProfile(uid) {
    return this.getById(uid)
  }
  
  async updateUserProfile(uid, userData) {
    return this.update(uid, {
      ...userData,
      updatedAt: new Date().toISOString()
    })
  }
  
  async checkAdminStatus(uid) {
    const user = await this.getUserProfile(uid)
    return user?.role === 'admin'
  }
  
  // Address management
  async addAddress(uid, address) {
    const user = await this.getUserProfile(uid)
    if (!user) throw new Error('User not found')
    
    const addresses = user.addresses || []
    addresses.push({
      ...address,
      id: Date.now().toString(),
      isDefault: addresses.length === 0 // First address is default
    })
    
    return this.updateUser(uid, { addresses })
  }
  
  async updateAddress(uid, addressId, addressData) {
    const user = await this.getUserProfile(uid)
    if (!user) throw new Error('User not found')
    
    const addresses = user.addresses || []
    const addressIndex = addresses.findIndex(a => a.id === addressId)
    
    if (addressIndex === -1) throw new Error('Address not found')
    
    addresses[addressIndex] = { ...addresses[addressIndex], ...addressData }
    
    return this.updateUser(uid, { addresses })
  }
  
  async removeAddress(uid, addressId) {
    const user = await this.getUserProfile(uid)
    if (!user) throw new Error('User not found')
    
    const addresses = user.addresses || []
    const filteredAddresses = addresses.filter(a => a.id !== addressId)
    
    // If removed address was default, set first remaining as default
    if (addresses.find(a => a.id === addressId)?.isDefault && filteredAddresses.length > 0) {
      filteredAddresses[0].isDefault = true
    }
    
    return this.updateUser(uid, { addresses: filteredAddresses })
  }
  
  async setDefaultAddress(uid, addressId) {
    const user = await this.getUserProfile(uid)
    if (!user) throw new Error('User not found')
    
    const addresses = user.addresses || []
    
    // Reset all addresses to non-default
    const updatedAddresses = addresses.map(address => ({
      ...address,
      isDefault: address.id === addressId
    }))
    
    return this.updateUser(uid, { addresses: updatedAddresses })
  }
  
  // Prescription management
  async addPrescription(uid, prescription) {
    const user = await this.getUserProfile(uid)
    if (!user) throw new Error('User not found')
    
    const prescriptions = user.prescriptions || []
    prescriptions.push({
      ...prescription,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    })
    
    return this.updateUser(uid, { prescriptions })
  }
  
  async updatePrescription(uid, prescriptionId, prescriptionData) {
    const user = await this.getUserProfile(uid)
    if (!user) throw new Error('User not found')
    
    const prescriptions = user.prescriptions || []
    const prescriptionIndex = prescriptions.findIndex(p => p.id === prescriptionId)
    
    if (prescriptionIndex === -1) throw new Error('Prescription not found')
    
    prescriptions[prescriptionIndex] = { 
      ...prescriptions[prescriptionIndex], 
      ...prescriptionData,
      updatedAt: new Date().toISOString()
    }
    
    return this.updateUser(uid, { prescriptions })
  }
  
  async removePrescription(uid, prescriptionId) {
    const user = await this.getUserProfile(uid)
    if (!user) throw new Error('User not found')
    
    const prescriptions = user.prescriptions || []
    const filteredPrescriptions = prescriptions.filter(p => p.id !== prescriptionId)
    
    return this.updateUser(uid, { prescriptions: filteredPrescriptions })
  }
  
  // Private helper methods
  async updateUser(uid, userData) {
    return this.update(uid, userData)
  }
}