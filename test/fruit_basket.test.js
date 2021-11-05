import assert from 'assert';
import pg from 'pg';
import FruitBasket from '../fruit_basket.js';

const Pool = pg.Pool;

const connectionString =
  process.env.DATABASE_URL || 'postgresql://localhost:5433/fruit_tests';

const pool = new Pool({
  connectionString,
});

const fruitBasket = FruitBasket(pool);

describe('The FruitBasket factory function', () => {
  beforeEach(async () => {
    await pool.query('DELETE FROM fruit_basket');
  });
  it('should create a new fruit basket for a given fruit type, qty & fruit price.', async () => {
    await fruitBasket.addBasket('apple', 10, 4.99);
    await fruitBasket.addBasket('kiwi', 14, 8.99);
    await fruitBasket.addBasket('apple', 17, 5.99);
    await fruitBasket.addBasket('mango', 5, 14.99);
    const allBaskets = [
      {
        qty: 10,
        type: 'apple',
        unit_price: '4.99',
      },
      {
        qty: 14,
        type: 'kiwi',
        unit_price: '8.99',
      },
      {
        qty: 17,
        type: 'apple',
        unit_price: '5.99',
      },
      {
        qty: 5,
        type: 'mango',
        unit_price: '14.99',
      },
    ];

    assert.deepStrictEqual(await fruitBasket.getAllBaskets(), allBaskets);
  });
  it('should find all the fruit baskets for a given fruit type.', async () => {
    await fruitBasket.addBasket('pineapple', 11, 14.99);
    await fruitBasket.addBasket('kiwi', 14, 8.99);
    await fruitBasket.addBasket('pineapple', 18, 19.99);
    await fruitBasket.addBasket('mango', 19, 19.99);
    const pineappleBaskets = [
      {
        qty: 11,
        type: 'pineapple',
        unit_price: '14.99',
      },
      {
        qty: 18,
        type: 'pineapple',
        unit_price: '19.99',
      },
    ];
    assert.deepStrictEqual(
      await fruitBasket.getAllOfType('pineapple'),
      pineappleBaskets,
    );
  });
  it('should update the number of fruit in a given basket.', async () => {
    await fruitBasket.addBasket('pineapple', 11, 14.99);
    await fruitBasket.addBasket('kiwi', 14, 8.99);
    await fruitBasket.addBasket('pineapple', 18, 19.99);
    await fruitBasket.addBasket('mango', 19, 19.99);
    const updatedBasket = [
      {
        qty: 5,
        type: 'pineapple',
        unit_price: '19.99',
      },
    ];
    assert.deepStrictEqual(
      await fruitBasket.updateQty('pineapple', 19.99, 5),
      updatedBasket,
    );
  });
  it('should show the total price for a given fruit basket.', async () => {
    await fruitBasket.addBasket('pineapple', 11, 14.99);
    await fruitBasket.addBasket('kiwi', 14, 8.99);
    await fruitBasket.addBasket('pineapple', 18, 19.99);
    await fruitBasket.addBasket('mango', 19, 19.99);
    assert.strictEqual(await fruitBasket.getBasketCost('kiwi', 8.99), 125.86);
  });
  it('should show the sum of the total of the fruit baskets for a given fruit type.', async () => {
    await fruitBasket.addBasket('pineapple', 11, 14.99);
    await fruitBasket.addBasket('kiwi', 14, 8.99);
    await fruitBasket.addBasket('pineapple', 18, 19.99);
    await fruitBasket.addBasket('mango', 19, 19.99);
    assert.strictEqual(await fruitBasket.getTypeCost('pineapple'), 524.71);
  });
});
