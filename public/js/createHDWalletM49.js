import * as ecc from 'tiny-secp256k1';
import { ECPairFactory } from 'ecpair';
import * as bitcoin from 'bitcoinjs-lib';
import bip39 from 'bip39';
import { BIP32Factory } from 'bip32';
import { Buffer } from 'buffer';

const ECPair = ECPairFactory(ecc);
const bip32 = BIP32Factory(ecc);

const network = bitcoin.networks.testnet;
const path_prefix = `m/49'/1'/0'/0`; 

export function createHDWallet(mnemonic) {
  // 1. Generate a 12-word mnemonic if not provided
  if (!mnemonic) {
    mnemonic = bip39.generateMnemonic();
  }

  // 2. Convert mnemonic to seed
  const seed = bip39.mnemonicToSeedSync(mnemonic); 

  // 3. Create HD root key
  const root = bip32.fromSeed(seed, network);

  // 5. Derive the next 10 child keys
  const childKeys = [];
  for (let i = 0; i <= 10; i++) {
    const childAccount = root.derivePath(`${path_prefix}/${i}`);
    const { address: childAddress } = bitcoin.payments.p2sh({
        redeem: bitcoin.payments.p2wpkh({
            pubkey: Buffer.from(childAccount.publicKey),
            network
        }),
        network
    });
    childKeys.push({
        path: `${path_prefix}/${i}`,
        address: childAddress,
        privateKey: childAccount.privateKey.toString('hex'),
        publicKey: childAccount.publicKey.toString('hex')
    });
  }

  return {
    mnemonic,
    seed,
    network,
    root,
    childKeys
  };
}