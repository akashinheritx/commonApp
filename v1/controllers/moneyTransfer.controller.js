var braintree = require('braintree');

exports.moneyTransfer = function(req, res, next) {
    var gateway = braintree.connect({
      environment: braintree.Environment.Sandbox,
      // Use your own credentials from the sandbox Control Panel here
      merchantId: 'nzhdfw9kdxxzykpk',
      publicKey: 'ynpzs9why2v82yjy',
      privateKey: '62a6bd46a99b31ed73fe1b91086aaff4'
    });
  
    // Use the payment method nonce here
    amount = req.body.amount;
    var nonceFromTheClient = req.body.paymentMethodNonce;
    // Create a new transaction for $10
    var newTransaction = gateway.transaction.sale({
    //   amount: '10.00',
      amount,
      paymentMethodNonce: nonceFromTheClient,
      options: {
        // This option requests the funds from the transaction
        // once it has been authorized successfully
        submitForSettlement: true
      }
    }, function(error, result) {
        if (result) {
          res.send(result);
        } else {
          res.status(500).send(error);
        }
    });
  };