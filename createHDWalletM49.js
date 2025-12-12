import * as ecc from 'tiny-secp256k1';
import { ECPairFactory } from 'ecpair';
import * as bitcoin from 'bitcoinjs-lib';
import bip39 from 'bip39';
import { BIP32Factory } from 'bip32';

const ECPair = ECPairFactory(ecc);
const bip32 = BIP32Factory(ecc);

const network = bitcoin.networks.testnet; // Always use testnet for testing
const path = `m/49'/1'/0'/0/0`; // Derive a SegWit address (P2WPKH-nested-in-P2SH)

function createHDWallet() {
  // 1. Generate a 12-word mnemonic
  const mnemonic = bip39.generateMnemonic(); // mnemonic code generation for deterministic wallets
  console.log("Mnemonic (Seed Phrase):", mnemonic);

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

  console.log("-----------------");
  console.log("New HD Wallet");
  console.log("-----------------");
  console.log("Derived Address:", address);
  console.log("Derived Private Key (WIF):", account.toWIF());
  console.log("-----------------");
}

createHDWallet();
