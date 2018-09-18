var fs = require('fs');
var path = require('path');
var net = require('net');
var Web3 = require('web3');
var config = require('../config/config');
var TruffleContract = require("truffle-contract");
var contracts = {};

var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "negative connect arrest will sunset useful typical alley chair second average acid";

//var provider = new HDWalletProvider(mnemonic,"https://ropsten.infura.io/v3/98bf072ef7824fa989adac14304314a2");
//var web3Provider = provider;

var web3Provider = new Web3.providers.HttpProvider(config.localRPC);
var web3 = new Web3(web3Provider);

fs.readFile(path.join(__dirname, config.TNCoinPath), 'utf8', function(err, data) {
  if (!err) {
    // Get the necessary contract artifact file and instantiate it with truffle-contract.
    var TNCoinArtifact = JSON.parse(data);

    contracts.TNCoin = TruffleContract(TNCoinArtifact);

    // Set the provider for our contract.
    contracts.TNCoin.setProvider(web3Provider);
  }

});


exports.total_accounts = function (req, res) {
  var accounts;
  web3.eth.getAccounts(function(err, acc) {
    accounts = acc;

    res.writeHead(200,{'Content-Type':'application/json;charset=utf-8'});
    var data = {
            "accounts": accounts
    };
    data = JSON.stringify(data);
    var callback = req.query.callback+'('+data+');';
    res.end(callback);
  });
};

exports.new_account = function (req, res) {
  web3.personal.newAccount(req.query.pwd, function(err, account){
    res.writeHead(200,{'Content-Type':'application/json;charset=utf-8'});
    var data = {
            "account": account
    };
    data = JSON.stringify(data);
    var callback = req.query.callback+'('+data+');';
    res.end(callback);
  });
};

exports.get_balance = function (req, res) {
  let balance = 0;
  res.writeHead(200,{'Content-Type':'application/json;charset=utf-8'});
  var data = {};
  var callback;
  data.account = req.query.account;
  data.name = req.query.symbol;

  try {
    if (req.query.symbol == "ETH") {
       web3.eth.getBalance(req.query.account, function(err, balances){

          balances = web3.fromWei(balances ,'ether');
          balance = balances.toString(10);

          //res.send({"account":req.query.account, "balance": balance, "name": "ETH"});
          data.balance = balance;
          data = JSON.stringify(data);
          callback = req.query.callback+'('+data+');';
          res.end(callback);
       });
    } else if (req.query.symbol == "TNC") {

        contracts.TNCoin.deployed().then(function(instance) {

          TNCoinInstance = instance;

          return TNCoinInstance.balanceOf(req.query.account);
        }).then(function(result) {

          //res.send({"account":req.query.account, "balance": result, "name": "TNC"});
          data.balance = result;
          data = JSON.stringify(data);
          callback = req.query.callback+'('+data+');';
          res.end(callback);
        }).catch(function(err) {

          //res.send({"account":req.query.account, "balance": 0, "name": "TNC"});
          data.balance = 0;
          data = JSON.stringify(data);
          callback = req.query.callback+'('+data+');';
          res.end(callback);
        });
    } else {
      data.balance = 0;
      data = JSON.stringify(data);
      callback = req.query.callback+'('+data+');';
      res.end(callback);
    }
  } catch (err) {
    console.log(err);
    data.balance = 0;
    data = JSON.stringify(data);
    callback = req.query.callback+'('+data+');';
    res.end(callback);

  }
};

exports.transfer = function (req, res) {
  // console.log(req.query)
  res.writeHead(200,{'Content-Type':'application/json;charset=utf-8'});
  var data = {};
  var callback;

  const newPromise = new Promise(function(resolve, reject) {
    var ret = web3.personal.unlockAccount(req.query.from, req.query.password);

    if (ret)
        resolve(req);
    else
        reject(ret);
  }).then(ret => {

    if(req.query.symbol == "ETH") {
      web3.eth.sendTransaction({
        from: req.query.from,
        to: req.query.to,
        value: web3.toWei(req.query.amount ,'ether')
      },
      function(error, result){
          if(!error) {
            /*
              res.send({'status':'success',
                        'hash': result});
            */
              data.status = 'success';
              data.hash = result;

          } else {
              //res.send({'status':'fail'});
              data.status = 'fail';
          }
          data = JSON.stringify(data);
          callback = req.query.callback+'('+data+');';
          res.end(callback);
      });

    }else if(req.query.symbol == "TNC") {

      contracts.TNCoin.deployed().then(function(instance) {

        TNCoinInstance = instance;

        return TNCoinInstance.transfer(req.query.to, req.query.amount, {from: req.query.from, gas: 3000000});
      }).then(function(result) {
        /*
        res.send({'status':'success',
                  'hash': result.receipt.transactionHash});
                  */
        data.status = 'success';
        data.hash = result.receipt.transactionHash;
        data = JSON.stringify(data);
        callback = req.query.callback+'('+data+');';
        res.end(callback);

      }).catch(function(err) {
        //res.send({'status':'fail'});
        data.status = 'fail';
        data = JSON.stringify(data);
        callback = req.query.callback+'('+data+');';
        res.end(callback);

      });

    }
  }).catch(ret => {
    //res.send({'status':'fail'});
    data.status = 'fail';
    data = JSON.stringify(data);
    callback = req.query.callback+'('+data+');';
    res.end(callback);
  });

};
