/**
 * Diya Model - Represents a virtual diya lit for someone
 * 
 * Features:
 * - 24-hour auto-expiry
 * - Stored in IndexedDB (offline-first)
 * - Unique ID for each diya
 */

export interface Diya {
  /**
   * Unique identifier (generated using timestamp + random)
   */
  id: string;
  
  /**
   * Name of the person the diya is lit for
   * Max 20 characters
   */
  name: string;
  
  /**
   * Timestamp when diya was lit (milliseconds)
   */
  timestamp: number;
  
  /**
   * Expiry timestamp (timestamp + 24 hours)
   */
  expiresAt: number;
}

/**
 * Diya creation request (used in modal form)
 */
export interface CreateDiyaRequest {
  name: string;
}
