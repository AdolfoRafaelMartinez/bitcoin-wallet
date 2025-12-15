import * as ecc from 'tiny-secp256k1';
import { ECPairFactory } from 'ecpair';
import * as bitcoin from 'bitcoinjs-lib';
import bip39 from 'bip39';
import { BIP32Factory } from 'bip32';
import { Buffer } from 'buffer';

const ECPair = ECPairFactory(ecc);
const bip32 = BIP32Factory(ecc);

const network = bitcoin.networks.testnet; // Always use testnet for testing
const path = `m/49'/1'/0'/0/0`; // Derive a SegWit address (P2WPKH-nested-in-P2SH)

export function createHDWallet() {
  // 1. Generate a 12-word mnemonic
  const mnemonic = bip39.generateMnemonic(); // mnemonic code generation for deterministic wallets

  // 2. Convert mnemonic to seed
  const seed = bip39.mnemonicToSeedSync(mnemonic); // derives a 64-byte binary seed

  // 3. Create HD root key
  const root = bip32.fromSeed(seed, network);

  // 4. Derive key for first address
  const account = root.derivePath(path);
  const { address } = bitcoin.payments.p2sh({
    redeem: bitcoin.payments.p2wpkh({
      pubkey: Buffer.from(account.publicKey),
      network
    }),
    network
  });

  return {
    mnemonic,
    address,
    privateKey: account.toWIF()
  };
}
