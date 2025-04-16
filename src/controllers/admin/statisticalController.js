const pool = require('../../config/database');

const StatisticalHomePage = async (req, res) => {
    try {
      const [rows] = await pool.execute(`
        SELECT 
          DATE_FORMAT(CreatedAt, '%Y-%m') AS Month,
          SUM(Amount) AS TotalIncome,
          COUNT(*) AS TotalTransactions
        FROM Transactions
        WHERE Status = 'completed'
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