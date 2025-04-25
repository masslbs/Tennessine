/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import $protobuf from "protobufjs";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const market = $root.market = (() => {

    /**
     * Namespace market.
     * @exports market
     * @namespace
     */
    const market = {};

    market.mass = (function() {

        /**
         * Namespace mass.
         * @memberof market
         * @namespace
         */
        const mass = {};

        mass.AuthenticateRequest = (function() {

            /**
             * Properties of an AuthenticateRequest.
             * @memberof market.mass
             * @interface IAuthenticateRequest
             * @property {market.mass.IPublicKey|null} [publicKey] AuthenticateRequest publicKey
             */

            /**
             * Constructs a new AuthenticateRequest.
             * @memberof market.mass
             * @classdesc Represents an AuthenticateRequest.
             * @implements IAuthenticateRequest
             * @constructor
             * @param {market.mass.IAuthenticateRequest=} [properties] Properties to set
             */
            function AuthenticateRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * AuthenticateRequest publicKey.
             * @member {market.mass.IPublicKey|null|undefined} publicKey
             * @memberof market.mass.AuthenticateRequest
             * @instance
             */
            AuthenticateRequest.prototype.publicKey = null;

            /**
             * Creates a new AuthenticateRequest instance using the specified properties.
             * @function create
             * @memberof market.mass.AuthenticateRequest
             * @static
             * @param {market.mass.IAuthenticateRequest=} [properties] Properties to set
             * @returns {market.mass.AuthenticateRequest} AuthenticateRequest instance
             */
            AuthenticateRequest.create = function create(properties) {
                return new AuthenticateRequest(properties);
            };

            /**
             * Encodes the specified AuthenticateRequest message. Does not implicitly {@link market.mass.AuthenticateRequest.verify|verify} messages.
             * @function encode
             * @memberof market.mass.AuthenticateRequest
             * @static
             * @param {market.mass.IAuthenticateRequest} message AuthenticateRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            AuthenticateRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.publicKey != null && Object.hasOwnProperty.call(message, "publicKey"))
                    $root.market.mass.PublicKey.encode(message.publicKey, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified AuthenticateRequest message, length delimited. Does not implicitly {@link market.mass.AuthenticateRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof market.mass.AuthenticateRequest
             * @static
             * @param {market.mass.IAuthenticateRequest} message AuthenticateRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            AuthenticateRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an AuthenticateRequest message from the specified reader or buffer.
             * @function decode
             * @memberof market.mass.AuthenticateRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {market.mass.AuthenticateRequest} AuthenticateRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AuthenticateRequest.decode = function decode(reader, length, error) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.AuthenticateRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 2: {
                            message.publicKey = $root.market.mass.PublicKey.decode(reader, reader.uint32());
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an AuthenticateRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof market.mass.AuthenticateRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {market.mass.AuthenticateRequest} AuthenticateRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AuthenticateRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an AuthenticateRequest message.
             * @function verify
             * @memberof market.mass.AuthenticateRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            AuthenticateRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.publicKey != null && message.hasOwnProperty("publicKey")) {
                    let error = $root.market.mass.PublicKey.verify(message.publicKey);
                    if (error)
                        return "publicKey." + error;
                }
                return null;
            };

            /**
             * Creates an AuthenticateRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof market.mass.AuthenticateRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {market.mass.AuthenticateRequest} AuthenticateRequest
             */
            AuthenticateRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.market.mass.AuthenticateRequest)
                    return object;
                let message = new $root.market.mass.AuthenticateRequest();
                if (object.publicKey != null) {
                    if (typeof object.publicKey !== "object")
                        throw TypeError(".market.mass.AuthenticateRequest.publicKey: object expected");
                    message.publicKey = $root.market.mass.PublicKey.fromObject(object.publicKey);
                }
                return message;
            };

            /**
             * Creates a plain object from an AuthenticateRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof market.mass.AuthenticateRequest
             * @static
             * @param {market.mass.AuthenticateRequest} message AuthenticateRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            AuthenticateRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    object.publicKey = null;
                if (message.publicKey != null && message.hasOwnProperty("publicKey"))
                    object.publicKey = $root.market.mass.PublicKey.toObject(message.publicKey, options);
                return object;
            };

            /**
             * Converts this AuthenticateRequest to JSON.
             * @function toJSON
             * @memberof market.mass.AuthenticateRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            AuthenticateRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for AuthenticateRequest
             * @function getTypeUrl
             * @memberof market.mass.AuthenticateRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            AuthenticateRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/market.mass.AuthenticateRequest";
            };

            return AuthenticateRequest;
        })();

        mass.ChallengeSolvedRequest = (function() {

            /**
             * Properties of a ChallengeSolvedRequest.
             * @memberof market.mass
             * @interface IChallengeSolvedRequest
             * @property {market.mass.ISignature|null} [signature] ChallengeSolvedRequest signature
             */

            /**
             * Constructs a new ChallengeSolvedRequest.
             * @memberof market.mass
             * @classdesc Represents a ChallengeSolvedRequest.
             * @implements IChallengeSolvedRequest
             * @constructor
             * @param {market.mass.IChallengeSolvedRequest=} [properties] Properties to set
             */
            function ChallengeSolvedRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * ChallengeSolvedRequest signature.
             * @member {market.mass.ISignature|null|undefined} signature
             * @memberof market.mass.ChallengeSolvedRequest
             * @instance
             */
            ChallengeSolvedRequest.prototype.signature = null;

            /**
             * Creates a new ChallengeSolvedRequest instance using the specified properties.
             * @function create
             * @memberof market.mass.ChallengeSolvedRequest
             * @static
             * @param {market.mass.IChallengeSolvedRequest=} [properties] Properties to set
             * @returns {market.mass.ChallengeSolvedRequest} ChallengeSolvedRequest instance
             */
            ChallengeSolvedRequest.create = function create(properties) {
                return new ChallengeSolvedRequest(properties);
            };

            /**
             * Encodes the specified ChallengeSolvedRequest message. Does not implicitly {@link market.mass.ChallengeSolvedRequest.verify|verify} messages.
             * @function encode
             * @memberof market.mass.ChallengeSolvedRequest
             * @static
             * @param {market.mass.IChallengeSolvedRequest} message ChallengeSolvedRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ChallengeSolvedRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.signature != null && Object.hasOwnProperty.call(message, "signature"))
                    $root.market.mass.Signature.encode(message.signature, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified ChallengeSolvedRequest message, length delimited. Does not implicitly {@link market.mass.ChallengeSolvedRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof market.mass.ChallengeSolvedRequest
             * @static
             * @param {market.mass.IChallengeSolvedRequest} message ChallengeSolvedRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ChallengeSolvedRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a ChallengeSolvedRequest message from the specified reader or buffer.
             * @function decode
             * @memberof market.mass.ChallengeSolvedRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {market.mass.ChallengeSolvedRequest} ChallengeSolvedRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ChallengeSolvedRequest.decode = function decode(reader, length, error) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.ChallengeSolvedRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 2: {
                            message.signature = $root.market.mass.Signature.decode(reader, reader.uint32());
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a ChallengeSolvedRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof market.mass.ChallengeSolvedRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {market.mass.ChallengeSolvedRequest} ChallengeSolvedRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ChallengeSolvedRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ChallengeSolvedRequest message.
             * @function verify
             * @memberof market.mass.ChallengeSolvedRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ChallengeSolvedRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.signature != null && message.hasOwnProperty("signature")) {
                    let error = $root.market.mass.Signature.verify(message.signature);
                    if (error)
                        return "signature." + error;
                }
                return null;
            };

            /**
             * Creates a ChallengeSolvedRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof market.mass.ChallengeSolvedRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {market.mass.ChallengeSolvedRequest} ChallengeSolvedRequest
             */
            ChallengeSolvedRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.market.mass.ChallengeSolvedRequest)
                    return object;
                let message = new $root.market.mass.ChallengeSolvedRequest();
                if (object.signature != null) {
                    if (typeof object.signature !== "object")
                        throw TypeError(".market.mass.ChallengeSolvedRequest.signature: object expected");
                    message.signature = $root.market.mass.Signature.fromObject(object.signature);
                }
                return message;
            };

            /**
             * Creates a plain object from a ChallengeSolvedRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof market.mass.ChallengeSolvedRequest
             * @static
             * @param {market.mass.ChallengeSolvedRequest} message ChallengeSolvedRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ChallengeSolvedRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    object.signature = null;
                if (message.signature != null && message.hasOwnProperty("signature"))
                    object.signature = $root.market.mass.Signature.toObject(message.signature, options);
                return object;
            };

            /**
             * Converts this ChallengeSolvedRequest to JSON.
             * @function toJSON
             * @memberof market.mass.ChallengeSolvedRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ChallengeSolvedRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for ChallengeSolvedRequest
             * @function getTypeUrl
             * @memberof market.mass.ChallengeSolvedRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            ChallengeSolvedRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/market.mass.ChallengeSolvedRequest";
            };

            return ChallengeSolvedRequest;
        })();

        mass.RequestId = (function() {

            /**
             * Properties of a RequestId.
             * @memberof market.mass
             * @interface IRequestId
             * @property {number|Long|null} [raw] RequestId raw
             */

            /**
             * Constructs a new RequestId.
             * @memberof market.mass
             * @classdesc Represents a RequestId.
             * @implements IRequestId
             * @constructor
             * @param {market.mass.IRequestId=} [properties] Properties to set
             */
            function RequestId(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * RequestId raw.
             * @member {number|Long} raw
             * @memberof market.mass.RequestId
             * @instance
             */
            RequestId.prototype.raw = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

            /**
             * Creates a new RequestId instance using the specified properties.
             * @function create
             * @memberof market.mass.RequestId
             * @static
             * @param {market.mass.IRequestId=} [properties] Properties to set
             * @returns {market.mass.RequestId} RequestId instance
             */
            RequestId.create = function create(properties) {
                return new RequestId(properties);
            };

            /**
             * Encodes the specified RequestId message. Does not implicitly {@link market.mass.RequestId.verify|verify} messages.
             * @function encode
             * @memberof market.mass.RequestId
             * @static
             * @param {market.mass.IRequestId} message RequestId message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            RequestId.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.raw != null && Object.hasOwnProperty.call(message, "raw"))
                    writer.uint32(/* id 1, wireType 0 =*/8).sint64(message.raw);
                return writer;
            };

            /**
             * Encodes the specified RequestId message, length delimited. Does not implicitly {@link market.mass.RequestId.verify|verify} messages.
             * @function encodeDelimited
             * @memberof market.mass.RequestId
             * @static
             * @param {market.mass.IRequestId} message RequestId message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            RequestId.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a RequestId message from the specified reader or buffer.
             * @function decode
             * @memberof market.mass.RequestId
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {market.mass.RequestId} RequestId
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            RequestId.decode = function decode(reader, length, error) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.RequestId();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.raw = reader.sint64();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a RequestId message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof market.mass.RequestId
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {market.mass.RequestId} RequestId
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            RequestId.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a RequestId message.
             * @function verify
             * @memberof market.mass.RequestId
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            RequestId.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.raw != null && message.hasOwnProperty("raw"))
                    if (!$util.isInteger(message.raw) && !(message.raw && $util.isInteger(message.raw.low) && $util.isInteger(message.raw.high)))
                        return "raw: integer|Long expected";
                return null;
            };

            /**
             * Creates a RequestId message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof market.mass.RequestId
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {market.mass.RequestId} RequestId
             */
            RequestId.fromObject = function fromObject(object) {
                if (object instanceof $root.market.mass.RequestId)
                    return object;
                let message = new $root.market.mass.RequestId();
                if (object.raw != null)
                    if ($util.Long)
                        (message.raw = $util.Long.fromValue(object.raw)).unsigned = false;
                    else if (typeof object.raw === "string")
                        message.raw = parseInt(object.raw, 10);
                    else if (typeof object.raw === "number")
                        message.raw = object.raw;
                    else if (typeof object.raw === "object")
                        message.raw = new $util.LongBits(object.raw.low >>> 0, object.raw.high >>> 0).toNumber();
                return message;
            };

            /**
             * Creates a plain object from a RequestId message. Also converts values to other types if specified.
             * @function toObject
             * @memberof market.mass.RequestId
             * @static
             * @param {market.mass.RequestId} message RequestId
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            RequestId.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, false);
                        object.raw = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.raw = options.longs === String ? "0" : 0;
                if (message.raw != null && message.hasOwnProperty("raw"))
                    if (typeof message.raw === "number")
                        object.raw = options.longs === String ? String(message.raw) : message.raw;
                    else
                        object.raw = options.longs === String ? $util.Long.prototype.toString.call(message.raw) : options.longs === Number ? new $util.LongBits(message.raw.low >>> 0, message.raw.high >>> 0).toNumber() : message.raw;
                return object;
            };

            /**
             * Converts this RequestId to JSON.
             * @function toJSON
             * @memberof market.mass.RequestId
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            RequestId.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for RequestId
             * @function getTypeUrl
             * @memberof market.mass.RequestId
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            RequestId.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/market.mass.RequestId";
            };

            return RequestId;
        })();

        mass.Signature = (function() {

            /**
             * Properties of a Signature.
             * @memberof market.mass
             * @interface ISignature
             * @property {Uint8Array|null} [raw] Signature raw
             */

            /**
             * Constructs a new Signature.
             * @memberof market.mass
             * @classdesc Represents a Signature.
             * @implements ISignature
             * @constructor
             * @param {market.mass.ISignature=} [properties] Properties to set
             */
            function Signature(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Signature raw.
             * @member {Uint8Array} raw
             * @memberof market.mass.Signature
             * @instance
             */
            Signature.prototype.raw = $util.newBuffer([]);

            /**
             * Creates a new Signature instance using the specified properties.
             * @function create
             * @memberof market.mass.Signature
             * @static
             * @param {market.mass.ISignature=} [properties] Properties to set
             * @returns {market.mass.Signature} Signature instance
             */
            Signature.create = function create(properties) {
                return new Signature(properties);
            };

            /**
             * Encodes the specified Signature message. Does not implicitly {@link market.mass.Signature.verify|verify} messages.
             * @function encode
             * @memberof market.mass.Signature
             * @static
             * @param {market.mass.ISignature} message Signature message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Signature.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.raw != null && Object.hasOwnProperty.call(message, "raw"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.raw);
                return writer;
            };

            /**
             * Encodes the specified Signature message, length delimited. Does not implicitly {@link market.mass.Signature.verify|verify} messages.
             * @function encodeDelimited
             * @memberof market.mass.Signature
             * @static
             * @param {market.mass.ISignature} message Signature message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Signature.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a Signature message from the specified reader or buffer.
             * @function decode
             * @memberof market.mass.Signature
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {market.mass.Signature} Signature
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Signature.decode = function decode(reader, length, error) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.Signature();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.raw = reader.bytes();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a Signature message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof market.mass.Signature
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {market.mass.Signature} Signature
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Signature.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Signature message.
             * @function verify
             * @memberof market.mass.Signature
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Signature.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.raw != null && message.hasOwnProperty("raw"))
                    if (!(message.raw && typeof message.raw.length === "number" || $util.isString(message.raw)))
                        return "raw: buffer expected";
                return null;
            };

            /**
             * Creates a Signature message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof market.mass.Signature
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {market.mass.Signature} Signature
             */
            Signature.fromObject = function fromObject(object) {
                if (object instanceof $root.market.mass.Signature)
                    return object;
                let message = new $root.market.mass.Signature();
                if (object.raw != null)
                    if (typeof object.raw === "string")
                        $util.base64.decode(object.raw, message.raw = $util.newBuffer($util.base64.length(object.raw)), 0);
                    else if (object.raw.length >= 0)
                        message.raw = object.raw;
                return message;
            };

            /**
             * Creates a plain object from a Signature message. Also converts values to other types if specified.
             * @function toObject
             * @memberof market.mass.Signature
             * @static
             * @param {market.mass.Signature} message Signature
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Signature.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    if (options.bytes === String)
                        object.raw = "";
                    else {
                        object.raw = [];
                        if (options.bytes !== Array)
                            object.raw = $util.newBuffer(object.raw);
                    }
                if (message.raw != null && message.hasOwnProperty("raw"))
                    object.raw = options.bytes === String ? $util.base64.encode(message.raw, 0, message.raw.length) : options.bytes === Array ? Array.prototype.slice.call(message.raw) : message.raw;
                return object;
            };

            /**
             * Converts this Signature to JSON.
             * @function toJSON
             * @memberof market.mass.Signature
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Signature.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for Signature
             * @function getTypeUrl
             * @memberof market.mass.Signature
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            Signature.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/market.mass.Signature";
            };

            return Signature;
        })();

        mass.PublicKey = (function() {

            /**
             * Properties of a PublicKey.
             * @memberof market.mass
             * @interface IPublicKey
             * @property {Uint8Array|null} [raw] PublicKey raw
             */

            /**
             * Constructs a new PublicKey.
             * @memberof market.mass
             * @classdesc Represents a PublicKey.
             * @implements IPublicKey
             * @constructor
             * @param {market.mass.IPublicKey=} [properties] Properties to set
             */
            function PublicKey(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * PublicKey raw.
             * @member {Uint8Array} raw
             * @memberof market.mass.PublicKey
             * @instance
             */
            PublicKey.prototype.raw = $util.newBuffer([]);

            /**
             * Creates a new PublicKey instance using the specified properties.
             * @function create
             * @memberof market.mass.PublicKey
             * @static
             * @param {market.mass.IPublicKey=} [properties] Properties to set
             * @returns {market.mass.PublicKey} PublicKey instance
             */
            PublicKey.create = function create(properties) {
                return new PublicKey(properties);
            };

            /**
             * Encodes the specified PublicKey message. Does not implicitly {@link market.mass.PublicKey.verify|verify} messages.
             * @function encode
             * @memberof market.mass.PublicKey
             * @static
             * @param {market.mass.IPublicKey} message PublicKey message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PublicKey.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.raw != null && Object.hasOwnProperty.call(message, "raw"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.raw);
                return writer;
            };

            /**
             * Encodes the specified PublicKey message, length delimited. Does not implicitly {@link market.mass.PublicKey.verify|verify} messages.
             * @function encodeDelimited
             * @memberof market.mass.PublicKey
             * @static
             * @param {market.mass.IPublicKey} message PublicKey message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PublicKey.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a PublicKey message from the specified reader or buffer.
             * @function decode
             * @memberof market.mass.PublicKey
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {market.mass.PublicKey} PublicKey
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PublicKey.decode = function decode(reader, length, error) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.PublicKey();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.raw = reader.bytes();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a PublicKey message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof market.mass.PublicKey
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {market.mass.PublicKey} PublicKey
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PublicKey.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a PublicKey message.
             * @function verify
             * @memberof market.mass.PublicKey
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            PublicKey.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.raw != null && message.hasOwnProperty("raw"))
                    if (!(message.raw && typeof message.raw.length === "number" || $util.isString(message.raw)))
                        return "raw: buffer expected";
                return null;
            };

            /**
             * Creates a PublicKey message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof market.mass.PublicKey
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {market.mass.PublicKey} PublicKey
             */
            PublicKey.fromObject = function fromObject(object) {
                if (object instanceof $root.market.mass.PublicKey)
                    return object;
                let message = new $root.market.mass.PublicKey();
                if (object.raw != null)
                    if (typeof object.raw === "string")
                        $util.base64.decode(object.raw, message.raw = $util.newBuffer($util.base64.length(object.raw)), 0);
                    else if (object.raw.length >= 0)
                        message.raw = object.raw;
                return message;
            };

            /**
             * Creates a plain object from a PublicKey message. Also converts values to other types if specified.
             * @function toObject
             * @memberof market.mass.PublicKey
             * @static
             * @param {market.mass.PublicKey} message PublicKey
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            PublicKey.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    if (options.bytes === String)
                        object.raw = "";
                    else {
                        object.raw = [];
                        if (options.bytes !== Array)
                            object.raw = $util.newBuffer(object.raw);
                    }
                if (message.raw != null && message.hasOwnProperty("raw"))
                    object.raw = options.bytes === String ? $util.base64.encode(message.raw, 0, message.raw.length) : options.bytes === Array ? Array.prototype.slice.call(message.raw) : message.raw;
                return object;
            };

            /**
             * Converts this PublicKey to JSON.
             * @function toJSON
             * @memberof market.mass.PublicKey
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            PublicKey.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for PublicKey
             * @function getTypeUrl
             * @memberof market.mass.PublicKey
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            PublicKey.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/market.mass.PublicKey";
            };

            return PublicKey;
        })();

        mass.Uint256 = (function() {

            /**
             * Properties of an Uint256.
             * @memberof market.mass
             * @interface IUint256
             * @property {Uint8Array|null} [raw] Uint256 raw
             */

            /**
             * Constructs a new Uint256.
             * @memberof market.mass
             * @classdesc Represents an Uint256.
             * @implements IUint256
             * @constructor
             * @param {market.mass.IUint256=} [properties] Properties to set
             */
            function Uint256(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Uint256 raw.
             * @member {Uint8Array} raw
             * @memberof market.mass.Uint256
             * @instance
             */
            Uint256.prototype.raw = $util.newBuffer([]);

            /**
             * Creates a new Uint256 instance using the specified properties.
             * @function create
             * @memberof market.mass.Uint256
             * @static
             * @param {market.mass.IUint256=} [properties] Properties to set
             * @returns {market.mass.Uint256} Uint256 instance
             */
            Uint256.create = function create(properties) {
                return new Uint256(properties);
            };

            /**
             * Encodes the specified Uint256 message. Does not implicitly {@link market.mass.Uint256.verify|verify} messages.
             * @function encode
             * @memberof market.mass.Uint256
             * @static
             * @param {market.mass.IUint256} message Uint256 message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Uint256.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.raw != null && Object.hasOwnProperty.call(message, "raw"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.raw);
                return writer;
            };

            /**
             * Encodes the specified Uint256 message, length delimited. Does not implicitly {@link market.mass.Uint256.verify|verify} messages.
             * @function encodeDelimited
             * @memberof market.mass.Uint256
             * @static
             * @param {market.mass.IUint256} message Uint256 message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Uint256.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an Uint256 message from the specified reader or buffer.
             * @function decode
             * @memberof market.mass.Uint256
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {market.mass.Uint256} Uint256
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Uint256.decode = function decode(reader, length, error) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.Uint256();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.raw = reader.bytes();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an Uint256 message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof market.mass.Uint256
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {market.mass.Uint256} Uint256
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Uint256.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an Uint256 message.
             * @function verify
             * @memberof market.mass.Uint256
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Uint256.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.raw != null && message.hasOwnProperty("raw"))
                    if (!(message.raw && typeof message.raw.length === "number" || $util.isString(message.raw)))
                        return "raw: buffer expected";
                return null;
            };

            /**
             * Creates an Uint256 message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof market.mass.Uint256
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {market.mass.Uint256} Uint256
             */
            Uint256.fromObject = function fromObject(object) {
                if (object instanceof $root.market.mass.Uint256)
                    return object;
                let message = new $root.market.mass.Uint256();
                if (object.raw != null)
                    if (typeof object.raw === "string")
                        $util.base64.decode(object.raw, message.raw = $util.newBuffer($util.base64.length(object.raw)), 0);
                    else if (object.raw.length >= 0)
                        message.raw = object.raw;
                return message;
            };

            /**
             * Creates a plain object from an Uint256 message. Also converts values to other types if specified.
             * @function toObject
             * @memberof market.mass.Uint256
             * @static
             * @param {market.mass.Uint256} message Uint256
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Uint256.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    if (options.bytes === String)
                        object.raw = "";
                    else {
                        object.raw = [];
                        if (options.bytes !== Array)
                            object.raw = $util.newBuffer(object.raw);
                    }
                if (message.raw != null && message.hasOwnProperty("raw"))
                    object.raw = options.bytes === String ? $util.base64.encode(message.raw, 0, message.raw.length) : options.bytes === Array ? Array.prototype.slice.call(message.raw) : message.raw;
                return object;
            };

            /**
             * Converts this Uint256 to JSON.
             * @function toJSON
             * @memberof market.mass.Uint256
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Uint256.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for Uint256
             * @function getTypeUrl
             * @memberof market.mass.Uint256
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            Uint256.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/market.mass.Uint256";
            };

            return Uint256;
        })();

        mass.ObjectId = (function() {

            /**
             * Properties of an ObjectId.
             * @memberof market.mass
             * @interface IObjectId
             * @property {Uint8Array|null} [raw] ObjectId raw
             */

            /**
             * Constructs a new ObjectId.
             * @memberof market.mass
             * @classdesc Represents an ObjectId.
             * @implements IObjectId
             * @constructor
             * @param {market.mass.IObjectId=} [properties] Properties to set
             */
            function ObjectId(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * ObjectId raw.
             * @member {Uint8Array} raw
             * @memberof market.mass.ObjectId
             * @instance
             */
            ObjectId.prototype.raw = $util.newBuffer([]);

            /**
             * Creates a new ObjectId instance using the specified properties.
             * @function create
             * @memberof market.mass.ObjectId
             * @static
             * @param {market.mass.IObjectId=} [properties] Properties to set
             * @returns {market.mass.ObjectId} ObjectId instance
             */
            ObjectId.create = function create(properties) {
                return new ObjectId(properties);
            };

            /**
             * Encodes the specified ObjectId message. Does not implicitly {@link market.mass.ObjectId.verify|verify} messages.
             * @function encode
             * @memberof market.mass.ObjectId
             * @static
             * @param {market.mass.IObjectId} message ObjectId message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ObjectId.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.raw != null && Object.hasOwnProperty.call(message, "raw"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.raw);
                return writer;
            };

            /**
             * Encodes the specified ObjectId message, length delimited. Does not implicitly {@link market.mass.ObjectId.verify|verify} messages.
             * @function encodeDelimited
             * @memberof market.mass.ObjectId
             * @static
             * @param {market.mass.IObjectId} message ObjectId message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ObjectId.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an ObjectId message from the specified reader or buffer.
             * @function decode
             * @memberof market.mass.ObjectId
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {market.mass.ObjectId} ObjectId
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ObjectId.decode = function decode(reader, length, error) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.ObjectId();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.raw = reader.bytes();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an ObjectId message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof market.mass.ObjectId
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {market.mass.ObjectId} ObjectId
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ObjectId.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an ObjectId message.
             * @function verify
             * @memberof market.mass.ObjectId
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ObjectId.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.raw != null && message.hasOwnProperty("raw"))
                    if (!(message.raw && typeof message.raw.length === "number" || $util.isString(message.raw)))
                        return "raw: buffer expected";
                return null;
            };

            /**
             * Creates an ObjectId message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof market.mass.ObjectId
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {market.mass.ObjectId} ObjectId
             */
            ObjectId.fromObject = function fromObject(object) {
                if (object instanceof $root.market.mass.ObjectId)
                    return object;
                let message = new $root.market.mass.ObjectId();
                if (object.raw != null)
                    if (typeof object.raw === "string")
                        $util.base64.decode(object.raw, message.raw = $util.newBuffer($util.base64.length(object.raw)), 0);
                    else if (object.raw.length >= 0)
                        message.raw = object.raw;
                return message;
            };

            /**
             * Creates a plain object from an ObjectId message. Also converts values to other types if specified.
             * @function toObject
             * @memberof market.mass.ObjectId
             * @static
             * @param {market.mass.ObjectId} message ObjectId
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ObjectId.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    if (options.bytes === String)
                        object.raw = "";
                    else {
                        object.raw = [];
                        if (options.bytes !== Array)
                            object.raw = $util.newBuffer(object.raw);
                    }
                if (message.raw != null && message.hasOwnProperty("raw"))
                    object.raw = options.bytes === String ? $util.base64.encode(message.raw, 0, message.raw.length) : options.bytes === Array ? Array.prototype.slice.call(message.raw) : message.raw;
                return object;
            };

            /**
             * Converts this ObjectId to JSON.
             * @function toJSON
             * @memberof market.mass.ObjectId
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ObjectId.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for ObjectId
             * @function getTypeUrl
             * @memberof market.mass.ObjectId
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            ObjectId.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/market.mass.ObjectId";
            };

            return ObjectId;
        })();

        mass.Envelope = (function() {

            /**
             * Properties of an Envelope.
             * @memberof market.mass
             * @interface IEnvelope
             * @property {market.mass.IRequestId|null} [requestId] Envelope requestId
             * @property {market.mass.Envelope.IGenericResponse|null} [response] Envelope response
             * @property {market.mass.IPatchSetWriteRequest|null} [patchSetWriteRequest] Envelope patchSetWriteRequest
             * @property {market.mass.ISubscriptionRequest|null} [subscriptionRequest] Envelope subscriptionRequest
             * @property {market.mass.ISubscriptionCancelRequest|null} [subscriptionCancelRequest] Envelope subscriptionCancelRequest
             * @property {market.mass.ISubscriptionPushRequest|null} [subscriptionPushRequest] Envelope subscriptionPushRequest
             * @property {market.mass.ISyncStatusRequest|null} [syncStatusRequest] Envelope syncStatusRequest
             * @property {market.mass.IPingRequest|null} [pingRequest] Envelope pingRequest
             * @property {market.mass.IGetBlobUploadURLRequest|null} [getBlobUploadUrlRequest] Envelope getBlobUploadUrlRequest
             * @property {market.mass.IAuthenticateRequest|null} [authRequest] Envelope authRequest
             * @property {market.mass.IChallengeSolvedRequest|null} [challengeSolutionRequest] Envelope challengeSolutionRequest
             */

            /**
             * Constructs a new Envelope.
             * @memberof market.mass
             * @classdesc Represents an Envelope.
             * @implements IEnvelope
             * @constructor
             * @param {market.mass.IEnvelope=} [properties] Properties to set
             */
            function Envelope(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Envelope requestId.
             * @member {market.mass.IRequestId|null|undefined} requestId
             * @memberof market.mass.Envelope
             * @instance
             */
            Envelope.prototype.requestId = null;

            /**
             * Envelope response.
             * @member {market.mass.Envelope.IGenericResponse|null|undefined} response
             * @memberof market.mass.Envelope
             * @instance
             */
            Envelope.prototype.response = null;

            /**
             * Envelope patchSetWriteRequest.
             * @member {market.mass.IPatchSetWriteRequest|null|undefined} patchSetWriteRequest
             * @memberof market.mass.Envelope
             * @instance
             */
            Envelope.prototype.patchSetWriteRequest = null;

            /**
             * Envelope subscriptionRequest.
             * @member {market.mass.ISubscriptionRequest|null|undefined} subscriptionRequest
             * @memberof market.mass.Envelope
             * @instance
             */
            Envelope.prototype.subscriptionRequest = null;

            /**
             * Envelope subscriptionCancelRequest.
             * @member {market.mass.ISubscriptionCancelRequest|null|undefined} subscriptionCancelRequest
             * @memberof market.mass.Envelope
             * @instance
             */
            Envelope.prototype.subscriptionCancelRequest = null;

            /**
             * Envelope subscriptionPushRequest.
             * @member {market.mass.ISubscriptionPushRequest|null|undefined} subscriptionPushRequest
             * @memberof market.mass.Envelope
             * @instance
             */
            Envelope.prototype.subscriptionPushRequest = null;

            /**
             * Envelope syncStatusRequest.
             * @member {market.mass.ISyncStatusRequest|null|undefined} syncStatusRequest
             * @memberof market.mass.Envelope
             * @instance
             */
            Envelope.prototype.syncStatusRequest = null;

            /**
             * Envelope pingRequest.
             * @member {market.mass.IPingRequest|null|undefined} pingRequest
             * @memberof market.mass.Envelope
             * @instance
             */
            Envelope.prototype.pingRequest = null;

            /**
             * Envelope getBlobUploadUrlRequest.
             * @member {market.mass.IGetBlobUploadURLRequest|null|undefined} getBlobUploadUrlRequest
             * @memberof market.mass.Envelope
             * @instance
             */
            Envelope.prototype.getBlobUploadUrlRequest = null;

            /**
             * Envelope authRequest.
             * @member {market.mass.IAuthenticateRequest|null|undefined} authRequest
             * @memberof market.mass.Envelope
             * @instance
             */
            Envelope.prototype.authRequest = null;

            /**
             * Envelope challengeSolutionRequest.
             * @member {market.mass.IChallengeSolvedRequest|null|undefined} challengeSolutionRequest
             * @memberof market.mass.Envelope
             * @instance
             */
            Envelope.prototype.challengeSolutionRequest = null;

            // OneOf field names bound to virtual getters and setters
            let $oneOfFields;

            /**
             * Envelope message.
             * @member {"response"|"patchSetWriteRequest"|"subscriptionRequest"|"subscriptionCancelRequest"|"subscriptionPushRequest"|"syncStatusRequest"|"pingRequest"|"getBlobUploadUrlRequest"|"authRequest"|"challengeSolutionRequest"|undefined} message
             * @memberof market.mass.Envelope
             * @instance
             */
            Object.defineProperty(Envelope.prototype, "message", {
                get: $util.oneOfGetter($oneOfFields = ["response", "patchSetWriteRequest", "subscriptionRequest", "subscriptionCancelRequest", "subscriptionPushRequest", "syncStatusRequest", "pingRequest", "getBlobUploadUrlRequest", "authRequest", "challengeSolutionRequest"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new Envelope instance using the specified properties.
             * @function create
             * @memberof market.mass.Envelope
             * @static
             * @param {market.mass.IEnvelope=} [properties] Properties to set
             * @returns {market.mass.Envelope} Envelope instance
             */
            Envelope.create = function create(properties) {
                return new Envelope(properties);
            };

            /**
             * Encodes the specified Envelope message. Does not implicitly {@link market.mass.Envelope.verify|verify} messages.
             * @function encode
             * @memberof market.mass.Envelope
             * @static
             * @param {market.mass.IEnvelope} message Envelope message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Envelope.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.requestId != null && Object.hasOwnProperty.call(message, "requestId"))
                    $root.market.mass.RequestId.encode(message.requestId, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                if (message.response != null && Object.hasOwnProperty.call(message, "response"))
                    $root.market.mass.Envelope.GenericResponse.encode(message.response, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                if (message.patchSetWriteRequest != null && Object.hasOwnProperty.call(message, "patchSetWriteRequest"))
                    $root.market.mass.PatchSetWriteRequest.encode(message.patchSetWriteRequest, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                if (message.subscriptionRequest != null && Object.hasOwnProperty.call(message, "subscriptionRequest"))
                    $root.market.mass.SubscriptionRequest.encode(message.subscriptionRequest, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                if (message.subscriptionCancelRequest != null && Object.hasOwnProperty.call(message, "subscriptionCancelRequest"))
                    $root.market.mass.SubscriptionCancelRequest.encode(message.subscriptionCancelRequest, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
                if (message.subscriptionPushRequest != null && Object.hasOwnProperty.call(message, "subscriptionPushRequest"))
                    $root.market.mass.SubscriptionPushRequest.encode(message.subscriptionPushRequest, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
                if (message.syncStatusRequest != null && Object.hasOwnProperty.call(message, "syncStatusRequest"))
                    $root.market.mass.SyncStatusRequest.encode(message.syncStatusRequest, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
                if (message.pingRequest != null && Object.hasOwnProperty.call(message, "pingRequest"))
                    $root.market.mass.PingRequest.encode(message.pingRequest, writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
                if (message.getBlobUploadUrlRequest != null && Object.hasOwnProperty.call(message, "getBlobUploadUrlRequest"))
                    $root.market.mass.GetBlobUploadURLRequest.encode(message.getBlobUploadUrlRequest, writer.uint32(/* id 9, wireType 2 =*/74).fork()).ldelim();
                if (message.authRequest != null && Object.hasOwnProperty.call(message, "authRequest"))
                    $root.market.mass.AuthenticateRequest.encode(message.authRequest, writer.uint32(/* id 10, wireType 2 =*/82).fork()).ldelim();
                if (message.challengeSolutionRequest != null && Object.hasOwnProperty.call(message, "challengeSolutionRequest"))
                    $root.market.mass.ChallengeSolvedRequest.encode(message.challengeSolutionRequest, writer.uint32(/* id 11, wireType 2 =*/90).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified Envelope message, length delimited. Does not implicitly {@link market.mass.Envelope.verify|verify} messages.
             * @function encodeDelimited
             * @memberof market.mass.Envelope
             * @static
             * @param {market.mass.IEnvelope} message Envelope message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Envelope.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an Envelope message from the specified reader or buffer.
             * @function decode
             * @memberof market.mass.Envelope
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {market.mass.Envelope} Envelope
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Envelope.decode = function decode(reader, length, error) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.Envelope();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.requestId = $root.market.mass.RequestId.decode(reader, reader.uint32());
                            break;
                        }
                    case 2: {
                            message.response = $root.market.mass.Envelope.GenericResponse.decode(reader, reader.uint32());
                            break;
                        }
                    case 3: {
                            message.patchSetWriteRequest = $root.market.mass.PatchSetWriteRequest.decode(reader, reader.uint32());
                            break;
                        }
                    case 4: {
                            message.subscriptionRequest = $root.market.mass.SubscriptionRequest.decode(reader, reader.uint32());
                            break;
                        }
                    case 5: {
                            message.subscriptionCancelRequest = $root.market.mass.SubscriptionCancelRequest.decode(reader, reader.uint32());
                            break;
                        }
                    case 6: {
                            message.subscriptionPushRequest = $root.market.mass.SubscriptionPushRequest.decode(reader, reader.uint32());
                            break;
                        }
                    case 7: {
                            message.syncStatusRequest = $root.market.mass.SyncStatusRequest.decode(reader, reader.uint32());
                            break;
                        }
                    case 8: {
                            message.pingRequest = $root.market.mass.PingRequest.decode(reader, reader.uint32());
                            break;
                        }
                    case 9: {
                            message.getBlobUploadUrlRequest = $root.market.mass.GetBlobUploadURLRequest.decode(reader, reader.uint32());
                            break;
                        }
                    case 10: {
                            message.authRequest = $root.market.mass.AuthenticateRequest.decode(reader, reader.uint32());
                            break;
                        }
                    case 11: {
                            message.challengeSolutionRequest = $root.market.mass.ChallengeSolvedRequest.decode(reader, reader.uint32());
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an Envelope message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof market.mass.Envelope
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {market.mass.Envelope} Envelope
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Envelope.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an Envelope message.
             * @function verify
             * @memberof market.mass.Envelope
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Envelope.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                let properties = {};
                if (message.requestId != null && message.hasOwnProperty("requestId")) {
                    let error = $root.market.mass.RequestId.verify(message.requestId);
                    if (error)
                        return "requestId." + error;
                }
                if (message.response != null && message.hasOwnProperty("response")) {
                    properties.message = 1;
                    {
                        let error = $root.market.mass.Envelope.GenericResponse.verify(message.response);
                        if (error)
                            return "response." + error;
                    }
                }
                if (message.patchSetWriteRequest != null && message.hasOwnProperty("patchSetWriteRequest")) {
                    if (properties.message === 1)
                        return "message: multiple values";
                    properties.message = 1;
                    {
                        let error = $root.market.mass.PatchSetWriteRequest.verify(message.patchSetWriteRequest);
                        if (error)
                            return "patchSetWriteRequest." + error;
                    }
                }
                if (message.subscriptionRequest != null && message.hasOwnProperty("subscriptionRequest")) {
                    if (properties.message === 1)
                        return "message: multiple values";
                    properties.message = 1;
                    {
                        let error = $root.market.mass.SubscriptionRequest.verify(message.subscriptionRequest);
                        if (error)
                            return "subscriptionRequest." + error;
                    }
                }
                if (message.subscriptionCancelRequest != null && message.hasOwnProperty("subscriptionCancelRequest")) {
                    if (properties.message === 1)
                        return "message: multiple values";
                    properties.message = 1;
                    {
                        let error = $root.market.mass.SubscriptionCancelRequest.verify(message.subscriptionCancelRequest);
                        if (error)
                            return "subscriptionCancelRequest." + error;
                    }
                }
                if (message.subscriptionPushRequest != null && message.hasOwnProperty("subscriptionPushRequest")) {
                    if (properties.message === 1)
                        return "message: multiple values";
                    properties.message = 1;
                    {
                        let error = $root.market.mass.SubscriptionPushRequest.verify(message.subscriptionPushRequest);
                        if (error)
                            return "subscriptionPushRequest." + error;
                    }
                }
                if (message.syncStatusRequest != null && message.hasOwnProperty("syncStatusRequest")) {
                    if (properties.message === 1)
                        return "message: multiple values";
                    properties.message = 1;
                    {
                        let error = $root.market.mass.SyncStatusRequest.verify(message.syncStatusRequest);
                        if (error)
                            return "syncStatusRequest." + error;
                    }
                }
                if (message.pingRequest != null && message.hasOwnProperty("pingRequest")) {
                    if (properties.message === 1)
                        return "message: multiple values";
                    properties.message = 1;
                    {
                        let error = $root.market.mass.PingRequest.verify(message.pingRequest);
                        if (error)
                            return "pingRequest." + error;
                    }
                }
                if (message.getBlobUploadUrlRequest != null && message.hasOwnProperty("getBlobUploadUrlRequest")) {
                    if (properties.message === 1)
                        return "message: multiple values";
                    properties.message = 1;
                    {
                        let error = $root.market.mass.GetBlobUploadURLRequest.verify(message.getBlobUploadUrlRequest);
                        if (error)
                            return "getBlobUploadUrlRequest." + error;
                    }
                }
                if (message.authRequest != null && message.hasOwnProperty("authRequest")) {
                    if (properties.message === 1)
                        return "message: multiple values";
                    properties.message = 1;
                    {
                        let error = $root.market.mass.AuthenticateRequest.verify(message.authRequest);
                        if (error)
                            return "authRequest." + error;
                    }
                }
                if (message.challengeSolutionRequest != null && message.hasOwnProperty("challengeSolutionRequest")) {
                    if (properties.message === 1)
                        return "message: multiple values";
                    properties.message = 1;
                    {
                        let error = $root.market.mass.ChallengeSolvedRequest.verify(message.challengeSolutionRequest);
                        if (error)
                            return "challengeSolutionRequest." + error;
                    }
                }
                return null;
            };

            /**
             * Creates an Envelope message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof market.mass.Envelope
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {market.mass.Envelope} Envelope
             */
            Envelope.fromObject = function fromObject(object) {
                if (object instanceof $root.market.mass.Envelope)
                    return object;
                let message = new $root.market.mass.Envelope();
                if (object.requestId != null) {
                    if (typeof object.requestId !== "object")
                        throw TypeError(".market.mass.Envelope.requestId: object expected");
                    message.requestId = $root.market.mass.RequestId.fromObject(object.requestId);
                }
                if (object.response != null) {
                    if (typeof object.response !== "object")
                        throw TypeError(".market.mass.Envelope.response: object expected");
                    message.response = $root.market.mass.Envelope.GenericResponse.fromObject(object.response);
                }
                if (object.patchSetWriteRequest != null) {
                    if (typeof object.patchSetWriteRequest !== "object")
                        throw TypeError(".market.mass.Envelope.patchSetWriteRequest: object expected");
                    message.patchSetWriteRequest = $root.market.mass.PatchSetWriteRequest.fromObject(object.patchSetWriteRequest);
                }
                if (object.subscriptionRequest != null) {
                    if (typeof object.subscriptionRequest !== "object")
                        throw TypeError(".market.mass.Envelope.subscriptionRequest: object expected");
                    message.subscriptionRequest = $root.market.mass.SubscriptionRequest.fromObject(object.subscriptionRequest);
                }
                if (object.subscriptionCancelRequest != null) {
                    if (typeof object.subscriptionCancelRequest !== "object")
                        throw TypeError(".market.mass.Envelope.subscriptionCancelRequest: object expected");
                    message.subscriptionCancelRequest = $root.market.mass.SubscriptionCancelRequest.fromObject(object.subscriptionCancelRequest);
                }
                if (object.subscriptionPushRequest != null) {
                    if (typeof object.subscriptionPushRequest !== "object")
                        throw TypeError(".market.mass.Envelope.subscriptionPushRequest: object expected");
                    message.subscriptionPushRequest = $root.market.mass.SubscriptionPushRequest.fromObject(object.subscriptionPushRequest);
                }
                if (object.syncStatusRequest != null) {
                    if (typeof object.syncStatusRequest !== "object")
                        throw TypeError(".market.mass.Envelope.syncStatusRequest: object expected");
                    message.syncStatusRequest = $root.market.mass.SyncStatusRequest.fromObject(object.syncStatusRequest);
                }
                if (object.pingRequest != null) {
                    if (typeof object.pingRequest !== "object")
                        throw TypeError(".market.mass.Envelope.pingRequest: object expected");
                    message.pingRequest = $root.market.mass.PingRequest.fromObject(object.pingRequest);
                }
                if (object.getBlobUploadUrlRequest != null) {
                    if (typeof object.getBlobUploadUrlRequest !== "object")
                        throw TypeError(".market.mass.Envelope.getBlobUploadUrlRequest: object expected");
                    message.getBlobUploadUrlRequest = $root.market.mass.GetBlobUploadURLRequest.fromObject(object.getBlobUploadUrlRequest);
                }
                if (object.authRequest != null) {
                    if (typeof object.authRequest !== "object")
                        throw TypeError(".market.mass.Envelope.authRequest: object expected");
                    message.authRequest = $root.market.mass.AuthenticateRequest.fromObject(object.authRequest);
                }
                if (object.challengeSolutionRequest != null) {
                    if (typeof object.challengeSolutionRequest !== "object")
                        throw TypeError(".market.mass.Envelope.challengeSolutionRequest: object expected");
                    message.challengeSolutionRequest = $root.market.mass.ChallengeSolvedRequest.fromObject(object.challengeSolutionRequest);
                }
                return message;
            };

            /**
             * Creates a plain object from an Envelope message. Also converts values to other types if specified.
             * @function toObject
             * @memberof market.mass.Envelope
             * @static
             * @param {market.mass.Envelope} message Envelope
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Envelope.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    object.requestId = null;
                if (message.requestId != null && message.hasOwnProperty("requestId"))
                    object.requestId = $root.market.mass.RequestId.toObject(message.requestId, options);
                if (message.response != null && message.hasOwnProperty("response")) {
                    object.response = $root.market.mass.Envelope.GenericResponse.toObject(message.response, options);
                    if (options.oneofs)
                        object.message = "response";
                }
                if (message.patchSetWriteRequest != null && message.hasOwnProperty("patchSetWriteRequest")) {
                    object.patchSetWriteRequest = $root.market.mass.PatchSetWriteRequest.toObject(message.patchSetWriteRequest, options);
                    if (options.oneofs)
                        object.message = "patchSetWriteRequest";
                }
                if (message.subscriptionRequest != null && message.hasOwnProperty("subscriptionRequest")) {
                    object.subscriptionRequest = $root.market.mass.SubscriptionRequest.toObject(message.subscriptionRequest, options);
                    if (options.oneofs)
                        object.message = "subscriptionRequest";
                }
                if (message.subscriptionCancelRequest != null && message.hasOwnProperty("subscriptionCancelRequest")) {
                    object.subscriptionCancelRequest = $root.market.mass.SubscriptionCancelRequest.toObject(message.subscriptionCancelRequest, options);
                    if (options.oneofs)
                        object.message = "subscriptionCancelRequest";
                }
                if (message.subscriptionPushRequest != null && message.hasOwnProperty("subscriptionPushRequest")) {
                    object.subscriptionPushRequest = $root.market.mass.SubscriptionPushRequest.toObject(message.subscriptionPushRequest, options);
                    if (options.oneofs)
                        object.message = "subscriptionPushRequest";
                }
                if (message.syncStatusRequest != null && message.hasOwnProperty("syncStatusRequest")) {
                    object.syncStatusRequest = $root.market.mass.SyncStatusRequest.toObject(message.syncStatusRequest, options);
                    if (options.oneofs)
                        object.message = "syncStatusRequest";
                }
                if (message.pingRequest != null && message.hasOwnProperty("pingRequest")) {
                    object.pingRequest = $root.market.mass.PingRequest.toObject(message.pingRequest, options);
                    if (options.oneofs)
                        object.message = "pingRequest";
                }
                if (message.getBlobUploadUrlRequest != null && message.hasOwnProperty("getBlobUploadUrlRequest")) {
                    object.getBlobUploadUrlRequest = $root.market.mass.GetBlobUploadURLRequest.toObject(message.getBlobUploadUrlRequest, options);
                    if (options.oneofs)
                        object.message = "getBlobUploadUrlRequest";
                }
                if (message.authRequest != null && message.hasOwnProperty("authRequest")) {
                    object.authRequest = $root.market.mass.AuthenticateRequest.toObject(message.authRequest, options);
                    if (options.oneofs)
                        object.message = "authRequest";
                }
                if (message.challengeSolutionRequest != null && message.hasOwnProperty("challengeSolutionRequest")) {
                    object.challengeSolutionRequest = $root.market.mass.ChallengeSolvedRequest.toObject(message.challengeSolutionRequest, options);
                    if (options.oneofs)
                        object.message = "challengeSolutionRequest";
                }
                return object;
            };

            /**
             * Converts this Envelope to JSON.
             * @function toJSON
             * @memberof market.mass.Envelope
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Envelope.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for Envelope
             * @function getTypeUrl
             * @memberof market.mass.Envelope
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            Envelope.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/market.mass.Envelope";
            };

            Envelope.GenericResponse = (function() {

                /**
                 * Properties of a GenericResponse.
                 * @memberof market.mass.Envelope
                 * @interface IGenericResponse
                 * @property {market.mass.IError|null} [error] GenericResponse error
                 * @property {Uint8Array|null} [payload] GenericResponse payload
                 */

                /**
                 * Constructs a new GenericResponse.
                 * @memberof market.mass.Envelope
                 * @classdesc Represents a GenericResponse.
                 * @implements IGenericResponse
                 * @constructor
                 * @param {market.mass.Envelope.IGenericResponse=} [properties] Properties to set
                 */
                function GenericResponse(properties) {
                    if (properties)
                        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * GenericResponse error.
                 * @member {market.mass.IError|null|undefined} error
                 * @memberof market.mass.Envelope.GenericResponse
                 * @instance
                 */
                GenericResponse.prototype.error = null;

                /**
                 * GenericResponse payload.
                 * @member {Uint8Array|null|undefined} payload
                 * @memberof market.mass.Envelope.GenericResponse
                 * @instance
                 */
                GenericResponse.prototype.payload = null;

                // OneOf field names bound to virtual getters and setters
                let $oneOfFields;

                /**
                 * GenericResponse response.
                 * @member {"error"|"payload"|undefined} response
                 * @memberof market.mass.Envelope.GenericResponse
                 * @instance
                 */
                Object.defineProperty(GenericResponse.prototype, "response", {
                    get: $util.oneOfGetter($oneOfFields = ["error", "payload"]),
                    set: $util.oneOfSetter($oneOfFields)
                });

                /**
                 * Creates a new GenericResponse instance using the specified properties.
                 * @function create
                 * @memberof market.mass.Envelope.GenericResponse
                 * @static
                 * @param {market.mass.Envelope.IGenericResponse=} [properties] Properties to set
                 * @returns {market.mass.Envelope.GenericResponse} GenericResponse instance
                 */
                GenericResponse.create = function create(properties) {
                    return new GenericResponse(properties);
                };

                /**
                 * Encodes the specified GenericResponse message. Does not implicitly {@link market.mass.Envelope.GenericResponse.verify|verify} messages.
                 * @function encode
                 * @memberof market.mass.Envelope.GenericResponse
                 * @static
                 * @param {market.mass.Envelope.IGenericResponse} message GenericResponse message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                GenericResponse.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.error != null && Object.hasOwnProperty.call(message, "error"))
                        $root.market.mass.Error.encode(message.error, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                    if (message.payload != null && Object.hasOwnProperty.call(message, "payload"))
                        writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.payload);
                    return writer;
                };

                /**
                 * Encodes the specified GenericResponse message, length delimited. Does not implicitly {@link market.mass.Envelope.GenericResponse.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof market.mass.Envelope.GenericResponse
                 * @static
                 * @param {market.mass.Envelope.IGenericResponse} message GenericResponse message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                GenericResponse.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a GenericResponse message from the specified reader or buffer.
                 * @function decode
                 * @memberof market.mass.Envelope.GenericResponse
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {market.mass.Envelope.GenericResponse} GenericResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                GenericResponse.decode = function decode(reader, length, error) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    let end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.Envelope.GenericResponse();
                    while (reader.pos < end) {
                        let tag = reader.uint32();
                        if (tag === error)
                            break;
                        switch (tag >>> 3) {
                        case 1: {
                                message.error = $root.market.mass.Error.decode(reader, reader.uint32());
                                break;
                            }
                        case 2: {
                                message.payload = reader.bytes();
                                break;
                            }
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a GenericResponse message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof market.mass.Envelope.GenericResponse
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {market.mass.Envelope.GenericResponse} GenericResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                GenericResponse.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a GenericResponse message.
                 * @function verify
                 * @memberof market.mass.Envelope.GenericResponse
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                GenericResponse.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    let properties = {};
                    if (message.error != null && message.hasOwnProperty("error")) {
                        properties.response = 1;
                        {
                            let error = $root.market.mass.Error.verify(message.error);
                            if (error)
                                return "error." + error;
                        }
                    }
                    if (message.payload != null && message.hasOwnProperty("payload")) {
                        if (properties.response === 1)
                            return "response: multiple values";
                        properties.response = 1;
                        if (!(message.payload && typeof message.payload.length === "number" || $util.isString(message.payload)))
                            return "payload: buffer expected";
                    }
                    return null;
                };

                /**
                 * Creates a GenericResponse message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof market.mass.Envelope.GenericResponse
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {market.mass.Envelope.GenericResponse} GenericResponse
                 */
                GenericResponse.fromObject = function fromObject(object) {
                    if (object instanceof $root.market.mass.Envelope.GenericResponse)
                        return object;
                    let message = new $root.market.mass.Envelope.GenericResponse();
                    if (object.error != null) {
                        if (typeof object.error !== "object")
                            throw TypeError(".market.mass.Envelope.GenericResponse.error: object expected");
                        message.error = $root.market.mass.Error.fromObject(object.error);
                    }
                    if (object.payload != null)
                        if (typeof object.payload === "string")
                            $util.base64.decode(object.payload, message.payload = $util.newBuffer($util.base64.length(object.payload)), 0);
                        else if (object.payload.length >= 0)
                            message.payload = object.payload;
                    return message;
                };

                /**
                 * Creates a plain object from a GenericResponse message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof market.mass.Envelope.GenericResponse
                 * @static
                 * @param {market.mass.Envelope.GenericResponse} message GenericResponse
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                GenericResponse.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    let object = {};
                    if (message.error != null && message.hasOwnProperty("error")) {
                        object.error = $root.market.mass.Error.toObject(message.error, options);
                        if (options.oneofs)
                            object.response = "error";
                    }
                    if (message.payload != null && message.hasOwnProperty("payload")) {
                        object.payload = options.bytes === String ? $util.base64.encode(message.payload, 0, message.payload.length) : options.bytes === Array ? Array.prototype.slice.call(message.payload) : message.payload;
                        if (options.oneofs)
                            object.response = "payload";
                    }
                    return object;
                };

                /**
                 * Converts this GenericResponse to JSON.
                 * @function toJSON
                 * @memberof market.mass.Envelope.GenericResponse
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                GenericResponse.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * Gets the default type url for GenericResponse
                 * @function getTypeUrl
                 * @memberof market.mass.Envelope.GenericResponse
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                GenericResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/market.mass.Envelope.GenericResponse";
                };

                return GenericResponse;
            })();

            return Envelope;
        })();

        mass.Error = (function() {

            /**
             * Properties of an Error.
             * @memberof market.mass
             * @interface IError
             * @property {market.mass.ErrorCodes|null} [code] Error code
             * @property {string|null} [message] Error message
             * @property {market.mass.Error.IAdditionalInfo|null} [additionalInfo] Error additionalInfo
             */

            /**
             * Constructs a new Error.
             * @memberof market.mass
             * @classdesc Represents an Error.
             * @implements IError
             * @constructor
             * @param {market.mass.IError=} [properties] Properties to set
             */
            function Error(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Error code.
             * @member {market.mass.ErrorCodes} code
             * @memberof market.mass.Error
             * @instance
             */
            Error.prototype.code = 0;

            /**
             * Error message.
             * @member {string} message
             * @memberof market.mass.Error
             * @instance
             */
            Error.prototype.message = "";

            /**
             * Error additionalInfo.
             * @member {market.mass.Error.IAdditionalInfo|null|undefined} additionalInfo
             * @memberof market.mass.Error
             * @instance
             */
            Error.prototype.additionalInfo = null;

            /**
             * Creates a new Error instance using the specified properties.
             * @function create
             * @memberof market.mass.Error
             * @static
             * @param {market.mass.IError=} [properties] Properties to set
             * @returns {market.mass.Error} Error instance
             */
            Error.create = function create(properties) {
                return new Error(properties);
            };

            /**
             * Encodes the specified Error message. Does not implicitly {@link market.mass.Error.verify|verify} messages.
             * @function encode
             * @memberof market.mass.Error
             * @static
             * @param {market.mass.IError} message Error message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Error.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.code != null && Object.hasOwnProperty.call(message, "code"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int32(message.code);
                if (message.message != null && Object.hasOwnProperty.call(message, "message"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.message);
                if (message.additionalInfo != null && Object.hasOwnProperty.call(message, "additionalInfo"))
                    $root.market.mass.Error.AdditionalInfo.encode(message.additionalInfo, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified Error message, length delimited. Does not implicitly {@link market.mass.Error.verify|verify} messages.
             * @function encodeDelimited
             * @memberof market.mass.Error
             * @static
             * @param {market.mass.IError} message Error message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Error.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an Error message from the specified reader or buffer.
             * @function decode
             * @memberof market.mass.Error
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {market.mass.Error} Error
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Error.decode = function decode(reader, length, error) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.Error();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.code = reader.int32();
                            break;
                        }
                    case 2: {
                            message.message = reader.string();
                            break;
                        }
                    case 3: {
                            message.additionalInfo = $root.market.mass.Error.AdditionalInfo.decode(reader, reader.uint32());
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an Error message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof market.mass.Error
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {market.mass.Error} Error
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Error.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an Error message.
             * @function verify
             * @memberof market.mass.Error
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Error.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.code != null && message.hasOwnProperty("code"))
                    switch (message.code) {
                    default:
                        return "code: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                    case 6:
                    case 7:
                    case 8:
                    case 9:
                    case 10:
                    case 11:
                        break;
                    }
                if (message.message != null && message.hasOwnProperty("message"))
                    if (!$util.isString(message.message))
                        return "message: string expected";
                if (message.additionalInfo != null && message.hasOwnProperty("additionalInfo")) {
                    let error = $root.market.mass.Error.AdditionalInfo.verify(message.additionalInfo);
                    if (error)
                        return "additionalInfo." + error;
                }
                return null;
            };

            /**
             * Creates an Error message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof market.mass.Error
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {market.mass.Error} Error
             */
            Error.fromObject = function fromObject(object) {
                if (object instanceof $root.market.mass.Error)
                    return object;
                let message = new $root.market.mass.Error();
                switch (object.code) {
                default:
                    if (typeof object.code === "number") {
                        message.code = object.code;
                        break;
                    }
                    break;
                case "ERROR_CODES_UNSPECIFIED":
                case 0:
                    message.code = 0;
                    break;
                case "ERROR_CODES_NOT_FOUND":
                case 1:
                    message.code = 1;
                    break;
                case "ERROR_CODES_INVALID":
                case 2:
                    message.code = 2;
                    break;
                case "ERROR_CODES_NOT_AUTHENTICATED":
                case 3:
                    message.code = 3;
                    break;
                case "ERROR_CODES_ALREADY_AUTHENTICATED":
                case 4:
                    message.code = 4;
                    break;
                case "ERROR_CODES_ALREADY_CONNECTED":
                case 5:
                    message.code = 5;
                    break;
                case "ERROR_CODES_TOO_MANY_CONCURRENT_REQUESTS":
                case 6:
                    message.code = 6;
                    break;
                case "ERROR_CODES_UNLINKED_KEYCARD":
                case 7:
                    message.code = 7;
                    break;
                case "ERROR_CODES_MINIMUM_VERSION_NOT_REACHED":
                case 8:
                    message.code = 8;
                    break;
                case "ERROR_CODES_OUT_OF_STOCK":
                case 9:
                    message.code = 9;
                    break;
                case "ERROR_CODES_SIMULATED":
                case 10:
                    message.code = 10;
                    break;
                case "ERROR_CODES_CLOSE_SUBSCRIPTION":
                case 11:
                    message.code = 11;
                    break;
                }
                if (object.message != null)
                    message.message = String(object.message);
                if (object.additionalInfo != null) {
                    if (typeof object.additionalInfo !== "object")
                        throw TypeError(".market.mass.Error.additionalInfo: object expected");
                    message.additionalInfo = $root.market.mass.Error.AdditionalInfo.fromObject(object.additionalInfo);
                }
                return message;
            };

            /**
             * Creates a plain object from an Error message. Also converts values to other types if specified.
             * @function toObject
             * @memberof market.mass.Error
             * @static
             * @param {market.mass.Error} message Error
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Error.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.code = options.enums === String ? "ERROR_CODES_UNSPECIFIED" : 0;
                    object.message = "";
                    object.additionalInfo = null;
                }
                if (message.code != null && message.hasOwnProperty("code"))
                    object.code = options.enums === String ? $root.market.mass.ErrorCodes[message.code] === undefined ? message.code : $root.market.mass.ErrorCodes[message.code] : message.code;
                if (message.message != null && message.hasOwnProperty("message"))
                    object.message = message.message;
                if (message.additionalInfo != null && message.hasOwnProperty("additionalInfo"))
                    object.additionalInfo = $root.market.mass.Error.AdditionalInfo.toObject(message.additionalInfo, options);
                return object;
            };

            /**
             * Converts this Error to JSON.
             * @function toJSON
             * @memberof market.mass.Error
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Error.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for Error
             * @function getTypeUrl
             * @memberof market.mass.Error
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            Error.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/market.mass.Error";
            };

            Error.AdditionalInfo = (function() {

                /**
                 * Properties of an AdditionalInfo.
                 * @memberof market.mass.Error
                 * @interface IAdditionalInfo
                 * @property {number|Long|null} [objectId] AdditionalInfo objectId
                 */

                /**
                 * Constructs a new AdditionalInfo.
                 * @memberof market.mass.Error
                 * @classdesc Represents an AdditionalInfo.
                 * @implements IAdditionalInfo
                 * @constructor
                 * @param {market.mass.Error.IAdditionalInfo=} [properties] Properties to set
                 */
                function AdditionalInfo(properties) {
                    if (properties)
                        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * AdditionalInfo objectId.
                 * @member {number|Long} objectId
                 * @memberof market.mass.Error.AdditionalInfo
                 * @instance
                 */
                AdditionalInfo.prototype.objectId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

                /**
                 * Creates a new AdditionalInfo instance using the specified properties.
                 * @function create
                 * @memberof market.mass.Error.AdditionalInfo
                 * @static
                 * @param {market.mass.Error.IAdditionalInfo=} [properties] Properties to set
                 * @returns {market.mass.Error.AdditionalInfo} AdditionalInfo instance
                 */
                AdditionalInfo.create = function create(properties) {
                    return new AdditionalInfo(properties);
                };

                /**
                 * Encodes the specified AdditionalInfo message. Does not implicitly {@link market.mass.Error.AdditionalInfo.verify|verify} messages.
                 * @function encode
                 * @memberof market.mass.Error.AdditionalInfo
                 * @static
                 * @param {market.mass.Error.IAdditionalInfo} message AdditionalInfo message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                AdditionalInfo.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.objectId != null && Object.hasOwnProperty.call(message, "objectId"))
                        writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.objectId);
                    return writer;
                };

                /**
                 * Encodes the specified AdditionalInfo message, length delimited. Does not implicitly {@link market.mass.Error.AdditionalInfo.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof market.mass.Error.AdditionalInfo
                 * @static
                 * @param {market.mass.Error.IAdditionalInfo} message AdditionalInfo message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                AdditionalInfo.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes an AdditionalInfo message from the specified reader or buffer.
                 * @function decode
                 * @memberof market.mass.Error.AdditionalInfo
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {market.mass.Error.AdditionalInfo} AdditionalInfo
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                AdditionalInfo.decode = function decode(reader, length, error) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    let end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.Error.AdditionalInfo();
                    while (reader.pos < end) {
                        let tag = reader.uint32();
                        if (tag === error)
                            break;
                        switch (tag >>> 3) {
                        case 1: {
                                message.objectId = reader.uint64();
                                break;
                            }
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes an AdditionalInfo message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof market.mass.Error.AdditionalInfo
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {market.mass.Error.AdditionalInfo} AdditionalInfo
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                AdditionalInfo.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies an AdditionalInfo message.
                 * @function verify
                 * @memberof market.mass.Error.AdditionalInfo
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                AdditionalInfo.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.objectId != null && message.hasOwnProperty("objectId"))
                        if (!$util.isInteger(message.objectId) && !(message.objectId && $util.isInteger(message.objectId.low) && $util.isInteger(message.objectId.high)))
                            return "objectId: integer|Long expected";
                    return null;
                };

                /**
                 * Creates an AdditionalInfo message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof market.mass.Error.AdditionalInfo
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {market.mass.Error.AdditionalInfo} AdditionalInfo
                 */
                AdditionalInfo.fromObject = function fromObject(object) {
                    if (object instanceof $root.market.mass.Error.AdditionalInfo)
                        return object;
                    let message = new $root.market.mass.Error.AdditionalInfo();
                    if (object.objectId != null)
                        if ($util.Long)
                            (message.objectId = $util.Long.fromValue(object.objectId)).unsigned = true;
                        else if (typeof object.objectId === "string")
                            message.objectId = parseInt(object.objectId, 10);
                        else if (typeof object.objectId === "number")
                            message.objectId = object.objectId;
                        else if (typeof object.objectId === "object")
                            message.objectId = new $util.LongBits(object.objectId.low >>> 0, object.objectId.high >>> 0).toNumber(true);
                    return message;
                };

                /**
                 * Creates a plain object from an AdditionalInfo message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof market.mass.Error.AdditionalInfo
                 * @static
                 * @param {market.mass.Error.AdditionalInfo} message AdditionalInfo
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                AdditionalInfo.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    let object = {};
                    if (options.defaults)
                        if ($util.Long) {
                            let long = new $util.Long(0, 0, true);
                            object.objectId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                        } else
                            object.objectId = options.longs === String ? "0" : 0;
                    if (message.objectId != null && message.hasOwnProperty("objectId"))
                        if (typeof message.objectId === "number")
                            object.objectId = options.longs === String ? String(message.objectId) : message.objectId;
                        else
                            object.objectId = options.longs === String ? $util.Long.prototype.toString.call(message.objectId) : options.longs === Number ? new $util.LongBits(message.objectId.low >>> 0, message.objectId.high >>> 0).toNumber(true) : message.objectId;
                    return object;
                };

                /**
                 * Converts this AdditionalInfo to JSON.
                 * @function toJSON
                 * @memberof market.mass.Error.AdditionalInfo
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                AdditionalInfo.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * Gets the default type url for AdditionalInfo
                 * @function getTypeUrl
                 * @memberof market.mass.Error.AdditionalInfo
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                AdditionalInfo.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/market.mass.Error.AdditionalInfo";
                };

                return AdditionalInfo;
            })();

            return Error;
        })();

        /**
         * ErrorCodes enum.
         * @name market.mass.ErrorCodes
         * @enum {number}
         * @property {number} ERROR_CODES_UNSPECIFIED=0 ERROR_CODES_UNSPECIFIED value
         * @property {number} ERROR_CODES_NOT_FOUND=1 ERROR_CODES_NOT_FOUND value
         * @property {number} ERROR_CODES_INVALID=2 ERROR_CODES_INVALID value
         * @property {number} ERROR_CODES_NOT_AUTHENTICATED=3 ERROR_CODES_NOT_AUTHENTICATED value
         * @property {number} ERROR_CODES_ALREADY_AUTHENTICATED=4 ERROR_CODES_ALREADY_AUTHENTICATED value
         * @property {number} ERROR_CODES_ALREADY_CONNECTED=5 ERROR_CODES_ALREADY_CONNECTED value
         * @property {number} ERROR_CODES_TOO_MANY_CONCURRENT_REQUESTS=6 ERROR_CODES_TOO_MANY_CONCURRENT_REQUESTS value
         * @property {number} ERROR_CODES_UNLINKED_KEYCARD=7 ERROR_CODES_UNLINKED_KEYCARD value
         * @property {number} ERROR_CODES_MINIMUM_VERSION_NOT_REACHED=8 ERROR_CODES_MINIMUM_VERSION_NOT_REACHED value
         * @property {number} ERROR_CODES_OUT_OF_STOCK=9 ERROR_CODES_OUT_OF_STOCK value
         * @property {number} ERROR_CODES_SIMULATED=10 ERROR_CODES_SIMULATED value
         * @property {number} ERROR_CODES_CLOSE_SUBSCRIPTION=11 ERROR_CODES_CLOSE_SUBSCRIPTION value
         */
        mass.ErrorCodes = (function() {
            const valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "ERROR_CODES_UNSPECIFIED"] = 0;
            values[valuesById[1] = "ERROR_CODES_NOT_FOUND"] = 1;
            values[valuesById[2] = "ERROR_CODES_INVALID"] = 2;
            values[valuesById[3] = "ERROR_CODES_NOT_AUTHENTICATED"] = 3;
            values[valuesById[4] = "ERROR_CODES_ALREADY_AUTHENTICATED"] = 4;
            values[valuesById[5] = "ERROR_CODES_ALREADY_CONNECTED"] = 5;
            values[valuesById[6] = "ERROR_CODES_TOO_MANY_CONCURRENT_REQUESTS"] = 6;
            values[valuesById[7] = "ERROR_CODES_UNLINKED_KEYCARD"] = 7;
            values[valuesById[8] = "ERROR_CODES_MINIMUM_VERSION_NOT_REACHED"] = 8;
            values[valuesById[9] = "ERROR_CODES_OUT_OF_STOCK"] = 9;
            values[valuesById[10] = "ERROR_CODES_SIMULATED"] = 10;
            values[valuesById[11] = "ERROR_CODES_CLOSE_SUBSCRIPTION"] = 11;
            return values;
        })();

        mass.GetBlobUploadURLRequest = (function() {

            /**
             * Properties of a GetBlobUploadURLRequest.
             * @memberof market.mass
             * @interface IGetBlobUploadURLRequest
             */

            /**
             * Constructs a new GetBlobUploadURLRequest.
             * @memberof market.mass
             * @classdesc Represents a GetBlobUploadURLRequest.
             * @implements IGetBlobUploadURLRequest
             * @constructor
             * @param {market.mass.IGetBlobUploadURLRequest=} [properties] Properties to set
             */
            function GetBlobUploadURLRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Creates a new GetBlobUploadURLRequest instance using the specified properties.
             * @function create
             * @memberof market.mass.GetBlobUploadURLRequest
             * @static
             * @param {market.mass.IGetBlobUploadURLRequest=} [properties] Properties to set
             * @returns {market.mass.GetBlobUploadURLRequest} GetBlobUploadURLRequest instance
             */
            GetBlobUploadURLRequest.create = function create(properties) {
                return new GetBlobUploadURLRequest(properties);
            };

            /**
             * Encodes the specified GetBlobUploadURLRequest message. Does not implicitly {@link market.mass.GetBlobUploadURLRequest.verify|verify} messages.
             * @function encode
             * @memberof market.mass.GetBlobUploadURLRequest
             * @static
             * @param {market.mass.IGetBlobUploadURLRequest} message GetBlobUploadURLRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetBlobUploadURLRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                return writer;
            };

            /**
             * Encodes the specified GetBlobUploadURLRequest message, length delimited. Does not implicitly {@link market.mass.GetBlobUploadURLRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof market.mass.GetBlobUploadURLRequest
             * @static
             * @param {market.mass.IGetBlobUploadURLRequest} message GetBlobUploadURLRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetBlobUploadURLRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetBlobUploadURLRequest message from the specified reader or buffer.
             * @function decode
             * @memberof market.mass.GetBlobUploadURLRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {market.mass.GetBlobUploadURLRequest} GetBlobUploadURLRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetBlobUploadURLRequest.decode = function decode(reader, length, error) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.GetBlobUploadURLRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a GetBlobUploadURLRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof market.mass.GetBlobUploadURLRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {market.mass.GetBlobUploadURLRequest} GetBlobUploadURLRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetBlobUploadURLRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetBlobUploadURLRequest message.
             * @function verify
             * @memberof market.mass.GetBlobUploadURLRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetBlobUploadURLRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                return null;
            };

            /**
             * Creates a GetBlobUploadURLRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof market.mass.GetBlobUploadURLRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {market.mass.GetBlobUploadURLRequest} GetBlobUploadURLRequest
             */
            GetBlobUploadURLRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.market.mass.GetBlobUploadURLRequest)
                    return object;
                return new $root.market.mass.GetBlobUploadURLRequest();
            };

            /**
             * Creates a plain object from a GetBlobUploadURLRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof market.mass.GetBlobUploadURLRequest
             * @static
             * @param {market.mass.GetBlobUploadURLRequest} message GetBlobUploadURLRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetBlobUploadURLRequest.toObject = function toObject() {
                return {};
            };

            /**
             * Converts this GetBlobUploadURLRequest to JSON.
             * @function toJSON
             * @memberof market.mass.GetBlobUploadURLRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetBlobUploadURLRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetBlobUploadURLRequest
             * @function getTypeUrl
             * @memberof market.mass.GetBlobUploadURLRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetBlobUploadURLRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/market.mass.GetBlobUploadURLRequest";
            };

            return GetBlobUploadURLRequest;
        })();

        /**
         * ObjectType enum.
         * @name market.mass.ObjectType
         * @enum {number}
         * @property {number} OBJECT_TYPE_UNSPECIFIED=0 OBJECT_TYPE_UNSPECIFIED value
         * @property {number} OBJECT_TYPE_LISTING=1 OBJECT_TYPE_LISTING value
         * @property {number} OBJECT_TYPE_TAG=2 OBJECT_TYPE_TAG value
         * @property {number} OBJECT_TYPE_ORDER=3 OBJECT_TYPE_ORDER value
         * @property {number} OBJECT_TYPE_ACCOUNT=4 OBJECT_TYPE_ACCOUNT value
         * @property {number} OBJECT_TYPE_MANIFEST=5 OBJECT_TYPE_MANIFEST value
         * @property {number} OBJECT_TYPE_INVENTORY=6 OBJECT_TYPE_INVENTORY value
         */
        mass.ObjectType = (function() {
            const valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "OBJECT_TYPE_UNSPECIFIED"] = 0;
            values[valuesById[1] = "OBJECT_TYPE_LISTING"] = 1;
            values[valuesById[2] = "OBJECT_TYPE_TAG"] = 2;
            values[valuesById[3] = "OBJECT_TYPE_ORDER"] = 3;
            values[valuesById[4] = "OBJECT_TYPE_ACCOUNT"] = 4;
            values[valuesById[5] = "OBJECT_TYPE_MANIFEST"] = 5;
            values[valuesById[6] = "OBJECT_TYPE_INVENTORY"] = 6;
            return values;
        })();

        mass.SubscriptionRequest = (function() {

            /**
             * Properties of a SubscriptionRequest.
             * @memberof market.mass
             * @interface ISubscriptionRequest
             * @property {number|Long|null} [startShopSeqNo] SubscriptionRequest startShopSeqNo
             * @property {market.mass.IUint256|null} [shopId] SubscriptionRequest shopId
             * @property {Array.<market.mass.SubscriptionRequest.IFilter>|null} [filters] SubscriptionRequest filters
             */

            /**
             * Constructs a new SubscriptionRequest.
             * @memberof market.mass
             * @classdesc Represents a SubscriptionRequest.
             * @implements ISubscriptionRequest
             * @constructor
             * @param {market.mass.ISubscriptionRequest=} [properties] Properties to set
             */
            function SubscriptionRequest(properties) {
                this.filters = [];
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * SubscriptionRequest startShopSeqNo.
             * @member {number|Long} startShopSeqNo
             * @memberof market.mass.SubscriptionRequest
             * @instance
             */
            SubscriptionRequest.prototype.startShopSeqNo = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * SubscriptionRequest shopId.
             * @member {market.mass.IUint256|null|undefined} shopId
             * @memberof market.mass.SubscriptionRequest
             * @instance
             */
            SubscriptionRequest.prototype.shopId = null;

            /**
             * SubscriptionRequest filters.
             * @member {Array.<market.mass.SubscriptionRequest.IFilter>} filters
             * @memberof market.mass.SubscriptionRequest
             * @instance
             */
            SubscriptionRequest.prototype.filters = $util.emptyArray;

            /**
             * Creates a new SubscriptionRequest instance using the specified properties.
             * @function create
             * @memberof market.mass.SubscriptionRequest
             * @static
             * @param {market.mass.ISubscriptionRequest=} [properties] Properties to set
             * @returns {market.mass.SubscriptionRequest} SubscriptionRequest instance
             */
            SubscriptionRequest.create = function create(properties) {
                return new SubscriptionRequest(properties);
            };

            /**
             * Encodes the specified SubscriptionRequest message. Does not implicitly {@link market.mass.SubscriptionRequest.verify|verify} messages.
             * @function encode
             * @memberof market.mass.SubscriptionRequest
             * @static
             * @param {market.mass.ISubscriptionRequest} message SubscriptionRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SubscriptionRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.startShopSeqNo != null && Object.hasOwnProperty.call(message, "startShopSeqNo"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.startShopSeqNo);
                if (message.shopId != null && Object.hasOwnProperty.call(message, "shopId"))
                    $root.market.mass.Uint256.encode(message.shopId, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                if (message.filters != null && message.filters.length)
                    for (let i = 0; i < message.filters.length; ++i)
                        $root.market.mass.SubscriptionRequest.Filter.encode(message.filters[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified SubscriptionRequest message, length delimited. Does not implicitly {@link market.mass.SubscriptionRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof market.mass.SubscriptionRequest
             * @static
             * @param {market.mass.ISubscriptionRequest} message SubscriptionRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SubscriptionRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a SubscriptionRequest message from the specified reader or buffer.
             * @function decode
             * @memberof market.mass.SubscriptionRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {market.mass.SubscriptionRequest} SubscriptionRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SubscriptionRequest.decode = function decode(reader, length, error) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.SubscriptionRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.startShopSeqNo = reader.uint64();
                            break;
                        }
                    case 2: {
                            message.shopId = $root.market.mass.Uint256.decode(reader, reader.uint32());
                            break;
                        }
                    case 3: {
                            if (!(message.filters && message.filters.length))
                                message.filters = [];
                            message.filters.push($root.market.mass.SubscriptionRequest.Filter.decode(reader, reader.uint32()));
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a SubscriptionRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof market.mass.SubscriptionRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {market.mass.SubscriptionRequest} SubscriptionRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SubscriptionRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a SubscriptionRequest message.
             * @function verify
             * @memberof market.mass.SubscriptionRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SubscriptionRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.startShopSeqNo != null && message.hasOwnProperty("startShopSeqNo"))
                    if (!$util.isInteger(message.startShopSeqNo) && !(message.startShopSeqNo && $util.isInteger(message.startShopSeqNo.low) && $util.isInteger(message.startShopSeqNo.high)))
                        return "startShopSeqNo: integer|Long expected";
                if (message.shopId != null && message.hasOwnProperty("shopId")) {
                    let error = $root.market.mass.Uint256.verify(message.shopId);
                    if (error)
                        return "shopId." + error;
                }
                if (message.filters != null && message.hasOwnProperty("filters")) {
                    if (!Array.isArray(message.filters))
                        return "filters: array expected";
                    for (let i = 0; i < message.filters.length; ++i) {
                        let error = $root.market.mass.SubscriptionRequest.Filter.verify(message.filters[i]);
                        if (error)
                            return "filters." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a SubscriptionRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof market.mass.SubscriptionRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {market.mass.SubscriptionRequest} SubscriptionRequest
             */
            SubscriptionRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.market.mass.SubscriptionRequest)
                    return object;
                let message = new $root.market.mass.SubscriptionRequest();
                if (object.startShopSeqNo != null)
                    if ($util.Long)
                        (message.startShopSeqNo = $util.Long.fromValue(object.startShopSeqNo)).unsigned = true;
                    else if (typeof object.startShopSeqNo === "string")
                        message.startShopSeqNo = parseInt(object.startShopSeqNo, 10);
                    else if (typeof object.startShopSeqNo === "number")
                        message.startShopSeqNo = object.startShopSeqNo;
                    else if (typeof object.startShopSeqNo === "object")
                        message.startShopSeqNo = new $util.LongBits(object.startShopSeqNo.low >>> 0, object.startShopSeqNo.high >>> 0).toNumber(true);
                if (object.shopId != null) {
                    if (typeof object.shopId !== "object")
                        throw TypeError(".market.mass.SubscriptionRequest.shopId: object expected");
                    message.shopId = $root.market.mass.Uint256.fromObject(object.shopId);
                }
                if (object.filters) {
                    if (!Array.isArray(object.filters))
                        throw TypeError(".market.mass.SubscriptionRequest.filters: array expected");
                    message.filters = [];
                    for (let i = 0; i < object.filters.length; ++i) {
                        if (typeof object.filters[i] !== "object")
                            throw TypeError(".market.mass.SubscriptionRequest.filters: object expected");
                        message.filters[i] = $root.market.mass.SubscriptionRequest.Filter.fromObject(object.filters[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from a SubscriptionRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof market.mass.SubscriptionRequest
             * @static
             * @param {market.mass.SubscriptionRequest} message SubscriptionRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SubscriptionRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.arrays || options.defaults)
                    object.filters = [];
                if (options.defaults) {
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.startShopSeqNo = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.startShopSeqNo = options.longs === String ? "0" : 0;
                    object.shopId = null;
                }
                if (message.startShopSeqNo != null && message.hasOwnProperty("startShopSeqNo"))
                    if (typeof message.startShopSeqNo === "number")
                        object.startShopSeqNo = options.longs === String ? String(message.startShopSeqNo) : message.startShopSeqNo;
                    else
                        object.startShopSeqNo = options.longs === String ? $util.Long.prototype.toString.call(message.startShopSeqNo) : options.longs === Number ? new $util.LongBits(message.startShopSeqNo.low >>> 0, message.startShopSeqNo.high >>> 0).toNumber(true) : message.startShopSeqNo;
                if (message.shopId != null && message.hasOwnProperty("shopId"))
                    object.shopId = $root.market.mass.Uint256.toObject(message.shopId, options);
                if (message.filters && message.filters.length) {
                    object.filters = [];
                    for (let j = 0; j < message.filters.length; ++j)
                        object.filters[j] = $root.market.mass.SubscriptionRequest.Filter.toObject(message.filters[j], options);
                }
                return object;
            };

            /**
             * Converts this SubscriptionRequest to JSON.
             * @function toJSON
             * @memberof market.mass.SubscriptionRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SubscriptionRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for SubscriptionRequest
             * @function getTypeUrl
             * @memberof market.mass.SubscriptionRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            SubscriptionRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/market.mass.SubscriptionRequest";
            };

            SubscriptionRequest.Filter = (function() {

                /**
                 * Properties of a Filter.
                 * @memberof market.mass.SubscriptionRequest
                 * @interface IFilter
                 * @property {market.mass.ObjectType|null} [objectType] Filter objectType
                 * @property {market.mass.IObjectId|null} [objectId] Filter objectId
                 */

                /**
                 * Constructs a new Filter.
                 * @memberof market.mass.SubscriptionRequest
                 * @classdesc Represents a Filter.
                 * @implements IFilter
                 * @constructor
                 * @param {market.mass.SubscriptionRequest.IFilter=} [properties] Properties to set
                 */
                function Filter(properties) {
                    if (properties)
                        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Filter objectType.
                 * @member {market.mass.ObjectType} objectType
                 * @memberof market.mass.SubscriptionRequest.Filter
                 * @instance
                 */
                Filter.prototype.objectType = 0;

                /**
                 * Filter objectId.
                 * @member {market.mass.IObjectId|null|undefined} objectId
                 * @memberof market.mass.SubscriptionRequest.Filter
                 * @instance
                 */
                Filter.prototype.objectId = null;

                // OneOf field names bound to virtual getters and setters
                let $oneOfFields;

                /**
                 * Filter _objectId.
                 * @member {"objectId"|undefined} _objectId
                 * @memberof market.mass.SubscriptionRequest.Filter
                 * @instance
                 */
                Object.defineProperty(Filter.prototype, "_objectId", {
                    get: $util.oneOfGetter($oneOfFields = ["objectId"]),
                    set: $util.oneOfSetter($oneOfFields)
                });

                /**
                 * Creates a new Filter instance using the specified properties.
                 * @function create
                 * @memberof market.mass.SubscriptionRequest.Filter
                 * @static
                 * @param {market.mass.SubscriptionRequest.IFilter=} [properties] Properties to set
                 * @returns {market.mass.SubscriptionRequest.Filter} Filter instance
                 */
                Filter.create = function create(properties) {
                    return new Filter(properties);
                };

                /**
                 * Encodes the specified Filter message. Does not implicitly {@link market.mass.SubscriptionRequest.Filter.verify|verify} messages.
                 * @function encode
                 * @memberof market.mass.SubscriptionRequest.Filter
                 * @static
                 * @param {market.mass.SubscriptionRequest.IFilter} message Filter message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Filter.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.objectType != null && Object.hasOwnProperty.call(message, "objectType"))
                        writer.uint32(/* id 3, wireType 0 =*/24).int32(message.objectType);
                    if (message.objectId != null && Object.hasOwnProperty.call(message, "objectId"))
                        $root.market.mass.ObjectId.encode(message.objectId, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified Filter message, length delimited. Does not implicitly {@link market.mass.SubscriptionRequest.Filter.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof market.mass.SubscriptionRequest.Filter
                 * @static
                 * @param {market.mass.SubscriptionRequest.IFilter} message Filter message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Filter.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a Filter message from the specified reader or buffer.
                 * @function decode
                 * @memberof market.mass.SubscriptionRequest.Filter
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {market.mass.SubscriptionRequest.Filter} Filter
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Filter.decode = function decode(reader, length, error) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    let end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.SubscriptionRequest.Filter();
                    while (reader.pos < end) {
                        let tag = reader.uint32();
                        if (tag === error)
                            break;
                        switch (tag >>> 3) {
                        case 3: {
                                message.objectType = reader.int32();
                                break;
                            }
                        case 4: {
                                message.objectId = $root.market.mass.ObjectId.decode(reader, reader.uint32());
                                break;
                            }
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a Filter message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof market.mass.SubscriptionRequest.Filter
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {market.mass.SubscriptionRequest.Filter} Filter
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Filter.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a Filter message.
                 * @function verify
                 * @memberof market.mass.SubscriptionRequest.Filter
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Filter.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    let properties = {};
                    if (message.objectType != null && message.hasOwnProperty("objectType"))
                        switch (message.objectType) {
                        default:
                            return "objectType: enum value expected";
                        case 0:
                        case 1:
                        case 2:
                        case 3:
                        case 4:
                        case 5:
                        case 6:
                            break;
                        }
                    if (message.objectId != null && message.hasOwnProperty("objectId")) {
                        properties._objectId = 1;
                        {
                            let error = $root.market.mass.ObjectId.verify(message.objectId);
                            if (error)
                                return "objectId." + error;
                        }
                    }
                    return null;
                };

                /**
                 * Creates a Filter message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof market.mass.SubscriptionRequest.Filter
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {market.mass.SubscriptionRequest.Filter} Filter
                 */
                Filter.fromObject = function fromObject(object) {
                    if (object instanceof $root.market.mass.SubscriptionRequest.Filter)
                        return object;
                    let message = new $root.market.mass.SubscriptionRequest.Filter();
                    switch (object.objectType) {
                    default:
                        if (typeof object.objectType === "number") {
                            message.objectType = object.objectType;
                            break;
                        }
                        break;
                    case "OBJECT_TYPE_UNSPECIFIED":
                    case 0:
                        message.objectType = 0;
                        break;
                    case "OBJECT_TYPE_LISTING":
                    case 1:
                        message.objectType = 1;
                        break;
                    case "OBJECT_TYPE_TAG":
                    case 2:
                        message.objectType = 2;
                        break;
                    case "OBJECT_TYPE_ORDER":
                    case 3:
                        message.objectType = 3;
                        break;
                    case "OBJECT_TYPE_ACCOUNT":
                    case 4:
                        message.objectType = 4;
                        break;
                    case "OBJECT_TYPE_MANIFEST":
                    case 5:
                        message.objectType = 5;
                        break;
                    case "OBJECT_TYPE_INVENTORY":
                    case 6:
                        message.objectType = 6;
                        break;
                    }
                    if (object.objectId != null) {
                        if (typeof object.objectId !== "object")
                            throw TypeError(".market.mass.SubscriptionRequest.Filter.objectId: object expected");
                        message.objectId = $root.market.mass.ObjectId.fromObject(object.objectId);
                    }
                    return message;
                };

                /**
                 * Creates a plain object from a Filter message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof market.mass.SubscriptionRequest.Filter
                 * @static
                 * @param {market.mass.SubscriptionRequest.Filter} message Filter
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Filter.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    let object = {};
                    if (options.defaults)
                        object.objectType = options.enums === String ? "OBJECT_TYPE_UNSPECIFIED" : 0;
                    if (message.objectType != null && message.hasOwnProperty("objectType"))
                        object.objectType = options.enums === String ? $root.market.mass.ObjectType[message.objectType] === undefined ? message.objectType : $root.market.mass.ObjectType[message.objectType] : message.objectType;
                    if (message.objectId != null && message.hasOwnProperty("objectId")) {
                        object.objectId = $root.market.mass.ObjectId.toObject(message.objectId, options);
                        if (options.oneofs)
                            object._objectId = "objectId";
                    }
                    return object;
                };

                /**
                 * Converts this Filter to JSON.
                 * @function toJSON
                 * @memberof market.mass.SubscriptionRequest.Filter
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Filter.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * Gets the default type url for Filter
                 * @function getTypeUrl
                 * @memberof market.mass.SubscriptionRequest.Filter
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                Filter.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/market.mass.SubscriptionRequest.Filter";
                };

                return Filter;
            })();

            return SubscriptionRequest;
        })();

        mass.SubscriptionPushRequest = (function() {

            /**
             * Properties of a SubscriptionPushRequest.
             * @memberof market.mass
             * @interface ISubscriptionPushRequest
             * @property {Uint8Array|null} [subscriptionId] SubscriptionPushRequest subscriptionId
             * @property {Array.<market.mass.SubscriptionPushRequest.ISequencedPartialPatchSet>|null} [sets] SubscriptionPushRequest sets
             */

            /**
             * Constructs a new SubscriptionPushRequest.
             * @memberof market.mass
             * @classdesc Represents a SubscriptionPushRequest.
             * @implements ISubscriptionPushRequest
             * @constructor
             * @param {market.mass.ISubscriptionPushRequest=} [properties] Properties to set
             */
            function SubscriptionPushRequest(properties) {
                this.sets = [];
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * SubscriptionPushRequest subscriptionId.
             * @member {Uint8Array} subscriptionId
             * @memberof market.mass.SubscriptionPushRequest
             * @instance
             */
            SubscriptionPushRequest.prototype.subscriptionId = $util.newBuffer([]);

            /**
             * SubscriptionPushRequest sets.
             * @member {Array.<market.mass.SubscriptionPushRequest.ISequencedPartialPatchSet>} sets
             * @memberof market.mass.SubscriptionPushRequest
             * @instance
             */
            SubscriptionPushRequest.prototype.sets = $util.emptyArray;

            /**
             * Creates a new SubscriptionPushRequest instance using the specified properties.
             * @function create
             * @memberof market.mass.SubscriptionPushRequest
             * @static
             * @param {market.mass.ISubscriptionPushRequest=} [properties] Properties to set
             * @returns {market.mass.SubscriptionPushRequest} SubscriptionPushRequest instance
             */
            SubscriptionPushRequest.create = function create(properties) {
                return new SubscriptionPushRequest(properties);
            };

            /**
             * Encodes the specified SubscriptionPushRequest message. Does not implicitly {@link market.mass.SubscriptionPushRequest.verify|verify} messages.
             * @function encode
             * @memberof market.mass.SubscriptionPushRequest
             * @static
             * @param {market.mass.ISubscriptionPushRequest} message SubscriptionPushRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SubscriptionPushRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.subscriptionId != null && Object.hasOwnProperty.call(message, "subscriptionId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.subscriptionId);
                if (message.sets != null && message.sets.length)
                    for (let i = 0; i < message.sets.length; ++i)
                        $root.market.mass.SubscriptionPushRequest.SequencedPartialPatchSet.encode(message.sets[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified SubscriptionPushRequest message, length delimited. Does not implicitly {@link market.mass.SubscriptionPushRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof market.mass.SubscriptionPushRequest
             * @static
             * @param {market.mass.ISubscriptionPushRequest} message SubscriptionPushRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SubscriptionPushRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a SubscriptionPushRequest message from the specified reader or buffer.
             * @function decode
             * @memberof market.mass.SubscriptionPushRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {market.mass.SubscriptionPushRequest} SubscriptionPushRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SubscriptionPushRequest.decode = function decode(reader, length, error) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.SubscriptionPushRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.subscriptionId = reader.bytes();
                            break;
                        }
                    case 2: {
                            if (!(message.sets && message.sets.length))
                                message.sets = [];
                            message.sets.push($root.market.mass.SubscriptionPushRequest.SequencedPartialPatchSet.decode(reader, reader.uint32()));
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a SubscriptionPushRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof market.mass.SubscriptionPushRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {market.mass.SubscriptionPushRequest} SubscriptionPushRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SubscriptionPushRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a SubscriptionPushRequest message.
             * @function verify
             * @memberof market.mass.SubscriptionPushRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SubscriptionPushRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.subscriptionId != null && message.hasOwnProperty("subscriptionId"))
                    if (!(message.subscriptionId && typeof message.subscriptionId.length === "number" || $util.isString(message.subscriptionId)))
                        return "subscriptionId: buffer expected";
                if (message.sets != null && message.hasOwnProperty("sets")) {
                    if (!Array.isArray(message.sets))
                        return "sets: array expected";
                    for (let i = 0; i < message.sets.length; ++i) {
                        let error = $root.market.mass.SubscriptionPushRequest.SequencedPartialPatchSet.verify(message.sets[i]);
                        if (error)
                            return "sets." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a SubscriptionPushRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof market.mass.SubscriptionPushRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {market.mass.SubscriptionPushRequest} SubscriptionPushRequest
             */
            SubscriptionPushRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.market.mass.SubscriptionPushRequest)
                    return object;
                let message = new $root.market.mass.SubscriptionPushRequest();
                if (object.subscriptionId != null)
                    if (typeof object.subscriptionId === "string")
                        $util.base64.decode(object.subscriptionId, message.subscriptionId = $util.newBuffer($util.base64.length(object.subscriptionId)), 0);
                    else if (object.subscriptionId.length >= 0)
                        message.subscriptionId = object.subscriptionId;
                if (object.sets) {
                    if (!Array.isArray(object.sets))
                        throw TypeError(".market.mass.SubscriptionPushRequest.sets: array expected");
                    message.sets = [];
                    for (let i = 0; i < object.sets.length; ++i) {
                        if (typeof object.sets[i] !== "object")
                            throw TypeError(".market.mass.SubscriptionPushRequest.sets: object expected");
                        message.sets[i] = $root.market.mass.SubscriptionPushRequest.SequencedPartialPatchSet.fromObject(object.sets[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from a SubscriptionPushRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof market.mass.SubscriptionPushRequest
             * @static
             * @param {market.mass.SubscriptionPushRequest} message SubscriptionPushRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SubscriptionPushRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.arrays || options.defaults)
                    object.sets = [];
                if (options.defaults)
                    if (options.bytes === String)
                        object.subscriptionId = "";
                    else {
                        object.subscriptionId = [];
                        if (options.bytes !== Array)
                            object.subscriptionId = $util.newBuffer(object.subscriptionId);
                    }
                if (message.subscriptionId != null && message.hasOwnProperty("subscriptionId"))
                    object.subscriptionId = options.bytes === String ? $util.base64.encode(message.subscriptionId, 0, message.subscriptionId.length) : options.bytes === Array ? Array.prototype.slice.call(message.subscriptionId) : message.subscriptionId;
                if (message.sets && message.sets.length) {
                    object.sets = [];
                    for (let j = 0; j < message.sets.length; ++j)
                        object.sets[j] = $root.market.mass.SubscriptionPushRequest.SequencedPartialPatchSet.toObject(message.sets[j], options);
                }
                return object;
            };

            /**
             * Converts this SubscriptionPushRequest to JSON.
             * @function toJSON
             * @memberof market.mass.SubscriptionPushRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SubscriptionPushRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for SubscriptionPushRequest
             * @function getTypeUrl
             * @memberof market.mass.SubscriptionPushRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            SubscriptionPushRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/market.mass.SubscriptionPushRequest";
            };

            SubscriptionPushRequest.SequencedPartialPatchSet = (function() {

                /**
                 * Properties of a SequencedPartialPatchSet.
                 * @memberof market.mass.SubscriptionPushRequest
                 * @interface ISequencedPartialPatchSet
                 * @property {number|Long|null} [shopSeqNo] SequencedPartialPatchSet shopSeqNo
                 * @property {number|null} [patchLeafIndex] SequencedPartialPatchSet patchLeafIndex
                 * @property {Uint8Array|null} [header] SequencedPartialPatchSet header
                 * @property {Uint8Array|null} [signature] SequencedPartialPatchSet signature
                 * @property {Array.<Uint8Array>|null} [patches] SequencedPartialPatchSet patches
                 * @property {Array.<Uint8Array>|null} [proofs] SequencedPartialPatchSet proofs
                 */

                /**
                 * Constructs a new SequencedPartialPatchSet.
                 * @memberof market.mass.SubscriptionPushRequest
                 * @classdesc Represents a SequencedPartialPatchSet.
                 * @implements ISequencedPartialPatchSet
                 * @constructor
                 * @param {market.mass.SubscriptionPushRequest.ISequencedPartialPatchSet=} [properties] Properties to set
                 */
                function SequencedPartialPatchSet(properties) {
                    this.patches = [];
                    this.proofs = [];
                    if (properties)
                        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * SequencedPartialPatchSet shopSeqNo.
                 * @member {number|Long} shopSeqNo
                 * @memberof market.mass.SubscriptionPushRequest.SequencedPartialPatchSet
                 * @instance
                 */
                SequencedPartialPatchSet.prototype.shopSeqNo = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

                /**
                 * SequencedPartialPatchSet patchLeafIndex.
                 * @member {number} patchLeafIndex
                 * @memberof market.mass.SubscriptionPushRequest.SequencedPartialPatchSet
                 * @instance
                 */
                SequencedPartialPatchSet.prototype.patchLeafIndex = 0;

                /**
                 * SequencedPartialPatchSet header.
                 * @member {Uint8Array} header
                 * @memberof market.mass.SubscriptionPushRequest.SequencedPartialPatchSet
                 * @instance
                 */
                SequencedPartialPatchSet.prototype.header = $util.newBuffer([]);

                /**
                 * SequencedPartialPatchSet signature.
                 * @member {Uint8Array} signature
                 * @memberof market.mass.SubscriptionPushRequest.SequencedPartialPatchSet
                 * @instance
                 */
                SequencedPartialPatchSet.prototype.signature = $util.newBuffer([]);

                /**
                 * SequencedPartialPatchSet patches.
                 * @member {Array.<Uint8Array>} patches
                 * @memberof market.mass.SubscriptionPushRequest.SequencedPartialPatchSet
                 * @instance
                 */
                SequencedPartialPatchSet.prototype.patches = $util.emptyArray;

                /**
                 * SequencedPartialPatchSet proofs.
                 * @member {Array.<Uint8Array>} proofs
                 * @memberof market.mass.SubscriptionPushRequest.SequencedPartialPatchSet
                 * @instance
                 */
                SequencedPartialPatchSet.prototype.proofs = $util.emptyArray;

                /**
                 * Creates a new SequencedPartialPatchSet instance using the specified properties.
                 * @function create
                 * @memberof market.mass.SubscriptionPushRequest.SequencedPartialPatchSet
                 * @static
                 * @param {market.mass.SubscriptionPushRequest.ISequencedPartialPatchSet=} [properties] Properties to set
                 * @returns {market.mass.SubscriptionPushRequest.SequencedPartialPatchSet} SequencedPartialPatchSet instance
                 */
                SequencedPartialPatchSet.create = function create(properties) {
                    return new SequencedPartialPatchSet(properties);
                };

                /**
                 * Encodes the specified SequencedPartialPatchSet message. Does not implicitly {@link market.mass.SubscriptionPushRequest.SequencedPartialPatchSet.verify|verify} messages.
                 * @function encode
                 * @memberof market.mass.SubscriptionPushRequest.SequencedPartialPatchSet
                 * @static
                 * @param {market.mass.SubscriptionPushRequest.ISequencedPartialPatchSet} message SequencedPartialPatchSet message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                SequencedPartialPatchSet.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.shopSeqNo != null && Object.hasOwnProperty.call(message, "shopSeqNo"))
                        writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.shopSeqNo);
                    if (message.patchLeafIndex != null && Object.hasOwnProperty.call(message, "patchLeafIndex"))
                        writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.patchLeafIndex);
                    if (message.header != null && Object.hasOwnProperty.call(message, "header"))
                        writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.header);
                    if (message.signature != null && Object.hasOwnProperty.call(message, "signature"))
                        writer.uint32(/* id 4, wireType 2 =*/34).bytes(message.signature);
                    if (message.patches != null && message.patches.length)
                        for (let i = 0; i < message.patches.length; ++i)
                            writer.uint32(/* id 5, wireType 2 =*/42).bytes(message.patches[i]);
                    if (message.proofs != null && message.proofs.length)
                        for (let i = 0; i < message.proofs.length; ++i)
                            writer.uint32(/* id 6, wireType 2 =*/50).bytes(message.proofs[i]);
                    return writer;
                };

                /**
                 * Encodes the specified SequencedPartialPatchSet message, length delimited. Does not implicitly {@link market.mass.SubscriptionPushRequest.SequencedPartialPatchSet.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof market.mass.SubscriptionPushRequest.SequencedPartialPatchSet
                 * @static
                 * @param {market.mass.SubscriptionPushRequest.ISequencedPartialPatchSet} message SequencedPartialPatchSet message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                SequencedPartialPatchSet.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a SequencedPartialPatchSet message from the specified reader or buffer.
                 * @function decode
                 * @memberof market.mass.SubscriptionPushRequest.SequencedPartialPatchSet
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {market.mass.SubscriptionPushRequest.SequencedPartialPatchSet} SequencedPartialPatchSet
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                SequencedPartialPatchSet.decode = function decode(reader, length, error) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    let end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.SubscriptionPushRequest.SequencedPartialPatchSet();
                    while (reader.pos < end) {
                        let tag = reader.uint32();
                        if (tag === error)
                            break;
                        switch (tag >>> 3) {
                        case 1: {
                                message.shopSeqNo = reader.uint64();
                                break;
                            }
                        case 2: {
                                message.patchLeafIndex = reader.uint32();
                                break;
                            }
                        case 3: {
                                message.header = reader.bytes();
                                break;
                            }
                        case 4: {
                                message.signature = reader.bytes();
                                break;
                            }
                        case 5: {
                                if (!(message.patches && message.patches.length))
                                    message.patches = [];
                                message.patches.push(reader.bytes());
                                break;
                            }
                        case 6: {
                                if (!(message.proofs && message.proofs.length))
                                    message.proofs = [];
                                message.proofs.push(reader.bytes());
                                break;
                            }
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a SequencedPartialPatchSet message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof market.mass.SubscriptionPushRequest.SequencedPartialPatchSet
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {market.mass.SubscriptionPushRequest.SequencedPartialPatchSet} SequencedPartialPatchSet
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                SequencedPartialPatchSet.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a SequencedPartialPatchSet message.
                 * @function verify
                 * @memberof market.mass.SubscriptionPushRequest.SequencedPartialPatchSet
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                SequencedPartialPatchSet.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.shopSeqNo != null && message.hasOwnProperty("shopSeqNo"))
                        if (!$util.isInteger(message.shopSeqNo) && !(message.shopSeqNo && $util.isInteger(message.shopSeqNo.low) && $util.isInteger(message.shopSeqNo.high)))
                            return "shopSeqNo: integer|Long expected";
                    if (message.patchLeafIndex != null && message.hasOwnProperty("patchLeafIndex"))
                        if (!$util.isInteger(message.patchLeafIndex))
                            return "patchLeafIndex: integer expected";
                    if (message.header != null && message.hasOwnProperty("header"))
                        if (!(message.header && typeof message.header.length === "number" || $util.isString(message.header)))
                            return "header: buffer expected";
                    if (message.signature != null && message.hasOwnProperty("signature"))
                        if (!(message.signature && typeof message.signature.length === "number" || $util.isString(message.signature)))
                            return "signature: buffer expected";
                    if (message.patches != null && message.hasOwnProperty("patches")) {
                        if (!Array.isArray(message.patches))
                            return "patches: array expected";
                        for (let i = 0; i < message.patches.length; ++i)
                            if (!(message.patches[i] && typeof message.patches[i].length === "number" || $util.isString(message.patches[i])))
                                return "patches: buffer[] expected";
                    }
                    if (message.proofs != null && message.hasOwnProperty("proofs")) {
                        if (!Array.isArray(message.proofs))
                            return "proofs: array expected";
                        for (let i = 0; i < message.proofs.length; ++i)
                            if (!(message.proofs[i] && typeof message.proofs[i].length === "number" || $util.isString(message.proofs[i])))
                                return "proofs: buffer[] expected";
                    }
                    return null;
                };

                /**
                 * Creates a SequencedPartialPatchSet message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof market.mass.SubscriptionPushRequest.SequencedPartialPatchSet
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {market.mass.SubscriptionPushRequest.SequencedPartialPatchSet} SequencedPartialPatchSet
                 */
                SequencedPartialPatchSet.fromObject = function fromObject(object) {
                    if (object instanceof $root.market.mass.SubscriptionPushRequest.SequencedPartialPatchSet)
                        return object;
                    let message = new $root.market.mass.SubscriptionPushRequest.SequencedPartialPatchSet();
                    if (object.shopSeqNo != null)
                        if ($util.Long)
                            (message.shopSeqNo = $util.Long.fromValue(object.shopSeqNo)).unsigned = true;
                        else if (typeof object.shopSeqNo === "string")
                            message.shopSeqNo = parseInt(object.shopSeqNo, 10);
                        else if (typeof object.shopSeqNo === "number")
                            message.shopSeqNo = object.shopSeqNo;
                        else if (typeof object.shopSeqNo === "object")
                            message.shopSeqNo = new $util.LongBits(object.shopSeqNo.low >>> 0, object.shopSeqNo.high >>> 0).toNumber(true);
                    if (object.patchLeafIndex != null)
                        message.patchLeafIndex = object.patchLeafIndex >>> 0;
                    if (object.header != null)
                        if (typeof object.header === "string")
                            $util.base64.decode(object.header, message.header = $util.newBuffer($util.base64.length(object.header)), 0);
                        else if (object.header.length >= 0)
                            message.header = object.header;
                    if (object.signature != null)
                        if (typeof object.signature === "string")
                            $util.base64.decode(object.signature, message.signature = $util.newBuffer($util.base64.length(object.signature)), 0);
                        else if (object.signature.length >= 0)
                            message.signature = object.signature;
                    if (object.patches) {
                        if (!Array.isArray(object.patches))
                            throw TypeError(".market.mass.SubscriptionPushRequest.SequencedPartialPatchSet.patches: array expected");
                        message.patches = [];
                        for (let i = 0; i < object.patches.length; ++i)
                            if (typeof object.patches[i] === "string")
                                $util.base64.decode(object.patches[i], message.patches[i] = $util.newBuffer($util.base64.length(object.patches[i])), 0);
                            else if (object.patches[i].length >= 0)
                                message.patches[i] = object.patches[i];
                    }
                    if (object.proofs) {
                        if (!Array.isArray(object.proofs))
                            throw TypeError(".market.mass.SubscriptionPushRequest.SequencedPartialPatchSet.proofs: array expected");
                        message.proofs = [];
                        for (let i = 0; i < object.proofs.length; ++i)
                            if (typeof object.proofs[i] === "string")
                                $util.base64.decode(object.proofs[i], message.proofs[i] = $util.newBuffer($util.base64.length(object.proofs[i])), 0);
                            else if (object.proofs[i].length >= 0)
                                message.proofs[i] = object.proofs[i];
                    }
                    return message;
                };

                /**
                 * Creates a plain object from a SequencedPartialPatchSet message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof market.mass.SubscriptionPushRequest.SequencedPartialPatchSet
                 * @static
                 * @param {market.mass.SubscriptionPushRequest.SequencedPartialPatchSet} message SequencedPartialPatchSet
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                SequencedPartialPatchSet.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    let object = {};
                    if (options.arrays || options.defaults) {
                        object.patches = [];
                        object.proofs = [];
                    }
                    if (options.defaults) {
                        if ($util.Long) {
                            let long = new $util.Long(0, 0, true);
                            object.shopSeqNo = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                        } else
                            object.shopSeqNo = options.longs === String ? "0" : 0;
                        object.patchLeafIndex = 0;
                        if (options.bytes === String)
                            object.header = "";
                        else {
                            object.header = [];
                            if (options.bytes !== Array)
                                object.header = $util.newBuffer(object.header);
                        }
                        if (options.bytes === String)
                            object.signature = "";
                        else {
                            object.signature = [];
                            if (options.bytes !== Array)
                                object.signature = $util.newBuffer(object.signature);
                        }
                    }
                    if (message.shopSeqNo != null && message.hasOwnProperty("shopSeqNo"))
                        if (typeof message.shopSeqNo === "number")
                            object.shopSeqNo = options.longs === String ? String(message.shopSeqNo) : message.shopSeqNo;
                        else
                            object.shopSeqNo = options.longs === String ? $util.Long.prototype.toString.call(message.shopSeqNo) : options.longs === Number ? new $util.LongBits(message.shopSeqNo.low >>> 0, message.shopSeqNo.high >>> 0).toNumber(true) : message.shopSeqNo;
                    if (message.patchLeafIndex != null && message.hasOwnProperty("patchLeafIndex"))
                        object.patchLeafIndex = message.patchLeafIndex;
                    if (message.header != null && message.hasOwnProperty("header"))
                        object.header = options.bytes === String ? $util.base64.encode(message.header, 0, message.header.length) : options.bytes === Array ? Array.prototype.slice.call(message.header) : message.header;
                    if (message.signature != null && message.hasOwnProperty("signature"))
                        object.signature = options.bytes === String ? $util.base64.encode(message.signature, 0, message.signature.length) : options.bytes === Array ? Array.prototype.slice.call(message.signature) : message.signature;
                    if (message.patches && message.patches.length) {
                        object.patches = [];
                        for (let j = 0; j < message.patches.length; ++j)
                            object.patches[j] = options.bytes === String ? $util.base64.encode(message.patches[j], 0, message.patches[j].length) : options.bytes === Array ? Array.prototype.slice.call(message.patches[j]) : message.patches[j];
                    }
                    if (message.proofs && message.proofs.length) {
                        object.proofs = [];
                        for (let j = 0; j < message.proofs.length; ++j)
                            object.proofs[j] = options.bytes === String ? $util.base64.encode(message.proofs[j], 0, message.proofs[j].length) : options.bytes === Array ? Array.prototype.slice.call(message.proofs[j]) : message.proofs[j];
                    }
                    return object;
                };

                /**
                 * Converts this SequencedPartialPatchSet to JSON.
                 * @function toJSON
                 * @memberof market.mass.SubscriptionPushRequest.SequencedPartialPatchSet
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                SequencedPartialPatchSet.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * Gets the default type url for SequencedPartialPatchSet
                 * @function getTypeUrl
                 * @memberof market.mass.SubscriptionPushRequest.SequencedPartialPatchSet
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                SequencedPartialPatchSet.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/market.mass.SubscriptionPushRequest.SequencedPartialPatchSet";
                };

                return SequencedPartialPatchSet;
            })();

            return SubscriptionPushRequest;
        })();

        mass.SubscriptionCancelRequest = (function() {

            /**
             * Properties of a SubscriptionCancelRequest.
             * @memberof market.mass
             * @interface ISubscriptionCancelRequest
             * @property {Uint8Array|null} [subscriptionId] SubscriptionCancelRequest subscriptionId
             */

            /**
             * Constructs a new SubscriptionCancelRequest.
             * @memberof market.mass
             * @classdesc Represents a SubscriptionCancelRequest.
             * @implements ISubscriptionCancelRequest
             * @constructor
             * @param {market.mass.ISubscriptionCancelRequest=} [properties] Properties to set
             */
            function SubscriptionCancelRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * SubscriptionCancelRequest subscriptionId.
             * @member {Uint8Array} subscriptionId
             * @memberof market.mass.SubscriptionCancelRequest
             * @instance
             */
            SubscriptionCancelRequest.prototype.subscriptionId = $util.newBuffer([]);

            /**
             * Creates a new SubscriptionCancelRequest instance using the specified properties.
             * @function create
             * @memberof market.mass.SubscriptionCancelRequest
             * @static
             * @param {market.mass.ISubscriptionCancelRequest=} [properties] Properties to set
             * @returns {market.mass.SubscriptionCancelRequest} SubscriptionCancelRequest instance
             */
            SubscriptionCancelRequest.create = function create(properties) {
                return new SubscriptionCancelRequest(properties);
            };

            /**
             * Encodes the specified SubscriptionCancelRequest message. Does not implicitly {@link market.mass.SubscriptionCancelRequest.verify|verify} messages.
             * @function encode
             * @memberof market.mass.SubscriptionCancelRequest
             * @static
             * @param {market.mass.ISubscriptionCancelRequest} message SubscriptionCancelRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SubscriptionCancelRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.subscriptionId != null && Object.hasOwnProperty.call(message, "subscriptionId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.subscriptionId);
                return writer;
            };

            /**
             * Encodes the specified SubscriptionCancelRequest message, length delimited. Does not implicitly {@link market.mass.SubscriptionCancelRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof market.mass.SubscriptionCancelRequest
             * @static
             * @param {market.mass.ISubscriptionCancelRequest} message SubscriptionCancelRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SubscriptionCancelRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a SubscriptionCancelRequest message from the specified reader or buffer.
             * @function decode
             * @memberof market.mass.SubscriptionCancelRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {market.mass.SubscriptionCancelRequest} SubscriptionCancelRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SubscriptionCancelRequest.decode = function decode(reader, length, error) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.SubscriptionCancelRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.subscriptionId = reader.bytes();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a SubscriptionCancelRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof market.mass.SubscriptionCancelRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {market.mass.SubscriptionCancelRequest} SubscriptionCancelRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SubscriptionCancelRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a SubscriptionCancelRequest message.
             * @function verify
             * @memberof market.mass.SubscriptionCancelRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SubscriptionCancelRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.subscriptionId != null && message.hasOwnProperty("subscriptionId"))
                    if (!(message.subscriptionId && typeof message.subscriptionId.length === "number" || $util.isString(message.subscriptionId)))
                        return "subscriptionId: buffer expected";
                return null;
            };

            /**
             * Creates a SubscriptionCancelRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof market.mass.SubscriptionCancelRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {market.mass.SubscriptionCancelRequest} SubscriptionCancelRequest
             */
            SubscriptionCancelRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.market.mass.SubscriptionCancelRequest)
                    return object;
                let message = new $root.market.mass.SubscriptionCancelRequest();
                if (object.subscriptionId != null)
                    if (typeof object.subscriptionId === "string")
                        $util.base64.decode(object.subscriptionId, message.subscriptionId = $util.newBuffer($util.base64.length(object.subscriptionId)), 0);
                    else if (object.subscriptionId.length >= 0)
                        message.subscriptionId = object.subscriptionId;
                return message;
            };

            /**
             * Creates a plain object from a SubscriptionCancelRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof market.mass.SubscriptionCancelRequest
             * @static
             * @param {market.mass.SubscriptionCancelRequest} message SubscriptionCancelRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SubscriptionCancelRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    if (options.bytes === String)
                        object.subscriptionId = "";
                    else {
                        object.subscriptionId = [];
                        if (options.bytes !== Array)
                            object.subscriptionId = $util.newBuffer(object.subscriptionId);
                    }
                if (message.subscriptionId != null && message.hasOwnProperty("subscriptionId"))
                    object.subscriptionId = options.bytes === String ? $util.base64.encode(message.subscriptionId, 0, message.subscriptionId.length) : options.bytes === Array ? Array.prototype.slice.call(message.subscriptionId) : message.subscriptionId;
                return object;
            };

            /**
             * Converts this SubscriptionCancelRequest to JSON.
             * @function toJSON
             * @memberof market.mass.SubscriptionCancelRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SubscriptionCancelRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for SubscriptionCancelRequest
             * @function getTypeUrl
             * @memberof market.mass.SubscriptionCancelRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            SubscriptionCancelRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/market.mass.SubscriptionCancelRequest";
            };

            return SubscriptionCancelRequest;
        })();

        mass.PatchSetWriteRequest = (function() {

            /**
             * Properties of a PatchSetWriteRequest.
             * @memberof market.mass
             * @interface IPatchSetWriteRequest
             * @property {Uint8Array|null} [patchSet] PatchSetWriteRequest patchSet
             */

            /**
             * Constructs a new PatchSetWriteRequest.
             * @memberof market.mass
             * @classdesc Represents a PatchSetWriteRequest.
             * @implements IPatchSetWriteRequest
             * @constructor
             * @param {market.mass.IPatchSetWriteRequest=} [properties] Properties to set
             */
            function PatchSetWriteRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * PatchSetWriteRequest patchSet.
             * @member {Uint8Array} patchSet
             * @memberof market.mass.PatchSetWriteRequest
             * @instance
             */
            PatchSetWriteRequest.prototype.patchSet = $util.newBuffer([]);

            /**
             * Creates a new PatchSetWriteRequest instance using the specified properties.
             * @function create
             * @memberof market.mass.PatchSetWriteRequest
             * @static
             * @param {market.mass.IPatchSetWriteRequest=} [properties] Properties to set
             * @returns {market.mass.PatchSetWriteRequest} PatchSetWriteRequest instance
             */
            PatchSetWriteRequest.create = function create(properties) {
                return new PatchSetWriteRequest(properties);
            };

            /**
             * Encodes the specified PatchSetWriteRequest message. Does not implicitly {@link market.mass.PatchSetWriteRequest.verify|verify} messages.
             * @function encode
             * @memberof market.mass.PatchSetWriteRequest
             * @static
             * @param {market.mass.IPatchSetWriteRequest} message PatchSetWriteRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PatchSetWriteRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.patchSet != null && Object.hasOwnProperty.call(message, "patchSet"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.patchSet);
                return writer;
            };

            /**
             * Encodes the specified PatchSetWriteRequest message, length delimited. Does not implicitly {@link market.mass.PatchSetWriteRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof market.mass.PatchSetWriteRequest
             * @static
             * @param {market.mass.IPatchSetWriteRequest} message PatchSetWriteRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PatchSetWriteRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a PatchSetWriteRequest message from the specified reader or buffer.
             * @function decode
             * @memberof market.mass.PatchSetWriteRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {market.mass.PatchSetWriteRequest} PatchSetWriteRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PatchSetWriteRequest.decode = function decode(reader, length, error) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.PatchSetWriteRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.patchSet = reader.bytes();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a PatchSetWriteRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof market.mass.PatchSetWriteRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {market.mass.PatchSetWriteRequest} PatchSetWriteRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PatchSetWriteRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a PatchSetWriteRequest message.
             * @function verify
             * @memberof market.mass.PatchSetWriteRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            PatchSetWriteRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.patchSet != null && message.hasOwnProperty("patchSet"))
                    if (!(message.patchSet && typeof message.patchSet.length === "number" || $util.isString(message.patchSet)))
                        return "patchSet: buffer expected";
                return null;
            };

            /**
             * Creates a PatchSetWriteRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof market.mass.PatchSetWriteRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {market.mass.PatchSetWriteRequest} PatchSetWriteRequest
             */
            PatchSetWriteRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.market.mass.PatchSetWriteRequest)
                    return object;
                let message = new $root.market.mass.PatchSetWriteRequest();
                if (object.patchSet != null)
                    if (typeof object.patchSet === "string")
                        $util.base64.decode(object.patchSet, message.patchSet = $util.newBuffer($util.base64.length(object.patchSet)), 0);
                    else if (object.patchSet.length >= 0)
                        message.patchSet = object.patchSet;
                return message;
            };

            /**
             * Creates a plain object from a PatchSetWriteRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof market.mass.PatchSetWriteRequest
             * @static
             * @param {market.mass.PatchSetWriteRequest} message PatchSetWriteRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            PatchSetWriteRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    if (options.bytes === String)
                        object.patchSet = "";
                    else {
                        object.patchSet = [];
                        if (options.bytes !== Array)
                            object.patchSet = $util.newBuffer(object.patchSet);
                    }
                if (message.patchSet != null && message.hasOwnProperty("patchSet"))
                    object.patchSet = options.bytes === String ? $util.base64.encode(message.patchSet, 0, message.patchSet.length) : options.bytes === Array ? Array.prototype.slice.call(message.patchSet) : message.patchSet;
                return object;
            };

            /**
             * Converts this PatchSetWriteRequest to JSON.
             * @function toJSON
             * @memberof market.mass.PatchSetWriteRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            PatchSetWriteRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for PatchSetWriteRequest
             * @function getTypeUrl
             * @memberof market.mass.PatchSetWriteRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            PatchSetWriteRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/market.mass.PatchSetWriteRequest";
            };

            return PatchSetWriteRequest;
        })();

        mass.SyncStatusRequest = (function() {

            /**
             * Properties of a SyncStatusRequest.
             * @memberof market.mass
             * @interface ISyncStatusRequest
             * @property {number|Long|null} [subscriptionId] SyncStatusRequest subscriptionId
             * @property {number|Long|null} [unpushedPatches] SyncStatusRequest unpushedPatches
             */

            /**
             * Constructs a new SyncStatusRequest.
             * @memberof market.mass
             * @classdesc Represents a SyncStatusRequest.
             * @implements ISyncStatusRequest
             * @constructor
             * @param {market.mass.ISyncStatusRequest=} [properties] Properties to set
             */
            function SyncStatusRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * SyncStatusRequest subscriptionId.
             * @member {number|Long} subscriptionId
             * @memberof market.mass.SyncStatusRequest
             * @instance
             */
            SyncStatusRequest.prototype.subscriptionId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * SyncStatusRequest unpushedPatches.
             * @member {number|Long} unpushedPatches
             * @memberof market.mass.SyncStatusRequest
             * @instance
             */
            SyncStatusRequest.prototype.unpushedPatches = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * Creates a new SyncStatusRequest instance using the specified properties.
             * @function create
             * @memberof market.mass.SyncStatusRequest
             * @static
             * @param {market.mass.ISyncStatusRequest=} [properties] Properties to set
             * @returns {market.mass.SyncStatusRequest} SyncStatusRequest instance
             */
            SyncStatusRequest.create = function create(properties) {
                return new SyncStatusRequest(properties);
            };

            /**
             * Encodes the specified SyncStatusRequest message. Does not implicitly {@link market.mass.SyncStatusRequest.verify|verify} messages.
             * @function encode
             * @memberof market.mass.SyncStatusRequest
             * @static
             * @param {market.mass.ISyncStatusRequest} message SyncStatusRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SyncStatusRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.subscriptionId != null && Object.hasOwnProperty.call(message, "subscriptionId"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.subscriptionId);
                if (message.unpushedPatches != null && Object.hasOwnProperty.call(message, "unpushedPatches"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.unpushedPatches);
                return writer;
            };

            /**
             * Encodes the specified SyncStatusRequest message, length delimited. Does not implicitly {@link market.mass.SyncStatusRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof market.mass.SyncStatusRequest
             * @static
             * @param {market.mass.ISyncStatusRequest} message SyncStatusRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SyncStatusRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a SyncStatusRequest message from the specified reader or buffer.
             * @function decode
             * @memberof market.mass.SyncStatusRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {market.mass.SyncStatusRequest} SyncStatusRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SyncStatusRequest.decode = function decode(reader, length, error) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.SyncStatusRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.subscriptionId = reader.uint64();
                            break;
                        }
                    case 2: {
                            message.unpushedPatches = reader.uint64();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a SyncStatusRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof market.mass.SyncStatusRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {market.mass.SyncStatusRequest} SyncStatusRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SyncStatusRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a SyncStatusRequest message.
             * @function verify
             * @memberof market.mass.SyncStatusRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SyncStatusRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.subscriptionId != null && message.hasOwnProperty("subscriptionId"))
                    if (!$util.isInteger(message.subscriptionId) && !(message.subscriptionId && $util.isInteger(message.subscriptionId.low) && $util.isInteger(message.subscriptionId.high)))
                        return "subscriptionId: integer|Long expected";
                if (message.unpushedPatches != null && message.hasOwnProperty("unpushedPatches"))
                    if (!$util.isInteger(message.unpushedPatches) && !(message.unpushedPatches && $util.isInteger(message.unpushedPatches.low) && $util.isInteger(message.unpushedPatches.high)))
                        return "unpushedPatches: integer|Long expected";
                return null;
            };

            /**
             * Creates a SyncStatusRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof market.mass.SyncStatusRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {market.mass.SyncStatusRequest} SyncStatusRequest
             */
            SyncStatusRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.market.mass.SyncStatusRequest)
                    return object;
                let message = new $root.market.mass.SyncStatusRequest();
                if (object.subscriptionId != null)
                    if ($util.Long)
                        (message.subscriptionId = $util.Long.fromValue(object.subscriptionId)).unsigned = true;
                    else if (typeof object.subscriptionId === "string")
                        message.subscriptionId = parseInt(object.subscriptionId, 10);
                    else if (typeof object.subscriptionId === "number")
                        message.subscriptionId = object.subscriptionId;
                    else if (typeof object.subscriptionId === "object")
                        message.subscriptionId = new $util.LongBits(object.subscriptionId.low >>> 0, object.subscriptionId.high >>> 0).toNumber(true);
                if (object.unpushedPatches != null)
                    if ($util.Long)
                        (message.unpushedPatches = $util.Long.fromValue(object.unpushedPatches)).unsigned = true;
                    else if (typeof object.unpushedPatches === "string")
                        message.unpushedPatches = parseInt(object.unpushedPatches, 10);
                    else if (typeof object.unpushedPatches === "number")
                        message.unpushedPatches = object.unpushedPatches;
                    else if (typeof object.unpushedPatches === "object")
                        message.unpushedPatches = new $util.LongBits(object.unpushedPatches.low >>> 0, object.unpushedPatches.high >>> 0).toNumber(true);
                return message;
            };

            /**
             * Creates a plain object from a SyncStatusRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof market.mass.SyncStatusRequest
             * @static
             * @param {market.mass.SyncStatusRequest} message SyncStatusRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SyncStatusRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.subscriptionId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.subscriptionId = options.longs === String ? "0" : 0;
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.unpushedPatches = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.unpushedPatches = options.longs === String ? "0" : 0;
                }
                if (message.subscriptionId != null && message.hasOwnProperty("subscriptionId"))
                    if (typeof message.subscriptionId === "number")
                        object.subscriptionId = options.longs === String ? String(message.subscriptionId) : message.subscriptionId;
                    else
                        object.subscriptionId = options.longs === String ? $util.Long.prototype.toString.call(message.subscriptionId) : options.longs === Number ? new $util.LongBits(message.subscriptionId.low >>> 0, message.subscriptionId.high >>> 0).toNumber(true) : message.subscriptionId;
                if (message.unpushedPatches != null && message.hasOwnProperty("unpushedPatches"))
                    if (typeof message.unpushedPatches === "number")
                        object.unpushedPatches = options.longs === String ? String(message.unpushedPatches) : message.unpushedPatches;
                    else
                        object.unpushedPatches = options.longs === String ? $util.Long.prototype.toString.call(message.unpushedPatches) : options.longs === Number ? new $util.LongBits(message.unpushedPatches.low >>> 0, message.unpushedPatches.high >>> 0).toNumber(true) : message.unpushedPatches;
                return object;
            };

            /**
             * Converts this SyncStatusRequest to JSON.
             * @function toJSON
             * @memberof market.mass.SyncStatusRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SyncStatusRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for SyncStatusRequest
             * @function getTypeUrl
             * @memberof market.mass.SyncStatusRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            SyncStatusRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/market.mass.SyncStatusRequest";
            };

            return SyncStatusRequest;
        })();

        mass.PingRequest = (function() {

            /**
             * Properties of a PingRequest.
             * @memberof market.mass
             * @interface IPingRequest
             */

            /**
             * Constructs a new PingRequest.
             * @memberof market.mass
             * @classdesc Represents a PingRequest.
             * @implements IPingRequest
             * @constructor
             * @param {market.mass.IPingRequest=} [properties] Properties to set
             */
            function PingRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Creates a new PingRequest instance using the specified properties.
             * @function create
             * @memberof market.mass.PingRequest
             * @static
             * @param {market.mass.IPingRequest=} [properties] Properties to set
             * @returns {market.mass.PingRequest} PingRequest instance
             */
            PingRequest.create = function create(properties) {
                return new PingRequest(properties);
            };

            /**
             * Encodes the specified PingRequest message. Does not implicitly {@link market.mass.PingRequest.verify|verify} messages.
             * @function encode
             * @memberof market.mass.PingRequest
             * @static
             * @param {market.mass.IPingRequest} message PingRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PingRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                return writer;
            };

            /**
             * Encodes the specified PingRequest message, length delimited. Does not implicitly {@link market.mass.PingRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof market.mass.PingRequest
             * @static
             * @param {market.mass.IPingRequest} message PingRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PingRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a PingRequest message from the specified reader or buffer.
             * @function decode
             * @memberof market.mass.PingRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {market.mass.PingRequest} PingRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PingRequest.decode = function decode(reader, length, error) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.PingRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a PingRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof market.mass.PingRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {market.mass.PingRequest} PingRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PingRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a PingRequest message.
             * @function verify
             * @memberof market.mass.PingRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            PingRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                return null;
            };

            /**
             * Creates a PingRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof market.mass.PingRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {market.mass.PingRequest} PingRequest
             */
            PingRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.market.mass.PingRequest)
                    return object;
                return new $root.market.mass.PingRequest();
            };

            /**
             * Creates a plain object from a PingRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof market.mass.PingRequest
             * @static
             * @param {market.mass.PingRequest} message PingRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            PingRequest.toObject = function toObject() {
                return {};
            };

            /**
             * Converts this PingRequest to JSON.
             * @function toJSON
             * @memberof market.mass.PingRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            PingRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for PingRequest
             * @function getTypeUrl
             * @memberof market.mass.PingRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            PingRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/market.mass.PingRequest";
            };

            return PingRequest;
        })();

        return mass;
    })();

    return market;
})();

export { $root as default };
