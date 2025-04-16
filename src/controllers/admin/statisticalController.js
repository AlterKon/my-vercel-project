const pool = require('../../config/database');

const StatisticalHomePage = async (req, res) => {
    try {
      const [rows] = await pool.execute(`
        SELECT 
          DATE_FORMAT(t.CreatedAt, '%Y-%m') AS Month,
          SUM(p.Price) AS TotalIncome,
          COUNT(*) AS TotalTransactions
        FROM Transactions t
        JOIN SubscriptionPlans p ON t.PlanID = p.PlanID
        WHERE t.Status = 'completed'
        GROUP BY Month
        ORDER BY Month DESC
      `);
  
      res.render('admin/statistical_chart.ejs', { monthlyIncome: rows });
    } catch (error) {
      console.error(error);
      res.status(500).send('Lỗi server khi truy xuất thu nhập.');
    }
  }

module.exports ={
    StatisticalHomePage
}