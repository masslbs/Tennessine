/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/minimal";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["market.mass"] || ($protobuf.roots["market.mass"] = {});

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

        mass.StoreManifest = (function() {

            /**
             * Properties of a StoreManifest.
             * @memberof market.mass
             * @interface IStoreManifest
             * @property {Uint8Array|null} [eventId] StoreManifest eventId
             * @property {Uint8Array|null} [storeTokenId] StoreManifest storeTokenId
             * @property {string|null} [domain] StoreManifest domain
             * @property {Uint8Array|null} [publishedTagId] StoreManifest publishedTagId
             */

            /**
             * Constructs a new StoreManifest.
             * @memberof market.mass
             * @classdesc Represents a StoreManifest.
             * @implements IStoreManifest
             * @constructor
             * @param {market.mass.IStoreManifest=} [properties] Properties to set
             */
            function StoreManifest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * StoreManifest eventId.
             * @member {Uint8Array} eventId
             * @memberof market.mass.StoreManifest
             * @instance
             */
            StoreManifest.prototype.eventId = $util.newBuffer([]);

            /**
             * StoreManifest storeTokenId.
             * @member {Uint8Array} storeTokenId
             * @memberof market.mass.StoreManifest
             * @instance
             */
            StoreManifest.prototype.storeTokenId = $util.newBuffer([]);

            /**
             * StoreManifest domain.
             * @member {string} domain
             * @memberof market.mass.StoreManifest
             * @instance
             */
            StoreManifest.prototype.domain = "";

            /**
             * StoreManifest publishedTagId.
             * @member {Uint8Array} publishedTagId
             * @memberof market.mass.StoreManifest
             * @instance
             */
            StoreManifest.prototype.publishedTagId = $util.newBuffer([]);

            /**
             * Creates a new StoreManifest instance using the specified properties.
             * @function create
             * @memberof market.mass.StoreManifest
             * @static
             * @param {market.mass.IStoreManifest=} [properties] Properties to set
             * @returns {market.mass.StoreManifest} StoreManifest instance
             */
            StoreManifest.create = function create(properties) {
                return new StoreManifest(properties);
            };

            /**
             * Encodes the specified StoreManifest message. Does not implicitly {@link market.mass.StoreManifest.verify|verify} messages.
             * @function encode
             * @memberof market.mass.StoreManifest
             * @static
             * @param {market.mass.IStoreManifest} message StoreManifest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            StoreManifest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.eventId != null && Object.hasOwnProperty.call(message, "eventId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.eventId);
                if (message.storeTokenId != null && Object.hasOwnProperty.call(message, "storeTokenId"))
                    writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.storeTokenId);
                if (message.domain != null && Object.hasOwnProperty.call(message, "domain"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.domain);
                if (message.publishedTagId != null && Object.hasOwnProperty.call(message, "publishedTagId"))
                    writer.uint32(/* id 4, wireType 2 =*/34).bytes(message.publishedTagId);
                return writer;
            };

            /**
             * Encodes the specified StoreManifest message, length delimited. Does not implicitly {@link market.mass.StoreManifest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof market.mass.StoreManifest
             * @static
             * @param {market.mass.IStoreManifest} message StoreManifest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            StoreManifest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a StoreManifest message from the specified reader or buffer.
             * @function decode
             * @memberof market.mass.StoreManifest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {market.mass.StoreManifest} StoreManifest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            StoreManifest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.StoreManifest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.eventId = reader.bytes();
                            break;
                        }
                    case 2: {
                            message.storeTokenId = reader.bytes();
                            break;
                        }
                    case 3: {
                            message.domain = reader.string();
                            break;
                        }
                    case 4: {
                            message.publishedTagId = reader.bytes();
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
             * Decodes a StoreManifest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof market.mass.StoreManifest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {market.mass.StoreManifest} StoreManifest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            StoreManifest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a StoreManifest message.
             * @function verify
             * @memberof market.mass.StoreManifest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            StoreManifest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.eventId != null && message.hasOwnProperty("eventId"))
                    if (!(message.eventId && typeof message.eventId.length === "number" || $util.isString(message.eventId)))
                        return "eventId: buffer expected";
                if (message.storeTokenId != null && message.hasOwnProperty("storeTokenId"))
                    if (!(message.storeTokenId && typeof message.storeTokenId.length === "number" || $util.isString(message.storeTokenId)))
                        return "storeTokenId: buffer expected";
                if (message.domain != null && message.hasOwnProperty("domain"))
                    if (!$util.isString(message.domain))
                        return "domain: string expected";
                if (message.publishedTagId != null && message.hasOwnProperty("publishedTagId"))
                    if (!(message.publishedTagId && typeof message.publishedTagId.length === "number" || $util.isString(message.publishedTagId)))
                        return "publishedTagId: buffer expected";
                return null;
            };

            /**
             * Creates a StoreManifest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof market.mass.StoreManifest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {market.mass.StoreManifest} StoreManifest
             */
            StoreManifest.fromObject = function fromObject(object) {
                if (object instanceof $root.market.mass.StoreManifest)
                    return object;
                let message = new $root.market.mass.StoreManifest();
                if (object.eventId != null)
                    if (typeof object.eventId === "string")
                        $util.base64.decode(object.eventId, message.eventId = $util.newBuffer($util.base64.length(object.eventId)), 0);
                    else if (object.eventId.length >= 0)
                        message.eventId = object.eventId;
                if (object.storeTokenId != null)
                    if (typeof object.storeTokenId === "string")
                        $util.base64.decode(object.storeTokenId, message.storeTokenId = $util.newBuffer($util.base64.length(object.storeTokenId)), 0);
                    else if (object.storeTokenId.length >= 0)
                        message.storeTokenId = object.storeTokenId;
                if (object.domain != null)
                    message.domain = String(object.domain);
                if (object.publishedTagId != null)
                    if (typeof object.publishedTagId === "string")
                        $util.base64.decode(object.publishedTagId, message.publishedTagId = $util.newBuffer($util.base64.length(object.publishedTagId)), 0);
                    else if (object.publishedTagId.length >= 0)
                        message.publishedTagId = object.publishedTagId;
                return message;
            };

            /**
             * Creates a plain object from a StoreManifest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof market.mass.StoreManifest
             * @static
             * @param {market.mass.StoreManifest} message StoreManifest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            StoreManifest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    if (options.bytes === String)
                        object.eventId = "";
                    else {
                        object.eventId = [];
                        if (options.bytes !== Array)
                            object.eventId = $util.newBuffer(object.eventId);
                    }
                    if (options.bytes === String)
                        object.storeTokenId = "";
                    else {
                        object.storeTokenId = [];
                        if (options.bytes !== Array)
                            object.storeTokenId = $util.newBuffer(object.storeTokenId);
                    }
                    object.domain = "";
                    if (options.bytes === String)
                        object.publishedTagId = "";
                    else {
                        object.publishedTagId = [];
                        if (options.bytes !== Array)
                            object.publishedTagId = $util.newBuffer(object.publishedTagId);
                    }
                }
                if (message.eventId != null && message.hasOwnProperty("eventId"))
                    object.eventId = options.bytes === String ? $util.base64.encode(message.eventId, 0, message.eventId.length) : options.bytes === Array ? Array.prototype.slice.call(message.eventId) : message.eventId;
                if (message.storeTokenId != null && message.hasOwnProperty("storeTokenId"))
                    object.storeTokenId = options.bytes === String ? $util.base64.encode(message.storeTokenId, 0, message.storeTokenId.length) : options.bytes === Array ? Array.prototype.slice.call(message.storeTokenId) : message.storeTokenId;
                if (message.domain != null && message.hasOwnProperty("domain"))
                    object.domain = message.domain;
                if (message.publishedTagId != null && message.hasOwnProperty("publishedTagId"))
                    object.publishedTagId = options.bytes === String ? $util.base64.encode(message.publishedTagId, 0, message.publishedTagId.length) : options.bytes === Array ? Array.prototype.slice.call(message.publishedTagId) : message.publishedTagId;
                return object;
            };

            /**
             * Converts this StoreManifest to JSON.
             * @function toJSON
             * @memberof market.mass.StoreManifest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            StoreManifest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for StoreManifest
             * @function getTypeUrl
             * @memberof market.mass.StoreManifest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            StoreManifest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/market.mass.StoreManifest";
            };

            return StoreManifest;
        })();

        mass.UpdateManifest = (function() {

            /**
             * Properties of an UpdateManifest.
             * @memberof market.mass
             * @interface IUpdateManifest
             * @property {Uint8Array|null} [eventId] UpdateManifest eventId
             * @property {market.mass.UpdateManifest.ManifestField|null} [field] UpdateManifest field
             * @property {string|null} [string] UpdateManifest string
             * @property {Uint8Array|null} [tagId] UpdateManifest tagId
             * @property {Uint8Array|null} [erc20Addr] UpdateManifest erc20Addr
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
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * UpdateManifest eventId.
             * @member {Uint8Array} eventId
             * @memberof market.mass.UpdateManifest
             * @instance
             */
            UpdateManifest.prototype.eventId = $util.newBuffer([]);

            /**
             * UpdateManifest field.
             * @member {market.mass.UpdateManifest.ManifestField} field
             * @memberof market.mass.UpdateManifest
             * @instance
             */
            UpdateManifest.prototype.field = 0;

            /**
             * UpdateManifest string.
             * @member {string|null|undefined} string
             * @memberof market.mass.UpdateManifest
             * @instance
             */
            UpdateManifest.prototype.string = null;

            /**
             * UpdateManifest tagId.
             * @member {Uint8Array|null|undefined} tagId
             * @memberof market.mass.UpdateManifest
             * @instance
             */
            UpdateManifest.prototype.tagId = null;

            /**
             * UpdateManifest erc20Addr.
             * @member {Uint8Array|null|undefined} erc20Addr
             * @memberof market.mass.UpdateManifest
             * @instance
             */
            UpdateManifest.prototype.erc20Addr = null;

            // OneOf field names bound to virtual getters and setters
            let $oneOfFields;

            /**
             * UpdateManifest value.
             * @member {"string"|"tagId"|"erc20Addr"|undefined} value
             * @memberof market.mass.UpdateManifest
             * @instance
             */
            Object.defineProperty(UpdateManifest.prototype, "value", {
                get: $util.oneOfGetter($oneOfFields = ["string", "tagId", "erc20Addr"]),
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
                if (message.eventId != null && Object.hasOwnProperty.call(message, "eventId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.eventId);
                if (message.field != null && Object.hasOwnProperty.call(message, "field"))
                    writer.uint32(/* id 2, wireType 0 =*/16).int32(message.field);
                if (message.string != null && Object.hasOwnProperty.call(message, "string"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.string);
                if (message.tagId != null && Object.hasOwnProperty.call(message, "tagId"))
                    writer.uint32(/* id 4, wireType 2 =*/34).bytes(message.tagId);
                if (message.erc20Addr != null && Object.hasOwnProperty.call(message, "erc20Addr"))
                    writer.uint32(/* id 5, wireType 2 =*/42).bytes(message.erc20Addr);
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
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.UpdateManifest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.eventId = reader.bytes();
                            break;
                        }
                    case 2: {
                            message.field = reader.int32();
                            break;
                        }
                    case 3: {
                            message.string = reader.string();
                            break;
                        }
                    case 4: {
                            message.tagId = reader.bytes();
                            break;
                        }
                    case 5: {
                            message.erc20Addr = reader.bytes();
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
                let properties = {};
                if (message.eventId != null && message.hasOwnProperty("eventId"))
                    if (!(message.eventId && typeof message.eventId.length === "number" || $util.isString(message.eventId)))
                        return "eventId: buffer expected";
                if (message.field != null && message.hasOwnProperty("field"))
                    switch (message.field) {
                    default:
                        return "field: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                        break;
                    }
                if (message.string != null && message.hasOwnProperty("string")) {
                    properties.value = 1;
                    if (!$util.isString(message.string))
                        return "string: string expected";
                }
                if (message.tagId != null && message.hasOwnProperty("tagId")) {
                    if (properties.value === 1)
                        return "value: multiple values";
                    properties.value = 1;
                    if (!(message.tagId && typeof message.tagId.length === "number" || $util.isString(message.tagId)))
                        return "tagId: buffer expected";
                }
                if (message.erc20Addr != null && message.hasOwnProperty("erc20Addr")) {
                    if (properties.value === 1)
                        return "value: multiple values";
                    properties.value = 1;
                    if (!(message.erc20Addr && typeof message.erc20Addr.length === "number" || $util.isString(message.erc20Addr)))
                        return "erc20Addr: buffer expected";
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
                let message = new $root.market.mass.UpdateManifest();
                if (object.eventId != null)
                    if (typeof object.eventId === "string")
                        $util.base64.decode(object.eventId, message.eventId = $util.newBuffer($util.base64.length(object.eventId)), 0);
                    else if (object.eventId.length >= 0)
                        message.eventId = object.eventId;
                switch (object.field) {
                default:
                    if (typeof object.field === "number") {
                        message.field = object.field;
                        break;
                    }
                    break;
                case "MANIFEST_FIELD_UNSPECIFIED":
                case 0:
                    message.field = 0;
                    break;
                case "MANIFEST_FIELD_DOMAIN":
                case 1:
                    message.field = 1;
                    break;
                case "MANIFEST_FIELD_PUBLISHED_TAG":
                case 2:
                    message.field = 2;
                    break;
                case "MANIFEST_FIELD_ADD_ERC20":
                case 3:
                    message.field = 3;
                    break;
                case "MANIFEST_FIELD_REMOVE_ERC20":
                case 4:
                    message.field = 4;
                    break;
                }
                if (object.string != null)
                    message.string = String(object.string);
                if (object.tagId != null)
                    if (typeof object.tagId === "string")
                        $util.base64.decode(object.tagId, message.tagId = $util.newBuffer($util.base64.length(object.tagId)), 0);
                    else if (object.tagId.length >= 0)
                        message.tagId = object.tagId;
                if (object.erc20Addr != null)
                    if (typeof object.erc20Addr === "string")
                        $util.base64.decode(object.erc20Addr, message.erc20Addr = $util.newBuffer($util.base64.length(object.erc20Addr)), 0);
                    else if (object.erc20Addr.length >= 0)
                        message.erc20Addr = object.erc20Addr;
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
                let object = {};
                if (options.defaults) {
                    if (options.bytes === String)
                        object.eventId = "";
                    else {
                        object.eventId = [];
                        if (options.bytes !== Array)
                            object.eventId = $util.newBuffer(object.eventId);
                    }
                    object.field = options.enums === String ? "MANIFEST_FIELD_UNSPECIFIED" : 0;
                }
                if (message.eventId != null && message.hasOwnProperty("eventId"))
                    object.eventId = options.bytes === String ? $util.base64.encode(message.eventId, 0, message.eventId.length) : options.bytes === Array ? Array.prototype.slice.call(message.eventId) : message.eventId;
                if (message.field != null && message.hasOwnProperty("field"))
                    object.field = options.enums === String ? $root.market.mass.UpdateManifest.ManifestField[message.field] === undefined ? message.field : $root.market.mass.UpdateManifest.ManifestField[message.field] : message.field;
                if (message.string != null && message.hasOwnProperty("string")) {
                    object.string = message.string;
                    if (options.oneofs)
                        object.value = "string";
                }
                if (message.tagId != null && message.hasOwnProperty("tagId")) {
                    object.tagId = options.bytes === String ? $util.base64.encode(message.tagId, 0, message.tagId.length) : options.bytes === Array ? Array.prototype.slice.call(message.tagId) : message.tagId;
                    if (options.oneofs)
                        object.value = "tagId";
                }
                if (message.erc20Addr != null && message.hasOwnProperty("erc20Addr")) {
                    object.erc20Addr = options.bytes === String ? $util.base64.encode(message.erc20Addr, 0, message.erc20Addr.length) : options.bytes === Array ? Array.prototype.slice.call(message.erc20Addr) : message.erc20Addr;
                    if (options.oneofs)
                        object.value = "erc20Addr";
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

            /**
             * ManifestField enum.
             * @name market.mass.UpdateManifest.ManifestField
             * @enum {number}
             * @property {number} MANIFEST_FIELD_UNSPECIFIED=0 MANIFEST_FIELD_UNSPECIFIED value
             * @property {number} MANIFEST_FIELD_DOMAIN=1 MANIFEST_FIELD_DOMAIN value
             * @property {number} MANIFEST_FIELD_PUBLISHED_TAG=2 MANIFEST_FIELD_PUBLISHED_TAG value
             * @property {number} MANIFEST_FIELD_ADD_ERC20=3 MANIFEST_FIELD_ADD_ERC20 value
             * @property {number} MANIFEST_FIELD_REMOVE_ERC20=4 MANIFEST_FIELD_REMOVE_ERC20 value
             */
            UpdateManifest.ManifestField = (function() {
                const valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "MANIFEST_FIELD_UNSPECIFIED"] = 0;
                values[valuesById[1] = "MANIFEST_FIELD_DOMAIN"] = 1;
                values[valuesById[2] = "MANIFEST_FIELD_PUBLISHED_TAG"] = 2;
                values[valuesById[3] = "MANIFEST_FIELD_ADD_ERC20"] = 3;
                values[valuesById[4] = "MANIFEST_FIELD_REMOVE_ERC20"] = 4;
                return values;
            })();

            return UpdateManifest;
        })();

        mass.CreateItem = (function() {

            /**
             * Properties of a CreateItem.
             * @memberof market.mass
             * @interface ICreateItem
             * @property {Uint8Array|null} [eventId] CreateItem eventId
             * @property {string|null} [price] CreateItem price
             * @property {Uint8Array|null} [metadata] CreateItem metadata
             */

            /**
             * Constructs a new CreateItem.
             * @memberof market.mass
             * @classdesc Represents a CreateItem.
             * @implements ICreateItem
             * @constructor
             * @param {market.mass.ICreateItem=} [properties] Properties to set
             */
            function CreateItem(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * CreateItem eventId.
             * @member {Uint8Array} eventId
             * @memberof market.mass.CreateItem
             * @instance
             */
            CreateItem.prototype.eventId = $util.newBuffer([]);

            /**
             * CreateItem price.
             * @member {string} price
             * @memberof market.mass.CreateItem
             * @instance
             */
            CreateItem.prototype.price = "";

            /**
             * CreateItem metadata.
             * @member {Uint8Array} metadata
             * @memberof market.mass.CreateItem
             * @instance
             */
            CreateItem.prototype.metadata = $util.newBuffer([]);

            /**
             * Creates a new CreateItem instance using the specified properties.
             * @function create
             * @memberof market.mass.CreateItem
             * @static
             * @param {market.mass.ICreateItem=} [properties] Properties to set
             * @returns {market.mass.CreateItem} CreateItem instance
             */
            CreateItem.create = function create(properties) {
                return new CreateItem(properties);
            };

            /**
             * Encodes the specified CreateItem message. Does not implicitly {@link market.mass.CreateItem.verify|verify} messages.
             * @function encode
             * @memberof market.mass.CreateItem
             * @static
             * @param {market.mass.ICreateItem} message CreateItem message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CreateItem.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.eventId != null && Object.hasOwnProperty.call(message, "eventId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.eventId);
                if (message.price != null && Object.hasOwnProperty.call(message, "price"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.price);
                if (message.metadata != null && Object.hasOwnProperty.call(message, "metadata"))
                    writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.metadata);
                return writer;
            };

            /**
             * Encodes the specified CreateItem message, length delimited. Does not implicitly {@link market.mass.CreateItem.verify|verify} messages.
             * @function encodeDelimited
             * @memberof market.mass.CreateItem
             * @static
             * @param {market.mass.ICreateItem} message CreateItem message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CreateItem.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a CreateItem message from the specified reader or buffer.
             * @function decode
             * @memberof market.mass.CreateItem
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {market.mass.CreateItem} CreateItem
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CreateItem.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.CreateItem();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.eventId = reader.bytes();
                            break;
                        }
                    case 2: {
                            message.price = reader.string();
                            break;
                        }
                    case 3: {
                            message.metadata = reader.bytes();
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
             * Decodes a CreateItem message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof market.mass.CreateItem
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {market.mass.CreateItem} CreateItem
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CreateItem.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a CreateItem message.
             * @function verify
             * @memberof market.mass.CreateItem
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            CreateItem.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.eventId != null && message.hasOwnProperty("eventId"))
                    if (!(message.eventId && typeof message.eventId.length === "number" || $util.isString(message.eventId)))
                        return "eventId: buffer expected";
                if (message.price != null && message.hasOwnProperty("price"))
                    if (!$util.isString(message.price))
                        return "price: string expected";
                if (message.metadata != null && message.hasOwnProperty("metadata"))
                    if (!(message.metadata && typeof message.metadata.length === "number" || $util.isString(message.metadata)))
                        return "metadata: buffer expected";
                return null;
            };

            /**
             * Creates a CreateItem message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof market.mass.CreateItem
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {market.mass.CreateItem} CreateItem
             */
            CreateItem.fromObject = function fromObject(object) {
                if (object instanceof $root.market.mass.CreateItem)
                    return object;
                let message = new $root.market.mass.CreateItem();
                if (object.eventId != null)
                    if (typeof object.eventId === "string")
                        $util.base64.decode(object.eventId, message.eventId = $util.newBuffer($util.base64.length(object.eventId)), 0);
                    else if (object.eventId.length >= 0)
                        message.eventId = object.eventId;
                if (object.price != null)
                    message.price = String(object.price);
                if (object.metadata != null)
                    if (typeof object.metadata === "string")
                        $util.base64.decode(object.metadata, message.metadata = $util.newBuffer($util.base64.length(object.metadata)), 0);
                    else if (object.metadata.length >= 0)
                        message.metadata = object.metadata;
                return message;
            };

            /**
             * Creates a plain object from a CreateItem message. Also converts values to other types if specified.
             * @function toObject
             * @memberof market.mass.CreateItem
             * @static
             * @param {market.mass.CreateItem} message CreateItem
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            CreateItem.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    if (options.bytes === String)
                        object.eventId = "";
                    else {
                        object.eventId = [];
                        if (options.bytes !== Array)
                            object.eventId = $util.newBuffer(object.eventId);
                    }
                    object.price = "";
                    if (options.bytes === String)
                        object.metadata = "";
                    else {
                        object.metadata = [];
                        if (options.bytes !== Array)
                            object.metadata = $util.newBuffer(object.metadata);
                    }
                }
                if (message.eventId != null && message.hasOwnProperty("eventId"))
                    object.eventId = options.bytes === String ? $util.base64.encode(message.eventId, 0, message.eventId.length) : options.bytes === Array ? Array.prototype.slice.call(message.eventId) : message.eventId;
                if (message.price != null && message.hasOwnProperty("price"))
                    object.price = message.price;
                if (message.metadata != null && message.hasOwnProperty("metadata"))
                    object.metadata = options.bytes === String ? $util.base64.encode(message.metadata, 0, message.metadata.length) : options.bytes === Array ? Array.prototype.slice.call(message.metadata) : message.metadata;
                return object;
            };

            /**
             * Converts this CreateItem to JSON.
             * @function toJSON
             * @memberof market.mass.CreateItem
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            CreateItem.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for CreateItem
             * @function getTypeUrl
             * @memberof market.mass.CreateItem
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            CreateItem.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/market.mass.CreateItem";
            };

            return CreateItem;
        })();

        mass.UpdateItem = (function() {

            /**
             * Properties of an UpdateItem.
             * @memberof market.mass
             * @interface IUpdateItem
             * @property {Uint8Array|null} [eventId] UpdateItem eventId
             * @property {Uint8Array|null} [itemId] UpdateItem itemId
             * @property {market.mass.UpdateItem.ItemField|null} [field] UpdateItem field
             * @property {string|null} [price] UpdateItem price
             * @property {Uint8Array|null} [metadata] UpdateItem metadata
             */

            /**
             * Constructs a new UpdateItem.
             * @memberof market.mass
             * @classdesc Represents an UpdateItem.
             * @implements IUpdateItem
             * @constructor
             * @param {market.mass.IUpdateItem=} [properties] Properties to set
             */
            function UpdateItem(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * UpdateItem eventId.
             * @member {Uint8Array} eventId
             * @memberof market.mass.UpdateItem
             * @instance
             */
            UpdateItem.prototype.eventId = $util.newBuffer([]);

            /**
             * UpdateItem itemId.
             * @member {Uint8Array} itemId
             * @memberof market.mass.UpdateItem
             * @instance
             */
            UpdateItem.prototype.itemId = $util.newBuffer([]);

            /**
             * UpdateItem field.
             * @member {market.mass.UpdateItem.ItemField} field
             * @memberof market.mass.UpdateItem
             * @instance
             */
            UpdateItem.prototype.field = 0;

            /**
             * UpdateItem price.
             * @member {string|null|undefined} price
             * @memberof market.mass.UpdateItem
             * @instance
             */
            UpdateItem.prototype.price = null;

            /**
             * UpdateItem metadata.
             * @member {Uint8Array|null|undefined} metadata
             * @memberof market.mass.UpdateItem
             * @instance
             */
            UpdateItem.prototype.metadata = null;

            // OneOf field names bound to virtual getters and setters
            let $oneOfFields;

            /**
             * UpdateItem value.
             * @member {"price"|"metadata"|undefined} value
             * @memberof market.mass.UpdateItem
             * @instance
             */
            Object.defineProperty(UpdateItem.prototype, "value", {
                get: $util.oneOfGetter($oneOfFields = ["price", "metadata"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new UpdateItem instance using the specified properties.
             * @function create
             * @memberof market.mass.UpdateItem
             * @static
             * @param {market.mass.IUpdateItem=} [properties] Properties to set
             * @returns {market.mass.UpdateItem} UpdateItem instance
             */
            UpdateItem.create = function create(properties) {
                return new UpdateItem(properties);
            };

            /**
             * Encodes the specified UpdateItem message. Does not implicitly {@link market.mass.UpdateItem.verify|verify} messages.
             * @function encode
             * @memberof market.mass.UpdateItem
             * @static
             * @param {market.mass.IUpdateItem} message UpdateItem message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UpdateItem.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.eventId != null && Object.hasOwnProperty.call(message, "eventId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.eventId);
                if (message.itemId != null && Object.hasOwnProperty.call(message, "itemId"))
                    writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.itemId);
                if (message.field != null && Object.hasOwnProperty.call(message, "field"))
                    writer.uint32(/* id 3, wireType 0 =*/24).int32(message.field);
                if (message.price != null && Object.hasOwnProperty.call(message, "price"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.price);
                if (message.metadata != null && Object.hasOwnProperty.call(message, "metadata"))
                    writer.uint32(/* id 5, wireType 2 =*/42).bytes(message.metadata);
                return writer;
            };

            /**
             * Encodes the specified UpdateItem message, length delimited. Does not implicitly {@link market.mass.UpdateItem.verify|verify} messages.
             * @function encodeDelimited
             * @memberof market.mass.UpdateItem
             * @static
             * @param {market.mass.IUpdateItem} message UpdateItem message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UpdateItem.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an UpdateItem message from the specified reader or buffer.
             * @function decode
             * @memberof market.mass.UpdateItem
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {market.mass.UpdateItem} UpdateItem
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            UpdateItem.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.UpdateItem();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.eventId = reader.bytes();
                            break;
                        }
                    case 2: {
                            message.itemId = reader.bytes();
                            break;
                        }
                    case 3: {
                            message.field = reader.int32();
                            break;
                        }
                    case 4: {
                            message.price = reader.string();
                            break;
                        }
                    case 5: {
                            message.metadata = reader.bytes();
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
             * Decodes an UpdateItem message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof market.mass.UpdateItem
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {market.mass.UpdateItem} UpdateItem
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            UpdateItem.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an UpdateItem message.
             * @function verify
             * @memberof market.mass.UpdateItem
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            UpdateItem.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                let properties = {};
                if (message.eventId != null && message.hasOwnProperty("eventId"))
                    if (!(message.eventId && typeof message.eventId.length === "number" || $util.isString(message.eventId)))
                        return "eventId: buffer expected";
                if (message.itemId != null && message.hasOwnProperty("itemId"))
                    if (!(message.itemId && typeof message.itemId.length === "number" || $util.isString(message.itemId)))
                        return "itemId: buffer expected";
                if (message.field != null && message.hasOwnProperty("field"))
                    switch (message.field) {
                    default:
                        return "field: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                        break;
                    }
                if (message.price != null && message.hasOwnProperty("price")) {
                    properties.value = 1;
                    if (!$util.isString(message.price))
                        return "price: string expected";
                }
                if (message.metadata != null && message.hasOwnProperty("metadata")) {
                    if (properties.value === 1)
                        return "value: multiple values";
                    properties.value = 1;
                    if (!(message.metadata && typeof message.metadata.length === "number" || $util.isString(message.metadata)))
                        return "metadata: buffer expected";
                }
                return null;
            };

            /**
             * Creates an UpdateItem message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof market.mass.UpdateItem
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {market.mass.UpdateItem} UpdateItem
             */
            UpdateItem.fromObject = function fromObject(object) {
                if (object instanceof $root.market.mass.UpdateItem)
                    return object;
                let message = new $root.market.mass.UpdateItem();
                if (object.eventId != null)
                    if (typeof object.eventId === "string")
                        $util.base64.decode(object.eventId, message.eventId = $util.newBuffer($util.base64.length(object.eventId)), 0);
                    else if (object.eventId.length >= 0)
                        message.eventId = object.eventId;
                if (object.itemId != null)
                    if (typeof object.itemId === "string")
                        $util.base64.decode(object.itemId, message.itemId = $util.newBuffer($util.base64.length(object.itemId)), 0);
                    else if (object.itemId.length >= 0)
                        message.itemId = object.itemId;
                switch (object.field) {
                default:
                    if (typeof object.field === "number") {
                        message.field = object.field;
                        break;
                    }
                    break;
                case "ITEM_FIELD_UNSPECIFIED":
                case 0:
                    message.field = 0;
                    break;
                case "ITEM_FIELD_PRICE":
                case 1:
                    message.field = 1;
                    break;
                case "ITEM_FIELD_METADATA":
                case 2:
                    message.field = 2;
                    break;
                }
                if (object.price != null)
                    message.price = String(object.price);
                if (object.metadata != null)
                    if (typeof object.metadata === "string")
                        $util.base64.decode(object.metadata, message.metadata = $util.newBuffer($util.base64.length(object.metadata)), 0);
                    else if (object.metadata.length >= 0)
                        message.metadata = object.metadata;
                return message;
            };

            /**
             * Creates a plain object from an UpdateItem message. Also converts values to other types if specified.
             * @function toObject
             * @memberof market.mass.UpdateItem
             * @static
             * @param {market.mass.UpdateItem} message UpdateItem
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            UpdateItem.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    if (options.bytes === String)
                        object.eventId = "";
                    else {
                        object.eventId = [];
                        if (options.bytes !== Array)
                            object.eventId = $util.newBuffer(object.eventId);
                    }
                    if (options.bytes === String)
                        object.itemId = "";
                    else {
                        object.itemId = [];
                        if (options.bytes !== Array)
                            object.itemId = $util.newBuffer(object.itemId);
                    }
                    object.field = options.enums === String ? "ITEM_FIELD_UNSPECIFIED" : 0;
                }
                if (message.eventId != null && message.hasOwnProperty("eventId"))
                    object.eventId = options.bytes === String ? $util.base64.encode(message.eventId, 0, message.eventId.length) : options.bytes === Array ? Array.prototype.slice.call(message.eventId) : message.eventId;
                if (message.itemId != null && message.hasOwnProperty("itemId"))
                    object.itemId = options.bytes === String ? $util.base64.encode(message.itemId, 0, message.itemId.length) : options.bytes === Array ? Array.prototype.slice.call(message.itemId) : message.itemId;
                if (message.field != null && message.hasOwnProperty("field"))
                    object.field = options.enums === String ? $root.market.mass.UpdateItem.ItemField[message.field] === undefined ? message.field : $root.market.mass.UpdateItem.ItemField[message.field] : message.field;
                if (message.price != null && message.hasOwnProperty("price")) {
                    object.price = message.price;
                    if (options.oneofs)
                        object.value = "price";
                }
                if (message.metadata != null && message.hasOwnProperty("metadata")) {
                    object.metadata = options.bytes === String ? $util.base64.encode(message.metadata, 0, message.metadata.length) : options.bytes === Array ? Array.prototype.slice.call(message.metadata) : message.metadata;
                    if (options.oneofs)
                        object.value = "metadata";
                }
                return object;
            };

            /**
             * Converts this UpdateItem to JSON.
             * @function toJSON
             * @memberof market.mass.UpdateItem
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            UpdateItem.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for UpdateItem
             * @function getTypeUrl
             * @memberof market.mass.UpdateItem
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            UpdateItem.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/market.mass.UpdateItem";
            };

            /**
             * ItemField enum.
             * @name market.mass.UpdateItem.ItemField
             * @enum {number}
             * @property {number} ITEM_FIELD_UNSPECIFIED=0 ITEM_FIELD_UNSPECIFIED value
             * @property {number} ITEM_FIELD_PRICE=1 ITEM_FIELD_PRICE value
             * @property {number} ITEM_FIELD_METADATA=2 ITEM_FIELD_METADATA value
             */
            UpdateItem.ItemField = (function() {
                const valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "ITEM_FIELD_UNSPECIFIED"] = 0;
                values[valuesById[1] = "ITEM_FIELD_PRICE"] = 1;
                values[valuesById[2] = "ITEM_FIELD_METADATA"] = 2;
                return values;
            })();

            return UpdateItem;
        })();

        mass.CreateTag = (function() {

            /**
             * Properties of a CreateTag.
             * @memberof market.mass
             * @interface ICreateTag
             * @property {Uint8Array|null} [eventId] CreateTag eventId
             * @property {string|null} [name] CreateTag name
             */

            /**
             * Constructs a new CreateTag.
             * @memberof market.mass
             * @classdesc Represents a CreateTag.
             * @implements ICreateTag
             * @constructor
             * @param {market.mass.ICreateTag=} [properties] Properties to set
             */
            function CreateTag(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * CreateTag eventId.
             * @member {Uint8Array} eventId
             * @memberof market.mass.CreateTag
             * @instance
             */
            CreateTag.prototype.eventId = $util.newBuffer([]);

            /**
             * CreateTag name.
             * @member {string} name
             * @memberof market.mass.CreateTag
             * @instance
             */
            CreateTag.prototype.name = "";

            /**
             * Creates a new CreateTag instance using the specified properties.
             * @function create
             * @memberof market.mass.CreateTag
             * @static
             * @param {market.mass.ICreateTag=} [properties] Properties to set
             * @returns {market.mass.CreateTag} CreateTag instance
             */
            CreateTag.create = function create(properties) {
                return new CreateTag(properties);
            };

            /**
             * Encodes the specified CreateTag message. Does not implicitly {@link market.mass.CreateTag.verify|verify} messages.
             * @function encode
             * @memberof market.mass.CreateTag
             * @static
             * @param {market.mass.ICreateTag} message CreateTag message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CreateTag.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.eventId != null && Object.hasOwnProperty.call(message, "eventId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.eventId);
                if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
                return writer;
            };

            /**
             * Encodes the specified CreateTag message, length delimited. Does not implicitly {@link market.mass.CreateTag.verify|verify} messages.
             * @function encodeDelimited
             * @memberof market.mass.CreateTag
             * @static
             * @param {market.mass.ICreateTag} message CreateTag message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CreateTag.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a CreateTag message from the specified reader or buffer.
             * @function decode
             * @memberof market.mass.CreateTag
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {market.mass.CreateTag} CreateTag
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CreateTag.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.CreateTag();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.eventId = reader.bytes();
                            break;
                        }
                    case 2: {
                            message.name = reader.string();
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
             * Decodes a CreateTag message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof market.mass.CreateTag
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {market.mass.CreateTag} CreateTag
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CreateTag.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a CreateTag message.
             * @function verify
             * @memberof market.mass.CreateTag
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            CreateTag.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.eventId != null && message.hasOwnProperty("eventId"))
                    if (!(message.eventId && typeof message.eventId.length === "number" || $util.isString(message.eventId)))
                        return "eventId: buffer expected";
                if (message.name != null && message.hasOwnProperty("name"))
                    if (!$util.isString(message.name))
                        return "name: string expected";
                return null;
            };

            /**
             * Creates a CreateTag message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof market.mass.CreateTag
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {market.mass.CreateTag} CreateTag
             */
            CreateTag.fromObject = function fromObject(object) {
                if (object instanceof $root.market.mass.CreateTag)
                    return object;
                let message = new $root.market.mass.CreateTag();
                if (object.eventId != null)
                    if (typeof object.eventId === "string")
                        $util.base64.decode(object.eventId, message.eventId = $util.newBuffer($util.base64.length(object.eventId)), 0);
                    else if (object.eventId.length >= 0)
                        message.eventId = object.eventId;
                if (object.name != null)
                    message.name = String(object.name);
                return message;
            };

            /**
             * Creates a plain object from a CreateTag message. Also converts values to other types if specified.
             * @function toObject
             * @memberof market.mass.CreateTag
             * @static
             * @param {market.mass.CreateTag} message CreateTag
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            CreateTag.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    if (options.bytes === String)
                        object.eventId = "";
                    else {
                        object.eventId = [];
                        if (options.bytes !== Array)
                            object.eventId = $util.newBuffer(object.eventId);
                    }
                    object.name = "";
                }
                if (message.eventId != null && message.hasOwnProperty("eventId"))
                    object.eventId = options.bytes === String ? $util.base64.encode(message.eventId, 0, message.eventId.length) : options.bytes === Array ? Array.prototype.slice.call(message.eventId) : message.eventId;
                if (message.name != null && message.hasOwnProperty("name"))
                    object.name = message.name;
                return object;
            };

            /**
             * Converts this CreateTag to JSON.
             * @function toJSON
             * @memberof market.mass.CreateTag
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            CreateTag.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for CreateTag
             * @function getTypeUrl
             * @memberof market.mass.CreateTag
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            CreateTag.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/market.mass.CreateTag";
            };

            return CreateTag;
        })();

        mass.AddToTag = (function() {

            /**
             * Properties of an AddToTag.
             * @memberof market.mass
             * @interface IAddToTag
             * @property {Uint8Array|null} [eventId] AddToTag eventId
             * @property {Uint8Array|null} [tagId] AddToTag tagId
             * @property {Uint8Array|null} [itemId] AddToTag itemId
             */

            /**
             * Constructs a new AddToTag.
             * @memberof market.mass
             * @classdesc Represents an AddToTag.
             * @implements IAddToTag
             * @constructor
             * @param {market.mass.IAddToTag=} [properties] Properties to set
             */
            function AddToTag(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * AddToTag eventId.
             * @member {Uint8Array} eventId
             * @memberof market.mass.AddToTag
             * @instance
             */
            AddToTag.prototype.eventId = $util.newBuffer([]);

            /**
             * AddToTag tagId.
             * @member {Uint8Array} tagId
             * @memberof market.mass.AddToTag
             * @instance
             */
            AddToTag.prototype.tagId = $util.newBuffer([]);

            /**
             * AddToTag itemId.
             * @member {Uint8Array} itemId
             * @memberof market.mass.AddToTag
             * @instance
             */
            AddToTag.prototype.itemId = $util.newBuffer([]);

            /**
             * Creates a new AddToTag instance using the specified properties.
             * @function create
             * @memberof market.mass.AddToTag
             * @static
             * @param {market.mass.IAddToTag=} [properties] Properties to set
             * @returns {market.mass.AddToTag} AddToTag instance
             */
            AddToTag.create = function create(properties) {
                return new AddToTag(properties);
            };

            /**
             * Encodes the specified AddToTag message. Does not implicitly {@link market.mass.AddToTag.verify|verify} messages.
             * @function encode
             * @memberof market.mass.AddToTag
             * @static
             * @param {market.mass.IAddToTag} message AddToTag message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            AddToTag.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.eventId != null && Object.hasOwnProperty.call(message, "eventId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.eventId);
                if (message.tagId != null && Object.hasOwnProperty.call(message, "tagId"))
                    writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.tagId);
                if (message.itemId != null && Object.hasOwnProperty.call(message, "itemId"))
                    writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.itemId);
                return writer;
            };

            /**
             * Encodes the specified AddToTag message, length delimited. Does not implicitly {@link market.mass.AddToTag.verify|verify} messages.
             * @function encodeDelimited
             * @memberof market.mass.AddToTag
             * @static
             * @param {market.mass.IAddToTag} message AddToTag message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            AddToTag.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an AddToTag message from the specified reader or buffer.
             * @function decode
             * @memberof market.mass.AddToTag
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {market.mass.AddToTag} AddToTag
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AddToTag.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.AddToTag();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.eventId = reader.bytes();
                            break;
                        }
                    case 2: {
                            message.tagId = reader.bytes();
                            break;
                        }
                    case 3: {
                            message.itemId = reader.bytes();
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
             * Decodes an AddToTag message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof market.mass.AddToTag
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {market.mass.AddToTag} AddToTag
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AddToTag.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an AddToTag message.
             * @function verify
             * @memberof market.mass.AddToTag
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            AddToTag.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.eventId != null && message.hasOwnProperty("eventId"))
                    if (!(message.eventId && typeof message.eventId.length === "number" || $util.isString(message.eventId)))
                        return "eventId: buffer expected";
                if (message.tagId != null && message.hasOwnProperty("tagId"))
                    if (!(message.tagId && typeof message.tagId.length === "number" || $util.isString(message.tagId)))
                        return "tagId: buffer expected";
                if (message.itemId != null && message.hasOwnProperty("itemId"))
                    if (!(message.itemId && typeof message.itemId.length === "number" || $util.isString(message.itemId)))
                        return "itemId: buffer expected";
                return null;
            };

            /**
             * Creates an AddToTag message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof market.mass.AddToTag
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {market.mass.AddToTag} AddToTag
             */
            AddToTag.fromObject = function fromObject(object) {
                if (object instanceof $root.market.mass.AddToTag)
                    return object;
                let message = new $root.market.mass.AddToTag();
                if (object.eventId != null)
                    if (typeof object.eventId === "string")
                        $util.base64.decode(object.eventId, message.eventId = $util.newBuffer($util.base64.length(object.eventId)), 0);
                    else if (object.eventId.length >= 0)
                        message.eventId = object.eventId;
                if (object.tagId != null)
                    if (typeof object.tagId === "string")
                        $util.base64.decode(object.tagId, message.tagId = $util.newBuffer($util.base64.length(object.tagId)), 0);
                    else if (object.tagId.length >= 0)
                        message.tagId = object.tagId;
                if (object.itemId != null)
                    if (typeof object.itemId === "string")
                        $util.base64.decode(object.itemId, message.itemId = $util.newBuffer($util.base64.length(object.itemId)), 0);
                    else if (object.itemId.length >= 0)
                        message.itemId = object.itemId;
                return message;
            };

            /**
             * Creates a plain object from an AddToTag message. Also converts values to other types if specified.
             * @function toObject
             * @memberof market.mass.AddToTag
             * @static
             * @param {market.mass.AddToTag} message AddToTag
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            AddToTag.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    if (options.bytes === String)
                        object.eventId = "";
                    else {
                        object.eventId = [];
                        if (options.bytes !== Array)
                            object.eventId = $util.newBuffer(object.eventId);
                    }
                    if (options.bytes === String)
                        object.tagId = "";
                    else {
                        object.tagId = [];
                        if (options.bytes !== Array)
                            object.tagId = $util.newBuffer(object.tagId);
                    }
                    if (options.bytes === String)
                        object.itemId = "";
                    else {
                        object.itemId = [];
                        if (options.bytes !== Array)
                            object.itemId = $util.newBuffer(object.itemId);
                    }
                }
                if (message.eventId != null && message.hasOwnProperty("eventId"))
                    object.eventId = options.bytes === String ? $util.base64.encode(message.eventId, 0, message.eventId.length) : options.bytes === Array ? Array.prototype.slice.call(message.eventId) : message.eventId;
                if (message.tagId != null && message.hasOwnProperty("tagId"))
                    object.tagId = options.bytes === String ? $util.base64.encode(message.tagId, 0, message.tagId.length) : options.bytes === Array ? Array.prototype.slice.call(message.tagId) : message.tagId;
                if (message.itemId != null && message.hasOwnProperty("itemId"))
                    object.itemId = options.bytes === String ? $util.base64.encode(message.itemId, 0, message.itemId.length) : options.bytes === Array ? Array.prototype.slice.call(message.itemId) : message.itemId;
                return object;
            };

            /**
             * Converts this AddToTag to JSON.
             * @function toJSON
             * @memberof market.mass.AddToTag
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            AddToTag.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for AddToTag
             * @function getTypeUrl
             * @memberof market.mass.AddToTag
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            AddToTag.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/market.mass.AddToTag";
            };

            return AddToTag;
        })();

        mass.RemoveFromTag = (function() {

            /**
             * Properties of a RemoveFromTag.
             * @memberof market.mass
             * @interface IRemoveFromTag
             * @property {Uint8Array|null} [eventId] RemoveFromTag eventId
             * @property {Uint8Array|null} [tagId] RemoveFromTag tagId
             * @property {Uint8Array|null} [itemId] RemoveFromTag itemId
             */

            /**
             * Constructs a new RemoveFromTag.
             * @memberof market.mass
             * @classdesc Represents a RemoveFromTag.
             * @implements IRemoveFromTag
             * @constructor
             * @param {market.mass.IRemoveFromTag=} [properties] Properties to set
             */
            function RemoveFromTag(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * RemoveFromTag eventId.
             * @member {Uint8Array} eventId
             * @memberof market.mass.RemoveFromTag
             * @instance
             */
            RemoveFromTag.prototype.eventId = $util.newBuffer([]);

            /**
             * RemoveFromTag tagId.
             * @member {Uint8Array} tagId
             * @memberof market.mass.RemoveFromTag
             * @instance
             */
            RemoveFromTag.prototype.tagId = $util.newBuffer([]);

            /**
             * RemoveFromTag itemId.
             * @member {Uint8Array} itemId
             * @memberof market.mass.RemoveFromTag
             * @instance
             */
            RemoveFromTag.prototype.itemId = $util.newBuffer([]);

            /**
             * Creates a new RemoveFromTag instance using the specified properties.
             * @function create
             * @memberof market.mass.RemoveFromTag
             * @static
             * @param {market.mass.IRemoveFromTag=} [properties] Properties to set
             * @returns {market.mass.RemoveFromTag} RemoveFromTag instance
             */
            RemoveFromTag.create = function create(properties) {
                return new RemoveFromTag(properties);
            };

            /**
             * Encodes the specified RemoveFromTag message. Does not implicitly {@link market.mass.RemoveFromTag.verify|verify} messages.
             * @function encode
             * @memberof market.mass.RemoveFromTag
             * @static
             * @param {market.mass.IRemoveFromTag} message RemoveFromTag message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            RemoveFromTag.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.eventId != null && Object.hasOwnProperty.call(message, "eventId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.eventId);
                if (message.tagId != null && Object.hasOwnProperty.call(message, "tagId"))
                    writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.tagId);
                if (message.itemId != null && Object.hasOwnProperty.call(message, "itemId"))
                    writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.itemId);
                return writer;
            };

            /**
             * Encodes the specified RemoveFromTag message, length delimited. Does not implicitly {@link market.mass.RemoveFromTag.verify|verify} messages.
             * @function encodeDelimited
             * @memberof market.mass.RemoveFromTag
             * @static
             * @param {market.mass.IRemoveFromTag} message RemoveFromTag message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            RemoveFromTag.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a RemoveFromTag message from the specified reader or buffer.
             * @function decode
             * @memberof market.mass.RemoveFromTag
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {market.mass.RemoveFromTag} RemoveFromTag
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            RemoveFromTag.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.RemoveFromTag();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.eventId = reader.bytes();
                            break;
                        }
                    case 2: {
                            message.tagId = reader.bytes();
                            break;
                        }
                    case 3: {
                            message.itemId = reader.bytes();
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
             * Decodes a RemoveFromTag message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof market.mass.RemoveFromTag
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {market.mass.RemoveFromTag} RemoveFromTag
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            RemoveFromTag.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a RemoveFromTag message.
             * @function verify
             * @memberof market.mass.RemoveFromTag
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            RemoveFromTag.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.eventId != null && message.hasOwnProperty("eventId"))
                    if (!(message.eventId && typeof message.eventId.length === "number" || $util.isString(message.eventId)))
                        return "eventId: buffer expected";
                if (message.tagId != null && message.hasOwnProperty("tagId"))
                    if (!(message.tagId && typeof message.tagId.length === "number" || $util.isString(message.tagId)))
                        return "tagId: buffer expected";
                if (message.itemId != null && message.hasOwnProperty("itemId"))
                    if (!(message.itemId && typeof message.itemId.length === "number" || $util.isString(message.itemId)))
                        return "itemId: buffer expected";
                return null;
            };

            /**
             * Creates a RemoveFromTag message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof market.mass.RemoveFromTag
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {market.mass.RemoveFromTag} RemoveFromTag
             */
            RemoveFromTag.fromObject = function fromObject(object) {
                if (object instanceof $root.market.mass.RemoveFromTag)
                    return object;
                let message = new $root.market.mass.RemoveFromTag();
                if (object.eventId != null)
                    if (typeof object.eventId === "string")
                        $util.base64.decode(object.eventId, message.eventId = $util.newBuffer($util.base64.length(object.eventId)), 0);
                    else if (object.eventId.length >= 0)
                        message.eventId = object.eventId;
                if (object.tagId != null)
                    if (typeof object.tagId === "string")
                        $util.base64.decode(object.tagId, message.tagId = $util.newBuffer($util.base64.length(object.tagId)), 0);
                    else if (object.tagId.length >= 0)
                        message.tagId = object.tagId;
                if (object.itemId != null)
                    if (typeof object.itemId === "string")
                        $util.base64.decode(object.itemId, message.itemId = $util.newBuffer($util.base64.length(object.itemId)), 0);
                    else if (object.itemId.length >= 0)
                        message.itemId = object.itemId;
                return message;
            };

            /**
             * Creates a plain object from a RemoveFromTag message. Also converts values to other types if specified.
             * @function toObject
             * @memberof market.mass.RemoveFromTag
             * @static
             * @param {market.mass.RemoveFromTag} message RemoveFromTag
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            RemoveFromTag.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    if (options.bytes === String)
                        object.eventId = "";
                    else {
                        object.eventId = [];
                        if (options.bytes !== Array)
                            object.eventId = $util.newBuffer(object.eventId);
                    }
                    if (options.bytes === String)
                        object.tagId = "";
                    else {
                        object.tagId = [];
                        if (options.bytes !== Array)
                            object.tagId = $util.newBuffer(object.tagId);
                    }
                    if (options.bytes === String)
                        object.itemId = "";
                    else {
                        object.itemId = [];
                        if (options.bytes !== Array)
                            object.itemId = $util.newBuffer(object.itemId);
                    }
                }
                if (message.eventId != null && message.hasOwnProperty("eventId"))
                    object.eventId = options.bytes === String ? $util.base64.encode(message.eventId, 0, message.eventId.length) : options.bytes === Array ? Array.prototype.slice.call(message.eventId) : message.eventId;
                if (message.tagId != null && message.hasOwnProperty("tagId"))
                    object.tagId = options.bytes === String ? $util.base64.encode(message.tagId, 0, message.tagId.length) : options.bytes === Array ? Array.prototype.slice.call(message.tagId) : message.tagId;
                if (message.itemId != null && message.hasOwnProperty("itemId"))
                    object.itemId = options.bytes === String ? $util.base64.encode(message.itemId, 0, message.itemId.length) : options.bytes === Array ? Array.prototype.slice.call(message.itemId) : message.itemId;
                return object;
            };

            /**
             * Converts this RemoveFromTag to JSON.
             * @function toJSON
             * @memberof market.mass.RemoveFromTag
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            RemoveFromTag.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for RemoveFromTag
             * @function getTypeUrl
             * @memberof market.mass.RemoveFromTag
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            RemoveFromTag.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/market.mass.RemoveFromTag";
            };

            return RemoveFromTag;
        })();

        mass.RenameTag = (function() {

            /**
             * Properties of a RenameTag.
             * @memberof market.mass
             * @interface IRenameTag
             * @property {Uint8Array|null} [eventId] RenameTag eventId
             * @property {Uint8Array|null} [tagId] RenameTag tagId
             * @property {string|null} [name] RenameTag name
             */

            /**
             * Constructs a new RenameTag.
             * @memberof market.mass
             * @classdesc Represents a RenameTag.
             * @implements IRenameTag
             * @constructor
             * @param {market.mass.IRenameTag=} [properties] Properties to set
             */
            function RenameTag(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * RenameTag eventId.
             * @member {Uint8Array} eventId
             * @memberof market.mass.RenameTag
             * @instance
             */
            RenameTag.prototype.eventId = $util.newBuffer([]);

            /**
             * RenameTag tagId.
             * @member {Uint8Array} tagId
             * @memberof market.mass.RenameTag
             * @instance
             */
            RenameTag.prototype.tagId = $util.newBuffer([]);

            /**
             * RenameTag name.
             * @member {string} name
             * @memberof market.mass.RenameTag
             * @instance
             */
            RenameTag.prototype.name = "";

            /**
             * Creates a new RenameTag instance using the specified properties.
             * @function create
             * @memberof market.mass.RenameTag
             * @static
             * @param {market.mass.IRenameTag=} [properties] Properties to set
             * @returns {market.mass.RenameTag} RenameTag instance
             */
            RenameTag.create = function create(properties) {
                return new RenameTag(properties);
            };

            /**
             * Encodes the specified RenameTag message. Does not implicitly {@link market.mass.RenameTag.verify|verify} messages.
             * @function encode
             * @memberof market.mass.RenameTag
             * @static
             * @param {market.mass.IRenameTag} message RenameTag message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            RenameTag.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.eventId != null && Object.hasOwnProperty.call(message, "eventId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.eventId);
                if (message.tagId != null && Object.hasOwnProperty.call(message, "tagId"))
                    writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.tagId);
                if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.name);
                return writer;
            };

            /**
             * Encodes the specified RenameTag message, length delimited. Does not implicitly {@link market.mass.RenameTag.verify|verify} messages.
             * @function encodeDelimited
             * @memberof market.mass.RenameTag
             * @static
             * @param {market.mass.IRenameTag} message RenameTag message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            RenameTag.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a RenameTag message from the specified reader or buffer.
             * @function decode
             * @memberof market.mass.RenameTag
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {market.mass.RenameTag} RenameTag
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            RenameTag.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.RenameTag();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.eventId = reader.bytes();
                            break;
                        }
                    case 2: {
                            message.tagId = reader.bytes();
                            break;
                        }
                    case 3: {
                            message.name = reader.string();
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
             * Decodes a RenameTag message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof market.mass.RenameTag
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {market.mass.RenameTag} RenameTag
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            RenameTag.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a RenameTag message.
             * @function verify
             * @memberof market.mass.RenameTag
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            RenameTag.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.eventId != null && message.hasOwnProperty("eventId"))
                    if (!(message.eventId && typeof message.eventId.length === "number" || $util.isString(message.eventId)))
                        return "eventId: buffer expected";
                if (message.tagId != null && message.hasOwnProperty("tagId"))
                    if (!(message.tagId && typeof message.tagId.length === "number" || $util.isString(message.tagId)))
                        return "tagId: buffer expected";
                if (message.name != null && message.hasOwnProperty("name"))
                    if (!$util.isString(message.name))
                        return "name: string expected";
                return null;
            };

            /**
             * Creates a RenameTag message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof market.mass.RenameTag
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {market.mass.RenameTag} RenameTag
             */
            RenameTag.fromObject = function fromObject(object) {
                if (object instanceof $root.market.mass.RenameTag)
                    return object;
                let message = new $root.market.mass.RenameTag();
                if (object.eventId != null)
                    if (typeof object.eventId === "string")
                        $util.base64.decode(object.eventId, message.eventId = $util.newBuffer($util.base64.length(object.eventId)), 0);
                    else if (object.eventId.length >= 0)
                        message.eventId = object.eventId;
                if (object.tagId != null)
                    if (typeof object.tagId === "string")
                        $util.base64.decode(object.tagId, message.tagId = $util.newBuffer($util.base64.length(object.tagId)), 0);
                    else if (object.tagId.length >= 0)
                        message.tagId = object.tagId;
                if (object.name != null)
                    message.name = String(object.name);
                return message;
            };

            /**
             * Creates a plain object from a RenameTag message. Also converts values to other types if specified.
             * @function toObject
             * @memberof market.mass.RenameTag
             * @static
             * @param {market.mass.RenameTag} message RenameTag
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            RenameTag.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    if (options.bytes === String)
                        object.eventId = "";
                    else {
                        object.eventId = [];
                        if (options.bytes !== Array)
                            object.eventId = $util.newBuffer(object.eventId);
                    }
                    if (options.bytes === String)
                        object.tagId = "";
                    else {
                        object.tagId = [];
                        if (options.bytes !== Array)
                            object.tagId = $util.newBuffer(object.tagId);
                    }
                    object.name = "";
                }
                if (message.eventId != null && message.hasOwnProperty("eventId"))
                    object.eventId = options.bytes === String ? $util.base64.encode(message.eventId, 0, message.eventId.length) : options.bytes === Array ? Array.prototype.slice.call(message.eventId) : message.eventId;
                if (message.tagId != null && message.hasOwnProperty("tagId"))
                    object.tagId = options.bytes === String ? $util.base64.encode(message.tagId, 0, message.tagId.length) : options.bytes === Array ? Array.prototype.slice.call(message.tagId) : message.tagId;
                if (message.name != null && message.hasOwnProperty("name"))
                    object.name = message.name;
                return object;
            };

            /**
             * Converts this RenameTag to JSON.
             * @function toJSON
             * @memberof market.mass.RenameTag
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            RenameTag.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for RenameTag
             * @function getTypeUrl
             * @memberof market.mass.RenameTag
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            RenameTag.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/market.mass.RenameTag";
            };

            return RenameTag;
        })();

        mass.DeleteTag = (function() {

            /**
             * Properties of a DeleteTag.
             * @memberof market.mass
             * @interface IDeleteTag
             * @property {Uint8Array|null} [eventId] DeleteTag eventId
             * @property {Uint8Array|null} [tagId] DeleteTag tagId
             */

            /**
             * Constructs a new DeleteTag.
             * @memberof market.mass
             * @classdesc Represents a DeleteTag.
             * @implements IDeleteTag
             * @constructor
             * @param {market.mass.IDeleteTag=} [properties] Properties to set
             */
            function DeleteTag(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * DeleteTag eventId.
             * @member {Uint8Array} eventId
             * @memberof market.mass.DeleteTag
             * @instance
             */
            DeleteTag.prototype.eventId = $util.newBuffer([]);

            /**
             * DeleteTag tagId.
             * @member {Uint8Array} tagId
             * @memberof market.mass.DeleteTag
             * @instance
             */
            DeleteTag.prototype.tagId = $util.newBuffer([]);

            /**
             * Creates a new DeleteTag instance using the specified properties.
             * @function create
             * @memberof market.mass.DeleteTag
             * @static
             * @param {market.mass.IDeleteTag=} [properties] Properties to set
             * @returns {market.mass.DeleteTag} DeleteTag instance
             */
            DeleteTag.create = function create(properties) {
                return new DeleteTag(properties);
            };

            /**
             * Encodes the specified DeleteTag message. Does not implicitly {@link market.mass.DeleteTag.verify|verify} messages.
             * @function encode
             * @memberof market.mass.DeleteTag
             * @static
             * @param {market.mass.IDeleteTag} message DeleteTag message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DeleteTag.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.eventId != null && Object.hasOwnProperty.call(message, "eventId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.eventId);
                if (message.tagId != null && Object.hasOwnProperty.call(message, "tagId"))
                    writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.tagId);
                return writer;
            };

            /**
             * Encodes the specified DeleteTag message, length delimited. Does not implicitly {@link market.mass.DeleteTag.verify|verify} messages.
             * @function encodeDelimited
             * @memberof market.mass.DeleteTag
             * @static
             * @param {market.mass.IDeleteTag} message DeleteTag message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DeleteTag.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a DeleteTag message from the specified reader or buffer.
             * @function decode
             * @memberof market.mass.DeleteTag
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {market.mass.DeleteTag} DeleteTag
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DeleteTag.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.DeleteTag();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.eventId = reader.bytes();
                            break;
                        }
                    case 2: {
                            message.tagId = reader.bytes();
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
             * Decodes a DeleteTag message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof market.mass.DeleteTag
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {market.mass.DeleteTag} DeleteTag
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DeleteTag.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a DeleteTag message.
             * @function verify
             * @memberof market.mass.DeleteTag
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            DeleteTag.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.eventId != null && message.hasOwnProperty("eventId"))
                    if (!(message.eventId && typeof message.eventId.length === "number" || $util.isString(message.eventId)))
                        return "eventId: buffer expected";
                if (message.tagId != null && message.hasOwnProperty("tagId"))
                    if (!(message.tagId && typeof message.tagId.length === "number" || $util.isString(message.tagId)))
                        return "tagId: buffer expected";
                return null;
            };

            /**
             * Creates a DeleteTag message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof market.mass.DeleteTag
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {market.mass.DeleteTag} DeleteTag
             */
            DeleteTag.fromObject = function fromObject(object) {
                if (object instanceof $root.market.mass.DeleteTag)
                    return object;
                let message = new $root.market.mass.DeleteTag();
                if (object.eventId != null)
                    if (typeof object.eventId === "string")
                        $util.base64.decode(object.eventId, message.eventId = $util.newBuffer($util.base64.length(object.eventId)), 0);
                    else if (object.eventId.length >= 0)
                        message.eventId = object.eventId;
                if (object.tagId != null)
                    if (typeof object.tagId === "string")
                        $util.base64.decode(object.tagId, message.tagId = $util.newBuffer($util.base64.length(object.tagId)), 0);
                    else if (object.tagId.length >= 0)
                        message.tagId = object.tagId;
                return message;
            };

            /**
             * Creates a plain object from a DeleteTag message. Also converts values to other types if specified.
             * @function toObject
             * @memberof market.mass.DeleteTag
             * @static
             * @param {market.mass.DeleteTag} message DeleteTag
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            DeleteTag.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    if (options.bytes === String)
                        object.eventId = "";
                    else {
                        object.eventId = [];
                        if (options.bytes !== Array)
                            object.eventId = $util.newBuffer(object.eventId);
                    }
                    if (options.bytes === String)
                        object.tagId = "";
                    else {
                        object.tagId = [];
                        if (options.bytes !== Array)
                            object.tagId = $util.newBuffer(object.tagId);
                    }
                }
                if (message.eventId != null && message.hasOwnProperty("eventId"))
                    object.eventId = options.bytes === String ? $util.base64.encode(message.eventId, 0, message.eventId.length) : options.bytes === Array ? Array.prototype.slice.call(message.eventId) : message.eventId;
                if (message.tagId != null && message.hasOwnProperty("tagId"))
                    object.tagId = options.bytes === String ? $util.base64.encode(message.tagId, 0, message.tagId.length) : options.bytes === Array ? Array.prototype.slice.call(message.tagId) : message.tagId;
                return object;
            };

            /**
             * Converts this DeleteTag to JSON.
             * @function toJSON
             * @memberof market.mass.DeleteTag
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            DeleteTag.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for DeleteTag
             * @function getTypeUrl
             * @memberof market.mass.DeleteTag
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            DeleteTag.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/market.mass.DeleteTag";
            };

            return DeleteTag;
        })();

        mass.ChangeStock = (function() {

            /**
             * Properties of a ChangeStock.
             * @memberof market.mass
             * @interface IChangeStock
             * @property {Uint8Array|null} [eventId] ChangeStock eventId
             * @property {Array.<Uint8Array>|null} [itemIds] ChangeStock itemIds
             * @property {Array.<number>|null} [diffs] ChangeStock diffs
             * @property {Uint8Array|null} [cartId] ChangeStock cartId
             * @property {Uint8Array|null} [txHash] ChangeStock txHash
             */

            /**
             * Constructs a new ChangeStock.
             * @memberof market.mass
             * @classdesc Represents a ChangeStock.
             * @implements IChangeStock
             * @constructor
             * @param {market.mass.IChangeStock=} [properties] Properties to set
             */
            function ChangeStock(properties) {
                this.itemIds = [];
                this.diffs = [];
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * ChangeStock eventId.
             * @member {Uint8Array} eventId
             * @memberof market.mass.ChangeStock
             * @instance
             */
            ChangeStock.prototype.eventId = $util.newBuffer([]);

            /**
             * ChangeStock itemIds.
             * @member {Array.<Uint8Array>} itemIds
             * @memberof market.mass.ChangeStock
             * @instance
             */
            ChangeStock.prototype.itemIds = $util.emptyArray;

            /**
             * ChangeStock diffs.
             * @member {Array.<number>} diffs
             * @memberof market.mass.ChangeStock
             * @instance
             */
            ChangeStock.prototype.diffs = $util.emptyArray;

            /**
             * ChangeStock cartId.
             * @member {Uint8Array} cartId
             * @memberof market.mass.ChangeStock
             * @instance
             */
            ChangeStock.prototype.cartId = $util.newBuffer([]);

            /**
             * ChangeStock txHash.
             * @member {Uint8Array} txHash
             * @memberof market.mass.ChangeStock
             * @instance
             */
            ChangeStock.prototype.txHash = $util.newBuffer([]);

            /**
             * Creates a new ChangeStock instance using the specified properties.
             * @function create
             * @memberof market.mass.ChangeStock
             * @static
             * @param {market.mass.IChangeStock=} [properties] Properties to set
             * @returns {market.mass.ChangeStock} ChangeStock instance
             */
            ChangeStock.create = function create(properties) {
                return new ChangeStock(properties);
            };

            /**
             * Encodes the specified ChangeStock message. Does not implicitly {@link market.mass.ChangeStock.verify|verify} messages.
             * @function encode
             * @memberof market.mass.ChangeStock
             * @static
             * @param {market.mass.IChangeStock} message ChangeStock message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ChangeStock.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.eventId != null && Object.hasOwnProperty.call(message, "eventId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.eventId);
                if (message.itemIds != null && message.itemIds.length)
                    for (let i = 0; i < message.itemIds.length; ++i)
                        writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.itemIds[i]);
                if (message.diffs != null && message.diffs.length) {
                    writer.uint32(/* id 3, wireType 2 =*/26).fork();
                    for (let i = 0; i < message.diffs.length; ++i)
                        writer.sint32(message.diffs[i]);
                    writer.ldelim();
                }
                if (message.cartId != null && Object.hasOwnProperty.call(message, "cartId"))
                    writer.uint32(/* id 4, wireType 2 =*/34).bytes(message.cartId);
                if (message.txHash != null && Object.hasOwnProperty.call(message, "txHash"))
                    writer.uint32(/* id 5, wireType 2 =*/42).bytes(message.txHash);
                return writer;
            };

            /**
             * Encodes the specified ChangeStock message, length delimited. Does not implicitly {@link market.mass.ChangeStock.verify|verify} messages.
             * @function encodeDelimited
             * @memberof market.mass.ChangeStock
             * @static
             * @param {market.mass.IChangeStock} message ChangeStock message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ChangeStock.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a ChangeStock message from the specified reader or buffer.
             * @function decode
             * @memberof market.mass.ChangeStock
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {market.mass.ChangeStock} ChangeStock
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ChangeStock.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.ChangeStock();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.eventId = reader.bytes();
                            break;
                        }
                    case 2: {
                            if (!(message.itemIds && message.itemIds.length))
                                message.itemIds = [];
                            message.itemIds.push(reader.bytes());
                            break;
                        }
                    case 3: {
                            if (!(message.diffs && message.diffs.length))
                                message.diffs = [];
                            if ((tag & 7) === 2) {
                                let end2 = reader.uint32() + reader.pos;
                                while (reader.pos < end2)
                                    message.diffs.push(reader.sint32());
                            } else
                                message.diffs.push(reader.sint32());
                            break;
                        }
                    case 4: {
                            message.cartId = reader.bytes();
                            break;
                        }
                    case 5: {
                            message.txHash = reader.bytes();
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
             * Decodes a ChangeStock message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof market.mass.ChangeStock
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {market.mass.ChangeStock} ChangeStock
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ChangeStock.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ChangeStock message.
             * @function verify
             * @memberof market.mass.ChangeStock
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ChangeStock.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.eventId != null && message.hasOwnProperty("eventId"))
                    if (!(message.eventId && typeof message.eventId.length === "number" || $util.isString(message.eventId)))
                        return "eventId: buffer expected";
                if (message.itemIds != null && message.hasOwnProperty("itemIds")) {
                    if (!Array.isArray(message.itemIds))
                        return "itemIds: array expected";
                    for (let i = 0; i < message.itemIds.length; ++i)
                        if (!(message.itemIds[i] && typeof message.itemIds[i].length === "number" || $util.isString(message.itemIds[i])))
                            return "itemIds: buffer[] expected";
                }
                if (message.diffs != null && message.hasOwnProperty("diffs")) {
                    if (!Array.isArray(message.diffs))
                        return "diffs: array expected";
                    for (let i = 0; i < message.diffs.length; ++i)
                        if (!$util.isInteger(message.diffs[i]))
                            return "diffs: integer[] expected";
                }
                if (message.cartId != null && message.hasOwnProperty("cartId"))
                    if (!(message.cartId && typeof message.cartId.length === "number" || $util.isString(message.cartId)))
                        return "cartId: buffer expected";
                if (message.txHash != null && message.hasOwnProperty("txHash"))
                    if (!(message.txHash && typeof message.txHash.length === "number" || $util.isString(message.txHash)))
                        return "txHash: buffer expected";
                return null;
            };

            /**
             * Creates a ChangeStock message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof market.mass.ChangeStock
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {market.mass.ChangeStock} ChangeStock
             */
            ChangeStock.fromObject = function fromObject(object) {
                if (object instanceof $root.market.mass.ChangeStock)
                    return object;
                let message = new $root.market.mass.ChangeStock();
                if (object.eventId != null)
                    if (typeof object.eventId === "string")
                        $util.base64.decode(object.eventId, message.eventId = $util.newBuffer($util.base64.length(object.eventId)), 0);
                    else if (object.eventId.length >= 0)
                        message.eventId = object.eventId;
                if (object.itemIds) {
                    if (!Array.isArray(object.itemIds))
                        throw TypeError(".market.mass.ChangeStock.itemIds: array expected");
                    message.itemIds = [];
                    for (let i = 0; i < object.itemIds.length; ++i)
                        if (typeof object.itemIds[i] === "string")
                            $util.base64.decode(object.itemIds[i], message.itemIds[i] = $util.newBuffer($util.base64.length(object.itemIds[i])), 0);
                        else if (object.itemIds[i].length >= 0)
                            message.itemIds[i] = object.itemIds[i];
                }
                if (object.diffs) {
                    if (!Array.isArray(object.diffs))
                        throw TypeError(".market.mass.ChangeStock.diffs: array expected");
                    message.diffs = [];
                    for (let i = 0; i < object.diffs.length; ++i)
                        message.diffs[i] = object.diffs[i] | 0;
                }
                if (object.cartId != null)
                    if (typeof object.cartId === "string")
                        $util.base64.decode(object.cartId, message.cartId = $util.newBuffer($util.base64.length(object.cartId)), 0);
                    else if (object.cartId.length >= 0)
                        message.cartId = object.cartId;
                if (object.txHash != null)
                    if (typeof object.txHash === "string")
                        $util.base64.decode(object.txHash, message.txHash = $util.newBuffer($util.base64.length(object.txHash)), 0);
                    else if (object.txHash.length >= 0)
                        message.txHash = object.txHash;
                return message;
            };

            /**
             * Creates a plain object from a ChangeStock message. Also converts values to other types if specified.
             * @function toObject
             * @memberof market.mass.ChangeStock
             * @static
             * @param {market.mass.ChangeStock} message ChangeStock
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ChangeStock.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.arrays || options.defaults) {
                    object.itemIds = [];
                    object.diffs = [];
                }
                if (options.defaults) {
                    if (options.bytes === String)
                        object.eventId = "";
                    else {
                        object.eventId = [];
                        if (options.bytes !== Array)
                            object.eventId = $util.newBuffer(object.eventId);
                    }
                    if (options.bytes === String)
                        object.cartId = "";
                    else {
                        object.cartId = [];
                        if (options.bytes !== Array)
                            object.cartId = $util.newBuffer(object.cartId);
                    }
                    if (options.bytes === String)
                        object.txHash = "";
                    else {
                        object.txHash = [];
                        if (options.bytes !== Array)
                            object.txHash = $util.newBuffer(object.txHash);
                    }
                }
                if (message.eventId != null && message.hasOwnProperty("eventId"))
                    object.eventId = options.bytes === String ? $util.base64.encode(message.eventId, 0, message.eventId.length) : options.bytes === Array ? Array.prototype.slice.call(message.eventId) : message.eventId;
                if (message.itemIds && message.itemIds.length) {
                    object.itemIds = [];
                    for (let j = 0; j < message.itemIds.length; ++j)
                        object.itemIds[j] = options.bytes === String ? $util.base64.encode(message.itemIds[j], 0, message.itemIds[j].length) : options.bytes === Array ? Array.prototype.slice.call(message.itemIds[j]) : message.itemIds[j];
                }
                if (message.diffs && message.diffs.length) {
                    object.diffs = [];
                    for (let j = 0; j < message.diffs.length; ++j)
                        object.diffs[j] = message.diffs[j];
                }
                if (message.cartId != null && message.hasOwnProperty("cartId"))
                    object.cartId = options.bytes === String ? $util.base64.encode(message.cartId, 0, message.cartId.length) : options.bytes === Array ? Array.prototype.slice.call(message.cartId) : message.cartId;
                if (message.txHash != null && message.hasOwnProperty("txHash"))
                    object.txHash = options.bytes === String ? $util.base64.encode(message.txHash, 0, message.txHash.length) : options.bytes === Array ? Array.prototype.slice.call(message.txHash) : message.txHash;
                return object;
            };

            /**
             * Converts this ChangeStock to JSON.
             * @function toJSON
             * @memberof market.mass.ChangeStock
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ChangeStock.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for ChangeStock
             * @function getTypeUrl
             * @memberof market.mass.ChangeStock
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            ChangeStock.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/market.mass.ChangeStock";
            };

            return ChangeStock;
        })();

        mass.NewKeyCard = (function() {

            /**
             * Properties of a NewKeyCard.
             * @memberof market.mass
             * @interface INewKeyCard
             * @property {Uint8Array|null} [eventId] NewKeyCard eventId
             * @property {Uint8Array|null} [userWalletAddr] NewKeyCard userWalletAddr
             * @property {Uint8Array|null} [cardPublicKey] NewKeyCard cardPublicKey
             */

            /**
             * Constructs a new NewKeyCard.
             * @memberof market.mass
             * @classdesc Represents a NewKeyCard.
             * @implements INewKeyCard
             * @constructor
             * @param {market.mass.INewKeyCard=} [properties] Properties to set
             */
            function NewKeyCard(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * NewKeyCard eventId.
             * @member {Uint8Array} eventId
             * @memberof market.mass.NewKeyCard
             * @instance
             */
            NewKeyCard.prototype.eventId = $util.newBuffer([]);

            /**
             * NewKeyCard userWalletAddr.
             * @member {Uint8Array} userWalletAddr
             * @memberof market.mass.NewKeyCard
             * @instance
             */
            NewKeyCard.prototype.userWalletAddr = $util.newBuffer([]);

            /**
             * NewKeyCard cardPublicKey.
             * @member {Uint8Array} cardPublicKey
             * @memberof market.mass.NewKeyCard
             * @instance
             */
            NewKeyCard.prototype.cardPublicKey = $util.newBuffer([]);

            /**
             * Creates a new NewKeyCard instance using the specified properties.
             * @function create
             * @memberof market.mass.NewKeyCard
             * @static
             * @param {market.mass.INewKeyCard=} [properties] Properties to set
             * @returns {market.mass.NewKeyCard} NewKeyCard instance
             */
            NewKeyCard.create = function create(properties) {
                return new NewKeyCard(properties);
            };

            /**
             * Encodes the specified NewKeyCard message. Does not implicitly {@link market.mass.NewKeyCard.verify|verify} messages.
             * @function encode
             * @memberof market.mass.NewKeyCard
             * @static
             * @param {market.mass.INewKeyCard} message NewKeyCard message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            NewKeyCard.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.eventId != null && Object.hasOwnProperty.call(message, "eventId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.eventId);
                if (message.userWalletAddr != null && Object.hasOwnProperty.call(message, "userWalletAddr"))
                    writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.userWalletAddr);
                if (message.cardPublicKey != null && Object.hasOwnProperty.call(message, "cardPublicKey"))
                    writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.cardPublicKey);
                return writer;
            };

            /**
             * Encodes the specified NewKeyCard message, length delimited. Does not implicitly {@link market.mass.NewKeyCard.verify|verify} messages.
             * @function encodeDelimited
             * @memberof market.mass.NewKeyCard
             * @static
             * @param {market.mass.INewKeyCard} message NewKeyCard message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            NewKeyCard.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a NewKeyCard message from the specified reader or buffer.
             * @function decode
             * @memberof market.mass.NewKeyCard
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {market.mass.NewKeyCard} NewKeyCard
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            NewKeyCard.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.NewKeyCard();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.eventId = reader.bytes();
                            break;
                        }
                    case 2: {
                            message.userWalletAddr = reader.bytes();
                            break;
                        }
                    case 3: {
                            message.cardPublicKey = reader.bytes();
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
             * Decodes a NewKeyCard message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof market.mass.NewKeyCard
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {market.mass.NewKeyCard} NewKeyCard
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            NewKeyCard.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a NewKeyCard message.
             * @function verify
             * @memberof market.mass.NewKeyCard
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            NewKeyCard.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.eventId != null && message.hasOwnProperty("eventId"))
                    if (!(message.eventId && typeof message.eventId.length === "number" || $util.isString(message.eventId)))
                        return "eventId: buffer expected";
                if (message.userWalletAddr != null && message.hasOwnProperty("userWalletAddr"))
                    if (!(message.userWalletAddr && typeof message.userWalletAddr.length === "number" || $util.isString(message.userWalletAddr)))
                        return "userWalletAddr: buffer expected";
                if (message.cardPublicKey != null && message.hasOwnProperty("cardPublicKey"))
                    if (!(message.cardPublicKey && typeof message.cardPublicKey.length === "number" || $util.isString(message.cardPublicKey)))
                        return "cardPublicKey: buffer expected";
                return null;
            };

            /**
             * Creates a NewKeyCard message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof market.mass.NewKeyCard
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {market.mass.NewKeyCard} NewKeyCard
             */
            NewKeyCard.fromObject = function fromObject(object) {
                if (object instanceof $root.market.mass.NewKeyCard)
                    return object;
                let message = new $root.market.mass.NewKeyCard();
                if (object.eventId != null)
                    if (typeof object.eventId === "string")
                        $util.base64.decode(object.eventId, message.eventId = $util.newBuffer($util.base64.length(object.eventId)), 0);
                    else if (object.eventId.length >= 0)
                        message.eventId = object.eventId;
                if (object.userWalletAddr != null)
                    if (typeof object.userWalletAddr === "string")
                        $util.base64.decode(object.userWalletAddr, message.userWalletAddr = $util.newBuffer($util.base64.length(object.userWalletAddr)), 0);
                    else if (object.userWalletAddr.length >= 0)
                        message.userWalletAddr = object.userWalletAddr;
                if (object.cardPublicKey != null)
                    if (typeof object.cardPublicKey === "string")
                        $util.base64.decode(object.cardPublicKey, message.cardPublicKey = $util.newBuffer($util.base64.length(object.cardPublicKey)), 0);
                    else if (object.cardPublicKey.length >= 0)
                        message.cardPublicKey = object.cardPublicKey;
                return message;
            };

            /**
             * Creates a plain object from a NewKeyCard message. Also converts values to other types if specified.
             * @function toObject
             * @memberof market.mass.NewKeyCard
             * @static
             * @param {market.mass.NewKeyCard} message NewKeyCard
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            NewKeyCard.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    if (options.bytes === String)
                        object.eventId = "";
                    else {
                        object.eventId = [];
                        if (options.bytes !== Array)
                            object.eventId = $util.newBuffer(object.eventId);
                    }
                    if (options.bytes === String)
                        object.userWalletAddr = "";
                    else {
                        object.userWalletAddr = [];
                        if (options.bytes !== Array)
                            object.userWalletAddr = $util.newBuffer(object.userWalletAddr);
                    }
                    if (options.bytes === String)
                        object.cardPublicKey = "";
                    else {
                        object.cardPublicKey = [];
                        if (options.bytes !== Array)
                            object.cardPublicKey = $util.newBuffer(object.cardPublicKey);
                    }
                }
                if (message.eventId != null && message.hasOwnProperty("eventId"))
                    object.eventId = options.bytes === String ? $util.base64.encode(message.eventId, 0, message.eventId.length) : options.bytes === Array ? Array.prototype.slice.call(message.eventId) : message.eventId;
                if (message.userWalletAddr != null && message.hasOwnProperty("userWalletAddr"))
                    object.userWalletAddr = options.bytes === String ? $util.base64.encode(message.userWalletAddr, 0, message.userWalletAddr.length) : options.bytes === Array ? Array.prototype.slice.call(message.userWalletAddr) : message.userWalletAddr;
                if (message.cardPublicKey != null && message.hasOwnProperty("cardPublicKey"))
                    object.cardPublicKey = options.bytes === String ? $util.base64.encode(message.cardPublicKey, 0, message.cardPublicKey.length) : options.bytes === Array ? Array.prototype.slice.call(message.cardPublicKey) : message.cardPublicKey;
                return object;
            };

            /**
             * Converts this NewKeyCard to JSON.
             * @function toJSON
             * @memberof market.mass.NewKeyCard
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            NewKeyCard.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for NewKeyCard
             * @function getTypeUrl
             * @memberof market.mass.NewKeyCard
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            NewKeyCard.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/market.mass.NewKeyCard";
            };

            return NewKeyCard;
        })();

        mass.CreateCart = (function() {

            /**
             * Properties of a CreateCart.
             * @memberof market.mass
             * @interface ICreateCart
             * @property {Uint8Array|null} [eventId] CreateCart eventId
             */

            /**
             * Constructs a new CreateCart.
             * @memberof market.mass
             * @classdesc Represents a CreateCart.
             * @implements ICreateCart
             * @constructor
             * @param {market.mass.ICreateCart=} [properties] Properties to set
             */
            function CreateCart(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * CreateCart eventId.
             * @member {Uint8Array} eventId
             * @memberof market.mass.CreateCart
             * @instance
             */
            CreateCart.prototype.eventId = $util.newBuffer([]);

            /**
             * Creates a new CreateCart instance using the specified properties.
             * @function create
             * @memberof market.mass.CreateCart
             * @static
             * @param {market.mass.ICreateCart=} [properties] Properties to set
             * @returns {market.mass.CreateCart} CreateCart instance
             */
            CreateCart.create = function create(properties) {
                return new CreateCart(properties);
            };

            /**
             * Encodes the specified CreateCart message. Does not implicitly {@link market.mass.CreateCart.verify|verify} messages.
             * @function encode
             * @memberof market.mass.CreateCart
             * @static
             * @param {market.mass.ICreateCart} message CreateCart message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CreateCart.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.eventId != null && Object.hasOwnProperty.call(message, "eventId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.eventId);
                return writer;
            };

            /**
             * Encodes the specified CreateCart message, length delimited. Does not implicitly {@link market.mass.CreateCart.verify|verify} messages.
             * @function encodeDelimited
             * @memberof market.mass.CreateCart
             * @static
             * @param {market.mass.ICreateCart} message CreateCart message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CreateCart.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a CreateCart message from the specified reader or buffer.
             * @function decode
             * @memberof market.mass.CreateCart
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {market.mass.CreateCart} CreateCart
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CreateCart.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.CreateCart();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.eventId = reader.bytes();
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
             * Decodes a CreateCart message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof market.mass.CreateCart
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {market.mass.CreateCart} CreateCart
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CreateCart.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a CreateCart message.
             * @function verify
             * @memberof market.mass.CreateCart
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            CreateCart.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.eventId != null && message.hasOwnProperty("eventId"))
                    if (!(message.eventId && typeof message.eventId.length === "number" || $util.isString(message.eventId)))
                        return "eventId: buffer expected";
                return null;
            };

            /**
             * Creates a CreateCart message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof market.mass.CreateCart
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {market.mass.CreateCart} CreateCart
             */
            CreateCart.fromObject = function fromObject(object) {
                if (object instanceof $root.market.mass.CreateCart)
                    return object;
                let message = new $root.market.mass.CreateCart();
                if (object.eventId != null)
                    if (typeof object.eventId === "string")
                        $util.base64.decode(object.eventId, message.eventId = $util.newBuffer($util.base64.length(object.eventId)), 0);
                    else if (object.eventId.length >= 0)
                        message.eventId = object.eventId;
                return message;
            };

            /**
             * Creates a plain object from a CreateCart message. Also converts values to other types if specified.
             * @function toObject
             * @memberof market.mass.CreateCart
             * @static
             * @param {market.mass.CreateCart} message CreateCart
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            CreateCart.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    if (options.bytes === String)
                        object.eventId = "";
                    else {
                        object.eventId = [];
                        if (options.bytes !== Array)
                            object.eventId = $util.newBuffer(object.eventId);
                    }
                if (message.eventId != null && message.hasOwnProperty("eventId"))
                    object.eventId = options.bytes === String ? $util.base64.encode(message.eventId, 0, message.eventId.length) : options.bytes === Array ? Array.prototype.slice.call(message.eventId) : message.eventId;
                return object;
            };

            /**
             * Converts this CreateCart to JSON.
             * @function toJSON
             * @memberof market.mass.CreateCart
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            CreateCart.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for CreateCart
             * @function getTypeUrl
             * @memberof market.mass.CreateCart
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            CreateCart.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/market.mass.CreateCart";
            };

            return CreateCart;
        })();

        mass.ChangeCart = (function() {

            /**
             * Properties of a ChangeCart.
             * @memberof market.mass
             * @interface IChangeCart
             * @property {Uint8Array|null} [eventId] ChangeCart eventId
             * @property {Uint8Array|null} [cartId] ChangeCart cartId
             * @property {Uint8Array|null} [itemId] ChangeCart itemId
             * @property {number|null} [quantity] ChangeCart quantity
             */

            /**
             * Constructs a new ChangeCart.
             * @memberof market.mass
             * @classdesc Represents a ChangeCart.
             * @implements IChangeCart
             * @constructor
             * @param {market.mass.IChangeCart=} [properties] Properties to set
             */
            function ChangeCart(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * ChangeCart eventId.
             * @member {Uint8Array} eventId
             * @memberof market.mass.ChangeCart
             * @instance
             */
            ChangeCart.prototype.eventId = $util.newBuffer([]);

            /**
             * ChangeCart cartId.
             * @member {Uint8Array} cartId
             * @memberof market.mass.ChangeCart
             * @instance
             */
            ChangeCart.prototype.cartId = $util.newBuffer([]);

            /**
             * ChangeCart itemId.
             * @member {Uint8Array} itemId
             * @memberof market.mass.ChangeCart
             * @instance
             */
            ChangeCart.prototype.itemId = $util.newBuffer([]);

            /**
             * ChangeCart quantity.
             * @member {number} quantity
             * @memberof market.mass.ChangeCart
             * @instance
             */
            ChangeCart.prototype.quantity = 0;

            /**
             * Creates a new ChangeCart instance using the specified properties.
             * @function create
             * @memberof market.mass.ChangeCart
             * @static
             * @param {market.mass.IChangeCart=} [properties] Properties to set
             * @returns {market.mass.ChangeCart} ChangeCart instance
             */
            ChangeCart.create = function create(properties) {
                return new ChangeCart(properties);
            };

            /**
             * Encodes the specified ChangeCart message. Does not implicitly {@link market.mass.ChangeCart.verify|verify} messages.
             * @function encode
             * @memberof market.mass.ChangeCart
             * @static
             * @param {market.mass.IChangeCart} message ChangeCart message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ChangeCart.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.eventId != null && Object.hasOwnProperty.call(message, "eventId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.eventId);
                if (message.cartId != null && Object.hasOwnProperty.call(message, "cartId"))
                    writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.cartId);
                if (message.itemId != null && Object.hasOwnProperty.call(message, "itemId"))
                    writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.itemId);
                if (message.quantity != null && Object.hasOwnProperty.call(message, "quantity"))
                    writer.uint32(/* id 4, wireType 0 =*/32).sint32(message.quantity);
                return writer;
            };

            /**
             * Encodes the specified ChangeCart message, length delimited. Does not implicitly {@link market.mass.ChangeCart.verify|verify} messages.
             * @function encodeDelimited
             * @memberof market.mass.ChangeCart
             * @static
             * @param {market.mass.IChangeCart} message ChangeCart message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ChangeCart.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a ChangeCart message from the specified reader or buffer.
             * @function decode
             * @memberof market.mass.ChangeCart
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {market.mass.ChangeCart} ChangeCart
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ChangeCart.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.ChangeCart();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.eventId = reader.bytes();
                            break;
                        }
                    case 2: {
                            message.cartId = reader.bytes();
                            break;
                        }
                    case 3: {
                            message.itemId = reader.bytes();
                            break;
                        }
                    case 4: {
                            message.quantity = reader.sint32();
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
             * Decodes a ChangeCart message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof market.mass.ChangeCart
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {market.mass.ChangeCart} ChangeCart
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ChangeCart.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ChangeCart message.
             * @function verify
             * @memberof market.mass.ChangeCart
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ChangeCart.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.eventId != null && message.hasOwnProperty("eventId"))
                    if (!(message.eventId && typeof message.eventId.length === "number" || $util.isString(message.eventId)))
                        return "eventId: buffer expected";
                if (message.cartId != null && message.hasOwnProperty("cartId"))
                    if (!(message.cartId && typeof message.cartId.length === "number" || $util.isString(message.cartId)))
                        return "cartId: buffer expected";
                if (message.itemId != null && message.hasOwnProperty("itemId"))
                    if (!(message.itemId && typeof message.itemId.length === "number" || $util.isString(message.itemId)))
                        return "itemId: buffer expected";
                if (message.quantity != null && message.hasOwnProperty("quantity"))
                    if (!$util.isInteger(message.quantity))
                        return "quantity: integer expected";
                return null;
            };

            /**
             * Creates a ChangeCart message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof market.mass.ChangeCart
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {market.mass.ChangeCart} ChangeCart
             */
            ChangeCart.fromObject = function fromObject(object) {
                if (object instanceof $root.market.mass.ChangeCart)
                    return object;
                let message = new $root.market.mass.ChangeCart();
                if (object.eventId != null)
                    if (typeof object.eventId === "string")
                        $util.base64.decode(object.eventId, message.eventId = $util.newBuffer($util.base64.length(object.eventId)), 0);
                    else if (object.eventId.length >= 0)
                        message.eventId = object.eventId;
                if (object.cartId != null)
                    if (typeof object.cartId === "string")
                        $util.base64.decode(object.cartId, message.cartId = $util.newBuffer($util.base64.length(object.cartId)), 0);
                    else if (object.cartId.length >= 0)
                        message.cartId = object.cartId;
                if (object.itemId != null)
                    if (typeof object.itemId === "string")
                        $util.base64.decode(object.itemId, message.itemId = $util.newBuffer($util.base64.length(object.itemId)), 0);
                    else if (object.itemId.length >= 0)
                        message.itemId = object.itemId;
                if (object.quantity != null)
                    message.quantity = object.quantity | 0;
                return message;
            };

            /**
             * Creates a plain object from a ChangeCart message. Also converts values to other types if specified.
             * @function toObject
             * @memberof market.mass.ChangeCart
             * @static
             * @param {market.mass.ChangeCart} message ChangeCart
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ChangeCart.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    if (options.bytes === String)
                        object.eventId = "";
                    else {
                        object.eventId = [];
                        if (options.bytes !== Array)
                            object.eventId = $util.newBuffer(object.eventId);
                    }
                    if (options.bytes === String)
                        object.cartId = "";
                    else {
                        object.cartId = [];
                        if (options.bytes !== Array)
                            object.cartId = $util.newBuffer(object.cartId);
                    }
                    if (options.bytes === String)
                        object.itemId = "";
                    else {
                        object.itemId = [];
                        if (options.bytes !== Array)
                            object.itemId = $util.newBuffer(object.itemId);
                    }
                    object.quantity = 0;
                }
                if (message.eventId != null && message.hasOwnProperty("eventId"))
                    object.eventId = options.bytes === String ? $util.base64.encode(message.eventId, 0, message.eventId.length) : options.bytes === Array ? Array.prototype.slice.call(message.eventId) : message.eventId;
                if (message.cartId != null && message.hasOwnProperty("cartId"))
                    object.cartId = options.bytes === String ? $util.base64.encode(message.cartId, 0, message.cartId.length) : options.bytes === Array ? Array.prototype.slice.call(message.cartId) : message.cartId;
                if (message.itemId != null && message.hasOwnProperty("itemId"))
                    object.itemId = options.bytes === String ? $util.base64.encode(message.itemId, 0, message.itemId.length) : options.bytes === Array ? Array.prototype.slice.call(message.itemId) : message.itemId;
                if (message.quantity != null && message.hasOwnProperty("quantity"))
                    object.quantity = message.quantity;
                return object;
            };

            /**
             * Converts this ChangeCart to JSON.
             * @function toJSON
             * @memberof market.mass.ChangeCart
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ChangeCart.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for ChangeCart
             * @function getTypeUrl
             * @memberof market.mass.ChangeCart
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            ChangeCart.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/market.mass.ChangeCart";
            };

            return ChangeCart;
        })();

        mass.CartFinalized = (function() {

            /**
             * Properties of a CartFinalized.
             * @memberof market.mass
             * @interface ICartFinalized
             * @property {Uint8Array|null} [eventId] CartFinalized eventId
             * @property {Uint8Array|null} [cartId] CartFinalized cartId
             * @property {Uint8Array|null} [purchaseAddr] CartFinalized purchaseAddr
             * @property {Uint8Array|null} [erc20Addr] CartFinalized erc20Addr
             * @property {string|null} [subTotal] CartFinalized subTotal
             * @property {string|null} [salesTax] CartFinalized salesTax
             * @property {string|null} [total] CartFinalized total
             * @property {string|null} [totalInCrypto] CartFinalized totalInCrypto
             * @property {Uint8Array|null} [paymentId] CartFinalized paymentId
             * @property {string|null} [paymentTtl] CartFinalized paymentTtl
             */

            /**
             * Constructs a new CartFinalized.
             * @memberof market.mass
             * @classdesc Represents a CartFinalized.
             * @implements ICartFinalized
             * @constructor
             * @param {market.mass.ICartFinalized=} [properties] Properties to set
             */
            function CartFinalized(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * CartFinalized eventId.
             * @member {Uint8Array} eventId
             * @memberof market.mass.CartFinalized
             * @instance
             */
            CartFinalized.prototype.eventId = $util.newBuffer([]);

            /**
             * CartFinalized cartId.
             * @member {Uint8Array} cartId
             * @memberof market.mass.CartFinalized
             * @instance
             */
            CartFinalized.prototype.cartId = $util.newBuffer([]);

            /**
             * CartFinalized purchaseAddr.
             * @member {Uint8Array} purchaseAddr
             * @memberof market.mass.CartFinalized
             * @instance
             */
            CartFinalized.prototype.purchaseAddr = $util.newBuffer([]);

            /**
             * CartFinalized erc20Addr.
             * @member {Uint8Array} erc20Addr
             * @memberof market.mass.CartFinalized
             * @instance
             */
            CartFinalized.prototype.erc20Addr = $util.newBuffer([]);

            /**
             * CartFinalized subTotal.
             * @member {string} subTotal
             * @memberof market.mass.CartFinalized
             * @instance
             */
            CartFinalized.prototype.subTotal = "";

            /**
             * CartFinalized salesTax.
             * @member {string} salesTax
             * @memberof market.mass.CartFinalized
             * @instance
             */
            CartFinalized.prototype.salesTax = "";

            /**
             * CartFinalized total.
             * @member {string} total
             * @memberof market.mass.CartFinalized
             * @instance
             */
            CartFinalized.prototype.total = "";

            /**
             * CartFinalized totalInCrypto.
             * @member {string} totalInCrypto
             * @memberof market.mass.CartFinalized
             * @instance
             */
            CartFinalized.prototype.totalInCrypto = "";

            /**
             * CartFinalized paymentId.
             * @member {Uint8Array} paymentId
             * @memberof market.mass.CartFinalized
             * @instance
             */
            CartFinalized.prototype.paymentId = $util.newBuffer([]);

            /**
             * CartFinalized paymentTtl.
             * @member {string} paymentTtl
             * @memberof market.mass.CartFinalized
             * @instance
             */
            CartFinalized.prototype.paymentTtl = "";

            /**
             * Creates a new CartFinalized instance using the specified properties.
             * @function create
             * @memberof market.mass.CartFinalized
             * @static
             * @param {market.mass.ICartFinalized=} [properties] Properties to set
             * @returns {market.mass.CartFinalized} CartFinalized instance
             */
            CartFinalized.create = function create(properties) {
                return new CartFinalized(properties);
            };

            /**
             * Encodes the specified CartFinalized message. Does not implicitly {@link market.mass.CartFinalized.verify|verify} messages.
             * @function encode
             * @memberof market.mass.CartFinalized
             * @static
             * @param {market.mass.ICartFinalized} message CartFinalized message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CartFinalized.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.eventId != null && Object.hasOwnProperty.call(message, "eventId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.eventId);
                if (message.cartId != null && Object.hasOwnProperty.call(message, "cartId"))
                    writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.cartId);
                if (message.purchaseAddr != null && Object.hasOwnProperty.call(message, "purchaseAddr"))
                    writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.purchaseAddr);
                if (message.subTotal != null && Object.hasOwnProperty.call(message, "subTotal"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.subTotal);
                if (message.salesTax != null && Object.hasOwnProperty.call(message, "salesTax"))
                    writer.uint32(/* id 5, wireType 2 =*/42).string(message.salesTax);
                if (message.total != null && Object.hasOwnProperty.call(message, "total"))
                    writer.uint32(/* id 6, wireType 2 =*/50).string(message.total);
                if (message.totalInCrypto != null && Object.hasOwnProperty.call(message, "totalInCrypto"))
                    writer.uint32(/* id 7, wireType 2 =*/58).string(message.totalInCrypto);
                if (message.erc20Addr != null && Object.hasOwnProperty.call(message, "erc20Addr"))
                    writer.uint32(/* id 8, wireType 2 =*/66).bytes(message.erc20Addr);
                if (message.paymentId != null && Object.hasOwnProperty.call(message, "paymentId"))
                    writer.uint32(/* id 9, wireType 2 =*/74).bytes(message.paymentId);
                if (message.paymentTtl != null && Object.hasOwnProperty.call(message, "paymentTtl"))
                    writer.uint32(/* id 10, wireType 2 =*/82).string(message.paymentTtl);
                return writer;
            };

            /**
             * Encodes the specified CartFinalized message, length delimited. Does not implicitly {@link market.mass.CartFinalized.verify|verify} messages.
             * @function encodeDelimited
             * @memberof market.mass.CartFinalized
             * @static
             * @param {market.mass.ICartFinalized} message CartFinalized message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CartFinalized.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a CartFinalized message from the specified reader or buffer.
             * @function decode
             * @memberof market.mass.CartFinalized
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {market.mass.CartFinalized} CartFinalized
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CartFinalized.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.CartFinalized();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.eventId = reader.bytes();
                            break;
                        }
                    case 2: {
                            message.cartId = reader.bytes();
                            break;
                        }
                    case 3: {
                            message.purchaseAddr = reader.bytes();
                            break;
                        }
                    case 8: {
                            message.erc20Addr = reader.bytes();
                            break;
                        }
                    case 4: {
                            message.subTotal = reader.string();
                            break;
                        }
                    case 5: {
                            message.salesTax = reader.string();
                            break;
                        }
                    case 6: {
                            message.total = reader.string();
                            break;
                        }
                    case 7: {
                            message.totalInCrypto = reader.string();
                            break;
                        }
                    case 9: {
                            message.paymentId = reader.bytes();
                            break;
                        }
                    case 10: {
                            message.paymentTtl = reader.string();
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
             * Decodes a CartFinalized message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof market.mass.CartFinalized
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {market.mass.CartFinalized} CartFinalized
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CartFinalized.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a CartFinalized message.
             * @function verify
             * @memberof market.mass.CartFinalized
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            CartFinalized.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.eventId != null && message.hasOwnProperty("eventId"))
                    if (!(message.eventId && typeof message.eventId.length === "number" || $util.isString(message.eventId)))
                        return "eventId: buffer expected";
                if (message.cartId != null && message.hasOwnProperty("cartId"))
                    if (!(message.cartId && typeof message.cartId.length === "number" || $util.isString(message.cartId)))
                        return "cartId: buffer expected";
                if (message.purchaseAddr != null && message.hasOwnProperty("purchaseAddr"))
                    if (!(message.purchaseAddr && typeof message.purchaseAddr.length === "number" || $util.isString(message.purchaseAddr)))
                        return "purchaseAddr: buffer expected";
                if (message.erc20Addr != null && message.hasOwnProperty("erc20Addr"))
                    if (!(message.erc20Addr && typeof message.erc20Addr.length === "number" || $util.isString(message.erc20Addr)))
                        return "erc20Addr: buffer expected";
                if (message.subTotal != null && message.hasOwnProperty("subTotal"))
                    if (!$util.isString(message.subTotal))
                        return "subTotal: string expected";
                if (message.salesTax != null && message.hasOwnProperty("salesTax"))
                    if (!$util.isString(message.salesTax))
                        return "salesTax: string expected";
                if (message.total != null && message.hasOwnProperty("total"))
                    if (!$util.isString(message.total))
                        return "total: string expected";
                if (message.totalInCrypto != null && message.hasOwnProperty("totalInCrypto"))
                    if (!$util.isString(message.totalInCrypto))
                        return "totalInCrypto: string expected";
                if (message.paymentId != null && message.hasOwnProperty("paymentId"))
                    if (!(message.paymentId && typeof message.paymentId.length === "number" || $util.isString(message.paymentId)))
                        return "paymentId: buffer expected";
                if (message.paymentTtl != null && message.hasOwnProperty("paymentTtl"))
                    if (!$util.isString(message.paymentTtl))
                        return "paymentTtl: string expected";
                return null;
            };

            /**
             * Creates a CartFinalized message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof market.mass.CartFinalized
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {market.mass.CartFinalized} CartFinalized
             */
            CartFinalized.fromObject = function fromObject(object) {
                if (object instanceof $root.market.mass.CartFinalized)
                    return object;
                let message = new $root.market.mass.CartFinalized();
                if (object.eventId != null)
                    if (typeof object.eventId === "string")
                        $util.base64.decode(object.eventId, message.eventId = $util.newBuffer($util.base64.length(object.eventId)), 0);
                    else if (object.eventId.length >= 0)
                        message.eventId = object.eventId;
                if (object.cartId != null)
                    if (typeof object.cartId === "string")
                        $util.base64.decode(object.cartId, message.cartId = $util.newBuffer($util.base64.length(object.cartId)), 0);
                    else if (object.cartId.length >= 0)
                        message.cartId = object.cartId;
                if (object.purchaseAddr != null)
                    if (typeof object.purchaseAddr === "string")
                        $util.base64.decode(object.purchaseAddr, message.purchaseAddr = $util.newBuffer($util.base64.length(object.purchaseAddr)), 0);
                    else if (object.purchaseAddr.length >= 0)
                        message.purchaseAddr = object.purchaseAddr;
                if (object.erc20Addr != null)
                    if (typeof object.erc20Addr === "string")
                        $util.base64.decode(object.erc20Addr, message.erc20Addr = $util.newBuffer($util.base64.length(object.erc20Addr)), 0);
                    else if (object.erc20Addr.length >= 0)
                        message.erc20Addr = object.erc20Addr;
                if (object.subTotal != null)
                    message.subTotal = String(object.subTotal);
                if (object.salesTax != null)
                    message.salesTax = String(object.salesTax);
                if (object.total != null)
                    message.total = String(object.total);
                if (object.totalInCrypto != null)
                    message.totalInCrypto = String(object.totalInCrypto);
                if (object.paymentId != null)
                    if (typeof object.paymentId === "string")
                        $util.base64.decode(object.paymentId, message.paymentId = $util.newBuffer($util.base64.length(object.paymentId)), 0);
                    else if (object.paymentId.length >= 0)
                        message.paymentId = object.paymentId;
                if (object.paymentTtl != null)
                    message.paymentTtl = String(object.paymentTtl);
                return message;
            };

            /**
             * Creates a plain object from a CartFinalized message. Also converts values to other types if specified.
             * @function toObject
             * @memberof market.mass.CartFinalized
             * @static
             * @param {market.mass.CartFinalized} message CartFinalized
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            CartFinalized.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    if (options.bytes === String)
                        object.eventId = "";
                    else {
                        object.eventId = [];
                        if (options.bytes !== Array)
                            object.eventId = $util.newBuffer(object.eventId);
                    }
                    if (options.bytes === String)
                        object.cartId = "";
                    else {
                        object.cartId = [];
                        if (options.bytes !== Array)
                            object.cartId = $util.newBuffer(object.cartId);
                    }
                    if (options.bytes === String)
                        object.purchaseAddr = "";
                    else {
                        object.purchaseAddr = [];
                        if (options.bytes !== Array)
                            object.purchaseAddr = $util.newBuffer(object.purchaseAddr);
                    }
                    object.subTotal = "";
                    object.salesTax = "";
                    object.total = "";
                    object.totalInCrypto = "";
                    if (options.bytes === String)
                        object.erc20Addr = "";
                    else {
                        object.erc20Addr = [];
                        if (options.bytes !== Array)
                            object.erc20Addr = $util.newBuffer(object.erc20Addr);
                    }
                    if (options.bytes === String)
                        object.paymentId = "";
                    else {
                        object.paymentId = [];
                        if (options.bytes !== Array)
                            object.paymentId = $util.newBuffer(object.paymentId);
                    }
                    object.paymentTtl = "";
                }
                if (message.eventId != null && message.hasOwnProperty("eventId"))
                    object.eventId = options.bytes === String ? $util.base64.encode(message.eventId, 0, message.eventId.length) : options.bytes === Array ? Array.prototype.slice.call(message.eventId) : message.eventId;
                if (message.cartId != null && message.hasOwnProperty("cartId"))
                    object.cartId = options.bytes === String ? $util.base64.encode(message.cartId, 0, message.cartId.length) : options.bytes === Array ? Array.prototype.slice.call(message.cartId) : message.cartId;
                if (message.purchaseAddr != null && message.hasOwnProperty("purchaseAddr"))
                    object.purchaseAddr = options.bytes === String ? $util.base64.encode(message.purchaseAddr, 0, message.purchaseAddr.length) : options.bytes === Array ? Array.prototype.slice.call(message.purchaseAddr) : message.purchaseAddr;
                if (message.subTotal != null && message.hasOwnProperty("subTotal"))
                    object.subTotal = message.subTotal;
                if (message.salesTax != null && message.hasOwnProperty("salesTax"))
                    object.salesTax = message.salesTax;
                if (message.total != null && message.hasOwnProperty("total"))
                    object.total = message.total;
                if (message.totalInCrypto != null && message.hasOwnProperty("totalInCrypto"))
                    object.totalInCrypto = message.totalInCrypto;
                if (message.erc20Addr != null && message.hasOwnProperty("erc20Addr"))
                    object.erc20Addr = options.bytes === String ? $util.base64.encode(message.erc20Addr, 0, message.erc20Addr.length) : options.bytes === Array ? Array.prototype.slice.call(message.erc20Addr) : message.erc20Addr;
                if (message.paymentId != null && message.hasOwnProperty("paymentId"))
                    object.paymentId = options.bytes === String ? $util.base64.encode(message.paymentId, 0, message.paymentId.length) : options.bytes === Array ? Array.prototype.slice.call(message.paymentId) : message.paymentId;
                if (message.paymentTtl != null && message.hasOwnProperty("paymentTtl"))
                    object.paymentTtl = message.paymentTtl;
                return object;
            };

            /**
             * Converts this CartFinalized to JSON.
             * @function toJSON
             * @memberof market.mass.CartFinalized
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            CartFinalized.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for CartFinalized
             * @function getTypeUrl
             * @memberof market.mass.CartFinalized
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            CartFinalized.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/market.mass.CartFinalized";
            };

            return CartFinalized;
        })();

        mass.CartAbandoned = (function() {

            /**
             * Properties of a CartAbandoned.
             * @memberof market.mass
             * @interface ICartAbandoned
             * @property {Uint8Array|null} [eventId] CartAbandoned eventId
             * @property {Uint8Array|null} [cartId] CartAbandoned cartId
             */

            /**
             * Constructs a new CartAbandoned.
             * @memberof market.mass
             * @classdesc Represents a CartAbandoned.
             * @implements ICartAbandoned
             * @constructor
             * @param {market.mass.ICartAbandoned=} [properties] Properties to set
             */
            function CartAbandoned(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * CartAbandoned eventId.
             * @member {Uint8Array} eventId
             * @memberof market.mass.CartAbandoned
             * @instance
             */
            CartAbandoned.prototype.eventId = $util.newBuffer([]);

            /**
             * CartAbandoned cartId.
             * @member {Uint8Array} cartId
             * @memberof market.mass.CartAbandoned
             * @instance
             */
            CartAbandoned.prototype.cartId = $util.newBuffer([]);

            /**
             * Creates a new CartAbandoned instance using the specified properties.
             * @function create
             * @memberof market.mass.CartAbandoned
             * @static
             * @param {market.mass.ICartAbandoned=} [properties] Properties to set
             * @returns {market.mass.CartAbandoned} CartAbandoned instance
             */
            CartAbandoned.create = function create(properties) {
                return new CartAbandoned(properties);
            };

            /**
             * Encodes the specified CartAbandoned message. Does not implicitly {@link market.mass.CartAbandoned.verify|verify} messages.
             * @function encode
             * @memberof market.mass.CartAbandoned
             * @static
             * @param {market.mass.ICartAbandoned} message CartAbandoned message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CartAbandoned.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.eventId != null && Object.hasOwnProperty.call(message, "eventId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.eventId);
                if (message.cartId != null && Object.hasOwnProperty.call(message, "cartId"))
                    writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.cartId);
                return writer;
            };

            /**
             * Encodes the specified CartAbandoned message, length delimited. Does not implicitly {@link market.mass.CartAbandoned.verify|verify} messages.
             * @function encodeDelimited
             * @memberof market.mass.CartAbandoned
             * @static
             * @param {market.mass.ICartAbandoned} message CartAbandoned message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CartAbandoned.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a CartAbandoned message from the specified reader or buffer.
             * @function decode
             * @memberof market.mass.CartAbandoned
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {market.mass.CartAbandoned} CartAbandoned
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CartAbandoned.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.CartAbandoned();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.eventId = reader.bytes();
                            break;
                        }
                    case 2: {
                            message.cartId = reader.bytes();
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
             * Decodes a CartAbandoned message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof market.mass.CartAbandoned
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {market.mass.CartAbandoned} CartAbandoned
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CartAbandoned.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a CartAbandoned message.
             * @function verify
             * @memberof market.mass.CartAbandoned
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            CartAbandoned.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.eventId != null && message.hasOwnProperty("eventId"))
                    if (!(message.eventId && typeof message.eventId.length === "number" || $util.isString(message.eventId)))
                        return "eventId: buffer expected";
                if (message.cartId != null && message.hasOwnProperty("cartId"))
                    if (!(message.cartId && typeof message.cartId.length === "number" || $util.isString(message.cartId)))
                        return "cartId: buffer expected";
                return null;
            };

            /**
             * Creates a CartAbandoned message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof market.mass.CartAbandoned
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {market.mass.CartAbandoned} CartAbandoned
             */
            CartAbandoned.fromObject = function fromObject(object) {
                if (object instanceof $root.market.mass.CartAbandoned)
                    return object;
                let message = new $root.market.mass.CartAbandoned();
                if (object.eventId != null)
                    if (typeof object.eventId === "string")
                        $util.base64.decode(object.eventId, message.eventId = $util.newBuffer($util.base64.length(object.eventId)), 0);
                    else if (object.eventId.length >= 0)
                        message.eventId = object.eventId;
                if (object.cartId != null)
                    if (typeof object.cartId === "string")
                        $util.base64.decode(object.cartId, message.cartId = $util.newBuffer($util.base64.length(object.cartId)), 0);
                    else if (object.cartId.length >= 0)
                        message.cartId = object.cartId;
                return message;
            };

            /**
             * Creates a plain object from a CartAbandoned message. Also converts values to other types if specified.
             * @function toObject
             * @memberof market.mass.CartAbandoned
             * @static
             * @param {market.mass.CartAbandoned} message CartAbandoned
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            CartAbandoned.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    if (options.bytes === String)
                        object.eventId = "";
                    else {
                        object.eventId = [];
                        if (options.bytes !== Array)
                            object.eventId = $util.newBuffer(object.eventId);
                    }
                    if (options.bytes === String)
                        object.cartId = "";
                    else {
                        object.cartId = [];
                        if (options.bytes !== Array)
                            object.cartId = $util.newBuffer(object.cartId);
                    }
                }
                if (message.eventId != null && message.hasOwnProperty("eventId"))
                    object.eventId = options.bytes === String ? $util.base64.encode(message.eventId, 0, message.eventId.length) : options.bytes === Array ? Array.prototype.slice.call(message.eventId) : message.eventId;
                if (message.cartId != null && message.hasOwnProperty("cartId"))
                    object.cartId = options.bytes === String ? $util.base64.encode(message.cartId, 0, message.cartId.length) : options.bytes === Array ? Array.prototype.slice.call(message.cartId) : message.cartId;
                return object;
            };

            /**
             * Converts this CartAbandoned to JSON.
             * @function toJSON
             * @memberof market.mass.CartAbandoned
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            CartAbandoned.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for CartAbandoned
             * @function getTypeUrl
             * @memberof market.mass.CartAbandoned
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            CartAbandoned.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/market.mass.CartAbandoned";
            };

            return CartAbandoned;
        })();

        mass.Event = (function() {

            /**
             * Properties of an Event.
             * @memberof market.mass
             * @interface IEvent
             * @property {Uint8Array|null} [signature] Event signature
             * @property {market.mass.IStoreManifest|null} [storeManifest] Event storeManifest
             * @property {market.mass.IUpdateManifest|null} [updateManifest] Event updateManifest
             * @property {market.mass.ICreateItem|null} [createItem] Event createItem
             * @property {market.mass.IUpdateItem|null} [updateItem] Event updateItem
             * @property {market.mass.ICreateTag|null} [createTag] Event createTag
             * @property {market.mass.IAddToTag|null} [addToTag] Event addToTag
             * @property {market.mass.IRemoveFromTag|null} [removeFromTag] Event removeFromTag
             * @property {market.mass.IRenameTag|null} [renameTag] Event renameTag
             * @property {market.mass.IDeleteTag|null} [deleteTag] Event deleteTag
             * @property {market.mass.ICreateCart|null} [createCart] Event createCart
             * @property {market.mass.IChangeCart|null} [changeCart] Event changeCart
             * @property {market.mass.ICartFinalized|null} [cartFinalized] Event cartFinalized
             * @property {market.mass.ICartAbandoned|null} [cartAbandoned] Event cartAbandoned
             * @property {market.mass.IChangeStock|null} [changeStock] Event changeStock
             * @property {market.mass.INewKeyCard|null} [newKeyCard] Event newKeyCard
             */

            /**
             * Constructs a new Event.
             * @memberof market.mass
             * @classdesc Represents an Event.
             * @implements IEvent
             * @constructor
             * @param {market.mass.IEvent=} [properties] Properties to set
             */
            function Event(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Event signature.
             * @member {Uint8Array} signature
             * @memberof market.mass.Event
             * @instance
             */
            Event.prototype.signature = $util.newBuffer([]);

            /**
             * Event storeManifest.
             * @member {market.mass.IStoreManifest|null|undefined} storeManifest
             * @memberof market.mass.Event
             * @instance
             */
            Event.prototype.storeManifest = null;

            /**
             * Event updateManifest.
             * @member {market.mass.IUpdateManifest|null|undefined} updateManifest
             * @memberof market.mass.Event
             * @instance
             */
            Event.prototype.updateManifest = null;

            /**
             * Event createItem.
             * @member {market.mass.ICreateItem|null|undefined} createItem
             * @memberof market.mass.Event
             * @instance
             */
            Event.prototype.createItem = null;

            /**
             * Event updateItem.
             * @member {market.mass.IUpdateItem|null|undefined} updateItem
             * @memberof market.mass.Event
             * @instance
             */
            Event.prototype.updateItem = null;

            /**
             * Event createTag.
             * @member {market.mass.ICreateTag|null|undefined} createTag
             * @memberof market.mass.Event
             * @instance
             */
            Event.prototype.createTag = null;

            /**
             * Event addToTag.
             * @member {market.mass.IAddToTag|null|undefined} addToTag
             * @memberof market.mass.Event
             * @instance
             */
            Event.prototype.addToTag = null;

            /**
             * Event removeFromTag.
             * @member {market.mass.IRemoveFromTag|null|undefined} removeFromTag
             * @memberof market.mass.Event
             * @instance
             */
            Event.prototype.removeFromTag = null;

            /**
             * Event renameTag.
             * @member {market.mass.IRenameTag|null|undefined} renameTag
             * @memberof market.mass.Event
             * @instance
             */
            Event.prototype.renameTag = null;

            /**
             * Event deleteTag.
             * @member {market.mass.IDeleteTag|null|undefined} deleteTag
             * @memberof market.mass.Event
             * @instance
             */
            Event.prototype.deleteTag = null;

            /**
             * Event createCart.
             * @member {market.mass.ICreateCart|null|undefined} createCart
             * @memberof market.mass.Event
             * @instance
             */
            Event.prototype.createCart = null;

            /**
             * Event changeCart.
             * @member {market.mass.IChangeCart|null|undefined} changeCart
             * @memberof market.mass.Event
             * @instance
             */
            Event.prototype.changeCart = null;

            /**
             * Event cartFinalized.
             * @member {market.mass.ICartFinalized|null|undefined} cartFinalized
             * @memberof market.mass.Event
             * @instance
             */
            Event.prototype.cartFinalized = null;

            /**
             * Event cartAbandoned.
             * @member {market.mass.ICartAbandoned|null|undefined} cartAbandoned
             * @memberof market.mass.Event
             * @instance
             */
            Event.prototype.cartAbandoned = null;

            /**
             * Event changeStock.
             * @member {market.mass.IChangeStock|null|undefined} changeStock
             * @memberof market.mass.Event
             * @instance
             */
            Event.prototype.changeStock = null;

            /**
             * Event newKeyCard.
             * @member {market.mass.INewKeyCard|null|undefined} newKeyCard
             * @memberof market.mass.Event
             * @instance
             */
            Event.prototype.newKeyCard = null;

            // OneOf field names bound to virtual getters and setters
            let $oneOfFields;

            /**
             * Event union.
             * @member {"storeManifest"|"updateManifest"|"createItem"|"updateItem"|"createTag"|"addToTag"|"removeFromTag"|"renameTag"|"deleteTag"|"createCart"|"changeCart"|"cartFinalized"|"cartAbandoned"|"changeStock"|"newKeyCard"|undefined} union
             * @memberof market.mass.Event
             * @instance
             */
            Object.defineProperty(Event.prototype, "union", {
                get: $util.oneOfGetter($oneOfFields = ["storeManifest", "updateManifest", "createItem", "updateItem", "createTag", "addToTag", "removeFromTag", "renameTag", "deleteTag", "createCart", "changeCart", "cartFinalized", "cartAbandoned", "changeStock", "newKeyCard"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new Event instance using the specified properties.
             * @function create
             * @memberof market.mass.Event
             * @static
             * @param {market.mass.IEvent=} [properties] Properties to set
             * @returns {market.mass.Event} Event instance
             */
            Event.create = function create(properties) {
                return new Event(properties);
            };

            /**
             * Encodes the specified Event message. Does not implicitly {@link market.mass.Event.verify|verify} messages.
             * @function encode
             * @memberof market.mass.Event
             * @static
             * @param {market.mass.IEvent} message Event message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Event.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.signature != null && Object.hasOwnProperty.call(message, "signature"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.signature);
                if (message.storeManifest != null && Object.hasOwnProperty.call(message, "storeManifest"))
                    $root.market.mass.StoreManifest.encode(message.storeManifest, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                if (message.updateManifest != null && Object.hasOwnProperty.call(message, "updateManifest"))
                    $root.market.mass.UpdateManifest.encode(message.updateManifest, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                if (message.createItem != null && Object.hasOwnProperty.call(message, "createItem"))
                    $root.market.mass.CreateItem.encode(message.createItem, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                if (message.updateItem != null && Object.hasOwnProperty.call(message, "updateItem"))
                    $root.market.mass.UpdateItem.encode(message.updateItem, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
                if (message.createTag != null && Object.hasOwnProperty.call(message, "createTag"))
                    $root.market.mass.CreateTag.encode(message.createTag, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
                if (message.addToTag != null && Object.hasOwnProperty.call(message, "addToTag"))
                    $root.market.mass.AddToTag.encode(message.addToTag, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
                if (message.removeFromTag != null && Object.hasOwnProperty.call(message, "removeFromTag"))
                    $root.market.mass.RemoveFromTag.encode(message.removeFromTag, writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
                if (message.renameTag != null && Object.hasOwnProperty.call(message, "renameTag"))
                    $root.market.mass.RenameTag.encode(message.renameTag, writer.uint32(/* id 9, wireType 2 =*/74).fork()).ldelim();
                if (message.deleteTag != null && Object.hasOwnProperty.call(message, "deleteTag"))
                    $root.market.mass.DeleteTag.encode(message.deleteTag, writer.uint32(/* id 10, wireType 2 =*/82).fork()).ldelim();
                if (message.createCart != null && Object.hasOwnProperty.call(message, "createCart"))
                    $root.market.mass.CreateCart.encode(message.createCart, writer.uint32(/* id 11, wireType 2 =*/90).fork()).ldelim();
                if (message.changeCart != null && Object.hasOwnProperty.call(message, "changeCart"))
                    $root.market.mass.ChangeCart.encode(message.changeCart, writer.uint32(/* id 12, wireType 2 =*/98).fork()).ldelim();
                if (message.changeStock != null && Object.hasOwnProperty.call(message, "changeStock"))
                    $root.market.mass.ChangeStock.encode(message.changeStock, writer.uint32(/* id 13, wireType 2 =*/106).fork()).ldelim();
                if (message.newKeyCard != null && Object.hasOwnProperty.call(message, "newKeyCard"))
                    $root.market.mass.NewKeyCard.encode(message.newKeyCard, writer.uint32(/* id 14, wireType 2 =*/114).fork()).ldelim();
                if (message.cartFinalized != null && Object.hasOwnProperty.call(message, "cartFinalized"))
                    $root.market.mass.CartFinalized.encode(message.cartFinalized, writer.uint32(/* id 15, wireType 2 =*/122).fork()).ldelim();
                if (message.cartAbandoned != null && Object.hasOwnProperty.call(message, "cartAbandoned"))
                    $root.market.mass.CartAbandoned.encode(message.cartAbandoned, writer.uint32(/* id 16, wireType 2 =*/130).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified Event message, length delimited. Does not implicitly {@link market.mass.Event.verify|verify} messages.
             * @function encodeDelimited
             * @memberof market.mass.Event
             * @static
             * @param {market.mass.IEvent} message Event message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Event.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an Event message from the specified reader or buffer.
             * @function decode
             * @memberof market.mass.Event
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {market.mass.Event} Event
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Event.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.Event();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.signature = reader.bytes();
                            break;
                        }
                    case 2: {
                            message.storeManifest = $root.market.mass.StoreManifest.decode(reader, reader.uint32());
                            break;
                        }
                    case 3: {
                            message.updateManifest = $root.market.mass.UpdateManifest.decode(reader, reader.uint32());
                            break;
                        }
                    case 4: {
                            message.createItem = $root.market.mass.CreateItem.decode(reader, reader.uint32());
                            break;
                        }
                    case 5: {
                            message.updateItem = $root.market.mass.UpdateItem.decode(reader, reader.uint32());
                            break;
                        }
                    case 6: {
                            message.createTag = $root.market.mass.CreateTag.decode(reader, reader.uint32());
                            break;
                        }
                    case 7: {
                            message.addToTag = $root.market.mass.AddToTag.decode(reader, reader.uint32());
                            break;
                        }
                    case 8: {
                            message.removeFromTag = $root.market.mass.RemoveFromTag.decode(reader, reader.uint32());
                            break;
                        }
                    case 9: {
                            message.renameTag = $root.market.mass.RenameTag.decode(reader, reader.uint32());
                            break;
                        }
                    case 10: {
                            message.deleteTag = $root.market.mass.DeleteTag.decode(reader, reader.uint32());
                            break;
                        }
                    case 11: {
                            message.createCart = $root.market.mass.CreateCart.decode(reader, reader.uint32());
                            break;
                        }
                    case 12: {
                            message.changeCart = $root.market.mass.ChangeCart.decode(reader, reader.uint32());
                            break;
                        }
                    case 15: {
                            message.cartFinalized = $root.market.mass.CartFinalized.decode(reader, reader.uint32());
                            break;
                        }
                    case 16: {
                            message.cartAbandoned = $root.market.mass.CartAbandoned.decode(reader, reader.uint32());
                            break;
                        }
                    case 13: {
                            message.changeStock = $root.market.mass.ChangeStock.decode(reader, reader.uint32());
                            break;
                        }
                    case 14: {
                            message.newKeyCard = $root.market.mass.NewKeyCard.decode(reader, reader.uint32());
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
             * Decodes an Event message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof market.mass.Event
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {market.mass.Event} Event
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Event.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an Event message.
             * @function verify
             * @memberof market.mass.Event
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Event.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                let properties = {};
                if (message.signature != null && message.hasOwnProperty("signature"))
                    if (!(message.signature && typeof message.signature.length === "number" || $util.isString(message.signature)))
                        return "signature: buffer expected";
                if (message.storeManifest != null && message.hasOwnProperty("storeManifest")) {
                    properties.union = 1;
                    {
                        let error = $root.market.mass.StoreManifest.verify(message.storeManifest);
                        if (error)
                            return "storeManifest." + error;
                    }
                }
                if (message.updateManifest != null && message.hasOwnProperty("updateManifest")) {
                    if (properties.union === 1)
                        return "union: multiple values";
                    properties.union = 1;
                    {
                        let error = $root.market.mass.UpdateManifest.verify(message.updateManifest);
                        if (error)
                            return "updateManifest." + error;
                    }
                }
                if (message.createItem != null && message.hasOwnProperty("createItem")) {
                    if (properties.union === 1)
                        return "union: multiple values";
                    properties.union = 1;
                    {
                        let error = $root.market.mass.CreateItem.verify(message.createItem);
                        if (error)
                            return "createItem." + error;
                    }
                }
                if (message.updateItem != null && message.hasOwnProperty("updateItem")) {
                    if (properties.union === 1)
                        return "union: multiple values";
                    properties.union = 1;
                    {
                        let error = $root.market.mass.UpdateItem.verify(message.updateItem);
                        if (error)
                            return "updateItem." + error;
                    }
                }
                if (message.createTag != null && message.hasOwnProperty("createTag")) {
                    if (properties.union === 1)
                        return "union: multiple values";
                    properties.union = 1;
                    {
                        let error = $root.market.mass.CreateTag.verify(message.createTag);
                        if (error)
                            return "createTag." + error;
                    }
                }
                if (message.addToTag != null && message.hasOwnProperty("addToTag")) {
                    if (properties.union === 1)
                        return "union: multiple values";
                    properties.union = 1;
                    {
                        let error = $root.market.mass.AddToTag.verify(message.addToTag);
                        if (error)
                            return "addToTag." + error;
                    }
                }
                if (message.removeFromTag != null && message.hasOwnProperty("removeFromTag")) {
                    if (properties.union === 1)
                        return "union: multiple values";
                    properties.union = 1;
                    {
                        let error = $root.market.mass.RemoveFromTag.verify(message.removeFromTag);
                        if (error)
                            return "removeFromTag." + error;
                    }
                }
                if (message.renameTag != null && message.hasOwnProperty("renameTag")) {
                    if (properties.union === 1)
                        return "union: multiple values";
                    properties.union = 1;
                    {
                        let error = $root.market.mass.RenameTag.verify(message.renameTag);
                        if (error)
                            return "renameTag." + error;
                    }
                }
                if (message.deleteTag != null && message.hasOwnProperty("deleteTag")) {
                    if (properties.union === 1)
                        return "union: multiple values";
                    properties.union = 1;
                    {
                        let error = $root.market.mass.DeleteTag.verify(message.deleteTag);
                        if (error)
                            return "deleteTag." + error;
                    }
                }
                if (message.createCart != null && message.hasOwnProperty("createCart")) {
                    if (properties.union === 1)
                        return "union: multiple values";
                    properties.union = 1;
                    {
                        let error = $root.market.mass.CreateCart.verify(message.createCart);
                        if (error)
                            return "createCart." + error;
                    }
                }
                if (message.changeCart != null && message.hasOwnProperty("changeCart")) {
                    if (properties.union === 1)
                        return "union: multiple values";
                    properties.union = 1;
                    {
                        let error = $root.market.mass.ChangeCart.verify(message.changeCart);
                        if (error)
                            return "changeCart." + error;
                    }
                }
                if (message.cartFinalized != null && message.hasOwnProperty("cartFinalized")) {
                    if (properties.union === 1)
                        return "union: multiple values";
                    properties.union = 1;
                    {
                        let error = $root.market.mass.CartFinalized.verify(message.cartFinalized);
                        if (error)
                            return "cartFinalized." + error;
                    }
                }
                if (message.cartAbandoned != null && message.hasOwnProperty("cartAbandoned")) {
                    if (properties.union === 1)
                        return "union: multiple values";
                    properties.union = 1;
                    {
                        let error = $root.market.mass.CartAbandoned.verify(message.cartAbandoned);
                        if (error)
                            return "cartAbandoned." + error;
                    }
                }
                if (message.changeStock != null && message.hasOwnProperty("changeStock")) {
                    if (properties.union === 1)
                        return "union: multiple values";
                    properties.union = 1;
                    {
                        let error = $root.market.mass.ChangeStock.verify(message.changeStock);
                        if (error)
                            return "changeStock." + error;
                    }
                }
                if (message.newKeyCard != null && message.hasOwnProperty("newKeyCard")) {
                    if (properties.union === 1)
                        return "union: multiple values";
                    properties.union = 1;
                    {
                        let error = $root.market.mass.NewKeyCard.verify(message.newKeyCard);
                        if (error)
                            return "newKeyCard." + error;
                    }
                }
                return null;
            };

            /**
             * Creates an Event message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof market.mass.Event
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {market.mass.Event} Event
             */
            Event.fromObject = function fromObject(object) {
                if (object instanceof $root.market.mass.Event)
                    return object;
                let message = new $root.market.mass.Event();
                if (object.signature != null)
                    if (typeof object.signature === "string")
                        $util.base64.decode(object.signature, message.signature = $util.newBuffer($util.base64.length(object.signature)), 0);
                    else if (object.signature.length >= 0)
                        message.signature = object.signature;
                if (object.storeManifest != null) {
                    if (typeof object.storeManifest !== "object")
                        throw TypeError(".market.mass.Event.storeManifest: object expected");
                    message.storeManifest = $root.market.mass.StoreManifest.fromObject(object.storeManifest);
                }
                if (object.updateManifest != null) {
                    if (typeof object.updateManifest !== "object")
                        throw TypeError(".market.mass.Event.updateManifest: object expected");
                    message.updateManifest = $root.market.mass.UpdateManifest.fromObject(object.updateManifest);
                }
                if (object.createItem != null) {
                    if (typeof object.createItem !== "object")
                        throw TypeError(".market.mass.Event.createItem: object expected");
                    message.createItem = $root.market.mass.CreateItem.fromObject(object.createItem);
                }
                if (object.updateItem != null) {
                    if (typeof object.updateItem !== "object")
                        throw TypeError(".market.mass.Event.updateItem: object expected");
                    message.updateItem = $root.market.mass.UpdateItem.fromObject(object.updateItem);
                }
                if (object.createTag != null) {
                    if (typeof object.createTag !== "object")
                        throw TypeError(".market.mass.Event.createTag: object expected");
                    message.createTag = $root.market.mass.CreateTag.fromObject(object.createTag);
                }
                if (object.addToTag != null) {
                    if (typeof object.addToTag !== "object")
                        throw TypeError(".market.mass.Event.addToTag: object expected");
                    message.addToTag = $root.market.mass.AddToTag.fromObject(object.addToTag);
                }
                if (object.removeFromTag != null) {
                    if (typeof object.removeFromTag !== "object")
                        throw TypeError(".market.mass.Event.removeFromTag: object expected");
                    message.removeFromTag = $root.market.mass.RemoveFromTag.fromObject(object.removeFromTag);
                }
                if (object.renameTag != null) {
                    if (typeof object.renameTag !== "object")
                        throw TypeError(".market.mass.Event.renameTag: object expected");
                    message.renameTag = $root.market.mass.RenameTag.fromObject(object.renameTag);
                }
                if (object.deleteTag != null) {
                    if (typeof object.deleteTag !== "object")
                        throw TypeError(".market.mass.Event.deleteTag: object expected");
                    message.deleteTag = $root.market.mass.DeleteTag.fromObject(object.deleteTag);
                }
                if (object.createCart != null) {
                    if (typeof object.createCart !== "object")
                        throw TypeError(".market.mass.Event.createCart: object expected");
                    message.createCart = $root.market.mass.CreateCart.fromObject(object.createCart);
                }
                if (object.changeCart != null) {
                    if (typeof object.changeCart !== "object")
                        throw TypeError(".market.mass.Event.changeCart: object expected");
                    message.changeCart = $root.market.mass.ChangeCart.fromObject(object.changeCart);
                }
                if (object.cartFinalized != null) {
                    if (typeof object.cartFinalized !== "object")
                        throw TypeError(".market.mass.Event.cartFinalized: object expected");
                    message.cartFinalized = $root.market.mass.CartFinalized.fromObject(object.cartFinalized);
                }
                if (object.cartAbandoned != null) {
                    if (typeof object.cartAbandoned !== "object")
                        throw TypeError(".market.mass.Event.cartAbandoned: object expected");
                    message.cartAbandoned = $root.market.mass.CartAbandoned.fromObject(object.cartAbandoned);
                }
                if (object.changeStock != null) {
                    if (typeof object.changeStock !== "object")
                        throw TypeError(".market.mass.Event.changeStock: object expected");
                    message.changeStock = $root.market.mass.ChangeStock.fromObject(object.changeStock);
                }
                if (object.newKeyCard != null) {
                    if (typeof object.newKeyCard !== "object")
                        throw TypeError(".market.mass.Event.newKeyCard: object expected");
                    message.newKeyCard = $root.market.mass.NewKeyCard.fromObject(object.newKeyCard);
                }
                return message;
            };

            /**
             * Creates a plain object from an Event message. Also converts values to other types if specified.
             * @function toObject
             * @memberof market.mass.Event
             * @static
             * @param {market.mass.Event} message Event
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Event.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    if (options.bytes === String)
                        object.signature = "";
                    else {
                        object.signature = [];
                        if (options.bytes !== Array)
                            object.signature = $util.newBuffer(object.signature);
                    }
                if (message.signature != null && message.hasOwnProperty("signature"))
                    object.signature = options.bytes === String ? $util.base64.encode(message.signature, 0, message.signature.length) : options.bytes === Array ? Array.prototype.slice.call(message.signature) : message.signature;
                if (message.storeManifest != null && message.hasOwnProperty("storeManifest")) {
                    object.storeManifest = $root.market.mass.StoreManifest.toObject(message.storeManifest, options);
                    if (options.oneofs)
                        object.union = "storeManifest";
                }
                if (message.updateManifest != null && message.hasOwnProperty("updateManifest")) {
                    object.updateManifest = $root.market.mass.UpdateManifest.toObject(message.updateManifest, options);
                    if (options.oneofs)
                        object.union = "updateManifest";
                }
                if (message.createItem != null && message.hasOwnProperty("createItem")) {
                    object.createItem = $root.market.mass.CreateItem.toObject(message.createItem, options);
                    if (options.oneofs)
                        object.union = "createItem";
                }
                if (message.updateItem != null && message.hasOwnProperty("updateItem")) {
                    object.updateItem = $root.market.mass.UpdateItem.toObject(message.updateItem, options);
                    if (options.oneofs)
                        object.union = "updateItem";
                }
                if (message.createTag != null && message.hasOwnProperty("createTag")) {
                    object.createTag = $root.market.mass.CreateTag.toObject(message.createTag, options);
                    if (options.oneofs)
                        object.union = "createTag";
                }
                if (message.addToTag != null && message.hasOwnProperty("addToTag")) {
                    object.addToTag = $root.market.mass.AddToTag.toObject(message.addToTag, options);
                    if (options.oneofs)
                        object.union = "addToTag";
                }
                if (message.removeFromTag != null && message.hasOwnProperty("removeFromTag")) {
                    object.removeFromTag = $root.market.mass.RemoveFromTag.toObject(message.removeFromTag, options);
                    if (options.oneofs)
                        object.union = "removeFromTag";
                }
                if (message.renameTag != null && message.hasOwnProperty("renameTag")) {
                    object.renameTag = $root.market.mass.RenameTag.toObject(message.renameTag, options);
                    if (options.oneofs)
                        object.union = "renameTag";
                }
                if (message.deleteTag != null && message.hasOwnProperty("deleteTag")) {
                    object.deleteTag = $root.market.mass.DeleteTag.toObject(message.deleteTag, options);
                    if (options.oneofs)
                        object.union = "deleteTag";
                }
                if (message.createCart != null && message.hasOwnProperty("createCart")) {
                    object.createCart = $root.market.mass.CreateCart.toObject(message.createCart, options);
                    if (options.oneofs)
                        object.union = "createCart";
                }
                if (message.changeCart != null && message.hasOwnProperty("changeCart")) {
                    object.changeCart = $root.market.mass.ChangeCart.toObject(message.changeCart, options);
                    if (options.oneofs)
                        object.union = "changeCart";
                }
                if (message.changeStock != null && message.hasOwnProperty("changeStock")) {
                    object.changeStock = $root.market.mass.ChangeStock.toObject(message.changeStock, options);
                    if (options.oneofs)
                        object.union = "changeStock";
                }
                if (message.newKeyCard != null && message.hasOwnProperty("newKeyCard")) {
                    object.newKeyCard = $root.market.mass.NewKeyCard.toObject(message.newKeyCard, options);
                    if (options.oneofs)
                        object.union = "newKeyCard";
                }
                if (message.cartFinalized != null && message.hasOwnProperty("cartFinalized")) {
                    object.cartFinalized = $root.market.mass.CartFinalized.toObject(message.cartFinalized, options);
                    if (options.oneofs)
                        object.union = "cartFinalized";
                }
                if (message.cartAbandoned != null && message.hasOwnProperty("cartAbandoned")) {
                    object.cartAbandoned = $root.market.mass.CartAbandoned.toObject(message.cartAbandoned, options);
                    if (options.oneofs)
                        object.union = "cartAbandoned";
                }
                return object;
            };

            /**
             * Converts this Event to JSON.
             * @function toJSON
             * @memberof market.mass.Event
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Event.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for Event
             * @function getTypeUrl
             * @memberof market.mass.Event
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            Event.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/market.mass.Event";
            };

            return Event;
        })();

        mass.AuthenticateRequest = (function() {

            /**
             * Properties of an AuthenticateRequest.
             * @memberof market.mass
             * @interface IAuthenticateRequest
             * @property {Uint8Array|null} [requestId] AuthenticateRequest requestId
             * @property {Uint8Array|null} [publicKey] AuthenticateRequest publicKey
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
             * AuthenticateRequest requestId.
             * @member {Uint8Array} requestId
             * @memberof market.mass.AuthenticateRequest
             * @instance
             */
            AuthenticateRequest.prototype.requestId = $util.newBuffer([]);

            /**
             * AuthenticateRequest publicKey.
             * @member {Uint8Array} publicKey
             * @memberof market.mass.AuthenticateRequest
             * @instance
             */
            AuthenticateRequest.prototype.publicKey = $util.newBuffer([]);

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
                if (message.requestId != null && Object.hasOwnProperty.call(message, "requestId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.requestId);
                if (message.publicKey != null && Object.hasOwnProperty.call(message, "publicKey"))
                    writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.publicKey);
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
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.AuthenticateRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.requestId = reader.bytes();
                            break;
                        }
                    case 2: {
                            message.publicKey = reader.bytes();
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
                if (message.requestId != null && message.hasOwnProperty("requestId"))
                    if (!(message.requestId && typeof message.requestId.length === "number" || $util.isString(message.requestId)))
                        return "requestId: buffer expected";
                if (message.publicKey != null && message.hasOwnProperty("publicKey"))
                    if (!(message.publicKey && typeof message.publicKey.length === "number" || $util.isString(message.publicKey)))
                        return "publicKey: buffer expected";
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
                if (object.requestId != null)
                    if (typeof object.requestId === "string")
                        $util.base64.decode(object.requestId, message.requestId = $util.newBuffer($util.base64.length(object.requestId)), 0);
                    else if (object.requestId.length >= 0)
                        message.requestId = object.requestId;
                if (object.publicKey != null)
                    if (typeof object.publicKey === "string")
                        $util.base64.decode(object.publicKey, message.publicKey = $util.newBuffer($util.base64.length(object.publicKey)), 0);
                    else if (object.publicKey.length >= 0)
                        message.publicKey = object.publicKey;
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
                if (options.defaults) {
                    if (options.bytes === String)
                        object.requestId = "";
                    else {
                        object.requestId = [];
                        if (options.bytes !== Array)
                            object.requestId = $util.newBuffer(object.requestId);
                    }
                    if (options.bytes === String)
                        object.publicKey = "";
                    else {
                        object.publicKey = [];
                        if (options.bytes !== Array)
                            object.publicKey = $util.newBuffer(object.publicKey);
                    }
                }
                if (message.requestId != null && message.hasOwnProperty("requestId"))
                    object.requestId = options.bytes === String ? $util.base64.encode(message.requestId, 0, message.requestId.length) : options.bytes === Array ? Array.prototype.slice.call(message.requestId) : message.requestId;
                if (message.publicKey != null && message.hasOwnProperty("publicKey"))
                    object.publicKey = options.bytes === String ? $util.base64.encode(message.publicKey, 0, message.publicKey.length) : options.bytes === Array ? Array.prototype.slice.call(message.publicKey) : message.publicKey;
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

        mass.AuthenticateResponse = (function() {

            /**
             * Properties of an AuthenticateResponse.
             * @memberof market.mass
             * @interface IAuthenticateResponse
             * @property {Uint8Array|null} [requestId] AuthenticateResponse requestId
             * @property {market.mass.IError|null} [error] AuthenticateResponse error
             * @property {Uint8Array|null} [challenge] AuthenticateResponse challenge
             */

            /**
             * Constructs a new AuthenticateResponse.
             * @memberof market.mass
             * @classdesc Represents an AuthenticateResponse.
             * @implements IAuthenticateResponse
             * @constructor
             * @param {market.mass.IAuthenticateResponse=} [properties] Properties to set
             */
            function AuthenticateResponse(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * AuthenticateResponse requestId.
             * @member {Uint8Array} requestId
             * @memberof market.mass.AuthenticateResponse
             * @instance
             */
            AuthenticateResponse.prototype.requestId = $util.newBuffer([]);

            /**
             * AuthenticateResponse error.
             * @member {market.mass.IError|null|undefined} error
             * @memberof market.mass.AuthenticateResponse
             * @instance
             */
            AuthenticateResponse.prototype.error = null;

            /**
             * AuthenticateResponse challenge.
             * @member {Uint8Array} challenge
             * @memberof market.mass.AuthenticateResponse
             * @instance
             */
            AuthenticateResponse.prototype.challenge = $util.newBuffer([]);

            /**
             * Creates a new AuthenticateResponse instance using the specified properties.
             * @function create
             * @memberof market.mass.AuthenticateResponse
             * @static
             * @param {market.mass.IAuthenticateResponse=} [properties] Properties to set
             * @returns {market.mass.AuthenticateResponse} AuthenticateResponse instance
             */
            AuthenticateResponse.create = function create(properties) {
                return new AuthenticateResponse(properties);
            };

            /**
             * Encodes the specified AuthenticateResponse message. Does not implicitly {@link market.mass.AuthenticateResponse.verify|verify} messages.
             * @function encode
             * @memberof market.mass.AuthenticateResponse
             * @static
             * @param {market.mass.IAuthenticateResponse} message AuthenticateResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            AuthenticateResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.requestId != null && Object.hasOwnProperty.call(message, "requestId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.requestId);
                if (message.error != null && Object.hasOwnProperty.call(message, "error"))
                    $root.market.mass.Error.encode(message.error, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                if (message.challenge != null && Object.hasOwnProperty.call(message, "challenge"))
                    writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.challenge);
                return writer;
            };

            /**
             * Encodes the specified AuthenticateResponse message, length delimited. Does not implicitly {@link market.mass.AuthenticateResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof market.mass.AuthenticateResponse
             * @static
             * @param {market.mass.IAuthenticateResponse} message AuthenticateResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            AuthenticateResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an AuthenticateResponse message from the specified reader or buffer.
             * @function decode
             * @memberof market.mass.AuthenticateResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {market.mass.AuthenticateResponse} AuthenticateResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AuthenticateResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.AuthenticateResponse();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.requestId = reader.bytes();
                            break;
                        }
                    case 2: {
                            message.error = $root.market.mass.Error.decode(reader, reader.uint32());
                            break;
                        }
                    case 3: {
                            message.challenge = reader.bytes();
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
             * Decodes an AuthenticateResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof market.mass.AuthenticateResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {market.mass.AuthenticateResponse} AuthenticateResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AuthenticateResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an AuthenticateResponse message.
             * @function verify
             * @memberof market.mass.AuthenticateResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            AuthenticateResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.requestId != null && message.hasOwnProperty("requestId"))
                    if (!(message.requestId && typeof message.requestId.length === "number" || $util.isString(message.requestId)))
                        return "requestId: buffer expected";
                if (message.error != null && message.hasOwnProperty("error")) {
                    let error = $root.market.mass.Error.verify(message.error);
                    if (error)
                        return "error." + error;
                }
                if (message.challenge != null && message.hasOwnProperty("challenge"))
                    if (!(message.challenge && typeof message.challenge.length === "number" || $util.isString(message.challenge)))
                        return "challenge: buffer expected";
                return null;
            };

            /**
             * Creates an AuthenticateResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof market.mass.AuthenticateResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {market.mass.AuthenticateResponse} AuthenticateResponse
             */
            AuthenticateResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.market.mass.AuthenticateResponse)
                    return object;
                let message = new $root.market.mass.AuthenticateResponse();
                if (object.requestId != null)
                    if (typeof object.requestId === "string")
                        $util.base64.decode(object.requestId, message.requestId = $util.newBuffer($util.base64.length(object.requestId)), 0);
                    else if (object.requestId.length >= 0)
                        message.requestId = object.requestId;
                if (object.error != null) {
                    if (typeof object.error !== "object")
                        throw TypeError(".market.mass.AuthenticateResponse.error: object expected");
                    message.error = $root.market.mass.Error.fromObject(object.error);
                }
                if (object.challenge != null)
                    if (typeof object.challenge === "string")
                        $util.base64.decode(object.challenge, message.challenge = $util.newBuffer($util.base64.length(object.challenge)), 0);
                    else if (object.challenge.length >= 0)
                        message.challenge = object.challenge;
                return message;
            };

            /**
             * Creates a plain object from an AuthenticateResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof market.mass.AuthenticateResponse
             * @static
             * @param {market.mass.AuthenticateResponse} message AuthenticateResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            AuthenticateResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    if (options.bytes === String)
                        object.requestId = "";
                    else {
                        object.requestId = [];
                        if (options.bytes !== Array)
                            object.requestId = $util.newBuffer(object.requestId);
                    }
                    object.error = null;
                    if (options.bytes === String)
                        object.challenge = "";
                    else {
                        object.challenge = [];
                        if (options.bytes !== Array)
                            object.challenge = $util.newBuffer(object.challenge);
                    }
                }
                if (message.requestId != null && message.hasOwnProperty("requestId"))
                    object.requestId = options.bytes === String ? $util.base64.encode(message.requestId, 0, message.requestId.length) : options.bytes === Array ? Array.prototype.slice.call(message.requestId) : message.requestId;
                if (message.error != null && message.hasOwnProperty("error"))
                    object.error = $root.market.mass.Error.toObject(message.error, options);
                if (message.challenge != null && message.hasOwnProperty("challenge"))
                    object.challenge = options.bytes === String ? $util.base64.encode(message.challenge, 0, message.challenge.length) : options.bytes === Array ? Array.prototype.slice.call(message.challenge) : message.challenge;
                return object;
            };

            /**
             * Converts this AuthenticateResponse to JSON.
             * @function toJSON
             * @memberof market.mass.AuthenticateResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            AuthenticateResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for AuthenticateResponse
             * @function getTypeUrl
             * @memberof market.mass.AuthenticateResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            AuthenticateResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/market.mass.AuthenticateResponse";
            };

            return AuthenticateResponse;
        })();

        mass.ChallengeSolvedRequest = (function() {

            /**
             * Properties of a ChallengeSolvedRequest.
             * @memberof market.mass
             * @interface IChallengeSolvedRequest
             * @property {Uint8Array|null} [requestId] ChallengeSolvedRequest requestId
             * @property {Uint8Array|null} [signature] ChallengeSolvedRequest signature
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
             * ChallengeSolvedRequest requestId.
             * @member {Uint8Array} requestId
             * @memberof market.mass.ChallengeSolvedRequest
             * @instance
             */
            ChallengeSolvedRequest.prototype.requestId = $util.newBuffer([]);

            /**
             * ChallengeSolvedRequest signature.
             * @member {Uint8Array} signature
             * @memberof market.mass.ChallengeSolvedRequest
             * @instance
             */
            ChallengeSolvedRequest.prototype.signature = $util.newBuffer([]);

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
                if (message.requestId != null && Object.hasOwnProperty.call(message, "requestId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.requestId);
                if (message.signature != null && Object.hasOwnProperty.call(message, "signature"))
                    writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.signature);
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
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.ChallengeSolvedRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.requestId = reader.bytes();
                            break;
                        }
                    case 2: {
                            message.signature = reader.bytes();
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
                if (message.requestId != null && message.hasOwnProperty("requestId"))
                    if (!(message.requestId && typeof message.requestId.length === "number" || $util.isString(message.requestId)))
                        return "requestId: buffer expected";
                if (message.signature != null && message.hasOwnProperty("signature"))
                    if (!(message.signature && typeof message.signature.length === "number" || $util.isString(message.signature)))
                        return "signature: buffer expected";
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
                if (object.requestId != null)
                    if (typeof object.requestId === "string")
                        $util.base64.decode(object.requestId, message.requestId = $util.newBuffer($util.base64.length(object.requestId)), 0);
                    else if (object.requestId.length >= 0)
                        message.requestId = object.requestId;
                if (object.signature != null)
                    if (typeof object.signature === "string")
                        $util.base64.decode(object.signature, message.signature = $util.newBuffer($util.base64.length(object.signature)), 0);
                    else if (object.signature.length >= 0)
                        message.signature = object.signature;
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
                if (options.defaults) {
                    if (options.bytes === String)
                        object.requestId = "";
                    else {
                        object.requestId = [];
                        if (options.bytes !== Array)
                            object.requestId = $util.newBuffer(object.requestId);
                    }
                    if (options.bytes === String)
                        object.signature = "";
                    else {
                        object.signature = [];
                        if (options.bytes !== Array)
                            object.signature = $util.newBuffer(object.signature);
                    }
                }
                if (message.requestId != null && message.hasOwnProperty("requestId"))
                    object.requestId = options.bytes === String ? $util.base64.encode(message.requestId, 0, message.requestId.length) : options.bytes === Array ? Array.prototype.slice.call(message.requestId) : message.requestId;
                if (message.signature != null && message.hasOwnProperty("signature"))
                    object.signature = options.bytes === String ? $util.base64.encode(message.signature, 0, message.signature.length) : options.bytes === Array ? Array.prototype.slice.call(message.signature) : message.signature;
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

        mass.ChallengeSolvedResponse = (function() {

            /**
             * Properties of a ChallengeSolvedResponse.
             * @memberof market.mass
             * @interface IChallengeSolvedResponse
             * @property {Uint8Array|null} [requestId] ChallengeSolvedResponse requestId
             * @property {market.mass.IError|null} [error] ChallengeSolvedResponse error
             */

            /**
             * Constructs a new ChallengeSolvedResponse.
             * @memberof market.mass
             * @classdesc Represents a ChallengeSolvedResponse.
             * @implements IChallengeSolvedResponse
             * @constructor
             * @param {market.mass.IChallengeSolvedResponse=} [properties] Properties to set
             */
            function ChallengeSolvedResponse(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * ChallengeSolvedResponse requestId.
             * @member {Uint8Array} requestId
             * @memberof market.mass.ChallengeSolvedResponse
             * @instance
             */
            ChallengeSolvedResponse.prototype.requestId = $util.newBuffer([]);

            /**
             * ChallengeSolvedResponse error.
             * @member {market.mass.IError|null|undefined} error
             * @memberof market.mass.ChallengeSolvedResponse
             * @instance
             */
            ChallengeSolvedResponse.prototype.error = null;

            /**
             * Creates a new ChallengeSolvedResponse instance using the specified properties.
             * @function create
             * @memberof market.mass.ChallengeSolvedResponse
             * @static
             * @param {market.mass.IChallengeSolvedResponse=} [properties] Properties to set
             * @returns {market.mass.ChallengeSolvedResponse} ChallengeSolvedResponse instance
             */
            ChallengeSolvedResponse.create = function create(properties) {
                return new ChallengeSolvedResponse(properties);
            };

            /**
             * Encodes the specified ChallengeSolvedResponse message. Does not implicitly {@link market.mass.ChallengeSolvedResponse.verify|verify} messages.
             * @function encode
             * @memberof market.mass.ChallengeSolvedResponse
             * @static
             * @param {market.mass.IChallengeSolvedResponse} message ChallengeSolvedResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ChallengeSolvedResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.requestId != null && Object.hasOwnProperty.call(message, "requestId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.requestId);
                if (message.error != null && Object.hasOwnProperty.call(message, "error"))
                    $root.market.mass.Error.encode(message.error, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified ChallengeSolvedResponse message, length delimited. Does not implicitly {@link market.mass.ChallengeSolvedResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof market.mass.ChallengeSolvedResponse
             * @static
             * @param {market.mass.IChallengeSolvedResponse} message ChallengeSolvedResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ChallengeSolvedResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a ChallengeSolvedResponse message from the specified reader or buffer.
             * @function decode
             * @memberof market.mass.ChallengeSolvedResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {market.mass.ChallengeSolvedResponse} ChallengeSolvedResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ChallengeSolvedResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.ChallengeSolvedResponse();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.requestId = reader.bytes();
                            break;
                        }
                    case 2: {
                            message.error = $root.market.mass.Error.decode(reader, reader.uint32());
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
             * Decodes a ChallengeSolvedResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof market.mass.ChallengeSolvedResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {market.mass.ChallengeSolvedResponse} ChallengeSolvedResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ChallengeSolvedResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ChallengeSolvedResponse message.
             * @function verify
             * @memberof market.mass.ChallengeSolvedResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ChallengeSolvedResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.requestId != null && message.hasOwnProperty("requestId"))
                    if (!(message.requestId && typeof message.requestId.length === "number" || $util.isString(message.requestId)))
                        return "requestId: buffer expected";
                if (message.error != null && message.hasOwnProperty("error")) {
                    let error = $root.market.mass.Error.verify(message.error);
                    if (error)
                        return "error." + error;
                }
                return null;
            };

            /**
             * Creates a ChallengeSolvedResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof market.mass.ChallengeSolvedResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {market.mass.ChallengeSolvedResponse} ChallengeSolvedResponse
             */
            ChallengeSolvedResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.market.mass.ChallengeSolvedResponse)
                    return object;
                let message = new $root.market.mass.ChallengeSolvedResponse();
                if (object.requestId != null)
                    if (typeof object.requestId === "string")
                        $util.base64.decode(object.requestId, message.requestId = $util.newBuffer($util.base64.length(object.requestId)), 0);
                    else if (object.requestId.length >= 0)
                        message.requestId = object.requestId;
                if (object.error != null) {
                    if (typeof object.error !== "object")
                        throw TypeError(".market.mass.ChallengeSolvedResponse.error: object expected");
                    message.error = $root.market.mass.Error.fromObject(object.error);
                }
                return message;
            };

            /**
             * Creates a plain object from a ChallengeSolvedResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof market.mass.ChallengeSolvedResponse
             * @static
             * @param {market.mass.ChallengeSolvedResponse} message ChallengeSolvedResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ChallengeSolvedResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    if (options.bytes === String)
                        object.requestId = "";
                    else {
                        object.requestId = [];
                        if (options.bytes !== Array)
                            object.requestId = $util.newBuffer(object.requestId);
                    }
                    object.error = null;
                }
                if (message.requestId != null && message.hasOwnProperty("requestId"))
                    object.requestId = options.bytes === String ? $util.base64.encode(message.requestId, 0, message.requestId.length) : options.bytes === Array ? Array.prototype.slice.call(message.requestId) : message.requestId;
                if (message.error != null && message.hasOwnProperty("error"))
                    object.error = $root.market.mass.Error.toObject(message.error, options);
                return object;
            };

            /**
             * Converts this ChallengeSolvedResponse to JSON.
             * @function toJSON
             * @memberof market.mass.ChallengeSolvedResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ChallengeSolvedResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for ChallengeSolvedResponse
             * @function getTypeUrl
             * @memberof market.mass.ChallengeSolvedResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            ChallengeSolvedResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/market.mass.ChallengeSolvedResponse";
            };

            return ChallengeSolvedResponse;
        })();

        mass.CommitCartRequest = (function() {

            /**
             * Properties of a CommitCartRequest.
             * @memberof market.mass
             * @interface ICommitCartRequest
             * @property {Uint8Array|null} [requestId] CommitCartRequest requestId
             * @property {Uint8Array|null} [cartId] CommitCartRequest cartId
             * @property {Uint8Array|null} [erc20Addr] CommitCartRequest erc20Addr
             */

            /**
             * Constructs a new CommitCartRequest.
             * @memberof market.mass
             * @classdesc Represents a CommitCartRequest.
             * @implements ICommitCartRequest
             * @constructor
             * @param {market.mass.ICommitCartRequest=} [properties] Properties to set
             */
            function CommitCartRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * CommitCartRequest requestId.
             * @member {Uint8Array} requestId
             * @memberof market.mass.CommitCartRequest
             * @instance
             */
            CommitCartRequest.prototype.requestId = $util.newBuffer([]);

            /**
             * CommitCartRequest cartId.
             * @member {Uint8Array} cartId
             * @memberof market.mass.CommitCartRequest
             * @instance
             */
            CommitCartRequest.prototype.cartId = $util.newBuffer([]);

            /**
             * CommitCartRequest erc20Addr.
             * @member {Uint8Array} erc20Addr
             * @memberof market.mass.CommitCartRequest
             * @instance
             */
            CommitCartRequest.prototype.erc20Addr = $util.newBuffer([]);

            /**
             * Creates a new CommitCartRequest instance using the specified properties.
             * @function create
             * @memberof market.mass.CommitCartRequest
             * @static
             * @param {market.mass.ICommitCartRequest=} [properties] Properties to set
             * @returns {market.mass.CommitCartRequest} CommitCartRequest instance
             */
            CommitCartRequest.create = function create(properties) {
                return new CommitCartRequest(properties);
            };

            /**
             * Encodes the specified CommitCartRequest message. Does not implicitly {@link market.mass.CommitCartRequest.verify|verify} messages.
             * @function encode
             * @memberof market.mass.CommitCartRequest
             * @static
             * @param {market.mass.ICommitCartRequest} message CommitCartRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CommitCartRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.requestId != null && Object.hasOwnProperty.call(message, "requestId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.requestId);
                if (message.cartId != null && Object.hasOwnProperty.call(message, "cartId"))
                    writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.cartId);
                if (message.erc20Addr != null && Object.hasOwnProperty.call(message, "erc20Addr"))
                    writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.erc20Addr);
                return writer;
            };

            /**
             * Encodes the specified CommitCartRequest message, length delimited. Does not implicitly {@link market.mass.CommitCartRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof market.mass.CommitCartRequest
             * @static
             * @param {market.mass.ICommitCartRequest} message CommitCartRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CommitCartRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a CommitCartRequest message from the specified reader or buffer.
             * @function decode
             * @memberof market.mass.CommitCartRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {market.mass.CommitCartRequest} CommitCartRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CommitCartRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.CommitCartRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.requestId = reader.bytes();
                            break;
                        }
                    case 2: {
                            message.cartId = reader.bytes();
                            break;
                        }
                    case 3: {
                            message.erc20Addr = reader.bytes();
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
             * Decodes a CommitCartRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof market.mass.CommitCartRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {market.mass.CommitCartRequest} CommitCartRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CommitCartRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a CommitCartRequest message.
             * @function verify
             * @memberof market.mass.CommitCartRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            CommitCartRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.requestId != null && message.hasOwnProperty("requestId"))
                    if (!(message.requestId && typeof message.requestId.length === "number" || $util.isString(message.requestId)))
                        return "requestId: buffer expected";
                if (message.cartId != null && message.hasOwnProperty("cartId"))
                    if (!(message.cartId && typeof message.cartId.length === "number" || $util.isString(message.cartId)))
                        return "cartId: buffer expected";
                if (message.erc20Addr != null && message.hasOwnProperty("erc20Addr"))
                    if (!(message.erc20Addr && typeof message.erc20Addr.length === "number" || $util.isString(message.erc20Addr)))
                        return "erc20Addr: buffer expected";
                return null;
            };

            /**
             * Creates a CommitCartRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof market.mass.CommitCartRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {market.mass.CommitCartRequest} CommitCartRequest
             */
            CommitCartRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.market.mass.CommitCartRequest)
                    return object;
                let message = new $root.market.mass.CommitCartRequest();
                if (object.requestId != null)
                    if (typeof object.requestId === "string")
                        $util.base64.decode(object.requestId, message.requestId = $util.newBuffer($util.base64.length(object.requestId)), 0);
                    else if (object.requestId.length >= 0)
                        message.requestId = object.requestId;
                if (object.cartId != null)
                    if (typeof object.cartId === "string")
                        $util.base64.decode(object.cartId, message.cartId = $util.newBuffer($util.base64.length(object.cartId)), 0);
                    else if (object.cartId.length >= 0)
                        message.cartId = object.cartId;
                if (object.erc20Addr != null)
                    if (typeof object.erc20Addr === "string")
                        $util.base64.decode(object.erc20Addr, message.erc20Addr = $util.newBuffer($util.base64.length(object.erc20Addr)), 0);
                    else if (object.erc20Addr.length >= 0)
                        message.erc20Addr = object.erc20Addr;
                return message;
            };

            /**
             * Creates a plain object from a CommitCartRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof market.mass.CommitCartRequest
             * @static
             * @param {market.mass.CommitCartRequest} message CommitCartRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            CommitCartRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    if (options.bytes === String)
                        object.requestId = "";
                    else {
                        object.requestId = [];
                        if (options.bytes !== Array)
                            object.requestId = $util.newBuffer(object.requestId);
                    }
                    if (options.bytes === String)
                        object.cartId = "";
                    else {
                        object.cartId = [];
                        if (options.bytes !== Array)
                            object.cartId = $util.newBuffer(object.cartId);
                    }
                    if (options.bytes === String)
                        object.erc20Addr = "";
                    else {
                        object.erc20Addr = [];
                        if (options.bytes !== Array)
                            object.erc20Addr = $util.newBuffer(object.erc20Addr);
                    }
                }
                if (message.requestId != null && message.hasOwnProperty("requestId"))
                    object.requestId = options.bytes === String ? $util.base64.encode(message.requestId, 0, message.requestId.length) : options.bytes === Array ? Array.prototype.slice.call(message.requestId) : message.requestId;
                if (message.cartId != null && message.hasOwnProperty("cartId"))
                    object.cartId = options.bytes === String ? $util.base64.encode(message.cartId, 0, message.cartId.length) : options.bytes === Array ? Array.prototype.slice.call(message.cartId) : message.cartId;
                if (message.erc20Addr != null && message.hasOwnProperty("erc20Addr"))
                    object.erc20Addr = options.bytes === String ? $util.base64.encode(message.erc20Addr, 0, message.erc20Addr.length) : options.bytes === Array ? Array.prototype.slice.call(message.erc20Addr) : message.erc20Addr;
                return object;
            };

            /**
             * Converts this CommitCartRequest to JSON.
             * @function toJSON
             * @memberof market.mass.CommitCartRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            CommitCartRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for CommitCartRequest
             * @function getTypeUrl
             * @memberof market.mass.CommitCartRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            CommitCartRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/market.mass.CommitCartRequest";
            };

            return CommitCartRequest;
        })();

        mass.CommitCartResponse = (function() {

            /**
             * Properties of a CommitCartResponse.
             * @memberof market.mass
             * @interface ICommitCartResponse
             * @property {Uint8Array|null} [requestId] CommitCartResponse requestId
             * @property {market.mass.IError|null} [error] CommitCartResponse error
             * @property {Uint8Array|null} [cartFinalizedId] CommitCartResponse cartFinalizedId
             */

            /**
             * Constructs a new CommitCartResponse.
             * @memberof market.mass
             * @classdesc Represents a CommitCartResponse.
             * @implements ICommitCartResponse
             * @constructor
             * @param {market.mass.ICommitCartResponse=} [properties] Properties to set
             */
            function CommitCartResponse(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * CommitCartResponse requestId.
             * @member {Uint8Array} requestId
             * @memberof market.mass.CommitCartResponse
             * @instance
             */
            CommitCartResponse.prototype.requestId = $util.newBuffer([]);

            /**
             * CommitCartResponse error.
             * @member {market.mass.IError|null|undefined} error
             * @memberof market.mass.CommitCartResponse
             * @instance
             */
            CommitCartResponse.prototype.error = null;

            /**
             * CommitCartResponse cartFinalizedId.
             * @member {Uint8Array} cartFinalizedId
             * @memberof market.mass.CommitCartResponse
             * @instance
             */
            CommitCartResponse.prototype.cartFinalizedId = $util.newBuffer([]);

            /**
             * Creates a new CommitCartResponse instance using the specified properties.
             * @function create
             * @memberof market.mass.CommitCartResponse
             * @static
             * @param {market.mass.ICommitCartResponse=} [properties] Properties to set
             * @returns {market.mass.CommitCartResponse} CommitCartResponse instance
             */
            CommitCartResponse.create = function create(properties) {
                return new CommitCartResponse(properties);
            };

            /**
             * Encodes the specified CommitCartResponse message. Does not implicitly {@link market.mass.CommitCartResponse.verify|verify} messages.
             * @function encode
             * @memberof market.mass.CommitCartResponse
             * @static
             * @param {market.mass.ICommitCartResponse} message CommitCartResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CommitCartResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.requestId != null && Object.hasOwnProperty.call(message, "requestId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.requestId);
                if (message.error != null && Object.hasOwnProperty.call(message, "error"))
                    $root.market.mass.Error.encode(message.error, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                if (message.cartFinalizedId != null && Object.hasOwnProperty.call(message, "cartFinalizedId"))
                    writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.cartFinalizedId);
                return writer;
            };

            /**
             * Encodes the specified CommitCartResponse message, length delimited. Does not implicitly {@link market.mass.CommitCartResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof market.mass.CommitCartResponse
             * @static
             * @param {market.mass.ICommitCartResponse} message CommitCartResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CommitCartResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a CommitCartResponse message from the specified reader or buffer.
             * @function decode
             * @memberof market.mass.CommitCartResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {market.mass.CommitCartResponse} CommitCartResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CommitCartResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.CommitCartResponse();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.requestId = reader.bytes();
                            break;
                        }
                    case 2: {
                            message.error = $root.market.mass.Error.decode(reader, reader.uint32());
                            break;
                        }
                    case 3: {
                            message.cartFinalizedId = reader.bytes();
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
             * Decodes a CommitCartResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof market.mass.CommitCartResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {market.mass.CommitCartResponse} CommitCartResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CommitCartResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a CommitCartResponse message.
             * @function verify
             * @memberof market.mass.CommitCartResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            CommitCartResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.requestId != null && message.hasOwnProperty("requestId"))
                    if (!(message.requestId && typeof message.requestId.length === "number" || $util.isString(message.requestId)))
                        return "requestId: buffer expected";
                if (message.error != null && message.hasOwnProperty("error")) {
                    let error = $root.market.mass.Error.verify(message.error);
                    if (error)
                        return "error." + error;
                }
                if (message.cartFinalizedId != null && message.hasOwnProperty("cartFinalizedId"))
                    if (!(message.cartFinalizedId && typeof message.cartFinalizedId.length === "number" || $util.isString(message.cartFinalizedId)))
                        return "cartFinalizedId: buffer expected";
                return null;
            };

            /**
             * Creates a CommitCartResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof market.mass.CommitCartResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {market.mass.CommitCartResponse} CommitCartResponse
             */
            CommitCartResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.market.mass.CommitCartResponse)
                    return object;
                let message = new $root.market.mass.CommitCartResponse();
                if (object.requestId != null)
                    if (typeof object.requestId === "string")
                        $util.base64.decode(object.requestId, message.requestId = $util.newBuffer($util.base64.length(object.requestId)), 0);
                    else if (object.requestId.length >= 0)
                        message.requestId = object.requestId;
                if (object.error != null) {
                    if (typeof object.error !== "object")
                        throw TypeError(".market.mass.CommitCartResponse.error: object expected");
                    message.error = $root.market.mass.Error.fromObject(object.error);
                }
                if (object.cartFinalizedId != null)
                    if (typeof object.cartFinalizedId === "string")
                        $util.base64.decode(object.cartFinalizedId, message.cartFinalizedId = $util.newBuffer($util.base64.length(object.cartFinalizedId)), 0);
                    else if (object.cartFinalizedId.length >= 0)
                        message.cartFinalizedId = object.cartFinalizedId;
                return message;
            };

            /**
             * Creates a plain object from a CommitCartResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof market.mass.CommitCartResponse
             * @static
             * @param {market.mass.CommitCartResponse} message CommitCartResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            CommitCartResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    if (options.bytes === String)
                        object.requestId = "";
                    else {
                        object.requestId = [];
                        if (options.bytes !== Array)
                            object.requestId = $util.newBuffer(object.requestId);
                    }
                    object.error = null;
                    if (options.bytes === String)
                        object.cartFinalizedId = "";
                    else {
                        object.cartFinalizedId = [];
                        if (options.bytes !== Array)
                            object.cartFinalizedId = $util.newBuffer(object.cartFinalizedId);
                    }
                }
                if (message.requestId != null && message.hasOwnProperty("requestId"))
                    object.requestId = options.bytes === String ? $util.base64.encode(message.requestId, 0, message.requestId.length) : options.bytes === Array ? Array.prototype.slice.call(message.requestId) : message.requestId;
                if (message.error != null && message.hasOwnProperty("error"))
                    object.error = $root.market.mass.Error.toObject(message.error, options);
                if (message.cartFinalizedId != null && message.hasOwnProperty("cartFinalizedId"))
                    object.cartFinalizedId = options.bytes === String ? $util.base64.encode(message.cartFinalizedId, 0, message.cartFinalizedId.length) : options.bytes === Array ? Array.prototype.slice.call(message.cartFinalizedId) : message.cartFinalizedId;
                return object;
            };

            /**
             * Converts this CommitCartResponse to JSON.
             * @function toJSON
             * @memberof market.mass.CommitCartResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            CommitCartResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for CommitCartResponse
             * @function getTypeUrl
             * @memberof market.mass.CommitCartResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            CommitCartResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/market.mass.CommitCartResponse";
            };

            return CommitCartResponse;
        })();

        mass.GetBlobUploadURLRequest = (function() {

            /**
             * Properties of a GetBlobUploadURLRequest.
             * @memberof market.mass
             * @interface IGetBlobUploadURLRequest
             * @property {Uint8Array|null} [requestId] GetBlobUploadURLRequest requestId
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
             * GetBlobUploadURLRequest requestId.
             * @member {Uint8Array} requestId
             * @memberof market.mass.GetBlobUploadURLRequest
             * @instance
             */
            GetBlobUploadURLRequest.prototype.requestId = $util.newBuffer([]);

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
                if (message.requestId != null && Object.hasOwnProperty.call(message, "requestId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.requestId);
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
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.GetBlobUploadURLRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.requestId = reader.bytes();
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
                if (message.requestId != null && message.hasOwnProperty("requestId"))
                    if (!(message.requestId && typeof message.requestId.length === "number" || $util.isString(message.requestId)))
                        return "requestId: buffer expected";
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
                let message = new $root.market.mass.GetBlobUploadURLRequest();
                if (object.requestId != null)
                    if (typeof object.requestId === "string")
                        $util.base64.decode(object.requestId, message.requestId = $util.newBuffer($util.base64.length(object.requestId)), 0);
                    else if (object.requestId.length >= 0)
                        message.requestId = object.requestId;
                return message;
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
            GetBlobUploadURLRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    if (options.bytes === String)
                        object.requestId = "";
                    else {
                        object.requestId = [];
                        if (options.bytes !== Array)
                            object.requestId = $util.newBuffer(object.requestId);
                    }
                if (message.requestId != null && message.hasOwnProperty("requestId"))
                    object.requestId = options.bytes === String ? $util.base64.encode(message.requestId, 0, message.requestId.length) : options.bytes === Array ? Array.prototype.slice.call(message.requestId) : message.requestId;
                return object;
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
             * @property {Uint8Array|null} [requestId] GetBlobUploadURLResponse requestId
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
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetBlobUploadURLResponse requestId.
             * @member {Uint8Array} requestId
             * @memberof market.mass.GetBlobUploadURLResponse
             * @instance
             */
            GetBlobUploadURLResponse.prototype.requestId = $util.newBuffer([]);

            /**
             * GetBlobUploadURLResponse error.
             * @member {market.mass.IError|null|undefined} error
             * @memberof market.mass.GetBlobUploadURLResponse
             * @instance
             */
            GetBlobUploadURLResponse.prototype.error = null;

            /**
             * GetBlobUploadURLResponse url.
             * @member {string} url
             * @memberof market.mass.GetBlobUploadURLResponse
             * @instance
             */
            GetBlobUploadURLResponse.prototype.url = "";

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
                if (message.requestId != null && Object.hasOwnProperty.call(message, "requestId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.requestId);
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
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.GetBlobUploadURLResponse();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.requestId = reader.bytes();
                            break;
                        }
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
                if (message.requestId != null && message.hasOwnProperty("requestId"))
                    if (!(message.requestId && typeof message.requestId.length === "number" || $util.isString(message.requestId)))
                        return "requestId: buffer expected";
                if (message.error != null && message.hasOwnProperty("error")) {
                    let error = $root.market.mass.Error.verify(message.error);
                    if (error)
                        return "error." + error;
                }
                if (message.url != null && message.hasOwnProperty("url"))
                    if (!$util.isString(message.url))
                        return "url: string expected";
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
                let message = new $root.market.mass.GetBlobUploadURLResponse();
                if (object.requestId != null)
                    if (typeof object.requestId === "string")
                        $util.base64.decode(object.requestId, message.requestId = $util.newBuffer($util.base64.length(object.requestId)), 0);
                    else if (object.requestId.length >= 0)
                        message.requestId = object.requestId;
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
                let object = {};
                if (options.defaults) {
                    if (options.bytes === String)
                        object.requestId = "";
                    else {
                        object.requestId = [];
                        if (options.bytes !== Array)
                            object.requestId = $util.newBuffer(object.requestId);
                    }
                    object.error = null;
                    object.url = "";
                }
                if (message.requestId != null && message.hasOwnProperty("requestId"))
                    object.requestId = options.bytes === String ? $util.base64.encode(message.requestId, 0, message.requestId.length) : options.bytes === Array ? Array.prototype.slice.call(message.requestId) : message.requestId;
                if (message.error != null && message.hasOwnProperty("error"))
                    object.error = $root.market.mass.Error.toObject(message.error, options);
                if (message.url != null && message.hasOwnProperty("url"))
                    object.url = message.url;
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

        mass.EventWriteRequest = (function() {

            /**
             * Properties of an EventWriteRequest.
             * @memberof market.mass
             * @interface IEventWriteRequest
             * @property {Uint8Array|null} [requestId] EventWriteRequest requestId
             * @property {market.mass.IEvent|null} [event] EventWriteRequest event
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
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * EventWriteRequest requestId.
             * @member {Uint8Array} requestId
             * @memberof market.mass.EventWriteRequest
             * @instance
             */
            EventWriteRequest.prototype.requestId = $util.newBuffer([]);

            /**
             * EventWriteRequest event.
             * @member {market.mass.IEvent|null|undefined} event
             * @memberof market.mass.EventWriteRequest
             * @instance
             */
            EventWriteRequest.prototype.event = null;

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
                if (message.requestId != null && Object.hasOwnProperty.call(message, "requestId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.requestId);
                if (message.event != null && Object.hasOwnProperty.call(message, "event"))
                    $root.market.mass.Event.encode(message.event, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
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
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.EventWriteRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.requestId = reader.bytes();
                            break;
                        }
                    case 2: {
                            message.event = $root.market.mass.Event.decode(reader, reader.uint32());
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
                if (message.requestId != null && message.hasOwnProperty("requestId"))
                    if (!(message.requestId && typeof message.requestId.length === "number" || $util.isString(message.requestId)))
                        return "requestId: buffer expected";
                if (message.event != null && message.hasOwnProperty("event")) {
                    let error = $root.market.mass.Event.verify(message.event);
                    if (error)
                        return "event." + error;
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
                let message = new $root.market.mass.EventWriteRequest();
                if (object.requestId != null)
                    if (typeof object.requestId === "string")
                        $util.base64.decode(object.requestId, message.requestId = $util.newBuffer($util.base64.length(object.requestId)), 0);
                    else if (object.requestId.length >= 0)
                        message.requestId = object.requestId;
                if (object.event != null) {
                    if (typeof object.event !== "object")
                        throw TypeError(".market.mass.EventWriteRequest.event: object expected");
                    message.event = $root.market.mass.Event.fromObject(object.event);
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
                let object = {};
                if (options.defaults) {
                    if (options.bytes === String)
                        object.requestId = "";
                    else {
                        object.requestId = [];
                        if (options.bytes !== Array)
                            object.requestId = $util.newBuffer(object.requestId);
                    }
                    object.event = null;
                }
                if (message.requestId != null && message.hasOwnProperty("requestId"))
                    object.requestId = options.bytes === String ? $util.base64.encode(message.requestId, 0, message.requestId.length) : options.bytes === Array ? Array.prototype.slice.call(message.requestId) : message.requestId;
                if (message.event != null && message.hasOwnProperty("event"))
                    object.event = $root.market.mass.Event.toObject(message.event, options);
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

        mass.EventWriteResponse = (function() {

            /**
             * Properties of an EventWriteResponse.
             * @memberof market.mass
             * @interface IEventWriteResponse
             * @property {Uint8Array|null} [requestId] EventWriteResponse requestId
             * @property {market.mass.IError|null} [error] EventWriteResponse error
             * @property {Uint8Array|null} [newStoreHash] EventWriteResponse newStoreHash
             * @property {number|Long|null} [eventSequenceNo] EventWriteResponse eventSequenceNo
             */

            /**
             * Constructs a new EventWriteResponse.
             * @memberof market.mass
             * @classdesc Represents an EventWriteResponse.
             * @implements IEventWriteResponse
             * @constructor
             * @param {market.mass.IEventWriteResponse=} [properties] Properties to set
             */
            function EventWriteResponse(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * EventWriteResponse requestId.
             * @member {Uint8Array} requestId
             * @memberof market.mass.EventWriteResponse
             * @instance
             */
            EventWriteResponse.prototype.requestId = $util.newBuffer([]);

            /**
             * EventWriteResponse error.
             * @member {market.mass.IError|null|undefined} error
             * @memberof market.mass.EventWriteResponse
             * @instance
             */
            EventWriteResponse.prototype.error = null;

            /**
             * EventWriteResponse newStoreHash.
             * @member {Uint8Array} newStoreHash
             * @memberof market.mass.EventWriteResponse
             * @instance
             */
            EventWriteResponse.prototype.newStoreHash = $util.newBuffer([]);

            /**
             * EventWriteResponse eventSequenceNo.
             * @member {number|Long} eventSequenceNo
             * @memberof market.mass.EventWriteResponse
             * @instance
             */
            EventWriteResponse.prototype.eventSequenceNo = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * Creates a new EventWriteResponse instance using the specified properties.
             * @function create
             * @memberof market.mass.EventWriteResponse
             * @static
             * @param {market.mass.IEventWriteResponse=} [properties] Properties to set
             * @returns {market.mass.EventWriteResponse} EventWriteResponse instance
             */
            EventWriteResponse.create = function create(properties) {
                return new EventWriteResponse(properties);
            };

            /**
             * Encodes the specified EventWriteResponse message. Does not implicitly {@link market.mass.EventWriteResponse.verify|verify} messages.
             * @function encode
             * @memberof market.mass.EventWriteResponse
             * @static
             * @param {market.mass.IEventWriteResponse} message EventWriteResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            EventWriteResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.requestId != null && Object.hasOwnProperty.call(message, "requestId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.requestId);
                if (message.error != null && Object.hasOwnProperty.call(message, "error"))
                    $root.market.mass.Error.encode(message.error, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                if (message.newStoreHash != null && Object.hasOwnProperty.call(message, "newStoreHash"))
                    writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.newStoreHash);
                if (message.eventSequenceNo != null && Object.hasOwnProperty.call(message, "eventSequenceNo"))
                    writer.uint32(/* id 4, wireType 0 =*/32).uint64(message.eventSequenceNo);
                return writer;
            };

            /**
             * Encodes the specified EventWriteResponse message, length delimited. Does not implicitly {@link market.mass.EventWriteResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof market.mass.EventWriteResponse
             * @static
             * @param {market.mass.IEventWriteResponse} message EventWriteResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            EventWriteResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an EventWriteResponse message from the specified reader or buffer.
             * @function decode
             * @memberof market.mass.EventWriteResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {market.mass.EventWriteResponse} EventWriteResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            EventWriteResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.EventWriteResponse();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.requestId = reader.bytes();
                            break;
                        }
                    case 2: {
                            message.error = $root.market.mass.Error.decode(reader, reader.uint32());
                            break;
                        }
                    case 3: {
                            message.newStoreHash = reader.bytes();
                            break;
                        }
                    case 4: {
                            message.eventSequenceNo = reader.uint64();
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
             * Decodes an EventWriteResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof market.mass.EventWriteResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {market.mass.EventWriteResponse} EventWriteResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            EventWriteResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an EventWriteResponse message.
             * @function verify
             * @memberof market.mass.EventWriteResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            EventWriteResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.requestId != null && message.hasOwnProperty("requestId"))
                    if (!(message.requestId && typeof message.requestId.length === "number" || $util.isString(message.requestId)))
                        return "requestId: buffer expected";
                if (message.error != null && message.hasOwnProperty("error")) {
                    let error = $root.market.mass.Error.verify(message.error);
                    if (error)
                        return "error." + error;
                }
                if (message.newStoreHash != null && message.hasOwnProperty("newStoreHash"))
                    if (!(message.newStoreHash && typeof message.newStoreHash.length === "number" || $util.isString(message.newStoreHash)))
                        return "newStoreHash: buffer expected";
                if (message.eventSequenceNo != null && message.hasOwnProperty("eventSequenceNo"))
                    if (!$util.isInteger(message.eventSequenceNo) && !(message.eventSequenceNo && $util.isInteger(message.eventSequenceNo.low) && $util.isInteger(message.eventSequenceNo.high)))
                        return "eventSequenceNo: integer|Long expected";
                return null;
            };

            /**
             * Creates an EventWriteResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof market.mass.EventWriteResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {market.mass.EventWriteResponse} EventWriteResponse
             */
            EventWriteResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.market.mass.EventWriteResponse)
                    return object;
                let message = new $root.market.mass.EventWriteResponse();
                if (object.requestId != null)
                    if (typeof object.requestId === "string")
                        $util.base64.decode(object.requestId, message.requestId = $util.newBuffer($util.base64.length(object.requestId)), 0);
                    else if (object.requestId.length >= 0)
                        message.requestId = object.requestId;
                if (object.error != null) {
                    if (typeof object.error !== "object")
                        throw TypeError(".market.mass.EventWriteResponse.error: object expected");
                    message.error = $root.market.mass.Error.fromObject(object.error);
                }
                if (object.newStoreHash != null)
                    if (typeof object.newStoreHash === "string")
                        $util.base64.decode(object.newStoreHash, message.newStoreHash = $util.newBuffer($util.base64.length(object.newStoreHash)), 0);
                    else if (object.newStoreHash.length >= 0)
                        message.newStoreHash = object.newStoreHash;
                if (object.eventSequenceNo != null)
                    if ($util.Long)
                        (message.eventSequenceNo = $util.Long.fromValue(object.eventSequenceNo)).unsigned = true;
                    else if (typeof object.eventSequenceNo === "string")
                        message.eventSequenceNo = parseInt(object.eventSequenceNo, 10);
                    else if (typeof object.eventSequenceNo === "number")
                        message.eventSequenceNo = object.eventSequenceNo;
                    else if (typeof object.eventSequenceNo === "object")
                        message.eventSequenceNo = new $util.LongBits(object.eventSequenceNo.low >>> 0, object.eventSequenceNo.high >>> 0).toNumber(true);
                return message;
            };

            /**
             * Creates a plain object from an EventWriteResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof market.mass.EventWriteResponse
             * @static
             * @param {market.mass.EventWriteResponse} message EventWriteResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            EventWriteResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    if (options.bytes === String)
                        object.requestId = "";
                    else {
                        object.requestId = [];
                        if (options.bytes !== Array)
                            object.requestId = $util.newBuffer(object.requestId);
                    }
                    object.error = null;
                    if (options.bytes === String)
                        object.newStoreHash = "";
                    else {
                        object.newStoreHash = [];
                        if (options.bytes !== Array)
                            object.newStoreHash = $util.newBuffer(object.newStoreHash);
                    }
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.eventSequenceNo = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.eventSequenceNo = options.longs === String ? "0" : 0;
                }
                if (message.requestId != null && message.hasOwnProperty("requestId"))
                    object.requestId = options.bytes === String ? $util.base64.encode(message.requestId, 0, message.requestId.length) : options.bytes === Array ? Array.prototype.slice.call(message.requestId) : message.requestId;
                if (message.error != null && message.hasOwnProperty("error"))
                    object.error = $root.market.mass.Error.toObject(message.error, options);
                if (message.newStoreHash != null && message.hasOwnProperty("newStoreHash"))
                    object.newStoreHash = options.bytes === String ? $util.base64.encode(message.newStoreHash, 0, message.newStoreHash.length) : options.bytes === Array ? Array.prototype.slice.call(message.newStoreHash) : message.newStoreHash;
                if (message.eventSequenceNo != null && message.hasOwnProperty("eventSequenceNo"))
                    if (typeof message.eventSequenceNo === "number")
                        object.eventSequenceNo = options.longs === String ? String(message.eventSequenceNo) : message.eventSequenceNo;
                    else
                        object.eventSequenceNo = options.longs === String ? $util.Long.prototype.toString.call(message.eventSequenceNo) : options.longs === Number ? new $util.LongBits(message.eventSequenceNo.low >>> 0, message.eventSequenceNo.high >>> 0).toNumber(true) : message.eventSequenceNo;
                return object;
            };

            /**
             * Converts this EventWriteResponse to JSON.
             * @function toJSON
             * @memberof market.mass.EventWriteResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            EventWriteResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for EventWriteResponse
             * @function getTypeUrl
             * @memberof market.mass.EventWriteResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            EventWriteResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/market.mass.EventWriteResponse";
            };

            return EventWriteResponse;
        })();

        mass.SyncStatusRequest = (function() {

            /**
             * Properties of a SyncStatusRequest.
             * @memberof market.mass
             * @interface ISyncStatusRequest
             * @property {Uint8Array|null} [requestId] SyncStatusRequest requestId
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
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * SyncStatusRequest requestId.
             * @member {Uint8Array} requestId
             * @memberof market.mass.SyncStatusRequest
             * @instance
             */
            SyncStatusRequest.prototype.requestId = $util.newBuffer([]);

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
                if (message.requestId != null && Object.hasOwnProperty.call(message, "requestId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.requestId);
                if (message.unpushedEvents != null && Object.hasOwnProperty.call(message, "unpushedEvents"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.unpushedEvents);
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
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.SyncStatusRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.requestId = reader.bytes();
                            break;
                        }
                    case 2: {
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
                if (message.requestId != null && message.hasOwnProperty("requestId"))
                    if (!(message.requestId && typeof message.requestId.length === "number" || $util.isString(message.requestId)))
                        return "requestId: buffer expected";
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
                let message = new $root.market.mass.SyncStatusRequest();
                if (object.requestId != null)
                    if (typeof object.requestId === "string")
                        $util.base64.decode(object.requestId, message.requestId = $util.newBuffer($util.base64.length(object.requestId)), 0);
                    else if (object.requestId.length >= 0)
                        message.requestId = object.requestId;
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
                let object = {};
                if (options.defaults) {
                    if (options.bytes === String)
                        object.requestId = "";
                    else {
                        object.requestId = [];
                        if (options.bytes !== Array)
                            object.requestId = $util.newBuffer(object.requestId);
                    }
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.unpushedEvents = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.unpushedEvents = options.longs === String ? "0" : 0;
                }
                if (message.requestId != null && message.hasOwnProperty("requestId"))
                    object.requestId = options.bytes === String ? $util.base64.encode(message.requestId, 0, message.requestId.length) : options.bytes === Array ? Array.prototype.slice.call(message.requestId) : message.requestId;
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

        mass.SyncStatusResponse = (function() {

            /**
             * Properties of a SyncStatusResponse.
             * @memberof market.mass
             * @interface ISyncStatusResponse
             * @property {Uint8Array|null} [requestId] SyncStatusResponse requestId
             * @property {market.mass.IError|null} [error] SyncStatusResponse error
             */

            /**
             * Constructs a new SyncStatusResponse.
             * @memberof market.mass
             * @classdesc Represents a SyncStatusResponse.
             * @implements ISyncStatusResponse
             * @constructor
             * @param {market.mass.ISyncStatusResponse=} [properties] Properties to set
             */
            function SyncStatusResponse(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * SyncStatusResponse requestId.
             * @member {Uint8Array} requestId
             * @memberof market.mass.SyncStatusResponse
             * @instance
             */
            SyncStatusResponse.prototype.requestId = $util.newBuffer([]);

            /**
             * SyncStatusResponse error.
             * @member {market.mass.IError|null|undefined} error
             * @memberof market.mass.SyncStatusResponse
             * @instance
             */
            SyncStatusResponse.prototype.error = null;

            /**
             * Creates a new SyncStatusResponse instance using the specified properties.
             * @function create
             * @memberof market.mass.SyncStatusResponse
             * @static
             * @param {market.mass.ISyncStatusResponse=} [properties] Properties to set
             * @returns {market.mass.SyncStatusResponse} SyncStatusResponse instance
             */
            SyncStatusResponse.create = function create(properties) {
                return new SyncStatusResponse(properties);
            };

            /**
             * Encodes the specified SyncStatusResponse message. Does not implicitly {@link market.mass.SyncStatusResponse.verify|verify} messages.
             * @function encode
             * @memberof market.mass.SyncStatusResponse
             * @static
             * @param {market.mass.ISyncStatusResponse} message SyncStatusResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SyncStatusResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.requestId != null && Object.hasOwnProperty.call(message, "requestId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.requestId);
                if (message.error != null && Object.hasOwnProperty.call(message, "error"))
                    $root.market.mass.Error.encode(message.error, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified SyncStatusResponse message, length delimited. Does not implicitly {@link market.mass.SyncStatusResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof market.mass.SyncStatusResponse
             * @static
             * @param {market.mass.ISyncStatusResponse} message SyncStatusResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SyncStatusResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a SyncStatusResponse message from the specified reader or buffer.
             * @function decode
             * @memberof market.mass.SyncStatusResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {market.mass.SyncStatusResponse} SyncStatusResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SyncStatusResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.SyncStatusResponse();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.requestId = reader.bytes();
                            break;
                        }
                    case 2: {
                            message.error = $root.market.mass.Error.decode(reader, reader.uint32());
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
             * Decodes a SyncStatusResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof market.mass.SyncStatusResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {market.mass.SyncStatusResponse} SyncStatusResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SyncStatusResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a SyncStatusResponse message.
             * @function verify
             * @memberof market.mass.SyncStatusResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SyncStatusResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.requestId != null && message.hasOwnProperty("requestId"))
                    if (!(message.requestId && typeof message.requestId.length === "number" || $util.isString(message.requestId)))
                        return "requestId: buffer expected";
                if (message.error != null && message.hasOwnProperty("error")) {
                    let error = $root.market.mass.Error.verify(message.error);
                    if (error)
                        return "error." + error;
                }
                return null;
            };

            /**
             * Creates a SyncStatusResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof market.mass.SyncStatusResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {market.mass.SyncStatusResponse} SyncStatusResponse
             */
            SyncStatusResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.market.mass.SyncStatusResponse)
                    return object;
                let message = new $root.market.mass.SyncStatusResponse();
                if (object.requestId != null)
                    if (typeof object.requestId === "string")
                        $util.base64.decode(object.requestId, message.requestId = $util.newBuffer($util.base64.length(object.requestId)), 0);
                    else if (object.requestId.length >= 0)
                        message.requestId = object.requestId;
                if (object.error != null) {
                    if (typeof object.error !== "object")
                        throw TypeError(".market.mass.SyncStatusResponse.error: object expected");
                    message.error = $root.market.mass.Error.fromObject(object.error);
                }
                return message;
            };

            /**
             * Creates a plain object from a SyncStatusResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof market.mass.SyncStatusResponse
             * @static
             * @param {market.mass.SyncStatusResponse} message SyncStatusResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SyncStatusResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    if (options.bytes === String)
                        object.requestId = "";
                    else {
                        object.requestId = [];
                        if (options.bytes !== Array)
                            object.requestId = $util.newBuffer(object.requestId);
                    }
                    object.error = null;
                }
                if (message.requestId != null && message.hasOwnProperty("requestId"))
                    object.requestId = options.bytes === String ? $util.base64.encode(message.requestId, 0, message.requestId.length) : options.bytes === Array ? Array.prototype.slice.call(message.requestId) : message.requestId;
                if (message.error != null && message.hasOwnProperty("error"))
                    object.error = $root.market.mass.Error.toObject(message.error, options);
                return object;
            };

            /**
             * Converts this SyncStatusResponse to JSON.
             * @function toJSON
             * @memberof market.mass.SyncStatusResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SyncStatusResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for SyncStatusResponse
             * @function getTypeUrl
             * @memberof market.mass.SyncStatusResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            SyncStatusResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/market.mass.SyncStatusResponse";
            };

            return SyncStatusResponse;
        })();

        mass.EventPushRequest = (function() {

            /**
             * Properties of an EventPushRequest.
             * @memberof market.mass
             * @interface IEventPushRequest
             * @property {Uint8Array|null} [requestId] EventPushRequest requestId
             * @property {Array.<market.mass.IEvent>|null} [events] EventPushRequest events
             */

            /**
             * Constructs a new EventPushRequest.
             * @memberof market.mass
             * @classdesc Represents an EventPushRequest.
             * @implements IEventPushRequest
             * @constructor
             * @param {market.mass.IEventPushRequest=} [properties] Properties to set
             */
            function EventPushRequest(properties) {
                this.events = [];
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * EventPushRequest requestId.
             * @member {Uint8Array} requestId
             * @memberof market.mass.EventPushRequest
             * @instance
             */
            EventPushRequest.prototype.requestId = $util.newBuffer([]);

            /**
             * EventPushRequest events.
             * @member {Array.<market.mass.IEvent>} events
             * @memberof market.mass.EventPushRequest
             * @instance
             */
            EventPushRequest.prototype.events = $util.emptyArray;

            /**
             * Creates a new EventPushRequest instance using the specified properties.
             * @function create
             * @memberof market.mass.EventPushRequest
             * @static
             * @param {market.mass.IEventPushRequest=} [properties] Properties to set
             * @returns {market.mass.EventPushRequest} EventPushRequest instance
             */
            EventPushRequest.create = function create(properties) {
                return new EventPushRequest(properties);
            };

            /**
             * Encodes the specified EventPushRequest message. Does not implicitly {@link market.mass.EventPushRequest.verify|verify} messages.
             * @function encode
             * @memberof market.mass.EventPushRequest
             * @static
             * @param {market.mass.IEventPushRequest} message EventPushRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            EventPushRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.requestId != null && Object.hasOwnProperty.call(message, "requestId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.requestId);
                if (message.events != null && message.events.length)
                    for (let i = 0; i < message.events.length; ++i)
                        $root.market.mass.Event.encode(message.events[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified EventPushRequest message, length delimited. Does not implicitly {@link market.mass.EventPushRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof market.mass.EventPushRequest
             * @static
             * @param {market.mass.IEventPushRequest} message EventPushRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            EventPushRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an EventPushRequest message from the specified reader or buffer.
             * @function decode
             * @memberof market.mass.EventPushRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {market.mass.EventPushRequest} EventPushRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            EventPushRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.EventPushRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.requestId = reader.bytes();
                            break;
                        }
                    case 2: {
                            if (!(message.events && message.events.length))
                                message.events = [];
                            message.events.push($root.market.mass.Event.decode(reader, reader.uint32()));
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
             * Decodes an EventPushRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof market.mass.EventPushRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {market.mass.EventPushRequest} EventPushRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            EventPushRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an EventPushRequest message.
             * @function verify
             * @memberof market.mass.EventPushRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            EventPushRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.requestId != null && message.hasOwnProperty("requestId"))
                    if (!(message.requestId && typeof message.requestId.length === "number" || $util.isString(message.requestId)))
                        return "requestId: buffer expected";
                if (message.events != null && message.hasOwnProperty("events")) {
                    if (!Array.isArray(message.events))
                        return "events: array expected";
                    for (let i = 0; i < message.events.length; ++i) {
                        let error = $root.market.mass.Event.verify(message.events[i]);
                        if (error)
                            return "events." + error;
                    }
                }
                return null;
            };

            /**
             * Creates an EventPushRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof market.mass.EventPushRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {market.mass.EventPushRequest} EventPushRequest
             */
            EventPushRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.market.mass.EventPushRequest)
                    return object;
                let message = new $root.market.mass.EventPushRequest();
                if (object.requestId != null)
                    if (typeof object.requestId === "string")
                        $util.base64.decode(object.requestId, message.requestId = $util.newBuffer($util.base64.length(object.requestId)), 0);
                    else if (object.requestId.length >= 0)
                        message.requestId = object.requestId;
                if (object.events) {
                    if (!Array.isArray(object.events))
                        throw TypeError(".market.mass.EventPushRequest.events: array expected");
                    message.events = [];
                    for (let i = 0; i < object.events.length; ++i) {
                        if (typeof object.events[i] !== "object")
                            throw TypeError(".market.mass.EventPushRequest.events: object expected");
                        message.events[i] = $root.market.mass.Event.fromObject(object.events[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from an EventPushRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof market.mass.EventPushRequest
             * @static
             * @param {market.mass.EventPushRequest} message EventPushRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            EventPushRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.arrays || options.defaults)
                    object.events = [];
                if (options.defaults)
                    if (options.bytes === String)
                        object.requestId = "";
                    else {
                        object.requestId = [];
                        if (options.bytes !== Array)
                            object.requestId = $util.newBuffer(object.requestId);
                    }
                if (message.requestId != null && message.hasOwnProperty("requestId"))
                    object.requestId = options.bytes === String ? $util.base64.encode(message.requestId, 0, message.requestId.length) : options.bytes === Array ? Array.prototype.slice.call(message.requestId) : message.requestId;
                if (message.events && message.events.length) {
                    object.events = [];
                    for (let j = 0; j < message.events.length; ++j)
                        object.events[j] = $root.market.mass.Event.toObject(message.events[j], options);
                }
                return object;
            };

            /**
             * Converts this EventPushRequest to JSON.
             * @function toJSON
             * @memberof market.mass.EventPushRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            EventPushRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for EventPushRequest
             * @function getTypeUrl
             * @memberof market.mass.EventPushRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            EventPushRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/market.mass.EventPushRequest";
            };

            return EventPushRequest;
        })();

        mass.EventPushResponse = (function() {

            /**
             * Properties of an EventPushResponse.
             * @memberof market.mass
             * @interface IEventPushResponse
             * @property {Uint8Array|null} [requestId] EventPushResponse requestId
             * @property {market.mass.IError|null} [error] EventPushResponse error
             */

            /**
             * Constructs a new EventPushResponse.
             * @memberof market.mass
             * @classdesc Represents an EventPushResponse.
             * @implements IEventPushResponse
             * @constructor
             * @param {market.mass.IEventPushResponse=} [properties] Properties to set
             */
            function EventPushResponse(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * EventPushResponse requestId.
             * @member {Uint8Array} requestId
             * @memberof market.mass.EventPushResponse
             * @instance
             */
            EventPushResponse.prototype.requestId = $util.newBuffer([]);

            /**
             * EventPushResponse error.
             * @member {market.mass.IError|null|undefined} error
             * @memberof market.mass.EventPushResponse
             * @instance
             */
            EventPushResponse.prototype.error = null;

            /**
             * Creates a new EventPushResponse instance using the specified properties.
             * @function create
             * @memberof market.mass.EventPushResponse
             * @static
             * @param {market.mass.IEventPushResponse=} [properties] Properties to set
             * @returns {market.mass.EventPushResponse} EventPushResponse instance
             */
            EventPushResponse.create = function create(properties) {
                return new EventPushResponse(properties);
            };

            /**
             * Encodes the specified EventPushResponse message. Does not implicitly {@link market.mass.EventPushResponse.verify|verify} messages.
             * @function encode
             * @memberof market.mass.EventPushResponse
             * @static
             * @param {market.mass.IEventPushResponse} message EventPushResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            EventPushResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.requestId != null && Object.hasOwnProperty.call(message, "requestId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.requestId);
                if (message.error != null && Object.hasOwnProperty.call(message, "error"))
                    $root.market.mass.Error.encode(message.error, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified EventPushResponse message, length delimited. Does not implicitly {@link market.mass.EventPushResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof market.mass.EventPushResponse
             * @static
             * @param {market.mass.IEventPushResponse} message EventPushResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            EventPushResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an EventPushResponse message from the specified reader or buffer.
             * @function decode
             * @memberof market.mass.EventPushResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {market.mass.EventPushResponse} EventPushResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            EventPushResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.EventPushResponse();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.requestId = reader.bytes();
                            break;
                        }
                    case 2: {
                            message.error = $root.market.mass.Error.decode(reader, reader.uint32());
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
             * Decodes an EventPushResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof market.mass.EventPushResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {market.mass.EventPushResponse} EventPushResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            EventPushResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an EventPushResponse message.
             * @function verify
             * @memberof market.mass.EventPushResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            EventPushResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.requestId != null && message.hasOwnProperty("requestId"))
                    if (!(message.requestId && typeof message.requestId.length === "number" || $util.isString(message.requestId)))
                        return "requestId: buffer expected";
                if (message.error != null && message.hasOwnProperty("error")) {
                    let error = $root.market.mass.Error.verify(message.error);
                    if (error)
                        return "error." + error;
                }
                return null;
            };

            /**
             * Creates an EventPushResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof market.mass.EventPushResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {market.mass.EventPushResponse} EventPushResponse
             */
            EventPushResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.market.mass.EventPushResponse)
                    return object;
                let message = new $root.market.mass.EventPushResponse();
                if (object.requestId != null)
                    if (typeof object.requestId === "string")
                        $util.base64.decode(object.requestId, message.requestId = $util.newBuffer($util.base64.length(object.requestId)), 0);
                    else if (object.requestId.length >= 0)
                        message.requestId = object.requestId;
                if (object.error != null) {
                    if (typeof object.error !== "object")
                        throw TypeError(".market.mass.EventPushResponse.error: object expected");
                    message.error = $root.market.mass.Error.fromObject(object.error);
                }
                return message;
            };

            /**
             * Creates a plain object from an EventPushResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof market.mass.EventPushResponse
             * @static
             * @param {market.mass.EventPushResponse} message EventPushResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            EventPushResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    if (options.bytes === String)
                        object.requestId = "";
                    else {
                        object.requestId = [];
                        if (options.bytes !== Array)
                            object.requestId = $util.newBuffer(object.requestId);
                    }
                    object.error = null;
                }
                if (message.requestId != null && message.hasOwnProperty("requestId"))
                    object.requestId = options.bytes === String ? $util.base64.encode(message.requestId, 0, message.requestId.length) : options.bytes === Array ? Array.prototype.slice.call(message.requestId) : message.requestId;
                if (message.error != null && message.hasOwnProperty("error"))
                    object.error = $root.market.mass.Error.toObject(message.error, options);
                return object;
            };

            /**
             * Converts this EventPushResponse to JSON.
             * @function toJSON
             * @memberof market.mass.EventPushResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            EventPushResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for EventPushResponse
             * @function getTypeUrl
             * @memberof market.mass.EventPushResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            EventPushResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/market.mass.EventPushResponse";
            };

            return EventPushResponse;
        })();

        mass.PingRequest = (function() {

            /**
             * Properties of a PingRequest.
             * @memberof market.mass
             * @interface IPingRequest
             * @property {Uint8Array|null} [requestId] PingRequest requestId
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
             * PingRequest requestId.
             * @member {Uint8Array} requestId
             * @memberof market.mass.PingRequest
             * @instance
             */
            PingRequest.prototype.requestId = $util.newBuffer([]);

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
                if (message.requestId != null && Object.hasOwnProperty.call(message, "requestId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.requestId);
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
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.PingRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.requestId = reader.bytes();
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
                if (message.requestId != null && message.hasOwnProperty("requestId"))
                    if (!(message.requestId && typeof message.requestId.length === "number" || $util.isString(message.requestId)))
                        return "requestId: buffer expected";
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
                let message = new $root.market.mass.PingRequest();
                if (object.requestId != null)
                    if (typeof object.requestId === "string")
                        $util.base64.decode(object.requestId, message.requestId = $util.newBuffer($util.base64.length(object.requestId)), 0);
                    else if (object.requestId.length >= 0)
                        message.requestId = object.requestId;
                return message;
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
            PingRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    if (options.bytes === String)
                        object.requestId = "";
                    else {
                        object.requestId = [];
                        if (options.bytes !== Array)
                            object.requestId = $util.newBuffer(object.requestId);
                    }
                if (message.requestId != null && message.hasOwnProperty("requestId"))
                    object.requestId = options.bytes === String ? $util.base64.encode(message.requestId, 0, message.requestId.length) : options.bytes === Array ? Array.prototype.slice.call(message.requestId) : message.requestId;
                return object;
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

        mass.PingResponse = (function() {

            /**
             * Properties of a PingResponse.
             * @memberof market.mass
             * @interface IPingResponse
             * @property {Uint8Array|null} [requestId] PingResponse requestId
             * @property {market.mass.IError|null} [error] PingResponse error
             */

            /**
             * Constructs a new PingResponse.
             * @memberof market.mass
             * @classdesc Represents a PingResponse.
             * @implements IPingResponse
             * @constructor
             * @param {market.mass.IPingResponse=} [properties] Properties to set
             */
            function PingResponse(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * PingResponse requestId.
             * @member {Uint8Array} requestId
             * @memberof market.mass.PingResponse
             * @instance
             */
            PingResponse.prototype.requestId = $util.newBuffer([]);

            /**
             * PingResponse error.
             * @member {market.mass.IError|null|undefined} error
             * @memberof market.mass.PingResponse
             * @instance
             */
            PingResponse.prototype.error = null;

            /**
             * Creates a new PingResponse instance using the specified properties.
             * @function create
             * @memberof market.mass.PingResponse
             * @static
             * @param {market.mass.IPingResponse=} [properties] Properties to set
             * @returns {market.mass.PingResponse} PingResponse instance
             */
            PingResponse.create = function create(properties) {
                return new PingResponse(properties);
            };

            /**
             * Encodes the specified PingResponse message. Does not implicitly {@link market.mass.PingResponse.verify|verify} messages.
             * @function encode
             * @memberof market.mass.PingResponse
             * @static
             * @param {market.mass.IPingResponse} message PingResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PingResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.requestId != null && Object.hasOwnProperty.call(message, "requestId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.requestId);
                if (message.error != null && Object.hasOwnProperty.call(message, "error"))
                    $root.market.mass.Error.encode(message.error, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified PingResponse message, length delimited. Does not implicitly {@link market.mass.PingResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof market.mass.PingResponse
             * @static
             * @param {market.mass.IPingResponse} message PingResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PingResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a PingResponse message from the specified reader or buffer.
             * @function decode
             * @memberof market.mass.PingResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {market.mass.PingResponse} PingResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PingResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.PingResponse();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.requestId = reader.bytes();
                            break;
                        }
                    case 2: {
                            message.error = $root.market.mass.Error.decode(reader, reader.uint32());
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
             * Decodes a PingResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof market.mass.PingResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {market.mass.PingResponse} PingResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PingResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a PingResponse message.
             * @function verify
             * @memberof market.mass.PingResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            PingResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.requestId != null && message.hasOwnProperty("requestId"))
                    if (!(message.requestId && typeof message.requestId.length === "number" || $util.isString(message.requestId)))
                        return "requestId: buffer expected";
                if (message.error != null && message.hasOwnProperty("error")) {
                    let error = $root.market.mass.Error.verify(message.error);
                    if (error)
                        return "error." + error;
                }
                return null;
            };

            /**
             * Creates a PingResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof market.mass.PingResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {market.mass.PingResponse} PingResponse
             */
            PingResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.market.mass.PingResponse)
                    return object;
                let message = new $root.market.mass.PingResponse();
                if (object.requestId != null)
                    if (typeof object.requestId === "string")
                        $util.base64.decode(object.requestId, message.requestId = $util.newBuffer($util.base64.length(object.requestId)), 0);
                    else if (object.requestId.length >= 0)
                        message.requestId = object.requestId;
                if (object.error != null) {
                    if (typeof object.error !== "object")
                        throw TypeError(".market.mass.PingResponse.error: object expected");
                    message.error = $root.market.mass.Error.fromObject(object.error);
                }
                return message;
            };

            /**
             * Creates a plain object from a PingResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof market.mass.PingResponse
             * @static
             * @param {market.mass.PingResponse} message PingResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            PingResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    if (options.bytes === String)
                        object.requestId = "";
                    else {
                        object.requestId = [];
                        if (options.bytes !== Array)
                            object.requestId = $util.newBuffer(object.requestId);
                    }
                    object.error = null;
                }
                if (message.requestId != null && message.hasOwnProperty("requestId"))
                    object.requestId = options.bytes === String ? $util.base64.encode(message.requestId, 0, message.requestId.length) : options.bytes === Array ? Array.prototype.slice.call(message.requestId) : message.requestId;
                if (message.error != null && message.hasOwnProperty("error"))
                    object.error = $root.market.mass.Error.toObject(message.error, options);
                return object;
            };

            /**
             * Converts this PingResponse to JSON.
             * @function toJSON
             * @memberof market.mass.PingResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            PingResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for PingResponse
             * @function getTypeUrl
             * @memberof market.mass.PingResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            PingResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/market.mass.PingResponse";
            };

            return PingResponse;
        })();

        mass.Error = (function() {

            /**
             * Properties of an Error.
             * @memberof market.mass
             * @interface IError
             * @property {string|null} [code] Error code
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
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Error code.
             * @member {string} code
             * @memberof market.mass.Error
             * @instance
             */
            Error.prototype.code = "";

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
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.code);
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
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.market.mass.Error();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.code = reader.string();
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
                    if (!$util.isString(message.code))
                        return "code: string expected";
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
                let message = new $root.market.mass.Error();
                if (object.code != null)
                    message.code = String(object.code);
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
                let object = {};
                if (options.defaults) {
                    object.code = "";
                    object.message = "";
                }
                if (message.code != null && message.hasOwnProperty("code"))
                    object.code = message.code;
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

        return mass;
    })();

    return market;
})();

export { $root as default };
