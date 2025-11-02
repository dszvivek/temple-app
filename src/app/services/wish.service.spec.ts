import { TestBed } from '@angular/core/testing';
import { WishService } from './wish.service';
import { Wish, WishStatus, WishCategory } from '../models/wish.model';
import * as localforage from 'localforage';

describe('WishService', () => {
  let service: WishService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WishService]
    });
    service = TestBed.inject(WishService);
  });

  afterEach(async () => {
    // Clear all wishes after each test
    await service.clearAllWishes();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createWish', () => {
    it('should create a new wish with default status CREATED', async () => {
      const wishData = {
        title: 'Test Wish',
        description: 'Test Description',
        category: WishCategory.GENERAL
      };

      const wish = await service.createWish(wishData);

      expect(wish).toBeDefined();
      expect(wish.id).toBeDefined();
      expect(wish.title).toBe('Test Wish');
      expect(wish.description).toBe('Test Description');
      expect(wish.category).toBe(WishCategory.GENERAL);
      expect(wish.status).toBe(WishStatus.CREATED);
      expect(wish.createdAt).toBeInstanceOf(Date);
    });

    it('should create wish with optional fields', async () => {
      const wishData = {
        title: 'Test Wish',
        description: 'Test Description',
        category: WishCategory.HEALTH,
        donationAmount: 101,
        offeringType: 'Flowers'
      };

      const wish = await service.createWish(wishData);

      expect(wish.donationAmount).toBe(101);
      expect(wish.offeringType).toBe('Flowers');
    });

    it('should add created wish to the wishes list', async () => {
      const wishData = {
        title: 'Test Wish',
        description: 'Test Description',
        category: WishCategory.GENERAL
      };

      await service.createWish(wishData);
      const wishes = service.getAllWishes();

      expect(wishes.length).toBe(1);
      expect(wishes[0].title).toBe('Test Wish');
    });
  });

  describe('activateWish', () => {
    it('should activate a wish and set activatedAt date', async () => {
      const wish = await service.createWish({
        title: 'Test Wish',
        description: 'Test Description',
        category: WishCategory.GENERAL
      });

      await service.activateWish(wish.id);
      const updatedWish = service.getWish(wish.id);

      expect(updatedWish?.status).toBe(WishStatus.ACTIVATED);
      expect(updatedWish?.activatedAt).toBeInstanceOf(Date);
    });

    it('should throw error for non-existent wish', async () => {
      await expectAsync(
        service.activateWish('non-existent-id')
      ).toBeRejectedWithError('Wish not found');
    });
  });

  describe('fulfillWish', () => {
    it('should mark wish as fulfilled and set fulfilledAt date', async () => {
      const wish = await service.createWish({
        title: 'Test Wish',
        description: 'Test Description',
        category: WishCategory.GENERAL
      });

      await service.activateWish(wish.id);
      await service.fulfillWish(wish.id);
      
      const updatedWish = service.getWish(wish.id);

      expect(updatedWish?.status).toBe(WishStatus.FULFILLED);
      expect(updatedWish?.fulfilledAt).toBeInstanceOf(Date);
    });

    it('should throw error for non-existent wish', async () => {
      await expectAsync(
        service.fulfillWish('non-existent-id')
      ).toBeRejectedWithError('Wish not found');
    });
  });

  describe('getWish', () => {
    it('should return a wish by ID', async () => {
      const wish = await service.createWish({
        title: 'Test Wish',
        description: 'Test Description',
        category: WishCategory.GENERAL
      });

      const retrievedWish = service.getWish(wish.id);

      expect(retrievedWish).toBeDefined();
      expect(retrievedWish?.id).toBe(wish.id);
    });

    it('should return undefined for non-existent wish', () => {
      const wish = service.getWish('non-existent-id');
      expect(wish).toBeUndefined();
    });
  });

  describe('getAllWishes', () => {
    it('should return empty array when no wishes exist', () => {
      const wishes = service.getAllWishes();
      expect(wishes).toEqual([]);
    });

    it('should return all wishes', async () => {
      await service.createWish({
        title: 'Wish 1',
        description: 'Description 1',
        category: WishCategory.GENERAL
      });

      await service.createWish({
        title: 'Wish 2',
        description: 'Description 2',
        category: WishCategory.HEALTH
      });

      const wishes = service.getAllWishes();
      expect(wishes.length).toBe(2);
    });
  });

  describe('getRecentWishes', () => {
    it('should return wishes sorted by creation date (newest first)', async () => {
      const wish1 = await service.createWish({
        title: 'Old Wish',
        description: 'Description',
        category: WishCategory.GENERAL
      });

      // Wait a bit to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 10));

      const wish2 = await service.createWish({
        title: 'New Wish',
        description: 'Description',
        category: WishCategory.GENERAL
      });

      const recentWishes = service.getRecentWishes(10);

      expect(recentWishes[0].id).toBe(wish2.id);
      expect(recentWishes[1].id).toBe(wish1.id);
    });

    it('should limit number of wishes returned', async () => {
      // Create 15 wishes
      for (let i = 0; i < 15; i++) {
        await service.createWish({
          title: `Wish ${i}`,
          description: 'Description',
          category: WishCategory.GENERAL
        });
      }

      const recentWishes = service.getRecentWishes(5);
      expect(recentWishes.length).toBe(5);
    });
  });

  describe('getWishesByStatus', () => {
    it('should return only wishes with specified status', async () => {
      const wish1 = await service.createWish({
        title: 'Wish 1',
        description: 'Description',
        category: WishCategory.GENERAL
      });

      const wish2 = await service.createWish({
        title: 'Wish 2',
        description: 'Description',
        category: WishCategory.GENERAL
      });

      await service.activateWish(wish2.id);

      const createdWishes = service.getWishesByStatus(WishStatus.CREATED);
      const activatedWishes = service.getWishesByStatus(WishStatus.ACTIVATED);

      expect(createdWishes.length).toBe(1);
      expect(createdWishes[0].id).toBe(wish1.id);
      expect(activatedWishes.length).toBe(1);
      expect(activatedWishes[0].id).toBe(wish2.id);
    });
  });

  describe('deleteWish', () => {
    it('should remove a wish from the list', async () => {
      const wish = await service.createWish({
        title: 'Test Wish',
        description: 'Description',
        category: WishCategory.GENERAL
      });

      expect(service.getAllWishes().length).toBe(1);

      await service.deleteWish(wish.id);

      expect(service.getAllWishes().length).toBe(0);
      expect(service.getWish(wish.id)).toBeUndefined();
    });
  });

  describe('clearAllWishes', () => {
    it('should remove all wishes', async () => {
      await service.createWish({
        title: 'Wish 1',
        description: 'Description',
        category: WishCategory.GENERAL
      });

      await service.createWish({
        title: 'Wish 2',
        description: 'Description',
        category: WishCategory.HEALTH
      });

      expect(service.getAllWishes().length).toBe(2);

      await service.clearAllWishes();

      expect(service.getAllWishes().length).toBe(0);
    });
  });

  describe('getStatistics', () => {
    it('should return correct statistics', async () => {
      const wish1 = await service.createWish({
        title: 'Wish 1',
        description: 'Description',
        category: WishCategory.GENERAL
      });

      const wish2 = await service.createWish({
        title: 'Wish 2',
        description: 'Description',
        category: WishCategory.GENERAL
      });

      const wish3 = await service.createWish({
        title: 'Wish 3',
        description: 'Description',
        category: WishCategory.GENERAL
      });

      await service.activateWish(wish2.id);
      await service.activateWish(wish3.id);
      await service.fulfillWish(wish3.id);

      const stats = service.getStatistics();

      expect(stats.total).toBe(3);
      expect(stats.activated).toBe(1); // Only wish2 is still activated
      expect(stats.fulfilled).toBe(1); // wish3 is fulfilled
    });

    it('should return zeros when no wishes exist', () => {
      const stats = service.getStatistics();

      expect(stats.total).toBe(0);
      expect(stats.activated).toBe(0);
      expect(stats.fulfilled).toBe(0);
    });
  });
});
