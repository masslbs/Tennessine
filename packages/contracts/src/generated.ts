import {
  createUseReadContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
  createUseWriteContract,
} from "wagmi/codegen";

import {
  createReadContract,
  createSimulateContract,
  createWatchContractEvent,
  createWriteContract,
} from "wagmi/codegen";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Eddies
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const eddiesAbi = [
  {
    type: "constructor",
    inputs: [
      { name: "_name", internalType: "string", type: "string" },
      { name: "_symbol", internalType: "string", type: "string" },
      { name: "_decimals", internalType: "uint8", type: "uint8" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [],
    name: "DOMAIN_SEPARATOR",
    outputs: [{ name: "result", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "owner", internalType: "address", type: "address" },
      { name: "spender", internalType: "address", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "result", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "spender", internalType: "address", type: "address" },
      { name: "amount", internalType: "uint256", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [{ name: "owner", internalType: "address", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "result", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "from", internalType: "address", type: "address" },
      { name: "value", internalType: "uint256", type: "uint256" },
    ],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", internalType: "uint8", type: "uint8" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "owner", internalType: "address", type: "address" },
      { name: "spender", internalType: "address", type: "address" },
      { name: "amount", internalType: "uint256", type: "uint256" },
    ],
    name: "directSpendAllowance",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "from", internalType: "address", type: "address" },
      { name: "to", internalType: "address", type: "address" },
      { name: "amount", internalType: "uint256", type: "uint256" },
    ],
    name: "directTransfer",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "to", internalType: "address", type: "address" },
      { name: "value", internalType: "uint256", type: "uint256" },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [],
    name: "name",
    outputs: [{ name: "", internalType: "string", type: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "owner", internalType: "address", type: "address" }],
    name: "nonces",
    outputs: [{ name: "result", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "owner", internalType: "address", type: "address" },
      { name: "spender", internalType: "address", type: "address" },
      { name: "value", internalType: "uint256", type: "uint256" },
      { name: "deadline", internalType: "uint256", type: "uint256" },
      { name: "v", internalType: "uint8", type: "uint8" },
      { name: "r", internalType: "bytes32", type: "bytes32" },
      { name: "s", internalType: "bytes32", type: "bytes32" },
    ],
    name: "permit",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", internalType: "string", type: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "result", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "to", internalType: "address", type: "address" },
      { name: "amount", internalType: "uint256", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "from", internalType: "address", type: "address" },
      { name: "to", internalType: "address", type: "address" },
      { name: "amount", internalType: "uint256", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "owner",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "spender",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "amount",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
    ],
    name: "Approval",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      { name: "from", internalType: "address", type: "address", indexed: true },
      { name: "to", internalType: "address", type: "address", indexed: true },
      {
        name: "amount",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
    ],
    name: "Transfer",
  },
  { type: "error", inputs: [], name: "AllowanceOverflow" },
  { type: "error", inputs: [], name: "AllowanceUnderflow" },
  { type: "error", inputs: [], name: "InsufficientAllowance" },
  { type: "error", inputs: [], name: "InsufficientBalance" },
  { type: "error", inputs: [], name: "InvalidPermit" },
  { type: "error", inputs: [], name: "PermitExpired" },
  { type: "error", inputs: [], name: "TotalSupplyOverflow" },
] as const;

export const eddiesAddress =
  "0xB76331fe2b5a68d9609d7e391827ecB9a82ecaA6" as const;

export const eddiesConfig = { address: eddiesAddress, abi: eddiesAbi } as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PaymentsByAddress
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const paymentsByAddressAbi = [
  {
    type: "constructor",
    inputs: [
      { name: "permit2", internalType: "contract IPermit2", type: "address" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      {
        name: "payments",
        internalType: "struct PaymentRequest[]",
        type: "tuple[]",
        components: [
          { name: "chainId", internalType: "uint256", type: "uint256" },
          { name: "ttl", internalType: "uint256", type: "uint256" },
          { name: "order", internalType: "bytes32", type: "bytes32" },
          { name: "currency", internalType: "address", type: "address" },
          { name: "amount", internalType: "uint256", type: "uint256" },
          { name: "payeeAddress", internalType: "address", type: "address" },
          { name: "isPaymentEndpoint", internalType: "bool", type: "bool" },
          { name: "shopId", internalType: "uint256", type: "uint256" },
          { name: "shopSignature", internalType: "bytes", type: "bytes" },
        ],
      },
      { name: "refunds", internalType: "address payable[]", type: "address[]" },
    ],
    name: "batch",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      {
        name: "payment",
        internalType: "struct PaymentRequest",
        type: "tuple",
        components: [
          { name: "chainId", internalType: "uint256", type: "uint256" },
          { name: "ttl", internalType: "uint256", type: "uint256" },
          { name: "order", internalType: "bytes32", type: "bytes32" },
          { name: "currency", internalType: "address", type: "address" },
          { name: "amount", internalType: "uint256", type: "uint256" },
          { name: "payeeAddress", internalType: "address", type: "address" },
          { name: "isPaymentEndpoint", internalType: "bool", type: "bool" },
          { name: "shopId", internalType: "uint256", type: "uint256" },
          { name: "shopSignature", internalType: "bytes", type: "bytes" },
        ],
      },
      { name: "refund", internalType: "address", type: "address" },
    ],
    name: "getBytecode",
    outputs: [{ name: "", internalType: "bytes", type: "bytes" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      {
        name: "payment",
        internalType: "struct PaymentRequest",
        type: "tuple",
        components: [
          { name: "chainId", internalType: "uint256", type: "uint256" },
          { name: "ttl", internalType: "uint256", type: "uint256" },
          { name: "order", internalType: "bytes32", type: "bytes32" },
          { name: "currency", internalType: "address", type: "address" },
          { name: "amount", internalType: "uint256", type: "uint256" },
          { name: "payeeAddress", internalType: "address", type: "address" },
          { name: "isPaymentEndpoint", internalType: "bool", type: "bool" },
          { name: "shopId", internalType: "uint256", type: "uint256" },
          { name: "shopSignature", internalType: "bytes", type: "bytes" },
        ],
      },
      { name: "refund", internalType: "address", type: "address" },
    ],
    name: "getPaymentAddress",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      {
        name: "payment",
        internalType: "struct PaymentRequest",
        type: "tuple",
        components: [
          { name: "chainId", internalType: "uint256", type: "uint256" },
          { name: "ttl", internalType: "uint256", type: "uint256" },
          { name: "order", internalType: "bytes32", type: "bytes32" },
          { name: "currency", internalType: "address", type: "address" },
          { name: "amount", internalType: "uint256", type: "uint256" },
          { name: "payeeAddress", internalType: "address", type: "address" },
          { name: "isPaymentEndpoint", internalType: "bool", type: "bool" },
          { name: "shopId", internalType: "uint256", type: "uint256" },
          { name: "shopSignature", internalType: "bytes", type: "bytes" },
        ],
      },
    ],
    name: "getPaymentId",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "pure",
  },
  {
    type: "function",
    inputs: [
      { name: "from", internalType: "address", type: "address" },
      {
        name: "payment",
        internalType: "struct PaymentRequest",
        type: "tuple",
        components: [
          { name: "chainId", internalType: "uint256", type: "uint256" },
          { name: "ttl", internalType: "uint256", type: "uint256" },
          { name: "order", internalType: "bytes32", type: "bytes32" },
          { name: "currency", internalType: "address", type: "address" },
          { name: "amount", internalType: "uint256", type: "uint256" },
          { name: "payeeAddress", internalType: "address", type: "address" },
          { name: "isPaymentEndpoint", internalType: "bool", type: "bool" },
          { name: "shopId", internalType: "uint256", type: "uint256" },
          { name: "shopSignature", internalType: "bytes", type: "bytes" },
        ],
      },
    ],
    name: "hasPaymentBeenMade",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      {
        name: "payments",
        internalType: "struct PaymentRequest[]",
        type: "tuple[]",
        components: [
          { name: "chainId", internalType: "uint256", type: "uint256" },
          { name: "ttl", internalType: "uint256", type: "uint256" },
          { name: "order", internalType: "bytes32", type: "bytes32" },
          { name: "currency", internalType: "address", type: "address" },
          { name: "amount", internalType: "uint256", type: "uint256" },
          { name: "payeeAddress", internalType: "address", type: "address" },
          { name: "isPaymentEndpoint", internalType: "bool", type: "bool" },
          { name: "shopId", internalType: "uint256", type: "uint256" },
          { name: "shopSignature", internalType: "bytes", type: "bytes" },
        ],
      },
      { name: "permit2Sigs", internalType: "bytes[]", type: "bytes[]" },
    ],
    name: "multiPay",
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    inputs: [
      {
        name: "payment",
        internalType: "struct PaymentRequest",
        type: "tuple",
        components: [
          { name: "chainId", internalType: "uint256", type: "uint256" },
          { name: "ttl", internalType: "uint256", type: "uint256" },
          { name: "order", internalType: "bytes32", type: "bytes32" },
          { name: "currency", internalType: "address", type: "address" },
          { name: "amount", internalType: "uint256", type: "uint256" },
          { name: "payeeAddress", internalType: "address", type: "address" },
          { name: "isPaymentEndpoint", internalType: "bool", type: "bool" },
          { name: "shopId", internalType: "uint256", type: "uint256" },
          { name: "shopSignature", internalType: "bytes", type: "bytes" },
        ],
      },
    ],
    name: "pay",
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    inputs: [
      {
        name: "payment",
        internalType: "struct PaymentRequest",
        type: "tuple",
        components: [
          { name: "chainId", internalType: "uint256", type: "uint256" },
          { name: "ttl", internalType: "uint256", type: "uint256" },
          { name: "order", internalType: "bytes32", type: "bytes32" },
          { name: "currency", internalType: "address", type: "address" },
          { name: "amount", internalType: "uint256", type: "uint256" },
          { name: "payeeAddress", internalType: "address", type: "address" },
          { name: "isPaymentEndpoint", internalType: "bool", type: "bool" },
          { name: "shopId", internalType: "uint256", type: "uint256" },
          { name: "shopSignature", internalType: "bytes", type: "bytes" },
        ],
      },
    ],
    name: "payNative",
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    inputs: [
      {
        name: "payment",
        internalType: "struct PaymentRequest",
        type: "tuple",
        components: [
          { name: "chainId", internalType: "uint256", type: "uint256" },
          { name: "ttl", internalType: "uint256", type: "uint256" },
          { name: "order", internalType: "bytes32", type: "bytes32" },
          { name: "currency", internalType: "address", type: "address" },
          { name: "amount", internalType: "uint256", type: "uint256" },
          { name: "payeeAddress", internalType: "address", type: "address" },
          { name: "isPaymentEndpoint", internalType: "bool", type: "bool" },
          { name: "shopId", internalType: "uint256", type: "uint256" },
          { name: "shopSignature", internalType: "bytes", type: "bytes" },
        ],
      },
      { name: "permit2signature", internalType: "bytes", type: "bytes" },
    ],
    name: "payToken",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      {
        name: "payment",
        internalType: "struct PaymentRequest",
        type: "tuple",
        components: [
          { name: "chainId", internalType: "uint256", type: "uint256" },
          { name: "ttl", internalType: "uint256", type: "uint256" },
          { name: "order", internalType: "bytes32", type: "bytes32" },
          { name: "currency", internalType: "address", type: "address" },
          { name: "amount", internalType: "uint256", type: "uint256" },
          { name: "payeeAddress", internalType: "address", type: "address" },
          { name: "isPaymentEndpoint", internalType: "bool", type: "bool" },
          { name: "shopId", internalType: "uint256", type: "uint256" },
          { name: "shopSignature", internalType: "bytes", type: "bytes" },
        ],
      },
    ],
    name: "payTokenPreApproved",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      {
        name: "payment",
        internalType: "struct PaymentRequest",
        type: "tuple",
        components: [
          { name: "chainId", internalType: "uint256", type: "uint256" },
          { name: "ttl", internalType: "uint256", type: "uint256" },
          { name: "order", internalType: "bytes32", type: "bytes32" },
          { name: "currency", internalType: "address", type: "address" },
          { name: "amount", internalType: "uint256", type: "uint256" },
          { name: "payeeAddress", internalType: "address", type: "address" },
          { name: "isPaymentEndpoint", internalType: "bool", type: "bool" },
          { name: "shopId", internalType: "uint256", type: "uint256" },
          { name: "shopSignature", internalType: "bytes", type: "bytes" },
        ],
      },
      { name: "refund", internalType: "address payable", type: "address" },
    ],
    name: "processPayment",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "from", internalType: "address", type: "address" },
      {
        name: "payment",
        internalType: "struct PaymentRequest",
        type: "tuple",
        components: [
          { name: "chainId", internalType: "uint256", type: "uint256" },
          { name: "ttl", internalType: "uint256", type: "uint256" },
          { name: "order", internalType: "bytes32", type: "bytes32" },
          { name: "currency", internalType: "address", type: "address" },
          { name: "amount", internalType: "uint256", type: "uint256" },
          { name: "payeeAddress", internalType: "address", type: "address" },
          { name: "isPaymentEndpoint", internalType: "bool", type: "bool" },
          { name: "shopId", internalType: "uint256", type: "uint256" },
          { name: "shopSignature", internalType: "bytes", type: "bytes" },
        ],
      },
    ],
    name: "revertPayment",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "paymentId",
        internalType: "uint256",
        type: "uint256",
        indexed: true,
      },
    ],
    name: "PaymentMade",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "payment",
        internalType: "struct PaymentRequest",
        type: "tuple",
        components: [
          { name: "chainId", internalType: "uint256", type: "uint256" },
          { name: "ttl", internalType: "uint256", type: "uint256" },
          { name: "order", internalType: "bytes32", type: "bytes32" },
          { name: "currency", internalType: "address", type: "address" },
          { name: "amount", internalType: "uint256", type: "uint256" },
          { name: "payeeAddress", internalType: "address", type: "address" },
          { name: "isPaymentEndpoint", internalType: "bool", type: "bool" },
          { name: "shopId", internalType: "uint256", type: "uint256" },
          { name: "shopSignature", internalType: "bytes", type: "bytes" },
        ],
        indexed: false,
      },
    ],
    name: "SweepFailed",
  },
  { type: "error", inputs: [], name: "InvalidPaymentAmount" },
  { type: "error", inputs: [], name: "InvalidPaymentToken" },
  { type: "error", inputs: [], name: "NotPayee" },
  { type: "error", inputs: [], name: "PayeeRefusedPayment" },
  { type: "error", inputs: [], name: "PaymentAlreadyMade" },
  { type: "error", inputs: [], name: "PaymentExpired" },
  { type: "error", inputs: [], name: "PaymentNotMade" },
  { type: "error", inputs: [], name: "WrongChain" },
] as const;

export const paymentsByAddressAddress =
  "0x380E9111Fa6aA3EA50b6db944949801B649A7D67" as const;

export const paymentsByAddressConfig = {
  address: paymentsByAddressAddress,
  abi: paymentsByAddressAbi,
} as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RelayReg
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const relayRegAbi = [
  { type: "constructor", inputs: [], stateMutability: "nonpayable" },
  {
    type: "function",
    inputs: [
      { name: "account", internalType: "address", type: "address" },
      { name: "id", internalType: "uint256", type: "uint256" },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    inputs: [{ name: "owner", internalType: "address", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "result", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "id", internalType: "uint256", type: "uint256" }],
    name: "getApproved",
    outputs: [{ name: "result", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "owner", internalType: "address", type: "address" },
      { name: "operator", internalType: "address", type: "address" },
    ],
    name: "isApprovedForAll",
    outputs: [{ name: "result", internalType: "bool", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "newRelayId", internalType: "uint256", type: "uint256" },
      { name: "relay", internalType: "address", type: "address" },
      { name: "uri", internalType: "string", type: "string" },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [],
    name: "name",
    outputs: [{ name: "", internalType: "string", type: "string" }],
    stateMutability: "pure",
  },
  {
    type: "function",
    inputs: [{ name: "id", internalType: "uint256", type: "uint256" }],
    name: "ownerOf",
    outputs: [{ name: "result", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    name: "relayURIs",
    outputs: [{ name: "", internalType: "string", type: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "from", internalType: "address", type: "address" },
      { name: "to", internalType: "address", type: "address" },
      { name: "id", internalType: "uint256", type: "uint256" },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    inputs: [
      { name: "from", internalType: "address", type: "address" },
      { name: "to", internalType: "address", type: "address" },
      { name: "id", internalType: "uint256", type: "uint256" },
      { name: "data", internalType: "bytes", type: "bytes" },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    inputs: [
      { name: "operator", internalType: "address", type: "address" },
      { name: "isApproved", internalType: "bool", type: "bool" },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [{ name: "interfaceId", internalType: "bytes4", type: "bytes4" }],
    name: "supportsInterface",
    outputs: [{ name: "result", internalType: "bool", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", internalType: "string", type: "string" }],
    stateMutability: "pure",
  },
  {
    type: "function",
    inputs: [{ name: "id", internalType: "uint256", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ name: "", internalType: "string", type: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "from", internalType: "address", type: "address" },
      { name: "to", internalType: "address", type: "address" },
      { name: "id", internalType: "uint256", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    inputs: [
      { name: "relayId", internalType: "uint256", type: "uint256" },
      { name: "uri", internalType: "string", type: "string" },
    ],
    name: "updateURI",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "owner",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "account",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      { name: "id", internalType: "uint256", type: "uint256", indexed: true },
    ],
    name: "Approval",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "owner",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "operator",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "isApproved",
        internalType: "bool",
        type: "bool",
        indexed: false,
      },
    ],
    name: "ApprovalForAll",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      { name: "from", internalType: "address", type: "address", indexed: true },
      { name: "to", internalType: "address", type: "address", indexed: true },
      { name: "id", internalType: "uint256", type: "uint256", indexed: true },
    ],
    name: "Transfer",
  },
  { type: "error", inputs: [], name: "AccountBalanceOverflow" },
  { type: "error", inputs: [], name: "BalanceQueryForZeroAddress" },
  { type: "error", inputs: [], name: "NotOwnerNorApproved" },
  { type: "error", inputs: [], name: "TokenAlreadyExists" },
  { type: "error", inputs: [], name: "TokenDoesNotExist" },
  { type: "error", inputs: [], name: "TransferFromIncorrectOwner" },
  { type: "error", inputs: [], name: "TransferToNonERC721ReceiverImplementer" },
  { type: "error", inputs: [], name: "TransferToZeroAddress" },
] as const;

export const relayRegAddress =
  "0x7877285634BF8c8980Df4afFcBfa94a74158EfB5" as const;

export const relayRegConfig = {
  address: relayRegAddress,
  abi: relayRegAbi,
} as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ShopReg
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const shopRegAbi = [
  {
    type: "constructor",
    inputs: [{ name: "r", internalType: "contract RelayReg", type: "address" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [],
    name: "PERM_addPermission",
    outputs: [{ name: "", internalType: "uint8", type: "uint8" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "PERM_addRelay",
    outputs: [{ name: "", internalType: "uint8", type: "uint8" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "PERM_publishInviteVerifier",
    outputs: [{ name: "", internalType: "uint8", type: "uint8" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "PERM_registerUser",
    outputs: [{ name: "", internalType: "uint8", type: "uint8" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "PERM_removePermission",
    outputs: [{ name: "", internalType: "uint8", type: "uint8" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "PERM_removeRelay",
    outputs: [{ name: "", internalType: "uint8", type: "uint8" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "PERM_removeUser",
    outputs: [{ name: "", internalType: "uint8", type: "uint8" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "PERM_replaceRelay",
    outputs: [{ name: "", internalType: "uint8", type: "uint8" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "PERM_updateRootHash",
    outputs: [{ name: "", internalType: "uint8", type: "uint8" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "user", internalType: "address", type: "address" }],
    name: "_getTokenMessageHash",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "pure",
  },
  {
    type: "function",
    inputs: [
      { name: "shopId", internalType: "uint256", type: "uint256" },
      { name: "user", internalType: "address", type: "address" },
      { name: "perm", internalType: "uint8", type: "uint8" },
    ],
    name: "addPermission",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "shopId", internalType: "uint256", type: "uint256" },
      { name: "relayId", internalType: "uint256", type: "uint256" },
    ],
    name: "addRelay",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "id", internalType: "uint256", type: "uint256" },
      { name: "perms", internalType: "uint256", type: "uint256" },
    ],
    name: "allPermissionsGuard",
    outputs: [],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "account", internalType: "address", type: "address" },
      { name: "id", internalType: "uint256", type: "uint256" },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    inputs: [{ name: "owner", internalType: "address", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "result", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "id", internalType: "uint256", type: "uint256" },
      { name: "user", internalType: "address", type: "address" },
    ],
    name: "getAllPermissions",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "shopId", internalType: "uint256", type: "uint256" }],
    name: "getAllRelays",
    outputs: [{ name: "", internalType: "uint256[]", type: "uint256[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "id", internalType: "uint256", type: "uint256" }],
    name: "getApproved",
    outputs: [{ name: "result", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "shopId", internalType: "uint256", type: "uint256" }],
    name: "getRelayCount",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "id", internalType: "uint256", type: "uint256" },
      { name: "user", internalType: "address", type: "address" },
      { name: "perms", internalType: "uint256", type: "uint256" },
    ],
    name: "hasEnoughPermissions",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "id", internalType: "uint256", type: "uint256" },
      { name: "user", internalType: "address", type: "address" },
      { name: "perm", internalType: "uint8", type: "uint8" },
    ],
    name: "hasPermission",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "owner", internalType: "address", type: "address" },
      { name: "operator", internalType: "address", type: "address" },
    ],
    name: "isApprovedForAll",
    outputs: [{ name: "result", internalType: "bool", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "shopId", internalType: "uint256", type: "uint256" },
      { name: "owner", internalType: "address", type: "address" },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [],
    name: "name",
    outputs: [{ name: "", internalType: "string", type: "string" }],
    stateMutability: "pure",
  },
  {
    type: "function",
    inputs: [{ name: "shopid", internalType: "uint256", type: "uint256" }],
    name: "nonce",
    outputs: [{ name: "", internalType: "uint64", type: "uint64" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "id", internalType: "uint256", type: "uint256" }],
    name: "ownerOf",
    outputs: [{ name: "result", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "id", internalType: "uint256", type: "uint256" },
      { name: "perm", internalType: "uint8", type: "uint8" },
    ],
    name: "permissionGuard",
    outputs: [],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "perms", internalType: "uint8[]", type: "uint8[]" }],
    name: "permsToBitmap",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "pure",
  },
  {
    type: "function",
    inputs: [
      { name: "shopId", internalType: "uint256", type: "uint256" },
      { name: "verifier", internalType: "address", type: "address" },
    ],
    name: "publishInviteVerifier",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "shopId", internalType: "uint256", type: "uint256" },
      { name: "v", internalType: "uint8", type: "uint8" },
      { name: "r", internalType: "bytes32", type: "bytes32" },
      { name: "s", internalType: "bytes32", type: "bytes32" },
      { name: "user", internalType: "address", type: "address" },
    ],
    name: "redeemInvite",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "shopId", internalType: "uint256", type: "uint256" },
      { name: "user", internalType: "address", type: "address" },
      { name: "perms", internalType: "uint256", type: "uint256" },
    ],
    name: "registerUser",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [],
    name: "relayReg",
    outputs: [{ name: "", internalType: "contract RelayReg", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "shopid", internalType: "uint256", type: "uint256" },
      { name: "", internalType: "uint256", type: "uint256" },
    ],
    name: "relays",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "shopId", internalType: "uint256", type: "uint256" },
      { name: "user", internalType: "address", type: "address" },
      { name: "perm", internalType: "uint8", type: "uint8" },
    ],
    name: "removePermission",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "shopId", internalType: "uint256", type: "uint256" },
      { name: "idx", internalType: "uint8", type: "uint8" },
    ],
    name: "removeRelay",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "shopId", internalType: "uint256", type: "uint256" },
      { name: "user", internalType: "address", type: "address" },
    ],
    name: "removeUser",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "shopId", internalType: "uint256", type: "uint256" },
      { name: "idx", internalType: "uint8", type: "uint8" },
      { name: "relayId", internalType: "uint256", type: "uint256" },
    ],
    name: "replaceRelay",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [{ name: "shopid", internalType: "uint256", type: "uint256" }],
    name: "rootHashes",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "from", internalType: "address", type: "address" },
      { name: "to", internalType: "address", type: "address" },
      { name: "id", internalType: "uint256", type: "uint256" },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    inputs: [
      { name: "from", internalType: "address", type: "address" },
      { name: "to", internalType: "address", type: "address" },
      { name: "id", internalType: "uint256", type: "uint256" },
      { name: "data", internalType: "bytes", type: "bytes" },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    inputs: [
      { name: "operator", internalType: "address", type: "address" },
      { name: "isApproved", internalType: "bool", type: "bool" },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "shopId", internalType: "uint256", type: "uint256" },
      { name: "newTokenURI", internalType: "string", type: "string" },
    ],
    name: "setTokenURI",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    name: "shopURIs",
    outputs: [{ name: "", internalType: "string", type: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "interfaceId", internalType: "bytes4", type: "bytes4" }],
    name: "supportsInterface",
    outputs: [{ name: "result", internalType: "bool", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", internalType: "string", type: "string" }],
    stateMutability: "pure",
  },
  {
    type: "function",
    inputs: [{ name: "id", internalType: "uint256", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ name: "", internalType: "string", type: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "from", internalType: "address", type: "address" },
      { name: "to", internalType: "address", type: "address" },
      { name: "id", internalType: "uint256", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    inputs: [
      { name: "shopId", internalType: "uint256", type: "uint256" },
      { name: "hash", internalType: "bytes32", type: "bytes32" },
      { name: "_nonce", internalType: "uint64", type: "uint64" },
    ],
    name: "updateRootHash",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "owner",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "account",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      { name: "id", internalType: "uint256", type: "uint256", indexed: true },
    ],
    name: "Approval",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "owner",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "operator",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "isApproved",
        internalType: "bool",
        type: "bool",
        indexed: false,
      },
    ],
    name: "ApprovalForAll",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "shopId",
        internalType: "uint256",
        type: "uint256",
        indexed: true,
      },
      {
        name: "user",
        internalType: "address",
        type: "address",
        indexed: false,
      },
      {
        name: "permission",
        internalType: "uint8",
        type: "uint8",
        indexed: false,
      },
    ],
    name: "PermissionAdded",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "shopId",
        internalType: "uint256",
        type: "uint256",
        indexed: true,
      },
      {
        name: "user",
        internalType: "address",
        type: "address",
        indexed: false,
      },
      {
        name: "permission",
        internalType: "uint8",
        type: "uint8",
        indexed: false,
      },
    ],
    name: "PermissionRemoved",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      { name: "from", internalType: "address", type: "address", indexed: true },
      { name: "to", internalType: "address", type: "address", indexed: true },
      { name: "id", internalType: "uint256", type: "uint256", indexed: true },
    ],
    name: "Transfer",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "shopId",
        internalType: "uint256",
        type: "uint256",
        indexed: true,
      },
      {
        name: "user",
        internalType: "address",
        type: "address",
        indexed: false,
      },
      {
        name: "permissions",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
    ],
    name: "UserAdded",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "shopId",
        internalType: "uint256",
        type: "uint256",
        indexed: true,
      },
      {
        name: "users",
        internalType: "address",
        type: "address",
        indexed: false,
      },
    ],
    name: "UserRemoved",
  },
  { type: "error", inputs: [], name: "AccountBalanceOverflow" },
  { type: "error", inputs: [], name: "BalanceQueryForZeroAddress" },
  {
    type: "error",
    inputs: [
      { name: "cur", internalType: "uint64", type: "uint64" },
      { name: "_nonce", internalType: "uint64", type: "uint64" },
    ],
    name: "InvalidNonce",
  },
  { type: "error", inputs: [], name: "NoVerifier" },
  {
    type: "error",
    inputs: [{ name: "permision", internalType: "uint8", type: "uint8" }],
    name: "NotAuthorized",
  },
  { type: "error", inputs: [], name: "NotOwnerNorApproved" },
  { type: "error", inputs: [], name: "TokenAlreadyExists" },
  { type: "error", inputs: [], name: "TokenDoesNotExist" },
  { type: "error", inputs: [], name: "TransferFromIncorrectOwner" },
  { type: "error", inputs: [], name: "TransferToNonERC721ReceiverImplementer" },
  { type: "error", inputs: [], name: "TransferToZeroAddress" },
] as const;

export const shopRegAddress =
  "0x4d3791e4767114bb730a8Be6F096cB8689A57339" as const;

export const shopRegConfig = {
  address: shopRegAddress,
  abi: shopRegAbi,
} as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link eddiesAbi}__
 */
export const useReadEddies = /*#__PURE__*/ createUseReadContract({
  abi: eddiesAbi,
  address: eddiesAddress,
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link eddiesAbi}__ and `functionName` set to `"DOMAIN_SEPARATOR"`
 */
export const useReadEddiesDomainSeparator = /*#__PURE__*/ createUseReadContract(
  { abi: eddiesAbi, address: eddiesAddress, functionName: "DOMAIN_SEPARATOR" },
);

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link eddiesAbi}__ and `functionName` set to `"allowance"`
 */
export const useReadEddiesAllowance = /*#__PURE__*/ createUseReadContract({
  abi: eddiesAbi,
  address: eddiesAddress,
  functionName: "allowance",
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link eddiesAbi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadEddiesBalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: eddiesAbi,
  address: eddiesAddress,
  functionName: "balanceOf",
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link eddiesAbi}__ and `functionName` set to `"decimals"`
 */
export const useReadEddiesDecimals = /*#__PURE__*/ createUseReadContract({
  abi: eddiesAbi,
  address: eddiesAddress,
  functionName: "decimals",
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link eddiesAbi}__ and `functionName` set to `"name"`
 */
export const useReadEddiesName = /*#__PURE__*/ createUseReadContract({
  abi: eddiesAbi,
  address: eddiesAddress,
  functionName: "name",
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link eddiesAbi}__ and `functionName` set to `"nonces"`
 */
export const useReadEddiesNonces = /*#__PURE__*/ createUseReadContract({
  abi: eddiesAbi,
  address: eddiesAddress,
  functionName: "nonces",
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link eddiesAbi}__ and `functionName` set to `"symbol"`
 */
export const useReadEddiesSymbol = /*#__PURE__*/ createUseReadContract({
  abi: eddiesAbi,
  address: eddiesAddress,
  functionName: "symbol",
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link eddiesAbi}__ and `functionName` set to `"totalSupply"`
 */
export const useReadEddiesTotalSupply = /*#__PURE__*/ createUseReadContract({
  abi: eddiesAbi,
  address: eddiesAddress,
  functionName: "totalSupply",
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link eddiesAbi}__
 */
export const useWriteEddies = /*#__PURE__*/ createUseWriteContract({
  abi: eddiesAbi,
  address: eddiesAddress,
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link eddiesAbi}__ and `functionName` set to `"approve"`
 */
export const useWriteEddiesApprove = /*#__PURE__*/ createUseWriteContract({
  abi: eddiesAbi,
  address: eddiesAddress,
  functionName: "approve",
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link eddiesAbi}__ and `functionName` set to `"burn"`
 */
export const useWriteEddiesBurn = /*#__PURE__*/ createUseWriteContract({
  abi: eddiesAbi,
  address: eddiesAddress,
  functionName: "burn",
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link eddiesAbi}__ and `functionName` set to `"directSpendAllowance"`
 */
export const useWriteEddiesDirectSpendAllowance =
  /*#__PURE__*/ createUseWriteContract({
    abi: eddiesAbi,
    address: eddiesAddress,
    functionName: "directSpendAllowance",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link eddiesAbi}__ and `functionName` set to `"directTransfer"`
 */
export const useWriteEddiesDirectTransfer =
  /*#__PURE__*/ createUseWriteContract({
    abi: eddiesAbi,
    address: eddiesAddress,
    functionName: "directTransfer",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link eddiesAbi}__ and `functionName` set to `"mint"`
 */
export const useWriteEddiesMint = /*#__PURE__*/ createUseWriteContract({
  abi: eddiesAbi,
  address: eddiesAddress,
  functionName: "mint",
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link eddiesAbi}__ and `functionName` set to `"permit"`
 */
export const useWriteEddiesPermit = /*#__PURE__*/ createUseWriteContract({
  abi: eddiesAbi,
  address: eddiesAddress,
  functionName: "permit",
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link eddiesAbi}__ and `functionName` set to `"transfer"`
 */
export const useWriteEddiesTransfer = /*#__PURE__*/ createUseWriteContract({
  abi: eddiesAbi,
  address: eddiesAddress,
  functionName: "transfer",
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link eddiesAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useWriteEddiesTransferFrom = /*#__PURE__*/ createUseWriteContract({
  abi: eddiesAbi,
  address: eddiesAddress,
  functionName: "transferFrom",
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link eddiesAbi}__
 */
export const useSimulateEddies = /*#__PURE__*/ createUseSimulateContract({
  abi: eddiesAbi,
  address: eddiesAddress,
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link eddiesAbi}__ and `functionName` set to `"approve"`
 */
export const useSimulateEddiesApprove = /*#__PURE__*/ createUseSimulateContract(
  { abi: eddiesAbi, address: eddiesAddress, functionName: "approve" },
);

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link eddiesAbi}__ and `functionName` set to `"burn"`
 */
export const useSimulateEddiesBurn = /*#__PURE__*/ createUseSimulateContract({
  abi: eddiesAbi,
  address: eddiesAddress,
  functionName: "burn",
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link eddiesAbi}__ and `functionName` set to `"directSpendAllowance"`
 */
export const useSimulateEddiesDirectSpendAllowance =
  /*#__PURE__*/ createUseSimulateContract({
    abi: eddiesAbi,
    address: eddiesAddress,
    functionName: "directSpendAllowance",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link eddiesAbi}__ and `functionName` set to `"directTransfer"`
 */
export const useSimulateEddiesDirectTransfer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: eddiesAbi,
    address: eddiesAddress,
    functionName: "directTransfer",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link eddiesAbi}__ and `functionName` set to `"mint"`
 */
export const useSimulateEddiesMint = /*#__PURE__*/ createUseSimulateContract({
  abi: eddiesAbi,
  address: eddiesAddress,
  functionName: "mint",
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link eddiesAbi}__ and `functionName` set to `"permit"`
 */
export const useSimulateEddiesPermit = /*#__PURE__*/ createUseSimulateContract({
  abi: eddiesAbi,
  address: eddiesAddress,
  functionName: "permit",
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link eddiesAbi}__ and `functionName` set to `"transfer"`
 */
export const useSimulateEddiesTransfer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: eddiesAbi,
    address: eddiesAddress,
    functionName: "transfer",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link eddiesAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useSimulateEddiesTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: eddiesAbi,
    address: eddiesAddress,
    functionName: "transferFrom",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link eddiesAbi}__
 */
export const useWatchEddiesEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: eddiesAbi,
  address: eddiesAddress,
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link eddiesAbi}__ and `eventName` set to `"Approval"`
 */
export const useWatchEddiesApprovalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: eddiesAbi,
    address: eddiesAddress,
    eventName: "Approval",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link eddiesAbi}__ and `eventName` set to `"Transfer"`
 */
export const useWatchEddiesTransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: eddiesAbi,
    address: eddiesAddress,
    eventName: "Transfer",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link paymentsByAddressAbi}__
 */
export const useReadPaymentsByAddress = /*#__PURE__*/ createUseReadContract({
  abi: paymentsByAddressAbi,
  address: paymentsByAddressAddress,
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link paymentsByAddressAbi}__ and `functionName` set to `"getBytecode"`
 */
export const useReadPaymentsByAddressGetBytecode =
  /*#__PURE__*/ createUseReadContract({
    abi: paymentsByAddressAbi,
    address: paymentsByAddressAddress,
    functionName: "getBytecode",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link paymentsByAddressAbi}__ and `functionName` set to `"getPaymentAddress"`
 */
export const useReadPaymentsByAddressGetPaymentAddress =
  /*#__PURE__*/ createUseReadContract({
    abi: paymentsByAddressAbi,
    address: paymentsByAddressAddress,
    functionName: "getPaymentAddress",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link paymentsByAddressAbi}__ and `functionName` set to `"getPaymentId"`
 */
export const useReadPaymentsByAddressGetPaymentId =
  /*#__PURE__*/ createUseReadContract({
    abi: paymentsByAddressAbi,
    address: paymentsByAddressAddress,
    functionName: "getPaymentId",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link paymentsByAddressAbi}__ and `functionName` set to `"hasPaymentBeenMade"`
 */
export const useReadPaymentsByAddressHasPaymentBeenMade =
  /*#__PURE__*/ createUseReadContract({
    abi: paymentsByAddressAbi,
    address: paymentsByAddressAddress,
    functionName: "hasPaymentBeenMade",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link paymentsByAddressAbi}__
 */
export const useWritePaymentsByAddress = /*#__PURE__*/ createUseWriteContract({
  abi: paymentsByAddressAbi,
  address: paymentsByAddressAddress,
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link paymentsByAddressAbi}__ and `functionName` set to `"batch"`
 */
export const useWritePaymentsByAddressBatch =
  /*#__PURE__*/ createUseWriteContract({
    abi: paymentsByAddressAbi,
    address: paymentsByAddressAddress,
    functionName: "batch",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link paymentsByAddressAbi}__ and `functionName` set to `"multiPay"`
 */
export const useWritePaymentsByAddressMultiPay =
  /*#__PURE__*/ createUseWriteContract({
    abi: paymentsByAddressAbi,
    address: paymentsByAddressAddress,
    functionName: "multiPay",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link paymentsByAddressAbi}__ and `functionName` set to `"pay"`
 */
export const useWritePaymentsByAddressPay =
  /*#__PURE__*/ createUseWriteContract({
    abi: paymentsByAddressAbi,
    address: paymentsByAddressAddress,
    functionName: "pay",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link paymentsByAddressAbi}__ and `functionName` set to `"payNative"`
 */
export const useWritePaymentsByAddressPayNative =
  /*#__PURE__*/ createUseWriteContract({
    abi: paymentsByAddressAbi,
    address: paymentsByAddressAddress,
    functionName: "payNative",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link paymentsByAddressAbi}__ and `functionName` set to `"payToken"`
 */
export const useWritePaymentsByAddressPayToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: paymentsByAddressAbi,
    address: paymentsByAddressAddress,
    functionName: "payToken",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link paymentsByAddressAbi}__ and `functionName` set to `"payTokenPreApproved"`
 */
export const useWritePaymentsByAddressPayTokenPreApproved =
  /*#__PURE__*/ createUseWriteContract({
    abi: paymentsByAddressAbi,
    address: paymentsByAddressAddress,
    functionName: "payTokenPreApproved",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link paymentsByAddressAbi}__ and `functionName` set to `"processPayment"`
 */
export const useWritePaymentsByAddressProcessPayment =
  /*#__PURE__*/ createUseWriteContract({
    abi: paymentsByAddressAbi,
    address: paymentsByAddressAddress,
    functionName: "processPayment",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link paymentsByAddressAbi}__ and `functionName` set to `"revertPayment"`
 */
export const useWritePaymentsByAddressRevertPayment =
  /*#__PURE__*/ createUseWriteContract({
    abi: paymentsByAddressAbi,
    address: paymentsByAddressAddress,
    functionName: "revertPayment",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link paymentsByAddressAbi}__
 */
export const useSimulatePaymentsByAddress =
  /*#__PURE__*/ createUseSimulateContract({
    abi: paymentsByAddressAbi,
    address: paymentsByAddressAddress,
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link paymentsByAddressAbi}__ and `functionName` set to `"batch"`
 */
export const useSimulatePaymentsByAddressBatch =
  /*#__PURE__*/ createUseSimulateContract({
    abi: paymentsByAddressAbi,
    address: paymentsByAddressAddress,
    functionName: "batch",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link paymentsByAddressAbi}__ and `functionName` set to `"multiPay"`
 */
export const useSimulatePaymentsByAddressMultiPay =
  /*#__PURE__*/ createUseSimulateContract({
    abi: paymentsByAddressAbi,
    address: paymentsByAddressAddress,
    functionName: "multiPay",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link paymentsByAddressAbi}__ and `functionName` set to `"pay"`
 */
export const useSimulatePaymentsByAddressPay =
  /*#__PURE__*/ createUseSimulateContract({
    abi: paymentsByAddressAbi,
    address: paymentsByAddressAddress,
    functionName: "pay",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link paymentsByAddressAbi}__ and `functionName` set to `"payNative"`
 */
export const useSimulatePaymentsByAddressPayNative =
  /*#__PURE__*/ createUseSimulateContract({
    abi: paymentsByAddressAbi,
    address: paymentsByAddressAddress,
    functionName: "payNative",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link paymentsByAddressAbi}__ and `functionName` set to `"payToken"`
 */
export const useSimulatePaymentsByAddressPayToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: paymentsByAddressAbi,
    address: paymentsByAddressAddress,
    functionName: "payToken",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link paymentsByAddressAbi}__ and `functionName` set to `"payTokenPreApproved"`
 */
export const useSimulatePaymentsByAddressPayTokenPreApproved =
  /*#__PURE__*/ createUseSimulateContract({
    abi: paymentsByAddressAbi,
    address: paymentsByAddressAddress,
    functionName: "payTokenPreApproved",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link paymentsByAddressAbi}__ and `functionName` set to `"processPayment"`
 */
export const useSimulatePaymentsByAddressProcessPayment =
  /*#__PURE__*/ createUseSimulateContract({
    abi: paymentsByAddressAbi,
    address: paymentsByAddressAddress,
    functionName: "processPayment",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link paymentsByAddressAbi}__ and `functionName` set to `"revertPayment"`
 */
export const useSimulatePaymentsByAddressRevertPayment =
  /*#__PURE__*/ createUseSimulateContract({
    abi: paymentsByAddressAbi,
    address: paymentsByAddressAddress,
    functionName: "revertPayment",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link paymentsByAddressAbi}__
 */
export const useWatchPaymentsByAddressEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: paymentsByAddressAbi,
    address: paymentsByAddressAddress,
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link paymentsByAddressAbi}__ and `eventName` set to `"PaymentMade"`
 */
export const useWatchPaymentsByAddressPaymentMadeEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: paymentsByAddressAbi,
    address: paymentsByAddressAddress,
    eventName: "PaymentMade",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link paymentsByAddressAbi}__ and `eventName` set to `"SweepFailed"`
 */
export const useWatchPaymentsByAddressSweepFailedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: paymentsByAddressAbi,
    address: paymentsByAddressAddress,
    eventName: "SweepFailed",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link relayRegAbi}__
 */
export const useReadRelayReg = /*#__PURE__*/ createUseReadContract({
  abi: relayRegAbi,
  address: relayRegAddress,
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link relayRegAbi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadRelayRegBalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: relayRegAbi,
  address: relayRegAddress,
  functionName: "balanceOf",
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link relayRegAbi}__ and `functionName` set to `"getApproved"`
 */
export const useReadRelayRegGetApproved = /*#__PURE__*/ createUseReadContract({
  abi: relayRegAbi,
  address: relayRegAddress,
  functionName: "getApproved",
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link relayRegAbi}__ and `functionName` set to `"isApprovedForAll"`
 */
export const useReadRelayRegIsApprovedForAll =
  /*#__PURE__*/ createUseReadContract({
    abi: relayRegAbi,
    address: relayRegAddress,
    functionName: "isApprovedForAll",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link relayRegAbi}__ and `functionName` set to `"name"`
 */
export const useReadRelayRegName = /*#__PURE__*/ createUseReadContract({
  abi: relayRegAbi,
  address: relayRegAddress,
  functionName: "name",
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link relayRegAbi}__ and `functionName` set to `"ownerOf"`
 */
export const useReadRelayRegOwnerOf = /*#__PURE__*/ createUseReadContract({
  abi: relayRegAbi,
  address: relayRegAddress,
  functionName: "ownerOf",
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link relayRegAbi}__ and `functionName` set to `"relayURIs"`
 */
export const useReadRelayRegRelayUrIs = /*#__PURE__*/ createUseReadContract({
  abi: relayRegAbi,
  address: relayRegAddress,
  functionName: "relayURIs",
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link relayRegAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadRelayRegSupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: relayRegAbi,
    address: relayRegAddress,
    functionName: "supportsInterface",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link relayRegAbi}__ and `functionName` set to `"symbol"`
 */
export const useReadRelayRegSymbol = /*#__PURE__*/ createUseReadContract({
  abi: relayRegAbi,
  address: relayRegAddress,
  functionName: "symbol",
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link relayRegAbi}__ and `functionName` set to `"tokenURI"`
 */
export const useReadRelayRegTokenUri = /*#__PURE__*/ createUseReadContract({
  abi: relayRegAbi,
  address: relayRegAddress,
  functionName: "tokenURI",
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link relayRegAbi}__
 */
export const useWriteRelayReg = /*#__PURE__*/ createUseWriteContract({
  abi: relayRegAbi,
  address: relayRegAddress,
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link relayRegAbi}__ and `functionName` set to `"approve"`
 */
export const useWriteRelayRegApprove = /*#__PURE__*/ createUseWriteContract({
  abi: relayRegAbi,
  address: relayRegAddress,
  functionName: "approve",
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link relayRegAbi}__ and `functionName` set to `"mint"`
 */
export const useWriteRelayRegMint = /*#__PURE__*/ createUseWriteContract({
  abi: relayRegAbi,
  address: relayRegAddress,
  functionName: "mint",
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link relayRegAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useWriteRelayRegSafeTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: relayRegAbi,
    address: relayRegAddress,
    functionName: "safeTransferFrom",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link relayRegAbi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useWriteRelayRegSetApprovalForAll =
  /*#__PURE__*/ createUseWriteContract({
    abi: relayRegAbi,
    address: relayRegAddress,
    functionName: "setApprovalForAll",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link relayRegAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useWriteRelayRegTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: relayRegAbi,
    address: relayRegAddress,
    functionName: "transferFrom",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link relayRegAbi}__ and `functionName` set to `"updateURI"`
 */
export const useWriteRelayRegUpdateUri = /*#__PURE__*/ createUseWriteContract({
  abi: relayRegAbi,
  address: relayRegAddress,
  functionName: "updateURI",
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link relayRegAbi}__
 */
export const useSimulateRelayReg = /*#__PURE__*/ createUseSimulateContract({
  abi: relayRegAbi,
  address: relayRegAddress,
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link relayRegAbi}__ and `functionName` set to `"approve"`
 */
export const useSimulateRelayRegApprove =
  /*#__PURE__*/ createUseSimulateContract({
    abi: relayRegAbi,
    address: relayRegAddress,
    functionName: "approve",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link relayRegAbi}__ and `functionName` set to `"mint"`
 */
export const useSimulateRelayRegMint = /*#__PURE__*/ createUseSimulateContract({
  abi: relayRegAbi,
  address: relayRegAddress,
  functionName: "mint",
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link relayRegAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useSimulateRelayRegSafeTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: relayRegAbi,
    address: relayRegAddress,
    functionName: "safeTransferFrom",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link relayRegAbi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useSimulateRelayRegSetApprovalForAll =
  /*#__PURE__*/ createUseSimulateContract({
    abi: relayRegAbi,
    address: relayRegAddress,
    functionName: "setApprovalForAll",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link relayRegAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useSimulateRelayRegTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: relayRegAbi,
    address: relayRegAddress,
    functionName: "transferFrom",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link relayRegAbi}__ and `functionName` set to `"updateURI"`
 */
export const useSimulateRelayRegUpdateUri =
  /*#__PURE__*/ createUseSimulateContract({
    abi: relayRegAbi,
    address: relayRegAddress,
    functionName: "updateURI",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link relayRegAbi}__
 */
export const useWatchRelayRegEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: relayRegAbi,
  address: relayRegAddress,
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link relayRegAbi}__ and `eventName` set to `"Approval"`
 */
export const useWatchRelayRegApprovalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: relayRegAbi,
    address: relayRegAddress,
    eventName: "Approval",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link relayRegAbi}__ and `eventName` set to `"ApprovalForAll"`
 */
export const useWatchRelayRegApprovalForAllEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: relayRegAbi,
    address: relayRegAddress,
    eventName: "ApprovalForAll",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link relayRegAbi}__ and `eventName` set to `"Transfer"`
 */
export const useWatchRelayRegTransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: relayRegAbi,
    address: relayRegAddress,
    eventName: "Transfer",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link shopRegAbi}__
 */
export const useReadShopReg = /*#__PURE__*/ createUseReadContract({
  abi: shopRegAbi,
  address: shopRegAddress,
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"PERM_addPermission"`
 */
export const useReadShopRegPermAddPermission =
  /*#__PURE__*/ createUseReadContract({
    abi: shopRegAbi,
    address: shopRegAddress,
    functionName: "PERM_addPermission",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"PERM_addRelay"`
 */
export const useReadShopRegPermAddRelay = /*#__PURE__*/ createUseReadContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "PERM_addRelay",
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"PERM_publishInviteVerifier"`
 */
export const useReadShopRegPermPublishInviteVerifier =
  /*#__PURE__*/ createUseReadContract({
    abi: shopRegAbi,
    address: shopRegAddress,
    functionName: "PERM_publishInviteVerifier",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"PERM_registerUser"`
 */
export const useReadShopRegPermRegisterUser =
  /*#__PURE__*/ createUseReadContract({
    abi: shopRegAbi,
    address: shopRegAddress,
    functionName: "PERM_registerUser",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"PERM_removePermission"`
 */
export const useReadShopRegPermRemovePermission =
  /*#__PURE__*/ createUseReadContract({
    abi: shopRegAbi,
    address: shopRegAddress,
    functionName: "PERM_removePermission",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"PERM_removeRelay"`
 */
export const useReadShopRegPermRemoveRelay =
  /*#__PURE__*/ createUseReadContract({
    abi: shopRegAbi,
    address: shopRegAddress,
    functionName: "PERM_removeRelay",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"PERM_removeUser"`
 */
export const useReadShopRegPermRemoveUser = /*#__PURE__*/ createUseReadContract(
  { abi: shopRegAbi, address: shopRegAddress, functionName: "PERM_removeUser" },
);

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"PERM_replaceRelay"`
 */
export const useReadShopRegPermReplaceRelay =
  /*#__PURE__*/ createUseReadContract({
    abi: shopRegAbi,
    address: shopRegAddress,
    functionName: "PERM_replaceRelay",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"PERM_updateRootHash"`
 */
export const useReadShopRegPermUpdateRootHash =
  /*#__PURE__*/ createUseReadContract({
    abi: shopRegAbi,
    address: shopRegAddress,
    functionName: "PERM_updateRootHash",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"_getTokenMessageHash"`
 */
export const useReadShopRegGetTokenMessageHash =
  /*#__PURE__*/ createUseReadContract({
    abi: shopRegAbi,
    address: shopRegAddress,
    functionName: "_getTokenMessageHash",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"allPermissionsGuard"`
 */
export const useReadShopRegAllPermissionsGuard =
  /*#__PURE__*/ createUseReadContract({
    abi: shopRegAbi,
    address: shopRegAddress,
    functionName: "allPermissionsGuard",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadShopRegBalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "balanceOf",
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"getAllPermissions"`
 */
export const useReadShopRegGetAllPermissions =
  /*#__PURE__*/ createUseReadContract({
    abi: shopRegAbi,
    address: shopRegAddress,
    functionName: "getAllPermissions",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"getAllRelays"`
 */
export const useReadShopRegGetAllRelays = /*#__PURE__*/ createUseReadContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "getAllRelays",
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"getApproved"`
 */
export const useReadShopRegGetApproved = /*#__PURE__*/ createUseReadContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "getApproved",
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"getRelayCount"`
 */
export const useReadShopRegGetRelayCount = /*#__PURE__*/ createUseReadContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "getRelayCount",
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"hasEnoughPermissions"`
 */
export const useReadShopRegHasEnoughPermissions =
  /*#__PURE__*/ createUseReadContract({
    abi: shopRegAbi,
    address: shopRegAddress,
    functionName: "hasEnoughPermissions",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"hasPermission"`
 */
export const useReadShopRegHasPermission = /*#__PURE__*/ createUseReadContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "hasPermission",
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"isApprovedForAll"`
 */
export const useReadShopRegIsApprovedForAll =
  /*#__PURE__*/ createUseReadContract({
    abi: shopRegAbi,
    address: shopRegAddress,
    functionName: "isApprovedForAll",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"name"`
 */
export const useReadShopRegName = /*#__PURE__*/ createUseReadContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "name",
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"nonce"`
 */
export const useReadShopRegNonce = /*#__PURE__*/ createUseReadContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "nonce",
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"ownerOf"`
 */
export const useReadShopRegOwnerOf = /*#__PURE__*/ createUseReadContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "ownerOf",
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"permissionGuard"`
 */
export const useReadShopRegPermissionGuard =
  /*#__PURE__*/ createUseReadContract({
    abi: shopRegAbi,
    address: shopRegAddress,
    functionName: "permissionGuard",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"permsToBitmap"`
 */
export const useReadShopRegPermsToBitmap = /*#__PURE__*/ createUseReadContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "permsToBitmap",
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"relayReg"`
 */
export const useReadShopRegRelayReg = /*#__PURE__*/ createUseReadContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "relayReg",
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"relays"`
 */
export const useReadShopRegRelays = /*#__PURE__*/ createUseReadContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "relays",
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"rootHashes"`
 */
export const useReadShopRegRootHashes = /*#__PURE__*/ createUseReadContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "rootHashes",
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"shopURIs"`
 */
export const useReadShopRegShopUrIs = /*#__PURE__*/ createUseReadContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "shopURIs",
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadShopRegSupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: shopRegAbi,
    address: shopRegAddress,
    functionName: "supportsInterface",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"symbol"`
 */
export const useReadShopRegSymbol = /*#__PURE__*/ createUseReadContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "symbol",
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"tokenURI"`
 */
export const useReadShopRegTokenUri = /*#__PURE__*/ createUseReadContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "tokenURI",
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link shopRegAbi}__
 */
export const useWriteShopReg = /*#__PURE__*/ createUseWriteContract({
  abi: shopRegAbi,
  address: shopRegAddress,
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"addPermission"`
 */
export const useWriteShopRegAddPermission =
  /*#__PURE__*/ createUseWriteContract({
    abi: shopRegAbi,
    address: shopRegAddress,
    functionName: "addPermission",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"addRelay"`
 */
export const useWriteShopRegAddRelay = /*#__PURE__*/ createUseWriteContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "addRelay",
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"approve"`
 */
export const useWriteShopRegApprove = /*#__PURE__*/ createUseWriteContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "approve",
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"mint"`
 */
export const useWriteShopRegMint = /*#__PURE__*/ createUseWriteContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "mint",
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"publishInviteVerifier"`
 */
export const useWriteShopRegPublishInviteVerifier =
  /*#__PURE__*/ createUseWriteContract({
    abi: shopRegAbi,
    address: shopRegAddress,
    functionName: "publishInviteVerifier",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"redeemInvite"`
 */
export const useWriteShopRegRedeemInvite = /*#__PURE__*/ createUseWriteContract(
  { abi: shopRegAbi, address: shopRegAddress, functionName: "redeemInvite" },
);

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"registerUser"`
 */
export const useWriteShopRegRegisterUser = /*#__PURE__*/ createUseWriteContract(
  { abi: shopRegAbi, address: shopRegAddress, functionName: "registerUser" },
);

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"removePermission"`
 */
export const useWriteShopRegRemovePermission =
  /*#__PURE__*/ createUseWriteContract({
    abi: shopRegAbi,
    address: shopRegAddress,
    functionName: "removePermission",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"removeRelay"`
 */
export const useWriteShopRegRemoveRelay = /*#__PURE__*/ createUseWriteContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "removeRelay",
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"removeUser"`
 */
export const useWriteShopRegRemoveUser = /*#__PURE__*/ createUseWriteContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "removeUser",
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"replaceRelay"`
 */
export const useWriteShopRegReplaceRelay = /*#__PURE__*/ createUseWriteContract(
  { abi: shopRegAbi, address: shopRegAddress, functionName: "replaceRelay" },
);

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useWriteShopRegSafeTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: shopRegAbi,
    address: shopRegAddress,
    functionName: "safeTransferFrom",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useWriteShopRegSetApprovalForAll =
  /*#__PURE__*/ createUseWriteContract({
    abi: shopRegAbi,
    address: shopRegAddress,
    functionName: "setApprovalForAll",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"setTokenURI"`
 */
export const useWriteShopRegSetTokenUri = /*#__PURE__*/ createUseWriteContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "setTokenURI",
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useWriteShopRegTransferFrom = /*#__PURE__*/ createUseWriteContract(
  { abi: shopRegAbi, address: shopRegAddress, functionName: "transferFrom" },
);

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"updateRootHash"`
 */
export const useWriteShopRegUpdateRootHash =
  /*#__PURE__*/ createUseWriteContract({
    abi: shopRegAbi,
    address: shopRegAddress,
    functionName: "updateRootHash",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link shopRegAbi}__
 */
export const useSimulateShopReg = /*#__PURE__*/ createUseSimulateContract({
  abi: shopRegAbi,
  address: shopRegAddress,
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"addPermission"`
 */
export const useSimulateShopRegAddPermission =
  /*#__PURE__*/ createUseSimulateContract({
    abi: shopRegAbi,
    address: shopRegAddress,
    functionName: "addPermission",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"addRelay"`
 */
export const useSimulateShopRegAddRelay =
  /*#__PURE__*/ createUseSimulateContract({
    abi: shopRegAbi,
    address: shopRegAddress,
    functionName: "addRelay",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"approve"`
 */
export const useSimulateShopRegApprove =
  /*#__PURE__*/ createUseSimulateContract({
    abi: shopRegAbi,
    address: shopRegAddress,
    functionName: "approve",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"mint"`
 */
export const useSimulateShopRegMint = /*#__PURE__*/ createUseSimulateContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "mint",
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"publishInviteVerifier"`
 */
export const useSimulateShopRegPublishInviteVerifier =
  /*#__PURE__*/ createUseSimulateContract({
    abi: shopRegAbi,
    address: shopRegAddress,
    functionName: "publishInviteVerifier",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"redeemInvite"`
 */
export const useSimulateShopRegRedeemInvite =
  /*#__PURE__*/ createUseSimulateContract({
    abi: shopRegAbi,
    address: shopRegAddress,
    functionName: "redeemInvite",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"registerUser"`
 */
export const useSimulateShopRegRegisterUser =
  /*#__PURE__*/ createUseSimulateContract({
    abi: shopRegAbi,
    address: shopRegAddress,
    functionName: "registerUser",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"removePermission"`
 */
export const useSimulateShopRegRemovePermission =
  /*#__PURE__*/ createUseSimulateContract({
    abi: shopRegAbi,
    address: shopRegAddress,
    functionName: "removePermission",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"removeRelay"`
 */
export const useSimulateShopRegRemoveRelay =
  /*#__PURE__*/ createUseSimulateContract({
    abi: shopRegAbi,
    address: shopRegAddress,
    functionName: "removeRelay",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"removeUser"`
 */
export const useSimulateShopRegRemoveUser =
  /*#__PURE__*/ createUseSimulateContract({
    abi: shopRegAbi,
    address: shopRegAddress,
    functionName: "removeUser",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"replaceRelay"`
 */
export const useSimulateShopRegReplaceRelay =
  /*#__PURE__*/ createUseSimulateContract({
    abi: shopRegAbi,
    address: shopRegAddress,
    functionName: "replaceRelay",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useSimulateShopRegSafeTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: shopRegAbi,
    address: shopRegAddress,
    functionName: "safeTransferFrom",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useSimulateShopRegSetApprovalForAll =
  /*#__PURE__*/ createUseSimulateContract({
    abi: shopRegAbi,
    address: shopRegAddress,
    functionName: "setApprovalForAll",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"setTokenURI"`
 */
export const useSimulateShopRegSetTokenUri =
  /*#__PURE__*/ createUseSimulateContract({
    abi: shopRegAbi,
    address: shopRegAddress,
    functionName: "setTokenURI",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useSimulateShopRegTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: shopRegAbi,
    address: shopRegAddress,
    functionName: "transferFrom",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"updateRootHash"`
 */
export const useSimulateShopRegUpdateRootHash =
  /*#__PURE__*/ createUseSimulateContract({
    abi: shopRegAbi,
    address: shopRegAddress,
    functionName: "updateRootHash",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link shopRegAbi}__
 */
export const useWatchShopRegEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: shopRegAbi,
  address: shopRegAddress,
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link shopRegAbi}__ and `eventName` set to `"Approval"`
 */
export const useWatchShopRegApprovalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: shopRegAbi,
    address: shopRegAddress,
    eventName: "Approval",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link shopRegAbi}__ and `eventName` set to `"ApprovalForAll"`
 */
export const useWatchShopRegApprovalForAllEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: shopRegAbi,
    address: shopRegAddress,
    eventName: "ApprovalForAll",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link shopRegAbi}__ and `eventName` set to `"PermissionAdded"`
 */
export const useWatchShopRegPermissionAddedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: shopRegAbi,
    address: shopRegAddress,
    eventName: "PermissionAdded",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link shopRegAbi}__ and `eventName` set to `"PermissionRemoved"`
 */
export const useWatchShopRegPermissionRemovedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: shopRegAbi,
    address: shopRegAddress,
    eventName: "PermissionRemoved",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link shopRegAbi}__ and `eventName` set to `"Transfer"`
 */
export const useWatchShopRegTransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: shopRegAbi,
    address: shopRegAddress,
    eventName: "Transfer",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link shopRegAbi}__ and `eventName` set to `"UserAdded"`
 */
export const useWatchShopRegUserAddedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: shopRegAbi,
    address: shopRegAddress,
    eventName: "UserAdded",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link shopRegAbi}__ and `eventName` set to `"UserRemoved"`
 */
export const useWatchShopRegUserRemovedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: shopRegAbi,
    address: shopRegAddress,
    eventName: "UserRemoved",
  });

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Action
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link eddiesAbi}__
 */
export const readEddies = /*#__PURE__*/ createReadContract({
  abi: eddiesAbi,
  address: eddiesAddress,
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link eddiesAbi}__ and `functionName` set to `"DOMAIN_SEPARATOR"`
 */
export const readEddiesDomainSeparator = /*#__PURE__*/ createReadContract({
  abi: eddiesAbi,
  address: eddiesAddress,
  functionName: "DOMAIN_SEPARATOR",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link eddiesAbi}__ and `functionName` set to `"allowance"`
 */
export const readEddiesAllowance = /*#__PURE__*/ createReadContract({
  abi: eddiesAbi,
  address: eddiesAddress,
  functionName: "allowance",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link eddiesAbi}__ and `functionName` set to `"balanceOf"`
 */
export const readEddiesBalanceOf = /*#__PURE__*/ createReadContract({
  abi: eddiesAbi,
  address: eddiesAddress,
  functionName: "balanceOf",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link eddiesAbi}__ and `functionName` set to `"decimals"`
 */
export const readEddiesDecimals = /*#__PURE__*/ createReadContract({
  abi: eddiesAbi,
  address: eddiesAddress,
  functionName: "decimals",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link eddiesAbi}__ and `functionName` set to `"name"`
 */
export const readEddiesName = /*#__PURE__*/ createReadContract({
  abi: eddiesAbi,
  address: eddiesAddress,
  functionName: "name",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link eddiesAbi}__ and `functionName` set to `"nonces"`
 */
export const readEddiesNonces = /*#__PURE__*/ createReadContract({
  abi: eddiesAbi,
  address: eddiesAddress,
  functionName: "nonces",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link eddiesAbi}__ and `functionName` set to `"symbol"`
 */
export const readEddiesSymbol = /*#__PURE__*/ createReadContract({
  abi: eddiesAbi,
  address: eddiesAddress,
  functionName: "symbol",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link eddiesAbi}__ and `functionName` set to `"totalSupply"`
 */
export const readEddiesTotalSupply = /*#__PURE__*/ createReadContract({
  abi: eddiesAbi,
  address: eddiesAddress,
  functionName: "totalSupply",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link eddiesAbi}__
 */
export const writeEddies = /*#__PURE__*/ createWriteContract({
  abi: eddiesAbi,
  address: eddiesAddress,
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link eddiesAbi}__ and `functionName` set to `"approve"`
 */
export const writeEddiesApprove = /*#__PURE__*/ createWriteContract({
  abi: eddiesAbi,
  address: eddiesAddress,
  functionName: "approve",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link eddiesAbi}__ and `functionName` set to `"burn"`
 */
export const writeEddiesBurn = /*#__PURE__*/ createWriteContract({
  abi: eddiesAbi,
  address: eddiesAddress,
  functionName: "burn",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link eddiesAbi}__ and `functionName` set to `"directSpendAllowance"`
 */
export const writeEddiesDirectSpendAllowance =
  /*#__PURE__*/ createWriteContract({
    abi: eddiesAbi,
    address: eddiesAddress,
    functionName: "directSpendAllowance",
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link eddiesAbi}__ and `functionName` set to `"directTransfer"`
 */
export const writeEddiesDirectTransfer = /*#__PURE__*/ createWriteContract({
  abi: eddiesAbi,
  address: eddiesAddress,
  functionName: "directTransfer",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link eddiesAbi}__ and `functionName` set to `"mint"`
 */
export const writeEddiesMint = /*#__PURE__*/ createWriteContract({
  abi: eddiesAbi,
  address: eddiesAddress,
  functionName: "mint",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link eddiesAbi}__ and `functionName` set to `"permit"`
 */
export const writeEddiesPermit = /*#__PURE__*/ createWriteContract({
  abi: eddiesAbi,
  address: eddiesAddress,
  functionName: "permit",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link eddiesAbi}__ and `functionName` set to `"transfer"`
 */
export const writeEddiesTransfer = /*#__PURE__*/ createWriteContract({
  abi: eddiesAbi,
  address: eddiesAddress,
  functionName: "transfer",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link eddiesAbi}__ and `functionName` set to `"transferFrom"`
 */
export const writeEddiesTransferFrom = /*#__PURE__*/ createWriteContract({
  abi: eddiesAbi,
  address: eddiesAddress,
  functionName: "transferFrom",
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link eddiesAbi}__
 */
export const simulateEddies = /*#__PURE__*/ createSimulateContract({
  abi: eddiesAbi,
  address: eddiesAddress,
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link eddiesAbi}__ and `functionName` set to `"approve"`
 */
export const simulateEddiesApprove = /*#__PURE__*/ createSimulateContract({
  abi: eddiesAbi,
  address: eddiesAddress,
  functionName: "approve",
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link eddiesAbi}__ and `functionName` set to `"burn"`
 */
export const simulateEddiesBurn = /*#__PURE__*/ createSimulateContract({
  abi: eddiesAbi,
  address: eddiesAddress,
  functionName: "burn",
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link eddiesAbi}__ and `functionName` set to `"directSpendAllowance"`
 */
export const simulateEddiesDirectSpendAllowance =
  /*#__PURE__*/ createSimulateContract({
    abi: eddiesAbi,
    address: eddiesAddress,
    functionName: "directSpendAllowance",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link eddiesAbi}__ and `functionName` set to `"directTransfer"`
 */
export const simulateEddiesDirectTransfer =
  /*#__PURE__*/ createSimulateContract({
    abi: eddiesAbi,
    address: eddiesAddress,
    functionName: "directTransfer",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link eddiesAbi}__ and `functionName` set to `"mint"`
 */
export const simulateEddiesMint = /*#__PURE__*/ createSimulateContract({
  abi: eddiesAbi,
  address: eddiesAddress,
  functionName: "mint",
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link eddiesAbi}__ and `functionName` set to `"permit"`
 */
export const simulateEddiesPermit = /*#__PURE__*/ createSimulateContract({
  abi: eddiesAbi,
  address: eddiesAddress,
  functionName: "permit",
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link eddiesAbi}__ and `functionName` set to `"transfer"`
 */
export const simulateEddiesTransfer = /*#__PURE__*/ createSimulateContract({
  abi: eddiesAbi,
  address: eddiesAddress,
  functionName: "transfer",
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link eddiesAbi}__ and `functionName` set to `"transferFrom"`
 */
export const simulateEddiesTransferFrom = /*#__PURE__*/ createSimulateContract({
  abi: eddiesAbi,
  address: eddiesAddress,
  functionName: "transferFrom",
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link eddiesAbi}__
 */
export const watchEddiesEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: eddiesAbi,
  address: eddiesAddress,
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link eddiesAbi}__ and `eventName` set to `"Approval"`
 */
export const watchEddiesApprovalEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: eddiesAbi,
  address: eddiesAddress,
  eventName: "Approval",
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link eddiesAbi}__ and `eventName` set to `"Transfer"`
 */
export const watchEddiesTransferEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: eddiesAbi,
  address: eddiesAddress,
  eventName: "Transfer",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link paymentsByAddressAbi}__
 */
export const readPaymentsByAddress = /*#__PURE__*/ createReadContract({
  abi: paymentsByAddressAbi,
  address: paymentsByAddressAddress,
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link paymentsByAddressAbi}__ and `functionName` set to `"getBytecode"`
 */
export const readPaymentsByAddressGetBytecode =
  /*#__PURE__*/ createReadContract({
    abi: paymentsByAddressAbi,
    address: paymentsByAddressAddress,
    functionName: "getBytecode",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link paymentsByAddressAbi}__ and `functionName` set to `"getPaymentAddress"`
 */
export const readPaymentsByAddressGetPaymentAddress =
  /*#__PURE__*/ createReadContract({
    abi: paymentsByAddressAbi,
    address: paymentsByAddressAddress,
    functionName: "getPaymentAddress",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link paymentsByAddressAbi}__ and `functionName` set to `"getPaymentId"`
 */
export const readPaymentsByAddressGetPaymentId =
  /*#__PURE__*/ createReadContract({
    abi: paymentsByAddressAbi,
    address: paymentsByAddressAddress,
    functionName: "getPaymentId",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link paymentsByAddressAbi}__ and `functionName` set to `"hasPaymentBeenMade"`
 */
export const readPaymentsByAddressHasPaymentBeenMade =
  /*#__PURE__*/ createReadContract({
    abi: paymentsByAddressAbi,
    address: paymentsByAddressAddress,
    functionName: "hasPaymentBeenMade",
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link paymentsByAddressAbi}__
 */
export const writePaymentsByAddress = /*#__PURE__*/ createWriteContract({
  abi: paymentsByAddressAbi,
  address: paymentsByAddressAddress,
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link paymentsByAddressAbi}__ and `functionName` set to `"batch"`
 */
export const writePaymentsByAddressBatch = /*#__PURE__*/ createWriteContract({
  abi: paymentsByAddressAbi,
  address: paymentsByAddressAddress,
  functionName: "batch",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link paymentsByAddressAbi}__ and `functionName` set to `"multiPay"`
 */
export const writePaymentsByAddressMultiPay = /*#__PURE__*/ createWriteContract(
  {
    abi: paymentsByAddressAbi,
    address: paymentsByAddressAddress,
    functionName: "multiPay",
  },
);

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link paymentsByAddressAbi}__ and `functionName` set to `"pay"`
 */
export const writePaymentsByAddressPay = /*#__PURE__*/ createWriteContract({
  abi: paymentsByAddressAbi,
  address: paymentsByAddressAddress,
  functionName: "pay",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link paymentsByAddressAbi}__ and `functionName` set to `"payNative"`
 */
export const writePaymentsByAddressPayNative =
  /*#__PURE__*/ createWriteContract({
    abi: paymentsByAddressAbi,
    address: paymentsByAddressAddress,
    functionName: "payNative",
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link paymentsByAddressAbi}__ and `functionName` set to `"payToken"`
 */
export const writePaymentsByAddressPayToken = /*#__PURE__*/ createWriteContract(
  {
    abi: paymentsByAddressAbi,
    address: paymentsByAddressAddress,
    functionName: "payToken",
  },
);

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link paymentsByAddressAbi}__ and `functionName` set to `"payTokenPreApproved"`
 */
export const writePaymentsByAddressPayTokenPreApproved =
  /*#__PURE__*/ createWriteContract({
    abi: paymentsByAddressAbi,
    address: paymentsByAddressAddress,
    functionName: "payTokenPreApproved",
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link paymentsByAddressAbi}__ and `functionName` set to `"processPayment"`
 */
export const writePaymentsByAddressProcessPayment =
  /*#__PURE__*/ createWriteContract({
    abi: paymentsByAddressAbi,
    address: paymentsByAddressAddress,
    functionName: "processPayment",
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link paymentsByAddressAbi}__ and `functionName` set to `"revertPayment"`
 */
export const writePaymentsByAddressRevertPayment =
  /*#__PURE__*/ createWriteContract({
    abi: paymentsByAddressAbi,
    address: paymentsByAddressAddress,
    functionName: "revertPayment",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link paymentsByAddressAbi}__
 */
export const simulatePaymentsByAddress = /*#__PURE__*/ createSimulateContract({
  abi: paymentsByAddressAbi,
  address: paymentsByAddressAddress,
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link paymentsByAddressAbi}__ and `functionName` set to `"batch"`
 */
export const simulatePaymentsByAddressBatch =
  /*#__PURE__*/ createSimulateContract({
    abi: paymentsByAddressAbi,
    address: paymentsByAddressAddress,
    functionName: "batch",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link paymentsByAddressAbi}__ and `functionName` set to `"multiPay"`
 */
export const simulatePaymentsByAddressMultiPay =
  /*#__PURE__*/ createSimulateContract({
    abi: paymentsByAddressAbi,
    address: paymentsByAddressAddress,
    functionName: "multiPay",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link paymentsByAddressAbi}__ and `functionName` set to `"pay"`
 */
export const simulatePaymentsByAddressPay =
  /*#__PURE__*/ createSimulateContract({
    abi: paymentsByAddressAbi,
    address: paymentsByAddressAddress,
    functionName: "pay",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link paymentsByAddressAbi}__ and `functionName` set to `"payNative"`
 */
export const simulatePaymentsByAddressPayNative =
  /*#__PURE__*/ createSimulateContract({
    abi: paymentsByAddressAbi,
    address: paymentsByAddressAddress,
    functionName: "payNative",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link paymentsByAddressAbi}__ and `functionName` set to `"payToken"`
 */
export const simulatePaymentsByAddressPayToken =
  /*#__PURE__*/ createSimulateContract({
    abi: paymentsByAddressAbi,
    address: paymentsByAddressAddress,
    functionName: "payToken",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link paymentsByAddressAbi}__ and `functionName` set to `"payTokenPreApproved"`
 */
export const simulatePaymentsByAddressPayTokenPreApproved =
  /*#__PURE__*/ createSimulateContract({
    abi: paymentsByAddressAbi,
    address: paymentsByAddressAddress,
    functionName: "payTokenPreApproved",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link paymentsByAddressAbi}__ and `functionName` set to `"processPayment"`
 */
export const simulatePaymentsByAddressProcessPayment =
  /*#__PURE__*/ createSimulateContract({
    abi: paymentsByAddressAbi,
    address: paymentsByAddressAddress,
    functionName: "processPayment",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link paymentsByAddressAbi}__ and `functionName` set to `"revertPayment"`
 */
export const simulatePaymentsByAddressRevertPayment =
  /*#__PURE__*/ createSimulateContract({
    abi: paymentsByAddressAbi,
    address: paymentsByAddressAddress,
    functionName: "revertPayment",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link paymentsByAddressAbi}__
 */
export const watchPaymentsByAddressEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: paymentsByAddressAbi,
    address: paymentsByAddressAddress,
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link paymentsByAddressAbi}__ and `eventName` set to `"PaymentMade"`
 */
export const watchPaymentsByAddressPaymentMadeEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: paymentsByAddressAbi,
    address: paymentsByAddressAddress,
    eventName: "PaymentMade",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link paymentsByAddressAbi}__ and `eventName` set to `"SweepFailed"`
 */
export const watchPaymentsByAddressSweepFailedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: paymentsByAddressAbi,
    address: paymentsByAddressAddress,
    eventName: "SweepFailed",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link relayRegAbi}__
 */
export const readRelayReg = /*#__PURE__*/ createReadContract({
  abi: relayRegAbi,
  address: relayRegAddress,
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link relayRegAbi}__ and `functionName` set to `"balanceOf"`
 */
export const readRelayRegBalanceOf = /*#__PURE__*/ createReadContract({
  abi: relayRegAbi,
  address: relayRegAddress,
  functionName: "balanceOf",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link relayRegAbi}__ and `functionName` set to `"getApproved"`
 */
export const readRelayRegGetApproved = /*#__PURE__*/ createReadContract({
  abi: relayRegAbi,
  address: relayRegAddress,
  functionName: "getApproved",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link relayRegAbi}__ and `functionName` set to `"isApprovedForAll"`
 */
export const readRelayRegIsApprovedForAll = /*#__PURE__*/ createReadContract({
  abi: relayRegAbi,
  address: relayRegAddress,
  functionName: "isApprovedForAll",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link relayRegAbi}__ and `functionName` set to `"name"`
 */
export const readRelayRegName = /*#__PURE__*/ createReadContract({
  abi: relayRegAbi,
  address: relayRegAddress,
  functionName: "name",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link relayRegAbi}__ and `functionName` set to `"ownerOf"`
 */
export const readRelayRegOwnerOf = /*#__PURE__*/ createReadContract({
  abi: relayRegAbi,
  address: relayRegAddress,
  functionName: "ownerOf",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link relayRegAbi}__ and `functionName` set to `"relayURIs"`
 */
export const readRelayRegRelayUrIs = /*#__PURE__*/ createReadContract({
  abi: relayRegAbi,
  address: relayRegAddress,
  functionName: "relayURIs",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link relayRegAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const readRelayRegSupportsInterface = /*#__PURE__*/ createReadContract({
  abi: relayRegAbi,
  address: relayRegAddress,
  functionName: "supportsInterface",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link relayRegAbi}__ and `functionName` set to `"symbol"`
 */
export const readRelayRegSymbol = /*#__PURE__*/ createReadContract({
  abi: relayRegAbi,
  address: relayRegAddress,
  functionName: "symbol",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link relayRegAbi}__ and `functionName` set to `"tokenURI"`
 */
export const readRelayRegTokenUri = /*#__PURE__*/ createReadContract({
  abi: relayRegAbi,
  address: relayRegAddress,
  functionName: "tokenURI",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link relayRegAbi}__
 */
export const writeRelayReg = /*#__PURE__*/ createWriteContract({
  abi: relayRegAbi,
  address: relayRegAddress,
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link relayRegAbi}__ and `functionName` set to `"approve"`
 */
export const writeRelayRegApprove = /*#__PURE__*/ createWriteContract({
  abi: relayRegAbi,
  address: relayRegAddress,
  functionName: "approve",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link relayRegAbi}__ and `functionName` set to `"mint"`
 */
export const writeRelayRegMint = /*#__PURE__*/ createWriteContract({
  abi: relayRegAbi,
  address: relayRegAddress,
  functionName: "mint",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link relayRegAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const writeRelayRegSafeTransferFrom = /*#__PURE__*/ createWriteContract({
  abi: relayRegAbi,
  address: relayRegAddress,
  functionName: "safeTransferFrom",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link relayRegAbi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const writeRelayRegSetApprovalForAll = /*#__PURE__*/ createWriteContract(
  {
    abi: relayRegAbi,
    address: relayRegAddress,
    functionName: "setApprovalForAll",
  },
);

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link relayRegAbi}__ and `functionName` set to `"transferFrom"`
 */
export const writeRelayRegTransferFrom = /*#__PURE__*/ createWriteContract({
  abi: relayRegAbi,
  address: relayRegAddress,
  functionName: "transferFrom",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link relayRegAbi}__ and `functionName` set to `"updateURI"`
 */
export const writeRelayRegUpdateUri = /*#__PURE__*/ createWriteContract({
  abi: relayRegAbi,
  address: relayRegAddress,
  functionName: "updateURI",
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link relayRegAbi}__
 */
export const simulateRelayReg = /*#__PURE__*/ createSimulateContract({
  abi: relayRegAbi,
  address: relayRegAddress,
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link relayRegAbi}__ and `functionName` set to `"approve"`
 */
export const simulateRelayRegApprove = /*#__PURE__*/ createSimulateContract({
  abi: relayRegAbi,
  address: relayRegAddress,
  functionName: "approve",
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link relayRegAbi}__ and `functionName` set to `"mint"`
 */
export const simulateRelayRegMint = /*#__PURE__*/ createSimulateContract({
  abi: relayRegAbi,
  address: relayRegAddress,
  functionName: "mint",
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link relayRegAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const simulateRelayRegSafeTransferFrom =
  /*#__PURE__*/ createSimulateContract({
    abi: relayRegAbi,
    address: relayRegAddress,
    functionName: "safeTransferFrom",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link relayRegAbi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const simulateRelayRegSetApprovalForAll =
  /*#__PURE__*/ createSimulateContract({
    abi: relayRegAbi,
    address: relayRegAddress,
    functionName: "setApprovalForAll",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link relayRegAbi}__ and `functionName` set to `"transferFrom"`
 */
export const simulateRelayRegTransferFrom =
  /*#__PURE__*/ createSimulateContract({
    abi: relayRegAbi,
    address: relayRegAddress,
    functionName: "transferFrom",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link relayRegAbi}__ and `functionName` set to `"updateURI"`
 */
export const simulateRelayRegUpdateUri = /*#__PURE__*/ createSimulateContract({
  abi: relayRegAbi,
  address: relayRegAddress,
  functionName: "updateURI",
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link relayRegAbi}__
 */
export const watchRelayRegEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: relayRegAbi,
  address: relayRegAddress,
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link relayRegAbi}__ and `eventName` set to `"Approval"`
 */
export const watchRelayRegApprovalEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: relayRegAbi,
    address: relayRegAddress,
    eventName: "Approval",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link relayRegAbi}__ and `eventName` set to `"ApprovalForAll"`
 */
export const watchRelayRegApprovalForAllEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: relayRegAbi,
    address: relayRegAddress,
    eventName: "ApprovalForAll",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link relayRegAbi}__ and `eventName` set to `"Transfer"`
 */
export const watchRelayRegTransferEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: relayRegAbi,
    address: relayRegAddress,
    eventName: "Transfer",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link shopRegAbi}__
 */
export const readShopReg = /*#__PURE__*/ createReadContract({
  abi: shopRegAbi,
  address: shopRegAddress,
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"PERM_addPermission"`
 */
export const readShopRegPermAddPermission = /*#__PURE__*/ createReadContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "PERM_addPermission",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"PERM_addRelay"`
 */
export const readShopRegPermAddRelay = /*#__PURE__*/ createReadContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "PERM_addRelay",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"PERM_publishInviteVerifier"`
 */
export const readShopRegPermPublishInviteVerifier =
  /*#__PURE__*/ createReadContract({
    abi: shopRegAbi,
    address: shopRegAddress,
    functionName: "PERM_publishInviteVerifier",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"PERM_registerUser"`
 */
export const readShopRegPermRegisterUser = /*#__PURE__*/ createReadContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "PERM_registerUser",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"PERM_removePermission"`
 */
export const readShopRegPermRemovePermission = /*#__PURE__*/ createReadContract(
  {
    abi: shopRegAbi,
    address: shopRegAddress,
    functionName: "PERM_removePermission",
  },
);

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"PERM_removeRelay"`
 */
export const readShopRegPermRemoveRelay = /*#__PURE__*/ createReadContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "PERM_removeRelay",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"PERM_removeUser"`
 */
export const readShopRegPermRemoveUser = /*#__PURE__*/ createReadContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "PERM_removeUser",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"PERM_replaceRelay"`
 */
export const readShopRegPermReplaceRelay = /*#__PURE__*/ createReadContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "PERM_replaceRelay",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"PERM_updateRootHash"`
 */
export const readShopRegPermUpdateRootHash = /*#__PURE__*/ createReadContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "PERM_updateRootHash",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"_getTokenMessageHash"`
 */
export const readShopRegGetTokenMessageHash = /*#__PURE__*/ createReadContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "_getTokenMessageHash",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"allPermissionsGuard"`
 */
export const readShopRegAllPermissionsGuard = /*#__PURE__*/ createReadContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "allPermissionsGuard",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"balanceOf"`
 */
export const readShopRegBalanceOf = /*#__PURE__*/ createReadContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "balanceOf",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"getAllPermissions"`
 */
export const readShopRegGetAllPermissions = /*#__PURE__*/ createReadContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "getAllPermissions",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"getAllRelays"`
 */
export const readShopRegGetAllRelays = /*#__PURE__*/ createReadContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "getAllRelays",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"getApproved"`
 */
export const readShopRegGetApproved = /*#__PURE__*/ createReadContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "getApproved",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"getRelayCount"`
 */
export const readShopRegGetRelayCount = /*#__PURE__*/ createReadContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "getRelayCount",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"hasEnoughPermissions"`
 */
export const readShopRegHasEnoughPermissions = /*#__PURE__*/ createReadContract(
  {
    abi: shopRegAbi,
    address: shopRegAddress,
    functionName: "hasEnoughPermissions",
  },
);

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"hasPermission"`
 */
export const readShopRegHasPermission = /*#__PURE__*/ createReadContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "hasPermission",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"isApprovedForAll"`
 */
export const readShopRegIsApprovedForAll = /*#__PURE__*/ createReadContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "isApprovedForAll",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"name"`
 */
export const readShopRegName = /*#__PURE__*/ createReadContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "name",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"nonce"`
 */
export const readShopRegNonce = /*#__PURE__*/ createReadContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "nonce",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"ownerOf"`
 */
export const readShopRegOwnerOf = /*#__PURE__*/ createReadContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "ownerOf",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"permissionGuard"`
 */
export const readShopRegPermissionGuard = /*#__PURE__*/ createReadContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "permissionGuard",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"permsToBitmap"`
 */
export const readShopRegPermsToBitmap = /*#__PURE__*/ createReadContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "permsToBitmap",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"relayReg"`
 */
export const readShopRegRelayReg = /*#__PURE__*/ createReadContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "relayReg",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"relays"`
 */
export const readShopRegRelays = /*#__PURE__*/ createReadContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "relays",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"rootHashes"`
 */
export const readShopRegRootHashes = /*#__PURE__*/ createReadContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "rootHashes",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"shopURIs"`
 */
export const readShopRegShopUrIs = /*#__PURE__*/ createReadContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "shopURIs",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const readShopRegSupportsInterface = /*#__PURE__*/ createReadContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "supportsInterface",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"symbol"`
 */
export const readShopRegSymbol = /*#__PURE__*/ createReadContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "symbol",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"tokenURI"`
 */
export const readShopRegTokenUri = /*#__PURE__*/ createReadContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "tokenURI",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link shopRegAbi}__
 */
export const writeShopReg = /*#__PURE__*/ createWriteContract({
  abi: shopRegAbi,
  address: shopRegAddress,
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"addPermission"`
 */
export const writeShopRegAddPermission = /*#__PURE__*/ createWriteContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "addPermission",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"addRelay"`
 */
export const writeShopRegAddRelay = /*#__PURE__*/ createWriteContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "addRelay",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"approve"`
 */
export const writeShopRegApprove = /*#__PURE__*/ createWriteContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "approve",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"mint"`
 */
export const writeShopRegMint = /*#__PURE__*/ createWriteContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "mint",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"publishInviteVerifier"`
 */
export const writeShopRegPublishInviteVerifier =
  /*#__PURE__*/ createWriteContract({
    abi: shopRegAbi,
    address: shopRegAddress,
    functionName: "publishInviteVerifier",
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"redeemInvite"`
 */
export const writeShopRegRedeemInvite = /*#__PURE__*/ createWriteContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "redeemInvite",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"registerUser"`
 */
export const writeShopRegRegisterUser = /*#__PURE__*/ createWriteContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "registerUser",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"removePermission"`
 */
export const writeShopRegRemovePermission = /*#__PURE__*/ createWriteContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "removePermission",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"removeRelay"`
 */
export const writeShopRegRemoveRelay = /*#__PURE__*/ createWriteContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "removeRelay",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"removeUser"`
 */
export const writeShopRegRemoveUser = /*#__PURE__*/ createWriteContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "removeUser",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"replaceRelay"`
 */
export const writeShopRegReplaceRelay = /*#__PURE__*/ createWriteContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "replaceRelay",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const writeShopRegSafeTransferFrom = /*#__PURE__*/ createWriteContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "safeTransferFrom",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const writeShopRegSetApprovalForAll = /*#__PURE__*/ createWriteContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "setApprovalForAll",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"setTokenURI"`
 */
export const writeShopRegSetTokenUri = /*#__PURE__*/ createWriteContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "setTokenURI",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"transferFrom"`
 */
export const writeShopRegTransferFrom = /*#__PURE__*/ createWriteContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "transferFrom",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"updateRootHash"`
 */
export const writeShopRegUpdateRootHash = /*#__PURE__*/ createWriteContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "updateRootHash",
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link shopRegAbi}__
 */
export const simulateShopReg = /*#__PURE__*/ createSimulateContract({
  abi: shopRegAbi,
  address: shopRegAddress,
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"addPermission"`
 */
export const simulateShopRegAddPermission =
  /*#__PURE__*/ createSimulateContract({
    abi: shopRegAbi,
    address: shopRegAddress,
    functionName: "addPermission",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"addRelay"`
 */
export const simulateShopRegAddRelay = /*#__PURE__*/ createSimulateContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "addRelay",
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"approve"`
 */
export const simulateShopRegApprove = /*#__PURE__*/ createSimulateContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "approve",
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"mint"`
 */
export const simulateShopRegMint = /*#__PURE__*/ createSimulateContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "mint",
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"publishInviteVerifier"`
 */
export const simulateShopRegPublishInviteVerifier =
  /*#__PURE__*/ createSimulateContract({
    abi: shopRegAbi,
    address: shopRegAddress,
    functionName: "publishInviteVerifier",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"redeemInvite"`
 */
export const simulateShopRegRedeemInvite = /*#__PURE__*/ createSimulateContract(
  { abi: shopRegAbi, address: shopRegAddress, functionName: "redeemInvite" },
);

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"registerUser"`
 */
export const simulateShopRegRegisterUser = /*#__PURE__*/ createSimulateContract(
  { abi: shopRegAbi, address: shopRegAddress, functionName: "registerUser" },
);

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"removePermission"`
 */
export const simulateShopRegRemovePermission =
  /*#__PURE__*/ createSimulateContract({
    abi: shopRegAbi,
    address: shopRegAddress,
    functionName: "removePermission",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"removeRelay"`
 */
export const simulateShopRegRemoveRelay = /*#__PURE__*/ createSimulateContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "removeRelay",
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"removeUser"`
 */
export const simulateShopRegRemoveUser = /*#__PURE__*/ createSimulateContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "removeUser",
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"replaceRelay"`
 */
export const simulateShopRegReplaceRelay = /*#__PURE__*/ createSimulateContract(
  { abi: shopRegAbi, address: shopRegAddress, functionName: "replaceRelay" },
);

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const simulateShopRegSafeTransferFrom =
  /*#__PURE__*/ createSimulateContract({
    abi: shopRegAbi,
    address: shopRegAddress,
    functionName: "safeTransferFrom",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const simulateShopRegSetApprovalForAll =
  /*#__PURE__*/ createSimulateContract({
    abi: shopRegAbi,
    address: shopRegAddress,
    functionName: "setApprovalForAll",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"setTokenURI"`
 */
export const simulateShopRegSetTokenUri = /*#__PURE__*/ createSimulateContract({
  abi: shopRegAbi,
  address: shopRegAddress,
  functionName: "setTokenURI",
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"transferFrom"`
 */
export const simulateShopRegTransferFrom = /*#__PURE__*/ createSimulateContract(
  { abi: shopRegAbi, address: shopRegAddress, functionName: "transferFrom" },
);

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link shopRegAbi}__ and `functionName` set to `"updateRootHash"`
 */
export const simulateShopRegUpdateRootHash =
  /*#__PURE__*/ createSimulateContract({
    abi: shopRegAbi,
    address: shopRegAddress,
    functionName: "updateRootHash",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link shopRegAbi}__
 */
export const watchShopRegEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: shopRegAbi,
  address: shopRegAddress,
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link shopRegAbi}__ and `eventName` set to `"Approval"`
 */
export const watchShopRegApprovalEvent = /*#__PURE__*/ createWatchContractEvent(
  { abi: shopRegAbi, address: shopRegAddress, eventName: "Approval" },
);

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link shopRegAbi}__ and `eventName` set to `"ApprovalForAll"`
 */
export const watchShopRegApprovalForAllEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: shopRegAbi,
    address: shopRegAddress,
    eventName: "ApprovalForAll",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link shopRegAbi}__ and `eventName` set to `"PermissionAdded"`
 */
export const watchShopRegPermissionAddedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: shopRegAbi,
    address: shopRegAddress,
    eventName: "PermissionAdded",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link shopRegAbi}__ and `eventName` set to `"PermissionRemoved"`
 */
export const watchShopRegPermissionRemovedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: shopRegAbi,
    address: shopRegAddress,
    eventName: "PermissionRemoved",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link shopRegAbi}__ and `eventName` set to `"Transfer"`
 */
export const watchShopRegTransferEvent = /*#__PURE__*/ createWatchContractEvent(
  { abi: shopRegAbi, address: shopRegAddress, eventName: "Transfer" },
);

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link shopRegAbi}__ and `eventName` set to `"UserAdded"`
 */
export const watchShopRegUserAddedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: shopRegAbi,
    address: shopRegAddress,
    eventName: "UserAdded",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link shopRegAbi}__ and `eventName` set to `"UserRemoved"`
 */
export const watchShopRegUserRemovedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: shopRegAbi,
    address: shopRegAddress,
    eventName: "UserRemoved",
  });
