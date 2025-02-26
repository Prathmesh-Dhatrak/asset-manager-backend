import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

/**
 * Service for file-based data operations
 */
class FileService {
  /**
   * Reads data from a JSON file
   * @param filepath Path to the JSON file
   * @returns Array of data
   */
  async readData<T>(filepath: string): Promise<T[]> {
    try {
      // Check if file exists, if not create it with an empty array
      try {
        await fs.access(filepath);
      } catch {
        await fs.writeFile(filepath, JSON.stringify([], null, 2));
        return [];
      }

      const data = await fs.readFile(filepath, 'utf8');
      return JSON.parse(data) as T[];
    } catch (error) {
      console.error(`Error reading data from ${filepath}:`, error);
      return [];
    }
  }

  /**
   * Writes data to a JSON file
   * @param filepath Path to the JSON file
   * @param data Data to write
   */
  async writeData<T>(filepath: string, data: T[]): Promise<void> {
    try {
      await fs.writeFile(filepath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(`Error writing data to ${filepath}:`, error);
      throw new Error(`Failed to write data to ${filepath}`);
    }
  }

  /**
   * Finds an entity by ID
   * @param filepath Path to the JSON file
   * @param id ID of the entity to find
   * @returns Found entity or null
   */
  async findById<T extends { id: string }>(
    filepath: string,
    id: string
  ): Promise<T | null> {
    const data = await this.readData<T>(filepath);
    const entity = data.find((item) => item.id === id);
    return entity || null;
  }

  /**
   * Creates a new entity
   * @param filepath Path to the JSON file
   * @param data Entity data (without ID)
   * @returns Created entity with ID
   */
  async create<T>(filepath: string, data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    const allData = await this.readData<T>(filepath);
    
    // Create new entity with ID and timestamps
    const newEntity = {
      ...data,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as unknown as T;
    
    allData.push(newEntity);
    await this.writeData(filepath, allData);
    
    return newEntity;
  }

  /**
   * Updates an existing entity
   * @param filepath Path to the JSON file
   * @param id ID of the entity to update
   * @param data Updated data
   * @returns Updated entity
   */
  async update<T extends { id: string; updatedAt?: Date }>(
    filepath: string,
    id: string,
    data: Partial<T>
  ): Promise<T> {
    const allData = await this.readData<T>(filepath);
    const entityIndex = allData.findIndex((item) => item.id === id);
    
    if (entityIndex === -1) {
      throw new Error(`Entity with ID ${id} not found`);
    }
    
    // Update entity
    const updatedEntity = {
      ...allData[entityIndex],
      ...data,
      updatedAt: new Date(),
    } as T;
    
    allData[entityIndex] = updatedEntity;
    await this.writeData(filepath, allData);
    
    return updatedEntity;
  }

  /**
   * Deletes an entity
   * @param filepath Path to the JSON file
   * @param id ID of the entity to delete
   * @returns Whether deletion was successful
   */
  async delete<T extends { id: string }>(
    filepath: string,
    id: string
  ): Promise<boolean> {
    const allData = await this.readData<T>(filepath);
    const initialLength = allData.length;
    
    const filteredData = allData.filter((item) => item.id !== id);
    
    if (filteredData.length === initialLength) {
      return false; // Nothing was deleted
    }
    
    await this.writeData(filepath, filteredData);
    return true;
  }

  /**
   * Queries entities with a predicate function
   * @param filepath Path to the JSON file
   * @param predicate Predicate function for filtering
   * @returns Filtered entities
   */
  async query<T>(
    filepath: string,
    predicate: (item: T) => boolean
  ): Promise<T[]> {
    const allData = await this.readData<T>(filepath);
    return allData.filter(predicate);
  }
}

export default new FileService();