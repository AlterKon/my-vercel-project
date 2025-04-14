const MOMO_ACCOUNT = {
    receiverPhone: "0794633232",
    receiverName: "Nguyen Chanh Cong",
};
  
exports.generateQRCode = async (transaction) => {
    const amount = transaction.amount;
    const description = `Giao dich #${transaction.transactionId}`;
  
    const momoQrUrl = `https://img.vietqr.io/image/MOMO-${MOMO_ACCOUNT.receiverPhone}-compact.png?amount=${amount}&addInfo=${encodeURIComponent(description)}`;
  
    return momoQrUrl;
};