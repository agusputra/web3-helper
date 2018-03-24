export default {
  getNetwork
}

function getNetwork(cb) {
  let net = 'Unknown'

  web3.version.getNetwork((err, netId) => {
    switch (netId) {
      case "1":
        net = "Mainnet";
        break;
      case "2":
        net = "Morden";
        break;
      case "3":
        net = "Ropsten";
        break;
      case "4":
        net = "Rinkeby";
        break;
      case "42":
        net = "Kovan";
        break;
    }

    return cb(null, net);
  });
}