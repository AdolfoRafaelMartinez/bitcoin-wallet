import * as bitcoin from 'bitcoinjs-lib';
import ECPairFactory from 'ecpair';
import * as ecc from 'tiny-secp256k1';
import axios from 'axios';

const ECPair = ECPairFactory(ecc);
// Use testnet for safety
const network = bitcoin.networks.testnet; 
