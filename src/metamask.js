export default {
  deployContract,
  submitTx
}

function deployContract(Contract, byteCode, params, options, cb) {
  (!options) && (options = {});

  const data = Contract.new.getData(...params, {
    data: byteCode
  });

  web3.eth.estimateGas({
    data
  }, (err, data) => {
    if (err) {
      return cb(err);
    }

    Contract.new(
      ...params, {
        from: options.creator,
        gas: data + 1,
        gasPrice: options.gasPrice || 30 * 1e9,
        data: byteCode
      },
      (err, data) => {
        // When creating contract, this callback will be called 2 times.
        // The first time data.address will be undefined
        // The second time data.address will be filled

        if (err) {
          return cb(err);
        }

        return cb(null, data);
      })
  })
}

function submitTx(contract, method, params, options, cb) {
  (!options) && (options = {});

  contract[method].estimateGas(
    ...params, {
      value: options.value
    },
    (err, data) => {
      if (err) {
        return cb(err);
      }

      contract[method].sendTransaction(
        ...params, {
          value: options.value || 0,
          gas: data,
          gasPrice: options.gasPrice || 30 * 1e9
        },
        (err, data) => {
          if (err) {
            return cb(err);
          }

          return cb(null, data);
        }
      );
    }
  );
}