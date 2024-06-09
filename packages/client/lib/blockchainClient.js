"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockchainClient = void 0;
var viem_1 = require("viem");
var abi = require("@massmarket/contracts");
var utils_1 = require("./utils");
var accounts_1 = require("viem/accounts");
var BlockchainClient = /** @class */ (function () {
    function BlockchainClient(storeId) {
        if (storeId === void 0) { storeId = (0, viem_1.bytesToHex)((0, utils_1.eventId)()); }
        this.storeId = storeId;
    }
    BlockchainClient.prototype.createStore = function (wallet) {
        return __awaiter(this, void 0, void 0, function () {
            var hash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, wallet.writeContract({
                            address: abi.addresses.StoreReg,
                            abi: abi.StoreReg,
                            functionName: "mint",
                            args: [BigInt(this.storeId), wallet.account.address],
                        })];
                    case 1:
                        hash = _a.sent();
                        return [2 /*return*/, hash];
                }
            });
        });
    };
    BlockchainClient.prototype.createInviteSecret = function (wallet) {
        return __awaiter(this, void 0, void 0, function () {
            var privateKey, token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        privateKey = (0, viem_1.bytesToHex)((0, utils_1.randomBytes)(32));
                        token = (0, accounts_1.privateKeyToAccount)(privateKey);
                        // Save the public key onchain
                        return [4 /*yield*/, wallet.writeContract({
                                address: abi.addresses.StoreReg,
                                abi: abi.StoreReg,
                                functionName: "publishInviteVerifier",
                                args: [BigInt(this.storeId), token.address],
                            })];
                    case 1:
                        // Save the public key onchain
                        _a.sent();
                        return [2 /*return*/, privateKey];
                }
            });
        });
    };
    BlockchainClient.prototype.redeemInviteSecret = function (secret, wallet) {
        return __awaiter(this, void 0, void 0, function () {
            var message, tokenAccount, sig, sigBytes, v, r, s;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        message = "enrolling:" + wallet.account.address.toLowerCase();
                        tokenAccount = (0, accounts_1.privateKeyToAccount)(secret);
                        return [4 /*yield*/, tokenAccount.signMessage({
                                message: message,
                            })];
                    case 1:
                        sig = _a.sent();
                        sigBytes = (0, viem_1.hexToBytes)(sig);
                        v = sigBytes[64];
                        r = (0, viem_1.bytesToHex)(sigBytes.slice(0, 32));
                        s = (0, viem_1.bytesToHex)(sigBytes.slice(32, 64));
                        return [2 /*return*/, wallet.writeContract({
                                address: abi.addresses.StoreReg,
                                abi: abi.StoreReg,
                                functionName: "redeemInvite",
                                args: [BigInt(this.storeId), v, r, s, wallet.account.address],
                            })];
                }
            });
        });
    };
    return BlockchainClient;
}());
exports.BlockchainClient = BlockchainClient;
