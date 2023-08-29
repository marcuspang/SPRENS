// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

import "forge-std/Script.sol";

import "../src/SprensAccount.sol";

import "tokenbound/src/AccountProxy.sol";

contract DeployAccount is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("MAINNET_ACCOUNT_DEPLOYER");
        vm.startBroadcast(deployerPrivateKey);

        SprensAccount implementation = new SprensAccount{
            salt: 0x6551655165516551655165516551655165516551655165516551655165516551
        }(
            0x2D4d71C69b5631b557a4de7bD8aF82e2202da856, // guardian
            0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789 // entry point
        );

        new AccountProxy{
            salt: 0x6551655165516551655165516551655165516551655165516551655165516551
        }(address(SprensAccount));

        vm.stopBroadcast();
    }
}
