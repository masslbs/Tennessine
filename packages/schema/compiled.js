/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import $protobuf from "protobufjs/minimal.js";

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["market.mass"] || ($protobuf.roots["market.mass"] = {});

$root.market = (function() {

    /**
     * Namespace market.
     * @exports market
     * @namespace
     */
    var market = {};

    market.mass = (function() {

        /**
         * Namespace mass.
         * @memberof market
         * @namespace
         */
        var mass = {};

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
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
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
            AuthenticateRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.AuthenticateRequest();
                while (reader.pos < end) {
                    var tag = reader.uint32();
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
                    var error = $root.market.mass.PublicKey.verify(message.publicKey);
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
                var message = new $root.market.mass.AuthenticateRequest();
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
                var object = {};
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
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
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
            ChallengeSolvedRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.ChallengeSolvedRequest();
                while (reader.pos < end) {
                    var tag = reader.uint32();
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
                    var error = $root.market.mass.Signature.verify(message.signature);
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
                var message = new $root.market.mass.ChallengeSolvedRequest();
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
                var object = {};
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
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
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
            RequestId.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.RequestId();
                while (reader.pos < end) {
                    var tag = reader.uint32();
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
                var message = new $root.market.mass.RequestId();
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
                var object = {};
                if (options.defaults)
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, false);
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
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
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
            Signature.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.Signature();
                while (reader.pos < end) {
                    var tag = reader.uint32();
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
                var message = new $root.market.mass.Signature();
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
                var object = {};
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
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
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
            PublicKey.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.PublicKey();
                while (reader.pos < end) {
                    var tag = reader.uint32();
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
                var message = new $root.market.mass.PublicKey();
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
                var object = {};
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

        mass.Hash = (function() {

            /**
             * Properties of a Hash.
             * @memberof market.mass
             * @interface IHash
             * @property {Uint8Array|null} [raw] Hash raw
             */

            /**
             * Constructs a new Hash.
             * @memberof market.mass
             * @classdesc Represents a Hash.
             * @implements IHash
             * @constructor
             * @param {market.mass.IHash=} [properties] Properties to set
             */
            function Hash(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Hash raw.
             * @member {Uint8Array} raw
             * @memberof market.mass.Hash
             * @instance
             */
            Hash.prototype.raw = $util.newBuffer([]);

            /**
             * Creates a new Hash instance using the specified properties.
             * @function create
             * @memberof market.mass.Hash
             * @static
             * @param {market.mass.IHash=} [properties] Properties to set
             * @returns {market.mass.Hash} Hash instance
             */
            Hash.create = function create(properties) {
                return new Hash(properties);
            };

            /**
             * Encodes the specified Hash message. Does not implicitly {@link market.mass.Hash.verify|verify} messages.
             * @function encode
             * @memberof market.mass.Hash
             * @static
             * @param {market.mass.IHash} message Hash message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Hash.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.raw != null && Object.hasOwnProperty.call(message, "raw"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.raw);
                return writer;
            };

            /**
             * Encodes the specified Hash message, length delimited. Does not implicitly {@link market.mass.Hash.verify|verify} messages.
             * @function encodeDelimited
             * @memberof market.mass.Hash
             * @static
             * @param {market.mass.IHash} message Hash message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Hash.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a Hash message from the specified reader or buffer.
             * @function decode
             * @memberof market.mass.Hash
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {market.mass.Hash} Hash
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Hash.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.Hash();
                while (reader.pos < end) {
                    var tag = reader.uint32();
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
             * Decodes a Hash message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof market.mass.Hash
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {market.mass.Hash} Hash
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Hash.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Hash message.
             * @function verify
             * @memberof market.mass.Hash
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Hash.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.raw != null && message.hasOwnProperty("raw"))
                    if (!(message.raw && typeof message.raw.length === "number" || $util.isString(message.raw)))
                        return "raw: buffer expected";
                return null;
            };

            /**
             * Creates a Hash message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof market.mass.Hash
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {market.mass.Hash} Hash
             */
            Hash.fromObject = function fromObject(object) {
                if (object instanceof $root.market.mass.Hash)
                    return object;
                var message = new $root.market.mass.Hash();
                if (object.raw != null)
                    if (typeof object.raw === "string")
                        $util.base64.decode(object.raw, message.raw = $util.newBuffer($util.base64.length(object.raw)), 0);
                    else if (object.raw.length >= 0)
                        message.raw = object.raw;
                return message;
            };

            /**
             * Creates a plain object from a Hash message. Also converts values to other types if specified.
             * @function toObject
             * @memberof market.mass.Hash
             * @static
             * @param {market.mass.Hash} message Hash
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Hash.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
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
             * Converts this Hash to JSON.
             * @function toJSON
             * @memberof market.mass.Hash
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Hash.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for Hash
             * @function getTypeUrl
             * @memberof market.mass.Hash
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            Hash.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/market.mass.Hash";
            };

            return Hash;
        })();

        mass.EthereumAddress = (function() {

            /**
             * Properties of an EthereumAddress.
             * @memberof market.mass
             * @interface IEthereumAddress
             * @property {Uint8Array|null} [raw] EthereumAddress raw
             */

            /**
             * Constructs a new EthereumAddress.
             * @memberof market.mass
             * @classdesc Represents an EthereumAddress.
             * @implements IEthereumAddress
             * @constructor
             * @param {market.mass.IEthereumAddress=} [properties] Properties to set
             */
            function EthereumAddress(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * EthereumAddress raw.
             * @member {Uint8Array} raw
             * @memberof market.mass.EthereumAddress
             * @instance
             */
            EthereumAddress.prototype.raw = $util.newBuffer([]);

            /**
             * Creates a new EthereumAddress instance using the specified properties.
             * @function create
             * @memberof market.mass.EthereumAddress
             * @static
             * @param {market.mass.IEthereumAddress=} [properties] Properties to set
             * @returns {market.mass.EthereumAddress} EthereumAddress instance
             */
            EthereumAddress.create = function create(properties) {
                return new EthereumAddress(properties);
            };

            /**
             * Encodes the specified EthereumAddress message. Does not implicitly {@link market.mass.EthereumAddress.verify|verify} messages.
             * @function encode
             * @memberof market.mass.EthereumAddress
             * @static
             * @param {market.mass.IEthereumAddress} message EthereumAddress message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            EthereumAddress.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.raw != null && Object.hasOwnProperty.call(message, "raw"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.raw);
                return writer;
            };

            /**
             * Encodes the specified EthereumAddress message, length delimited. Does not implicitly {@link market.mass.EthereumAddress.verify|verify} messages.
             * @function encodeDelimited
             * @memberof market.mass.EthereumAddress
             * @static
             * @param {market.mass.IEthereumAddress} message EthereumAddress message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            EthereumAddress.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an EthereumAddress message from the specified reader or buffer.
             * @function decode
             * @memberof market.mass.EthereumAddress
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {market.mass.EthereumAddress} EthereumAddress
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            EthereumAddress.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.EthereumAddress();
                while (reader.pos < end) {
                    var tag = reader.uint32();
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
             * Decodes an EthereumAddress message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof market.mass.EthereumAddress
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {market.mass.EthereumAddress} EthereumAddress
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            EthereumAddress.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an EthereumAddress message.
             * @function verify
             * @memberof market.mass.EthereumAddress
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            EthereumAddress.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.raw != null && message.hasOwnProperty("raw"))
                    if (!(message.raw && typeof message.raw.length === "number" || $util.isString(message.raw)))
                        return "raw: buffer expected";
                return null;
            };

            /**
             * Creates an EthereumAddress message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof market.mass.EthereumAddress
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {market.mass.EthereumAddress} EthereumAddress
             */
            EthereumAddress.fromObject = function fromObject(object) {
                if (object instanceof $root.market.mass.EthereumAddress)
                    return object;
                var message = new $root.market.mass.EthereumAddress();
                if (object.raw != null)
                    if (typeof object.raw === "string")
                        $util.base64.decode(object.raw, message.raw = $util.newBuffer($util.base64.length(object.raw)), 0);
                    else if (object.raw.length >= 0)
                        message.raw = object.raw;
                return message;
            };

            /**
             * Creates a plain object from an EthereumAddress message. Also converts values to other types if specified.
             * @function toObject
             * @memberof market.mass.EthereumAddress
             * @static
             * @param {market.mass.EthereumAddress} message EthereumAddress
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            EthereumAddress.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
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
             * Converts this EthereumAddress to JSON.
             * @function toJSON
             * @memberof market.mass.EthereumAddress
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            EthereumAddress.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for EthereumAddress
             * @function getTypeUrl
             * @memberof market.mass.EthereumAddress
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            EthereumAddress.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/market.mass.EthereumAddress";
            };

            return EthereumAddress;
        })();

        mass.IPFSAddress = (function() {

            /**
             * Properties of a IPFSAddress.
             * @memberof market.mass
             * @interface IIPFSAddress
             * @property {string|null} [cid] IPFSAddress cid
             */

            /**
             * Constructs a new IPFSAddress.
             * @memberof market.mass
             * @classdesc Represents a IPFSAddress.
             * @implements IIPFSAddress
             * @constructor
             * @param {market.mass.IIPFSAddress=} [properties] Properties to set
             */
            function IPFSAddress(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * IPFSAddress cid.
             * @member {string} cid
             * @memberof market.mass.IPFSAddress
             * @instance
             */
            IPFSAddress.prototype.cid = "";

            /**
             * Creates a new IPFSAddress instance using the specified properties.
             * @function create
             * @memberof market.mass.IPFSAddress
             * @static
             * @param {market.mass.IIPFSAddress=} [properties] Properties to set
             * @returns {market.mass.IPFSAddress} IPFSAddress instance
             */
            IPFSAddress.create = function create(properties) {
                return new IPFSAddress(properties);
            };

            /**
             * Encodes the specified IPFSAddress message. Does not implicitly {@link market.mass.IPFSAddress.verify|verify} messages.
             * @function encode
             * @memberof market.mass.IPFSAddress
             * @static
             * @param {market.mass.IIPFSAddress} message IPFSAddress message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            IPFSAddress.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.cid != null && Object.hasOwnProperty.call(message, "cid"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.cid);
                return writer;
            };

            /**
             * Encodes the specified IPFSAddress message, length delimited. Does not implicitly {@link market.mass.IPFSAddress.verify|verify} messages.
             * @function encodeDelimited
             * @memberof market.mass.IPFSAddress
             * @static
             * @param {market.mass.IIPFSAddress} message IPFSAddress message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            IPFSAddress.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a IPFSAddress message from the specified reader or buffer.
             * @function decode
             * @memberof market.mass.IPFSAddress
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {market.mass.IPFSAddress} IPFSAddress
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            IPFSAddress.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.IPFSAddress();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.cid = reader.string();
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
             * Decodes a IPFSAddress message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof market.mass.IPFSAddress
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {market.mass.IPFSAddress} IPFSAddress
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            IPFSAddress.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a IPFSAddress message.
             * @function verify
             * @memberof market.mass.IPFSAddress
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            IPFSAddress.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.cid != null && message.hasOwnProperty("cid"))
                    if (!$util.isString(message.cid))
                        return "cid: string expected";
                return null;
            };

            /**
             * Creates a IPFSAddress message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof market.mass.IPFSAddress
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {market.mass.IPFSAddress} IPFSAddress
             */
            IPFSAddress.fromObject = function fromObject(object) {
                if (object instanceof $root.market.mass.IPFSAddress)
                    return object;
                var message = new $root.market.mass.IPFSAddress();
                if (object.cid != null)
                    message.cid = String(object.cid);
                return message;
            };

            /**
             * Creates a plain object from a IPFSAddress message. Also converts values to other types if specified.
             * @function toObject
             * @memberof market.mass.IPFSAddress
             * @static
             * @param {market.mass.IPFSAddress} message IPFSAddress
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            IPFSAddress.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.cid = "";
                if (message.cid != null && message.hasOwnProperty("cid"))
                    object.cid = message.cid;
                return object;
            };

            /**
             * Converts this IPFSAddress to JSON.
             * @function toJSON
             * @memberof market.mass.IPFSAddress
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            IPFSAddress.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for IPFSAddress
             * @function getTypeUrl
             * @memberof market.mass.IPFSAddress
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            IPFSAddress.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/market.mass.IPFSAddress";
            };

            return IPFSAddress;
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
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
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
            Uint256.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.Uint256();
                while (reader.pos < end) {
                    var tag = reader.uint32();
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
                var message = new $root.market.mass.Uint256();
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
                var object = {};
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

        mass.ShopCurrency = (function() {

            /**
             * Properties of a ShopCurrency.
             * @memberof market.mass
             * @interface IShopCurrency
             * @property {number|Long|null} [chainId] ShopCurrency chainId
             * @property {market.mass.IEthereumAddress|null} [address] ShopCurrency address
             */

            /**
             * Constructs a new ShopCurrency.
             * @memberof market.mass
             * @classdesc Represents a ShopCurrency.
             * @implements IShopCurrency
             * @constructor
             * @param {market.mass.IShopCurrency=} [properties] Properties to set
             */
            function ShopCurrency(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * ShopCurrency chainId.
             * @member {number|Long} chainId
             * @memberof market.mass.ShopCurrency
             * @instance
             */
            ShopCurrency.prototype.chainId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * ShopCurrency address.
             * @member {market.mass.IEthereumAddress|null|undefined} address
             * @memberof market.mass.ShopCurrency
             * @instance
             */
            ShopCurrency.prototype.address = null;

            /**
             * Creates a new ShopCurrency instance using the specified properties.
             * @function create
             * @memberof market.mass.ShopCurrency
             * @static
             * @param {market.mass.IShopCurrency=} [properties] Properties to set
             * @returns {market.mass.ShopCurrency} ShopCurrency instance
             */
            ShopCurrency.create = function create(properties) {
                return new ShopCurrency(properties);
            };

            /**
             * Encodes the specified ShopCurrency message. Does not implicitly {@link market.mass.ShopCurrency.verify|verify} messages.
             * @function encode
             * @memberof market.mass.ShopCurrency
             * @static
             * @param {market.mass.IShopCurrency} message ShopCurrency message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ShopCurrency.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.chainId != null && Object.hasOwnProperty.call(message, "chainId"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.chainId);
                if (message.address != null && Object.hasOwnProperty.call(message, "address"))
                    $root.market.mass.EthereumAddress.encode(message.address, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified ShopCurrency message, length delimited. Does not implicitly {@link market.mass.ShopCurrency.verify|verify} messages.
             * @function encodeDelimited
             * @memberof market.mass.ShopCurrency
             * @static
             * @param {market.mass.IShopCurrency} message ShopCurrency message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ShopCurrency.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a ShopCurrency message from the specified reader or buffer.
             * @function decode
             * @memberof market.mass.ShopCurrency
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {market.mass.ShopCurrency} ShopCurrency
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ShopCurrency.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.ShopCurrency();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.chainId = reader.uint64();
                            break;
                        }
                    case 2: {
                            message.address = $root.market.mass.EthereumAddress.decode(reader, reader.uint32());
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
             * Decodes a ShopCurrency message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof market.mass.ShopCurrency
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {market.mass.ShopCurrency} ShopCurrency
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ShopCurrency.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ShopCurrency message.
             * @function verify
             * @memberof market.mass.ShopCurrency
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ShopCurrency.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.chainId != null && message.hasOwnProperty("chainId"))
                    if (!$util.isInteger(message.chainId) && !(message.chainId && $util.isInteger(message.chainId.low) && $util.isInteger(message.chainId.high)))
                        return "chainId: integer|Long expected";
                if (message.address != null && message.hasOwnProperty("address")) {
                    var error = $root.market.mass.EthereumAddress.verify(message.address);
                    if (error)
                        return "address." + error;
                }
                return null;
            };

            /**
             * Creates a ShopCurrency message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof market.mass.ShopCurrency
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {market.mass.ShopCurrency} ShopCurrency
             */
            ShopCurrency.fromObject = function fromObject(object) {
                if (object instanceof $root.market.mass.ShopCurrency)
                    return object;
                var message = new $root.market.mass.ShopCurrency();
                if (object.chainId != null)
                    if ($util.Long)
                        (message.chainId = $util.Long.fromValue(object.chainId)).unsigned = true;
                    else if (typeof object.chainId === "string")
                        message.chainId = parseInt(object.chainId, 10);
                    else if (typeof object.chainId === "number")
                        message.chainId = object.chainId;
                    else if (typeof object.chainId === "object")
                        message.chainId = new $util.LongBits(object.chainId.low >>> 0, object.chainId.high >>> 0).toNumber(true);
                if (object.address != null) {
                    if (typeof object.address !== "object")
                        throw TypeError(".market.mass.ShopCurrency.address: object expected");
                    message.address = $root.market.mass.EthereumAddress.fromObject(object.address);
                }
                return message;
            };

            /**
             * Creates a plain object from a ShopCurrency message. Also converts values to other types if specified.
             * @function toObject
             * @memberof market.mass.ShopCurrency
             * @static
             * @param {market.mass.ShopCurrency} message ShopCurrency
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ShopCurrency.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.chainId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.chainId = options.longs === String ? "0" : 0;
                    object.address = null;
                }
                if (message.chainId != null && message.hasOwnProperty("chainId"))
                    if (typeof message.chainId === "number")
                        object.chainId = options.longs === String ? String(message.chainId) : message.chainId;
                    else
                        object.chainId = options.longs === String ? $util.Long.prototype.toString.call(message.chainId) : options.longs === Number ? new $util.LongBits(message.chainId.low >>> 0, message.chainId.high >>> 0).toNumber(true) : message.chainId;
                if (message.address != null && message.hasOwnProperty("address"))
                    object.address = $root.market.mass.EthereumAddress.toObject(message.address, options);
                return object;
            };

            /**
             * Converts this ShopCurrency to JSON.
             * @function toJSON
             * @memberof market.mass.ShopCurrency
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ShopCurrency.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for ShopCurrency
             * @function getTypeUrl
             * @memberof market.mass.ShopCurrency
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            ShopCurrency.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/market.mass.ShopCurrency";
            };

            return ShopCurrency;
        })();

        mass.Payee = (function() {

            /**
             * Properties of a Payee.
             * @memberof market.mass
             * @interface IPayee
             * @property {string|null} [name] Payee name
             * @property {market.mass.IEthereumAddress|null} [address] Payee address
             * @property {number|Long|null} [chainId] Payee chainId
             * @property {boolean|null} [callAsContract] Payee callAsContract
             */

            /**
             * Constructs a new Payee.
             * @memberof market.mass
             * @classdesc Represents a Payee.
             * @implements IPayee
             * @constructor
             * @param {market.mass.IPayee=} [properties] Properties to set
             */
            function Payee(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Payee name.
             * @member {string} name
             * @memberof market.mass.Payee
             * @instance
             */
            Payee.prototype.name = "";

            /**
             * Payee address.
             * @member {market.mass.IEthereumAddress|null|undefined} address
             * @memberof market.mass.Payee
             * @instance
             */
            Payee.prototype.address = null;

            /**
             * Payee chainId.
             * @member {number|Long} chainId
             * @memberof market.mass.Payee
             * @instance
             */
            Payee.prototype.chainId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * Payee callAsContract.
             * @member {boolean} callAsContract
             * @memberof market.mass.Payee
             * @instance
             */
            Payee.prototype.callAsContract = false;

            /**
             * Creates a new Payee instance using the specified properties.
             * @function create
             * @memberof market.mass.Payee
             * @static
             * @param {market.mass.IPayee=} [properties] Properties to set
             * @returns {market.mass.Payee} Payee instance
             */
            Payee.create = function create(properties) {
                return new Payee(properties);
            };

            /**
             * Encodes the specified Payee message. Does not implicitly {@link market.mass.Payee.verify|verify} messages.
             * @function encode
             * @memberof market.mass.Payee
             * @static
             * @param {market.mass.IPayee} message Payee message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Payee.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
                if (message.address != null && Object.hasOwnProperty.call(message, "address"))
                    $root.market.mass.EthereumAddress.encode(message.address, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                if (message.chainId != null && Object.hasOwnProperty.call(message, "chainId"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.chainId);
                if (message.callAsContract != null && Object.hasOwnProperty.call(message, "callAsContract"))
                    writer.uint32(/* id 4, wireType 0 =*/32).bool(message.callAsContract);
                return writer;
            };

            /**
             * Encodes the specified Payee message, length delimited. Does not implicitly {@link market.mass.Payee.verify|verify} messages.
             * @function encodeDelimited
             * @memberof market.mass.Payee
             * @static
             * @param {market.mass.IPayee} message Payee message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Payee.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a Payee message from the specified reader or buffer.
             * @function decode
             * @memberof market.mass.Payee
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {market.mass.Payee} Payee
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Payee.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.Payee();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.name = reader.string();
                            break;
                        }
                    case 2: {
                            message.address = $root.market.mass.EthereumAddress.decode(reader, reader.uint32());
                            break;
                        }
                    case 3: {
                            message.chainId = reader.uint64();
                            break;
                        }
                    case 4: {
                            message.callAsContract = reader.bool();
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
             * Decodes a Payee message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof market.mass.Payee
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {market.mass.Payee} Payee
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Payee.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Payee message.
             * @function verify
             * @memberof market.mass.Payee
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Payee.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.name != null && message.hasOwnProperty("name"))
                    if (!$util.isString(message.name))
                        return "name: string expected";
                if (message.address != null && message.hasOwnProperty("address")) {
                    var error = $root.market.mass.EthereumAddress.verify(message.address);
                    if (error)
                        return "address." + error;
                }
                if (message.chainId != null && message.hasOwnProperty("chainId"))
                    if (!$util.isInteger(message.chainId) && !(message.chainId && $util.isInteger(message.chainId.low) && $util.isInteger(message.chainId.high)))
                        return "chainId: integer|Long expected";
                if (message.callAsContract != null && message.hasOwnProperty("callAsContract"))
                    if (typeof message.callAsContract !== "boolean")
                        return "callAsContract: boolean expected";
                return null;
            };

            /**
             * Creates a Payee message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof market.mass.Payee
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {market.mass.Payee} Payee
             */
            Payee.fromObject = function fromObject(object) {
                if (object instanceof $root.market.mass.Payee)
                    return object;
                var message = new $root.market.mass.Payee();
                if (object.name != null)
                    message.name = String(object.name);
                if (object.address != null) {
                    if (typeof object.address !== "object")
                        throw TypeError(".market.mass.Payee.address: object expected");
                    message.address = $root.market.mass.EthereumAddress.fromObject(object.address);
                }
                if (object.chainId != null)
                    if ($util.Long)
                        (message.chainId = $util.Long.fromValue(object.chainId)).unsigned = true;
                    else if (typeof object.chainId === "string")
                        message.chainId = parseInt(object.chainId, 10);
                    else if (typeof object.chainId === "number")
                        message.chainId = object.chainId;
                    else if (typeof object.chainId === "object")
                        message.chainId = new $util.LongBits(object.chainId.low >>> 0, object.chainId.high >>> 0).toNumber(true);
                if (object.callAsContract != null)
                    message.callAsContract = Boolean(object.callAsContract);
                return message;
            };

            /**
             * Creates a plain object from a Payee message. Also converts values to other types if specified.
             * @function toObject
             * @memberof market.mass.Payee
             * @static
             * @param {market.mass.Payee} message Payee
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Payee.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.name = "";
                    object.address = null;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.chainId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.chainId = options.longs === String ? "0" : 0;
                    object.callAsContract = false;
                }
                if (message.name != null && message.hasOwnProperty("name"))
                    object.name = message.name;
                if (message.address != null && message.hasOwnProperty("address"))
                    object.address = $root.market.mass.EthereumAddress.toObject(message.address, options);
                if (message.chainId != null && message.hasOwnProperty("chainId"))
                    if (typeof message.chainId === "number")
                        object.chainId = options.longs === String ? String(message.chainId) : message.chainId;
                    else
                        object.chainId = options.longs === String ? $util.Long.prototype.toString.call(message.chainId) : options.longs === Number ? new $util.LongBits(message.chainId.low >>> 0, message.chainId.high >>> 0).toNumber(true) : message.chainId;
                if (message.callAsContract != null && message.hasOwnProperty("callAsContract"))
                    object.callAsContract = message.callAsContract;
                return object;
            };

            /**
             * Converts this Payee to JSON.
             * @function toJSON
             * @memberof market.mass.Payee
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Payee.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for Payee
             * @function getTypeUrl
             * @memberof market.mass.Payee
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            Payee.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/market.mass.Payee";
            };

            return Payee;
        })();

        mass.ListingMetadata = (function() {

            /**
             * Properties of a ListingMetadata.
             * @memberof market.mass
             * @interface IListingMetadata
             * @property {string|null} [title] ListingMetadata title
             * @property {string|null} [description] ListingMetadata description
             * @property {Array.<string>|null} [images] ListingMetadata images
             */

            /**
             * Constructs a new ListingMetadata.
             * @memberof market.mass
             * @classdesc Represents a ListingMetadata.
             * @implements IListingMetadata
             * @constructor
             * @param {market.mass.IListingMetadata=} [properties] Properties to set
             */
            function ListingMetadata(properties) {
                this.images = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * ListingMetadata title.
             * @member {string} title
             * @memberof market.mass.ListingMetadata
             * @instance
             */
            ListingMetadata.prototype.title = "";

            /**
             * ListingMetadata description.
             * @member {string} description
             * @memberof market.mass.ListingMetadata
             * @instance
             */
            ListingMetadata.prototype.description = "";

            /**
             * ListingMetadata images.
             * @member {Array.<string>} images
             * @memberof market.mass.ListingMetadata
             * @instance
             */
            ListingMetadata.prototype.images = $util.emptyArray;

            /**
             * Creates a new ListingMetadata instance using the specified properties.
             * @function create
             * @memberof market.mass.ListingMetadata
             * @static
             * @param {market.mass.IListingMetadata=} [properties] Properties to set
             * @returns {market.mass.ListingMetadata} ListingMetadata instance
             */
            ListingMetadata.create = function create(properties) {
                return new ListingMetadata(properties);
            };

            /**
             * Encodes the specified ListingMetadata message. Does not implicitly {@link market.mass.ListingMetadata.verify|verify} messages.
             * @function encode
             * @memberof market.mass.ListingMetadata
             * @static
             * @param {market.mass.IListingMetadata} message ListingMetadata message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ListingMetadata.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.title != null && Object.hasOwnProperty.call(message, "title"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.title);
                if (message.description != null && Object.hasOwnProperty.call(message, "description"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.description);
                if (message.images != null && message.images.length)
                    for (var i = 0; i < message.images.length; ++i)
                        writer.uint32(/* id 3, wireType 2 =*/26).string(message.images[i]);
                return writer;
            };

            /**
             * Encodes the specified ListingMetadata message, length delimited. Does not implicitly {@link market.mass.ListingMetadata.verify|verify} messages.
             * @function encodeDelimited
             * @memberof market.mass.ListingMetadata
             * @static
             * @param {market.mass.IListingMetadata} message ListingMetadata message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ListingMetadata.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a ListingMetadata message from the specified reader or buffer.
             * @function decode
             * @memberof market.mass.ListingMetadata
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {market.mass.ListingMetadata} ListingMetadata
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ListingMetadata.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.ListingMetadata();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.title = reader.string();
                            break;
                        }
                    case 2: {
                            message.description = reader.string();
                            break;
                        }
                    case 3: {
                            if (!(message.images && message.images.length))
                                message.images = [];
                            message.images.push(reader.string());
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
             * Decodes a ListingMetadata message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof market.mass.ListingMetadata
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {market.mass.ListingMetadata} ListingMetadata
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ListingMetadata.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ListingMetadata message.
             * @function verify
             * @memberof market.mass.ListingMetadata
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ListingMetadata.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.title != null && message.hasOwnProperty("title"))
                    if (!$util.isString(message.title))
                        return "title: string expected";
                if (message.description != null && message.hasOwnProperty("description"))
                    if (!$util.isString(message.description))
                        return "description: string expected";
                if (message.images != null && message.hasOwnProperty("images")) {
                    if (!Array.isArray(message.images))
                        return "images: array expected";
                    for (var i = 0; i < message.images.length; ++i)
                        if (!$util.isString(message.images[i]))
                            return "images: string[] expected";
                }
                return null;
            };

            /**
             * Creates a ListingMetadata message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof market.mass.ListingMetadata
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {market.mass.ListingMetadata} ListingMetadata
             */
            ListingMetadata.fromObject = function fromObject(object) {
                if (object instanceof $root.market.mass.ListingMetadata)
                    return object;
                var message = new $root.market.mass.ListingMetadata();
                if (object.title != null)
                    message.title = String(object.title);
                if (object.description != null)
                    message.description = String(object.description);
                if (object.images) {
                    if (!Array.isArray(object.images))
                        throw TypeError(".market.mass.ListingMetadata.images: array expected");
                    message.images = [];
                    for (var i = 0; i < object.images.length; ++i)
                        message.images[i] = String(object.images[i]);
                }
                return message;
            };

            /**
             * Creates a plain object from a ListingMetadata message. Also converts values to other types if specified.
             * @function toObject
             * @memberof market.mass.ListingMetadata
             * @static
             * @param {market.mass.ListingMetadata} message ListingMetadata
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ListingMetadata.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults)
                    object.images = [];
                if (options.defaults) {
                    object.title = "";
                    object.description = "";
                }
                if (message.title != null && message.hasOwnProperty("title"))
                    object.title = message.title;
                if (message.description != null && message.hasOwnProperty("description"))
                    object.description = message.description;
                if (message.images && message.images.length) {
                    object.images = [];
                    for (var j = 0; j < message.images.length; ++j)
                        object.images[j] = message.images[j];
                }
                return object;
            };

            /**
             * Converts this ListingMetadata to JSON.
             * @function toJSON
             * @memberof market.mass.ListingMetadata
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ListingMetadata.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for ListingMetadata
             * @function getTypeUrl
             * @memberof market.mass.ListingMetadata
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            ListingMetadata.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/market.mass.ListingMetadata";
            };

            return ListingMetadata;
        })();

        mass.ListingOption = (function() {

            /**
             * Properties of a ListingOption.
             * @memberof market.mass
             * @interface IListingOption
             * @property {number|Long|null} [id] ListingOption id
             * @property {string|null} [title] ListingOption title
             * @property {Array.<market.mass.IListingVariation>|null} [variations] ListingOption variations
             */

            /**
             * Constructs a new ListingOption.
             * @memberof market.mass
             * @classdesc Represents a ListingOption.
             * @implements IListingOption
             * @constructor
             * @param {market.mass.IListingOption=} [properties] Properties to set
             */
            function ListingOption(properties) {
                this.variations = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * ListingOption id.
             * @member {number|Long} id
             * @memberof market.mass.ListingOption
             * @instance
             */
            ListingOption.prototype.id = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * ListingOption title.
             * @member {string} title
             * @memberof market.mass.ListingOption
             * @instance
             */
            ListingOption.prototype.title = "";

            /**
             * ListingOption variations.
             * @member {Array.<market.mass.IListingVariation>} variations
             * @memberof market.mass.ListingOption
             * @instance
             */
            ListingOption.prototype.variations = $util.emptyArray;

            /**
             * Creates a new ListingOption instance using the specified properties.
             * @function create
             * @memberof market.mass.ListingOption
             * @static
             * @param {market.mass.IListingOption=} [properties] Properties to set
             * @returns {market.mass.ListingOption} ListingOption instance
             */
            ListingOption.create = function create(properties) {
                return new ListingOption(properties);
            };

            /**
             * Encodes the specified ListingOption message. Does not implicitly {@link market.mass.ListingOption.verify|verify} messages.
             * @function encode
             * @memberof market.mass.ListingOption
             * @static
             * @param {market.mass.IListingOption} message ListingOption message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ListingOption.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.id);
                if (message.title != null && Object.hasOwnProperty.call(message, "title"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.title);
                if (message.variations != null && message.variations.length)
                    for (var i = 0; i < message.variations.length; ++i)
                        $root.market.mass.ListingVariation.encode(message.variations[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified ListingOption message, length delimited. Does not implicitly {@link market.mass.ListingOption.verify|verify} messages.
             * @function encodeDelimited
             * @memberof market.mass.ListingOption
             * @static
             * @param {market.mass.IListingOption} message ListingOption message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ListingOption.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a ListingOption message from the specified reader or buffer.
             * @function decode
             * @memberof market.mass.ListingOption
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {market.mass.ListingOption} ListingOption
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ListingOption.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.ListingOption();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.id = reader.uint64();
                            break;
                        }
                    case 2: {
                            message.title = reader.string();
                            break;
                        }
                    case 3: {
                            if (!(message.variations && message.variations.length))
                                message.variations = [];
                            message.variations.push($root.market.mass.ListingVariation.decode(reader, reader.uint32()));
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
             * Decodes a ListingOption message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof market.mass.ListingOption
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {market.mass.ListingOption} ListingOption
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ListingOption.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ListingOption message.
             * @function verify
             * @memberof market.mass.ListingOption
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ListingOption.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.id != null && message.hasOwnProperty("id"))
                    if (!$util.isInteger(message.id) && !(message.id && $util.isInteger(message.id.low) && $util.isInteger(message.id.high)))
                        return "id: integer|Long expected";
                if (message.title != null && message.hasOwnProperty("title"))
                    if (!$util.isString(message.title))
                        return "title: string expected";
                if (message.variations != null && message.hasOwnProperty("variations")) {
                    if (!Array.isArray(message.variations))
                        return "variations: array expected";
                    for (var i = 0; i < message.variations.length; ++i) {
                        var error = $root.market.mass.ListingVariation.verify(message.variations[i]);
                        if (error)
                            return "variations." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a ListingOption message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof market.mass.ListingOption
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {market.mass.ListingOption} ListingOption
             */
            ListingOption.fromObject = function fromObject(object) {
                if (object instanceof $root.market.mass.ListingOption)
                    return object;
                var message = new $root.market.mass.ListingOption();
                if (object.id != null)
                    if ($util.Long)
                        (message.id = $util.Long.fromValue(object.id)).unsigned = true;
                    else if (typeof object.id === "string")
                        message.id = parseInt(object.id, 10);
                    else if (typeof object.id === "number")
                        message.id = object.id;
                    else if (typeof object.id === "object")
                        message.id = new $util.LongBits(object.id.low >>> 0, object.id.high >>> 0).toNumber(true);
                if (object.title != null)
                    message.title = String(object.title);
                if (object.variations) {
                    if (!Array.isArray(object.variations))
                        throw TypeError(".market.mass.ListingOption.variations: array expected");
                    message.variations = [];
                    for (var i = 0; i < object.variations.length; ++i) {
                        if (typeof object.variations[i] !== "object")
                            throw TypeError(".market.mass.ListingOption.variations: object expected");
                        message.variations[i] = $root.market.mass.ListingVariation.fromObject(object.variations[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from a ListingOption message. Also converts values to other types if specified.
             * @function toObject
             * @memberof market.mass.ListingOption
             * @static
             * @param {market.mass.ListingOption} message ListingOption
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ListingOption.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults)
                    object.variations = [];
                if (options.defaults) {
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.id = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.id = options.longs === String ? "0" : 0;
                    object.title = "";
                }
                if (message.id != null && message.hasOwnProperty("id"))
                    if (typeof message.id === "number")
                        object.id = options.longs === String ? String(message.id) : message.id;
                    else
                        object.id = options.longs === String ? $util.Long.prototype.toString.call(message.id) : options.longs === Number ? new $util.LongBits(message.id.low >>> 0, message.id.high >>> 0).toNumber(true) : message.id;
                if (message.title != null && message.hasOwnProperty("title"))
                    object.title = message.title;
                if (message.variations && message.variations.length) {
                    object.variations = [];
                    for (var j = 0; j < message.variations.length; ++j)
                        object.variations[j] = $root.market.mass.ListingVariation.toObject(message.variations[j], options);
                }
                return object;
            };

            /**
             * Converts this ListingOption to JSON.
             * @function toJSON
             * @memberof market.mass.ListingOption
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ListingOption.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for ListingOption
             * @function getTypeUrl
             * @memberof market.mass.ListingOption
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            ListingOption.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/market.mass.ListingOption";
            };

            return ListingOption;
        })();

        mass.ListingVariation = (function() {

            /**
             * Properties of a ListingVariation.
             * @memberof market.mass
             * @interface IListingVariation
             * @property {number|Long|null} [id] ListingVariation id
             * @property {market.mass.IListingMetadata|null} [variationInfo] ListingVariation variationInfo
             * @property {boolean|null} [priceDiffSign] ListingVariation priceDiffSign
             * @property {market.mass.IUint256|null} [priceDiff] ListingVariation priceDiff
             * @property {string|null} [sku] ListingVariation sku
             */

            /**
             * Constructs a new ListingVariation.
             * @memberof market.mass
             * @classdesc Represents a ListingVariation.
             * @implements IListingVariation
             * @constructor
             * @param {market.mass.IListingVariation=} [properties] Properties to set
             */
            function ListingVariation(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * ListingVariation id.
             * @member {number|Long} id
             * @memberof market.mass.ListingVariation
             * @instance
             */
            ListingVariation.prototype.id = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * ListingVariation variationInfo.
             * @member {market.mass.IListingMetadata|null|undefined} variationInfo
             * @memberof market.mass.ListingVariation
             * @instance
             */
            ListingVariation.prototype.variationInfo = null;

            /**
             * ListingVariation priceDiffSign.
             * @member {boolean} priceDiffSign
             * @memberof market.mass.ListingVariation
             * @instance
             */
            ListingVariation.prototype.priceDiffSign = false;

            /**
             * ListingVariation priceDiff.
             * @member {market.mass.IUint256|null|undefined} priceDiff
             * @memberof market.mass.ListingVariation
             * @instance
             */
            ListingVariation.prototype.priceDiff = null;

            /**
             * ListingVariation sku.
             * @member {string} sku
             * @memberof market.mass.ListingVariation
             * @instance
             */
            ListingVariation.prototype.sku = "";

            /**
             * Creates a new ListingVariation instance using the specified properties.
             * @function create
             * @memberof market.mass.ListingVariation
             * @static
             * @param {market.mass.IListingVariation=} [properties] Properties to set
             * @returns {market.mass.ListingVariation} ListingVariation instance
             */
            ListingVariation.create = function create(properties) {
                return new ListingVariation(properties);
            };

            /**
             * Encodes the specified ListingVariation message. Does not implicitly {@link market.mass.ListingVariation.verify|verify} messages.
             * @function encode
             * @memberof market.mass.ListingVariation
             * @static
             * @param {market.mass.IListingVariation} message ListingVariation message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ListingVariation.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.id);
                if (message.variationInfo != null && Object.hasOwnProperty.call(message, "variationInfo"))
                    $root.market.mass.ListingMetadata.encode(message.variationInfo, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                if (message.priceDiffSign != null && Object.hasOwnProperty.call(message, "priceDiffSign"))
                    writer.uint32(/* id 3, wireType 0 =*/24).bool(message.priceDiffSign);
                if (message.priceDiff != null && Object.hasOwnProperty.call(message, "priceDiff"))
                    $root.market.mass.Uint256.encode(message.priceDiff, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                if (message.sku != null && Object.hasOwnProperty.call(message, "sku"))
                    writer.uint32(/* id 5, wireType 2 =*/42).string(message.sku);
                return writer;
            };

            /**
             * Encodes the specified ListingVariation message, length delimited. Does not implicitly {@link market.mass.ListingVariation.verify|verify} messages.
             * @function encodeDelimited
             * @memberof market.mass.ListingVariation
             * @static
             * @param {market.mass.IListingVariation} message ListingVariation message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ListingVariation.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a ListingVariation message from the specified reader or buffer.
             * @function decode
             * @memberof market.mass.ListingVariation
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {market.mass.ListingVariation} ListingVariation
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ListingVariation.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.ListingVariation();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.id = reader.uint64();
                            break;
                        }
                    case 2: {
                            message.variationInfo = $root.market.mass.ListingMetadata.decode(reader, reader.uint32());
                            break;
                        }
                    case 3: {
                            message.priceDiffSign = reader.bool();
                            break;
                        }
                    case 4: {
                            message.priceDiff = $root.market.mass.Uint256.decode(reader, reader.uint32());
                            break;
                        }
                    case 5: {
                            message.sku = reader.string();
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
             * Decodes a ListingVariation message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof market.mass.ListingVariation
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {market.mass.ListingVariation} ListingVariation
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ListingVariation.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ListingVariation message.
             * @function verify
             * @memberof market.mass.ListingVariation
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ListingVariation.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.id != null && message.hasOwnProperty("id"))
                    if (!$util.isInteger(message.id) && !(message.id && $util.isInteger(message.id.low) && $util.isInteger(message.id.high)))
                        return "id: integer|Long expected";
                if (message.variationInfo != null && message.hasOwnProperty("variationInfo")) {
                    var error = $root.market.mass.ListingMetadata.verify(message.variationInfo);
                    if (error)
                        return "variationInfo." + error;
                }
                if (message.priceDiffSign != null && message.hasOwnProperty("priceDiffSign"))
                    if (typeof message.priceDiffSign !== "boolean")
                        return "priceDiffSign: boolean expected";
                if (message.priceDiff != null && message.hasOwnProperty("priceDiff")) {
                    var error = $root.market.mass.Uint256.verify(message.priceDiff);
                    if (error)
                        return "priceDiff." + error;
                }
                if (message.sku != null && message.hasOwnProperty("sku"))
                    if (!$util.isString(message.sku))
                        return "sku: string expected";
                return null;
            };

            /**
             * Creates a ListingVariation message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof market.mass.ListingVariation
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {market.mass.ListingVariation} ListingVariation
             */
            ListingVariation.fromObject = function fromObject(object) {
                if (object instanceof $root.market.mass.ListingVariation)
                    return object;
                var message = new $root.market.mass.ListingVariation();
                if (object.id != null)
                    if ($util.Long)
                        (message.id = $util.Long.fromValue(object.id)).unsigned = true;
                    else if (typeof object.id === "string")
                        message.id = parseInt(object.id, 10);
                    else if (typeof object.id === "number")
                        message.id = object.id;
                    else if (typeof object.id === "object")
                        message.id = new $util.LongBits(object.id.low >>> 0, object.id.high >>> 0).toNumber(true);
                if (object.variationInfo != null) {
                    if (typeof object.variationInfo !== "object")
                        throw TypeError(".market.mass.ListingVariation.variationInfo: object expected");
                    message.variationInfo = $root.market.mass.ListingMetadata.fromObject(object.variationInfo);
                }
                if (object.priceDiffSign != null)
                    message.priceDiffSign = Boolean(object.priceDiffSign);
                if (object.priceDiff != null) {
                    if (typeof object.priceDiff !== "object")
                        throw TypeError(".market.mass.ListingVariation.priceDiff: object expected");
                    message.priceDiff = $root.market.mass.Uint256.fromObject(object.priceDiff);
                }
                if (object.sku != null)
                    message.sku = String(object.sku);
                return message;
            };

            /**
             * Creates a plain object from a ListingVariation message. Also converts values to other types if specified.
             * @function toObject
             * @memberof market.mass.ListingVariation
             * @static
             * @param {market.mass.ListingVariation} message ListingVariation
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ListingVariation.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.id = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.id = options.longs === String ? "0" : 0;
                    object.variationInfo = null;
                    object.priceDiffSign = false;
                    object.priceDiff = null;
                    object.sku = "";
                }
                if (message.id != null && message.hasOwnProperty("id"))
                    if (typeof message.id === "number")
                        object.id = options.longs === String ? String(message.id) : message.id;
                    else
                        object.id = options.longs === String ? $util.Long.prototype.toString.call(message.id) : options.longs === Number ? new $util.LongBits(message.id.low >>> 0, message.id.high >>> 0).toNumber(true) : message.id;
                if (message.variationInfo != null && message.hasOwnProperty("variationInfo"))
                    object.variationInfo = $root.market.mass.ListingMetadata.toObject(message.variationInfo, options);
                if (message.priceDiffSign != null && message.hasOwnProperty("priceDiffSign"))
                    object.priceDiffSign = message.priceDiffSign;
                if (message.priceDiff != null && message.hasOwnProperty("priceDiff"))
                    object.priceDiff = $root.market.mass.Uint256.toObject(message.priceDiff, options);
                if (message.sku != null && message.hasOwnProperty("sku"))
                    object.sku = message.sku;
                return object;
            };

            /**
             * Converts this ListingVariation to JSON.
             * @function toJSON
             * @memberof market.mass.ListingVariation
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ListingVariation.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for ListingVariation
             * @function getTypeUrl
             * @memberof market.mass.ListingVariation
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            ListingVariation.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/market.mass.ListingVariation";
            };

            return ListingVariation;
        })();

        /**
         * ListingViewState enum.
         * @name market.mass.ListingViewState
         * @enum {number}
         * @property {number} LISTING_VIEW_STATE_UNSPECIFIED=0 LISTING_VIEW_STATE_UNSPECIFIED value
         * @property {number} LISTING_VIEW_STATE_PUBLISHED=1 LISTING_VIEW_STATE_PUBLISHED value
         * @property {number} LISTING_VIEW_STATE_DELETED=2 LISTING_VIEW_STATE_DELETED value
         */
        mass.ListingViewState = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "LISTING_VIEW_STATE_UNSPECIFIED"] = 0;
            values[valuesById[1] = "LISTING_VIEW_STATE_PUBLISHED"] = 1;
            values[valuesById[2] = "LISTING_VIEW_STATE_DELETED"] = 2;
            return values;
        })();

        mass.ListingStockStatus = (function() {

            /**
             * Properties of a ListingStockStatus.
             * @memberof market.mass
             * @interface IListingStockStatus
             * @property {Array.<number|Long>|null} [variationIds] ListingStockStatus variationIds
             * @property {boolean|null} [inStock] ListingStockStatus inStock
             * @property {google.protobuf.ITimestamp|null} [expectedInStockBy] ListingStockStatus expectedInStockBy
             */

            /**
             * Constructs a new ListingStockStatus.
             * @memberof market.mass
             * @classdesc Represents a ListingStockStatus.
             * @implements IListingStockStatus
             * @constructor
             * @param {market.mass.IListingStockStatus=} [properties] Properties to set
             */
            function ListingStockStatus(properties) {
                this.variationIds = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * ListingStockStatus variationIds.
             * @member {Array.<number|Long>} variationIds
             * @memberof market.mass.ListingStockStatus
             * @instance
             */
            ListingStockStatus.prototype.variationIds = $util.emptyArray;

            /**
             * ListingStockStatus inStock.
             * @member {boolean|null|undefined} inStock
             * @memberof market.mass.ListingStockStatus
             * @instance
             */
            ListingStockStatus.prototype.inStock = null;

            /**
             * ListingStockStatus expectedInStockBy.
             * @member {google.protobuf.ITimestamp|null|undefined} expectedInStockBy
             * @memberof market.mass.ListingStockStatus
             * @instance
             */
            ListingStockStatus.prototype.expectedInStockBy = null;

            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;

            /**
             * ListingStockStatus status.
             * @member {"inStock"|"expectedInStockBy"|undefined} status
             * @memberof market.mass.ListingStockStatus
             * @instance
             */
            Object.defineProperty(ListingStockStatus.prototype, "status", {
                get: $util.oneOfGetter($oneOfFields = ["inStock", "expectedInStockBy"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new ListingStockStatus instance using the specified properties.
             * @function create
             * @memberof market.mass.ListingStockStatus
             * @static
             * @param {market.mass.IListingStockStatus=} [properties] Properties to set
             * @returns {market.mass.ListingStockStatus} ListingStockStatus instance
             */
            ListingStockStatus.create = function create(properties) {
                return new ListingStockStatus(properties);
            };

            /**
             * Encodes the specified ListingStockStatus message. Does not implicitly {@link market.mass.ListingStockStatus.verify|verify} messages.
             * @function encode
             * @memberof market.mass.ListingStockStatus
             * @static
             * @param {market.mass.IListingStockStatus} message ListingStockStatus message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ListingStockStatus.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.variationIds != null && message.variationIds.length) {
                    writer.uint32(/* id 1, wireType 2 =*/10).fork();
                    for (var i = 0; i < message.variationIds.length; ++i)
                        writer.uint64(message.variationIds[i]);
                    writer.ldelim();
                }
                if (message.inStock != null && Object.hasOwnProperty.call(message, "inStock"))
                    writer.uint32(/* id 2, wireType 0 =*/16).bool(message.inStock);
                if (message.expectedInStockBy != null && Object.hasOwnProperty.call(message, "expectedInStockBy"))
                    $root.google.protobuf.Timestamp.encode(message.expectedInStockBy, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified ListingStockStatus message, length delimited. Does not implicitly {@link market.mass.ListingStockStatus.verify|verify} messages.
             * @function encodeDelimited
             * @memberof market.mass.ListingStockStatus
             * @static
             * @param {market.mass.IListingStockStatus} message ListingStockStatus message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ListingStockStatus.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a ListingStockStatus message from the specified reader or buffer.
             * @function decode
             * @memberof market.mass.ListingStockStatus
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {market.mass.ListingStockStatus} ListingStockStatus
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ListingStockStatus.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.ListingStockStatus();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            if (!(message.variationIds && message.variationIds.length))
                                message.variationIds = [];
                            if ((tag & 7) === 2) {
                                var end2 = reader.uint32() + reader.pos;
                                while (reader.pos < end2)
                                    message.variationIds.push(reader.uint64());
                            } else
                                message.variationIds.push(reader.uint64());
                            break;
                        }
                    case 2: {
                            message.inStock = reader.bool();
                            break;
                        }
                    case 3: {
                            message.expectedInStockBy = $root.google.protobuf.Timestamp.decode(reader, reader.uint32());
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
             * Decodes a ListingStockStatus message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof market.mass.ListingStockStatus
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {market.mass.ListingStockStatus} ListingStockStatus
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ListingStockStatus.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ListingStockStatus message.
             * @function verify
             * @memberof market.mass.ListingStockStatus
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ListingStockStatus.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                var properties = {};
                if (message.variationIds != null && message.hasOwnProperty("variationIds")) {
                    if (!Array.isArray(message.variationIds))
                        return "variationIds: array expected";
                    for (var i = 0; i < message.variationIds.length; ++i)
                        if (!$util.isInteger(message.variationIds[i]) && !(message.variationIds[i] && $util.isInteger(message.variationIds[i].low) && $util.isInteger(message.variationIds[i].high)))
                            return "variationIds: integer|Long[] expected";
                }
                if (message.inStock != null && message.hasOwnProperty("inStock")) {
                    properties.status = 1;
                    if (typeof message.inStock !== "boolean")
                        return "inStock: boolean expected";
                }
                if (message.expectedInStockBy != null && message.hasOwnProperty("expectedInStockBy")) {
                    if (properties.status === 1)
                        return "status: multiple values";
                    properties.status = 1;
                    {
                        var error = $root.google.protobuf.Timestamp.verify(message.expectedInStockBy);
                        if (error)
                            return "expectedInStockBy." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a ListingStockStatus message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof market.mass.ListingStockStatus
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {market.mass.ListingStockStatus} ListingStockStatus
             */
            ListingStockStatus.fromObject = function fromObject(object) {
                if (object instanceof $root.market.mass.ListingStockStatus)
                    return object;
                var message = new $root.market.mass.ListingStockStatus();
                if (object.variationIds) {
                    if (!Array.isArray(object.variationIds))
                        throw TypeError(".market.mass.ListingStockStatus.variationIds: array expected");
                    message.variationIds = [];
                    for (var i = 0; i < object.variationIds.length; ++i)
                        if ($util.Long)
                            (message.variationIds[i] = $util.Long.fromValue(object.variationIds[i])).unsigned = true;
                        else if (typeof object.variationIds[i] === "string")
                            message.variationIds[i] = parseInt(object.variationIds[i], 10);
                        else if (typeof object.variationIds[i] === "number")
                            message.variationIds[i] = object.variationIds[i];
                        else if (typeof object.variationIds[i] === "object")
                            message.variationIds[i] = new $util.LongBits(object.variationIds[i].low >>> 0, object.variationIds[i].high >>> 0).toNumber(true);
                }
                if (object.inStock != null)
                    message.inStock = Boolean(object.inStock);
                if (object.expectedInStockBy != null) {
                    if (typeof object.expectedInStockBy !== "object")
                        throw TypeError(".market.mass.ListingStockStatus.expectedInStockBy: object expected");
                    message.expectedInStockBy = $root.google.protobuf.Timestamp.fromObject(object.expectedInStockBy);
                }
                return message;
            };

            /**
             * Creates a plain object from a ListingStockStatus message. Also converts values to other types if specified.
             * @function toObject
             * @memberof market.mass.ListingStockStatus
             * @static
             * @param {market.mass.ListingStockStatus} message ListingStockStatus
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ListingStockStatus.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults)
                    object.variationIds = [];
                if (message.variationIds && message.variationIds.length) {
                    object.variationIds = [];
                    for (var j = 0; j < message.variationIds.length; ++j)
                        if (typeof message.variationIds[j] === "number")
                            object.variationIds[j] = options.longs === String ? String(message.variationIds[j]) : message.variationIds[j];
                        else
                            object.variationIds[j] = options.longs === String ? $util.Long.prototype.toString.call(message.variationIds[j]) : options.longs === Number ? new $util.LongBits(message.variationIds[j].low >>> 0, message.variationIds[j].high >>> 0).toNumber(true) : message.variationIds[j];
                }
                if (message.inStock != null && message.hasOwnProperty("inStock")) {
                    object.inStock = message.inStock;
                    if (options.oneofs)
                        object.status = "inStock";
                }
                if (message.expectedInStockBy != null && message.hasOwnProperty("expectedInStockBy")) {
                    object.expectedInStockBy = $root.google.protobuf.Timestamp.toObject(message.expectedInStockBy, options);
                    if (options.oneofs)
                        object.status = "expectedInStockBy";
                }
                return object;
            };

            /**
             * Converts this ListingStockStatus to JSON.
             * @function toJSON
             * @memberof market.mass.ListingStockStatus
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ListingStockStatus.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for ListingStockStatus
             * @function getTypeUrl
             * @memberof market.mass.ListingStockStatus
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            ListingStockStatus.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/market.mass.ListingStockStatus";
            };

            return ListingStockStatus;
        })();

        mass.AddressDetails = (function() {

            /**
             * Properties of an AddressDetails.
             * @memberof market.mass
             * @interface IAddressDetails
             * @property {string|null} [name] AddressDetails name
             * @property {string|null} [address1] AddressDetails address1
             * @property {string|null} [address2] AddressDetails address2
             * @property {string|null} [city] AddressDetails city
             * @property {string|null} [postalCode] AddressDetails postalCode
             * @property {string|null} [country] AddressDetails country
             * @property {string|null} [emailAddress] AddressDetails emailAddress
             * @property {string|null} [phoneNumber] AddressDetails phoneNumber
             */

            /**
             * Constructs a new AddressDetails.
             * @memberof market.mass
             * @classdesc Represents an AddressDetails.
             * @implements IAddressDetails
             * @constructor
             * @param {market.mass.IAddressDetails=} [properties] Properties to set
             */
            function AddressDetails(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * AddressDetails name.
             * @member {string} name
             * @memberof market.mass.AddressDetails
             * @instance
             */
            AddressDetails.prototype.name = "";

            /**
             * AddressDetails address1.
             * @member {string} address1
             * @memberof market.mass.AddressDetails
             * @instance
             */
            AddressDetails.prototype.address1 = "";

            /**
             * AddressDetails address2.
             * @member {string} address2
             * @memberof market.mass.AddressDetails
             * @instance
             */
            AddressDetails.prototype.address2 = "";

            /**
             * AddressDetails city.
             * @member {string} city
             * @memberof market.mass.AddressDetails
             * @instance
             */
            AddressDetails.prototype.city = "";

            /**
             * AddressDetails postalCode.
             * @member {string} postalCode
             * @memberof market.mass.AddressDetails
             * @instance
             */
            AddressDetails.prototype.postalCode = "";

            /**
             * AddressDetails country.
             * @member {string} country
             * @memberof market.mass.AddressDetails
             * @instance
             */
            AddressDetails.prototype.country = "";

            /**
             * AddressDetails emailAddress.
             * @member {string} emailAddress
             * @memberof market.mass.AddressDetails
             * @instance
             */
            AddressDetails.prototype.emailAddress = "";

            /**
             * AddressDetails phoneNumber.
             * @member {string|null|undefined} phoneNumber
             * @memberof market.mass.AddressDetails
             * @instance
             */
            AddressDetails.prototype.phoneNumber = null;

            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;

            /**
             * AddressDetails _phoneNumber.
             * @member {"phoneNumber"|undefined} _phoneNumber
             * @memberof market.mass.AddressDetails
             * @instance
             */
            Object.defineProperty(AddressDetails.prototype, "_phoneNumber", {
                get: $util.oneOfGetter($oneOfFields = ["phoneNumber"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new AddressDetails instance using the specified properties.
             * @function create
             * @memberof market.mass.AddressDetails
             * @static
             * @param {market.mass.IAddressDetails=} [properties] Properties to set
             * @returns {market.mass.AddressDetails} AddressDetails instance
             */
            AddressDetails.create = function create(properties) {
                return new AddressDetails(properties);
            };

            /**
             * Encodes the specified AddressDetails message. Does not implicitly {@link market.mass.AddressDetails.verify|verify} messages.
             * @function encode
             * @memberof market.mass.AddressDetails
             * @static
             * @param {market.mass.IAddressDetails} message AddressDetails message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            AddressDetails.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
                if (message.address1 != null && Object.hasOwnProperty.call(message, "address1"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.address1);
                if (message.address2 != null && Object.hasOwnProperty.call(message, "address2"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.address2);
                if (message.city != null && Object.hasOwnProperty.call(message, "city"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.city);
                if (message.postalCode != null && Object.hasOwnProperty.call(message, "postalCode"))
                    writer.uint32(/* id 5, wireType 2 =*/42).string(message.postalCode);
                if (message.country != null && Object.hasOwnProperty.call(message, "country"))
                    writer.uint32(/* id 6, wireType 2 =*/50).string(message.country);
                if (message.emailAddress != null && Object.hasOwnProperty.call(message, "emailAddress"))
                    writer.uint32(/* id 7, wireType 2 =*/58).string(message.emailAddress);
                if (message.phoneNumber != null && Object.hasOwnProperty.call(message, "phoneNumber"))
                    writer.uint32(/* id 8, wireType 2 =*/66).string(message.phoneNumber);
                return writer;
            };

            /**
             * Encodes the specified AddressDetails message, length delimited. Does not implicitly {@link market.mass.AddressDetails.verify|verify} messages.
             * @function encodeDelimited
             * @memberof market.mass.AddressDetails
             * @static
             * @param {market.mass.IAddressDetails} message AddressDetails message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            AddressDetails.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an AddressDetails message from the specified reader or buffer.
             * @function decode
             * @memberof market.mass.AddressDetails
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {market.mass.AddressDetails} AddressDetails
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AddressDetails.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.AddressDetails();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.name = reader.string();
                            break;
                        }
                    case 2: {
                            message.address1 = reader.string();
                            break;
                        }
                    case 3: {
                            message.address2 = reader.string();
                            break;
                        }
                    case 4: {
                            message.city = reader.string();
                            break;
                        }
                    case 5: {
                            message.postalCode = reader.string();
                            break;
                        }
                    case 6: {
                            message.country = reader.string();
                            break;
                        }
                    case 7: {
                            message.emailAddress = reader.string();
                            break;
                        }
                    case 8: {
                            message.phoneNumber = reader.string();
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
             * Decodes an AddressDetails message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof market.mass.AddressDetails
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {market.mass.AddressDetails} AddressDetails
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AddressDetails.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an AddressDetails message.
             * @function verify
             * @memberof market.mass.AddressDetails
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            AddressDetails.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                var properties = {};
                if (message.name != null && message.hasOwnProperty("name"))
                    if (!$util.isString(message.name))
                        return "name: string expected";
                if (message.address1 != null && message.hasOwnProperty("address1"))
                    if (!$util.isString(message.address1))
                        return "address1: string expected";
                if (message.address2 != null && message.hasOwnProperty("address2"))
                    if (!$util.isString(message.address2))
                        return "address2: string expected";
                if (message.city != null && message.hasOwnProperty("city"))
                    if (!$util.isString(message.city))
                        return "city: string expected";
                if (message.postalCode != null && message.hasOwnProperty("postalCode"))
                    if (!$util.isString(message.postalCode))
                        return "postalCode: string expected";
                if (message.country != null && message.hasOwnProperty("country"))
                    if (!$util.isString(message.country))
                        return "country: string expected";
                if (message.emailAddress != null && message.hasOwnProperty("emailAddress"))
                    if (!$util.isString(message.emailAddress))
                        return "emailAddress: string expected";
                if (message.phoneNumber != null && message.hasOwnProperty("phoneNumber")) {
                    properties._phoneNumber = 1;
                    if (!$util.isString(message.phoneNumber))
                        return "phoneNumber: string expected";
                }
                return null;
            };

            /**
             * Creates an AddressDetails message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof market.mass.AddressDetails
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {market.mass.AddressDetails} AddressDetails
             */
            AddressDetails.fromObject = function fromObject(object) {
                if (object instanceof $root.market.mass.AddressDetails)
                    return object;
                var message = new $root.market.mass.AddressDetails();
                if (object.name != null)
                    message.name = String(object.name);
                if (object.address1 != null)
                    message.address1 = String(object.address1);
                if (object.address2 != null)
                    message.address2 = String(object.address2);
                if (object.city != null)
                    message.city = String(object.city);
                if (object.postalCode != null)
                    message.postalCode = String(object.postalCode);
                if (object.country != null)
                    message.country = String(object.country);
                if (object.emailAddress != null)
                    message.emailAddress = String(object.emailAddress);
                if (object.phoneNumber != null)
                    message.phoneNumber = String(object.phoneNumber);
                return message;
            };

            /**
             * Creates a plain object from an AddressDetails message. Also converts values to other types if specified.
             * @function toObject
             * @memberof market.mass.AddressDetails
             * @static
             * @param {market.mass.AddressDetails} message AddressDetails
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            AddressDetails.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.name = "";
                    object.address1 = "";
                    object.address2 = "";
                    object.city = "";
                    object.postalCode = "";
                    object.country = "";
                    object.emailAddress = "";
                }
                if (message.name != null && message.hasOwnProperty("name"))
                    object.name = message.name;
                if (message.address1 != null && message.hasOwnProperty("address1"))
                    object.address1 = message.address1;
                if (message.address2 != null && message.hasOwnProperty("address2"))
                    object.address2 = message.address2;
                if (message.city != null && message.hasOwnProperty("city"))
                    object.city = message.city;
                if (message.postalCode != null && message.hasOwnProperty("postalCode"))
                    object.postalCode = message.postalCode;
                if (message.country != null && message.hasOwnProperty("country"))
                    object.country = message.country;
                if (message.emailAddress != null && message.hasOwnProperty("emailAddress"))
                    object.emailAddress = message.emailAddress;
                if (message.phoneNumber != null && message.hasOwnProperty("phoneNumber")) {
                    object.phoneNumber = message.phoneNumber;
                    if (options.oneofs)
                        object._phoneNumber = "phoneNumber";
                }
                return object;
            };

            /**
             * Converts this AddressDetails to JSON.
             * @function toJSON
             * @memberof market.mass.AddressDetails
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            AddressDetails.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for AddressDetails
             * @function getTypeUrl
             * @memberof market.mass.AddressDetails
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            AddressDetails.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/market.mass.AddressDetails";
            };

            return AddressDetails;
        })();

        mass.PaymentDetails = (function() {

            /**
             * Properties of a PaymentDetails.
             * @memberof market.mass
             * @interface IPaymentDetails
             * @property {market.mass.IHash|null} [paymentId] PaymentDetails paymentId
             * @property {market.mass.IUint256|null} [total] PaymentDetails total
             * @property {Array.<market.mass.IIPFSAddress>|null} [listingHashes] PaymentDetails listingHashes
             * @property {string|null} [ttl] PaymentDetails ttl
             * @property {market.mass.ISignature|null} [shopSignature] PaymentDetails shopSignature
             */

            /**
             * Constructs a new PaymentDetails.
             * @memberof market.mass
             * @classdesc Represents a PaymentDetails.
             * @implements IPaymentDetails
             * @constructor
             * @param {market.mass.IPaymentDetails=} [properties] Properties to set
             */
            function PaymentDetails(properties) {
                this.listingHashes = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * PaymentDetails paymentId.
             * @member {market.mass.IHash|null|undefined} paymentId
             * @memberof market.mass.PaymentDetails
             * @instance
             */
            PaymentDetails.prototype.paymentId = null;

            /**
             * PaymentDetails total.
             * @member {market.mass.IUint256|null|undefined} total
             * @memberof market.mass.PaymentDetails
             * @instance
             */
            PaymentDetails.prototype.total = null;

            /**
             * PaymentDetails listingHashes.
             * @member {Array.<market.mass.IIPFSAddress>} listingHashes
             * @memberof market.mass.PaymentDetails
             * @instance
             */
            PaymentDetails.prototype.listingHashes = $util.emptyArray;

            /**
             * PaymentDetails ttl.
             * @member {string} ttl
             * @memberof market.mass.PaymentDetails
             * @instance
             */
            PaymentDetails.prototype.ttl = "";

            /**
             * PaymentDetails shopSignature.
             * @member {market.mass.ISignature|null|undefined} shopSignature
             * @memberof market.mass.PaymentDetails
             * @instance
             */
            PaymentDetails.prototype.shopSignature = null;

            /**
             * Creates a new PaymentDetails instance using the specified properties.
             * @function create
             * @memberof market.mass.PaymentDetails
             * @static
             * @param {market.mass.IPaymentDetails=} [properties] Properties to set
             * @returns {market.mass.PaymentDetails} PaymentDetails instance
             */
            PaymentDetails.create = function create(properties) {
                return new PaymentDetails(properties);
            };

            /**
             * Encodes the specified PaymentDetails message. Does not implicitly {@link market.mass.PaymentDetails.verify|verify} messages.
             * @function encode
             * @memberof market.mass.PaymentDetails
             * @static
             * @param {market.mass.IPaymentDetails} message PaymentDetails message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PaymentDetails.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.paymentId != null && Object.hasOwnProperty.call(message, "paymentId"))
                    $root.market.mass.Hash.encode(message.paymentId, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                if (message.total != null && Object.hasOwnProperty.call(message, "total"))
                    $root.market.mass.Uint256.encode(message.total, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                if (message.listingHashes != null && message.listingHashes.length)
                    for (var i = 0; i < message.listingHashes.length; ++i)
                        $root.market.mass.IPFSAddress.encode(message.listingHashes[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                if (message.ttl != null && Object.hasOwnProperty.call(message, "ttl"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.ttl);
                if (message.shopSignature != null && Object.hasOwnProperty.call(message, "shopSignature"))
                    $root.market.mass.Signature.encode(message.shopSignature, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified PaymentDetails message, length delimited. Does not implicitly {@link market.mass.PaymentDetails.verify|verify} messages.
             * @function encodeDelimited
             * @memberof market.mass.PaymentDetails
             * @static
             * @param {market.mass.IPaymentDetails} message PaymentDetails message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PaymentDetails.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a PaymentDetails message from the specified reader or buffer.
             * @function decode
             * @memberof market.mass.PaymentDetails
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {market.mass.PaymentDetails} PaymentDetails
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PaymentDetails.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.PaymentDetails();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.paymentId = $root.market.mass.Hash.decode(reader, reader.uint32());
                            break;
                        }
                    case 2: {
                            message.total = $root.market.mass.Uint256.decode(reader, reader.uint32());
                            break;
                        }
                    case 3: {
                            if (!(message.listingHashes && message.listingHashes.length))
                                message.listingHashes = [];
                            message.listingHashes.push($root.market.mass.IPFSAddress.decode(reader, reader.uint32()));
                            break;
                        }
                    case 4: {
                            message.ttl = reader.string();
                            break;
                        }
                    case 5: {
                            message.shopSignature = $root.market.mass.Signature.decode(reader, reader.uint32());
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
             * Decodes a PaymentDetails message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof market.mass.PaymentDetails
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {market.mass.PaymentDetails} PaymentDetails
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PaymentDetails.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a PaymentDetails message.
             * @function verify
             * @memberof market.mass.PaymentDetails
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            PaymentDetails.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.paymentId != null && message.hasOwnProperty("paymentId")) {
                    var error = $root.market.mass.Hash.verify(message.paymentId);
                    if (error)
                        return "paymentId." + error;
                }
                if (message.total != null && message.hasOwnProperty("total")) {
                    var error = $root.market.mass.Uint256.verify(message.total);
                    if (error)
                        return "total." + error;
                }
                if (message.listingHashes != null && message.hasOwnProperty("listingHashes")) {
                    if (!Array.isArray(message.listingHashes))
                        return "listingHashes: array expected";
                    for (var i = 0; i < message.listingHashes.length; ++i) {
                        var error = $root.market.mass.IPFSAddress.verify(message.listingHashes[i]);
                        if (error)
                            return "listingHashes." + error;
                    }
                }
                if (message.ttl != null && message.hasOwnProperty("ttl"))
                    if (!$util.isString(message.ttl))
                        return "ttl: string expected";
                if (message.shopSignature != null && message.hasOwnProperty("shopSignature")) {
                    var error = $root.market.mass.Signature.verify(message.shopSignature);
                    if (error)
                        return "shopSignature." + error;
                }
                return null;
            };

            /**
             * Creates a PaymentDetails message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof market.mass.PaymentDetails
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {market.mass.PaymentDetails} PaymentDetails
             */
            PaymentDetails.fromObject = function fromObject(object) {
                if (object instanceof $root.market.mass.PaymentDetails)
                    return object;
                var message = new $root.market.mass.PaymentDetails();
                if (object.paymentId != null) {
                    if (typeof object.paymentId !== "object")
                        throw TypeError(".market.mass.PaymentDetails.paymentId: object expected");
                    message.paymentId = $root.market.mass.Hash.fromObject(object.paymentId);
                }
                if (object.total != null) {
                    if (typeof object.total !== "object")
                        throw TypeError(".market.mass.PaymentDetails.total: object expected");
                    message.total = $root.market.mass.Uint256.fromObject(object.total);
                }
                if (object.listingHashes) {
                    if (!Array.isArray(object.listingHashes))
                        throw TypeError(".market.mass.PaymentDetails.listingHashes: array expected");
                    message.listingHashes = [];
                    for (var i = 0; i < object.listingHashes.length; ++i) {
                        if (typeof object.listingHashes[i] !== "object")
                            throw TypeError(".market.mass.PaymentDetails.listingHashes: object expected");
                        message.listingHashes[i] = $root.market.mass.IPFSAddress.fromObject(object.listingHashes[i]);
                    }
                }
                if (object.ttl != null)
                    message.ttl = String(object.ttl);
                if (object.shopSignature != null) {
                    if (typeof object.shopSignature !== "object")
                        throw TypeError(".market.mass.PaymentDetails.shopSignature: object expected");
                    message.shopSignature = $root.market.mass.Signature.fromObject(object.shopSignature);
                }
                return message;
            };

            /**
             * Creates a plain object from a PaymentDetails message. Also converts values to other types if specified.
             * @function toObject
             * @memberof market.mass.PaymentDetails
             * @static
             * @param {market.mass.PaymentDetails} message PaymentDetails
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            PaymentDetails.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults)
                    object.listingHashes = [];
                if (options.defaults) {
                    object.paymentId = null;
                    object.total = null;
                    object.ttl = "";
                    object.shopSignature = null;
                }
                if (message.paymentId != null && message.hasOwnProperty("paymentId"))
                    object.paymentId = $root.market.mass.Hash.toObject(message.paymentId, options);
                if (message.total != null && message.hasOwnProperty("total"))
                    object.total = $root.market.mass.Uint256.toObject(message.total, options);
                if (message.listingHashes && message.listingHashes.length) {
                    object.listingHashes = [];
                    for (var j = 0; j < message.listingHashes.length; ++j)
                        object.listingHashes[j] = $root.market.mass.IPFSAddress.toObject(message.listingHashes[j], options);
                }
                if (message.ttl != null && message.hasOwnProperty("ttl"))
                    object.ttl = message.ttl;
                if (message.shopSignature != null && message.hasOwnProperty("shopSignature"))
                    object.shopSignature = $root.market.mass.Signature.toObject(message.shopSignature, options);
                return object;
            };

            /**
             * Converts this PaymentDetails to JSON.
             * @function toJSON
             * @memberof market.mass.PaymentDetails
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            PaymentDetails.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for PaymentDetails
             * @function getTypeUrl
             * @memberof market.mass.PaymentDetails
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            PaymentDetails.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/market.mass.PaymentDetails";
            };

            return PaymentDetails;
        })();

        mass.OrderPaid = (function() {

            /**
             * Properties of an OrderPaid.
             * @memberof market.mass
             * @interface IOrderPaid
             * @property {market.mass.IHash|null} [txHash] OrderPaid txHash
             * @property {market.mass.IHash|null} [blockHash] OrderPaid blockHash
             */

            /**
             * Constructs a new OrderPaid.
             * @memberof market.mass
             * @classdesc Represents an OrderPaid.
             * @implements IOrderPaid
             * @constructor
             * @param {market.mass.IOrderPaid=} [properties] Properties to set
             */
            function OrderPaid(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * OrderPaid txHash.
             * @member {market.mass.IHash|null|undefined} txHash
             * @memberof market.mass.OrderPaid
             * @instance
             */
            OrderPaid.prototype.txHash = null;

            /**
             * OrderPaid blockHash.
             * @member {market.mass.IHash|null|undefined} blockHash
             * @memberof market.mass.OrderPaid
             * @instance
             */
            OrderPaid.prototype.blockHash = null;

            /**
             * Creates a new OrderPaid instance using the specified properties.
             * @function create
             * @memberof market.mass.OrderPaid
             * @static
             * @param {market.mass.IOrderPaid=} [properties] Properties to set
             * @returns {market.mass.OrderPaid} OrderPaid instance
             */
            OrderPaid.create = function create(properties) {
                return new OrderPaid(properties);
            };

            /**
             * Encodes the specified OrderPaid message. Does not implicitly {@link market.mass.OrderPaid.verify|verify} messages.
             * @function encode
             * @memberof market.mass.OrderPaid
             * @static
             * @param {market.mass.IOrderPaid} message OrderPaid message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            OrderPaid.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.txHash != null && Object.hasOwnProperty.call(message, "txHash"))
                    $root.market.mass.Hash.encode(message.txHash, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                if (message.blockHash != null && Object.hasOwnProperty.call(message, "blockHash"))
                    $root.market.mass.Hash.encode(message.blockHash, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified OrderPaid message, length delimited. Does not implicitly {@link market.mass.OrderPaid.verify|verify} messages.
             * @function encodeDelimited
             * @memberof market.mass.OrderPaid
             * @static
             * @param {market.mass.IOrderPaid} message OrderPaid message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            OrderPaid.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an OrderPaid message from the specified reader or buffer.
             * @function decode
             * @memberof market.mass.OrderPaid
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {market.mass.OrderPaid} OrderPaid
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            OrderPaid.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.OrderPaid();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.txHash = $root.market.mass.Hash.decode(reader, reader.uint32());
                            break;
                        }
                    case 2: {
                            message.blockHash = $root.market.mass.Hash.decode(reader, reader.uint32());
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
             * Decodes an OrderPaid message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof market.mass.OrderPaid
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {market.mass.OrderPaid} OrderPaid
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            OrderPaid.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an OrderPaid message.
             * @function verify
             * @memberof market.mass.OrderPaid
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            OrderPaid.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.txHash != null && message.hasOwnProperty("txHash")) {
                    var error = $root.market.mass.Hash.verify(message.txHash);
                    if (error)
                        return "txHash." + error;
                }
                if (message.blockHash != null && message.hasOwnProperty("blockHash")) {
                    var error = $root.market.mass.Hash.verify(message.blockHash);
                    if (error)
                        return "blockHash." + error;
                }
                return null;
            };

            /**
             * Creates an OrderPaid message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof market.mass.OrderPaid
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {market.mass.OrderPaid} OrderPaid
             */
            OrderPaid.fromObject = function fromObject(object) {
                if (object instanceof $root.market.mass.OrderPaid)
                    return object;
                var message = new $root.market.mass.OrderPaid();
                if (object.txHash != null) {
                    if (typeof object.txHash !== "object")
                        throw TypeError(".market.mass.OrderPaid.txHash: object expected");
                    message.txHash = $root.market.mass.Hash.fromObject(object.txHash);
                }
                if (object.blockHash != null) {
                    if (typeof object.blockHash !== "object")
                        throw TypeError(".market.mass.OrderPaid.blockHash: object expected");
                    message.blockHash = $root.market.mass.Hash.fromObject(object.blockHash);
                }
                return message;
            };

            /**
             * Creates a plain object from an OrderPaid message. Also converts values to other types if specified.
             * @function toObject
             * @memberof market.mass.OrderPaid
             * @static
             * @param {market.mass.OrderPaid} message OrderPaid
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            OrderPaid.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.txHash = null;
                    object.blockHash = null;
                }
                if (message.txHash != null && message.hasOwnProperty("txHash"))
                    object.txHash = $root.market.mass.Hash.toObject(message.txHash, options);
                if (message.blockHash != null && message.hasOwnProperty("blockHash"))
                    object.blockHash = $root.market.mass.Hash.toObject(message.blockHash, options);
                return object;
            };

            /**
             * Converts this OrderPaid to JSON.
             * @function toJSON
             * @memberof market.mass.OrderPaid
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            OrderPaid.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for OrderPaid
             * @function getTypeUrl
             * @memberof market.mass.OrderPaid
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            OrderPaid.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/market.mass.OrderPaid";
            };

            return OrderPaid;
        })();

        mass.OrderedItem = (function() {

            /**
             * Properties of an OrderedItem.
             * @memberof market.mass
             * @interface IOrderedItem
             * @property {number|Long|null} [listingId] OrderedItem listingId
             * @property {Array.<number|Long>|null} [variationIds] OrderedItem variationIds
             * @property {number|null} [quantity] OrderedItem quantity
             */

            /**
             * Constructs a new OrderedItem.
             * @memberof market.mass
             * @classdesc Represents an OrderedItem.
             * @implements IOrderedItem
             * @constructor
             * @param {market.mass.IOrderedItem=} [properties] Properties to set
             */
            function OrderedItem(properties) {
                this.variationIds = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * OrderedItem listingId.
             * @member {number|Long} listingId
             * @memberof market.mass.OrderedItem
             * @instance
             */
            OrderedItem.prototype.listingId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * OrderedItem variationIds.
             * @member {Array.<number|Long>} variationIds
             * @memberof market.mass.OrderedItem
             * @instance
             */
            OrderedItem.prototype.variationIds = $util.emptyArray;

            /**
             * OrderedItem quantity.
             * @member {number} quantity
             * @memberof market.mass.OrderedItem
             * @instance
             */
            OrderedItem.prototype.quantity = 0;

            /**
             * Creates a new OrderedItem instance using the specified properties.
             * @function create
             * @memberof market.mass.OrderedItem
             * @static
             * @param {market.mass.IOrderedItem=} [properties] Properties to set
             * @returns {market.mass.OrderedItem} OrderedItem instance
             */
            OrderedItem.create = function create(properties) {
                return new OrderedItem(properties);
            };

            /**
             * Encodes the specified OrderedItem message. Does not implicitly {@link market.mass.OrderedItem.verify|verify} messages.
             * @function encode
             * @memberof market.mass.OrderedItem
             * @static
             * @param {market.mass.IOrderedItem} message OrderedItem message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            OrderedItem.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.listingId != null && Object.hasOwnProperty.call(message, "listingId"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.listingId);
                if (message.variationIds != null && message.variationIds.length) {
                    writer.uint32(/* id 2, wireType 2 =*/18).fork();
                    for (var i = 0; i < message.variationIds.length; ++i)
                        writer.uint64(message.variationIds[i]);
                    writer.ldelim();
                }
                if (message.quantity != null && Object.hasOwnProperty.call(message, "quantity"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.quantity);
                return writer;
            };

            /**
             * Encodes the specified OrderedItem message, length delimited. Does not implicitly {@link market.mass.OrderedItem.verify|verify} messages.
             * @function encodeDelimited
             * @memberof market.mass.OrderedItem
             * @static
             * @param {market.mass.IOrderedItem} message OrderedItem message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            OrderedItem.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an OrderedItem message from the specified reader or buffer.
             * @function decode
             * @memberof market.mass.OrderedItem
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {market.mass.OrderedItem} OrderedItem
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            OrderedItem.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.OrderedItem();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.listingId = reader.uint64();
                            break;
                        }
                    case 2: {
                            if (!(message.variationIds && message.variationIds.length))
                                message.variationIds = [];
                            if ((tag & 7) === 2) {
                                var end2 = reader.uint32() + reader.pos;
                                while (reader.pos < end2)
                                    message.variationIds.push(reader.uint64());
                            } else
                                message.variationIds.push(reader.uint64());
                            break;
                        }
                    case 3: {
                            message.quantity = reader.uint32();
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
             * Decodes an OrderedItem message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof market.mass.OrderedItem
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {market.mass.OrderedItem} OrderedItem
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            OrderedItem.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an OrderedItem message.
             * @function verify
             * @memberof market.mass.OrderedItem
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            OrderedItem.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.listingId != null && message.hasOwnProperty("listingId"))
                    if (!$util.isInteger(message.listingId) && !(message.listingId && $util.isInteger(message.listingId.low) && $util.isInteger(message.listingId.high)))
                        return "listingId: integer|Long expected";
                if (message.variationIds != null && message.hasOwnProperty("variationIds")) {
                    if (!Array.isArray(message.variationIds))
                        return "variationIds: array expected";
                    for (var i = 0; i < message.variationIds.length; ++i)
                        if (!$util.isInteger(message.variationIds[i]) && !(message.variationIds[i] && $util.isInteger(message.variationIds[i].low) && $util.isInteger(message.variationIds[i].high)))
                            return "variationIds: integer|Long[] expected";
                }
                if (message.quantity != null && message.hasOwnProperty("quantity"))
                    if (!$util.isInteger(message.quantity))
                        return "quantity: integer expected";
                return null;
            };

            /**
             * Creates an OrderedItem message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof market.mass.OrderedItem
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {market.mass.OrderedItem} OrderedItem
             */
            OrderedItem.fromObject = function fromObject(object) {
                if (object instanceof $root.market.mass.OrderedItem)
                    return object;
                var message = new $root.market.mass.OrderedItem();
                if (object.listingId != null)
                    if ($util.Long)
                        (message.listingId = $util.Long.fromValue(object.listingId)).unsigned = true;
                    else if (typeof object.listingId === "string")
                        message.listingId = parseInt(object.listingId, 10);
                    else if (typeof object.listingId === "number")
                        message.listingId = object.listingId;
                    else if (typeof object.listingId === "object")
                        message.listingId = new $util.LongBits(object.listingId.low >>> 0, object.listingId.high >>> 0).toNumber(true);
                if (object.variationIds) {
                    if (!Array.isArray(object.variationIds))
                        throw TypeError(".market.mass.OrderedItem.variationIds: array expected");
                    message.variationIds = [];
                    for (var i = 0; i < object.variationIds.length; ++i)
                        if ($util.Long)
                            (message.variationIds[i] = $util.Long.fromValue(object.variationIds[i])).unsigned = true;
                        else if (typeof object.variationIds[i] === "string")
                            message.variationIds[i] = parseInt(object.variationIds[i], 10);
                        else if (typeof object.variationIds[i] === "number")
                            message.variationIds[i] = object.variationIds[i];
                        else if (typeof object.variationIds[i] === "object")
                            message.variationIds[i] = new $util.LongBits(object.variationIds[i].low >>> 0, object.variationIds[i].high >>> 0).toNumber(true);
                }
                if (object.quantity != null)
                    message.quantity = object.quantity >>> 0;
                return message;
            };

            /**
             * Creates a plain object from an OrderedItem message. Also converts values to other types if specified.
             * @function toObject
             * @memberof market.mass.OrderedItem
             * @static
             * @param {market.mass.OrderedItem} message OrderedItem
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            OrderedItem.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults)
                    object.variationIds = [];
                if (options.defaults) {
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.listingId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.listingId = options.longs === String ? "0" : 0;
                    object.quantity = 0;
                }
                if (message.listingId != null && message.hasOwnProperty("listingId"))
                    if (typeof message.listingId === "number")
                        object.listingId = options.longs === String ? String(message.listingId) : message.listingId;
                    else
                        object.listingId = options.longs === String ? $util.Long.prototype.toString.call(message.listingId) : options.longs === Number ? new $util.LongBits(message.listingId.low >>> 0, message.listingId.high >>> 0).toNumber(true) : message.listingId;
                if (message.variationIds && message.variationIds.length) {
                    object.variationIds = [];
                    for (var j = 0; j < message.variationIds.length; ++j)
                        if (typeof message.variationIds[j] === "number")
                            object.variationIds[j] = options.longs === String ? String(message.variationIds[j]) : message.variationIds[j];
                        else
                            object.variationIds[j] = options.longs === String ? $util.Long.prototype.toString.call(message.variationIds[j]) : options.longs === Number ? new $util.LongBits(message.variationIds[j].low >>> 0, message.variationIds[j].high >>> 0).toNumber(true) : message.variationIds[j];
                }
                if (message.quantity != null && message.hasOwnProperty("quantity"))
                    object.quantity = message.quantity;
                return object;
            };

            /**
             * Converts this OrderedItem to JSON.
             * @function toJSON
             * @memberof market.mass.OrderedItem
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            OrderedItem.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for OrderedItem
             * @function getTypeUrl
             * @memberof market.mass.OrderedItem
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            OrderedItem.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/market.mass.OrderedItem";
            };

            return OrderedItem;
        })();

        mass.Envelope = (function() {

            /**
             * Properties of an Envelope.
             * @memberof market.mass
             * @interface IEnvelope
             * @property {market.mass.IRequestId|null} [requestId] Envelope requestId
             * @property {market.mass.Envelope.IGenericResponse|null} [response] Envelope response
             * @property {market.mass.IEventWriteRequest|null} [eventWriteRequest] Envelope eventWriteRequest
             * @property {market.mass.ISubscriptionRequest|null} [subscriptionRequest] Envelope subscriptionRequest
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
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
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
             * Envelope eventWriteRequest.
             * @member {market.mass.IEventWriteRequest|null|undefined} eventWriteRequest
             * @memberof market.mass.Envelope
             * @instance
             */
            Envelope.prototype.eventWriteRequest = null;

            /**
             * Envelope subscriptionRequest.
             * @member {market.mass.ISubscriptionRequest|null|undefined} subscriptionRequest
             * @memberof market.mass.Envelope
             * @instance
             */
            Envelope.prototype.subscriptionRequest = null;

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
            var $oneOfFields;

            /**
             * Envelope message.
             * @member {"response"|"eventWriteRequest"|"subscriptionRequest"|"subscriptionPushRequest"|"syncStatusRequest"|"pingRequest"|"getBlobUploadUrlRequest"|"authRequest"|"challengeSolutionRequest"|undefined} message
             * @memberof market.mass.Envelope
             * @instance
             */
            Object.defineProperty(Envelope.prototype, "message", {
                get: $util.oneOfGetter($oneOfFields = ["response", "eventWriteRequest", "subscriptionRequest", "subscriptionPushRequest", "syncStatusRequest", "pingRequest", "getBlobUploadUrlRequest", "authRequest", "challengeSolutionRequest"]),
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
                if (message.eventWriteRequest != null && Object.hasOwnProperty.call(message, "eventWriteRequest"))
                    $root.market.mass.EventWriteRequest.encode(message.eventWriteRequest, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                if (message.subscriptionRequest != null && Object.hasOwnProperty.call(message, "subscriptionRequest"))
                    $root.market.mass.SubscriptionRequest.encode(message.subscriptionRequest, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                if (message.subscriptionPushRequest != null && Object.hasOwnProperty.call(message, "subscriptionPushRequest"))
                    $root.market.mass.SubscriptionPushRequest.encode(message.subscriptionPushRequest, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
                if (message.syncStatusRequest != null && Object.hasOwnProperty.call(message, "syncStatusRequest"))
                    $root.market.mass.SyncStatusRequest.encode(message.syncStatusRequest, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
                if (message.pingRequest != null && Object.hasOwnProperty.call(message, "pingRequest"))
                    $root.market.mass.PingRequest.encode(message.pingRequest, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
                if (message.getBlobUploadUrlRequest != null && Object.hasOwnProperty.call(message, "getBlobUploadUrlRequest"))
                    $root.market.mass.GetBlobUploadURLRequest.encode(message.getBlobUploadUrlRequest, writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
                if (message.authRequest != null && Object.hasOwnProperty.call(message, "authRequest"))
                    $root.market.mass.AuthenticateRequest.encode(message.authRequest, writer.uint32(/* id 9, wireType 2 =*/74).fork()).ldelim();
                if (message.challengeSolutionRequest != null && Object.hasOwnProperty.call(message, "challengeSolutionRequest"))
                    $root.market.mass.ChallengeSolvedRequest.encode(message.challengeSolutionRequest, writer.uint32(/* id 10, wireType 2 =*/82).fork()).ldelim();
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
            Envelope.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.Envelope();
                while (reader.pos < end) {
                    var tag = reader.uint32();
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
                            message.eventWriteRequest = $root.market.mass.EventWriteRequest.decode(reader, reader.uint32());
                            break;
                        }
                    case 4: {
                            message.subscriptionRequest = $root.market.mass.SubscriptionRequest.decode(reader, reader.uint32());
                            break;
                        }
                    case 5: {
                            message.subscriptionPushRequest = $root.market.mass.SubscriptionPushRequest.decode(reader, reader.uint32());
                            break;
                        }
                    case 6: {
                            message.syncStatusRequest = $root.market.mass.SyncStatusRequest.decode(reader, reader.uint32());
                            break;
                        }
                    case 7: {
                            message.pingRequest = $root.market.mass.PingRequest.decode(reader, reader.uint32());
                            break;
                        }
                    case 8: {
                            message.getBlobUploadUrlRequest = $root.market.mass.GetBlobUploadURLRequest.decode(reader, reader.uint32());
                            break;
                        }
                    case 9: {
                            message.authRequest = $root.market.mass.AuthenticateRequest.decode(reader, reader.uint32());
                            break;
                        }
                    case 10: {
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
                var properties = {};
                if (message.requestId != null && message.hasOwnProperty("requestId")) {
                    var error = $root.market.mass.RequestId.verify(message.requestId);
                    if (error)
                        return "requestId." + error;
                }
                if (message.response != null && message.hasOwnProperty("response")) {
                    properties.message = 1;
                    {
                        var error = $root.market.mass.Envelope.GenericResponse.verify(message.response);
                        if (error)
                            return "response." + error;
                    }
                }
                if (message.eventWriteRequest != null && message.hasOwnProperty("eventWriteRequest")) {
                    if (properties.message === 1)
                        return "message: multiple values";
                    properties.message = 1;
                    {
                        var error = $root.market.mass.EventWriteRequest.verify(message.eventWriteRequest);
                        if (error)
                            return "eventWriteRequest." + error;
                    }
                }
                if (message.subscriptionRequest != null && message.hasOwnProperty("subscriptionRequest")) {
                    if (properties.message === 1)
                        return "message: multiple values";
                    properties.message = 1;
                    {
                        var error = $root.market.mass.SubscriptionRequest.verify(message.subscriptionRequest);
                        if (error)
                            return "subscriptionRequest." + error;
                    }
                }
                if (message.subscriptionPushRequest != null && message.hasOwnProperty("subscriptionPushRequest")) {
                    if (properties.message === 1)
                        return "message: multiple values";
                    properties.message = 1;
                    {
                        var error = $root.market.mass.SubscriptionPushRequest.verify(message.subscriptionPushRequest);
                        if (error)
                            return "subscriptionPushRequest." + error;
                    }
                }
                if (message.syncStatusRequest != null && message.hasOwnProperty("syncStatusRequest")) {
                    if (properties.message === 1)
                        return "message: multiple values";
                    properties.message = 1;
                    {
                        var error = $root.market.mass.SyncStatusRequest.verify(message.syncStatusRequest);
                        if (error)
                            return "syncStatusRequest." + error;
                    }
                }
                if (message.pingRequest != null && message.hasOwnProperty("pingRequest")) {
                    if (properties.message === 1)
                        return "message: multiple values";
                    properties.message = 1;
                    {
                        var error = $root.market.mass.PingRequest.verify(message.pingRequest);
                        if (error)
                            return "pingRequest." + error;
                    }
                }
                if (message.getBlobUploadUrlRequest != null && message.hasOwnProperty("getBlobUploadUrlRequest")) {
                    if (properties.message === 1)
                        return "message: multiple values";
                    properties.message = 1;
                    {
                        var error = $root.market.mass.GetBlobUploadURLRequest.verify(message.getBlobUploadUrlRequest);
                        if (error)
                            return "getBlobUploadUrlRequest." + error;
                    }
                }
                if (message.authRequest != null && message.hasOwnProperty("authRequest")) {
                    if (properties.message === 1)
                        return "message: multiple values";
                    properties.message = 1;
                    {
                        var error = $root.market.mass.AuthenticateRequest.verify(message.authRequest);
                        if (error)
                            return "authRequest." + error;
                    }
                }
                if (message.challengeSolutionRequest != null && message.hasOwnProperty("challengeSolutionRequest")) {
                    if (properties.message === 1)
                        return "message: multiple values";
                    properties.message = 1;
                    {
                        var error = $root.market.mass.ChallengeSolvedRequest.verify(message.challengeSolutionRequest);
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
                var message = new $root.market.mass.Envelope();
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
                if (object.eventWriteRequest != null) {
                    if (typeof object.eventWriteRequest !== "object")
                        throw TypeError(".market.mass.Envelope.eventWriteRequest: object expected");
                    message.eventWriteRequest = $root.market.mass.EventWriteRequest.fromObject(object.eventWriteRequest);
                }
                if (object.subscriptionRequest != null) {
                    if (typeof object.subscriptionRequest !== "object")
                        throw TypeError(".market.mass.Envelope.subscriptionRequest: object expected");
                    message.subscriptionRequest = $root.market.mass.SubscriptionRequest.fromObject(object.subscriptionRequest);
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
                var object = {};
                if (options.defaults)
                    object.requestId = null;
                if (message.requestId != null && message.hasOwnProperty("requestId"))
                    object.requestId = $root.market.mass.RequestId.toObject(message.requestId, options);
                if (message.response != null && message.hasOwnProperty("response")) {
                    object.response = $root.market.mass.Envelope.GenericResponse.toObject(message.response, options);
                    if (options.oneofs)
                        object.message = "response";
                }
                if (message.eventWriteRequest != null && message.hasOwnProperty("eventWriteRequest")) {
                    object.eventWriteRequest = $root.market.mass.EventWriteRequest.toObject(message.eventWriteRequest, options);
                    if (options.oneofs)
                        object.message = "eventWriteRequest";
                }
                if (message.subscriptionRequest != null && message.hasOwnProperty("subscriptionRequest")) {
                    object.subscriptionRequest = $root.market.mass.SubscriptionRequest.toObject(message.subscriptionRequest, options);
                    if (options.oneofs)
                        object.message = "subscriptionRequest";
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
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
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
                var $oneOfFields;

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
                GenericResponse.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.Envelope.GenericResponse();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
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
                    var properties = {};
                    if (message.error != null && message.hasOwnProperty("error")) {
                        properties.response = 1;
                        {
                            var error = $root.market.mass.Error.verify(message.error);
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
                    var message = new $root.market.mass.Envelope.GenericResponse();
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
                    var object = {};
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
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
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
            Error.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.Error();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.code = reader.int32();
                            break;
                        }
                    case 2: {
                            message.message = reader.string();
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
                var message = new $root.market.mass.Error();
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
                case "ERROR_CODES_MINUMUM_VERSION_NOT_REACHED":
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
                var object = {};
                if (options.defaults) {
                    object.code = options.enums === String ? "ERROR_CODES_UNSPECIFIED" : 0;
                    object.message = "";
                }
                if (message.code != null && message.hasOwnProperty("code"))
                    object.code = options.enums === String ? $root.market.mass.ErrorCodes[message.code] === undefined ? message.code : $root.market.mass.ErrorCodes[message.code] : message.code;
                if (message.message != null && message.hasOwnProperty("message"))
                    object.message = message.message;
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
         * @property {number} ERROR_CODES_MINUMUM_VERSION_NOT_REACHED=8 ERROR_CODES_MINUMUM_VERSION_NOT_REACHED value
         * @property {number} ERROR_CODES_OUT_OF_STOCK=9 ERROR_CODES_OUT_OF_STOCK value
         * @property {number} ERROR_CODES_SIMULATED=10 ERROR_CODES_SIMULATED value
         * @property {number} ERROR_CODES_CLOSE_SUBSCRIPTION=11 ERROR_CODES_CLOSE_SUBSCRIPTION value
         */
        mass.ErrorCodes = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "ERROR_CODES_UNSPECIFIED"] = 0;
            values[valuesById[1] = "ERROR_CODES_NOT_FOUND"] = 1;
            values[valuesById[2] = "ERROR_CODES_INVALID"] = 2;
            values[valuesById[3] = "ERROR_CODES_NOT_AUTHENTICATED"] = 3;
            values[valuesById[4] = "ERROR_CODES_ALREADY_AUTHENTICATED"] = 4;
            values[valuesById[5] = "ERROR_CODES_ALREADY_CONNECTED"] = 5;
            values[valuesById[6] = "ERROR_CODES_TOO_MANY_CONCURRENT_REQUESTS"] = 6;
            values[valuesById[7] = "ERROR_CODES_UNLINKED_KEYCARD"] = 7;
            values[valuesById[8] = "ERROR_CODES_MINUMUM_VERSION_NOT_REACHED"] = 8;
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
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
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
            GetBlobUploadURLRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.GetBlobUploadURLRequest();
                while (reader.pos < end) {
                    var tag = reader.uint32();
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

        mass.GetBlobUploadURLResponse = (function() {

            /**
             * Properties of a GetBlobUploadURLResponse.
             * @memberof market.mass
             * @interface IGetBlobUploadURLResponse
             * @property {market.mass.IError|null} [error] GetBlobUploadURLResponse error
             * @property {string|null} [url] GetBlobUploadURLResponse url
             */

            /**
             * Constructs a new GetBlobUploadURLResponse.
             * @memberof market.mass
             * @classdesc Represents a GetBlobUploadURLResponse.
             * @implements IGetBlobUploadURLResponse
             * @constructor
             * @param {market.mass.IGetBlobUploadURLResponse=} [properties] Properties to set
             */
            function GetBlobUploadURLResponse(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetBlobUploadURLResponse error.
             * @member {market.mass.IError|null|undefined} error
             * @memberof market.mass.GetBlobUploadURLResponse
             * @instance
             */
            GetBlobUploadURLResponse.prototype.error = null;

            /**
             * GetBlobUploadURLResponse url.
             * @member {string|null|undefined} url
             * @memberof market.mass.GetBlobUploadURLResponse
             * @instance
             */
            GetBlobUploadURLResponse.prototype.url = null;

            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;

            /**
             * GetBlobUploadURLResponse result.
             * @member {"error"|"url"|undefined} result
             * @memberof market.mass.GetBlobUploadURLResponse
             * @instance
             */
            Object.defineProperty(GetBlobUploadURLResponse.prototype, "result", {
                get: $util.oneOfGetter($oneOfFields = ["error", "url"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new GetBlobUploadURLResponse instance using the specified properties.
             * @function create
             * @memberof market.mass.GetBlobUploadURLResponse
             * @static
             * @param {market.mass.IGetBlobUploadURLResponse=} [properties] Properties to set
             * @returns {market.mass.GetBlobUploadURLResponse} GetBlobUploadURLResponse instance
             */
            GetBlobUploadURLResponse.create = function create(properties) {
                return new GetBlobUploadURLResponse(properties);
            };

            /**
             * Encodes the specified GetBlobUploadURLResponse message. Does not implicitly {@link market.mass.GetBlobUploadURLResponse.verify|verify} messages.
             * @function encode
             * @memberof market.mass.GetBlobUploadURLResponse
             * @static
             * @param {market.mass.IGetBlobUploadURLResponse} message GetBlobUploadURLResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetBlobUploadURLResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.error != null && Object.hasOwnProperty.call(message, "error"))
                    $root.market.mass.Error.encode(message.error, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                if (message.url != null && Object.hasOwnProperty.call(message, "url"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.url);
                return writer;
            };

            /**
             * Encodes the specified GetBlobUploadURLResponse message, length delimited. Does not implicitly {@link market.mass.GetBlobUploadURLResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof market.mass.GetBlobUploadURLResponse
             * @static
             * @param {market.mass.IGetBlobUploadURLResponse} message GetBlobUploadURLResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetBlobUploadURLResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetBlobUploadURLResponse message from the specified reader or buffer.
             * @function decode
             * @memberof market.mass.GetBlobUploadURLResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {market.mass.GetBlobUploadURLResponse} GetBlobUploadURLResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetBlobUploadURLResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.GetBlobUploadURLResponse();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 2: {
                            message.error = $root.market.mass.Error.decode(reader, reader.uint32());
                            break;
                        }
                    case 3: {
                            message.url = reader.string();
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
             * Decodes a GetBlobUploadURLResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof market.mass.GetBlobUploadURLResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {market.mass.GetBlobUploadURLResponse} GetBlobUploadURLResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetBlobUploadURLResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetBlobUploadURLResponse message.
             * @function verify
             * @memberof market.mass.GetBlobUploadURLResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetBlobUploadURLResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                var properties = {};
                if (message.error != null && message.hasOwnProperty("error")) {
                    properties.result = 1;
                    {
                        var error = $root.market.mass.Error.verify(message.error);
                        if (error)
                            return "error." + error;
                    }
                }
                if (message.url != null && message.hasOwnProperty("url")) {
                    if (properties.result === 1)
                        return "result: multiple values";
                    properties.result = 1;
                    if (!$util.isString(message.url))
                        return "url: string expected";
                }
                return null;
            };

            /**
             * Creates a GetBlobUploadURLResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof market.mass.GetBlobUploadURLResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {market.mass.GetBlobUploadURLResponse} GetBlobUploadURLResponse
             */
            GetBlobUploadURLResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.market.mass.GetBlobUploadURLResponse)
                    return object;
                var message = new $root.market.mass.GetBlobUploadURLResponse();
                if (object.error != null) {
                    if (typeof object.error !== "object")
                        throw TypeError(".market.mass.GetBlobUploadURLResponse.error: object expected");
                    message.error = $root.market.mass.Error.fromObject(object.error);
                }
                if (object.url != null)
                    message.url = String(object.url);
                return message;
            };

            /**
             * Creates a plain object from a GetBlobUploadURLResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof market.mass.GetBlobUploadURLResponse
             * @static
             * @param {market.mass.GetBlobUploadURLResponse} message GetBlobUploadURLResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetBlobUploadURLResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (message.error != null && message.hasOwnProperty("error")) {
                    object.error = $root.market.mass.Error.toObject(message.error, options);
                    if (options.oneofs)
                        object.result = "error";
                }
                if (message.url != null && message.hasOwnProperty("url")) {
                    object.url = message.url;
                    if (options.oneofs)
                        object.result = "url";
                }
                return object;
            };

            /**
             * Converts this GetBlobUploadURLResponse to JSON.
             * @function toJSON
             * @memberof market.mass.GetBlobUploadURLResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetBlobUploadURLResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetBlobUploadURLResponse
             * @function getTypeUrl
             * @memberof market.mass.GetBlobUploadURLResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetBlobUploadURLResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/market.mass.GetBlobUploadURLResponse";
            };

            return GetBlobUploadURLResponse;
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
            var valuesById = {}, values = Object.create(valuesById);
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
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
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
                    for (var i = 0; i < message.filters.length; ++i)
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
            SubscriptionRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.SubscriptionRequest();
                while (reader.pos < end) {
                    var tag = reader.uint32();
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
                    var error = $root.market.mass.Uint256.verify(message.shopId);
                    if (error)
                        return "shopId." + error;
                }
                if (message.filters != null && message.hasOwnProperty("filters")) {
                    if (!Array.isArray(message.filters))
                        return "filters: array expected";
                    for (var i = 0; i < message.filters.length; ++i) {
                        var error = $root.market.mass.SubscriptionRequest.Filter.verify(message.filters[i]);
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
                var message = new $root.market.mass.SubscriptionRequest();
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
                    for (var i = 0; i < object.filters.length; ++i) {
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
                var object = {};
                if (options.arrays || options.defaults)
                    object.filters = [];
                if (options.defaults) {
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
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
                    for (var j = 0; j < message.filters.length; ++j)
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
                 * @property {Uint8Array|null} [objectId] Filter objectId
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
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
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
                 * @member {Uint8Array|null|undefined} objectId
                 * @memberof market.mass.SubscriptionRequest.Filter
                 * @instance
                 */
                Filter.prototype.objectId = null;

                // OneOf field names bound to virtual getters and setters
                var $oneOfFields;

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
                        writer.uint32(/* id 4, wireType 2 =*/34).bytes(message.objectId);
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
                Filter.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.SubscriptionRequest.Filter();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 3: {
                                message.objectType = reader.int32();
                                break;
                            }
                        case 4: {
                                message.objectId = reader.bytes();
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
                    var properties = {};
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
                        if (!(message.objectId && typeof message.objectId.length === "number" || $util.isString(message.objectId)))
                            return "objectId: buffer expected";
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
                    var message = new $root.market.mass.SubscriptionRequest.Filter();
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
                    if (object.objectId != null)
                        if (typeof object.objectId === "string")
                            $util.base64.decode(object.objectId, message.objectId = $util.newBuffer($util.base64.length(object.objectId)), 0);
                        else if (object.objectId.length >= 0)
                            message.objectId = object.objectId;
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
                    var object = {};
                    if (options.defaults)
                        object.objectType = options.enums === String ? "OBJECT_TYPE_UNSPECIFIED" : 0;
                    if (message.objectType != null && message.hasOwnProperty("objectType"))
                        object.objectType = options.enums === String ? $root.market.mass.ObjectType[message.objectType] === undefined ? message.objectType : $root.market.mass.ObjectType[message.objectType] : message.objectType;
                    if (message.objectId != null && message.hasOwnProperty("objectId")) {
                        object.objectId = options.bytes === String ? $util.base64.encode(message.objectId, 0, message.objectId.length) : options.bytes === Array ? Array.prototype.slice.call(message.objectId) : message.objectId;
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
             * @property {Array.<market.mass.ISignedEvent>|null} [events] SubscriptionPushRequest events
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
                this.events = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * SubscriptionPushRequest events.
             * @member {Array.<market.mass.ISignedEvent>} events
             * @memberof market.mass.SubscriptionPushRequest
             * @instance
             */
            SubscriptionPushRequest.prototype.events = $util.emptyArray;

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
                if (message.events != null && message.events.length)
                    for (var i = 0; i < message.events.length; ++i)
                        $root.market.mass.SignedEvent.encode(message.events[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
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
            SubscriptionPushRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.SubscriptionPushRequest();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            if (!(message.events && message.events.length))
                                message.events = [];
                            message.events.push($root.market.mass.SignedEvent.decode(reader, reader.uint32()));
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
                if (message.events != null && message.hasOwnProperty("events")) {
                    if (!Array.isArray(message.events))
                        return "events: array expected";
                    for (var i = 0; i < message.events.length; ++i) {
                        var error = $root.market.mass.SignedEvent.verify(message.events[i]);
                        if (error)
                            return "events." + error;
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
                var message = new $root.market.mass.SubscriptionPushRequest();
                if (object.events) {
                    if (!Array.isArray(object.events))
                        throw TypeError(".market.mass.SubscriptionPushRequest.events: array expected");
                    message.events = [];
                    for (var i = 0; i < object.events.length; ++i) {
                        if (typeof object.events[i] !== "object")
                            throw TypeError(".market.mass.SubscriptionPushRequest.events: object expected");
                        message.events[i] = $root.market.mass.SignedEvent.fromObject(object.events[i]);
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
                var object = {};
                if (options.arrays || options.defaults)
                    object.events = [];
                if (message.events && message.events.length) {
                    object.events = [];
                    for (var j = 0; j < message.events.length; ++j)
                        object.events[j] = $root.market.mass.SignedEvent.toObject(message.events[j], options);
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

            return SubscriptionPushRequest;
        })();

        mass.SignedEvent = (function() {

            /**
             * Properties of a SignedEvent.
             * @memberof market.mass
             * @interface ISignedEvent
             * @property {google.protobuf.IAny|null} [event] SignedEvent event
             * @property {market.mass.ISignature|null} [signature] SignedEvent signature
             */

            /**
             * Constructs a new SignedEvent.
             * @memberof market.mass
             * @classdesc Represents a SignedEvent.
             * @implements ISignedEvent
             * @constructor
             * @param {market.mass.ISignedEvent=} [properties] Properties to set
             */
            function SignedEvent(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * SignedEvent event.
             * @member {google.protobuf.IAny|null|undefined} event
             * @memberof market.mass.SignedEvent
             * @instance
             */
            SignedEvent.prototype.event = null;

            /**
             * SignedEvent signature.
             * @member {market.mass.ISignature|null|undefined} signature
             * @memberof market.mass.SignedEvent
             * @instance
             */
            SignedEvent.prototype.signature = null;

            /**
             * Creates a new SignedEvent instance using the specified properties.
             * @function create
             * @memberof market.mass.SignedEvent
             * @static
             * @param {market.mass.ISignedEvent=} [properties] Properties to set
             * @returns {market.mass.SignedEvent} SignedEvent instance
             */
            SignedEvent.create = function create(properties) {
                return new SignedEvent(properties);
            };

            /**
             * Encodes the specified SignedEvent message. Does not implicitly {@link market.mass.SignedEvent.verify|verify} messages.
             * @function encode
             * @memberof market.mass.SignedEvent
             * @static
             * @param {market.mass.ISignedEvent} message SignedEvent message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SignedEvent.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.event != null && Object.hasOwnProperty.call(message, "event"))
                    $root.google.protobuf.Any.encode(message.event, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                if (message.signature != null && Object.hasOwnProperty.call(message, "signature"))
                    $root.market.mass.Signature.encode(message.signature, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified SignedEvent message, length delimited. Does not implicitly {@link market.mass.SignedEvent.verify|verify} messages.
             * @function encodeDelimited
             * @memberof market.mass.SignedEvent
             * @static
             * @param {market.mass.ISignedEvent} message SignedEvent message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SignedEvent.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a SignedEvent message from the specified reader or buffer.
             * @function decode
             * @memberof market.mass.SignedEvent
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {market.mass.SignedEvent} SignedEvent
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SignedEvent.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.SignedEvent();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.event = $root.google.protobuf.Any.decode(reader, reader.uint32());
                            break;
                        }
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
             * Decodes a SignedEvent message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof market.mass.SignedEvent
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {market.mass.SignedEvent} SignedEvent
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SignedEvent.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a SignedEvent message.
             * @function verify
             * @memberof market.mass.SignedEvent
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SignedEvent.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.event != null && message.hasOwnProperty("event")) {
                    var error = $root.google.protobuf.Any.verify(message.event);
                    if (error)
                        return "event." + error;
                }
                if (message.signature != null && message.hasOwnProperty("signature")) {
                    var error = $root.market.mass.Signature.verify(message.signature);
                    if (error)
                        return "signature." + error;
                }
                return null;
            };

            /**
             * Creates a SignedEvent message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof market.mass.SignedEvent
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {market.mass.SignedEvent} SignedEvent
             */
            SignedEvent.fromObject = function fromObject(object) {
                if (object instanceof $root.market.mass.SignedEvent)
                    return object;
                var message = new $root.market.mass.SignedEvent();
                if (object.event != null) {
                    if (typeof object.event !== "object")
                        throw TypeError(".market.mass.SignedEvent.event: object expected");
                    message.event = $root.google.protobuf.Any.fromObject(object.event);
                }
                if (object.signature != null) {
                    if (typeof object.signature !== "object")
                        throw TypeError(".market.mass.SignedEvent.signature: object expected");
                    message.signature = $root.market.mass.Signature.fromObject(object.signature);
                }
                return message;
            };

            /**
             * Creates a plain object from a SignedEvent message. Also converts values to other types if specified.
             * @function toObject
             * @memberof market.mass.SignedEvent
             * @static
             * @param {market.mass.SignedEvent} message SignedEvent
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SignedEvent.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.event = null;
                    object.signature = null;
                }
                if (message.event != null && message.hasOwnProperty("event"))
                    object.event = $root.google.protobuf.Any.toObject(message.event, options);
                if (message.signature != null && message.hasOwnProperty("signature"))
                    object.signature = $root.market.mass.Signature.toObject(message.signature, options);
                return object;
            };

            /**
             * Converts this SignedEvent to JSON.
             * @function toJSON
             * @memberof market.mass.SignedEvent
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SignedEvent.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for SignedEvent
             * @function getTypeUrl
             * @memberof market.mass.SignedEvent
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            SignedEvent.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/market.mass.SignedEvent";
            };

            return SignedEvent;
        })();

        mass.EventWriteRequest = (function() {

            /**
             * Properties of an EventWriteRequest.
             * @memberof market.mass
             * @interface IEventWriteRequest
             * @property {Array.<market.mass.ISignedEvent>|null} [events] EventWriteRequest events
             */

            /**
             * Constructs a new EventWriteRequest.
             * @memberof market.mass
             * @classdesc Represents an EventWriteRequest.
             * @implements IEventWriteRequest
             * @constructor
             * @param {market.mass.IEventWriteRequest=} [properties] Properties to set
             */
            function EventWriteRequest(properties) {
                this.events = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * EventWriteRequest events.
             * @member {Array.<market.mass.ISignedEvent>} events
             * @memberof market.mass.EventWriteRequest
             * @instance
             */
            EventWriteRequest.prototype.events = $util.emptyArray;

            /**
             * Creates a new EventWriteRequest instance using the specified properties.
             * @function create
             * @memberof market.mass.EventWriteRequest
             * @static
             * @param {market.mass.IEventWriteRequest=} [properties] Properties to set
             * @returns {market.mass.EventWriteRequest} EventWriteRequest instance
             */
            EventWriteRequest.create = function create(properties) {
                return new EventWriteRequest(properties);
            };

            /**
             * Encodes the specified EventWriteRequest message. Does not implicitly {@link market.mass.EventWriteRequest.verify|verify} messages.
             * @function encode
             * @memberof market.mass.EventWriteRequest
             * @static
             * @param {market.mass.IEventWriteRequest} message EventWriteRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            EventWriteRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.events != null && message.events.length)
                    for (var i = 0; i < message.events.length; ++i)
                        $root.market.mass.SignedEvent.encode(message.events[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified EventWriteRequest message, length delimited. Does not implicitly {@link market.mass.EventWriteRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof market.mass.EventWriteRequest
             * @static
             * @param {market.mass.IEventWriteRequest} message EventWriteRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            EventWriteRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an EventWriteRequest message from the specified reader or buffer.
             * @function decode
             * @memberof market.mass.EventWriteRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {market.mass.EventWriteRequest} EventWriteRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            EventWriteRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.EventWriteRequest();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            if (!(message.events && message.events.length))
                                message.events = [];
                            message.events.push($root.market.mass.SignedEvent.decode(reader, reader.uint32()));
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
             * Decodes an EventWriteRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof market.mass.EventWriteRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {market.mass.EventWriteRequest} EventWriteRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            EventWriteRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an EventWriteRequest message.
             * @function verify
             * @memberof market.mass.EventWriteRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            EventWriteRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.events != null && message.hasOwnProperty("events")) {
                    if (!Array.isArray(message.events))
                        return "events: array expected";
                    for (var i = 0; i < message.events.length; ++i) {
                        var error = $root.market.mass.SignedEvent.verify(message.events[i]);
                        if (error)
                            return "events." + error;
                    }
                }
                return null;
            };

            /**
             * Creates an EventWriteRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof market.mass.EventWriteRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {market.mass.EventWriteRequest} EventWriteRequest
             */
            EventWriteRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.market.mass.EventWriteRequest)
                    return object;
                var message = new $root.market.mass.EventWriteRequest();
                if (object.events) {
                    if (!Array.isArray(object.events))
                        throw TypeError(".market.mass.EventWriteRequest.events: array expected");
                    message.events = [];
                    for (var i = 0; i < object.events.length; ++i) {
                        if (typeof object.events[i] !== "object")
                            throw TypeError(".market.mass.EventWriteRequest.events: object expected");
                        message.events[i] = $root.market.mass.SignedEvent.fromObject(object.events[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from an EventWriteRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof market.mass.EventWriteRequest
             * @static
             * @param {market.mass.EventWriteRequest} message EventWriteRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            EventWriteRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults)
                    object.events = [];
                if (message.events && message.events.length) {
                    object.events = [];
                    for (var j = 0; j < message.events.length; ++j)
                        object.events[j] = $root.market.mass.SignedEvent.toObject(message.events[j], options);
                }
                return object;
            };

            /**
             * Converts this EventWriteRequest to JSON.
             * @function toJSON
             * @memberof market.mass.EventWriteRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            EventWriteRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for EventWriteRequest
             * @function getTypeUrl
             * @memberof market.mass.EventWriteRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            EventWriteRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/market.mass.EventWriteRequest";
            };

            return EventWriteRequest;
        })();

        mass.SyncStatusRequest = (function() {

            /**
             * Properties of a SyncStatusRequest.
             * @memberof market.mass
             * @interface ISyncStatusRequest
             * @property {number|Long|null} [unpushedEvents] SyncStatusRequest unpushedEvents
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
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * SyncStatusRequest unpushedEvents.
             * @member {number|Long} unpushedEvents
             * @memberof market.mass.SyncStatusRequest
             * @instance
             */
            SyncStatusRequest.prototype.unpushedEvents = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

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
                if (message.unpushedEvents != null && Object.hasOwnProperty.call(message, "unpushedEvents"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.unpushedEvents);
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
            SyncStatusRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.SyncStatusRequest();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.unpushedEvents = reader.uint64();
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
                if (message.unpushedEvents != null && message.hasOwnProperty("unpushedEvents"))
                    if (!$util.isInteger(message.unpushedEvents) && !(message.unpushedEvents && $util.isInteger(message.unpushedEvents.low) && $util.isInteger(message.unpushedEvents.high)))
                        return "unpushedEvents: integer|Long expected";
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
                var message = new $root.market.mass.SyncStatusRequest();
                if (object.unpushedEvents != null)
                    if ($util.Long)
                        (message.unpushedEvents = $util.Long.fromValue(object.unpushedEvents)).unsigned = true;
                    else if (typeof object.unpushedEvents === "string")
                        message.unpushedEvents = parseInt(object.unpushedEvents, 10);
                    else if (typeof object.unpushedEvents === "number")
                        message.unpushedEvents = object.unpushedEvents;
                    else if (typeof object.unpushedEvents === "object")
                        message.unpushedEvents = new $util.LongBits(object.unpushedEvents.low >>> 0, object.unpushedEvents.high >>> 0).toNumber(true);
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
                var object = {};
                if (options.defaults)
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.unpushedEvents = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.unpushedEvents = options.longs === String ? "0" : 0;
                if (message.unpushedEvents != null && message.hasOwnProperty("unpushedEvents"))
                    if (typeof message.unpushedEvents === "number")
                        object.unpushedEvents = options.longs === String ? String(message.unpushedEvents) : message.unpushedEvents;
                    else
                        object.unpushedEvents = options.longs === String ? $util.Long.prototype.toString.call(message.unpushedEvents) : options.longs === Number ? new $util.LongBits(message.unpushedEvents.low >>> 0, message.unpushedEvents.high >>> 0).toNumber(true) : message.unpushedEvents;
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
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
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
            PingRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.PingRequest();
                while (reader.pos < end) {
                    var tag = reader.uint32();
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

        mass.Manifest = (function() {

            /**
             * Properties of a Manifest.
             * @memberof market.mass
             * @interface IManifest
             * @property {market.mass.IUint256|null} [tokenId] Manifest tokenId
             * @property {Array.<market.mass.IPayee>|null} [payees] Manifest payees
             * @property {Array.<market.mass.IShopCurrency>|null} [acceptedCurrencies] Manifest acceptedCurrencies
             * @property {market.mass.IShopCurrency|null} [baseCurrency] Manifest baseCurrency
             */

            /**
             * Constructs a new Manifest.
             * @memberof market.mass
             * @classdesc Represents a Manifest.
             * @implements IManifest
             * @constructor
             * @param {market.mass.IManifest=} [properties] Properties to set
             */
            function Manifest(properties) {
                this.payees = [];
                this.acceptedCurrencies = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Manifest tokenId.
             * @member {market.mass.IUint256|null|undefined} tokenId
             * @memberof market.mass.Manifest
             * @instance
             */
            Manifest.prototype.tokenId = null;

            /**
             * Manifest payees.
             * @member {Array.<market.mass.IPayee>} payees
             * @memberof market.mass.Manifest
             * @instance
             */
            Manifest.prototype.payees = $util.emptyArray;

            /**
             * Manifest acceptedCurrencies.
             * @member {Array.<market.mass.IShopCurrency>} acceptedCurrencies
             * @memberof market.mass.Manifest
             * @instance
             */
            Manifest.prototype.acceptedCurrencies = $util.emptyArray;

            /**
             * Manifest baseCurrency.
             * @member {market.mass.IShopCurrency|null|undefined} baseCurrency
             * @memberof market.mass.Manifest
             * @instance
             */
            Manifest.prototype.baseCurrency = null;

            /**
             * Creates a new Manifest instance using the specified properties.
             * @function create
             * @memberof market.mass.Manifest
             * @static
             * @param {market.mass.IManifest=} [properties] Properties to set
             * @returns {market.mass.Manifest} Manifest instance
             */
            Manifest.create = function create(properties) {
                return new Manifest(properties);
            };

            /**
             * Encodes the specified Manifest message. Does not implicitly {@link market.mass.Manifest.verify|verify} messages.
             * @function encode
             * @memberof market.mass.Manifest
             * @static
             * @param {market.mass.IManifest} message Manifest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Manifest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.tokenId != null && Object.hasOwnProperty.call(message, "tokenId"))
                    $root.market.mass.Uint256.encode(message.tokenId, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                if (message.payees != null && message.payees.length)
                    for (var i = 0; i < message.payees.length; ++i)
                        $root.market.mass.Payee.encode(message.payees[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                if (message.acceptedCurrencies != null && message.acceptedCurrencies.length)
                    for (var i = 0; i < message.acceptedCurrencies.length; ++i)
                        $root.market.mass.ShopCurrency.encode(message.acceptedCurrencies[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                if (message.baseCurrency != null && Object.hasOwnProperty.call(message, "baseCurrency"))
                    $root.market.mass.ShopCurrency.encode(message.baseCurrency, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified Manifest message, length delimited. Does not implicitly {@link market.mass.Manifest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof market.mass.Manifest
             * @static
             * @param {market.mass.IManifest} message Manifest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Manifest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a Manifest message from the specified reader or buffer.
             * @function decode
             * @memberof market.mass.Manifest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {market.mass.Manifest} Manifest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Manifest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.Manifest();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.tokenId = $root.market.mass.Uint256.decode(reader, reader.uint32());
                            break;
                        }
                    case 2: {
                            if (!(message.payees && message.payees.length))
                                message.payees = [];
                            message.payees.push($root.market.mass.Payee.decode(reader, reader.uint32()));
                            break;
                        }
                    case 3: {
                            if (!(message.acceptedCurrencies && message.acceptedCurrencies.length))
                                message.acceptedCurrencies = [];
                            message.acceptedCurrencies.push($root.market.mass.ShopCurrency.decode(reader, reader.uint32()));
                            break;
                        }
                    case 4: {
                            message.baseCurrency = $root.market.mass.ShopCurrency.decode(reader, reader.uint32());
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
             * Decodes a Manifest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof market.mass.Manifest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {market.mass.Manifest} Manifest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Manifest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Manifest message.
             * @function verify
             * @memberof market.mass.Manifest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Manifest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.tokenId != null && message.hasOwnProperty("tokenId")) {
                    var error = $root.market.mass.Uint256.verify(message.tokenId);
                    if (error)
                        return "tokenId." + error;
                }
                if (message.payees != null && message.hasOwnProperty("payees")) {
                    if (!Array.isArray(message.payees))
                        return "payees: array expected";
                    for (var i = 0; i < message.payees.length; ++i) {
                        var error = $root.market.mass.Payee.verify(message.payees[i]);
                        if (error)
                            return "payees." + error;
                    }
                }
                if (message.acceptedCurrencies != null && message.hasOwnProperty("acceptedCurrencies")) {
                    if (!Array.isArray(message.acceptedCurrencies))
                        return "acceptedCurrencies: array expected";
                    for (var i = 0; i < message.acceptedCurrencies.length; ++i) {
                        var error = $root.market.mass.ShopCurrency.verify(message.acceptedCurrencies[i]);
                        if (error)
                            return "acceptedCurrencies." + error;
                    }
                }
                if (message.baseCurrency != null && message.hasOwnProperty("baseCurrency")) {
                    var error = $root.market.mass.ShopCurrency.verify(message.baseCurrency);
                    if (error)
                        return "baseCurrency." + error;
                }
                return null;
            };

            /**
             * Creates a Manifest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof market.mass.Manifest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {market.mass.Manifest} Manifest
             */
            Manifest.fromObject = function fromObject(object) {
                if (object instanceof $root.market.mass.Manifest)
                    return object;
                var message = new $root.market.mass.Manifest();
                if (object.tokenId != null) {
                    if (typeof object.tokenId !== "object")
                        throw TypeError(".market.mass.Manifest.tokenId: object expected");
                    message.tokenId = $root.market.mass.Uint256.fromObject(object.tokenId);
                }
                if (object.payees) {
                    if (!Array.isArray(object.payees))
                        throw TypeError(".market.mass.Manifest.payees: array expected");
                    message.payees = [];
                    for (var i = 0; i < object.payees.length; ++i) {
                        if (typeof object.payees[i] !== "object")
                            throw TypeError(".market.mass.Manifest.payees: object expected");
                        message.payees[i] = $root.market.mass.Payee.fromObject(object.payees[i]);
                    }
                }
                if (object.acceptedCurrencies) {
                    if (!Array.isArray(object.acceptedCurrencies))
                        throw TypeError(".market.mass.Manifest.acceptedCurrencies: array expected");
                    message.acceptedCurrencies = [];
                    for (var i = 0; i < object.acceptedCurrencies.length; ++i) {
                        if (typeof object.acceptedCurrencies[i] !== "object")
                            throw TypeError(".market.mass.Manifest.acceptedCurrencies: object expected");
                        message.acceptedCurrencies[i] = $root.market.mass.ShopCurrency.fromObject(object.acceptedCurrencies[i]);
                    }
                }
                if (object.baseCurrency != null) {
                    if (typeof object.baseCurrency !== "object")
                        throw TypeError(".market.mass.Manifest.baseCurrency: object expected");
                    message.baseCurrency = $root.market.mass.ShopCurrency.fromObject(object.baseCurrency);
                }
                return message;
            };

            /**
             * Creates a plain object from a Manifest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof market.mass.Manifest
             * @static
             * @param {market.mass.Manifest} message Manifest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Manifest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults) {
                    object.payees = [];
                    object.acceptedCurrencies = [];
                }
                if (options.defaults) {
                    object.tokenId = null;
                    object.baseCurrency = null;
                }
                if (message.tokenId != null && message.hasOwnProperty("tokenId"))
                    object.tokenId = $root.market.mass.Uint256.toObject(message.tokenId, options);
                if (message.payees && message.payees.length) {
                    object.payees = [];
                    for (var j = 0; j < message.payees.length; ++j)
                        object.payees[j] = $root.market.mass.Payee.toObject(message.payees[j], options);
                }
                if (message.acceptedCurrencies && message.acceptedCurrencies.length) {
                    object.acceptedCurrencies = [];
                    for (var j = 0; j < message.acceptedCurrencies.length; ++j)
                        object.acceptedCurrencies[j] = $root.market.mass.ShopCurrency.toObject(message.acceptedCurrencies[j], options);
                }
                if (message.baseCurrency != null && message.hasOwnProperty("baseCurrency"))
                    object.baseCurrency = $root.market.mass.ShopCurrency.toObject(message.baseCurrency, options);
                return object;
            };

            /**
             * Converts this Manifest to JSON.
             * @function toJSON
             * @memberof market.mass.Manifest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Manifest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for Manifest
             * @function getTypeUrl
             * @memberof market.mass.Manifest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            Manifest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/market.mass.Manifest";
            };

            return Manifest;
        })();

        mass.UpdateManifest = (function() {

            /**
             * Properties of an UpdateManifest.
             * @memberof market.mass
             * @interface IUpdateManifest
             * @property {market.mass.IPayee|null} [addPayee] UpdateManifest addPayee
             * @property {market.mass.IPayee|null} [removePayee] UpdateManifest removePayee
             * @property {Array.<market.mass.IShopCurrency>|null} [addAcceptedCurrencies] UpdateManifest addAcceptedCurrencies
             * @property {Array.<market.mass.IShopCurrency>|null} [removeAcceptedCurrencies] UpdateManifest removeAcceptedCurrencies
             * @property {market.mass.IShopCurrency|null} [setBaseCurrency] UpdateManifest setBaseCurrency
             */

            /**
             * Constructs a new UpdateManifest.
             * @memberof market.mass
             * @classdesc Represents an UpdateManifest.
             * @implements IUpdateManifest
             * @constructor
             * @param {market.mass.IUpdateManifest=} [properties] Properties to set
             */
            function UpdateManifest(properties) {
                this.addAcceptedCurrencies = [];
                this.removeAcceptedCurrencies = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * UpdateManifest addPayee.
             * @member {market.mass.IPayee|null|undefined} addPayee
             * @memberof market.mass.UpdateManifest
             * @instance
             */
            UpdateManifest.prototype.addPayee = null;

            /**
             * UpdateManifest removePayee.
             * @member {market.mass.IPayee|null|undefined} removePayee
             * @memberof market.mass.UpdateManifest
             * @instance
             */
            UpdateManifest.prototype.removePayee = null;

            /**
             * UpdateManifest addAcceptedCurrencies.
             * @member {Array.<market.mass.IShopCurrency>} addAcceptedCurrencies
             * @memberof market.mass.UpdateManifest
             * @instance
             */
            UpdateManifest.prototype.addAcceptedCurrencies = $util.emptyArray;

            /**
             * UpdateManifest removeAcceptedCurrencies.
             * @member {Array.<market.mass.IShopCurrency>} removeAcceptedCurrencies
             * @memberof market.mass.UpdateManifest
             * @instance
             */
            UpdateManifest.prototype.removeAcceptedCurrencies = $util.emptyArray;

            /**
             * UpdateManifest setBaseCurrency.
             * @member {market.mass.IShopCurrency|null|undefined} setBaseCurrency
             * @memberof market.mass.UpdateManifest
             * @instance
             */
            UpdateManifest.prototype.setBaseCurrency = null;

            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;

            /**
             * UpdateManifest _addPayee.
             * @member {"addPayee"|undefined} _addPayee
             * @memberof market.mass.UpdateManifest
             * @instance
             */
            Object.defineProperty(UpdateManifest.prototype, "_addPayee", {
                get: $util.oneOfGetter($oneOfFields = ["addPayee"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * UpdateManifest _removePayee.
             * @member {"removePayee"|undefined} _removePayee
             * @memberof market.mass.UpdateManifest
             * @instance
             */
            Object.defineProperty(UpdateManifest.prototype, "_removePayee", {
                get: $util.oneOfGetter($oneOfFields = ["removePayee"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * UpdateManifest _setBaseCurrency.
             * @member {"setBaseCurrency"|undefined} _setBaseCurrency
             * @memberof market.mass.UpdateManifest
             * @instance
             */
            Object.defineProperty(UpdateManifest.prototype, "_setBaseCurrency", {
                get: $util.oneOfGetter($oneOfFields = ["setBaseCurrency"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new UpdateManifest instance using the specified properties.
             * @function create
             * @memberof market.mass.UpdateManifest
             * @static
             * @param {market.mass.IUpdateManifest=} [properties] Properties to set
             * @returns {market.mass.UpdateManifest} UpdateManifest instance
             */
            UpdateManifest.create = function create(properties) {
                return new UpdateManifest(properties);
            };

            /**
             * Encodes the specified UpdateManifest message. Does not implicitly {@link market.mass.UpdateManifest.verify|verify} messages.
             * @function encode
             * @memberof market.mass.UpdateManifest
             * @static
             * @param {market.mass.IUpdateManifest} message UpdateManifest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UpdateManifest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.addPayee != null && Object.hasOwnProperty.call(message, "addPayee"))
                    $root.market.mass.Payee.encode(message.addPayee, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                if (message.removePayee != null && Object.hasOwnProperty.call(message, "removePayee"))
                    $root.market.mass.Payee.encode(message.removePayee, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                if (message.addAcceptedCurrencies != null && message.addAcceptedCurrencies.length)
                    for (var i = 0; i < message.addAcceptedCurrencies.length; ++i)
                        $root.market.mass.ShopCurrency.encode(message.addAcceptedCurrencies[i], writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                if (message.removeAcceptedCurrencies != null && message.removeAcceptedCurrencies.length)
                    for (var i = 0; i < message.removeAcceptedCurrencies.length; ++i)
                        $root.market.mass.ShopCurrency.encode(message.removeAcceptedCurrencies[i], writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
                if (message.setBaseCurrency != null && Object.hasOwnProperty.call(message, "setBaseCurrency"))
                    $root.market.mass.ShopCurrency.encode(message.setBaseCurrency, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified UpdateManifest message, length delimited. Does not implicitly {@link market.mass.UpdateManifest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof market.mass.UpdateManifest
             * @static
             * @param {market.mass.IUpdateManifest} message UpdateManifest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UpdateManifest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an UpdateManifest message from the specified reader or buffer.
             * @function decode
             * @memberof market.mass.UpdateManifest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {market.mass.UpdateManifest} UpdateManifest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            UpdateManifest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.UpdateManifest();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 2: {
                            message.addPayee = $root.market.mass.Payee.decode(reader, reader.uint32());
                            break;
                        }
                    case 3: {
                            message.removePayee = $root.market.mass.Payee.decode(reader, reader.uint32());
                            break;
                        }
                    case 4: {
                            if (!(message.addAcceptedCurrencies && message.addAcceptedCurrencies.length))
                                message.addAcceptedCurrencies = [];
                            message.addAcceptedCurrencies.push($root.market.mass.ShopCurrency.decode(reader, reader.uint32()));
                            break;
                        }
                    case 5: {
                            if (!(message.removeAcceptedCurrencies && message.removeAcceptedCurrencies.length))
                                message.removeAcceptedCurrencies = [];
                            message.removeAcceptedCurrencies.push($root.market.mass.ShopCurrency.decode(reader, reader.uint32()));
                            break;
                        }
                    case 6: {
                            message.setBaseCurrency = $root.market.mass.ShopCurrency.decode(reader, reader.uint32());
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
             * Decodes an UpdateManifest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof market.mass.UpdateManifest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {market.mass.UpdateManifest} UpdateManifest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            UpdateManifest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an UpdateManifest message.
             * @function verify
             * @memberof market.mass.UpdateManifest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            UpdateManifest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                var properties = {};
                if (message.addPayee != null && message.hasOwnProperty("addPayee")) {
                    properties._addPayee = 1;
                    {
                        var error = $root.market.mass.Payee.verify(message.addPayee);
                        if (error)
                            return "addPayee." + error;
                    }
                }
                if (message.removePayee != null && message.hasOwnProperty("removePayee")) {
                    properties._removePayee = 1;
                    {
                        var error = $root.market.mass.Payee.verify(message.removePayee);
                        if (error)
                            return "removePayee." + error;
                    }
                }
                if (message.addAcceptedCurrencies != null && message.hasOwnProperty("addAcceptedCurrencies")) {
                    if (!Array.isArray(message.addAcceptedCurrencies))
                        return "addAcceptedCurrencies: array expected";
                    for (var i = 0; i < message.addAcceptedCurrencies.length; ++i) {
                        var error = $root.market.mass.ShopCurrency.verify(message.addAcceptedCurrencies[i]);
                        if (error)
                            return "addAcceptedCurrencies." + error;
                    }
                }
                if (message.removeAcceptedCurrencies != null && message.hasOwnProperty("removeAcceptedCurrencies")) {
                    if (!Array.isArray(message.removeAcceptedCurrencies))
                        return "removeAcceptedCurrencies: array expected";
                    for (var i = 0; i < message.removeAcceptedCurrencies.length; ++i) {
                        var error = $root.market.mass.ShopCurrency.verify(message.removeAcceptedCurrencies[i]);
                        if (error)
                            return "removeAcceptedCurrencies." + error;
                    }
                }
                if (message.setBaseCurrency != null && message.hasOwnProperty("setBaseCurrency")) {
                    properties._setBaseCurrency = 1;
                    {
                        var error = $root.market.mass.ShopCurrency.verify(message.setBaseCurrency);
                        if (error)
                            return "setBaseCurrency." + error;
                    }
                }
                return null;
            };

            /**
             * Creates an UpdateManifest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof market.mass.UpdateManifest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {market.mass.UpdateManifest} UpdateManifest
             */
            UpdateManifest.fromObject = function fromObject(object) {
                if (object instanceof $root.market.mass.UpdateManifest)
                    return object;
                var message = new $root.market.mass.UpdateManifest();
                if (object.addPayee != null) {
                    if (typeof object.addPayee !== "object")
                        throw TypeError(".market.mass.UpdateManifest.addPayee: object expected");
                    message.addPayee = $root.market.mass.Payee.fromObject(object.addPayee);
                }
                if (object.removePayee != null) {
                    if (typeof object.removePayee !== "object")
                        throw TypeError(".market.mass.UpdateManifest.removePayee: object expected");
                    message.removePayee = $root.market.mass.Payee.fromObject(object.removePayee);
                }
                if (object.addAcceptedCurrencies) {
                    if (!Array.isArray(object.addAcceptedCurrencies))
                        throw TypeError(".market.mass.UpdateManifest.addAcceptedCurrencies: array expected");
                    message.addAcceptedCurrencies = [];
                    for (var i = 0; i < object.addAcceptedCurrencies.length; ++i) {
                        if (typeof object.addAcceptedCurrencies[i] !== "object")
                            throw TypeError(".market.mass.UpdateManifest.addAcceptedCurrencies: object expected");
                        message.addAcceptedCurrencies[i] = $root.market.mass.ShopCurrency.fromObject(object.addAcceptedCurrencies[i]);
                    }
                }
                if (object.removeAcceptedCurrencies) {
                    if (!Array.isArray(object.removeAcceptedCurrencies))
                        throw TypeError(".market.mass.UpdateManifest.removeAcceptedCurrencies: array expected");
                    message.removeAcceptedCurrencies = [];
                    for (var i = 0; i < object.removeAcceptedCurrencies.length; ++i) {
                        if (typeof object.removeAcceptedCurrencies[i] !== "object")
                            throw TypeError(".market.mass.UpdateManifest.removeAcceptedCurrencies: object expected");
                        message.removeAcceptedCurrencies[i] = $root.market.mass.ShopCurrency.fromObject(object.removeAcceptedCurrencies[i]);
                    }
                }
                if (object.setBaseCurrency != null) {
                    if (typeof object.setBaseCurrency !== "object")
                        throw TypeError(".market.mass.UpdateManifest.setBaseCurrency: object expected");
                    message.setBaseCurrency = $root.market.mass.ShopCurrency.fromObject(object.setBaseCurrency);
                }
                return message;
            };

            /**
             * Creates a plain object from an UpdateManifest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof market.mass.UpdateManifest
             * @static
             * @param {market.mass.UpdateManifest} message UpdateManifest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            UpdateManifest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults) {
                    object.addAcceptedCurrencies = [];
                    object.removeAcceptedCurrencies = [];
                }
                if (message.addPayee != null && message.hasOwnProperty("addPayee")) {
                    object.addPayee = $root.market.mass.Payee.toObject(message.addPayee, options);
                    if (options.oneofs)
                        object._addPayee = "addPayee";
                }
                if (message.removePayee != null && message.hasOwnProperty("removePayee")) {
                    object.removePayee = $root.market.mass.Payee.toObject(message.removePayee, options);
                    if (options.oneofs)
                        object._removePayee = "removePayee";
                }
                if (message.addAcceptedCurrencies && message.addAcceptedCurrencies.length) {
                    object.addAcceptedCurrencies = [];
                    for (var j = 0; j < message.addAcceptedCurrencies.length; ++j)
                        object.addAcceptedCurrencies[j] = $root.market.mass.ShopCurrency.toObject(message.addAcceptedCurrencies[j], options);
                }
                if (message.removeAcceptedCurrencies && message.removeAcceptedCurrencies.length) {
                    object.removeAcceptedCurrencies = [];
                    for (var j = 0; j < message.removeAcceptedCurrencies.length; ++j)
                        object.removeAcceptedCurrencies[j] = $root.market.mass.ShopCurrency.toObject(message.removeAcceptedCurrencies[j], options);
                }
                if (message.setBaseCurrency != null && message.hasOwnProperty("setBaseCurrency")) {
                    object.setBaseCurrency = $root.market.mass.ShopCurrency.toObject(message.setBaseCurrency, options);
                    if (options.oneofs)
                        object._setBaseCurrency = "setBaseCurrency";
                }
                return object;
            };

            /**
             * Converts this UpdateManifest to JSON.
             * @function toJSON
             * @memberof market.mass.UpdateManifest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            UpdateManifest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for UpdateManifest
             * @function getTypeUrl
             * @memberof market.mass.UpdateManifest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            UpdateManifest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/market.mass.UpdateManifest";
            };

            return UpdateManifest;
        })();

        mass.Account = (function() {

            /**
             * Properties of an Account.
             * @memberof market.mass
             * @interface IAccount
             * @property {market.mass.Account.IOnchainAction|null} [add] Account add
             * @property {market.mass.Account.IOnchainAction|null} [remove] Account remove
             * @property {market.mass.Account.IKeyCardEnroll|null} [enrollKeycard] Account enrollKeycard
             * @property {market.mass.IPublicKey|null} [revokeKeycard] Account revokeKeycard
             */

            /**
             * Constructs a new Account.
             * @memberof market.mass
             * @classdesc Represents an Account.
             * @implements IAccount
             * @constructor
             * @param {market.mass.IAccount=} [properties] Properties to set
             */
            function Account(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Account add.
             * @member {market.mass.Account.IOnchainAction|null|undefined} add
             * @memberof market.mass.Account
             * @instance
             */
            Account.prototype.add = null;

            /**
             * Account remove.
             * @member {market.mass.Account.IOnchainAction|null|undefined} remove
             * @memberof market.mass.Account
             * @instance
             */
            Account.prototype.remove = null;

            /**
             * Account enrollKeycard.
             * @member {market.mass.Account.IKeyCardEnroll|null|undefined} enrollKeycard
             * @memberof market.mass.Account
             * @instance
             */
            Account.prototype.enrollKeycard = null;

            /**
             * Account revokeKeycard.
             * @member {market.mass.IPublicKey|null|undefined} revokeKeycard
             * @memberof market.mass.Account
             * @instance
             */
            Account.prototype.revokeKeycard = null;

            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;

            /**
             * Account action.
             * @member {"add"|"remove"|"enrollKeycard"|"revokeKeycard"|undefined} action
             * @memberof market.mass.Account
             * @instance
             */
            Object.defineProperty(Account.prototype, "action", {
                get: $util.oneOfGetter($oneOfFields = ["add", "remove", "enrollKeycard", "revokeKeycard"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new Account instance using the specified properties.
             * @function create
             * @memberof market.mass.Account
             * @static
             * @param {market.mass.IAccount=} [properties] Properties to set
             * @returns {market.mass.Account} Account instance
             */
            Account.create = function create(properties) {
                return new Account(properties);
            };

            /**
             * Encodes the specified Account message. Does not implicitly {@link market.mass.Account.verify|verify} messages.
             * @function encode
             * @memberof market.mass.Account
             * @static
             * @param {market.mass.IAccount} message Account message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Account.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.add != null && Object.hasOwnProperty.call(message, "add"))
                    $root.market.mass.Account.OnchainAction.encode(message.add, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                if (message.remove != null && Object.hasOwnProperty.call(message, "remove"))
                    $root.market.mass.Account.OnchainAction.encode(message.remove, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                if (message.enrollKeycard != null && Object.hasOwnProperty.call(message, "enrollKeycard"))
                    $root.market.mass.Account.KeyCardEnroll.encode(message.enrollKeycard, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                if (message.revokeKeycard != null && Object.hasOwnProperty.call(message, "revokeKeycard"))
                    $root.market.mass.PublicKey.encode(message.revokeKeycard, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified Account message, length delimited. Does not implicitly {@link market.mass.Account.verify|verify} messages.
             * @function encodeDelimited
             * @memberof market.mass.Account
             * @static
             * @param {market.mass.IAccount} message Account message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Account.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an Account message from the specified reader or buffer.
             * @function decode
             * @memberof market.mass.Account
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {market.mass.Account} Account
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Account.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.Account();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.add = $root.market.mass.Account.OnchainAction.decode(reader, reader.uint32());
                            break;
                        }
                    case 2: {
                            message.remove = $root.market.mass.Account.OnchainAction.decode(reader, reader.uint32());
                            break;
                        }
                    case 3: {
                            message.enrollKeycard = $root.market.mass.Account.KeyCardEnroll.decode(reader, reader.uint32());
                            break;
                        }
                    case 4: {
                            message.revokeKeycard = $root.market.mass.PublicKey.decode(reader, reader.uint32());
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
             * Decodes an Account message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof market.mass.Account
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {market.mass.Account} Account
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Account.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an Account message.
             * @function verify
             * @memberof market.mass.Account
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Account.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                var properties = {};
                if (message.add != null && message.hasOwnProperty("add")) {
                    properties.action = 1;
                    {
                        var error = $root.market.mass.Account.OnchainAction.verify(message.add);
                        if (error)
                            return "add." + error;
                    }
                }
                if (message.remove != null && message.hasOwnProperty("remove")) {
                    if (properties.action === 1)
                        return "action: multiple values";
                    properties.action = 1;
                    {
                        var error = $root.market.mass.Account.OnchainAction.verify(message.remove);
                        if (error)
                            return "remove." + error;
                    }
                }
                if (message.enrollKeycard != null && message.hasOwnProperty("enrollKeycard")) {
                    if (properties.action === 1)
                        return "action: multiple values";
                    properties.action = 1;
                    {
                        var error = $root.market.mass.Account.KeyCardEnroll.verify(message.enrollKeycard);
                        if (error)
                            return "enrollKeycard." + error;
                    }
                }
                if (message.revokeKeycard != null && message.hasOwnProperty("revokeKeycard")) {
                    if (properties.action === 1)
                        return "action: multiple values";
                    properties.action = 1;
                    {
                        var error = $root.market.mass.PublicKey.verify(message.revokeKeycard);
                        if (error)
                            return "revokeKeycard." + error;
                    }
                }
                return null;
            };

            /**
             * Creates an Account message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof market.mass.Account
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {market.mass.Account} Account
             */
            Account.fromObject = function fromObject(object) {
                if (object instanceof $root.market.mass.Account)
                    return object;
                var message = new $root.market.mass.Account();
                if (object.add != null) {
                    if (typeof object.add !== "object")
                        throw TypeError(".market.mass.Account.add: object expected");
                    message.add = $root.market.mass.Account.OnchainAction.fromObject(object.add);
                }
                if (object.remove != null) {
                    if (typeof object.remove !== "object")
                        throw TypeError(".market.mass.Account.remove: object expected");
                    message.remove = $root.market.mass.Account.OnchainAction.fromObject(object.remove);
                }
                if (object.enrollKeycard != null) {
                    if (typeof object.enrollKeycard !== "object")
                        throw TypeError(".market.mass.Account.enrollKeycard: object expected");
                    message.enrollKeycard = $root.market.mass.Account.KeyCardEnroll.fromObject(object.enrollKeycard);
                }
                if (object.revokeKeycard != null) {
                    if (typeof object.revokeKeycard !== "object")
                        throw TypeError(".market.mass.Account.revokeKeycard: object expected");
                    message.revokeKeycard = $root.market.mass.PublicKey.fromObject(object.revokeKeycard);
                }
                return message;
            };

            /**
             * Creates a plain object from an Account message. Also converts values to other types if specified.
             * @function toObject
             * @memberof market.mass.Account
             * @static
             * @param {market.mass.Account} message Account
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Account.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (message.add != null && message.hasOwnProperty("add")) {
                    object.add = $root.market.mass.Account.OnchainAction.toObject(message.add, options);
                    if (options.oneofs)
                        object.action = "add";
                }
                if (message.remove != null && message.hasOwnProperty("remove")) {
                    object.remove = $root.market.mass.Account.OnchainAction.toObject(message.remove, options);
                    if (options.oneofs)
                        object.action = "remove";
                }
                if (message.enrollKeycard != null && message.hasOwnProperty("enrollKeycard")) {
                    object.enrollKeycard = $root.market.mass.Account.KeyCardEnroll.toObject(message.enrollKeycard, options);
                    if (options.oneofs)
                        object.action = "enrollKeycard";
                }
                if (message.revokeKeycard != null && message.hasOwnProperty("revokeKeycard")) {
                    object.revokeKeycard = $root.market.mass.PublicKey.toObject(message.revokeKeycard, options);
                    if (options.oneofs)
                        object.action = "revokeKeycard";
                }
                return object;
            };

            /**
             * Converts this Account to JSON.
             * @function toJSON
             * @memberof market.mass.Account
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Account.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for Account
             * @function getTypeUrl
             * @memberof market.mass.Account
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            Account.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/market.mass.Account";
            };

            Account.OnchainAction = (function() {

                /**
                 * Properties of an OnchainAction.
                 * @memberof market.mass.Account
                 * @interface IOnchainAction
                 * @property {market.mass.IEthereumAddress|null} [accountAddress] OnchainAction accountAddress
                 * @property {market.mass.IHash|null} [tx] OnchainAction tx
                 */

                /**
                 * Constructs a new OnchainAction.
                 * @memberof market.mass.Account
                 * @classdesc Represents an OnchainAction.
                 * @implements IOnchainAction
                 * @constructor
                 * @param {market.mass.Account.IOnchainAction=} [properties] Properties to set
                 */
                function OnchainAction(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * OnchainAction accountAddress.
                 * @member {market.mass.IEthereumAddress|null|undefined} accountAddress
                 * @memberof market.mass.Account.OnchainAction
                 * @instance
                 */
                OnchainAction.prototype.accountAddress = null;

                /**
                 * OnchainAction tx.
                 * @member {market.mass.IHash|null|undefined} tx
                 * @memberof market.mass.Account.OnchainAction
                 * @instance
                 */
                OnchainAction.prototype.tx = null;

                /**
                 * Creates a new OnchainAction instance using the specified properties.
                 * @function create
                 * @memberof market.mass.Account.OnchainAction
                 * @static
                 * @param {market.mass.Account.IOnchainAction=} [properties] Properties to set
                 * @returns {market.mass.Account.OnchainAction} OnchainAction instance
                 */
                OnchainAction.create = function create(properties) {
                    return new OnchainAction(properties);
                };

                /**
                 * Encodes the specified OnchainAction message. Does not implicitly {@link market.mass.Account.OnchainAction.verify|verify} messages.
                 * @function encode
                 * @memberof market.mass.Account.OnchainAction
                 * @static
                 * @param {market.mass.Account.IOnchainAction} message OnchainAction message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                OnchainAction.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.accountAddress != null && Object.hasOwnProperty.call(message, "accountAddress"))
                        $root.market.mass.EthereumAddress.encode(message.accountAddress, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                    if (message.tx != null && Object.hasOwnProperty.call(message, "tx"))
                        $root.market.mass.Hash.encode(message.tx, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified OnchainAction message, length delimited. Does not implicitly {@link market.mass.Account.OnchainAction.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof market.mass.Account.OnchainAction
                 * @static
                 * @param {market.mass.Account.IOnchainAction} message OnchainAction message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                OnchainAction.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes an OnchainAction message from the specified reader or buffer.
                 * @function decode
                 * @memberof market.mass.Account.OnchainAction
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {market.mass.Account.OnchainAction} OnchainAction
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                OnchainAction.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.Account.OnchainAction();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1: {
                                message.accountAddress = $root.market.mass.EthereumAddress.decode(reader, reader.uint32());
                                break;
                            }
                        case 2: {
                                message.tx = $root.market.mass.Hash.decode(reader, reader.uint32());
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
                 * Decodes an OnchainAction message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof market.mass.Account.OnchainAction
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {market.mass.Account.OnchainAction} OnchainAction
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                OnchainAction.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies an OnchainAction message.
                 * @function verify
                 * @memberof market.mass.Account.OnchainAction
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                OnchainAction.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.accountAddress != null && message.hasOwnProperty("accountAddress")) {
                        var error = $root.market.mass.EthereumAddress.verify(message.accountAddress);
                        if (error)
                            return "accountAddress." + error;
                    }
                    if (message.tx != null && message.hasOwnProperty("tx")) {
                        var error = $root.market.mass.Hash.verify(message.tx);
                        if (error)
                            return "tx." + error;
                    }
                    return null;
                };

                /**
                 * Creates an OnchainAction message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof market.mass.Account.OnchainAction
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {market.mass.Account.OnchainAction} OnchainAction
                 */
                OnchainAction.fromObject = function fromObject(object) {
                    if (object instanceof $root.market.mass.Account.OnchainAction)
                        return object;
                    var message = new $root.market.mass.Account.OnchainAction();
                    if (object.accountAddress != null) {
                        if (typeof object.accountAddress !== "object")
                            throw TypeError(".market.mass.Account.OnchainAction.accountAddress: object expected");
                        message.accountAddress = $root.market.mass.EthereumAddress.fromObject(object.accountAddress);
                    }
                    if (object.tx != null) {
                        if (typeof object.tx !== "object")
                            throw TypeError(".market.mass.Account.OnchainAction.tx: object expected");
                        message.tx = $root.market.mass.Hash.fromObject(object.tx);
                    }
                    return message;
                };

                /**
                 * Creates a plain object from an OnchainAction message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof market.mass.Account.OnchainAction
                 * @static
                 * @param {market.mass.Account.OnchainAction} message OnchainAction
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                OnchainAction.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.accountAddress = null;
                        object.tx = null;
                    }
                    if (message.accountAddress != null && message.hasOwnProperty("accountAddress"))
                        object.accountAddress = $root.market.mass.EthereumAddress.toObject(message.accountAddress, options);
                    if (message.tx != null && message.hasOwnProperty("tx"))
                        object.tx = $root.market.mass.Hash.toObject(message.tx, options);
                    return object;
                };

                /**
                 * Converts this OnchainAction to JSON.
                 * @function toJSON
                 * @memberof market.mass.Account.OnchainAction
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                OnchainAction.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * Gets the default type url for OnchainAction
                 * @function getTypeUrl
                 * @memberof market.mass.Account.OnchainAction
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                OnchainAction.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/market.mass.Account.OnchainAction";
                };

                return OnchainAction;
            })();

            Account.KeyCardEnroll = (function() {

                /**
                 * Properties of a KeyCardEnroll.
                 * @memberof market.mass.Account
                 * @interface IKeyCardEnroll
                 * @property {market.mass.IPublicKey|null} [keycardPubkey] KeyCardEnroll keycardPubkey
                 * @property {market.mass.IEthereumAddress|null} [userWallet] KeyCardEnroll userWallet
                 */

                /**
                 * Constructs a new KeyCardEnroll.
                 * @memberof market.mass.Account
                 * @classdesc Represents a KeyCardEnroll.
                 * @implements IKeyCardEnroll
                 * @constructor
                 * @param {market.mass.Account.IKeyCardEnroll=} [properties] Properties to set
                 */
                function KeyCardEnroll(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * KeyCardEnroll keycardPubkey.
                 * @member {market.mass.IPublicKey|null|undefined} keycardPubkey
                 * @memberof market.mass.Account.KeyCardEnroll
                 * @instance
                 */
                KeyCardEnroll.prototype.keycardPubkey = null;

                /**
                 * KeyCardEnroll userWallet.
                 * @member {market.mass.IEthereumAddress|null|undefined} userWallet
                 * @memberof market.mass.Account.KeyCardEnroll
                 * @instance
                 */
                KeyCardEnroll.prototype.userWallet = null;

                /**
                 * Creates a new KeyCardEnroll instance using the specified properties.
                 * @function create
                 * @memberof market.mass.Account.KeyCardEnroll
                 * @static
                 * @param {market.mass.Account.IKeyCardEnroll=} [properties] Properties to set
                 * @returns {market.mass.Account.KeyCardEnroll} KeyCardEnroll instance
                 */
                KeyCardEnroll.create = function create(properties) {
                    return new KeyCardEnroll(properties);
                };

                /**
                 * Encodes the specified KeyCardEnroll message. Does not implicitly {@link market.mass.Account.KeyCardEnroll.verify|verify} messages.
                 * @function encode
                 * @memberof market.mass.Account.KeyCardEnroll
                 * @static
                 * @param {market.mass.Account.IKeyCardEnroll} message KeyCardEnroll message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                KeyCardEnroll.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.keycardPubkey != null && Object.hasOwnProperty.call(message, "keycardPubkey"))
                        $root.market.mass.PublicKey.encode(message.keycardPubkey, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                    if (message.userWallet != null && Object.hasOwnProperty.call(message, "userWallet"))
                        $root.market.mass.EthereumAddress.encode(message.userWallet, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified KeyCardEnroll message, length delimited. Does not implicitly {@link market.mass.Account.KeyCardEnroll.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof market.mass.Account.KeyCardEnroll
                 * @static
                 * @param {market.mass.Account.IKeyCardEnroll} message KeyCardEnroll message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                KeyCardEnroll.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a KeyCardEnroll message from the specified reader or buffer.
                 * @function decode
                 * @memberof market.mass.Account.KeyCardEnroll
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {market.mass.Account.KeyCardEnroll} KeyCardEnroll
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                KeyCardEnroll.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.Account.KeyCardEnroll();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1: {
                                message.keycardPubkey = $root.market.mass.PublicKey.decode(reader, reader.uint32());
                                break;
                            }
                        case 2: {
                                message.userWallet = $root.market.mass.EthereumAddress.decode(reader, reader.uint32());
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
                 * Decodes a KeyCardEnroll message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof market.mass.Account.KeyCardEnroll
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {market.mass.Account.KeyCardEnroll} KeyCardEnroll
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                KeyCardEnroll.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a KeyCardEnroll message.
                 * @function verify
                 * @memberof market.mass.Account.KeyCardEnroll
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                KeyCardEnroll.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.keycardPubkey != null && message.hasOwnProperty("keycardPubkey")) {
                        var error = $root.market.mass.PublicKey.verify(message.keycardPubkey);
                        if (error)
                            return "keycardPubkey." + error;
                    }
                    if (message.userWallet != null && message.hasOwnProperty("userWallet")) {
                        var error = $root.market.mass.EthereumAddress.verify(message.userWallet);
                        if (error)
                            return "userWallet." + error;
                    }
                    return null;
                };

                /**
                 * Creates a KeyCardEnroll message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof market.mass.Account.KeyCardEnroll
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {market.mass.Account.KeyCardEnroll} KeyCardEnroll
                 */
                KeyCardEnroll.fromObject = function fromObject(object) {
                    if (object instanceof $root.market.mass.Account.KeyCardEnroll)
                        return object;
                    var message = new $root.market.mass.Account.KeyCardEnroll();
                    if (object.keycardPubkey != null) {
                        if (typeof object.keycardPubkey !== "object")
                            throw TypeError(".market.mass.Account.KeyCardEnroll.keycardPubkey: object expected");
                        message.keycardPubkey = $root.market.mass.PublicKey.fromObject(object.keycardPubkey);
                    }
                    if (object.userWallet != null) {
                        if (typeof object.userWallet !== "object")
                            throw TypeError(".market.mass.Account.KeyCardEnroll.userWallet: object expected");
                        message.userWallet = $root.market.mass.EthereumAddress.fromObject(object.userWallet);
                    }
                    return message;
                };

                /**
                 * Creates a plain object from a KeyCardEnroll message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof market.mass.Account.KeyCardEnroll
                 * @static
                 * @param {market.mass.Account.KeyCardEnroll} message KeyCardEnroll
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                KeyCardEnroll.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.keycardPubkey = null;
                        object.userWallet = null;
                    }
                    if (message.keycardPubkey != null && message.hasOwnProperty("keycardPubkey"))
                        object.keycardPubkey = $root.market.mass.PublicKey.toObject(message.keycardPubkey, options);
                    if (message.userWallet != null && message.hasOwnProperty("userWallet"))
                        object.userWallet = $root.market.mass.EthereumAddress.toObject(message.userWallet, options);
                    return object;
                };

                /**
                 * Converts this KeyCardEnroll to JSON.
                 * @function toJSON
                 * @memberof market.mass.Account.KeyCardEnroll
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                KeyCardEnroll.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * Gets the default type url for KeyCardEnroll
                 * @function getTypeUrl
                 * @memberof market.mass.Account.KeyCardEnroll
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                KeyCardEnroll.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/market.mass.Account.KeyCardEnroll";
                };

                return KeyCardEnroll;
            })();

            return Account;
        })();

        mass.Listing = (function() {

            /**
             * Properties of a Listing.
             * @memberof market.mass
             * @interface IListing
             * @property {number|Long|null} [id] Listing id
             * @property {market.mass.IUint256|null} [basePrice] Listing basePrice
             * @property {market.mass.IListingMetadata|null} [baseInfo] Listing baseInfo
             * @property {market.mass.ListingViewState|null} [viewState] Listing viewState
             * @property {Array.<market.mass.IListingOption>|null} [options] Listing options
             * @property {Array.<market.mass.IListingStockStatus>|null} [stockStatuses] Listing stockStatuses
             */

            /**
             * Constructs a new Listing.
             * @memberof market.mass
             * @classdesc Represents a Listing.
             * @implements IListing
             * @constructor
             * @param {market.mass.IListing=} [properties] Properties to set
             */
            function Listing(properties) {
                this.options = [];
                this.stockStatuses = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Listing id.
             * @member {number|Long} id
             * @memberof market.mass.Listing
             * @instance
             */
            Listing.prototype.id = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * Listing basePrice.
             * @member {market.mass.IUint256|null|undefined} basePrice
             * @memberof market.mass.Listing
             * @instance
             */
            Listing.prototype.basePrice = null;

            /**
             * Listing baseInfo.
             * @member {market.mass.IListingMetadata|null|undefined} baseInfo
             * @memberof market.mass.Listing
             * @instance
             */
            Listing.prototype.baseInfo = null;

            /**
             * Listing viewState.
             * @member {market.mass.ListingViewState} viewState
             * @memberof market.mass.Listing
             * @instance
             */
            Listing.prototype.viewState = 0;

            /**
             * Listing options.
             * @member {Array.<market.mass.IListingOption>} options
             * @memberof market.mass.Listing
             * @instance
             */
            Listing.prototype.options = $util.emptyArray;

            /**
             * Listing stockStatuses.
             * @member {Array.<market.mass.IListingStockStatus>} stockStatuses
             * @memberof market.mass.Listing
             * @instance
             */
            Listing.prototype.stockStatuses = $util.emptyArray;

            /**
             * Creates a new Listing instance using the specified properties.
             * @function create
             * @memberof market.mass.Listing
             * @static
             * @param {market.mass.IListing=} [properties] Properties to set
             * @returns {market.mass.Listing} Listing instance
             */
            Listing.create = function create(properties) {
                return new Listing(properties);
            };

            /**
             * Encodes the specified Listing message. Does not implicitly {@link market.mass.Listing.verify|verify} messages.
             * @function encode
             * @memberof market.mass.Listing
             * @static
             * @param {market.mass.IListing} message Listing message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Listing.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.id);
                if (message.basePrice != null && Object.hasOwnProperty.call(message, "basePrice"))
                    $root.market.mass.Uint256.encode(message.basePrice, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                if (message.baseInfo != null && Object.hasOwnProperty.call(message, "baseInfo"))
                    $root.market.mass.ListingMetadata.encode(message.baseInfo, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                if (message.viewState != null && Object.hasOwnProperty.call(message, "viewState"))
                    writer.uint32(/* id 4, wireType 0 =*/32).int32(message.viewState);
                if (message.options != null && message.options.length)
                    for (var i = 0; i < message.options.length; ++i)
                        $root.market.mass.ListingOption.encode(message.options[i], writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
                if (message.stockStatuses != null && message.stockStatuses.length)
                    for (var i = 0; i < message.stockStatuses.length; ++i)
                        $root.market.mass.ListingStockStatus.encode(message.stockStatuses[i], writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified Listing message, length delimited. Does not implicitly {@link market.mass.Listing.verify|verify} messages.
             * @function encodeDelimited
             * @memberof market.mass.Listing
             * @static
             * @param {market.mass.IListing} message Listing message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Listing.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a Listing message from the specified reader or buffer.
             * @function decode
             * @memberof market.mass.Listing
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {market.mass.Listing} Listing
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Listing.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.Listing();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.id = reader.uint64();
                            break;
                        }
                    case 2: {
                            message.basePrice = $root.market.mass.Uint256.decode(reader, reader.uint32());
                            break;
                        }
                    case 3: {
                            message.baseInfo = $root.market.mass.ListingMetadata.decode(reader, reader.uint32());
                            break;
                        }
                    case 4: {
                            message.viewState = reader.int32();
                            break;
                        }
                    case 5: {
                            if (!(message.options && message.options.length))
                                message.options = [];
                            message.options.push($root.market.mass.ListingOption.decode(reader, reader.uint32()));
                            break;
                        }
                    case 6: {
                            if (!(message.stockStatuses && message.stockStatuses.length))
                                message.stockStatuses = [];
                            message.stockStatuses.push($root.market.mass.ListingStockStatus.decode(reader, reader.uint32()));
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
             * Decodes a Listing message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof market.mass.Listing
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {market.mass.Listing} Listing
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Listing.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Listing message.
             * @function verify
             * @memberof market.mass.Listing
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Listing.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.id != null && message.hasOwnProperty("id"))
                    if (!$util.isInteger(message.id) && !(message.id && $util.isInteger(message.id.low) && $util.isInteger(message.id.high)))
                        return "id: integer|Long expected";
                if (message.basePrice != null && message.hasOwnProperty("basePrice")) {
                    var error = $root.market.mass.Uint256.verify(message.basePrice);
                    if (error)
                        return "basePrice." + error;
                }
                if (message.baseInfo != null && message.hasOwnProperty("baseInfo")) {
                    var error = $root.market.mass.ListingMetadata.verify(message.baseInfo);
                    if (error)
                        return "baseInfo." + error;
                }
                if (message.viewState != null && message.hasOwnProperty("viewState"))
                    switch (message.viewState) {
                    default:
                        return "viewState: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                        break;
                    }
                if (message.options != null && message.hasOwnProperty("options")) {
                    if (!Array.isArray(message.options))
                        return "options: array expected";
                    for (var i = 0; i < message.options.length; ++i) {
                        var error = $root.market.mass.ListingOption.verify(message.options[i]);
                        if (error)
                            return "options." + error;
                    }
                }
                if (message.stockStatuses != null && message.hasOwnProperty("stockStatuses")) {
                    if (!Array.isArray(message.stockStatuses))
                        return "stockStatuses: array expected";
                    for (var i = 0; i < message.stockStatuses.length; ++i) {
                        var error = $root.market.mass.ListingStockStatus.verify(message.stockStatuses[i]);
                        if (error)
                            return "stockStatuses." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a Listing message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof market.mass.Listing
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {market.mass.Listing} Listing
             */
            Listing.fromObject = function fromObject(object) {
                if (object instanceof $root.market.mass.Listing)
                    return object;
                var message = new $root.market.mass.Listing();
                if (object.id != null)
                    if ($util.Long)
                        (message.id = $util.Long.fromValue(object.id)).unsigned = true;
                    else if (typeof object.id === "string")
                        message.id = parseInt(object.id, 10);
                    else if (typeof object.id === "number")
                        message.id = object.id;
                    else if (typeof object.id === "object")
                        message.id = new $util.LongBits(object.id.low >>> 0, object.id.high >>> 0).toNumber(true);
                if (object.basePrice != null) {
                    if (typeof object.basePrice !== "object")
                        throw TypeError(".market.mass.Listing.basePrice: object expected");
                    message.basePrice = $root.market.mass.Uint256.fromObject(object.basePrice);
                }
                if (object.baseInfo != null) {
                    if (typeof object.baseInfo !== "object")
                        throw TypeError(".market.mass.Listing.baseInfo: object expected");
                    message.baseInfo = $root.market.mass.ListingMetadata.fromObject(object.baseInfo);
                }
                switch (object.viewState) {
                default:
                    if (typeof object.viewState === "number") {
                        message.viewState = object.viewState;
                        break;
                    }
                    break;
                case "LISTING_VIEW_STATE_UNSPECIFIED":
                case 0:
                    message.viewState = 0;
                    break;
                case "LISTING_VIEW_STATE_PUBLISHED":
                case 1:
                    message.viewState = 1;
                    break;
                case "LISTING_VIEW_STATE_DELETED":
                case 2:
                    message.viewState = 2;
                    break;
                }
                if (object.options) {
                    if (!Array.isArray(object.options))
                        throw TypeError(".market.mass.Listing.options: array expected");
                    message.options = [];
                    for (var i = 0; i < object.options.length; ++i) {
                        if (typeof object.options[i] !== "object")
                            throw TypeError(".market.mass.Listing.options: object expected");
                        message.options[i] = $root.market.mass.ListingOption.fromObject(object.options[i]);
                    }
                }
                if (object.stockStatuses) {
                    if (!Array.isArray(object.stockStatuses))
                        throw TypeError(".market.mass.Listing.stockStatuses: array expected");
                    message.stockStatuses = [];
                    for (var i = 0; i < object.stockStatuses.length; ++i) {
                        if (typeof object.stockStatuses[i] !== "object")
                            throw TypeError(".market.mass.Listing.stockStatuses: object expected");
                        message.stockStatuses[i] = $root.market.mass.ListingStockStatus.fromObject(object.stockStatuses[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from a Listing message. Also converts values to other types if specified.
             * @function toObject
             * @memberof market.mass.Listing
             * @static
             * @param {market.mass.Listing} message Listing
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Listing.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults) {
                    object.options = [];
                    object.stockStatuses = [];
                }
                if (options.defaults) {
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.id = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.id = options.longs === String ? "0" : 0;
                    object.basePrice = null;
                    object.baseInfo = null;
                    object.viewState = options.enums === String ? "LISTING_VIEW_STATE_UNSPECIFIED" : 0;
                }
                if (message.id != null && message.hasOwnProperty("id"))
                    if (typeof message.id === "number")
                        object.id = options.longs === String ? String(message.id) : message.id;
                    else
                        object.id = options.longs === String ? $util.Long.prototype.toString.call(message.id) : options.longs === Number ? new $util.LongBits(message.id.low >>> 0, message.id.high >>> 0).toNumber(true) : message.id;
                if (message.basePrice != null && message.hasOwnProperty("basePrice"))
                    object.basePrice = $root.market.mass.Uint256.toObject(message.basePrice, options);
                if (message.baseInfo != null && message.hasOwnProperty("baseInfo"))
                    object.baseInfo = $root.market.mass.ListingMetadata.toObject(message.baseInfo, options);
                if (message.viewState != null && message.hasOwnProperty("viewState"))
                    object.viewState = options.enums === String ? $root.market.mass.ListingViewState[message.viewState] === undefined ? message.viewState : $root.market.mass.ListingViewState[message.viewState] : message.viewState;
                if (message.options && message.options.length) {
                    object.options = [];
                    for (var j = 0; j < message.options.length; ++j)
                        object.options[j] = $root.market.mass.ListingOption.toObject(message.options[j], options);
                }
                if (message.stockStatuses && message.stockStatuses.length) {
                    object.stockStatuses = [];
                    for (var j = 0; j < message.stockStatuses.length; ++j)
                        object.stockStatuses[j] = $root.market.mass.ListingStockStatus.toObject(message.stockStatuses[j], options);
                }
                return object;
            };

            /**
             * Converts this Listing to JSON.
             * @function toJSON
             * @memberof market.mass.Listing
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Listing.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for Listing
             * @function getTypeUrl
             * @memberof market.mass.Listing
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            Listing.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/market.mass.Listing";
            };

            return Listing;
        })();

        mass.UpdateListing = (function() {

            /**
             * Properties of an UpdateListing.
             * @memberof market.mass
             * @interface IUpdateListing
             * @property {number|Long|null} [id] UpdateListing id
             * @property {market.mass.IUint256|null} [basePrice] UpdateListing basePrice
             * @property {market.mass.IListingMetadata|null} [baseInfo] UpdateListing baseInfo
             * @property {market.mass.ListingViewState|null} [viewState] UpdateListing viewState
             * @property {Array.<market.mass.IListingOption>|null} [addOptions] UpdateListing addOptions
             * @property {Array.<number|Long>|null} [removeOptions] UpdateListing removeOptions
             * @property {Array.<market.mass.UpdateListing.IAddVariation>|null} [addVariations] UpdateListing addVariations
             * @property {Array.<number|Long>|null} [removeVariations] UpdateListing removeVariations
             * @property {Array.<market.mass.UpdateListing.IAddVariation>|null} [updateVariations] UpdateListing updateVariations
             * @property {Array.<market.mass.IListingStockStatus>|null} [stockUpdates] UpdateListing stockUpdates
             */

            /**
             * Constructs a new UpdateListing.
             * @memberof market.mass
             * @classdesc Represents an UpdateListing.
             * @implements IUpdateListing
             * @constructor
             * @param {market.mass.IUpdateListing=} [properties] Properties to set
             */
            function UpdateListing(properties) {
                this.addOptions = [];
                this.removeOptions = [];
                this.addVariations = [];
                this.removeVariations = [];
                this.updateVariations = [];
                this.stockUpdates = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * UpdateListing id.
             * @member {number|Long} id
             * @memberof market.mass.UpdateListing
             * @instance
             */
            UpdateListing.prototype.id = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * UpdateListing basePrice.
             * @member {market.mass.IUint256|null|undefined} basePrice
             * @memberof market.mass.UpdateListing
             * @instance
             */
            UpdateListing.prototype.basePrice = null;

            /**
             * UpdateListing baseInfo.
             * @member {market.mass.IListingMetadata|null|undefined} baseInfo
             * @memberof market.mass.UpdateListing
             * @instance
             */
            UpdateListing.prototype.baseInfo = null;

            /**
             * UpdateListing viewState.
             * @member {market.mass.ListingViewState|null|undefined} viewState
             * @memberof market.mass.UpdateListing
             * @instance
             */
            UpdateListing.prototype.viewState = null;

            /**
             * UpdateListing addOptions.
             * @member {Array.<market.mass.IListingOption>} addOptions
             * @memberof market.mass.UpdateListing
             * @instance
             */
            UpdateListing.prototype.addOptions = $util.emptyArray;

            /**
             * UpdateListing removeOptions.
             * @member {Array.<number|Long>} removeOptions
             * @memberof market.mass.UpdateListing
             * @instance
             */
            UpdateListing.prototype.removeOptions = $util.emptyArray;

            /**
             * UpdateListing addVariations.
             * @member {Array.<market.mass.UpdateListing.IAddVariation>} addVariations
             * @memberof market.mass.UpdateListing
             * @instance
             */
            UpdateListing.prototype.addVariations = $util.emptyArray;

            /**
             * UpdateListing removeVariations.
             * @member {Array.<number|Long>} removeVariations
             * @memberof market.mass.UpdateListing
             * @instance
             */
            UpdateListing.prototype.removeVariations = $util.emptyArray;

            /**
             * UpdateListing updateVariations.
             * @member {Array.<market.mass.UpdateListing.IAddVariation>} updateVariations
             * @memberof market.mass.UpdateListing
             * @instance
             */
            UpdateListing.prototype.updateVariations = $util.emptyArray;

            /**
             * UpdateListing stockUpdates.
             * @member {Array.<market.mass.IListingStockStatus>} stockUpdates
             * @memberof market.mass.UpdateListing
             * @instance
             */
            UpdateListing.prototype.stockUpdates = $util.emptyArray;

            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;

            /**
             * UpdateListing _basePrice.
             * @member {"basePrice"|undefined} _basePrice
             * @memberof market.mass.UpdateListing
             * @instance
             */
            Object.defineProperty(UpdateListing.prototype, "_basePrice", {
                get: $util.oneOfGetter($oneOfFields = ["basePrice"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * UpdateListing _baseInfo.
             * @member {"baseInfo"|undefined} _baseInfo
             * @memberof market.mass.UpdateListing
             * @instance
             */
            Object.defineProperty(UpdateListing.prototype, "_baseInfo", {
                get: $util.oneOfGetter($oneOfFields = ["baseInfo"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * UpdateListing _viewState.
             * @member {"viewState"|undefined} _viewState
             * @memberof market.mass.UpdateListing
             * @instance
             */
            Object.defineProperty(UpdateListing.prototype, "_viewState", {
                get: $util.oneOfGetter($oneOfFields = ["viewState"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new UpdateListing instance using the specified properties.
             * @function create
             * @memberof market.mass.UpdateListing
             * @static
             * @param {market.mass.IUpdateListing=} [properties] Properties to set
             * @returns {market.mass.UpdateListing} UpdateListing instance
             */
            UpdateListing.create = function create(properties) {
                return new UpdateListing(properties);
            };

            /**
             * Encodes the specified UpdateListing message. Does not implicitly {@link market.mass.UpdateListing.verify|verify} messages.
             * @function encode
             * @memberof market.mass.UpdateListing
             * @static
             * @param {market.mass.IUpdateListing} message UpdateListing message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UpdateListing.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.id);
                if (message.basePrice != null && Object.hasOwnProperty.call(message, "basePrice"))
                    $root.market.mass.Uint256.encode(message.basePrice, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                if (message.baseInfo != null && Object.hasOwnProperty.call(message, "baseInfo"))
                    $root.market.mass.ListingMetadata.encode(message.baseInfo, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                if (message.viewState != null && Object.hasOwnProperty.call(message, "viewState"))
                    writer.uint32(/* id 4, wireType 0 =*/32).int32(message.viewState);
                if (message.addOptions != null && message.addOptions.length)
                    for (var i = 0; i < message.addOptions.length; ++i)
                        $root.market.mass.ListingOption.encode(message.addOptions[i], writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
                if (message.removeOptions != null && message.removeOptions.length) {
                    writer.uint32(/* id 7, wireType 2 =*/58).fork();
                    for (var i = 0; i < message.removeOptions.length; ++i)
                        writer.uint64(message.removeOptions[i]);
                    writer.ldelim();
                }
                if (message.removeVariations != null && message.removeVariations.length) {
                    writer.uint32(/* id 8, wireType 2 =*/66).fork();
                    for (var i = 0; i < message.removeVariations.length; ++i)
                        writer.uint64(message.removeVariations[i]);
                    writer.ldelim();
                }
                if (message.addVariations != null && message.addVariations.length)
                    for (var i = 0; i < message.addVariations.length; ++i)
                        $root.market.mass.UpdateListing.AddVariation.encode(message.addVariations[i], writer.uint32(/* id 9, wireType 2 =*/74).fork()).ldelim();
                if (message.updateVariations != null && message.updateVariations.length)
                    for (var i = 0; i < message.updateVariations.length; ++i)
                        $root.market.mass.UpdateListing.AddVariation.encode(message.updateVariations[i], writer.uint32(/* id 10, wireType 2 =*/82).fork()).ldelim();
                if (message.stockUpdates != null && message.stockUpdates.length)
                    for (var i = 0; i < message.stockUpdates.length; ++i)
                        $root.market.mass.ListingStockStatus.encode(message.stockUpdates[i], writer.uint32(/* id 11, wireType 2 =*/90).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified UpdateListing message, length delimited. Does not implicitly {@link market.mass.UpdateListing.verify|verify} messages.
             * @function encodeDelimited
             * @memberof market.mass.UpdateListing
             * @static
             * @param {market.mass.IUpdateListing} message UpdateListing message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UpdateListing.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an UpdateListing message from the specified reader or buffer.
             * @function decode
             * @memberof market.mass.UpdateListing
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {market.mass.UpdateListing} UpdateListing
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            UpdateListing.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.UpdateListing();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.id = reader.uint64();
                            break;
                        }
                    case 2: {
                            message.basePrice = $root.market.mass.Uint256.decode(reader, reader.uint32());
                            break;
                        }
                    case 3: {
                            message.baseInfo = $root.market.mass.ListingMetadata.decode(reader, reader.uint32());
                            break;
                        }
                    case 4: {
                            message.viewState = reader.int32();
                            break;
                        }
                    case 6: {
                            if (!(message.addOptions && message.addOptions.length))
                                message.addOptions = [];
                            message.addOptions.push($root.market.mass.ListingOption.decode(reader, reader.uint32()));
                            break;
                        }
                    case 7: {
                            if (!(message.removeOptions && message.removeOptions.length))
                                message.removeOptions = [];
                            if ((tag & 7) === 2) {
                                var end2 = reader.uint32() + reader.pos;
                                while (reader.pos < end2)
                                    message.removeOptions.push(reader.uint64());
                            } else
                                message.removeOptions.push(reader.uint64());
                            break;
                        }
                    case 9: {
                            if (!(message.addVariations && message.addVariations.length))
                                message.addVariations = [];
                            message.addVariations.push($root.market.mass.UpdateListing.AddVariation.decode(reader, reader.uint32()));
                            break;
                        }
                    case 8: {
                            if (!(message.removeVariations && message.removeVariations.length))
                                message.removeVariations = [];
                            if ((tag & 7) === 2) {
                                var end2 = reader.uint32() + reader.pos;
                                while (reader.pos < end2)
                                    message.removeVariations.push(reader.uint64());
                            } else
                                message.removeVariations.push(reader.uint64());
                            break;
                        }
                    case 10: {
                            if (!(message.updateVariations && message.updateVariations.length))
                                message.updateVariations = [];
                            message.updateVariations.push($root.market.mass.UpdateListing.AddVariation.decode(reader, reader.uint32()));
                            break;
                        }
                    case 11: {
                            if (!(message.stockUpdates && message.stockUpdates.length))
                                message.stockUpdates = [];
                            message.stockUpdates.push($root.market.mass.ListingStockStatus.decode(reader, reader.uint32()));
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
             * Decodes an UpdateListing message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof market.mass.UpdateListing
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {market.mass.UpdateListing} UpdateListing
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            UpdateListing.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an UpdateListing message.
             * @function verify
             * @memberof market.mass.UpdateListing
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            UpdateListing.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                var properties = {};
                if (message.id != null && message.hasOwnProperty("id"))
                    if (!$util.isInteger(message.id) && !(message.id && $util.isInteger(message.id.low) && $util.isInteger(message.id.high)))
                        return "id: integer|Long expected";
                if (message.basePrice != null && message.hasOwnProperty("basePrice")) {
                    properties._basePrice = 1;
                    {
                        var error = $root.market.mass.Uint256.verify(message.basePrice);
                        if (error)
                            return "basePrice." + error;
                    }
                }
                if (message.baseInfo != null && message.hasOwnProperty("baseInfo")) {
                    properties._baseInfo = 1;
                    {
                        var error = $root.market.mass.ListingMetadata.verify(message.baseInfo);
                        if (error)
                            return "baseInfo." + error;
                    }
                }
                if (message.viewState != null && message.hasOwnProperty("viewState")) {
                    properties._viewState = 1;
                    switch (message.viewState) {
                    default:
                        return "viewState: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                        break;
                    }
                }
                if (message.addOptions != null && message.hasOwnProperty("addOptions")) {
                    if (!Array.isArray(message.addOptions))
                        return "addOptions: array expected";
                    for (var i = 0; i < message.addOptions.length; ++i) {
                        var error = $root.market.mass.ListingOption.verify(message.addOptions[i]);
                        if (error)
                            return "addOptions." + error;
                    }
                }
                if (message.removeOptions != null && message.hasOwnProperty("removeOptions")) {
                    if (!Array.isArray(message.removeOptions))
                        return "removeOptions: array expected";
                    for (var i = 0; i < message.removeOptions.length; ++i)
                        if (!$util.isInteger(message.removeOptions[i]) && !(message.removeOptions[i] && $util.isInteger(message.removeOptions[i].low) && $util.isInteger(message.removeOptions[i].high)))
                            return "removeOptions: integer|Long[] expected";
                }
                if (message.addVariations != null && message.hasOwnProperty("addVariations")) {
                    if (!Array.isArray(message.addVariations))
                        return "addVariations: array expected";
                    for (var i = 0; i < message.addVariations.length; ++i) {
                        var error = $root.market.mass.UpdateListing.AddVariation.verify(message.addVariations[i]);
                        if (error)
                            return "addVariations." + error;
                    }
                }
                if (message.removeVariations != null && message.hasOwnProperty("removeVariations")) {
                    if (!Array.isArray(message.removeVariations))
                        return "removeVariations: array expected";
                    for (var i = 0; i < message.removeVariations.length; ++i)
                        if (!$util.isInteger(message.removeVariations[i]) && !(message.removeVariations[i] && $util.isInteger(message.removeVariations[i].low) && $util.isInteger(message.removeVariations[i].high)))
                            return "removeVariations: integer|Long[] expected";
                }
                if (message.updateVariations != null && message.hasOwnProperty("updateVariations")) {
                    if (!Array.isArray(message.updateVariations))
                        return "updateVariations: array expected";
                    for (var i = 0; i < message.updateVariations.length; ++i) {
                        var error = $root.market.mass.UpdateListing.AddVariation.verify(message.updateVariations[i]);
                        if (error)
                            return "updateVariations." + error;
                    }
                }
                if (message.stockUpdates != null && message.hasOwnProperty("stockUpdates")) {
                    if (!Array.isArray(message.stockUpdates))
                        return "stockUpdates: array expected";
                    for (var i = 0; i < message.stockUpdates.length; ++i) {
                        var error = $root.market.mass.ListingStockStatus.verify(message.stockUpdates[i]);
                        if (error)
                            return "stockUpdates." + error;
                    }
                }
                return null;
            };

            /**
             * Creates an UpdateListing message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof market.mass.UpdateListing
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {market.mass.UpdateListing} UpdateListing
             */
            UpdateListing.fromObject = function fromObject(object) {
                if (object instanceof $root.market.mass.UpdateListing)
                    return object;
                var message = new $root.market.mass.UpdateListing();
                if (object.id != null)
                    if ($util.Long)
                        (message.id = $util.Long.fromValue(object.id)).unsigned = true;
                    else if (typeof object.id === "string")
                        message.id = parseInt(object.id, 10);
                    else if (typeof object.id === "number")
                        message.id = object.id;
                    else if (typeof object.id === "object")
                        message.id = new $util.LongBits(object.id.low >>> 0, object.id.high >>> 0).toNumber(true);
                if (object.basePrice != null) {
                    if (typeof object.basePrice !== "object")
                        throw TypeError(".market.mass.UpdateListing.basePrice: object expected");
                    message.basePrice = $root.market.mass.Uint256.fromObject(object.basePrice);
                }
                if (object.baseInfo != null) {
                    if (typeof object.baseInfo !== "object")
                        throw TypeError(".market.mass.UpdateListing.baseInfo: object expected");
                    message.baseInfo = $root.market.mass.ListingMetadata.fromObject(object.baseInfo);
                }
                switch (object.viewState) {
                default:
                    if (typeof object.viewState === "number") {
                        message.viewState = object.viewState;
                        break;
                    }
                    break;
                case "LISTING_VIEW_STATE_UNSPECIFIED":
                case 0:
                    message.viewState = 0;
                    break;
                case "LISTING_VIEW_STATE_PUBLISHED":
                case 1:
                    message.viewState = 1;
                    break;
                case "LISTING_VIEW_STATE_DELETED":
                case 2:
                    message.viewState = 2;
                    break;
                }
                if (object.addOptions) {
                    if (!Array.isArray(object.addOptions))
                        throw TypeError(".market.mass.UpdateListing.addOptions: array expected");
                    message.addOptions = [];
                    for (var i = 0; i < object.addOptions.length; ++i) {
                        if (typeof object.addOptions[i] !== "object")
                            throw TypeError(".market.mass.UpdateListing.addOptions: object expected");
                        message.addOptions[i] = $root.market.mass.ListingOption.fromObject(object.addOptions[i]);
                    }
                }
                if (object.removeOptions) {
                    if (!Array.isArray(object.removeOptions))
                        throw TypeError(".market.mass.UpdateListing.removeOptions: array expected");
                    message.removeOptions = [];
                    for (var i = 0; i < object.removeOptions.length; ++i)
                        if ($util.Long)
                            (message.removeOptions[i] = $util.Long.fromValue(object.removeOptions[i])).unsigned = true;
                        else if (typeof object.removeOptions[i] === "string")
                            message.removeOptions[i] = parseInt(object.removeOptions[i], 10);
                        else if (typeof object.removeOptions[i] === "number")
                            message.removeOptions[i] = object.removeOptions[i];
                        else if (typeof object.removeOptions[i] === "object")
                            message.removeOptions[i] = new $util.LongBits(object.removeOptions[i].low >>> 0, object.removeOptions[i].high >>> 0).toNumber(true);
                }
                if (object.addVariations) {
                    if (!Array.isArray(object.addVariations))
                        throw TypeError(".market.mass.UpdateListing.addVariations: array expected");
                    message.addVariations = [];
                    for (var i = 0; i < object.addVariations.length; ++i) {
                        if (typeof object.addVariations[i] !== "object")
                            throw TypeError(".market.mass.UpdateListing.addVariations: object expected");
                        message.addVariations[i] = $root.market.mass.UpdateListing.AddVariation.fromObject(object.addVariations[i]);
                    }
                }
                if (object.removeVariations) {
                    if (!Array.isArray(object.removeVariations))
                        throw TypeError(".market.mass.UpdateListing.removeVariations: array expected");
                    message.removeVariations = [];
                    for (var i = 0; i < object.removeVariations.length; ++i)
                        if ($util.Long)
                            (message.removeVariations[i] = $util.Long.fromValue(object.removeVariations[i])).unsigned = true;
                        else if (typeof object.removeVariations[i] === "string")
                            message.removeVariations[i] = parseInt(object.removeVariations[i], 10);
                        else if (typeof object.removeVariations[i] === "number")
                            message.removeVariations[i] = object.removeVariations[i];
                        else if (typeof object.removeVariations[i] === "object")
                            message.removeVariations[i] = new $util.LongBits(object.removeVariations[i].low >>> 0, object.removeVariations[i].high >>> 0).toNumber(true);
                }
                if (object.updateVariations) {
                    if (!Array.isArray(object.updateVariations))
                        throw TypeError(".market.mass.UpdateListing.updateVariations: array expected");
                    message.updateVariations = [];
                    for (var i = 0; i < object.updateVariations.length; ++i) {
                        if (typeof object.updateVariations[i] !== "object")
                            throw TypeError(".market.mass.UpdateListing.updateVariations: object expected");
                        message.updateVariations[i] = $root.market.mass.UpdateListing.AddVariation.fromObject(object.updateVariations[i]);
                    }
                }
                if (object.stockUpdates) {
                    if (!Array.isArray(object.stockUpdates))
                        throw TypeError(".market.mass.UpdateListing.stockUpdates: array expected");
                    message.stockUpdates = [];
                    for (var i = 0; i < object.stockUpdates.length; ++i) {
                        if (typeof object.stockUpdates[i] !== "object")
                            throw TypeError(".market.mass.UpdateListing.stockUpdates: object expected");
                        message.stockUpdates[i] = $root.market.mass.ListingStockStatus.fromObject(object.stockUpdates[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from an UpdateListing message. Also converts values to other types if specified.
             * @function toObject
             * @memberof market.mass.UpdateListing
             * @static
             * @param {market.mass.UpdateListing} message UpdateListing
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            UpdateListing.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults) {
                    object.addOptions = [];
                    object.removeOptions = [];
                    object.removeVariations = [];
                    object.addVariations = [];
                    object.updateVariations = [];
                    object.stockUpdates = [];
                }
                if (options.defaults)
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.id = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.id = options.longs === String ? "0" : 0;
                if (message.id != null && message.hasOwnProperty("id"))
                    if (typeof message.id === "number")
                        object.id = options.longs === String ? String(message.id) : message.id;
                    else
                        object.id = options.longs === String ? $util.Long.prototype.toString.call(message.id) : options.longs === Number ? new $util.LongBits(message.id.low >>> 0, message.id.high >>> 0).toNumber(true) : message.id;
                if (message.basePrice != null && message.hasOwnProperty("basePrice")) {
                    object.basePrice = $root.market.mass.Uint256.toObject(message.basePrice, options);
                    if (options.oneofs)
                        object._basePrice = "basePrice";
                }
                if (message.baseInfo != null && message.hasOwnProperty("baseInfo")) {
                    object.baseInfo = $root.market.mass.ListingMetadata.toObject(message.baseInfo, options);
                    if (options.oneofs)
                        object._baseInfo = "baseInfo";
                }
                if (message.viewState != null && message.hasOwnProperty("viewState")) {
                    object.viewState = options.enums === String ? $root.market.mass.ListingViewState[message.viewState] === undefined ? message.viewState : $root.market.mass.ListingViewState[message.viewState] : message.viewState;
                    if (options.oneofs)
                        object._viewState = "viewState";
                }
                if (message.addOptions && message.addOptions.length) {
                    object.addOptions = [];
                    for (var j = 0; j < message.addOptions.length; ++j)
                        object.addOptions[j] = $root.market.mass.ListingOption.toObject(message.addOptions[j], options);
                }
                if (message.removeOptions && message.removeOptions.length) {
                    object.removeOptions = [];
                    for (var j = 0; j < message.removeOptions.length; ++j)
                        if (typeof message.removeOptions[j] === "number")
                            object.removeOptions[j] = options.longs === String ? String(message.removeOptions[j]) : message.removeOptions[j];
                        else
                            object.removeOptions[j] = options.longs === String ? $util.Long.prototype.toString.call(message.removeOptions[j]) : options.longs === Number ? new $util.LongBits(message.removeOptions[j].low >>> 0, message.removeOptions[j].high >>> 0).toNumber(true) : message.removeOptions[j];
                }
                if (message.removeVariations && message.removeVariations.length) {
                    object.removeVariations = [];
                    for (var j = 0; j < message.removeVariations.length; ++j)
                        if (typeof message.removeVariations[j] === "number")
                            object.removeVariations[j] = options.longs === String ? String(message.removeVariations[j]) : message.removeVariations[j];
                        else
                            object.removeVariations[j] = options.longs === String ? $util.Long.prototype.toString.call(message.removeVariations[j]) : options.longs === Number ? new $util.LongBits(message.removeVariations[j].low >>> 0, message.removeVariations[j].high >>> 0).toNumber(true) : message.removeVariations[j];
                }
                if (message.addVariations && message.addVariations.length) {
                    object.addVariations = [];
                    for (var j = 0; j < message.addVariations.length; ++j)
                        object.addVariations[j] = $root.market.mass.UpdateListing.AddVariation.toObject(message.addVariations[j], options);
                }
                if (message.updateVariations && message.updateVariations.length) {
                    object.updateVariations = [];
                    for (var j = 0; j < message.updateVariations.length; ++j)
                        object.updateVariations[j] = $root.market.mass.UpdateListing.AddVariation.toObject(message.updateVariations[j], options);
                }
                if (message.stockUpdates && message.stockUpdates.length) {
                    object.stockUpdates = [];
                    for (var j = 0; j < message.stockUpdates.length; ++j)
                        object.stockUpdates[j] = $root.market.mass.ListingStockStatus.toObject(message.stockUpdates[j], options);
                }
                return object;
            };

            /**
             * Converts this UpdateListing to JSON.
             * @function toJSON
             * @memberof market.mass.UpdateListing
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            UpdateListing.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for UpdateListing
             * @function getTypeUrl
             * @memberof market.mass.UpdateListing
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            UpdateListing.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/market.mass.UpdateListing";
            };

            UpdateListing.AddVariation = (function() {

                /**
                 * Properties of an AddVariation.
                 * @memberof market.mass.UpdateListing
                 * @interface IAddVariation
                 * @property {number|Long|null} [optionId] AddVariation optionId
                 * @property {market.mass.IListingVariation|null} [variation] AddVariation variation
                 */

                /**
                 * Constructs a new AddVariation.
                 * @memberof market.mass.UpdateListing
                 * @classdesc Represents an AddVariation.
                 * @implements IAddVariation
                 * @constructor
                 * @param {market.mass.UpdateListing.IAddVariation=} [properties] Properties to set
                 */
                function AddVariation(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * AddVariation optionId.
                 * @member {number|Long} optionId
                 * @memberof market.mass.UpdateListing.AddVariation
                 * @instance
                 */
                AddVariation.prototype.optionId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

                /**
                 * AddVariation variation.
                 * @member {market.mass.IListingVariation|null|undefined} variation
                 * @memberof market.mass.UpdateListing.AddVariation
                 * @instance
                 */
                AddVariation.prototype.variation = null;

                /**
                 * Creates a new AddVariation instance using the specified properties.
                 * @function create
                 * @memberof market.mass.UpdateListing.AddVariation
                 * @static
                 * @param {market.mass.UpdateListing.IAddVariation=} [properties] Properties to set
                 * @returns {market.mass.UpdateListing.AddVariation} AddVariation instance
                 */
                AddVariation.create = function create(properties) {
                    return new AddVariation(properties);
                };

                /**
                 * Encodes the specified AddVariation message. Does not implicitly {@link market.mass.UpdateListing.AddVariation.verify|verify} messages.
                 * @function encode
                 * @memberof market.mass.UpdateListing.AddVariation
                 * @static
                 * @param {market.mass.UpdateListing.IAddVariation} message AddVariation message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                AddVariation.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.optionId != null && Object.hasOwnProperty.call(message, "optionId"))
                        writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.optionId);
                    if (message.variation != null && Object.hasOwnProperty.call(message, "variation"))
                        $root.market.mass.ListingVariation.encode(message.variation, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified AddVariation message, length delimited. Does not implicitly {@link market.mass.UpdateListing.AddVariation.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof market.mass.UpdateListing.AddVariation
                 * @static
                 * @param {market.mass.UpdateListing.IAddVariation} message AddVariation message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                AddVariation.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes an AddVariation message from the specified reader or buffer.
                 * @function decode
                 * @memberof market.mass.UpdateListing.AddVariation
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {market.mass.UpdateListing.AddVariation} AddVariation
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                AddVariation.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.UpdateListing.AddVariation();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1: {
                                message.optionId = reader.uint64();
                                break;
                            }
                        case 2: {
                                message.variation = $root.market.mass.ListingVariation.decode(reader, reader.uint32());
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
                 * Decodes an AddVariation message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof market.mass.UpdateListing.AddVariation
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {market.mass.UpdateListing.AddVariation} AddVariation
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                AddVariation.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies an AddVariation message.
                 * @function verify
                 * @memberof market.mass.UpdateListing.AddVariation
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                AddVariation.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.optionId != null && message.hasOwnProperty("optionId"))
                        if (!$util.isInteger(message.optionId) && !(message.optionId && $util.isInteger(message.optionId.low) && $util.isInteger(message.optionId.high)))
                            return "optionId: integer|Long expected";
                    if (message.variation != null && message.hasOwnProperty("variation")) {
                        var error = $root.market.mass.ListingVariation.verify(message.variation);
                        if (error)
                            return "variation." + error;
                    }
                    return null;
                };

                /**
                 * Creates an AddVariation message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof market.mass.UpdateListing.AddVariation
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {market.mass.UpdateListing.AddVariation} AddVariation
                 */
                AddVariation.fromObject = function fromObject(object) {
                    if (object instanceof $root.market.mass.UpdateListing.AddVariation)
                        return object;
                    var message = new $root.market.mass.UpdateListing.AddVariation();
                    if (object.optionId != null)
                        if ($util.Long)
                            (message.optionId = $util.Long.fromValue(object.optionId)).unsigned = true;
                        else if (typeof object.optionId === "string")
                            message.optionId = parseInt(object.optionId, 10);
                        else if (typeof object.optionId === "number")
                            message.optionId = object.optionId;
                        else if (typeof object.optionId === "object")
                            message.optionId = new $util.LongBits(object.optionId.low >>> 0, object.optionId.high >>> 0).toNumber(true);
                    if (object.variation != null) {
                        if (typeof object.variation !== "object")
                            throw TypeError(".market.mass.UpdateListing.AddVariation.variation: object expected");
                        message.variation = $root.market.mass.ListingVariation.fromObject(object.variation);
                    }
                    return message;
                };

                /**
                 * Creates a plain object from an AddVariation message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof market.mass.UpdateListing.AddVariation
                 * @static
                 * @param {market.mass.UpdateListing.AddVariation} message AddVariation
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                AddVariation.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        if ($util.Long) {
                            var long = new $util.Long(0, 0, true);
                            object.optionId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                        } else
                            object.optionId = options.longs === String ? "0" : 0;
                        object.variation = null;
                    }
                    if (message.optionId != null && message.hasOwnProperty("optionId"))
                        if (typeof message.optionId === "number")
                            object.optionId = options.longs === String ? String(message.optionId) : message.optionId;
                        else
                            object.optionId = options.longs === String ? $util.Long.prototype.toString.call(message.optionId) : options.longs === Number ? new $util.LongBits(message.optionId.low >>> 0, message.optionId.high >>> 0).toNumber(true) : message.optionId;
                    if (message.variation != null && message.hasOwnProperty("variation"))
                        object.variation = $root.market.mass.ListingVariation.toObject(message.variation, options);
                    return object;
                };

                /**
                 * Converts this AddVariation to JSON.
                 * @function toJSON
                 * @memberof market.mass.UpdateListing.AddVariation
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                AddVariation.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * Gets the default type url for AddVariation
                 * @function getTypeUrl
                 * @memberof market.mass.UpdateListing.AddVariation
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                AddVariation.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/market.mass.UpdateListing.AddVariation";
                };

                return AddVariation;
            })();

            return UpdateListing;
        })();

        mass.ChangeInventory = (function() {

            /**
             * Properties of a ChangeInventory.
             * @memberof market.mass
             * @interface IChangeInventory
             * @property {number|Long|null} [id] ChangeInventory id
             * @property {Array.<number|Long>|null} [variationIds] ChangeInventory variationIds
             * @property {number|null} [diff] ChangeInventory diff
             */

            /**
             * Constructs a new ChangeInventory.
             * @memberof market.mass
             * @classdesc Represents a ChangeInventory.
             * @implements IChangeInventory
             * @constructor
             * @param {market.mass.IChangeInventory=} [properties] Properties to set
             */
            function ChangeInventory(properties) {
                this.variationIds = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * ChangeInventory id.
             * @member {number|Long} id
             * @memberof market.mass.ChangeInventory
             * @instance
             */
            ChangeInventory.prototype.id = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * ChangeInventory variationIds.
             * @member {Array.<number|Long>} variationIds
             * @memberof market.mass.ChangeInventory
             * @instance
             */
            ChangeInventory.prototype.variationIds = $util.emptyArray;

            /**
             * ChangeInventory diff.
             * @member {number} diff
             * @memberof market.mass.ChangeInventory
             * @instance
             */
            ChangeInventory.prototype.diff = 0;

            /**
             * Creates a new ChangeInventory instance using the specified properties.
             * @function create
             * @memberof market.mass.ChangeInventory
             * @static
             * @param {market.mass.IChangeInventory=} [properties] Properties to set
             * @returns {market.mass.ChangeInventory} ChangeInventory instance
             */
            ChangeInventory.create = function create(properties) {
                return new ChangeInventory(properties);
            };

            /**
             * Encodes the specified ChangeInventory message. Does not implicitly {@link market.mass.ChangeInventory.verify|verify} messages.
             * @function encode
             * @memberof market.mass.ChangeInventory
             * @static
             * @param {market.mass.IChangeInventory} message ChangeInventory message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ChangeInventory.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.id);
                if (message.variationIds != null && message.variationIds.length) {
                    writer.uint32(/* id 2, wireType 2 =*/18).fork();
                    for (var i = 0; i < message.variationIds.length; ++i)
                        writer.uint64(message.variationIds[i]);
                    writer.ldelim();
                }
                if (message.diff != null && Object.hasOwnProperty.call(message, "diff"))
                    writer.uint32(/* id 3, wireType 0 =*/24).sint32(message.diff);
                return writer;
            };

            /**
             * Encodes the specified ChangeInventory message, length delimited. Does not implicitly {@link market.mass.ChangeInventory.verify|verify} messages.
             * @function encodeDelimited
             * @memberof market.mass.ChangeInventory
             * @static
             * @param {market.mass.IChangeInventory} message ChangeInventory message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ChangeInventory.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a ChangeInventory message from the specified reader or buffer.
             * @function decode
             * @memberof market.mass.ChangeInventory
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {market.mass.ChangeInventory} ChangeInventory
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ChangeInventory.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.ChangeInventory();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.id = reader.uint64();
                            break;
                        }
                    case 2: {
                            if (!(message.variationIds && message.variationIds.length))
                                message.variationIds = [];
                            if ((tag & 7) === 2) {
                                var end2 = reader.uint32() + reader.pos;
                                while (reader.pos < end2)
                                    message.variationIds.push(reader.uint64());
                            } else
                                message.variationIds.push(reader.uint64());
                            break;
                        }
                    case 3: {
                            message.diff = reader.sint32();
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
             * Decodes a ChangeInventory message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof market.mass.ChangeInventory
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {market.mass.ChangeInventory} ChangeInventory
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ChangeInventory.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ChangeInventory message.
             * @function verify
             * @memberof market.mass.ChangeInventory
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ChangeInventory.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.id != null && message.hasOwnProperty("id"))
                    if (!$util.isInteger(message.id) && !(message.id && $util.isInteger(message.id.low) && $util.isInteger(message.id.high)))
                        return "id: integer|Long expected";
                if (message.variationIds != null && message.hasOwnProperty("variationIds")) {
                    if (!Array.isArray(message.variationIds))
                        return "variationIds: array expected";
                    for (var i = 0; i < message.variationIds.length; ++i)
                        if (!$util.isInteger(message.variationIds[i]) && !(message.variationIds[i] && $util.isInteger(message.variationIds[i].low) && $util.isInteger(message.variationIds[i].high)))
                            return "variationIds: integer|Long[] expected";
                }
                if (message.diff != null && message.hasOwnProperty("diff"))
                    if (!$util.isInteger(message.diff))
                        return "diff: integer expected";
                return null;
            };

            /**
             * Creates a ChangeInventory message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof market.mass.ChangeInventory
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {market.mass.ChangeInventory} ChangeInventory
             */
            ChangeInventory.fromObject = function fromObject(object) {
                if (object instanceof $root.market.mass.ChangeInventory)
                    return object;
                var message = new $root.market.mass.ChangeInventory();
                if (object.id != null)
                    if ($util.Long)
                        (message.id = $util.Long.fromValue(object.id)).unsigned = true;
                    else if (typeof object.id === "string")
                        message.id = parseInt(object.id, 10);
                    else if (typeof object.id === "number")
                        message.id = object.id;
                    else if (typeof object.id === "object")
                        message.id = new $util.LongBits(object.id.low >>> 0, object.id.high >>> 0).toNumber(true);
                if (object.variationIds) {
                    if (!Array.isArray(object.variationIds))
                        throw TypeError(".market.mass.ChangeInventory.variationIds: array expected");
                    message.variationIds = [];
                    for (var i = 0; i < object.variationIds.length; ++i)
                        if ($util.Long)
                            (message.variationIds[i] = $util.Long.fromValue(object.variationIds[i])).unsigned = true;
                        else if (typeof object.variationIds[i] === "string")
                            message.variationIds[i] = parseInt(object.variationIds[i], 10);
                        else if (typeof object.variationIds[i] === "number")
                            message.variationIds[i] = object.variationIds[i];
                        else if (typeof object.variationIds[i] === "object")
                            message.variationIds[i] = new $util.LongBits(object.variationIds[i].low >>> 0, object.variationIds[i].high >>> 0).toNumber(true);
                }
                if (object.diff != null)
                    message.diff = object.diff | 0;
                return message;
            };

            /**
             * Creates a plain object from a ChangeInventory message. Also converts values to other types if specified.
             * @function toObject
             * @memberof market.mass.ChangeInventory
             * @static
             * @param {market.mass.ChangeInventory} message ChangeInventory
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ChangeInventory.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults)
                    object.variationIds = [];
                if (options.defaults) {
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.id = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.id = options.longs === String ? "0" : 0;
                    object.diff = 0;
                }
                if (message.id != null && message.hasOwnProperty("id"))
                    if (typeof message.id === "number")
                        object.id = options.longs === String ? String(message.id) : message.id;
                    else
                        object.id = options.longs === String ? $util.Long.prototype.toString.call(message.id) : options.longs === Number ? new $util.LongBits(message.id.low >>> 0, message.id.high >>> 0).toNumber(true) : message.id;
                if (message.variationIds && message.variationIds.length) {
                    object.variationIds = [];
                    for (var j = 0; j < message.variationIds.length; ++j)
                        if (typeof message.variationIds[j] === "number")
                            object.variationIds[j] = options.longs === String ? String(message.variationIds[j]) : message.variationIds[j];
                        else
                            object.variationIds[j] = options.longs === String ? $util.Long.prototype.toString.call(message.variationIds[j]) : options.longs === Number ? new $util.LongBits(message.variationIds[j].low >>> 0, message.variationIds[j].high >>> 0).toNumber(true) : message.variationIds[j];
                }
                if (message.diff != null && message.hasOwnProperty("diff"))
                    object.diff = message.diff;
                return object;
            };

            /**
             * Converts this ChangeInventory to JSON.
             * @function toJSON
             * @memberof market.mass.ChangeInventory
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ChangeInventory.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for ChangeInventory
             * @function getTypeUrl
             * @memberof market.mass.ChangeInventory
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            ChangeInventory.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/market.mass.ChangeInventory";
            };

            return ChangeInventory;
        })();

        mass.Tag = (function() {

            /**
             * Properties of a Tag.
             * @memberof market.mass
             * @interface ITag
             * @property {number|Long|null} [id] Tag id
             * @property {string|null} [name] Tag name
             * @property {Array.<number|Long>|null} [listingIds] Tag listingIds
             * @property {boolean|null} [deleted] Tag deleted
             */

            /**
             * Constructs a new Tag.
             * @memberof market.mass
             * @classdesc Represents a Tag.
             * @implements ITag
             * @constructor
             * @param {market.mass.ITag=} [properties] Properties to set
             */
            function Tag(properties) {
                this.listingIds = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Tag id.
             * @member {number|Long} id
             * @memberof market.mass.Tag
             * @instance
             */
            Tag.prototype.id = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * Tag name.
             * @member {string} name
             * @memberof market.mass.Tag
             * @instance
             */
            Tag.prototype.name = "";

            /**
             * Tag listingIds.
             * @member {Array.<number|Long>} listingIds
             * @memberof market.mass.Tag
             * @instance
             */
            Tag.prototype.listingIds = $util.emptyArray;

            /**
             * Tag deleted.
             * @member {boolean} deleted
             * @memberof market.mass.Tag
             * @instance
             */
            Tag.prototype.deleted = false;

            /**
             * Creates a new Tag instance using the specified properties.
             * @function create
             * @memberof market.mass.Tag
             * @static
             * @param {market.mass.ITag=} [properties] Properties to set
             * @returns {market.mass.Tag} Tag instance
             */
            Tag.create = function create(properties) {
                return new Tag(properties);
            };

            /**
             * Encodes the specified Tag message. Does not implicitly {@link market.mass.Tag.verify|verify} messages.
             * @function encode
             * @memberof market.mass.Tag
             * @static
             * @param {market.mass.ITag} message Tag message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Tag.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.id);
                if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
                if (message.listingIds != null && message.listingIds.length) {
                    writer.uint32(/* id 3, wireType 2 =*/26).fork();
                    for (var i = 0; i < message.listingIds.length; ++i)
                        writer.uint64(message.listingIds[i]);
                    writer.ldelim();
                }
                if (message.deleted != null && Object.hasOwnProperty.call(message, "deleted"))
                    writer.uint32(/* id 4, wireType 0 =*/32).bool(message.deleted);
                return writer;
            };

            /**
             * Encodes the specified Tag message, length delimited. Does not implicitly {@link market.mass.Tag.verify|verify} messages.
             * @function encodeDelimited
             * @memberof market.mass.Tag
             * @static
             * @param {market.mass.ITag} message Tag message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Tag.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a Tag message from the specified reader or buffer.
             * @function decode
             * @memberof market.mass.Tag
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {market.mass.Tag} Tag
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Tag.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.Tag();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.id = reader.uint64();
                            break;
                        }
                    case 2: {
                            message.name = reader.string();
                            break;
                        }
                    case 3: {
                            if (!(message.listingIds && message.listingIds.length))
                                message.listingIds = [];
                            if ((tag & 7) === 2) {
                                var end2 = reader.uint32() + reader.pos;
                                while (reader.pos < end2)
                                    message.listingIds.push(reader.uint64());
                            } else
                                message.listingIds.push(reader.uint64());
                            break;
                        }
                    case 4: {
                            message.deleted = reader.bool();
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
             * Decodes a Tag message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof market.mass.Tag
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {market.mass.Tag} Tag
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Tag.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Tag message.
             * @function verify
             * @memberof market.mass.Tag
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Tag.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.id != null && message.hasOwnProperty("id"))
                    if (!$util.isInteger(message.id) && !(message.id && $util.isInteger(message.id.low) && $util.isInteger(message.id.high)))
                        return "id: integer|Long expected";
                if (message.name != null && message.hasOwnProperty("name"))
                    if (!$util.isString(message.name))
                        return "name: string expected";
                if (message.listingIds != null && message.hasOwnProperty("listingIds")) {
                    if (!Array.isArray(message.listingIds))
                        return "listingIds: array expected";
                    for (var i = 0; i < message.listingIds.length; ++i)
                        if (!$util.isInteger(message.listingIds[i]) && !(message.listingIds[i] && $util.isInteger(message.listingIds[i].low) && $util.isInteger(message.listingIds[i].high)))
                            return "listingIds: integer|Long[] expected";
                }
                if (message.deleted != null && message.hasOwnProperty("deleted"))
                    if (typeof message.deleted !== "boolean")
                        return "deleted: boolean expected";
                return null;
            };

            /**
             * Creates a Tag message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof market.mass.Tag
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {market.mass.Tag} Tag
             */
            Tag.fromObject = function fromObject(object) {
                if (object instanceof $root.market.mass.Tag)
                    return object;
                var message = new $root.market.mass.Tag();
                if (object.id != null)
                    if ($util.Long)
                        (message.id = $util.Long.fromValue(object.id)).unsigned = true;
                    else if (typeof object.id === "string")
                        message.id = parseInt(object.id, 10);
                    else if (typeof object.id === "number")
                        message.id = object.id;
                    else if (typeof object.id === "object")
                        message.id = new $util.LongBits(object.id.low >>> 0, object.id.high >>> 0).toNumber(true);
                if (object.name != null)
                    message.name = String(object.name);
                if (object.listingIds) {
                    if (!Array.isArray(object.listingIds))
                        throw TypeError(".market.mass.Tag.listingIds: array expected");
                    message.listingIds = [];
                    for (var i = 0; i < object.listingIds.length; ++i)
                        if ($util.Long)
                            (message.listingIds[i] = $util.Long.fromValue(object.listingIds[i])).unsigned = true;
                        else if (typeof object.listingIds[i] === "string")
                            message.listingIds[i] = parseInt(object.listingIds[i], 10);
                        else if (typeof object.listingIds[i] === "number")
                            message.listingIds[i] = object.listingIds[i];
                        else if (typeof object.listingIds[i] === "object")
                            message.listingIds[i] = new $util.LongBits(object.listingIds[i].low >>> 0, object.listingIds[i].high >>> 0).toNumber(true);
                }
                if (object.deleted != null)
                    message.deleted = Boolean(object.deleted);
                return message;
            };

            /**
             * Creates a plain object from a Tag message. Also converts values to other types if specified.
             * @function toObject
             * @memberof market.mass.Tag
             * @static
             * @param {market.mass.Tag} message Tag
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Tag.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults)
                    object.listingIds = [];
                if (options.defaults) {
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.id = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.id = options.longs === String ? "0" : 0;
                    object.name = "";
                    object.deleted = false;
                }
                if (message.id != null && message.hasOwnProperty("id"))
                    if (typeof message.id === "number")
                        object.id = options.longs === String ? String(message.id) : message.id;
                    else
                        object.id = options.longs === String ? $util.Long.prototype.toString.call(message.id) : options.longs === Number ? new $util.LongBits(message.id.low >>> 0, message.id.high >>> 0).toNumber(true) : message.id;
                if (message.name != null && message.hasOwnProperty("name"))
                    object.name = message.name;
                if (message.listingIds && message.listingIds.length) {
                    object.listingIds = [];
                    for (var j = 0; j < message.listingIds.length; ++j)
                        if (typeof message.listingIds[j] === "number")
                            object.listingIds[j] = options.longs === String ? String(message.listingIds[j]) : message.listingIds[j];
                        else
                            object.listingIds[j] = options.longs === String ? $util.Long.prototype.toString.call(message.listingIds[j]) : options.longs === Number ? new $util.LongBits(message.listingIds[j].low >>> 0, message.listingIds[j].high >>> 0).toNumber(true) : message.listingIds[j];
                }
                if (message.deleted != null && message.hasOwnProperty("deleted"))
                    object.deleted = message.deleted;
                return object;
            };

            /**
             * Converts this Tag to JSON.
             * @function toJSON
             * @memberof market.mass.Tag
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Tag.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for Tag
             * @function getTypeUrl
             * @memberof market.mass.Tag
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            Tag.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/market.mass.Tag";
            };

            return Tag;
        })();

        mass.UpdateTag = (function() {

            /**
             * Properties of an UpdateTag.
             * @memberof market.mass
             * @interface IUpdateTag
             * @property {number|Long|null} [id] UpdateTag id
             * @property {string|null} [rename] UpdateTag rename
             * @property {Array.<number|Long>|null} [addListingIds] UpdateTag addListingIds
             * @property {Array.<number|Long>|null} [removeListingIds] UpdateTag removeListingIds
             * @property {boolean|null} ["delete"] UpdateTag delete
             */

            /**
             * Constructs a new UpdateTag.
             * @memberof market.mass
             * @classdesc Represents an UpdateTag.
             * @implements IUpdateTag
             * @constructor
             * @param {market.mass.IUpdateTag=} [properties] Properties to set
             */
            function UpdateTag(properties) {
                this.addListingIds = [];
                this.removeListingIds = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * UpdateTag id.
             * @member {number|Long} id
             * @memberof market.mass.UpdateTag
             * @instance
             */
            UpdateTag.prototype.id = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * UpdateTag rename.
             * @member {string|null|undefined} rename
             * @memberof market.mass.UpdateTag
             * @instance
             */
            UpdateTag.prototype.rename = null;

            /**
             * UpdateTag addListingIds.
             * @member {Array.<number|Long>} addListingIds
             * @memberof market.mass.UpdateTag
             * @instance
             */
            UpdateTag.prototype.addListingIds = $util.emptyArray;

            /**
             * UpdateTag removeListingIds.
             * @member {Array.<number|Long>} removeListingIds
             * @memberof market.mass.UpdateTag
             * @instance
             */
            UpdateTag.prototype.removeListingIds = $util.emptyArray;

            /**
             * UpdateTag delete.
             * @member {boolean|null|undefined} delete
             * @memberof market.mass.UpdateTag
             * @instance
             */
            UpdateTag.prototype["delete"] = null;

            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;

            /**
             * UpdateTag _rename.
             * @member {"rename"|undefined} _rename
             * @memberof market.mass.UpdateTag
             * @instance
             */
            Object.defineProperty(UpdateTag.prototype, "_rename", {
                get: $util.oneOfGetter($oneOfFields = ["rename"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * UpdateTag _delete.
             * @member {"delete"|undefined} _delete
             * @memberof market.mass.UpdateTag
             * @instance
             */
            Object.defineProperty(UpdateTag.prototype, "_delete", {
                get: $util.oneOfGetter($oneOfFields = ["delete"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new UpdateTag instance using the specified properties.
             * @function create
             * @memberof market.mass.UpdateTag
             * @static
             * @param {market.mass.IUpdateTag=} [properties] Properties to set
             * @returns {market.mass.UpdateTag} UpdateTag instance
             */
            UpdateTag.create = function create(properties) {
                return new UpdateTag(properties);
            };

            /**
             * Encodes the specified UpdateTag message. Does not implicitly {@link market.mass.UpdateTag.verify|verify} messages.
             * @function encode
             * @memberof market.mass.UpdateTag
             * @static
             * @param {market.mass.IUpdateTag} message UpdateTag message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UpdateTag.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.id);
                if (message.rename != null && Object.hasOwnProperty.call(message, "rename"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.rename);
                if (message.addListingIds != null && message.addListingIds.length) {
                    writer.uint32(/* id 3, wireType 2 =*/26).fork();
                    for (var i = 0; i < message.addListingIds.length; ++i)
                        writer.uint64(message.addListingIds[i]);
                    writer.ldelim();
                }
                if (message.removeListingIds != null && message.removeListingIds.length) {
                    writer.uint32(/* id 4, wireType 2 =*/34).fork();
                    for (var i = 0; i < message.removeListingIds.length; ++i)
                        writer.uint64(message.removeListingIds[i]);
                    writer.ldelim();
                }
                if (message["delete"] != null && Object.hasOwnProperty.call(message, "delete"))
                    writer.uint32(/* id 5, wireType 0 =*/40).bool(message["delete"]);
                return writer;
            };

            /**
             * Encodes the specified UpdateTag message, length delimited. Does not implicitly {@link market.mass.UpdateTag.verify|verify} messages.
             * @function encodeDelimited
             * @memberof market.mass.UpdateTag
             * @static
             * @param {market.mass.IUpdateTag} message UpdateTag message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UpdateTag.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an UpdateTag message from the specified reader or buffer.
             * @function decode
             * @memberof market.mass.UpdateTag
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {market.mass.UpdateTag} UpdateTag
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            UpdateTag.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.UpdateTag();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.id = reader.uint64();
                            break;
                        }
                    case 2: {
                            message.rename = reader.string();
                            break;
                        }
                    case 3: {
                            if (!(message.addListingIds && message.addListingIds.length))
                                message.addListingIds = [];
                            if ((tag & 7) === 2) {
                                var end2 = reader.uint32() + reader.pos;
                                while (reader.pos < end2)
                                    message.addListingIds.push(reader.uint64());
                            } else
                                message.addListingIds.push(reader.uint64());
                            break;
                        }
                    case 4: {
                            if (!(message.removeListingIds && message.removeListingIds.length))
                                message.removeListingIds = [];
                            if ((tag & 7) === 2) {
                                var end2 = reader.uint32() + reader.pos;
                                while (reader.pos < end2)
                                    message.removeListingIds.push(reader.uint64());
                            } else
                                message.removeListingIds.push(reader.uint64());
                            break;
                        }
                    case 5: {
                            message["delete"] = reader.bool();
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
             * Decodes an UpdateTag message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof market.mass.UpdateTag
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {market.mass.UpdateTag} UpdateTag
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            UpdateTag.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an UpdateTag message.
             * @function verify
             * @memberof market.mass.UpdateTag
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            UpdateTag.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                var properties = {};
                if (message.id != null && message.hasOwnProperty("id"))
                    if (!$util.isInteger(message.id) && !(message.id && $util.isInteger(message.id.low) && $util.isInteger(message.id.high)))
                        return "id: integer|Long expected";
                if (message.rename != null && message.hasOwnProperty("rename")) {
                    properties._rename = 1;
                    if (!$util.isString(message.rename))
                        return "rename: string expected";
                }
                if (message.addListingIds != null && message.hasOwnProperty("addListingIds")) {
                    if (!Array.isArray(message.addListingIds))
                        return "addListingIds: array expected";
                    for (var i = 0; i < message.addListingIds.length; ++i)
                        if (!$util.isInteger(message.addListingIds[i]) && !(message.addListingIds[i] && $util.isInteger(message.addListingIds[i].low) && $util.isInteger(message.addListingIds[i].high)))
                            return "addListingIds: integer|Long[] expected";
                }
                if (message.removeListingIds != null && message.hasOwnProperty("removeListingIds")) {
                    if (!Array.isArray(message.removeListingIds))
                        return "removeListingIds: array expected";
                    for (var i = 0; i < message.removeListingIds.length; ++i)
                        if (!$util.isInteger(message.removeListingIds[i]) && !(message.removeListingIds[i] && $util.isInteger(message.removeListingIds[i].low) && $util.isInteger(message.removeListingIds[i].high)))
                            return "removeListingIds: integer|Long[] expected";
                }
                if (message["delete"] != null && message.hasOwnProperty("delete")) {
                    properties._delete = 1;
                    if (typeof message["delete"] !== "boolean")
                        return "delete: boolean expected";
                }
                return null;
            };

            /**
             * Creates an UpdateTag message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof market.mass.UpdateTag
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {market.mass.UpdateTag} UpdateTag
             */
            UpdateTag.fromObject = function fromObject(object) {
                if (object instanceof $root.market.mass.UpdateTag)
                    return object;
                var message = new $root.market.mass.UpdateTag();
                if (object.id != null)
                    if ($util.Long)
                        (message.id = $util.Long.fromValue(object.id)).unsigned = true;
                    else if (typeof object.id === "string")
                        message.id = parseInt(object.id, 10);
                    else if (typeof object.id === "number")
                        message.id = object.id;
                    else if (typeof object.id === "object")
                        message.id = new $util.LongBits(object.id.low >>> 0, object.id.high >>> 0).toNumber(true);
                if (object.rename != null)
                    message.rename = String(object.rename);
                if (object.addListingIds) {
                    if (!Array.isArray(object.addListingIds))
                        throw TypeError(".market.mass.UpdateTag.addListingIds: array expected");
                    message.addListingIds = [];
                    for (var i = 0; i < object.addListingIds.length; ++i)
                        if ($util.Long)
                            (message.addListingIds[i] = $util.Long.fromValue(object.addListingIds[i])).unsigned = true;
                        else if (typeof object.addListingIds[i] === "string")
                            message.addListingIds[i] = parseInt(object.addListingIds[i], 10);
                        else if (typeof object.addListingIds[i] === "number")
                            message.addListingIds[i] = object.addListingIds[i];
                        else if (typeof object.addListingIds[i] === "object")
                            message.addListingIds[i] = new $util.LongBits(object.addListingIds[i].low >>> 0, object.addListingIds[i].high >>> 0).toNumber(true);
                }
                if (object.removeListingIds) {
                    if (!Array.isArray(object.removeListingIds))
                        throw TypeError(".market.mass.UpdateTag.removeListingIds: array expected");
                    message.removeListingIds = [];
                    for (var i = 0; i < object.removeListingIds.length; ++i)
                        if ($util.Long)
                            (message.removeListingIds[i] = $util.Long.fromValue(object.removeListingIds[i])).unsigned = true;
                        else if (typeof object.removeListingIds[i] === "string")
                            message.removeListingIds[i] = parseInt(object.removeListingIds[i], 10);
                        else if (typeof object.removeListingIds[i] === "number")
                            message.removeListingIds[i] = object.removeListingIds[i];
                        else if (typeof object.removeListingIds[i] === "object")
                            message.removeListingIds[i] = new $util.LongBits(object.removeListingIds[i].low >>> 0, object.removeListingIds[i].high >>> 0).toNumber(true);
                }
                if (object["delete"] != null)
                    message["delete"] = Boolean(object["delete"]);
                return message;
            };

            /**
             * Creates a plain object from an UpdateTag message. Also converts values to other types if specified.
             * @function toObject
             * @memberof market.mass.UpdateTag
             * @static
             * @param {market.mass.UpdateTag} message UpdateTag
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            UpdateTag.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults) {
                    object.addListingIds = [];
                    object.removeListingIds = [];
                }
                if (options.defaults)
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.id = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.id = options.longs === String ? "0" : 0;
                if (message.id != null && message.hasOwnProperty("id"))
                    if (typeof message.id === "number")
                        object.id = options.longs === String ? String(message.id) : message.id;
                    else
                        object.id = options.longs === String ? $util.Long.prototype.toString.call(message.id) : options.longs === Number ? new $util.LongBits(message.id.low >>> 0, message.id.high >>> 0).toNumber(true) : message.id;
                if (message.rename != null && message.hasOwnProperty("rename")) {
                    object.rename = message.rename;
                    if (options.oneofs)
                        object._rename = "rename";
                }
                if (message.addListingIds && message.addListingIds.length) {
                    object.addListingIds = [];
                    for (var j = 0; j < message.addListingIds.length; ++j)
                        if (typeof message.addListingIds[j] === "number")
                            object.addListingIds[j] = options.longs === String ? String(message.addListingIds[j]) : message.addListingIds[j];
                        else
                            object.addListingIds[j] = options.longs === String ? $util.Long.prototype.toString.call(message.addListingIds[j]) : options.longs === Number ? new $util.LongBits(message.addListingIds[j].low >>> 0, message.addListingIds[j].high >>> 0).toNumber(true) : message.addListingIds[j];
                }
                if (message.removeListingIds && message.removeListingIds.length) {
                    object.removeListingIds = [];
                    for (var j = 0; j < message.removeListingIds.length; ++j)
                        if (typeof message.removeListingIds[j] === "number")
                            object.removeListingIds[j] = options.longs === String ? String(message.removeListingIds[j]) : message.removeListingIds[j];
                        else
                            object.removeListingIds[j] = options.longs === String ? $util.Long.prototype.toString.call(message.removeListingIds[j]) : options.longs === Number ? new $util.LongBits(message.removeListingIds[j].low >>> 0, message.removeListingIds[j].high >>> 0).toNumber(true) : message.removeListingIds[j];
                }
                if (message["delete"] != null && message.hasOwnProperty("delete")) {
                    object["delete"] = message["delete"];
                    if (options.oneofs)
                        object._delete = "delete";
                }
                return object;
            };

            /**
             * Converts this UpdateTag to JSON.
             * @function toJSON
             * @memberof market.mass.UpdateTag
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            UpdateTag.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for UpdateTag
             * @function getTypeUrl
             * @memberof market.mass.UpdateTag
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            UpdateTag.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/market.mass.UpdateTag";
            };

            return UpdateTag;
        })();

        mass.Order = (function() {

            /**
             * Properties of an Order.
             * @memberof market.mass
             * @interface IOrder
             * @property {number|Long|null} [id] Order id
             * @property {Array.<market.mass.IOrderedItem>|null} [items] Order items
             * @property {market.mass.Order.State|null} [state] Order state
             * @property {market.mass.IAddressDetails|null} [invoiceAddress] Order invoiceAddress
             * @property {market.mass.IAddressDetails|null} [shippingAddress] Order shippingAddress
             * @property {google.protobuf.ITimestamp|null} [canceledAt] Order canceledAt
             * @property {market.mass.IPayee|null} [chosenPayee] Order chosenPayee
             * @property {market.mass.IShopCurrency|null} [chosenCurrency] Order chosenCurrency
             * @property {market.mass.IPaymentDetails|null} [paymentDetails] Order paymentDetails
             * @property {market.mass.IOrderPaid|null} [paid] Order paid
             */

            /**
             * Constructs a new Order.
             * @memberof market.mass
             * @classdesc Represents an Order.
             * @implements IOrder
             * @constructor
             * @param {market.mass.IOrder=} [properties] Properties to set
             */
            function Order(properties) {
                this.items = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Order id.
             * @member {number|Long} id
             * @memberof market.mass.Order
             * @instance
             */
            Order.prototype.id = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * Order items.
             * @member {Array.<market.mass.IOrderedItem>} items
             * @memberof market.mass.Order
             * @instance
             */
            Order.prototype.items = $util.emptyArray;

            /**
             * Order state.
             * @member {market.mass.Order.State} state
             * @memberof market.mass.Order
             * @instance
             */
            Order.prototype.state = 0;

            /**
             * Order invoiceAddress.
             * @member {market.mass.IAddressDetails|null|undefined} invoiceAddress
             * @memberof market.mass.Order
             * @instance
             */
            Order.prototype.invoiceAddress = null;

            /**
             * Order shippingAddress.
             * @member {market.mass.IAddressDetails|null|undefined} shippingAddress
             * @memberof market.mass.Order
             * @instance
             */
            Order.prototype.shippingAddress = null;

            /**
             * Order canceledAt.
             * @member {google.protobuf.ITimestamp|null|undefined} canceledAt
             * @memberof market.mass.Order
             * @instance
             */
            Order.prototype.canceledAt = null;

            /**
             * Order chosenPayee.
             * @member {market.mass.IPayee|null|undefined} chosenPayee
             * @memberof market.mass.Order
             * @instance
             */
            Order.prototype.chosenPayee = null;

            /**
             * Order chosenCurrency.
             * @member {market.mass.IShopCurrency|null|undefined} chosenCurrency
             * @memberof market.mass.Order
             * @instance
             */
            Order.prototype.chosenCurrency = null;

            /**
             * Order paymentDetails.
             * @member {market.mass.IPaymentDetails|null|undefined} paymentDetails
             * @memberof market.mass.Order
             * @instance
             */
            Order.prototype.paymentDetails = null;

            /**
             * Order paid.
             * @member {market.mass.IOrderPaid|null|undefined} paid
             * @memberof market.mass.Order
             * @instance
             */
            Order.prototype.paid = null;

            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;

            /**
             * Order _invoiceAddress.
             * @member {"invoiceAddress"|undefined} _invoiceAddress
             * @memberof market.mass.Order
             * @instance
             */
            Object.defineProperty(Order.prototype, "_invoiceAddress", {
                get: $util.oneOfGetter($oneOfFields = ["invoiceAddress"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Order _shippingAddress.
             * @member {"shippingAddress"|undefined} _shippingAddress
             * @memberof market.mass.Order
             * @instance
             */
            Object.defineProperty(Order.prototype, "_shippingAddress", {
                get: $util.oneOfGetter($oneOfFields = ["shippingAddress"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Order _canceledAt.
             * @member {"canceledAt"|undefined} _canceledAt
             * @memberof market.mass.Order
             * @instance
             */
            Object.defineProperty(Order.prototype, "_canceledAt", {
                get: $util.oneOfGetter($oneOfFields = ["canceledAt"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Order _chosenPayee.
             * @member {"chosenPayee"|undefined} _chosenPayee
             * @memberof market.mass.Order
             * @instance
             */
            Object.defineProperty(Order.prototype, "_chosenPayee", {
                get: $util.oneOfGetter($oneOfFields = ["chosenPayee"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Order _chosenCurrency.
             * @member {"chosenCurrency"|undefined} _chosenCurrency
             * @memberof market.mass.Order
             * @instance
             */
            Object.defineProperty(Order.prototype, "_chosenCurrency", {
                get: $util.oneOfGetter($oneOfFields = ["chosenCurrency"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Order _paymentDetails.
             * @member {"paymentDetails"|undefined} _paymentDetails
             * @memberof market.mass.Order
             * @instance
             */
            Object.defineProperty(Order.prototype, "_paymentDetails", {
                get: $util.oneOfGetter($oneOfFields = ["paymentDetails"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Order _paid.
             * @member {"paid"|undefined} _paid
             * @memberof market.mass.Order
             * @instance
             */
            Object.defineProperty(Order.prototype, "_paid", {
                get: $util.oneOfGetter($oneOfFields = ["paid"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new Order instance using the specified properties.
             * @function create
             * @memberof market.mass.Order
             * @static
             * @param {market.mass.IOrder=} [properties] Properties to set
             * @returns {market.mass.Order} Order instance
             */
            Order.create = function create(properties) {
                return new Order(properties);
            };

            /**
             * Encodes the specified Order message. Does not implicitly {@link market.mass.Order.verify|verify} messages.
             * @function encode
             * @memberof market.mass.Order
             * @static
             * @param {market.mass.IOrder} message Order message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Order.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.id);
                if (message.items != null && message.items.length)
                    for (var i = 0; i < message.items.length; ++i)
                        $root.market.mass.OrderedItem.encode(message.items[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                if (message.state != null && Object.hasOwnProperty.call(message, "state"))
                    writer.uint32(/* id 3, wireType 0 =*/24).int32(message.state);
                if (message.invoiceAddress != null && Object.hasOwnProperty.call(message, "invoiceAddress"))
                    $root.market.mass.AddressDetails.encode(message.invoiceAddress, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                if (message.shippingAddress != null && Object.hasOwnProperty.call(message, "shippingAddress"))
                    $root.market.mass.AddressDetails.encode(message.shippingAddress, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
                if (message.canceledAt != null && Object.hasOwnProperty.call(message, "canceledAt"))
                    $root.google.protobuf.Timestamp.encode(message.canceledAt, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
                if (message.chosenPayee != null && Object.hasOwnProperty.call(message, "chosenPayee"))
                    $root.market.mass.Payee.encode(message.chosenPayee, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
                if (message.chosenCurrency != null && Object.hasOwnProperty.call(message, "chosenCurrency"))
                    $root.market.mass.ShopCurrency.encode(message.chosenCurrency, writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
                if (message.paymentDetails != null && Object.hasOwnProperty.call(message, "paymentDetails"))
                    $root.market.mass.PaymentDetails.encode(message.paymentDetails, writer.uint32(/* id 9, wireType 2 =*/74).fork()).ldelim();
                if (message.paid != null && Object.hasOwnProperty.call(message, "paid"))
                    $root.market.mass.OrderPaid.encode(message.paid, writer.uint32(/* id 10, wireType 2 =*/82).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified Order message, length delimited. Does not implicitly {@link market.mass.Order.verify|verify} messages.
             * @function encodeDelimited
             * @memberof market.mass.Order
             * @static
             * @param {market.mass.IOrder} message Order message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Order.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an Order message from the specified reader or buffer.
             * @function decode
             * @memberof market.mass.Order
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {market.mass.Order} Order
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Order.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.Order();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.id = reader.uint64();
                            break;
                        }
                    case 2: {
                            if (!(message.items && message.items.length))
                                message.items = [];
                            message.items.push($root.market.mass.OrderedItem.decode(reader, reader.uint32()));
                            break;
                        }
                    case 3: {
                            message.state = reader.int32();
                            break;
                        }
                    case 4: {
                            message.invoiceAddress = $root.market.mass.AddressDetails.decode(reader, reader.uint32());
                            break;
                        }
                    case 5: {
                            message.shippingAddress = $root.market.mass.AddressDetails.decode(reader, reader.uint32());
                            break;
                        }
                    case 6: {
                            message.canceledAt = $root.google.protobuf.Timestamp.decode(reader, reader.uint32());
                            break;
                        }
                    case 7: {
                            message.chosenPayee = $root.market.mass.Payee.decode(reader, reader.uint32());
                            break;
                        }
                    case 8: {
                            message.chosenCurrency = $root.market.mass.ShopCurrency.decode(reader, reader.uint32());
                            break;
                        }
                    case 9: {
                            message.paymentDetails = $root.market.mass.PaymentDetails.decode(reader, reader.uint32());
                            break;
                        }
                    case 10: {
                            message.paid = $root.market.mass.OrderPaid.decode(reader, reader.uint32());
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
             * Decodes an Order message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof market.mass.Order
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {market.mass.Order} Order
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Order.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an Order message.
             * @function verify
             * @memberof market.mass.Order
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Order.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                var properties = {};
                if (message.id != null && message.hasOwnProperty("id"))
                    if (!$util.isInteger(message.id) && !(message.id && $util.isInteger(message.id.low) && $util.isInteger(message.id.high)))
                        return "id: integer|Long expected";
                if (message.items != null && message.hasOwnProperty("items")) {
                    if (!Array.isArray(message.items))
                        return "items: array expected";
                    for (var i = 0; i < message.items.length; ++i) {
                        var error = $root.market.mass.OrderedItem.verify(message.items[i]);
                        if (error)
                            return "items." + error;
                    }
                }
                if (message.state != null && message.hasOwnProperty("state"))
                    switch (message.state) {
                    default:
                        return "state: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                        break;
                    }
                if (message.invoiceAddress != null && message.hasOwnProperty("invoiceAddress")) {
                    properties._invoiceAddress = 1;
                    {
                        var error = $root.market.mass.AddressDetails.verify(message.invoiceAddress);
                        if (error)
                            return "invoiceAddress." + error;
                    }
                }
                if (message.shippingAddress != null && message.hasOwnProperty("shippingAddress")) {
                    properties._shippingAddress = 1;
                    {
                        var error = $root.market.mass.AddressDetails.verify(message.shippingAddress);
                        if (error)
                            return "shippingAddress." + error;
                    }
                }
                if (message.canceledAt != null && message.hasOwnProperty("canceledAt")) {
                    properties._canceledAt = 1;
                    {
                        var error = $root.google.protobuf.Timestamp.verify(message.canceledAt);
                        if (error)
                            return "canceledAt." + error;
                    }
                }
                if (message.chosenPayee != null && message.hasOwnProperty("chosenPayee")) {
                    properties._chosenPayee = 1;
                    {
                        var error = $root.market.mass.Payee.verify(message.chosenPayee);
                        if (error)
                            return "chosenPayee." + error;
                    }
                }
                if (message.chosenCurrency != null && message.hasOwnProperty("chosenCurrency")) {
                    properties._chosenCurrency = 1;
                    {
                        var error = $root.market.mass.ShopCurrency.verify(message.chosenCurrency);
                        if (error)
                            return "chosenCurrency." + error;
                    }
                }
                if (message.paymentDetails != null && message.hasOwnProperty("paymentDetails")) {
                    properties._paymentDetails = 1;
                    {
                        var error = $root.market.mass.PaymentDetails.verify(message.paymentDetails);
                        if (error)
                            return "paymentDetails." + error;
                    }
                }
                if (message.paid != null && message.hasOwnProperty("paid")) {
                    properties._paid = 1;
                    {
                        var error = $root.market.mass.OrderPaid.verify(message.paid);
                        if (error)
                            return "paid." + error;
                    }
                }
                return null;
            };

            /**
             * Creates an Order message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof market.mass.Order
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {market.mass.Order} Order
             */
            Order.fromObject = function fromObject(object) {
                if (object instanceof $root.market.mass.Order)
                    return object;
                var message = new $root.market.mass.Order();
                if (object.id != null)
                    if ($util.Long)
                        (message.id = $util.Long.fromValue(object.id)).unsigned = true;
                    else if (typeof object.id === "string")
                        message.id = parseInt(object.id, 10);
                    else if (typeof object.id === "number")
                        message.id = object.id;
                    else if (typeof object.id === "object")
                        message.id = new $util.LongBits(object.id.low >>> 0, object.id.high >>> 0).toNumber(true);
                if (object.items) {
                    if (!Array.isArray(object.items))
                        throw TypeError(".market.mass.Order.items: array expected");
                    message.items = [];
                    for (var i = 0; i < object.items.length; ++i) {
                        if (typeof object.items[i] !== "object")
                            throw TypeError(".market.mass.Order.items: object expected");
                        message.items[i] = $root.market.mass.OrderedItem.fromObject(object.items[i]);
                    }
                }
                switch (object.state) {
                default:
                    if (typeof object.state === "number") {
                        message.state = object.state;
                        break;
                    }
                    break;
                case "STATE_UNSPECIFIED":
                case 0:
                    message.state = 0;
                    break;
                case "STATE_OPEN":
                case 1:
                    message.state = 1;
                    break;
                case "STATE_CANCELED":
                case 2:
                    message.state = 2;
                    break;
                case "STATE_COMMITED":
                case 3:
                    message.state = 3;
                    break;
                case "STATE_UNPAID":
                case 4:
                    message.state = 4;
                    break;
                case "STATE_PAID":
                case 5:
                    message.state = 5;
                    break;
                }
                if (object.invoiceAddress != null) {
                    if (typeof object.invoiceAddress !== "object")
                        throw TypeError(".market.mass.Order.invoiceAddress: object expected");
                    message.invoiceAddress = $root.market.mass.AddressDetails.fromObject(object.invoiceAddress);
                }
                if (object.shippingAddress != null) {
                    if (typeof object.shippingAddress !== "object")
                        throw TypeError(".market.mass.Order.shippingAddress: object expected");
                    message.shippingAddress = $root.market.mass.AddressDetails.fromObject(object.shippingAddress);
                }
                if (object.canceledAt != null) {
                    if (typeof object.canceledAt !== "object")
                        throw TypeError(".market.mass.Order.canceledAt: object expected");
                    message.canceledAt = $root.google.protobuf.Timestamp.fromObject(object.canceledAt);
                }
                if (object.chosenPayee != null) {
                    if (typeof object.chosenPayee !== "object")
                        throw TypeError(".market.mass.Order.chosenPayee: object expected");
                    message.chosenPayee = $root.market.mass.Payee.fromObject(object.chosenPayee);
                }
                if (object.chosenCurrency != null) {
                    if (typeof object.chosenCurrency !== "object")
                        throw TypeError(".market.mass.Order.chosenCurrency: object expected");
                    message.chosenCurrency = $root.market.mass.ShopCurrency.fromObject(object.chosenCurrency);
                }
                if (object.paymentDetails != null) {
                    if (typeof object.paymentDetails !== "object")
                        throw TypeError(".market.mass.Order.paymentDetails: object expected");
                    message.paymentDetails = $root.market.mass.PaymentDetails.fromObject(object.paymentDetails);
                }
                if (object.paid != null) {
                    if (typeof object.paid !== "object")
                        throw TypeError(".market.mass.Order.paid: object expected");
                    message.paid = $root.market.mass.OrderPaid.fromObject(object.paid);
                }
                return message;
            };

            /**
             * Creates a plain object from an Order message. Also converts values to other types if specified.
             * @function toObject
             * @memberof market.mass.Order
             * @static
             * @param {market.mass.Order} message Order
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Order.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults)
                    object.items = [];
                if (options.defaults) {
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.id = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.id = options.longs === String ? "0" : 0;
                    object.state = options.enums === String ? "STATE_UNSPECIFIED" : 0;
                }
                if (message.id != null && message.hasOwnProperty("id"))
                    if (typeof message.id === "number")
                        object.id = options.longs === String ? String(message.id) : message.id;
                    else
                        object.id = options.longs === String ? $util.Long.prototype.toString.call(message.id) : options.longs === Number ? new $util.LongBits(message.id.low >>> 0, message.id.high >>> 0).toNumber(true) : message.id;
                if (message.items && message.items.length) {
                    object.items = [];
                    for (var j = 0; j < message.items.length; ++j)
                        object.items[j] = $root.market.mass.OrderedItem.toObject(message.items[j], options);
                }
                if (message.state != null && message.hasOwnProperty("state"))
                    object.state = options.enums === String ? $root.market.mass.Order.State[message.state] === undefined ? message.state : $root.market.mass.Order.State[message.state] : message.state;
                if (message.invoiceAddress != null && message.hasOwnProperty("invoiceAddress")) {
                    object.invoiceAddress = $root.market.mass.AddressDetails.toObject(message.invoiceAddress, options);
                    if (options.oneofs)
                        object._invoiceAddress = "invoiceAddress";
                }
                if (message.shippingAddress != null && message.hasOwnProperty("shippingAddress")) {
                    object.shippingAddress = $root.market.mass.AddressDetails.toObject(message.shippingAddress, options);
                    if (options.oneofs)
                        object._shippingAddress = "shippingAddress";
                }
                if (message.canceledAt != null && message.hasOwnProperty("canceledAt")) {
                    object.canceledAt = $root.google.protobuf.Timestamp.toObject(message.canceledAt, options);
                    if (options.oneofs)
                        object._canceledAt = "canceledAt";
                }
                if (message.chosenPayee != null && message.hasOwnProperty("chosenPayee")) {
                    object.chosenPayee = $root.market.mass.Payee.toObject(message.chosenPayee, options);
                    if (options.oneofs)
                        object._chosenPayee = "chosenPayee";
                }
                if (message.chosenCurrency != null && message.hasOwnProperty("chosenCurrency")) {
                    object.chosenCurrency = $root.market.mass.ShopCurrency.toObject(message.chosenCurrency, options);
                    if (options.oneofs)
                        object._chosenCurrency = "chosenCurrency";
                }
                if (message.paymentDetails != null && message.hasOwnProperty("paymentDetails")) {
                    object.paymentDetails = $root.market.mass.PaymentDetails.toObject(message.paymentDetails, options);
                    if (options.oneofs)
                        object._paymentDetails = "paymentDetails";
                }
                if (message.paid != null && message.hasOwnProperty("paid")) {
                    object.paid = $root.market.mass.OrderPaid.toObject(message.paid, options);
                    if (options.oneofs)
                        object._paid = "paid";
                }
                return object;
            };

            /**
             * Converts this Order to JSON.
             * @function toJSON
             * @memberof market.mass.Order
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Order.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for Order
             * @function getTypeUrl
             * @memberof market.mass.Order
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            Order.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/market.mass.Order";
            };

            /**
             * State enum.
             * @name market.mass.Order.State
             * @enum {number}
             * @property {number} STATE_UNSPECIFIED=0 STATE_UNSPECIFIED value
             * @property {number} STATE_OPEN=1 STATE_OPEN value
             * @property {number} STATE_CANCELED=2 STATE_CANCELED value
             * @property {number} STATE_COMMITED=3 STATE_COMMITED value
             * @property {number} STATE_UNPAID=4 STATE_UNPAID value
             * @property {number} STATE_PAID=5 STATE_PAID value
             */
            Order.State = (function() {
                var valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "STATE_UNSPECIFIED"] = 0;
                values[valuesById[1] = "STATE_OPEN"] = 1;
                values[valuesById[2] = "STATE_CANCELED"] = 2;
                values[valuesById[3] = "STATE_COMMITED"] = 3;
                values[valuesById[4] = "STATE_UNPAID"] = 4;
                values[valuesById[5] = "STATE_PAID"] = 5;
                return values;
            })();

            return Order;
        })();

        mass.CreateOrder = (function() {

            /**
             * Properties of a CreateOrder.
             * @memberof market.mass
             * @interface ICreateOrder
             * @property {number|Long|null} [id] CreateOrder id
             */

            /**
             * Constructs a new CreateOrder.
             * @memberof market.mass
             * @classdesc Represents a CreateOrder.
             * @implements ICreateOrder
             * @constructor
             * @param {market.mass.ICreateOrder=} [properties] Properties to set
             */
            function CreateOrder(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * CreateOrder id.
             * @member {number|Long} id
             * @memberof market.mass.CreateOrder
             * @instance
             */
            CreateOrder.prototype.id = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * Creates a new CreateOrder instance using the specified properties.
             * @function create
             * @memberof market.mass.CreateOrder
             * @static
             * @param {market.mass.ICreateOrder=} [properties] Properties to set
             * @returns {market.mass.CreateOrder} CreateOrder instance
             */
            CreateOrder.create = function create(properties) {
                return new CreateOrder(properties);
            };

            /**
             * Encodes the specified CreateOrder message. Does not implicitly {@link market.mass.CreateOrder.verify|verify} messages.
             * @function encode
             * @memberof market.mass.CreateOrder
             * @static
             * @param {market.mass.ICreateOrder} message CreateOrder message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CreateOrder.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.id);
                return writer;
            };

            /**
             * Encodes the specified CreateOrder message, length delimited. Does not implicitly {@link market.mass.CreateOrder.verify|verify} messages.
             * @function encodeDelimited
             * @memberof market.mass.CreateOrder
             * @static
             * @param {market.mass.ICreateOrder} message CreateOrder message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CreateOrder.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a CreateOrder message from the specified reader or buffer.
             * @function decode
             * @memberof market.mass.CreateOrder
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {market.mass.CreateOrder} CreateOrder
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CreateOrder.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.CreateOrder();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.id = reader.uint64();
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
             * Decodes a CreateOrder message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof market.mass.CreateOrder
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {market.mass.CreateOrder} CreateOrder
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CreateOrder.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a CreateOrder message.
             * @function verify
             * @memberof market.mass.CreateOrder
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            CreateOrder.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.id != null && message.hasOwnProperty("id"))
                    if (!$util.isInteger(message.id) && !(message.id && $util.isInteger(message.id.low) && $util.isInteger(message.id.high)))
                        return "id: integer|Long expected";
                return null;
            };

            /**
             * Creates a CreateOrder message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof market.mass.CreateOrder
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {market.mass.CreateOrder} CreateOrder
             */
            CreateOrder.fromObject = function fromObject(object) {
                if (object instanceof $root.market.mass.CreateOrder)
                    return object;
                var message = new $root.market.mass.CreateOrder();
                if (object.id != null)
                    if ($util.Long)
                        (message.id = $util.Long.fromValue(object.id)).unsigned = true;
                    else if (typeof object.id === "string")
                        message.id = parseInt(object.id, 10);
                    else if (typeof object.id === "number")
                        message.id = object.id;
                    else if (typeof object.id === "object")
                        message.id = new $util.LongBits(object.id.low >>> 0, object.id.high >>> 0).toNumber(true);
                return message;
            };

            /**
             * Creates a plain object from a CreateOrder message. Also converts values to other types if specified.
             * @function toObject
             * @memberof market.mass.CreateOrder
             * @static
             * @param {market.mass.CreateOrder} message CreateOrder
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            CreateOrder.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.id = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.id = options.longs === String ? "0" : 0;
                if (message.id != null && message.hasOwnProperty("id"))
                    if (typeof message.id === "number")
                        object.id = options.longs === String ? String(message.id) : message.id;
                    else
                        object.id = options.longs === String ? $util.Long.prototype.toString.call(message.id) : options.longs === Number ? new $util.LongBits(message.id.low >>> 0, message.id.high >>> 0).toNumber(true) : message.id;
                return object;
            };

            /**
             * Converts this CreateOrder to JSON.
             * @function toJSON
             * @memberof market.mass.CreateOrder
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            CreateOrder.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for CreateOrder
             * @function getTypeUrl
             * @memberof market.mass.CreateOrder
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            CreateOrder.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/market.mass.CreateOrder";
            };

            return CreateOrder;
        })();

        mass.UpdateOrder = (function() {

            /**
             * Properties of an UpdateOrder.
             * @memberof market.mass
             * @interface IUpdateOrder
             * @property {number|Long|null} [id] UpdateOrder id
             * @property {market.mass.UpdateOrder.ICanceled|null} [canceled] UpdateOrder canceled
             * @property {market.mass.UpdateOrder.IChangeItems|null} [changeItems] UpdateOrder changeItems
             * @property {market.mass.IAddressDetails|null} [invoiceAddress] UpdateOrder invoiceAddress
             * @property {market.mass.IAddressDetails|null} [shippingAddress] UpdateOrder shippingAddress
             * @property {market.mass.UpdateOrder.ICommitItems|null} [commit] UpdateOrder commit
             * @property {market.mass.IPaymentDetails|null} [paymentDetails] UpdateOrder paymentDetails
             * @property {market.mass.IOrderPaid|null} [paid] UpdateOrder paid
             */

            /**
             * Constructs a new UpdateOrder.
             * @memberof market.mass
             * @classdesc Represents an UpdateOrder.
             * @implements IUpdateOrder
             * @constructor
             * @param {market.mass.IUpdateOrder=} [properties] Properties to set
             */
            function UpdateOrder(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * UpdateOrder id.
             * @member {number|Long} id
             * @memberof market.mass.UpdateOrder
             * @instance
             */
            UpdateOrder.prototype.id = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * UpdateOrder canceled.
             * @member {market.mass.UpdateOrder.ICanceled|null|undefined} canceled
             * @memberof market.mass.UpdateOrder
             * @instance
             */
            UpdateOrder.prototype.canceled = null;

            /**
             * UpdateOrder changeItems.
             * @member {market.mass.UpdateOrder.IChangeItems|null|undefined} changeItems
             * @memberof market.mass.UpdateOrder
             * @instance
             */
            UpdateOrder.prototype.changeItems = null;

            /**
             * UpdateOrder invoiceAddress.
             * @member {market.mass.IAddressDetails|null|undefined} invoiceAddress
             * @memberof market.mass.UpdateOrder
             * @instance
             */
            UpdateOrder.prototype.invoiceAddress = null;

            /**
             * UpdateOrder shippingAddress.
             * @member {market.mass.IAddressDetails|null|undefined} shippingAddress
             * @memberof market.mass.UpdateOrder
             * @instance
             */
            UpdateOrder.prototype.shippingAddress = null;

            /**
             * UpdateOrder commit.
             * @member {market.mass.UpdateOrder.ICommitItems|null|undefined} commit
             * @memberof market.mass.UpdateOrder
             * @instance
             */
            UpdateOrder.prototype.commit = null;

            /**
             * UpdateOrder paymentDetails.
             * @member {market.mass.IPaymentDetails|null|undefined} paymentDetails
             * @memberof market.mass.UpdateOrder
             * @instance
             */
            UpdateOrder.prototype.paymentDetails = null;

            /**
             * UpdateOrder paid.
             * @member {market.mass.IOrderPaid|null|undefined} paid
             * @memberof market.mass.UpdateOrder
             * @instance
             */
            UpdateOrder.prototype.paid = null;

            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;

            /**
             * UpdateOrder action.
             * @member {"canceled"|"changeItems"|"invoiceAddress"|"shippingAddress"|"commit"|"paymentDetails"|"paid"|undefined} action
             * @memberof market.mass.UpdateOrder
             * @instance
             */
            Object.defineProperty(UpdateOrder.prototype, "action", {
                get: $util.oneOfGetter($oneOfFields = ["canceled", "changeItems", "invoiceAddress", "shippingAddress", "commit", "paymentDetails", "paid"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new UpdateOrder instance using the specified properties.
             * @function create
             * @memberof market.mass.UpdateOrder
             * @static
             * @param {market.mass.IUpdateOrder=} [properties] Properties to set
             * @returns {market.mass.UpdateOrder} UpdateOrder instance
             */
            UpdateOrder.create = function create(properties) {
                return new UpdateOrder(properties);
            };

            /**
             * Encodes the specified UpdateOrder message. Does not implicitly {@link market.mass.UpdateOrder.verify|verify} messages.
             * @function encode
             * @memberof market.mass.UpdateOrder
             * @static
             * @param {market.mass.IUpdateOrder} message UpdateOrder message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UpdateOrder.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.id);
                if (message.canceled != null && Object.hasOwnProperty.call(message, "canceled"))
                    $root.market.mass.UpdateOrder.Canceled.encode(message.canceled, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                if (message.changeItems != null && Object.hasOwnProperty.call(message, "changeItems"))
                    $root.market.mass.UpdateOrder.ChangeItems.encode(message.changeItems, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                if (message.invoiceAddress != null && Object.hasOwnProperty.call(message, "invoiceAddress"))
                    $root.market.mass.AddressDetails.encode(message.invoiceAddress, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                if (message.shippingAddress != null && Object.hasOwnProperty.call(message, "shippingAddress"))
                    $root.market.mass.AddressDetails.encode(message.shippingAddress, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
                if (message.commit != null && Object.hasOwnProperty.call(message, "commit"))
                    $root.market.mass.UpdateOrder.CommitItems.encode(message.commit, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
                if (message.paymentDetails != null && Object.hasOwnProperty.call(message, "paymentDetails"))
                    $root.market.mass.PaymentDetails.encode(message.paymentDetails, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
                if (message.paid != null && Object.hasOwnProperty.call(message, "paid"))
                    $root.market.mass.OrderPaid.encode(message.paid, writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified UpdateOrder message, length delimited. Does not implicitly {@link market.mass.UpdateOrder.verify|verify} messages.
             * @function encodeDelimited
             * @memberof market.mass.UpdateOrder
             * @static
             * @param {market.mass.IUpdateOrder} message UpdateOrder message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UpdateOrder.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an UpdateOrder message from the specified reader or buffer.
             * @function decode
             * @memberof market.mass.UpdateOrder
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {market.mass.UpdateOrder} UpdateOrder
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            UpdateOrder.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.UpdateOrder();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.id = reader.uint64();
                            break;
                        }
                    case 2: {
                            message.canceled = $root.market.mass.UpdateOrder.Canceled.decode(reader, reader.uint32());
                            break;
                        }
                    case 3: {
                            message.changeItems = $root.market.mass.UpdateOrder.ChangeItems.decode(reader, reader.uint32());
                            break;
                        }
                    case 4: {
                            message.invoiceAddress = $root.market.mass.AddressDetails.decode(reader, reader.uint32());
                            break;
                        }
                    case 5: {
                            message.shippingAddress = $root.market.mass.AddressDetails.decode(reader, reader.uint32());
                            break;
                        }
                    case 6: {
                            message.commit = $root.market.mass.UpdateOrder.CommitItems.decode(reader, reader.uint32());
                            break;
                        }
                    case 7: {
                            message.paymentDetails = $root.market.mass.PaymentDetails.decode(reader, reader.uint32());
                            break;
                        }
                    case 8: {
                            message.paid = $root.market.mass.OrderPaid.decode(reader, reader.uint32());
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
             * Decodes an UpdateOrder message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof market.mass.UpdateOrder
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {market.mass.UpdateOrder} UpdateOrder
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            UpdateOrder.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an UpdateOrder message.
             * @function verify
             * @memberof market.mass.UpdateOrder
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            UpdateOrder.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                var properties = {};
                if (message.id != null && message.hasOwnProperty("id"))
                    if (!$util.isInteger(message.id) && !(message.id && $util.isInteger(message.id.low) && $util.isInteger(message.id.high)))
                        return "id: integer|Long expected";
                if (message.canceled != null && message.hasOwnProperty("canceled")) {
                    properties.action = 1;
                    {
                        var error = $root.market.mass.UpdateOrder.Canceled.verify(message.canceled);
                        if (error)
                            return "canceled." + error;
                    }
                }
                if (message.changeItems != null && message.hasOwnProperty("changeItems")) {
                    if (properties.action === 1)
                        return "action: multiple values";
                    properties.action = 1;
                    {
                        var error = $root.market.mass.UpdateOrder.ChangeItems.verify(message.changeItems);
                        if (error)
                            return "changeItems." + error;
                    }
                }
                if (message.invoiceAddress != null && message.hasOwnProperty("invoiceAddress")) {
                    if (properties.action === 1)
                        return "action: multiple values";
                    properties.action = 1;
                    {
                        var error = $root.market.mass.AddressDetails.verify(message.invoiceAddress);
                        if (error)
                            return "invoiceAddress." + error;
                    }
                }
                if (message.shippingAddress != null && message.hasOwnProperty("shippingAddress")) {
                    if (properties.action === 1)
                        return "action: multiple values";
                    properties.action = 1;
                    {
                        var error = $root.market.mass.AddressDetails.verify(message.shippingAddress);
                        if (error)
                            return "shippingAddress." + error;
                    }
                }
                if (message.commit != null && message.hasOwnProperty("commit")) {
                    if (properties.action === 1)
                        return "action: multiple values";
                    properties.action = 1;
                    {
                        var error = $root.market.mass.UpdateOrder.CommitItems.verify(message.commit);
                        if (error)
                            return "commit." + error;
                    }
                }
                if (message.paymentDetails != null && message.hasOwnProperty("paymentDetails")) {
                    if (properties.action === 1)
                        return "action: multiple values";
                    properties.action = 1;
                    {
                        var error = $root.market.mass.PaymentDetails.verify(message.paymentDetails);
                        if (error)
                            return "paymentDetails." + error;
                    }
                }
                if (message.paid != null && message.hasOwnProperty("paid")) {
                    if (properties.action === 1)
                        return "action: multiple values";
                    properties.action = 1;
                    {
                        var error = $root.market.mass.OrderPaid.verify(message.paid);
                        if (error)
                            return "paid." + error;
                    }
                }
                return null;
            };

            /**
             * Creates an UpdateOrder message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof market.mass.UpdateOrder
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {market.mass.UpdateOrder} UpdateOrder
             */
            UpdateOrder.fromObject = function fromObject(object) {
                if (object instanceof $root.market.mass.UpdateOrder)
                    return object;
                var message = new $root.market.mass.UpdateOrder();
                if (object.id != null)
                    if ($util.Long)
                        (message.id = $util.Long.fromValue(object.id)).unsigned = true;
                    else if (typeof object.id === "string")
                        message.id = parseInt(object.id, 10);
                    else if (typeof object.id === "number")
                        message.id = object.id;
                    else if (typeof object.id === "object")
                        message.id = new $util.LongBits(object.id.low >>> 0, object.id.high >>> 0).toNumber(true);
                if (object.canceled != null) {
                    if (typeof object.canceled !== "object")
                        throw TypeError(".market.mass.UpdateOrder.canceled: object expected");
                    message.canceled = $root.market.mass.UpdateOrder.Canceled.fromObject(object.canceled);
                }
                if (object.changeItems != null) {
                    if (typeof object.changeItems !== "object")
                        throw TypeError(".market.mass.UpdateOrder.changeItems: object expected");
                    message.changeItems = $root.market.mass.UpdateOrder.ChangeItems.fromObject(object.changeItems);
                }
                if (object.invoiceAddress != null) {
                    if (typeof object.invoiceAddress !== "object")
                        throw TypeError(".market.mass.UpdateOrder.invoiceAddress: object expected");
                    message.invoiceAddress = $root.market.mass.AddressDetails.fromObject(object.invoiceAddress);
                }
                if (object.shippingAddress != null) {
                    if (typeof object.shippingAddress !== "object")
                        throw TypeError(".market.mass.UpdateOrder.shippingAddress: object expected");
                    message.shippingAddress = $root.market.mass.AddressDetails.fromObject(object.shippingAddress);
                }
                if (object.commit != null) {
                    if (typeof object.commit !== "object")
                        throw TypeError(".market.mass.UpdateOrder.commit: object expected");
                    message.commit = $root.market.mass.UpdateOrder.CommitItems.fromObject(object.commit);
                }
                if (object.paymentDetails != null) {
                    if (typeof object.paymentDetails !== "object")
                        throw TypeError(".market.mass.UpdateOrder.paymentDetails: object expected");
                    message.paymentDetails = $root.market.mass.PaymentDetails.fromObject(object.paymentDetails);
                }
                if (object.paid != null) {
                    if (typeof object.paid !== "object")
                        throw TypeError(".market.mass.UpdateOrder.paid: object expected");
                    message.paid = $root.market.mass.OrderPaid.fromObject(object.paid);
                }
                return message;
            };

            /**
             * Creates a plain object from an UpdateOrder message. Also converts values to other types if specified.
             * @function toObject
             * @memberof market.mass.UpdateOrder
             * @static
             * @param {market.mass.UpdateOrder} message UpdateOrder
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            UpdateOrder.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.id = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.id = options.longs === String ? "0" : 0;
                if (message.id != null && message.hasOwnProperty("id"))
                    if (typeof message.id === "number")
                        object.id = options.longs === String ? String(message.id) : message.id;
                    else
                        object.id = options.longs === String ? $util.Long.prototype.toString.call(message.id) : options.longs === Number ? new $util.LongBits(message.id.low >>> 0, message.id.high >>> 0).toNumber(true) : message.id;
                if (message.canceled != null && message.hasOwnProperty("canceled")) {
                    object.canceled = $root.market.mass.UpdateOrder.Canceled.toObject(message.canceled, options);
                    if (options.oneofs)
                        object.action = "canceled";
                }
                if (message.changeItems != null && message.hasOwnProperty("changeItems")) {
                    object.changeItems = $root.market.mass.UpdateOrder.ChangeItems.toObject(message.changeItems, options);
                    if (options.oneofs)
                        object.action = "changeItems";
                }
                if (message.invoiceAddress != null && message.hasOwnProperty("invoiceAddress")) {
                    object.invoiceAddress = $root.market.mass.AddressDetails.toObject(message.invoiceAddress, options);
                    if (options.oneofs)
                        object.action = "invoiceAddress";
                }
                if (message.shippingAddress != null && message.hasOwnProperty("shippingAddress")) {
                    object.shippingAddress = $root.market.mass.AddressDetails.toObject(message.shippingAddress, options);
                    if (options.oneofs)
                        object.action = "shippingAddress";
                }
                if (message.commit != null && message.hasOwnProperty("commit")) {
                    object.commit = $root.market.mass.UpdateOrder.CommitItems.toObject(message.commit, options);
                    if (options.oneofs)
                        object.action = "commit";
                }
                if (message.paymentDetails != null && message.hasOwnProperty("paymentDetails")) {
                    object.paymentDetails = $root.market.mass.PaymentDetails.toObject(message.paymentDetails, options);
                    if (options.oneofs)
                        object.action = "paymentDetails";
                }
                if (message.paid != null && message.hasOwnProperty("paid")) {
                    object.paid = $root.market.mass.OrderPaid.toObject(message.paid, options);
                    if (options.oneofs)
                        object.action = "paid";
                }
                return object;
            };

            /**
             * Converts this UpdateOrder to JSON.
             * @function toJSON
             * @memberof market.mass.UpdateOrder
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            UpdateOrder.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for UpdateOrder
             * @function getTypeUrl
             * @memberof market.mass.UpdateOrder
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            UpdateOrder.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/market.mass.UpdateOrder";
            };

            UpdateOrder.ChangeItems = (function() {

                /**
                 * Properties of a ChangeItems.
                 * @memberof market.mass.UpdateOrder
                 * @interface IChangeItems
                 * @property {Array.<market.mass.IOrderedItem>|null} [adds] ChangeItems adds
                 * @property {Array.<market.mass.IOrderedItem>|null} [removes] ChangeItems removes
                 */

                /**
                 * Constructs a new ChangeItems.
                 * @memberof market.mass.UpdateOrder
                 * @classdesc Represents a ChangeItems.
                 * @implements IChangeItems
                 * @constructor
                 * @param {market.mass.UpdateOrder.IChangeItems=} [properties] Properties to set
                 */
                function ChangeItems(properties) {
                    this.adds = [];
                    this.removes = [];
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * ChangeItems adds.
                 * @member {Array.<market.mass.IOrderedItem>} adds
                 * @memberof market.mass.UpdateOrder.ChangeItems
                 * @instance
                 */
                ChangeItems.prototype.adds = $util.emptyArray;

                /**
                 * ChangeItems removes.
                 * @member {Array.<market.mass.IOrderedItem>} removes
                 * @memberof market.mass.UpdateOrder.ChangeItems
                 * @instance
                 */
                ChangeItems.prototype.removes = $util.emptyArray;

                /**
                 * Creates a new ChangeItems instance using the specified properties.
                 * @function create
                 * @memberof market.mass.UpdateOrder.ChangeItems
                 * @static
                 * @param {market.mass.UpdateOrder.IChangeItems=} [properties] Properties to set
                 * @returns {market.mass.UpdateOrder.ChangeItems} ChangeItems instance
                 */
                ChangeItems.create = function create(properties) {
                    return new ChangeItems(properties);
                };

                /**
                 * Encodes the specified ChangeItems message. Does not implicitly {@link market.mass.UpdateOrder.ChangeItems.verify|verify} messages.
                 * @function encode
                 * @memberof market.mass.UpdateOrder.ChangeItems
                 * @static
                 * @param {market.mass.UpdateOrder.IChangeItems} message ChangeItems message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ChangeItems.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.adds != null && message.adds.length)
                        for (var i = 0; i < message.adds.length; ++i)
                            $root.market.mass.OrderedItem.encode(message.adds[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                    if (message.removes != null && message.removes.length)
                        for (var i = 0; i < message.removes.length; ++i)
                            $root.market.mass.OrderedItem.encode(message.removes[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified ChangeItems message, length delimited. Does not implicitly {@link market.mass.UpdateOrder.ChangeItems.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof market.mass.UpdateOrder.ChangeItems
                 * @static
                 * @param {market.mass.UpdateOrder.IChangeItems} message ChangeItems message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ChangeItems.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a ChangeItems message from the specified reader or buffer.
                 * @function decode
                 * @memberof market.mass.UpdateOrder.ChangeItems
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {market.mass.UpdateOrder.ChangeItems} ChangeItems
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ChangeItems.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.UpdateOrder.ChangeItems();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1: {
                                if (!(message.adds && message.adds.length))
                                    message.adds = [];
                                message.adds.push($root.market.mass.OrderedItem.decode(reader, reader.uint32()));
                                break;
                            }
                        case 2: {
                                if (!(message.removes && message.removes.length))
                                    message.removes = [];
                                message.removes.push($root.market.mass.OrderedItem.decode(reader, reader.uint32()));
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
                 * Decodes a ChangeItems message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof market.mass.UpdateOrder.ChangeItems
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {market.mass.UpdateOrder.ChangeItems} ChangeItems
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ChangeItems.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a ChangeItems message.
                 * @function verify
                 * @memberof market.mass.UpdateOrder.ChangeItems
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                ChangeItems.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.adds != null && message.hasOwnProperty("adds")) {
                        if (!Array.isArray(message.adds))
                            return "adds: array expected";
                        for (var i = 0; i < message.adds.length; ++i) {
                            var error = $root.market.mass.OrderedItem.verify(message.adds[i]);
                            if (error)
                                return "adds." + error;
                        }
                    }
                    if (message.removes != null && message.hasOwnProperty("removes")) {
                        if (!Array.isArray(message.removes))
                            return "removes: array expected";
                        for (var i = 0; i < message.removes.length; ++i) {
                            var error = $root.market.mass.OrderedItem.verify(message.removes[i]);
                            if (error)
                                return "removes." + error;
                        }
                    }
                    return null;
                };

                /**
                 * Creates a ChangeItems message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof market.mass.UpdateOrder.ChangeItems
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {market.mass.UpdateOrder.ChangeItems} ChangeItems
                 */
                ChangeItems.fromObject = function fromObject(object) {
                    if (object instanceof $root.market.mass.UpdateOrder.ChangeItems)
                        return object;
                    var message = new $root.market.mass.UpdateOrder.ChangeItems();
                    if (object.adds) {
                        if (!Array.isArray(object.adds))
                            throw TypeError(".market.mass.UpdateOrder.ChangeItems.adds: array expected");
                        message.adds = [];
                        for (var i = 0; i < object.adds.length; ++i) {
                            if (typeof object.adds[i] !== "object")
                                throw TypeError(".market.mass.UpdateOrder.ChangeItems.adds: object expected");
                            message.adds[i] = $root.market.mass.OrderedItem.fromObject(object.adds[i]);
                        }
                    }
                    if (object.removes) {
                        if (!Array.isArray(object.removes))
                            throw TypeError(".market.mass.UpdateOrder.ChangeItems.removes: array expected");
                        message.removes = [];
                        for (var i = 0; i < object.removes.length; ++i) {
                            if (typeof object.removes[i] !== "object")
                                throw TypeError(".market.mass.UpdateOrder.ChangeItems.removes: object expected");
                            message.removes[i] = $root.market.mass.OrderedItem.fromObject(object.removes[i]);
                        }
                    }
                    return message;
                };

                /**
                 * Creates a plain object from a ChangeItems message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof market.mass.UpdateOrder.ChangeItems
                 * @static
                 * @param {market.mass.UpdateOrder.ChangeItems} message ChangeItems
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                ChangeItems.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.arrays || options.defaults) {
                        object.adds = [];
                        object.removes = [];
                    }
                    if (message.adds && message.adds.length) {
                        object.adds = [];
                        for (var j = 0; j < message.adds.length; ++j)
                            object.adds[j] = $root.market.mass.OrderedItem.toObject(message.adds[j], options);
                    }
                    if (message.removes && message.removes.length) {
                        object.removes = [];
                        for (var j = 0; j < message.removes.length; ++j)
                            object.removes[j] = $root.market.mass.OrderedItem.toObject(message.removes[j], options);
                    }
                    return object;
                };

                /**
                 * Converts this ChangeItems to JSON.
                 * @function toJSON
                 * @memberof market.mass.UpdateOrder.ChangeItems
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                ChangeItems.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * Gets the default type url for ChangeItems
                 * @function getTypeUrl
                 * @memberof market.mass.UpdateOrder.ChangeItems
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                ChangeItems.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/market.mass.UpdateOrder.ChangeItems";
                };

                return ChangeItems;
            })();

            UpdateOrder.CommitItems = (function() {

                /**
                 * Properties of a CommitItems.
                 * @memberof market.mass.UpdateOrder
                 * @interface ICommitItems
                 * @property {market.mass.IShopCurrency|null} [currency] CommitItems currency
                 * @property {market.mass.IPayee|null} [payee] CommitItems payee
                 * @property {google.protobuf.ITimestamp|null} [commitedAt] CommitItems commitedAt
                 */

                /**
                 * Constructs a new CommitItems.
                 * @memberof market.mass.UpdateOrder
                 * @classdesc Represents a CommitItems.
                 * @implements ICommitItems
                 * @constructor
                 * @param {market.mass.UpdateOrder.ICommitItems=} [properties] Properties to set
                 */
                function CommitItems(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * CommitItems currency.
                 * @member {market.mass.IShopCurrency|null|undefined} currency
                 * @memberof market.mass.UpdateOrder.CommitItems
                 * @instance
                 */
                CommitItems.prototype.currency = null;

                /**
                 * CommitItems payee.
                 * @member {market.mass.IPayee|null|undefined} payee
                 * @memberof market.mass.UpdateOrder.CommitItems
                 * @instance
                 */
                CommitItems.prototype.payee = null;

                /**
                 * CommitItems commitedAt.
                 * @member {google.protobuf.ITimestamp|null|undefined} commitedAt
                 * @memberof market.mass.UpdateOrder.CommitItems
                 * @instance
                 */
                CommitItems.prototype.commitedAt = null;

                /**
                 * Creates a new CommitItems instance using the specified properties.
                 * @function create
                 * @memberof market.mass.UpdateOrder.CommitItems
                 * @static
                 * @param {market.mass.UpdateOrder.ICommitItems=} [properties] Properties to set
                 * @returns {market.mass.UpdateOrder.CommitItems} CommitItems instance
                 */
                CommitItems.create = function create(properties) {
                    return new CommitItems(properties);
                };

                /**
                 * Encodes the specified CommitItems message. Does not implicitly {@link market.mass.UpdateOrder.CommitItems.verify|verify} messages.
                 * @function encode
                 * @memberof market.mass.UpdateOrder.CommitItems
                 * @static
                 * @param {market.mass.UpdateOrder.ICommitItems} message CommitItems message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                CommitItems.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.currency != null && Object.hasOwnProperty.call(message, "currency"))
                        $root.market.mass.ShopCurrency.encode(message.currency, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                    if (message.payee != null && Object.hasOwnProperty.call(message, "payee"))
                        $root.market.mass.Payee.encode(message.payee, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                    if (message.commitedAt != null && Object.hasOwnProperty.call(message, "commitedAt"))
                        $root.google.protobuf.Timestamp.encode(message.commitedAt, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified CommitItems message, length delimited. Does not implicitly {@link market.mass.UpdateOrder.CommitItems.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof market.mass.UpdateOrder.CommitItems
                 * @static
                 * @param {market.mass.UpdateOrder.ICommitItems} message CommitItems message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                CommitItems.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a CommitItems message from the specified reader or buffer.
                 * @function decode
                 * @memberof market.mass.UpdateOrder.CommitItems
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {market.mass.UpdateOrder.CommitItems} CommitItems
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                CommitItems.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.UpdateOrder.CommitItems();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1: {
                                message.currency = $root.market.mass.ShopCurrency.decode(reader, reader.uint32());
                                break;
                            }
                        case 2: {
                                message.payee = $root.market.mass.Payee.decode(reader, reader.uint32());
                                break;
                            }
                        case 3: {
                                message.commitedAt = $root.google.protobuf.Timestamp.decode(reader, reader.uint32());
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
                 * Decodes a CommitItems message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof market.mass.UpdateOrder.CommitItems
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {market.mass.UpdateOrder.CommitItems} CommitItems
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                CommitItems.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a CommitItems message.
                 * @function verify
                 * @memberof market.mass.UpdateOrder.CommitItems
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                CommitItems.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.currency != null && message.hasOwnProperty("currency")) {
                        var error = $root.market.mass.ShopCurrency.verify(message.currency);
                        if (error)
                            return "currency." + error;
                    }
                    if (message.payee != null && message.hasOwnProperty("payee")) {
                        var error = $root.market.mass.Payee.verify(message.payee);
                        if (error)
                            return "payee." + error;
                    }
                    if (message.commitedAt != null && message.hasOwnProperty("commitedAt")) {
                        var error = $root.google.protobuf.Timestamp.verify(message.commitedAt);
                        if (error)
                            return "commitedAt." + error;
                    }
                    return null;
                };

                /**
                 * Creates a CommitItems message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof market.mass.UpdateOrder.CommitItems
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {market.mass.UpdateOrder.CommitItems} CommitItems
                 */
                CommitItems.fromObject = function fromObject(object) {
                    if (object instanceof $root.market.mass.UpdateOrder.CommitItems)
                        return object;
                    var message = new $root.market.mass.UpdateOrder.CommitItems();
                    if (object.currency != null) {
                        if (typeof object.currency !== "object")
                            throw TypeError(".market.mass.UpdateOrder.CommitItems.currency: object expected");
                        message.currency = $root.market.mass.ShopCurrency.fromObject(object.currency);
                    }
                    if (object.payee != null) {
                        if (typeof object.payee !== "object")
                            throw TypeError(".market.mass.UpdateOrder.CommitItems.payee: object expected");
                        message.payee = $root.market.mass.Payee.fromObject(object.payee);
                    }
                    if (object.commitedAt != null) {
                        if (typeof object.commitedAt !== "object")
                            throw TypeError(".market.mass.UpdateOrder.CommitItems.commitedAt: object expected");
                        message.commitedAt = $root.google.protobuf.Timestamp.fromObject(object.commitedAt);
                    }
                    return message;
                };

                /**
                 * Creates a plain object from a CommitItems message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof market.mass.UpdateOrder.CommitItems
                 * @static
                 * @param {market.mass.UpdateOrder.CommitItems} message CommitItems
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                CommitItems.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.currency = null;
                        object.payee = null;
                        object.commitedAt = null;
                    }
                    if (message.currency != null && message.hasOwnProperty("currency"))
                        object.currency = $root.market.mass.ShopCurrency.toObject(message.currency, options);
                    if (message.payee != null && message.hasOwnProperty("payee"))
                        object.payee = $root.market.mass.Payee.toObject(message.payee, options);
                    if (message.commitedAt != null && message.hasOwnProperty("commitedAt"))
                        object.commitedAt = $root.google.protobuf.Timestamp.toObject(message.commitedAt, options);
                    return object;
                };

                /**
                 * Converts this CommitItems to JSON.
                 * @function toJSON
                 * @memberof market.mass.UpdateOrder.CommitItems
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                CommitItems.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * Gets the default type url for CommitItems
                 * @function getTypeUrl
                 * @memberof market.mass.UpdateOrder.CommitItems
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                CommitItems.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/market.mass.UpdateOrder.CommitItems";
                };

                return CommitItems;
            })();

            UpdateOrder.Canceled = (function() {

                /**
                 * Properties of a Canceled.
                 * @memberof market.mass.UpdateOrder
                 * @interface ICanceled
                 * @property {google.protobuf.ITimestamp|null} [canceldAt] Canceled canceldAt
                 */

                /**
                 * Constructs a new Canceled.
                 * @memberof market.mass.UpdateOrder
                 * @classdesc Represents a Canceled.
                 * @implements ICanceled
                 * @constructor
                 * @param {market.mass.UpdateOrder.ICanceled=} [properties] Properties to set
                 */
                function Canceled(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Canceled canceldAt.
                 * @member {google.protobuf.ITimestamp|null|undefined} canceldAt
                 * @memberof market.mass.UpdateOrder.Canceled
                 * @instance
                 */
                Canceled.prototype.canceldAt = null;

                /**
                 * Creates a new Canceled instance using the specified properties.
                 * @function create
                 * @memberof market.mass.UpdateOrder.Canceled
                 * @static
                 * @param {market.mass.UpdateOrder.ICanceled=} [properties] Properties to set
                 * @returns {market.mass.UpdateOrder.Canceled} Canceled instance
                 */
                Canceled.create = function create(properties) {
                    return new Canceled(properties);
                };

                /**
                 * Encodes the specified Canceled message. Does not implicitly {@link market.mass.UpdateOrder.Canceled.verify|verify} messages.
                 * @function encode
                 * @memberof market.mass.UpdateOrder.Canceled
                 * @static
                 * @param {market.mass.UpdateOrder.ICanceled} message Canceled message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Canceled.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.canceldAt != null && Object.hasOwnProperty.call(message, "canceldAt"))
                        $root.google.protobuf.Timestamp.encode(message.canceldAt, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified Canceled message, length delimited. Does not implicitly {@link market.mass.UpdateOrder.Canceled.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof market.mass.UpdateOrder.Canceled
                 * @static
                 * @param {market.mass.UpdateOrder.ICanceled} message Canceled message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Canceled.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a Canceled message from the specified reader or buffer.
                 * @function decode
                 * @memberof market.mass.UpdateOrder.Canceled
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {market.mass.UpdateOrder.Canceled} Canceled
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Canceled.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.UpdateOrder.Canceled();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1: {
                                message.canceldAt = $root.google.protobuf.Timestamp.decode(reader, reader.uint32());
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
                 * Decodes a Canceled message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof market.mass.UpdateOrder.Canceled
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {market.mass.UpdateOrder.Canceled} Canceled
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Canceled.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a Canceled message.
                 * @function verify
                 * @memberof market.mass.UpdateOrder.Canceled
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Canceled.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.canceldAt != null && message.hasOwnProperty("canceldAt")) {
                        var error = $root.google.protobuf.Timestamp.verify(message.canceldAt);
                        if (error)
                            return "canceldAt." + error;
                    }
                    return null;
                };

                /**
                 * Creates a Canceled message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof market.mass.UpdateOrder.Canceled
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {market.mass.UpdateOrder.Canceled} Canceled
                 */
                Canceled.fromObject = function fromObject(object) {
                    if (object instanceof $root.market.mass.UpdateOrder.Canceled)
                        return object;
                    var message = new $root.market.mass.UpdateOrder.Canceled();
                    if (object.canceldAt != null) {
                        if (typeof object.canceldAt !== "object")
                            throw TypeError(".market.mass.UpdateOrder.Canceled.canceldAt: object expected");
                        message.canceldAt = $root.google.protobuf.Timestamp.fromObject(object.canceldAt);
                    }
                    return message;
                };

                /**
                 * Creates a plain object from a Canceled message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof market.mass.UpdateOrder.Canceled
                 * @static
                 * @param {market.mass.UpdateOrder.Canceled} message Canceled
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Canceled.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults)
                        object.canceldAt = null;
                    if (message.canceldAt != null && message.hasOwnProperty("canceldAt"))
                        object.canceldAt = $root.google.protobuf.Timestamp.toObject(message.canceldAt, options);
                    return object;
                };

                /**
                 * Converts this Canceled to JSON.
                 * @function toJSON
                 * @memberof market.mass.UpdateOrder.Canceled
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Canceled.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * Gets the default type url for Canceled
                 * @function getTypeUrl
                 * @memberof market.mass.UpdateOrder.Canceled
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                Canceled.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/market.mass.UpdateOrder.Canceled";
                };

                return Canceled;
            })();

            return UpdateOrder;
        })();

        mass.ShopEvent = (function() {

            /**
             * Properties of a ShopEvent.
             * @memberof market.mass
             * @interface IShopEvent
             * @property {number|Long|null} [nonce] ShopEvent nonce
             * @property {market.mass.IUint256|null} [shopId] ShopEvent shopId
             * @property {google.protobuf.ITimestamp|null} [timestamp] ShopEvent timestamp
             * @property {market.mass.IManifest|null} [manifest] ShopEvent manifest
             * @property {market.mass.IUpdateManifest|null} [updateManifest] ShopEvent updateManifest
             * @property {market.mass.IAccount|null} [account] ShopEvent account
             * @property {market.mass.IListing|null} [listing] ShopEvent listing
             * @property {market.mass.IUpdateListing|null} [updateListing] ShopEvent updateListing
             * @property {market.mass.IChangeInventory|null} [changeInventory] ShopEvent changeInventory
             * @property {market.mass.ITag|null} [tag] ShopEvent tag
             * @property {market.mass.IUpdateTag|null} [updateTag] ShopEvent updateTag
             * @property {market.mass.ICreateOrder|null} [createOrder] ShopEvent createOrder
             * @property {market.mass.IUpdateOrder|null} [updateOrder] ShopEvent updateOrder
             */

            /**
             * Constructs a new ShopEvent.
             * @memberof market.mass
             * @classdesc Represents a ShopEvent.
             * @implements IShopEvent
             * @constructor
             * @param {market.mass.IShopEvent=} [properties] Properties to set
             */
            function ShopEvent(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * ShopEvent nonce.
             * @member {number|Long} nonce
             * @memberof market.mass.ShopEvent
             * @instance
             */
            ShopEvent.prototype.nonce = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * ShopEvent shopId.
             * @member {market.mass.IUint256|null|undefined} shopId
             * @memberof market.mass.ShopEvent
             * @instance
             */
            ShopEvent.prototype.shopId = null;

            /**
             * ShopEvent timestamp.
             * @member {google.protobuf.ITimestamp|null|undefined} timestamp
             * @memberof market.mass.ShopEvent
             * @instance
             */
            ShopEvent.prototype.timestamp = null;

            /**
             * ShopEvent manifest.
             * @member {market.mass.IManifest|null|undefined} manifest
             * @memberof market.mass.ShopEvent
             * @instance
             */
            ShopEvent.prototype.manifest = null;

            /**
             * ShopEvent updateManifest.
             * @member {market.mass.IUpdateManifest|null|undefined} updateManifest
             * @memberof market.mass.ShopEvent
             * @instance
             */
            ShopEvent.prototype.updateManifest = null;

            /**
             * ShopEvent account.
             * @member {market.mass.IAccount|null|undefined} account
             * @memberof market.mass.ShopEvent
             * @instance
             */
            ShopEvent.prototype.account = null;

            /**
             * ShopEvent listing.
             * @member {market.mass.IListing|null|undefined} listing
             * @memberof market.mass.ShopEvent
             * @instance
             */
            ShopEvent.prototype.listing = null;

            /**
             * ShopEvent updateListing.
             * @member {market.mass.IUpdateListing|null|undefined} updateListing
             * @memberof market.mass.ShopEvent
             * @instance
             */
            ShopEvent.prototype.updateListing = null;

            /**
             * ShopEvent changeInventory.
             * @member {market.mass.IChangeInventory|null|undefined} changeInventory
             * @memberof market.mass.ShopEvent
             * @instance
             */
            ShopEvent.prototype.changeInventory = null;

            /**
             * ShopEvent tag.
             * @member {market.mass.ITag|null|undefined} tag
             * @memberof market.mass.ShopEvent
             * @instance
             */
            ShopEvent.prototype.tag = null;

            /**
             * ShopEvent updateTag.
             * @member {market.mass.IUpdateTag|null|undefined} updateTag
             * @memberof market.mass.ShopEvent
             * @instance
             */
            ShopEvent.prototype.updateTag = null;

            /**
             * ShopEvent createOrder.
             * @member {market.mass.ICreateOrder|null|undefined} createOrder
             * @memberof market.mass.ShopEvent
             * @instance
             */
            ShopEvent.prototype.createOrder = null;

            /**
             * ShopEvent updateOrder.
             * @member {market.mass.IUpdateOrder|null|undefined} updateOrder
             * @memberof market.mass.ShopEvent
             * @instance
             */
            ShopEvent.prototype.updateOrder = null;

            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;

            /**
             * ShopEvent union.
             * @member {"manifest"|"updateManifest"|"account"|"listing"|"updateListing"|"changeInventory"|"tag"|"updateTag"|"createOrder"|"updateOrder"|undefined} union
             * @memberof market.mass.ShopEvent
             * @instance
             */
            Object.defineProperty(ShopEvent.prototype, "union", {
                get: $util.oneOfGetter($oneOfFields = ["manifest", "updateManifest", "account", "listing", "updateListing", "changeInventory", "tag", "updateTag", "createOrder", "updateOrder"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new ShopEvent instance using the specified properties.
             * @function create
             * @memberof market.mass.ShopEvent
             * @static
             * @param {market.mass.IShopEvent=} [properties] Properties to set
             * @returns {market.mass.ShopEvent} ShopEvent instance
             */
            ShopEvent.create = function create(properties) {
                return new ShopEvent(properties);
            };

            /**
             * Encodes the specified ShopEvent message. Does not implicitly {@link market.mass.ShopEvent.verify|verify} messages.
             * @function encode
             * @memberof market.mass.ShopEvent
             * @static
             * @param {market.mass.IShopEvent} message ShopEvent message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ShopEvent.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.nonce != null && Object.hasOwnProperty.call(message, "nonce"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.nonce);
                if (message.shopId != null && Object.hasOwnProperty.call(message, "shopId"))
                    $root.market.mass.Uint256.encode(message.shopId, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                    $root.google.protobuf.Timestamp.encode(message.timestamp, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                if (message.manifest != null && Object.hasOwnProperty.call(message, "manifest"))
                    $root.market.mass.Manifest.encode(message.manifest, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                if (message.updateManifest != null && Object.hasOwnProperty.call(message, "updateManifest"))
                    $root.market.mass.UpdateManifest.encode(message.updateManifest, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
                if (message.account != null && Object.hasOwnProperty.call(message, "account"))
                    $root.market.mass.Account.encode(message.account, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
                if (message.listing != null && Object.hasOwnProperty.call(message, "listing"))
                    $root.market.mass.Listing.encode(message.listing, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
                if (message.updateListing != null && Object.hasOwnProperty.call(message, "updateListing"))
                    $root.market.mass.UpdateListing.encode(message.updateListing, writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
                if (message.changeInventory != null && Object.hasOwnProperty.call(message, "changeInventory"))
                    $root.market.mass.ChangeInventory.encode(message.changeInventory, writer.uint32(/* id 9, wireType 2 =*/74).fork()).ldelim();
                if (message.tag != null && Object.hasOwnProperty.call(message, "tag"))
                    $root.market.mass.Tag.encode(message.tag, writer.uint32(/* id 10, wireType 2 =*/82).fork()).ldelim();
                if (message.updateTag != null && Object.hasOwnProperty.call(message, "updateTag"))
                    $root.market.mass.UpdateTag.encode(message.updateTag, writer.uint32(/* id 11, wireType 2 =*/90).fork()).ldelim();
                if (message.createOrder != null && Object.hasOwnProperty.call(message, "createOrder"))
                    $root.market.mass.CreateOrder.encode(message.createOrder, writer.uint32(/* id 12, wireType 2 =*/98).fork()).ldelim();
                if (message.updateOrder != null && Object.hasOwnProperty.call(message, "updateOrder"))
                    $root.market.mass.UpdateOrder.encode(message.updateOrder, writer.uint32(/* id 13, wireType 2 =*/106).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified ShopEvent message, length delimited. Does not implicitly {@link market.mass.ShopEvent.verify|verify} messages.
             * @function encodeDelimited
             * @memberof market.mass.ShopEvent
             * @static
             * @param {market.mass.IShopEvent} message ShopEvent message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ShopEvent.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a ShopEvent message from the specified reader or buffer.
             * @function decode
             * @memberof market.mass.ShopEvent
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {market.mass.ShopEvent} ShopEvent
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ShopEvent.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.ShopEvent();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.nonce = reader.uint64();
                            break;
                        }
                    case 2: {
                            message.shopId = $root.market.mass.Uint256.decode(reader, reader.uint32());
                            break;
                        }
                    case 3: {
                            message.timestamp = $root.google.protobuf.Timestamp.decode(reader, reader.uint32());
                            break;
                        }
                    case 4: {
                            message.manifest = $root.market.mass.Manifest.decode(reader, reader.uint32());
                            break;
                        }
                    case 5: {
                            message.updateManifest = $root.market.mass.UpdateManifest.decode(reader, reader.uint32());
                            break;
                        }
                    case 6: {
                            message.account = $root.market.mass.Account.decode(reader, reader.uint32());
                            break;
                        }
                    case 7: {
                            message.listing = $root.market.mass.Listing.decode(reader, reader.uint32());
                            break;
                        }
                    case 8: {
                            message.updateListing = $root.market.mass.UpdateListing.decode(reader, reader.uint32());
                            break;
                        }
                    case 9: {
                            message.changeInventory = $root.market.mass.ChangeInventory.decode(reader, reader.uint32());
                            break;
                        }
                    case 10: {
                            message.tag = $root.market.mass.Tag.decode(reader, reader.uint32());
                            break;
                        }
                    case 11: {
                            message.updateTag = $root.market.mass.UpdateTag.decode(reader, reader.uint32());
                            break;
                        }
                    case 12: {
                            message.createOrder = $root.market.mass.CreateOrder.decode(reader, reader.uint32());
                            break;
                        }
                    case 13: {
                            message.updateOrder = $root.market.mass.UpdateOrder.decode(reader, reader.uint32());
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
             * Decodes a ShopEvent message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof market.mass.ShopEvent
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {market.mass.ShopEvent} ShopEvent
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ShopEvent.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ShopEvent message.
             * @function verify
             * @memberof market.mass.ShopEvent
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ShopEvent.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                var properties = {};
                if (message.nonce != null && message.hasOwnProperty("nonce"))
                    if (!$util.isInteger(message.nonce) && !(message.nonce && $util.isInteger(message.nonce.low) && $util.isInteger(message.nonce.high)))
                        return "nonce: integer|Long expected";
                if (message.shopId != null && message.hasOwnProperty("shopId")) {
                    var error = $root.market.mass.Uint256.verify(message.shopId);
                    if (error)
                        return "shopId." + error;
                }
                if (message.timestamp != null && message.hasOwnProperty("timestamp")) {
                    var error = $root.google.protobuf.Timestamp.verify(message.timestamp);
                    if (error)
                        return "timestamp." + error;
                }
                if (message.manifest != null && message.hasOwnProperty("manifest")) {
                    properties.union = 1;
                    {
                        var error = $root.market.mass.Manifest.verify(message.manifest);
                        if (error)
                            return "manifest." + error;
                    }
                }
                if (message.updateManifest != null && message.hasOwnProperty("updateManifest")) {
                    if (properties.union === 1)
                        return "union: multiple values";
                    properties.union = 1;
                    {
                        var error = $root.market.mass.UpdateManifest.verify(message.updateManifest);
                        if (error)
                            return "updateManifest." + error;
                    }
                }
                if (message.account != null && message.hasOwnProperty("account")) {
                    if (properties.union === 1)
                        return "union: multiple values";
                    properties.union = 1;
                    {
                        var error = $root.market.mass.Account.verify(message.account);
                        if (error)
                            return "account." + error;
                    }
                }
                if (message.listing != null && message.hasOwnProperty("listing")) {
                    if (properties.union === 1)
                        return "union: multiple values";
                    properties.union = 1;
                    {
                        var error = $root.market.mass.Listing.verify(message.listing);
                        if (error)
                            return "listing." + error;
                    }
                }
                if (message.updateListing != null && message.hasOwnProperty("updateListing")) {
                    if (properties.union === 1)
                        return "union: multiple values";
                    properties.union = 1;
                    {
                        var error = $root.market.mass.UpdateListing.verify(message.updateListing);
                        if (error)
                            return "updateListing." + error;
                    }
                }
                if (message.changeInventory != null && message.hasOwnProperty("changeInventory")) {
                    if (properties.union === 1)
                        return "union: multiple values";
                    properties.union = 1;
                    {
                        var error = $root.market.mass.ChangeInventory.verify(message.changeInventory);
                        if (error)
                            return "changeInventory." + error;
                    }
                }
                if (message.tag != null && message.hasOwnProperty("tag")) {
                    if (properties.union === 1)
                        return "union: multiple values";
                    properties.union = 1;
                    {
                        var error = $root.market.mass.Tag.verify(message.tag);
                        if (error)
                            return "tag." + error;
                    }
                }
                if (message.updateTag != null && message.hasOwnProperty("updateTag")) {
                    if (properties.union === 1)
                        return "union: multiple values";
                    properties.union = 1;
                    {
                        var error = $root.market.mass.UpdateTag.verify(message.updateTag);
                        if (error)
                            return "updateTag." + error;
                    }
                }
                if (message.createOrder != null && message.hasOwnProperty("createOrder")) {
                    if (properties.union === 1)
                        return "union: multiple values";
                    properties.union = 1;
                    {
                        var error = $root.market.mass.CreateOrder.verify(message.createOrder);
                        if (error)
                            return "createOrder." + error;
                    }
                }
                if (message.updateOrder != null && message.hasOwnProperty("updateOrder")) {
                    if (properties.union === 1)
                        return "union: multiple values";
                    properties.union = 1;
                    {
                        var error = $root.market.mass.UpdateOrder.verify(message.updateOrder);
                        if (error)
                            return "updateOrder." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a ShopEvent message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof market.mass.ShopEvent
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {market.mass.ShopEvent} ShopEvent
             */
            ShopEvent.fromObject = function fromObject(object) {
                if (object instanceof $root.market.mass.ShopEvent)
                    return object;
                var message = new $root.market.mass.ShopEvent();
                if (object.nonce != null)
                    if ($util.Long)
                        (message.nonce = $util.Long.fromValue(object.nonce)).unsigned = true;
                    else if (typeof object.nonce === "string")
                        message.nonce = parseInt(object.nonce, 10);
                    else if (typeof object.nonce === "number")
                        message.nonce = object.nonce;
                    else if (typeof object.nonce === "object")
                        message.nonce = new $util.LongBits(object.nonce.low >>> 0, object.nonce.high >>> 0).toNumber(true);
                if (object.shopId != null) {
                    if (typeof object.shopId !== "object")
                        throw TypeError(".market.mass.ShopEvent.shopId: object expected");
                    message.shopId = $root.market.mass.Uint256.fromObject(object.shopId);
                }
                if (object.timestamp != null) {
                    if (typeof object.timestamp !== "object")
                        throw TypeError(".market.mass.ShopEvent.timestamp: object expected");
                    message.timestamp = $root.google.protobuf.Timestamp.fromObject(object.timestamp);
                }
                if (object.manifest != null) {
                    if (typeof object.manifest !== "object")
                        throw TypeError(".market.mass.ShopEvent.manifest: object expected");
                    message.manifest = $root.market.mass.Manifest.fromObject(object.manifest);
                }
                if (object.updateManifest != null) {
                    if (typeof object.updateManifest !== "object")
                        throw TypeError(".market.mass.ShopEvent.updateManifest: object expected");
                    message.updateManifest = $root.market.mass.UpdateManifest.fromObject(object.updateManifest);
                }
                if (object.account != null) {
                    if (typeof object.account !== "object")
                        throw TypeError(".market.mass.ShopEvent.account: object expected");
                    message.account = $root.market.mass.Account.fromObject(object.account);
                }
                if (object.listing != null) {
                    if (typeof object.listing !== "object")
                        throw TypeError(".market.mass.ShopEvent.listing: object expected");
                    message.listing = $root.market.mass.Listing.fromObject(object.listing);
                }
                if (object.updateListing != null) {
                    if (typeof object.updateListing !== "object")
                        throw TypeError(".market.mass.ShopEvent.updateListing: object expected");
                    message.updateListing = $root.market.mass.UpdateListing.fromObject(object.updateListing);
                }
                if (object.changeInventory != null) {
                    if (typeof object.changeInventory !== "object")
                        throw TypeError(".market.mass.ShopEvent.changeInventory: object expected");
                    message.changeInventory = $root.market.mass.ChangeInventory.fromObject(object.changeInventory);
                }
                if (object.tag != null) {
                    if (typeof object.tag !== "object")
                        throw TypeError(".market.mass.ShopEvent.tag: object expected");
                    message.tag = $root.market.mass.Tag.fromObject(object.tag);
                }
                if (object.updateTag != null) {
                    if (typeof object.updateTag !== "object")
                        throw TypeError(".market.mass.ShopEvent.updateTag: object expected");
                    message.updateTag = $root.market.mass.UpdateTag.fromObject(object.updateTag);
                }
                if (object.createOrder != null) {
                    if (typeof object.createOrder !== "object")
                        throw TypeError(".market.mass.ShopEvent.createOrder: object expected");
                    message.createOrder = $root.market.mass.CreateOrder.fromObject(object.createOrder);
                }
                if (object.updateOrder != null) {
                    if (typeof object.updateOrder !== "object")
                        throw TypeError(".market.mass.ShopEvent.updateOrder: object expected");
                    message.updateOrder = $root.market.mass.UpdateOrder.fromObject(object.updateOrder);
                }
                return message;
            };

            /**
             * Creates a plain object from a ShopEvent message. Also converts values to other types if specified.
             * @function toObject
             * @memberof market.mass.ShopEvent
             * @static
             * @param {market.mass.ShopEvent} message ShopEvent
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ShopEvent.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.nonce = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.nonce = options.longs === String ? "0" : 0;
                    object.shopId = null;
                    object.timestamp = null;
                }
                if (message.nonce != null && message.hasOwnProperty("nonce"))
                    if (typeof message.nonce === "number")
                        object.nonce = options.longs === String ? String(message.nonce) : message.nonce;
                    else
                        object.nonce = options.longs === String ? $util.Long.prototype.toString.call(message.nonce) : options.longs === Number ? new $util.LongBits(message.nonce.low >>> 0, message.nonce.high >>> 0).toNumber(true) : message.nonce;
                if (message.shopId != null && message.hasOwnProperty("shopId"))
                    object.shopId = $root.market.mass.Uint256.toObject(message.shopId, options);
                if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                    object.timestamp = $root.google.protobuf.Timestamp.toObject(message.timestamp, options);
                if (message.manifest != null && message.hasOwnProperty("manifest")) {
                    object.manifest = $root.market.mass.Manifest.toObject(message.manifest, options);
                    if (options.oneofs)
                        object.union = "manifest";
                }
                if (message.updateManifest != null && message.hasOwnProperty("updateManifest")) {
                    object.updateManifest = $root.market.mass.UpdateManifest.toObject(message.updateManifest, options);
                    if (options.oneofs)
                        object.union = "updateManifest";
                }
                if (message.account != null && message.hasOwnProperty("account")) {
                    object.account = $root.market.mass.Account.toObject(message.account, options);
                    if (options.oneofs)
                        object.union = "account";
                }
                if (message.listing != null && message.hasOwnProperty("listing")) {
                    object.listing = $root.market.mass.Listing.toObject(message.listing, options);
                    if (options.oneofs)
                        object.union = "listing";
                }
                if (message.updateListing != null && message.hasOwnProperty("updateListing")) {
                    object.updateListing = $root.market.mass.UpdateListing.toObject(message.updateListing, options);
                    if (options.oneofs)
                        object.union = "updateListing";
                }
                if (message.changeInventory != null && message.hasOwnProperty("changeInventory")) {
                    object.changeInventory = $root.market.mass.ChangeInventory.toObject(message.changeInventory, options);
                    if (options.oneofs)
                        object.union = "changeInventory";
                }
                if (message.tag != null && message.hasOwnProperty("tag")) {
                    object.tag = $root.market.mass.Tag.toObject(message.tag, options);
                    if (options.oneofs)
                        object.union = "tag";
                }
                if (message.updateTag != null && message.hasOwnProperty("updateTag")) {
                    object.updateTag = $root.market.mass.UpdateTag.toObject(message.updateTag, options);
                    if (options.oneofs)
                        object.union = "updateTag";
                }
                if (message.createOrder != null && message.hasOwnProperty("createOrder")) {
                    object.createOrder = $root.market.mass.CreateOrder.toObject(message.createOrder, options);
                    if (options.oneofs)
                        object.union = "createOrder";
                }
                if (message.updateOrder != null && message.hasOwnProperty("updateOrder")) {
                    object.updateOrder = $root.market.mass.UpdateOrder.toObject(message.updateOrder, options);
                    if (options.oneofs)
                        object.union = "updateOrder";
                }
                return object;
            };

            /**
             * Converts this ShopEvent to JSON.
             * @function toJSON
             * @memberof market.mass.ShopEvent
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ShopEvent.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for ShopEvent
             * @function getTypeUrl
             * @memberof market.mass.ShopEvent
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            ShopEvent.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/market.mass.ShopEvent";
            };

            return ShopEvent;
        })();

        return mass;
    })();

    return market;
})();

$root.google = (function() {

    /**
     * Namespace google.
     * @exports google
     * @namespace
     */
    var google = {};

    google.protobuf = (function() {

        /**
         * Namespace protobuf.
         * @memberof google
         * @namespace
         */
        var protobuf = {};

        protobuf.Timestamp = (function() {

            /**
             * Properties of a Timestamp.
             * @memberof google.protobuf
             * @interface ITimestamp
             * @property {number|Long|null} [seconds] Timestamp seconds
             * @property {number|null} [nanos] Timestamp nanos
             */

            /**
             * Constructs a new Timestamp.
             * @memberof google.protobuf
             * @classdesc Represents a Timestamp.
             * @implements ITimestamp
             * @constructor
             * @param {google.protobuf.ITimestamp=} [properties] Properties to set
             */
            function Timestamp(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Timestamp seconds.
             * @member {number|Long} seconds
             * @memberof google.protobuf.Timestamp
             * @instance
             */
            Timestamp.prototype.seconds = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

            /**
             * Timestamp nanos.
             * @member {number} nanos
             * @memberof google.protobuf.Timestamp
             * @instance
             */
            Timestamp.prototype.nanos = 0;

            /**
             * Creates a new Timestamp instance using the specified properties.
             * @function create
             * @memberof google.protobuf.Timestamp
             * @static
             * @param {google.protobuf.ITimestamp=} [properties] Properties to set
             * @returns {google.protobuf.Timestamp} Timestamp instance
             */
            Timestamp.create = function create(properties) {
                return new Timestamp(properties);
            };

            /**
             * Encodes the specified Timestamp message. Does not implicitly {@link google.protobuf.Timestamp.verify|verify} messages.
             * @function encode
             * @memberof google.protobuf.Timestamp
             * @static
             * @param {google.protobuf.ITimestamp} message Timestamp message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Timestamp.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.seconds != null && Object.hasOwnProperty.call(message, "seconds"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int64(message.seconds);
                if (message.nanos != null && Object.hasOwnProperty.call(message, "nanos"))
                    writer.uint32(/* id 2, wireType 0 =*/16).int32(message.nanos);
                return writer;
            };

            /**
             * Encodes the specified Timestamp message, length delimited. Does not implicitly {@link google.protobuf.Timestamp.verify|verify} messages.
             * @function encodeDelimited
             * @memberof google.protobuf.Timestamp
             * @static
             * @param {google.protobuf.ITimestamp} message Timestamp message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Timestamp.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a Timestamp message from the specified reader or buffer.
             * @function decode
             * @memberof google.protobuf.Timestamp
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.Timestamp} Timestamp
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Timestamp.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.Timestamp();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.seconds = reader.int64();
                            break;
                        }
                    case 2: {
                            message.nanos = reader.int32();
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
             * Decodes a Timestamp message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof google.protobuf.Timestamp
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.Timestamp} Timestamp
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Timestamp.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Timestamp message.
             * @function verify
             * @memberof google.protobuf.Timestamp
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Timestamp.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.seconds != null && message.hasOwnProperty("seconds"))
                    if (!$util.isInteger(message.seconds) && !(message.seconds && $util.isInteger(message.seconds.low) && $util.isInteger(message.seconds.high)))
                        return "seconds: integer|Long expected";
                if (message.nanos != null && message.hasOwnProperty("nanos"))
                    if (!$util.isInteger(message.nanos))
                        return "nanos: integer expected";
                return null;
            };

            /**
             * Creates a Timestamp message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof google.protobuf.Timestamp
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.Timestamp} Timestamp
             */
            Timestamp.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.Timestamp)
                    return object;
                var message = new $root.google.protobuf.Timestamp();
                if (object.seconds != null)
                    if ($util.Long)
                        (message.seconds = $util.Long.fromValue(object.seconds)).unsigned = false;
                    else if (typeof object.seconds === "string")
                        message.seconds = parseInt(object.seconds, 10);
                    else if (typeof object.seconds === "number")
                        message.seconds = object.seconds;
                    else if (typeof object.seconds === "object")
                        message.seconds = new $util.LongBits(object.seconds.low >>> 0, object.seconds.high >>> 0).toNumber();
                if (object.nanos != null)
                    message.nanos = object.nanos | 0;
                return message;
            };

            /**
             * Creates a plain object from a Timestamp message. Also converts values to other types if specified.
             * @function toObject
             * @memberof google.protobuf.Timestamp
             * @static
             * @param {google.protobuf.Timestamp} message Timestamp
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Timestamp.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, false);
                        object.seconds = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.seconds = options.longs === String ? "0" : 0;
                    object.nanos = 0;
                }
                if (message.seconds != null && message.hasOwnProperty("seconds"))
                    if (typeof message.seconds === "number")
                        object.seconds = options.longs === String ? String(message.seconds) : message.seconds;
                    else
                        object.seconds = options.longs === String ? $util.Long.prototype.toString.call(message.seconds) : options.longs === Number ? new $util.LongBits(message.seconds.low >>> 0, message.seconds.high >>> 0).toNumber() : message.seconds;
                if (message.nanos != null && message.hasOwnProperty("nanos"))
                    object.nanos = message.nanos;
                return object;
            };

            /**
             * Converts this Timestamp to JSON.
             * @function toJSON
             * @memberof google.protobuf.Timestamp
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Timestamp.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for Timestamp
             * @function getTypeUrl
             * @memberof google.protobuf.Timestamp
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            Timestamp.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/google.protobuf.Timestamp";
            };

            return Timestamp;
        })();

        protobuf.Any = (function() {

            /**
             * Properties of an Any.
             * @memberof google.protobuf
             * @interface IAny
             * @property {string|null} [type_url] Any type_url
             * @property {Uint8Array|null} [value] Any value
             */

            /**
             * Constructs a new Any.
             * @memberof google.protobuf
             * @classdesc Represents an Any.
             * @implements IAny
             * @constructor
             * @param {google.protobuf.IAny=} [properties] Properties to set
             */
            function Any(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Any type_url.
             * @member {string} type_url
             * @memberof google.protobuf.Any
             * @instance
             */
            Any.prototype.type_url = "";

            /**
             * Any value.
             * @member {Uint8Array} value
             * @memberof google.protobuf.Any
             * @instance
             */
            Any.prototype.value = $util.newBuffer([]);

            /**
             * Creates a new Any instance using the specified properties.
             * @function create
             * @memberof google.protobuf.Any
             * @static
             * @param {google.protobuf.IAny=} [properties] Properties to set
             * @returns {google.protobuf.Any} Any instance
             */
            Any.create = function create(properties) {
                return new Any(properties);
            };

            /**
             * Encodes the specified Any message. Does not implicitly {@link google.protobuf.Any.verify|verify} messages.
             * @function encode
             * @memberof google.protobuf.Any
             * @static
             * @param {google.protobuf.IAny} message Any message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Any.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.type_url != null && Object.hasOwnProperty.call(message, "type_url"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.type_url);
                if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                    writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.value);
                return writer;
            };

            /**
             * Encodes the specified Any message, length delimited. Does not implicitly {@link google.protobuf.Any.verify|verify} messages.
             * @function encodeDelimited
             * @memberof google.protobuf.Any
             * @static
             * @param {google.protobuf.IAny} message Any message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Any.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an Any message from the specified reader or buffer.
             * @function decode
             * @memberof google.protobuf.Any
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.Any} Any
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Any.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.Any();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.type_url = reader.string();
                            break;
                        }
                    case 2: {
                            message.value = reader.bytes();
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
             * Decodes an Any message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof google.protobuf.Any
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.Any} Any
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Any.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an Any message.
             * @function verify
             * @memberof google.protobuf.Any
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Any.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.type_url != null && message.hasOwnProperty("type_url"))
                    if (!$util.isString(message.type_url))
                        return "type_url: string expected";
                if (message.value != null && message.hasOwnProperty("value"))
                    if (!(message.value && typeof message.value.length === "number" || $util.isString(message.value)))
                        return "value: buffer expected";
                return null;
            };

            /**
             * Creates an Any message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof google.protobuf.Any
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.Any} Any
             */
            Any.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.Any)
                    return object;
                var message = new $root.google.protobuf.Any();
                if (object.type_url != null)
                    message.type_url = String(object.type_url);
                if (object.value != null)
                    if (typeof object.value === "string")
                        $util.base64.decode(object.value, message.value = $util.newBuffer($util.base64.length(object.value)), 0);
                    else if (object.value.length >= 0)
                        message.value = object.value;
                return message;
            };

            /**
             * Creates a plain object from an Any message. Also converts values to other types if specified.
             * @function toObject
             * @memberof google.protobuf.Any
             * @static
             * @param {google.protobuf.Any} message Any
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Any.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.type_url = "";
                    if (options.bytes === String)
                        object.value = "";
                    else {
                        object.value = [];
                        if (options.bytes !== Array)
                            object.value = $util.newBuffer(object.value);
                    }
                }
                if (message.type_url != null && message.hasOwnProperty("type_url"))
                    object.type_url = message.type_url;
                if (message.value != null && message.hasOwnProperty("value"))
                    object.value = options.bytes === String ? $util.base64.encode(message.value, 0, message.value.length) : options.bytes === Array ? Array.prototype.slice.call(message.value) : message.value;
                return object;
            };

            /**
             * Converts this Any to JSON.
             * @function toJSON
             * @memberof google.protobuf.Any
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Any.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for Any
             * @function getTypeUrl
             * @memberof google.protobuf.Any
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            Any.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/google.protobuf.Any";
            };

            return Any;
        })();

        return protobuf;
    })();

    return google;
})();

export default $root;
