export default function FruitBasket(pool) {
  async function addBasket(type, qty, price) {
    await pool.query(
      'INSERT INTO fruit_basket(type, qty, unit_price) VALUES ($1,$2,$3)',
      [type, qty, price],
    );
  }

  async function getAllBaskets() {
    const result = await pool.query(
      'SELECT qty,type,unit_price FROM fruit_basket',
    );
    return result.rows;
  }

  async function getAllOfType(type) {
    const result = await pool.query(
      'SELECT qty,type,unit_price FROM fruit_basket WHERE type = $1',
      [type],
    );
    return result.rows;
  }

  async function updateQty(type, price, newQty) {
    const result = await pool.query(
      'UPDATE fruit_basket SET qty = $1 WHERE type = $2 AND unit_price = $3 RETURNING qty, type, unit_price',
      [newQty, type, price],
    );
    return result.rows;
  }

  async function getBasketCost(type, price) {
    const result = await pool.query(
      'SELECT unit_price*qty AS total_cost FROM fruit_basket WHERE type = $1 AND unit_price = $2',
      [type, price],
    );
    return parseFloat(result.rows[0]['total_cost']);
  }

  async function getTypeCost(type) {
    const result = await pool.query(
      'SELECT SUM(unit_price*qty) AS total_cost FROM fruit_basket WHERE type = $1',
      [type],
    );
    return parseFloat(result.rows[0]['total_cost']);
  }

  return {
    addBasket,
    getAllBaskets,
    getAllOfType,
    updateQty,
    getBasketCost,
    getTypeCost,
  };
}
