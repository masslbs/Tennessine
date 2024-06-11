/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/minimal";

// Common aliases
const $Reader = $protobuf.Reader,
  $Writer = $protobuf.Writer,
  $util = $protobuf.util;

// Exported root namespace
const $root =
  $protobuf.roots["market.mass"] || ($protobuf.roots["market.mass"] = {});

export const market = ($root.market = (() => {
  /**
   * Namespace market.
   * @exports market
   * @namespace
   */
  const market = {};

  market.mass = (function () {
    /**
     * Namespace mass.
     * @memberof market
     * @namespace
     */
    const mass = {};

    mass.AuthenticateRequest = (function () {
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
        if (!writer) writer = $Writer.create();
        if (
          message.requestId != null &&
          Object.hasOwnProperty.call(message, "requestId")
        )
          writer.uint32(/* id 1, wireType 2 =*/ 10).bytes(message.requestId);
        if (
          message.publicKey != null &&
          Object.hasOwnProperty.call(message, "publicKey")
        )
          writer.uint32(/* id 2, wireType 2 =*/ 18).bytes(message.publicKey);
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
      AuthenticateRequest.encodeDelimited = function encodeDelimited(
        message,
        writer,
      ) {
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
        if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length,
          message = new $root.market.mass.AuthenticateRequest();
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
        if (!(reader instanceof $Reader)) reader = new $Reader(reader);
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
          if (
            !(
              (message.requestId &&
                typeof message.requestId.length === "number") ||
              $util.isString(message.requestId)
            )
          )
            return "requestId: buffer expected";
        if (message.publicKey != null && message.hasOwnProperty("publicKey"))
          if (
            !(
              (message.publicKey &&
                typeof message.publicKey.length === "number") ||
              $util.isString(message.publicKey)
            )
          )
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
            $util.base64.decode(
              object.requestId,
              (message.requestId = $util.newBuffer(
                $util.base64.length(object.requestId),
              )),
              0,
            );
          else if (object.requestId.length >= 0)
            message.requestId = object.requestId;
        if (object.publicKey != null)
          if (typeof object.publicKey === "string")
            $util.base64.decode(
              object.publicKey,
              (message.publicKey = $util.newBuffer(
                $util.base64.length(object.publicKey),
              )),
              0,
            );
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
        if (!options) options = {};
        let object = {};
        if (options.defaults) {
          if (options.bytes === String) object.requestId = "";
          else {
            object.requestId = [];
            if (options.bytes !== Array)
              object.requestId = $util.newBuffer(object.requestId);
          }
          if (options.bytes === String) object.publicKey = "";
          else {
            object.publicKey = [];
            if (options.bytes !== Array)
              object.publicKey = $util.newBuffer(object.publicKey);
          }
        }
        if (message.requestId != null && message.hasOwnProperty("requestId"))
          object.requestId =
            options.bytes === String
              ? $util.base64.encode(
                  message.requestId,
                  0,
                  message.requestId.length,
                )
              : options.bytes === Array
                ? Array.prototype.slice.call(message.requestId)
                : message.requestId;
        if (message.publicKey != null && message.hasOwnProperty("publicKey"))
          object.publicKey =
            options.bytes === String
              ? $util.base64.encode(
                  message.publicKey,
                  0,
                  message.publicKey.length,
                )
              : options.bytes === Array
                ? Array.prototype.slice.call(message.publicKey)
                : message.publicKey;
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

    mass.AuthenticateResponse = (function () {
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
        if (!writer) writer = $Writer.create();
        if (
          message.requestId != null &&
          Object.hasOwnProperty.call(message, "requestId")
        )
          writer.uint32(/* id 1, wireType 2 =*/ 10).bytes(message.requestId);
        if (
          message.error != null &&
          Object.hasOwnProperty.call(message, "error")
        )
          $root.market.mass.Error.encode(
            message.error,
            writer.uint32(/* id 2, wireType 2 =*/ 18).fork(),
          ).ldelim();
        if (
          message.challenge != null &&
          Object.hasOwnProperty.call(message, "challenge")
        )
          writer.uint32(/* id 3, wireType 2 =*/ 26).bytes(message.challenge);
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
      AuthenticateResponse.encodeDelimited = function encodeDelimited(
        message,
        writer,
      ) {
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
        if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length,
          message = new $root.market.mass.AuthenticateResponse();
        while (reader.pos < end) {
          let tag = reader.uint32();
          switch (tag >>> 3) {
            case 1: {
              message.requestId = reader.bytes();
              break;
            }
            case 2: {
              message.error = $root.market.mass.Error.decode(
                reader,
                reader.uint32(),
              );
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
        if (!(reader instanceof $Reader)) reader = new $Reader(reader);
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
          if (
            !(
              (message.requestId &&
                typeof message.requestId.length === "number") ||
              $util.isString(message.requestId)
            )
          )
            return "requestId: buffer expected";
        if (message.error != null && message.hasOwnProperty("error")) {
          let error = $root.market.mass.Error.verify(message.error);
          if (error) return "error." + error;
        }
        if (message.challenge != null && message.hasOwnProperty("challenge"))
          if (
            !(
              (message.challenge &&
                typeof message.challenge.length === "number") ||
              $util.isString(message.challenge)
            )
          )
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
            $util.base64.decode(
              object.requestId,
              (message.requestId = $util.newBuffer(
                $util.base64.length(object.requestId),
              )),
              0,
            );
          else if (object.requestId.length >= 0)
            message.requestId = object.requestId;
        if (object.error != null) {
          if (typeof object.error !== "object")
            throw TypeError(
              ".market.mass.AuthenticateResponse.error: object expected",
            );
          message.error = $root.market.mass.Error.fromObject(object.error);
        }
        if (object.challenge != null)
          if (typeof object.challenge === "string")
            $util.base64.decode(
              object.challenge,
              (message.challenge = $util.newBuffer(
                $util.base64.length(object.challenge),
              )),
              0,
            );
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
        if (!options) options = {};
        let object = {};
        if (options.defaults) {
          if (options.bytes === String) object.requestId = "";
          else {
            object.requestId = [];
            if (options.bytes !== Array)
              object.requestId = $util.newBuffer(object.requestId);
          }
          object.error = null;
          if (options.bytes === String) object.challenge = "";
          else {
            object.challenge = [];
            if (options.bytes !== Array)
              object.challenge = $util.newBuffer(object.challenge);
          }
        }
        if (message.requestId != null && message.hasOwnProperty("requestId"))
          object.requestId =
            options.bytes === String
              ? $util.base64.encode(
                  message.requestId,
                  0,
                  message.requestId.length,
                )
              : options.bytes === Array
                ? Array.prototype.slice.call(message.requestId)
                : message.requestId;
        if (message.error != null && message.hasOwnProperty("error"))
          object.error = $root.market.mass.Error.toObject(
            message.error,
            options,
          );
        if (message.challenge != null && message.hasOwnProperty("challenge"))
          object.challenge =
            options.bytes === String
              ? $util.base64.encode(
                  message.challenge,
                  0,
                  message.challenge.length,
                )
              : options.bytes === Array
                ? Array.prototype.slice.call(message.challenge)
                : message.challenge;
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

    mass.ChallengeSolvedRequest = (function () {
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
        if (!writer) writer = $Writer.create();
        if (
          message.requestId != null &&
          Object.hasOwnProperty.call(message, "requestId")
        )
          writer.uint32(/* id 1, wireType 2 =*/ 10).bytes(message.requestId);
        if (
          message.signature != null &&
          Object.hasOwnProperty.call(message, "signature")
        )
          writer.uint32(/* id 2, wireType 2 =*/ 18).bytes(message.signature);
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
      ChallengeSolvedRequest.encodeDelimited = function encodeDelimited(
        message,
        writer,
      ) {
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
        if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length,
          message = new $root.market.mass.ChallengeSolvedRequest();
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
      ChallengeSolvedRequest.decodeDelimited = function decodeDelimited(
        reader,
      ) {
        if (!(reader instanceof $Reader)) reader = new $Reader(reader);
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
          if (
            !(
              (message.requestId &&
                typeof message.requestId.length === "number") ||
              $util.isString(message.requestId)
            )
          )
            return "requestId: buffer expected";
        if (message.signature != null && message.hasOwnProperty("signature"))
          if (
            !(
              (message.signature &&
                typeof message.signature.length === "number") ||
              $util.isString(message.signature)
            )
          )
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
            $util.base64.decode(
              object.requestId,
              (message.requestId = $util.newBuffer(
                $util.base64.length(object.requestId),
              )),
              0,
            );
          else if (object.requestId.length >= 0)
            message.requestId = object.requestId;
        if (object.signature != null)
          if (typeof object.signature === "string")
            $util.base64.decode(
              object.signature,
              (message.signature = $util.newBuffer(
                $util.base64.length(object.signature),
              )),
              0,
            );
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
        if (!options) options = {};
        let object = {};
        if (options.defaults) {
          if (options.bytes === String) object.requestId = "";
          else {
            object.requestId = [];
            if (options.bytes !== Array)
              object.requestId = $util.newBuffer(object.requestId);
          }
          if (options.bytes === String) object.signature = "";
          else {
            object.signature = [];
            if (options.bytes !== Array)
              object.signature = $util.newBuffer(object.signature);
          }
        }
        if (message.requestId != null && message.hasOwnProperty("requestId"))
          object.requestId =
            options.bytes === String
              ? $util.base64.encode(
                  message.requestId,
                  0,
                  message.requestId.length,
                )
              : options.bytes === Array
                ? Array.prototype.slice.call(message.requestId)
                : message.requestId;
        if (message.signature != null && message.hasOwnProperty("signature"))
          object.signature =
            options.bytes === String
              ? $util.base64.encode(
                  message.signature,
                  0,
                  message.signature.length,
                )
              : options.bytes === Array
                ? Array.prototype.slice.call(message.signature)
                : message.signature;
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

    mass.ChallengeSolvedResponse = (function () {
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
        if (!writer) writer = $Writer.create();
        if (
          message.requestId != null &&
          Object.hasOwnProperty.call(message, "requestId")
        )
          writer.uint32(/* id 1, wireType 2 =*/ 10).bytes(message.requestId);
        if (
          message.error != null &&
          Object.hasOwnProperty.call(message, "error")
        )
          $root.market.mass.Error.encode(
            message.error,
            writer.uint32(/* id 2, wireType 2 =*/ 18).fork(),
          ).ldelim();
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
      ChallengeSolvedResponse.encodeDelimited = function encodeDelimited(
        message,
        writer,
      ) {
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
        if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length,
          message = new $root.market.mass.ChallengeSolvedResponse();
        while (reader.pos < end) {
          let tag = reader.uint32();
          switch (tag >>> 3) {
            case 1: {
              message.requestId = reader.bytes();
              break;
            }
            case 2: {
              message.error = $root.market.mass.Error.decode(
                reader,
                reader.uint32(),
              );
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
      ChallengeSolvedResponse.decodeDelimited = function decodeDelimited(
        reader,
      ) {
        if (!(reader instanceof $Reader)) reader = new $Reader(reader);
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
          if (
            !(
              (message.requestId &&
                typeof message.requestId.length === "number") ||
              $util.isString(message.requestId)
            )
          )
            return "requestId: buffer expected";
        if (message.error != null && message.hasOwnProperty("error")) {
          let error = $root.market.mass.Error.verify(message.error);
          if (error) return "error." + error;
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
            $util.base64.decode(
              object.requestId,
              (message.requestId = $util.newBuffer(
                $util.base64.length(object.requestId),
              )),
              0,
            );
          else if (object.requestId.length >= 0)
            message.requestId = object.requestId;
        if (object.error != null) {
          if (typeof object.error !== "object")
            throw TypeError(
              ".market.mass.ChallengeSolvedResponse.error: object expected",
            );
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
        if (!options) options = {};
        let object = {};
        if (options.defaults) {
          if (options.bytes === String) object.requestId = "";
          else {
            object.requestId = [];
            if (options.bytes !== Array)
              object.requestId = $util.newBuffer(object.requestId);
          }
          object.error = null;
        }
        if (message.requestId != null && message.hasOwnProperty("requestId"))
          object.requestId =
            options.bytes === String
              ? $util.base64.encode(
                  message.requestId,
                  0,
                  message.requestId.length,
                )
              : options.bytes === Array
                ? Array.prototype.slice.call(message.requestId)
                : message.requestId;
        if (message.error != null && message.hasOwnProperty("error"))
          object.error = $root.market.mass.Error.toObject(
            message.error,
            options,
          );
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

    mass.Error = (function () {
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
        if (!writer) writer = $Writer.create();
        if (message.code != null && Object.hasOwnProperty.call(message, "code"))
          writer.uint32(/* id 1, wireType 0 =*/ 8).int32(message.code);
        if (
          message.message != null &&
          Object.hasOwnProperty.call(message, "message")
        )
          writer.uint32(/* id 2, wireType 2 =*/ 18).string(message.message);
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
        if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length,
          message = new $root.market.mass.Error();
        while (reader.pos < end) {
          let tag = reader.uint32();
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
        if (!(reader instanceof $Reader)) reader = new $Reader(reader);
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
        if (object instanceof $root.market.mass.Error) return object;
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
        }
        if (object.message != null) message.message = String(object.message);
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
        if (!options) options = {};
        let object = {};
        if (options.defaults) {
          object.code =
            options.enums === String ? "ERROR_CODES_UNSPECIFIED" : 0;
          object.message = "";
        }
        if (message.code != null && message.hasOwnProperty("code"))
          object.code =
            options.enums === String
              ? $root.market.mass.ErrorCodes[message.code] === undefined
                ? message.code
                : $root.market.mass.ErrorCodes[message.code]
              : message.code;
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
     */
    mass.ErrorCodes = (function () {
      const valuesById = {},
        values = Object.create(valuesById);
      values[(valuesById[0] = "ERROR_CODES_UNSPECIFIED")] = 0;
      values[(valuesById[1] = "ERROR_CODES_NOT_FOUND")] = 1;
      values[(valuesById[2] = "ERROR_CODES_INVALID")] = 2;
      values[(valuesById[3] = "ERROR_CODES_NOT_AUTHENTICATED")] = 3;
      values[(valuesById[4] = "ERROR_CODES_ALREADY_AUTHENTICATED")] = 4;
      values[(valuesById[5] = "ERROR_CODES_ALREADY_CONNECTED")] = 5;
      values[(valuesById[6] = "ERROR_CODES_TOO_MANY_CONCURRENT_REQUESTS")] = 6;
      values[(valuesById[7] = "ERROR_CODES_UNLINKED_KEYCARD")] = 7;
      values[(valuesById[8] = "ERROR_CODES_MINUMUM_VERSION_NOT_REACHED")] = 8;
      values[(valuesById[9] = "ERROR_CODES_OUT_OF_STOCK")] = 9;
      values[(valuesById[10] = "ERROR_CODES_SIMULATED")] = 10;
      return values;
    })();

    mass.StoreManifest = (function () {
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
        if (!writer) writer = $Writer.create();
        if (
          message.eventId != null &&
          Object.hasOwnProperty.call(message, "eventId")
        )
          writer.uint32(/* id 1, wireType 2 =*/ 10).bytes(message.eventId);
        if (
          message.storeTokenId != null &&
          Object.hasOwnProperty.call(message, "storeTokenId")
        )
          writer.uint32(/* id 2, wireType 2 =*/ 18).bytes(message.storeTokenId);
        if (
          message.domain != null &&
          Object.hasOwnProperty.call(message, "domain")
        )
          writer.uint32(/* id 3, wireType 2 =*/ 26).string(message.domain);
        if (
          message.publishedTagId != null &&
          Object.hasOwnProperty.call(message, "publishedTagId")
        )
          writer
            .uint32(/* id 4, wireType 2 =*/ 34)
            .bytes(message.publishedTagId);
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
      StoreManifest.encodeDelimited = function encodeDelimited(
        message,
        writer,
      ) {
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
        if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length,
          message = new $root.market.mass.StoreManifest();
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
        if (!(reader instanceof $Reader)) reader = new $Reader(reader);
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
          if (
            !(
              (message.eventId && typeof message.eventId.length === "number") ||
              $util.isString(message.eventId)
            )
          )
            return "eventId: buffer expected";
        if (
          message.storeTokenId != null &&
          message.hasOwnProperty("storeTokenId")
        )
          if (
            !(
              (message.storeTokenId &&
                typeof message.storeTokenId.length === "number") ||
              $util.isString(message.storeTokenId)
            )
          )
            return "storeTokenId: buffer expected";
        if (message.domain != null && message.hasOwnProperty("domain"))
          if (!$util.isString(message.domain)) return "domain: string expected";
        if (
          message.publishedTagId != null &&
          message.hasOwnProperty("publishedTagId")
        )
          if (
            !(
              (message.publishedTagId &&
                typeof message.publishedTagId.length === "number") ||
              $util.isString(message.publishedTagId)
            )
          )
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
        if (object instanceof $root.market.mass.StoreManifest) return object;
        let message = new $root.market.mass.StoreManifest();
        if (object.eventId != null)
          if (typeof object.eventId === "string")
            $util.base64.decode(
              object.eventId,
              (message.eventId = $util.newBuffer(
                $util.base64.length(object.eventId),
              )),
              0,
            );
          else if (object.eventId.length >= 0) message.eventId = object.eventId;
        if (object.storeTokenId != null)
          if (typeof object.storeTokenId === "string")
            $util.base64.decode(
              object.storeTokenId,
              (message.storeTokenId = $util.newBuffer(
                $util.base64.length(object.storeTokenId),
              )),
              0,
            );
          else if (object.storeTokenId.length >= 0)
            message.storeTokenId = object.storeTokenId;
        if (object.domain != null) message.domain = String(object.domain);
        if (object.publishedTagId != null)
          if (typeof object.publishedTagId === "string")
            $util.base64.decode(
              object.publishedTagId,
              (message.publishedTagId = $util.newBuffer(
                $util.base64.length(object.publishedTagId),
              )),
              0,
            );
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
        if (!options) options = {};
        let object = {};
        if (options.defaults) {
          if (options.bytes === String) object.eventId = "";
          else {
            object.eventId = [];
            if (options.bytes !== Array)
              object.eventId = $util.newBuffer(object.eventId);
          }
          if (options.bytes === String) object.storeTokenId = "";
          else {
            object.storeTokenId = [];
            if (options.bytes !== Array)
              object.storeTokenId = $util.newBuffer(object.storeTokenId);
          }
          object.domain = "";
          if (options.bytes === String) object.publishedTagId = "";
          else {
            object.publishedTagId = [];
            if (options.bytes !== Array)
              object.publishedTagId = $util.newBuffer(object.publishedTagId);
          }
        }
        if (message.eventId != null && message.hasOwnProperty("eventId"))
          object.eventId =
            options.bytes === String
              ? $util.base64.encode(message.eventId, 0, message.eventId.length)
              : options.bytes === Array
                ? Array.prototype.slice.call(message.eventId)
                : message.eventId;
        if (
          message.storeTokenId != null &&
          message.hasOwnProperty("storeTokenId")
        )
          object.storeTokenId =
            options.bytes === String
              ? $util.base64.encode(
                  message.storeTokenId,
                  0,
                  message.storeTokenId.length,
                )
              : options.bytes === Array
                ? Array.prototype.slice.call(message.storeTokenId)
                : message.storeTokenId;
        if (message.domain != null && message.hasOwnProperty("domain"))
          object.domain = message.domain;
        if (
          message.publishedTagId != null &&
          message.hasOwnProperty("publishedTagId")
        )
          object.publishedTagId =
            options.bytes === String
              ? $util.base64.encode(
                  message.publishedTagId,
                  0,
                  message.publishedTagId.length,
                )
              : options.bytes === Array
                ? Array.prototype.slice.call(message.publishedTagId)
                : message.publishedTagId;
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

    mass.UpdateStoreManifest = (function () {
      /**
       * Properties of an UpdateStoreManifest.
       * @memberof market.mass
       * @interface IUpdateStoreManifest
       * @property {Uint8Array|null} [eventId] UpdateStoreManifest eventId
       * @property {string|null} [domain] UpdateStoreManifest domain
       * @property {Uint8Array|null} [publishedTagId] UpdateStoreManifest publishedTagId
       * @property {Uint8Array|null} [addErc20Addr] UpdateStoreManifest addErc20Addr
       * @property {Uint8Array|null} [removeErc20Addr] UpdateStoreManifest removeErc20Addr
       */

      /**
       * Constructs a new UpdateStoreManifest.
       * @memberof market.mass
       * @classdesc Represents an UpdateStoreManifest.
       * @implements IUpdateStoreManifest
       * @constructor
       * @param {market.mass.IUpdateStoreManifest=} [properties] Properties to set
       */
      function UpdateStoreManifest(properties) {
        if (properties)
          for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
            if (properties[keys[i]] != null)
              this[keys[i]] = properties[keys[i]];
      }

      /**
       * UpdateStoreManifest eventId.
       * @member {Uint8Array} eventId
       * @memberof market.mass.UpdateStoreManifest
       * @instance
       */
      UpdateStoreManifest.prototype.eventId = $util.newBuffer([]);

      /**
       * UpdateStoreManifest domain.
       * @member {string|null|undefined} domain
       * @memberof market.mass.UpdateStoreManifest
       * @instance
       */
      UpdateStoreManifest.prototype.domain = null;

      /**
       * UpdateStoreManifest publishedTagId.
       * @member {Uint8Array|null|undefined} publishedTagId
       * @memberof market.mass.UpdateStoreManifest
       * @instance
       */
      UpdateStoreManifest.prototype.publishedTagId = null;

      /**
       * UpdateStoreManifest addErc20Addr.
       * @member {Uint8Array|null|undefined} addErc20Addr
       * @memberof market.mass.UpdateStoreManifest
       * @instance
       */
      UpdateStoreManifest.prototype.addErc20Addr = null;

      /**
       * UpdateStoreManifest removeErc20Addr.
       * @member {Uint8Array|null|undefined} removeErc20Addr
       * @memberof market.mass.UpdateStoreManifest
       * @instance
       */
      UpdateStoreManifest.prototype.removeErc20Addr = null;

      // OneOf field names bound to virtual getters and setters
      let $oneOfFields;

      /**
       * UpdateStoreManifest _domain.
       * @member {"domain"|undefined} _domain
       * @memberof market.mass.UpdateStoreManifest
       * @instance
       */
      Object.defineProperty(UpdateStoreManifest.prototype, "_domain", {
        get: $util.oneOfGetter(($oneOfFields = ["domain"])),
        set: $util.oneOfSetter($oneOfFields),
      });

      /**
       * UpdateStoreManifest _publishedTagId.
       * @member {"publishedTagId"|undefined} _publishedTagId
       * @memberof market.mass.UpdateStoreManifest
       * @instance
       */
      Object.defineProperty(UpdateStoreManifest.prototype, "_publishedTagId", {
        get: $util.oneOfGetter(($oneOfFields = ["publishedTagId"])),
        set: $util.oneOfSetter($oneOfFields),
      });

      /**
       * UpdateStoreManifest _addErc20Addr.
       * @member {"addErc20Addr"|undefined} _addErc20Addr
       * @memberof market.mass.UpdateStoreManifest
       * @instance
       */
      Object.defineProperty(UpdateStoreManifest.prototype, "_addErc20Addr", {
        get: $util.oneOfGetter(($oneOfFields = ["addErc20Addr"])),
        set: $util.oneOfSetter($oneOfFields),
      });

      /**
       * UpdateStoreManifest _removeErc20Addr.
       * @member {"removeErc20Addr"|undefined} _removeErc20Addr
       * @memberof market.mass.UpdateStoreManifest
       * @instance
       */
      Object.defineProperty(UpdateStoreManifest.prototype, "_removeErc20Addr", {
        get: $util.oneOfGetter(($oneOfFields = ["removeErc20Addr"])),
        set: $util.oneOfSetter($oneOfFields),
      });

      /**
       * Creates a new UpdateStoreManifest instance using the specified properties.
       * @function create
       * @memberof market.mass.UpdateStoreManifest
       * @static
       * @param {market.mass.IUpdateStoreManifest=} [properties] Properties to set
       * @returns {market.mass.UpdateStoreManifest} UpdateStoreManifest instance
       */
      UpdateStoreManifest.create = function create(properties) {
        return new UpdateStoreManifest(properties);
      };

      /**
       * Encodes the specified UpdateStoreManifest message. Does not implicitly {@link market.mass.UpdateStoreManifest.verify|verify} messages.
       * @function encode
       * @memberof market.mass.UpdateStoreManifest
       * @static
       * @param {market.mass.IUpdateStoreManifest} message UpdateStoreManifest message or plain object to encode
       * @param {$protobuf.Writer} [writer] Writer to encode to
       * @returns {$protobuf.Writer} Writer
       */
      UpdateStoreManifest.encode = function encode(message, writer) {
        if (!writer) writer = $Writer.create();
        if (
          message.eventId != null &&
          Object.hasOwnProperty.call(message, "eventId")
        )
          writer.uint32(/* id 1, wireType 2 =*/ 10).bytes(message.eventId);
        if (
          message.domain != null &&
          Object.hasOwnProperty.call(message, "domain")
        )
          writer.uint32(/* id 2, wireType 2 =*/ 18).string(message.domain);
        if (
          message.publishedTagId != null &&
          Object.hasOwnProperty.call(message, "publishedTagId")
        )
          writer
            .uint32(/* id 3, wireType 2 =*/ 26)
            .bytes(message.publishedTagId);
        if (
          message.addErc20Addr != null &&
          Object.hasOwnProperty.call(message, "addErc20Addr")
        )
          writer.uint32(/* id 4, wireType 2 =*/ 34).bytes(message.addErc20Addr);
        if (
          message.removeErc20Addr != null &&
          Object.hasOwnProperty.call(message, "removeErc20Addr")
        )
          writer
            .uint32(/* id 5, wireType 2 =*/ 42)
            .bytes(message.removeErc20Addr);
        return writer;
      };

      /**
       * Encodes the specified UpdateStoreManifest message, length delimited. Does not implicitly {@link market.mass.UpdateStoreManifest.verify|verify} messages.
       * @function encodeDelimited
       * @memberof market.mass.UpdateStoreManifest
       * @static
       * @param {market.mass.IUpdateStoreManifest} message UpdateStoreManifest message or plain object to encode
       * @param {$protobuf.Writer} [writer] Writer to encode to
       * @returns {$protobuf.Writer} Writer
       */
      UpdateStoreManifest.encodeDelimited = function encodeDelimited(
        message,
        writer,
      ) {
        return this.encode(message, writer).ldelim();
      };

      /**
       * Decodes an UpdateStoreManifest message from the specified reader or buffer.
       * @function decode
       * @memberof market.mass.UpdateStoreManifest
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @param {number} [length] Message length if known beforehand
       * @returns {market.mass.UpdateStoreManifest} UpdateStoreManifest
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      UpdateStoreManifest.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length,
          message = new $root.market.mass.UpdateStoreManifest();
        while (reader.pos < end) {
          let tag = reader.uint32();
          switch (tag >>> 3) {
            case 1: {
              message.eventId = reader.bytes();
              break;
            }
            case 2: {
              message.domain = reader.string();
              break;
            }
            case 3: {
              message.publishedTagId = reader.bytes();
              break;
            }
            case 4: {
              message.addErc20Addr = reader.bytes();
              break;
            }
            case 5: {
              message.removeErc20Addr = reader.bytes();
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
       * Decodes an UpdateStoreManifest message from the specified reader or buffer, length delimited.
       * @function decodeDelimited
       * @memberof market.mass.UpdateStoreManifest
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @returns {market.mass.UpdateStoreManifest} UpdateStoreManifest
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      UpdateStoreManifest.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader)) reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
      };

      /**
       * Verifies an UpdateStoreManifest message.
       * @function verify
       * @memberof market.mass.UpdateStoreManifest
       * @static
       * @param {Object.<string,*>} message Plain object to verify
       * @returns {string|null} `null` if valid, otherwise the reason why it is not
       */
      UpdateStoreManifest.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
          return "object expected";
        let properties = {};
        if (message.eventId != null && message.hasOwnProperty("eventId"))
          if (
            !(
              (message.eventId && typeof message.eventId.length === "number") ||
              $util.isString(message.eventId)
            )
          )
            return "eventId: buffer expected";
        if (message.domain != null && message.hasOwnProperty("domain")) {
          properties._domain = 1;
          if (!$util.isString(message.domain)) return "domain: string expected";
        }
        if (
          message.publishedTagId != null &&
          message.hasOwnProperty("publishedTagId")
        ) {
          properties._publishedTagId = 1;
          if (
            !(
              (message.publishedTagId &&
                typeof message.publishedTagId.length === "number") ||
              $util.isString(message.publishedTagId)
            )
          )
            return "publishedTagId: buffer expected";
        }
        if (
          message.addErc20Addr != null &&
          message.hasOwnProperty("addErc20Addr")
        ) {
          properties._addErc20Addr = 1;
          if (
            !(
              (message.addErc20Addr &&
                typeof message.addErc20Addr.length === "number") ||
              $util.isString(message.addErc20Addr)
            )
          )
            return "addErc20Addr: buffer expected";
        }
        if (
          message.removeErc20Addr != null &&
          message.hasOwnProperty("removeErc20Addr")
        ) {
          properties._removeErc20Addr = 1;
          if (
            !(
              (message.removeErc20Addr &&
                typeof message.removeErc20Addr.length === "number") ||
              $util.isString(message.removeErc20Addr)
            )
          )
            return "removeErc20Addr: buffer expected";
        }
        return null;
      };

      /**
       * Creates an UpdateStoreManifest message from a plain object. Also converts values to their respective internal types.
       * @function fromObject
       * @memberof market.mass.UpdateStoreManifest
       * @static
       * @param {Object.<string,*>} object Plain object
       * @returns {market.mass.UpdateStoreManifest} UpdateStoreManifest
       */
      UpdateStoreManifest.fromObject = function fromObject(object) {
        if (object instanceof $root.market.mass.UpdateStoreManifest)
          return object;
        let message = new $root.market.mass.UpdateStoreManifest();
        if (object.eventId != null)
          if (typeof object.eventId === "string")
            $util.base64.decode(
              object.eventId,
              (message.eventId = $util.newBuffer(
                $util.base64.length(object.eventId),
              )),
              0,
            );
          else if (object.eventId.length >= 0) message.eventId = object.eventId;
        if (object.domain != null) message.domain = String(object.domain);
        if (object.publishedTagId != null)
          if (typeof object.publishedTagId === "string")
            $util.base64.decode(
              object.publishedTagId,
              (message.publishedTagId = $util.newBuffer(
                $util.base64.length(object.publishedTagId),
              )),
              0,
            );
          else if (object.publishedTagId.length >= 0)
            message.publishedTagId = object.publishedTagId;
        if (object.addErc20Addr != null)
          if (typeof object.addErc20Addr === "string")
            $util.base64.decode(
              object.addErc20Addr,
              (message.addErc20Addr = $util.newBuffer(
                $util.base64.length(object.addErc20Addr),
              )),
              0,
            );
          else if (object.addErc20Addr.length >= 0)
            message.addErc20Addr = object.addErc20Addr;
        if (object.removeErc20Addr != null)
          if (typeof object.removeErc20Addr === "string")
            $util.base64.decode(
              object.removeErc20Addr,
              (message.removeErc20Addr = $util.newBuffer(
                $util.base64.length(object.removeErc20Addr),
              )),
              0,
            );
          else if (object.removeErc20Addr.length >= 0)
            message.removeErc20Addr = object.removeErc20Addr;
        return message;
      };

      /**
       * Creates a plain object from an UpdateStoreManifest message. Also converts values to other types if specified.
       * @function toObject
       * @memberof market.mass.UpdateStoreManifest
       * @static
       * @param {market.mass.UpdateStoreManifest} message UpdateStoreManifest
       * @param {$protobuf.IConversionOptions} [options] Conversion options
       * @returns {Object.<string,*>} Plain object
       */
      UpdateStoreManifest.toObject = function toObject(message, options) {
        if (!options) options = {};
        let object = {};
        if (options.defaults)
          if (options.bytes === String) object.eventId = "";
          else {
            object.eventId = [];
            if (options.bytes !== Array)
              object.eventId = $util.newBuffer(object.eventId);
          }
        if (message.eventId != null && message.hasOwnProperty("eventId"))
          object.eventId =
            options.bytes === String
              ? $util.base64.encode(message.eventId, 0, message.eventId.length)
              : options.bytes === Array
                ? Array.prototype.slice.call(message.eventId)
                : message.eventId;
        if (message.domain != null && message.hasOwnProperty("domain")) {
          object.domain = message.domain;
          if (options.oneofs) object._domain = "domain";
        }
        if (
          message.publishedTagId != null &&
          message.hasOwnProperty("publishedTagId")
        ) {
          object.publishedTagId =
            options.bytes === String
              ? $util.base64.encode(
                  message.publishedTagId,
                  0,
                  message.publishedTagId.length,
                )
              : options.bytes === Array
                ? Array.prototype.slice.call(message.publishedTagId)
                : message.publishedTagId;
          if (options.oneofs) object._publishedTagId = "publishedTagId";
        }
        if (
          message.addErc20Addr != null &&
          message.hasOwnProperty("addErc20Addr")
        ) {
          object.addErc20Addr =
            options.bytes === String
              ? $util.base64.encode(
                  message.addErc20Addr,
                  0,
                  message.addErc20Addr.length,
                )
              : options.bytes === Array
                ? Array.prototype.slice.call(message.addErc20Addr)
                : message.addErc20Addr;
          if (options.oneofs) object._addErc20Addr = "addErc20Addr";
        }
        if (
          message.removeErc20Addr != null &&
          message.hasOwnProperty("removeErc20Addr")
        ) {
          object.removeErc20Addr =
            options.bytes === String
              ? $util.base64.encode(
                  message.removeErc20Addr,
                  0,
                  message.removeErc20Addr.length,
                )
              : options.bytes === Array
                ? Array.prototype.slice.call(message.removeErc20Addr)
                : message.removeErc20Addr;
          if (options.oneofs) object._removeErc20Addr = "removeErc20Addr";
        }
        return object;
      };

      /**
       * Converts this UpdateStoreManifest to JSON.
       * @function toJSON
       * @memberof market.mass.UpdateStoreManifest
       * @instance
       * @returns {Object.<string,*>} JSON object
       */
      UpdateStoreManifest.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
      };

      /**
       * Gets the default type url for UpdateStoreManifest
       * @function getTypeUrl
       * @memberof market.mass.UpdateStoreManifest
       * @static
       * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns {string} The default type url
       */
      UpdateStoreManifest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
          typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/market.mass.UpdateStoreManifest";
      };

      return UpdateStoreManifest;
    })();

    mass.CreateItem = (function () {
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
        if (!writer) writer = $Writer.create();
        if (
          message.eventId != null &&
          Object.hasOwnProperty.call(message, "eventId")
        )
          writer.uint32(/* id 1, wireType 2 =*/ 10).bytes(message.eventId);
        if (
          message.price != null &&
          Object.hasOwnProperty.call(message, "price")
        )
          writer.uint32(/* id 2, wireType 2 =*/ 18).string(message.price);
        if (
          message.metadata != null &&
          Object.hasOwnProperty.call(message, "metadata")
        )
          writer.uint32(/* id 3, wireType 2 =*/ 26).bytes(message.metadata);
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
        if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length,
          message = new $root.market.mass.CreateItem();
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
        if (!(reader instanceof $Reader)) reader = new $Reader(reader);
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
          if (
            !(
              (message.eventId && typeof message.eventId.length === "number") ||
              $util.isString(message.eventId)
            )
          )
            return "eventId: buffer expected";
        if (message.price != null && message.hasOwnProperty("price"))
          if (!$util.isString(message.price)) return "price: string expected";
        if (message.metadata != null && message.hasOwnProperty("metadata"))
          if (
            !(
              (message.metadata &&
                typeof message.metadata.length === "number") ||
              $util.isString(message.metadata)
            )
          )
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
        if (object instanceof $root.market.mass.CreateItem) return object;
        let message = new $root.market.mass.CreateItem();
        if (object.eventId != null)
          if (typeof object.eventId === "string")
            $util.base64.decode(
              object.eventId,
              (message.eventId = $util.newBuffer(
                $util.base64.length(object.eventId),
              )),
              0,
            );
          else if (object.eventId.length >= 0) message.eventId = object.eventId;
        if (object.price != null) message.price = String(object.price);
        if (object.metadata != null)
          if (typeof object.metadata === "string")
            $util.base64.decode(
              object.metadata,
              (message.metadata = $util.newBuffer(
                $util.base64.length(object.metadata),
              )),
              0,
            );
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
        if (!options) options = {};
        let object = {};
        if (options.defaults) {
          if (options.bytes === String) object.eventId = "";
          else {
            object.eventId = [];
            if (options.bytes !== Array)
              object.eventId = $util.newBuffer(object.eventId);
          }
          object.price = "";
          if (options.bytes === String) object.metadata = "";
          else {
            object.metadata = [];
            if (options.bytes !== Array)
              object.metadata = $util.newBuffer(object.metadata);
          }
        }
        if (message.eventId != null && message.hasOwnProperty("eventId"))
          object.eventId =
            options.bytes === String
              ? $util.base64.encode(message.eventId, 0, message.eventId.length)
              : options.bytes === Array
                ? Array.prototype.slice.call(message.eventId)
                : message.eventId;
        if (message.price != null && message.hasOwnProperty("price"))
          object.price = message.price;
        if (message.metadata != null && message.hasOwnProperty("metadata"))
          object.metadata =
            options.bytes === String
              ? $util.base64.encode(
                  message.metadata,
                  0,
                  message.metadata.length,
                )
              : options.bytes === Array
                ? Array.prototype.slice.call(message.metadata)
                : message.metadata;
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

    mass.UpdateItem = (function () {
      /**
       * Properties of an UpdateItem.
       * @memberof market.mass
       * @interface IUpdateItem
       * @property {Uint8Array|null} [eventId] UpdateItem eventId
       * @property {Uint8Array|null} [itemId] UpdateItem itemId
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
       * UpdateItem _price.
       * @member {"price"|undefined} _price
       * @memberof market.mass.UpdateItem
       * @instance
       */
      Object.defineProperty(UpdateItem.prototype, "_price", {
        get: $util.oneOfGetter(($oneOfFields = ["price"])),
        set: $util.oneOfSetter($oneOfFields),
      });

      /**
       * UpdateItem _metadata.
       * @member {"metadata"|undefined} _metadata
       * @memberof market.mass.UpdateItem
       * @instance
       */
      Object.defineProperty(UpdateItem.prototype, "_metadata", {
        get: $util.oneOfGetter(($oneOfFields = ["metadata"])),
        set: $util.oneOfSetter($oneOfFields),
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
        if (!writer) writer = $Writer.create();
        if (
          message.eventId != null &&
          Object.hasOwnProperty.call(message, "eventId")
        )
          writer.uint32(/* id 1, wireType 2 =*/ 10).bytes(message.eventId);
        if (
          message.itemId != null &&
          Object.hasOwnProperty.call(message, "itemId")
        )
          writer.uint32(/* id 2, wireType 2 =*/ 18).bytes(message.itemId);
        if (
          message.price != null &&
          Object.hasOwnProperty.call(message, "price")
        )
          writer.uint32(/* id 3, wireType 2 =*/ 26).string(message.price);
        if (
          message.metadata != null &&
          Object.hasOwnProperty.call(message, "metadata")
        )
          writer.uint32(/* id 4, wireType 2 =*/ 34).bytes(message.metadata);
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
        if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length,
          message = new $root.market.mass.UpdateItem();
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
              message.price = reader.string();
              break;
            }
            case 4: {
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
        if (!(reader instanceof $Reader)) reader = new $Reader(reader);
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
          if (
            !(
              (message.eventId && typeof message.eventId.length === "number") ||
              $util.isString(message.eventId)
            )
          )
            return "eventId: buffer expected";
        if (message.itemId != null && message.hasOwnProperty("itemId"))
          if (
            !(
              (message.itemId && typeof message.itemId.length === "number") ||
              $util.isString(message.itemId)
            )
          )
            return "itemId: buffer expected";
        if (message.price != null && message.hasOwnProperty("price")) {
          properties._price = 1;
          if (!$util.isString(message.price)) return "price: string expected";
        }
        if (message.metadata != null && message.hasOwnProperty("metadata")) {
          properties._metadata = 1;
          if (
            !(
              (message.metadata &&
                typeof message.metadata.length === "number") ||
              $util.isString(message.metadata)
            )
          )
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
        if (object instanceof $root.market.mass.UpdateItem) return object;
        let message = new $root.market.mass.UpdateItem();
        if (object.eventId != null)
          if (typeof object.eventId === "string")
            $util.base64.decode(
              object.eventId,
              (message.eventId = $util.newBuffer(
                $util.base64.length(object.eventId),
              )),
              0,
            );
          else if (object.eventId.length >= 0) message.eventId = object.eventId;
        if (object.itemId != null)
          if (typeof object.itemId === "string")
            $util.base64.decode(
              object.itemId,
              (message.itemId = $util.newBuffer(
                $util.base64.length(object.itemId),
              )),
              0,
            );
          else if (object.itemId.length >= 0) message.itemId = object.itemId;
        if (object.price != null) message.price = String(object.price);
        if (object.metadata != null)
          if (typeof object.metadata === "string")
            $util.base64.decode(
              object.metadata,
              (message.metadata = $util.newBuffer(
                $util.base64.length(object.metadata),
              )),
              0,
            );
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
        if (!options) options = {};
        let object = {};
        if (options.defaults) {
          if (options.bytes === String) object.eventId = "";
          else {
            object.eventId = [];
            if (options.bytes !== Array)
              object.eventId = $util.newBuffer(object.eventId);
          }
          if (options.bytes === String) object.itemId = "";
          else {
            object.itemId = [];
            if (options.bytes !== Array)
              object.itemId = $util.newBuffer(object.itemId);
          }
        }
        if (message.eventId != null && message.hasOwnProperty("eventId"))
          object.eventId =
            options.bytes === String
              ? $util.base64.encode(message.eventId, 0, message.eventId.length)
              : options.bytes === Array
                ? Array.prototype.slice.call(message.eventId)
                : message.eventId;
        if (message.itemId != null && message.hasOwnProperty("itemId"))
          object.itemId =
            options.bytes === String
              ? $util.base64.encode(message.itemId, 0, message.itemId.length)
              : options.bytes === Array
                ? Array.prototype.slice.call(message.itemId)
                : message.itemId;
        if (message.price != null && message.hasOwnProperty("price")) {
          object.price = message.price;
          if (options.oneofs) object._price = "price";
        }
        if (message.metadata != null && message.hasOwnProperty("metadata")) {
          object.metadata =
            options.bytes === String
              ? $util.base64.encode(
                  message.metadata,
                  0,
                  message.metadata.length,
                )
              : options.bytes === Array
                ? Array.prototype.slice.call(message.metadata)
                : message.metadata;
          if (options.oneofs) object._metadata = "metadata";
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

      return UpdateItem;
    })();

    mass.CreateTag = (function () {
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
        if (!writer) writer = $Writer.create();
        if (
          message.eventId != null &&
          Object.hasOwnProperty.call(message, "eventId")
        )
          writer.uint32(/* id 1, wireType 2 =*/ 10).bytes(message.eventId);
        if (message.name != null && Object.hasOwnProperty.call(message, "name"))
          writer.uint32(/* id 2, wireType 2 =*/ 18).string(message.name);
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
        if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length,
          message = new $root.market.mass.CreateTag();
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
        if (!(reader instanceof $Reader)) reader = new $Reader(reader);
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
          if (
            !(
              (message.eventId && typeof message.eventId.length === "number") ||
              $util.isString(message.eventId)
            )
          )
            return "eventId: buffer expected";
        if (message.name != null && message.hasOwnProperty("name"))
          if (!$util.isString(message.name)) return "name: string expected";
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
        if (object instanceof $root.market.mass.CreateTag) return object;
        let message = new $root.market.mass.CreateTag();
        if (object.eventId != null)
          if (typeof object.eventId === "string")
            $util.base64.decode(
              object.eventId,
              (message.eventId = $util.newBuffer(
                $util.base64.length(object.eventId),
              )),
              0,
            );
          else if (object.eventId.length >= 0) message.eventId = object.eventId;
        if (object.name != null) message.name = String(object.name);
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
        if (!options) options = {};
        let object = {};
        if (options.defaults) {
          if (options.bytes === String) object.eventId = "";
          else {
            object.eventId = [];
            if (options.bytes !== Array)
              object.eventId = $util.newBuffer(object.eventId);
          }
          object.name = "";
        }
        if (message.eventId != null && message.hasOwnProperty("eventId"))
          object.eventId =
            options.bytes === String
              ? $util.base64.encode(message.eventId, 0, message.eventId.length)
              : options.bytes === Array
                ? Array.prototype.slice.call(message.eventId)
                : message.eventId;
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

    mass.UpdateTag = (function () {
      /**
       * Properties of an UpdateTag.
       * @memberof market.mass
       * @interface IUpdateTag
       * @property {Uint8Array|null} [eventId] UpdateTag eventId
       * @property {Uint8Array|null} [tagId] UpdateTag tagId
       * @property {Uint8Array|null} [addItemId] UpdateTag addItemId
       * @property {Uint8Array|null} [removeItemId] UpdateTag removeItemId
       * @property {boolean|null} ["delete"] UpdateTag delete
       * @property {string|null} [rename] UpdateTag rename
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
        if (properties)
          for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
            if (properties[keys[i]] != null)
              this[keys[i]] = properties[keys[i]];
      }

      /**
       * UpdateTag eventId.
       * @member {Uint8Array} eventId
       * @memberof market.mass.UpdateTag
       * @instance
       */
      UpdateTag.prototype.eventId = $util.newBuffer([]);

      /**
       * UpdateTag tagId.
       * @member {Uint8Array} tagId
       * @memberof market.mass.UpdateTag
       * @instance
       */
      UpdateTag.prototype.tagId = $util.newBuffer([]);

      /**
       * UpdateTag addItemId.
       * @member {Uint8Array|null|undefined} addItemId
       * @memberof market.mass.UpdateTag
       * @instance
       */
      UpdateTag.prototype.addItemId = null;

      /**
       * UpdateTag removeItemId.
       * @member {Uint8Array|null|undefined} removeItemId
       * @memberof market.mass.UpdateTag
       * @instance
       */
      UpdateTag.prototype.removeItemId = null;

      /**
       * UpdateTag delete.
       * @member {boolean|null|undefined} delete
       * @memberof market.mass.UpdateTag
       * @instance
       */
      UpdateTag.prototype["delete"] = null;

      /**
       * UpdateTag rename.
       * @member {string|null|undefined} rename
       * @memberof market.mass.UpdateTag
       * @instance
       */
      UpdateTag.prototype.rename = null;

      // OneOf field names bound to virtual getters and setters
      let $oneOfFields;

      /**
       * UpdateTag _addItemId.
       * @member {"addItemId"|undefined} _addItemId
       * @memberof market.mass.UpdateTag
       * @instance
       */
      Object.defineProperty(UpdateTag.prototype, "_addItemId", {
        get: $util.oneOfGetter(($oneOfFields = ["addItemId"])),
        set: $util.oneOfSetter($oneOfFields),
      });

      /**
       * UpdateTag _removeItemId.
       * @member {"removeItemId"|undefined} _removeItemId
       * @memberof market.mass.UpdateTag
       * @instance
       */
      Object.defineProperty(UpdateTag.prototype, "_removeItemId", {
        get: $util.oneOfGetter(($oneOfFields = ["removeItemId"])),
        set: $util.oneOfSetter($oneOfFields),
      });

      /**
       * UpdateTag _delete.
       * @member {"delete"|undefined} _delete
       * @memberof market.mass.UpdateTag
       * @instance
       */
      Object.defineProperty(UpdateTag.prototype, "_delete", {
        get: $util.oneOfGetter(($oneOfFields = ["delete"])),
        set: $util.oneOfSetter($oneOfFields),
      });

      /**
       * UpdateTag _rename.
       * @member {"rename"|undefined} _rename
       * @memberof market.mass.UpdateTag
       * @instance
       */
      Object.defineProperty(UpdateTag.prototype, "_rename", {
        get: $util.oneOfGetter(($oneOfFields = ["rename"])),
        set: $util.oneOfSetter($oneOfFields),
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
        if (!writer) writer = $Writer.create();
        if (
          message.eventId != null &&
          Object.hasOwnProperty.call(message, "eventId")
        )
          writer.uint32(/* id 1, wireType 2 =*/ 10).bytes(message.eventId);
        if (
          message.tagId != null &&
          Object.hasOwnProperty.call(message, "tagId")
        )
          writer.uint32(/* id 2, wireType 2 =*/ 18).bytes(message.tagId);
        if (
          message.addItemId != null &&
          Object.hasOwnProperty.call(message, "addItemId")
        )
          writer.uint32(/* id 3, wireType 2 =*/ 26).bytes(message.addItemId);
        if (
          message.removeItemId != null &&
          Object.hasOwnProperty.call(message, "removeItemId")
        )
          writer.uint32(/* id 4, wireType 2 =*/ 34).bytes(message.removeItemId);
        if (
          message["delete"] != null &&
          Object.hasOwnProperty.call(message, "delete")
        )
          writer.uint32(/* id 5, wireType 0 =*/ 40).bool(message["delete"]);
        if (
          message.rename != null &&
          Object.hasOwnProperty.call(message, "rename")
        )
          writer.uint32(/* id 6, wireType 2 =*/ 50).string(message.rename);
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
        if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length,
          message = new $root.market.mass.UpdateTag();
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
              message.addItemId = reader.bytes();
              break;
            }
            case 4: {
              message.removeItemId = reader.bytes();
              break;
            }
            case 5: {
              message["delete"] = reader.bool();
              break;
            }
            case 6: {
              message.rename = reader.string();
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
        if (!(reader instanceof $Reader)) reader = new $Reader(reader);
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
        let properties = {};
        if (message.eventId != null && message.hasOwnProperty("eventId"))
          if (
            !(
              (message.eventId && typeof message.eventId.length === "number") ||
              $util.isString(message.eventId)
            )
          )
            return "eventId: buffer expected";
        if (message.tagId != null && message.hasOwnProperty("tagId"))
          if (
            !(
              (message.tagId && typeof message.tagId.length === "number") ||
              $util.isString(message.tagId)
            )
          )
            return "tagId: buffer expected";
        if (message.addItemId != null && message.hasOwnProperty("addItemId")) {
          properties._addItemId = 1;
          if (
            !(
              (message.addItemId &&
                typeof message.addItemId.length === "number") ||
              $util.isString(message.addItemId)
            )
          )
            return "addItemId: buffer expected";
        }
        if (
          message.removeItemId != null &&
          message.hasOwnProperty("removeItemId")
        ) {
          properties._removeItemId = 1;
          if (
            !(
              (message.removeItemId &&
                typeof message.removeItemId.length === "number") ||
              $util.isString(message.removeItemId)
            )
          )
            return "removeItemId: buffer expected";
        }
        if (message["delete"] != null && message.hasOwnProperty("delete")) {
          properties._delete = 1;
          if (typeof message["delete"] !== "boolean")
            return "delete: boolean expected";
        }
        if (message.rename != null && message.hasOwnProperty("rename")) {
          properties._rename = 1;
          if (!$util.isString(message.rename)) return "rename: string expected";
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
        if (object instanceof $root.market.mass.UpdateTag) return object;
        let message = new $root.market.mass.UpdateTag();
        if (object.eventId != null)
          if (typeof object.eventId === "string")
            $util.base64.decode(
              object.eventId,
              (message.eventId = $util.newBuffer(
                $util.base64.length(object.eventId),
              )),
              0,
            );
          else if (object.eventId.length >= 0) message.eventId = object.eventId;
        if (object.tagId != null)
          if (typeof object.tagId === "string")
            $util.base64.decode(
              object.tagId,
              (message.tagId = $util.newBuffer(
                $util.base64.length(object.tagId),
              )),
              0,
            );
          else if (object.tagId.length >= 0) message.tagId = object.tagId;
        if (object.addItemId != null)
          if (typeof object.addItemId === "string")
            $util.base64.decode(
              object.addItemId,
              (message.addItemId = $util.newBuffer(
                $util.base64.length(object.addItemId),
              )),
              0,
            );
          else if (object.addItemId.length >= 0)
            message.addItemId = object.addItemId;
        if (object.removeItemId != null)
          if (typeof object.removeItemId === "string")
            $util.base64.decode(
              object.removeItemId,
              (message.removeItemId = $util.newBuffer(
                $util.base64.length(object.removeItemId),
              )),
              0,
            );
          else if (object.removeItemId.length >= 0)
            message.removeItemId = object.removeItemId;
        if (object["delete"] != null)
          message["delete"] = Boolean(object["delete"]);
        if (object.rename != null) message.rename = String(object.rename);
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
        if (!options) options = {};
        let object = {};
        if (options.defaults) {
          if (options.bytes === String) object.eventId = "";
          else {
            object.eventId = [];
            if (options.bytes !== Array)
              object.eventId = $util.newBuffer(object.eventId);
          }
          if (options.bytes === String) object.tagId = "";
          else {
            object.tagId = [];
            if (options.bytes !== Array)
              object.tagId = $util.newBuffer(object.tagId);
          }
        }
        if (message.eventId != null && message.hasOwnProperty("eventId"))
          object.eventId =
            options.bytes === String
              ? $util.base64.encode(message.eventId, 0, message.eventId.length)
              : options.bytes === Array
                ? Array.prototype.slice.call(message.eventId)
                : message.eventId;
        if (message.tagId != null && message.hasOwnProperty("tagId"))
          object.tagId =
            options.bytes === String
              ? $util.base64.encode(message.tagId, 0, message.tagId.length)
              : options.bytes === Array
                ? Array.prototype.slice.call(message.tagId)
                : message.tagId;
        if (message.addItemId != null && message.hasOwnProperty("addItemId")) {
          object.addItemId =
            options.bytes === String
              ? $util.base64.encode(
                  message.addItemId,
                  0,
                  message.addItemId.length,
                )
              : options.bytes === Array
                ? Array.prototype.slice.call(message.addItemId)
                : message.addItemId;
          if (options.oneofs) object._addItemId = "addItemId";
        }
        if (
          message.removeItemId != null &&
          message.hasOwnProperty("removeItemId")
        ) {
          object.removeItemId =
            options.bytes === String
              ? $util.base64.encode(
                  message.removeItemId,
                  0,
                  message.removeItemId.length,
                )
              : options.bytes === Array
                ? Array.prototype.slice.call(message.removeItemId)
                : message.removeItemId;
          if (options.oneofs) object._removeItemId = "removeItemId";
        }
        if (message["delete"] != null && message.hasOwnProperty("delete")) {
          object["delete"] = message["delete"];
          if (options.oneofs) object._delete = "delete";
        }
        if (message.rename != null && message.hasOwnProperty("rename")) {
          object.rename = message.rename;
          if (options.oneofs) object._rename = "rename";
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

    mass.ChangeStock = (function () {
      /**
       * Properties of a ChangeStock.
       * @memberof market.mass
       * @interface IChangeStock
       * @property {Uint8Array|null} [eventId] ChangeStock eventId
       * @property {Array.<Uint8Array>|null} [itemIds] ChangeStock itemIds
       * @property {Array.<number>|null} [diffs] ChangeStock diffs
       * @property {Uint8Array|null} [orderId] ChangeStock orderId
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
       * ChangeStock orderId.
       * @member {Uint8Array} orderId
       * @memberof market.mass.ChangeStock
       * @instance
       */
      ChangeStock.prototype.orderId = $util.newBuffer([]);

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
        if (!writer) writer = $Writer.create();
        if (
          message.eventId != null &&
          Object.hasOwnProperty.call(message, "eventId")
        )
          writer.uint32(/* id 1, wireType 2 =*/ 10).bytes(message.eventId);
        if (message.itemIds != null && message.itemIds.length)
          for (let i = 0; i < message.itemIds.length; ++i)
            writer.uint32(/* id 2, wireType 2 =*/ 18).bytes(message.itemIds[i]);
        if (message.diffs != null && message.diffs.length) {
          writer.uint32(/* id 3, wireType 2 =*/ 26).fork();
          for (let i = 0; i < message.diffs.length; ++i)
            writer.sint32(message.diffs[i]);
          writer.ldelim();
        }
        if (
          message.orderId != null &&
          Object.hasOwnProperty.call(message, "orderId")
        )
          writer.uint32(/* id 4, wireType 2 =*/ 34).bytes(message.orderId);
        if (
          message.txHash != null &&
          Object.hasOwnProperty.call(message, "txHash")
        )
          writer.uint32(/* id 5, wireType 2 =*/ 42).bytes(message.txHash);
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
        if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length,
          message = new $root.market.mass.ChangeStock();
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
              if (!(message.diffs && message.diffs.length)) message.diffs = [];
              if ((tag & 7) === 2) {
                let end2 = reader.uint32() + reader.pos;
                while (reader.pos < end2) message.diffs.push(reader.sint32());
              } else message.diffs.push(reader.sint32());
              break;
            }
            case 4: {
              message.orderId = reader.bytes();
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
        if (!(reader instanceof $Reader)) reader = new $Reader(reader);
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
          if (
            !(
              (message.eventId && typeof message.eventId.length === "number") ||
              $util.isString(message.eventId)
            )
          )
            return "eventId: buffer expected";
        if (message.itemIds != null && message.hasOwnProperty("itemIds")) {
          if (!Array.isArray(message.itemIds)) return "itemIds: array expected";
          for (let i = 0; i < message.itemIds.length; ++i)
            if (
              !(
                (message.itemIds[i] &&
                  typeof message.itemIds[i].length === "number") ||
                $util.isString(message.itemIds[i])
              )
            )
              return "itemIds: buffer[] expected";
        }
        if (message.diffs != null && message.hasOwnProperty("diffs")) {
          if (!Array.isArray(message.diffs)) return "diffs: array expected";
          for (let i = 0; i < message.diffs.length; ++i)
            if (!$util.isInteger(message.diffs[i]))
              return "diffs: integer[] expected";
        }
        if (message.orderId != null && message.hasOwnProperty("orderId"))
          if (
            !(
              (message.orderId && typeof message.orderId.length === "number") ||
              $util.isString(message.orderId)
            )
          )
            return "orderId: buffer expected";
        if (message.txHash != null && message.hasOwnProperty("txHash"))
          if (
            !(
              (message.txHash && typeof message.txHash.length === "number") ||
              $util.isString(message.txHash)
            )
          )
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
        if (object instanceof $root.market.mass.ChangeStock) return object;
        let message = new $root.market.mass.ChangeStock();
        if (object.eventId != null)
          if (typeof object.eventId === "string")
            $util.base64.decode(
              object.eventId,
              (message.eventId = $util.newBuffer(
                $util.base64.length(object.eventId),
              )),
              0,
            );
          else if (object.eventId.length >= 0) message.eventId = object.eventId;
        if (object.itemIds) {
          if (!Array.isArray(object.itemIds))
            throw TypeError(".market.mass.ChangeStock.itemIds: array expected");
          message.itemIds = [];
          for (let i = 0; i < object.itemIds.length; ++i)
            if (typeof object.itemIds[i] === "string")
              $util.base64.decode(
                object.itemIds[i],
                (message.itemIds[i] = $util.newBuffer(
                  $util.base64.length(object.itemIds[i]),
                )),
                0,
              );
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
        if (object.orderId != null)
          if (typeof object.orderId === "string")
            $util.base64.decode(
              object.orderId,
              (message.orderId = $util.newBuffer(
                $util.base64.length(object.orderId),
              )),
              0,
            );
          else if (object.orderId.length >= 0) message.orderId = object.orderId;
        if (object.txHash != null)
          if (typeof object.txHash === "string")
            $util.base64.decode(
              object.txHash,
              (message.txHash = $util.newBuffer(
                $util.base64.length(object.txHash),
              )),
              0,
            );
          else if (object.txHash.length >= 0) message.txHash = object.txHash;
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
        if (!options) options = {};
        let object = {};
        if (options.arrays || options.defaults) {
          object.itemIds = [];
          object.diffs = [];
        }
        if (options.defaults) {
          if (options.bytes === String) object.eventId = "";
          else {
            object.eventId = [];
            if (options.bytes !== Array)
              object.eventId = $util.newBuffer(object.eventId);
          }
          if (options.bytes === String) object.orderId = "";
          else {
            object.orderId = [];
            if (options.bytes !== Array)
              object.orderId = $util.newBuffer(object.orderId);
          }
          if (options.bytes === String) object.txHash = "";
          else {
            object.txHash = [];
            if (options.bytes !== Array)
              object.txHash = $util.newBuffer(object.txHash);
          }
        }
        if (message.eventId != null && message.hasOwnProperty("eventId"))
          object.eventId =
            options.bytes === String
              ? $util.base64.encode(message.eventId, 0, message.eventId.length)
              : options.bytes === Array
                ? Array.prototype.slice.call(message.eventId)
                : message.eventId;
        if (message.itemIds && message.itemIds.length) {
          object.itemIds = [];
          for (let j = 0; j < message.itemIds.length; ++j)
            object.itemIds[j] =
              options.bytes === String
                ? $util.base64.encode(
                    message.itemIds[j],
                    0,
                    message.itemIds[j].length,
                  )
                : options.bytes === Array
                  ? Array.prototype.slice.call(message.itemIds[j])
                  : message.itemIds[j];
        }
        if (message.diffs && message.diffs.length) {
          object.diffs = [];
          for (let j = 0; j < message.diffs.length; ++j)
            object.diffs[j] = message.diffs[j];
        }
        if (message.orderId != null && message.hasOwnProperty("orderId"))
          object.orderId =
            options.bytes === String
              ? $util.base64.encode(message.orderId, 0, message.orderId.length)
              : options.bytes === Array
                ? Array.prototype.slice.call(message.orderId)
                : message.orderId;
        if (message.txHash != null && message.hasOwnProperty("txHash"))
          object.txHash =
            options.bytes === String
              ? $util.base64.encode(message.txHash, 0, message.txHash.length)
              : options.bytes === Array
                ? Array.prototype.slice.call(message.txHash)
                : message.txHash;
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

    mass.NewKeyCard = (function () {
      /**
       * Properties of a NewKeyCard.
       * @memberof market.mass
       * @interface INewKeyCard
       * @property {Uint8Array|null} [eventId] NewKeyCard eventId
       * @property {Uint8Array|null} [userWalletAddr] NewKeyCard userWalletAddr
       * @property {Uint8Array|null} [cardPublicKey] NewKeyCard cardPublicKey
       * @property {boolean|null} [isGuest] NewKeyCard isGuest
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
       * NewKeyCard isGuest.
       * @member {boolean} isGuest
       * @memberof market.mass.NewKeyCard
       * @instance
       */
      NewKeyCard.prototype.isGuest = false;

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
        if (!writer) writer = $Writer.create();
        if (
          message.eventId != null &&
          Object.hasOwnProperty.call(message, "eventId")
        )
          writer.uint32(/* id 1, wireType 2 =*/ 10).bytes(message.eventId);
        if (
          message.userWalletAddr != null &&
          Object.hasOwnProperty.call(message, "userWalletAddr")
        )
          writer
            .uint32(/* id 2, wireType 2 =*/ 18)
            .bytes(message.userWalletAddr);
        if (
          message.cardPublicKey != null &&
          Object.hasOwnProperty.call(message, "cardPublicKey")
        )
          writer
            .uint32(/* id 3, wireType 2 =*/ 26)
            .bytes(message.cardPublicKey);
        if (
          message.isGuest != null &&
          Object.hasOwnProperty.call(message, "isGuest")
        )
          writer.uint32(/* id 4, wireType 0 =*/ 32).bool(message.isGuest);
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
        if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length,
          message = new $root.market.mass.NewKeyCard();
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
            case 4: {
              message.isGuest = reader.bool();
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
        if (!(reader instanceof $Reader)) reader = new $Reader(reader);
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
          if (
            !(
              (message.eventId && typeof message.eventId.length === "number") ||
              $util.isString(message.eventId)
            )
          )
            return "eventId: buffer expected";
        if (
          message.userWalletAddr != null &&
          message.hasOwnProperty("userWalletAddr")
        )
          if (
            !(
              (message.userWalletAddr &&
                typeof message.userWalletAddr.length === "number") ||
              $util.isString(message.userWalletAddr)
            )
          )
            return "userWalletAddr: buffer expected";
        if (
          message.cardPublicKey != null &&
          message.hasOwnProperty("cardPublicKey")
        )
          if (
            !(
              (message.cardPublicKey &&
                typeof message.cardPublicKey.length === "number") ||
              $util.isString(message.cardPublicKey)
            )
          )
            return "cardPublicKey: buffer expected";
        if (message.isGuest != null && message.hasOwnProperty("isGuest"))
          if (typeof message.isGuest !== "boolean")
            return "isGuest: boolean expected";
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
        if (object instanceof $root.market.mass.NewKeyCard) return object;
        let message = new $root.market.mass.NewKeyCard();
        if (object.eventId != null)
          if (typeof object.eventId === "string")
            $util.base64.decode(
              object.eventId,
              (message.eventId = $util.newBuffer(
                $util.base64.length(object.eventId),
              )),
              0,
            );
          else if (object.eventId.length >= 0) message.eventId = object.eventId;
        if (object.userWalletAddr != null)
          if (typeof object.userWalletAddr === "string")
            $util.base64.decode(
              object.userWalletAddr,
              (message.userWalletAddr = $util.newBuffer(
                $util.base64.length(object.userWalletAddr),
              )),
              0,
            );
          else if (object.userWalletAddr.length >= 0)
            message.userWalletAddr = object.userWalletAddr;
        if (object.cardPublicKey != null)
          if (typeof object.cardPublicKey === "string")
            $util.base64.decode(
              object.cardPublicKey,
              (message.cardPublicKey = $util.newBuffer(
                $util.base64.length(object.cardPublicKey),
              )),
              0,
            );
          else if (object.cardPublicKey.length >= 0)
            message.cardPublicKey = object.cardPublicKey;
        if (object.isGuest != null) message.isGuest = Boolean(object.isGuest);
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
        if (!options) options = {};
        let object = {};
        if (options.defaults) {
          if (options.bytes === String) object.eventId = "";
          else {
            object.eventId = [];
            if (options.bytes !== Array)
              object.eventId = $util.newBuffer(object.eventId);
          }
          if (options.bytes === String) object.userWalletAddr = "";
          else {
            object.userWalletAddr = [];
            if (options.bytes !== Array)
              object.userWalletAddr = $util.newBuffer(object.userWalletAddr);
          }
          if (options.bytes === String) object.cardPublicKey = "";
          else {
            object.cardPublicKey = [];
            if (options.bytes !== Array)
              object.cardPublicKey = $util.newBuffer(object.cardPublicKey);
          }
          object.isGuest = false;
        }
        if (message.eventId != null && message.hasOwnProperty("eventId"))
          object.eventId =
            options.bytes === String
              ? $util.base64.encode(message.eventId, 0, message.eventId.length)
              : options.bytes === Array
                ? Array.prototype.slice.call(message.eventId)
                : message.eventId;
        if (
          message.userWalletAddr != null &&
          message.hasOwnProperty("userWalletAddr")
        )
          object.userWalletAddr =
            options.bytes === String
              ? $util.base64.encode(
                  message.userWalletAddr,
                  0,
                  message.userWalletAddr.length,
                )
              : options.bytes === Array
                ? Array.prototype.slice.call(message.userWalletAddr)
                : message.userWalletAddr;
        if (
          message.cardPublicKey != null &&
          message.hasOwnProperty("cardPublicKey")
        )
          object.cardPublicKey =
            options.bytes === String
              ? $util.base64.encode(
                  message.cardPublicKey,
                  0,
                  message.cardPublicKey.length,
                )
              : options.bytes === Array
                ? Array.prototype.slice.call(message.cardPublicKey)
                : message.cardPublicKey;
        if (message.isGuest != null && message.hasOwnProperty("isGuest"))
          object.isGuest = message.isGuest;
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

    mass.CreateOrder = (function () {
      /**
       * Properties of a CreateOrder.
       * @memberof market.mass
       * @interface ICreateOrder
       * @property {Uint8Array|null} [eventId] CreateOrder eventId
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
          for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
            if (properties[keys[i]] != null)
              this[keys[i]] = properties[keys[i]];
      }

      /**
       * CreateOrder eventId.
       * @member {Uint8Array} eventId
       * @memberof market.mass.CreateOrder
       * @instance
       */
      CreateOrder.prototype.eventId = $util.newBuffer([]);

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
        if (!writer) writer = $Writer.create();
        if (
          message.eventId != null &&
          Object.hasOwnProperty.call(message, "eventId")
        )
          writer.uint32(/* id 1, wireType 2 =*/ 10).bytes(message.eventId);
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
        if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length,
          message = new $root.market.mass.CreateOrder();
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
        if (!(reader instanceof $Reader)) reader = new $Reader(reader);
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
        if (message.eventId != null && message.hasOwnProperty("eventId"))
          if (
            !(
              (message.eventId && typeof message.eventId.length === "number") ||
              $util.isString(message.eventId)
            )
          )
            return "eventId: buffer expected";
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
        if (object instanceof $root.market.mass.CreateOrder) return object;
        let message = new $root.market.mass.CreateOrder();
        if (object.eventId != null)
          if (typeof object.eventId === "string")
            $util.base64.decode(
              object.eventId,
              (message.eventId = $util.newBuffer(
                $util.base64.length(object.eventId),
              )),
              0,
            );
          else if (object.eventId.length >= 0) message.eventId = object.eventId;
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
        if (!options) options = {};
        let object = {};
        if (options.defaults)
          if (options.bytes === String) object.eventId = "";
          else {
            object.eventId = [];
            if (options.bytes !== Array)
              object.eventId = $util.newBuffer(object.eventId);
          }
        if (message.eventId != null && message.hasOwnProperty("eventId"))
          object.eventId =
            options.bytes === String
              ? $util.base64.encode(message.eventId, 0, message.eventId.length)
              : options.bytes === Array
                ? Array.prototype.slice.call(message.eventId)
                : message.eventId;
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

    mass.UpdateOrder = (function () {
      /**
       * Properties of an UpdateOrder.
       * @memberof market.mass
       * @interface IUpdateOrder
       * @property {Uint8Array|null} [eventId] UpdateOrder eventId
       * @property {Uint8Array|null} [orderId] UpdateOrder orderId
       * @property {market.mass.UpdateOrder.IChangeItems|null} [changeItems] UpdateOrder changeItems
       * @property {market.mass.UpdateOrder.IItemsFinalized|null} [itemsFinalized] UpdateOrder itemsFinalized
       * @property {market.mass.UpdateOrder.IOrderCanceled|null} [orderCanceled] UpdateOrder orderCanceled
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
          for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
            if (properties[keys[i]] != null)
              this[keys[i]] = properties[keys[i]];
      }

      /**
       * UpdateOrder eventId.
       * @member {Uint8Array} eventId
       * @memberof market.mass.UpdateOrder
       * @instance
       */
      UpdateOrder.prototype.eventId = $util.newBuffer([]);

      /**
       * UpdateOrder orderId.
       * @member {Uint8Array} orderId
       * @memberof market.mass.UpdateOrder
       * @instance
       */
      UpdateOrder.prototype.orderId = $util.newBuffer([]);

      /**
       * UpdateOrder changeItems.
       * @member {market.mass.UpdateOrder.IChangeItems|null|undefined} changeItems
       * @memberof market.mass.UpdateOrder
       * @instance
       */
      UpdateOrder.prototype.changeItems = null;

      /**
       * UpdateOrder itemsFinalized.
       * @member {market.mass.UpdateOrder.IItemsFinalized|null|undefined} itemsFinalized
       * @memberof market.mass.UpdateOrder
       * @instance
       */
      UpdateOrder.prototype.itemsFinalized = null;

      /**
       * UpdateOrder orderCanceled.
       * @member {market.mass.UpdateOrder.IOrderCanceled|null|undefined} orderCanceled
       * @memberof market.mass.UpdateOrder
       * @instance
       */
      UpdateOrder.prototype.orderCanceled = null;

      // OneOf field names bound to virtual getters and setters
      let $oneOfFields;

      /**
       * UpdateOrder action.
       * @member {"changeItems"|"itemsFinalized"|"orderCanceled"|undefined} action
       * @memberof market.mass.UpdateOrder
       * @instance
       */
      Object.defineProperty(UpdateOrder.prototype, "action", {
        get: $util.oneOfGetter(
          ($oneOfFields = ["changeItems", "itemsFinalized", "orderCanceled"]),
        ),
        set: $util.oneOfSetter($oneOfFields),
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
        if (!writer) writer = $Writer.create();
        if (
          message.eventId != null &&
          Object.hasOwnProperty.call(message, "eventId")
        )
          writer.uint32(/* id 1, wireType 2 =*/ 10).bytes(message.eventId);
        if (
          message.orderId != null &&
          Object.hasOwnProperty.call(message, "orderId")
        )
          writer.uint32(/* id 2, wireType 2 =*/ 18).bytes(message.orderId);
        if (
          message.changeItems != null &&
          Object.hasOwnProperty.call(message, "changeItems")
        )
          $root.market.mass.UpdateOrder.ChangeItems.encode(
            message.changeItems,
            writer.uint32(/* id 3, wireType 2 =*/ 26).fork(),
          ).ldelim();
        if (
          message.itemsFinalized != null &&
          Object.hasOwnProperty.call(message, "itemsFinalized")
        )
          $root.market.mass.UpdateOrder.ItemsFinalized.encode(
            message.itemsFinalized,
            writer.uint32(/* id 4, wireType 2 =*/ 34).fork(),
          ).ldelim();
        if (
          message.orderCanceled != null &&
          Object.hasOwnProperty.call(message, "orderCanceled")
        )
          $root.market.mass.UpdateOrder.OrderCanceled.encode(
            message.orderCanceled,
            writer.uint32(/* id 5, wireType 2 =*/ 42).fork(),
          ).ldelim();
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
        if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length,
          message = new $root.market.mass.UpdateOrder();
        while (reader.pos < end) {
          let tag = reader.uint32();
          switch (tag >>> 3) {
            case 1: {
              message.eventId = reader.bytes();
              break;
            }
            case 2: {
              message.orderId = reader.bytes();
              break;
            }
            case 3: {
              message.changeItems =
                $root.market.mass.UpdateOrder.ChangeItems.decode(
                  reader,
                  reader.uint32(),
                );
              break;
            }
            case 4: {
              message.itemsFinalized =
                $root.market.mass.UpdateOrder.ItemsFinalized.decode(
                  reader,
                  reader.uint32(),
                );
              break;
            }
            case 5: {
              message.orderCanceled =
                $root.market.mass.UpdateOrder.OrderCanceled.decode(
                  reader,
                  reader.uint32(),
                );
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
        if (!(reader instanceof $Reader)) reader = new $Reader(reader);
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
        let properties = {};
        if (message.eventId != null && message.hasOwnProperty("eventId"))
          if (
            !(
              (message.eventId && typeof message.eventId.length === "number") ||
              $util.isString(message.eventId)
            )
          )
            return "eventId: buffer expected";
        if (message.orderId != null && message.hasOwnProperty("orderId"))
          if (
            !(
              (message.orderId && typeof message.orderId.length === "number") ||
              $util.isString(message.orderId)
            )
          )
            return "orderId: buffer expected";
        if (
          message.changeItems != null &&
          message.hasOwnProperty("changeItems")
        ) {
          properties.action = 1;
          {
            let error = $root.market.mass.UpdateOrder.ChangeItems.verify(
              message.changeItems,
            );
            if (error) return "changeItems." + error;
          }
        }
        if (
          message.itemsFinalized != null &&
          message.hasOwnProperty("itemsFinalized")
        ) {
          if (properties.action === 1) return "action: multiple values";
          properties.action = 1;
          {
            let error = $root.market.mass.UpdateOrder.ItemsFinalized.verify(
              message.itemsFinalized,
            );
            if (error) return "itemsFinalized." + error;
          }
        }
        if (
          message.orderCanceled != null &&
          message.hasOwnProperty("orderCanceled")
        ) {
          if (properties.action === 1) return "action: multiple values";
          properties.action = 1;
          {
            let error = $root.market.mass.UpdateOrder.OrderCanceled.verify(
              message.orderCanceled,
            );
            if (error) return "orderCanceled." + error;
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
        if (object instanceof $root.market.mass.UpdateOrder) return object;
        let message = new $root.market.mass.UpdateOrder();
        if (object.eventId != null)
          if (typeof object.eventId === "string")
            $util.base64.decode(
              object.eventId,
              (message.eventId = $util.newBuffer(
                $util.base64.length(object.eventId),
              )),
              0,
            );
          else if (object.eventId.length >= 0) message.eventId = object.eventId;
        if (object.orderId != null)
          if (typeof object.orderId === "string")
            $util.base64.decode(
              object.orderId,
              (message.orderId = $util.newBuffer(
                $util.base64.length(object.orderId),
              )),
              0,
            );
          else if (object.orderId.length >= 0) message.orderId = object.orderId;
        if (object.changeItems != null) {
          if (typeof object.changeItems !== "object")
            throw TypeError(
              ".market.mass.UpdateOrder.changeItems: object expected",
            );
          message.changeItems =
            $root.market.mass.UpdateOrder.ChangeItems.fromObject(
              object.changeItems,
            );
        }
        if (object.itemsFinalized != null) {
          if (typeof object.itemsFinalized !== "object")
            throw TypeError(
              ".market.mass.UpdateOrder.itemsFinalized: object expected",
            );
          message.itemsFinalized =
            $root.market.mass.UpdateOrder.ItemsFinalized.fromObject(
              object.itemsFinalized,
            );
        }
        if (object.orderCanceled != null) {
          if (typeof object.orderCanceled !== "object")
            throw TypeError(
              ".market.mass.UpdateOrder.orderCanceled: object expected",
            );
          message.orderCanceled =
            $root.market.mass.UpdateOrder.OrderCanceled.fromObject(
              object.orderCanceled,
            );
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
        if (!options) options = {};
        let object = {};
        if (options.defaults) {
          if (options.bytes === String) object.eventId = "";
          else {
            object.eventId = [];
            if (options.bytes !== Array)
              object.eventId = $util.newBuffer(object.eventId);
          }
          if (options.bytes === String) object.orderId = "";
          else {
            object.orderId = [];
            if (options.bytes !== Array)
              object.orderId = $util.newBuffer(object.orderId);
          }
        }
        if (message.eventId != null && message.hasOwnProperty("eventId"))
          object.eventId =
            options.bytes === String
              ? $util.base64.encode(message.eventId, 0, message.eventId.length)
              : options.bytes === Array
                ? Array.prototype.slice.call(message.eventId)
                : message.eventId;
        if (message.orderId != null && message.hasOwnProperty("orderId"))
          object.orderId =
            options.bytes === String
              ? $util.base64.encode(message.orderId, 0, message.orderId.length)
              : options.bytes === Array
                ? Array.prototype.slice.call(message.orderId)
                : message.orderId;
        if (
          message.changeItems != null &&
          message.hasOwnProperty("changeItems")
        ) {
          object.changeItems =
            $root.market.mass.UpdateOrder.ChangeItems.toObject(
              message.changeItems,
              options,
            );
          if (options.oneofs) object.action = "changeItems";
        }
        if (
          message.itemsFinalized != null &&
          message.hasOwnProperty("itemsFinalized")
        ) {
          object.itemsFinalized =
            $root.market.mass.UpdateOrder.ItemsFinalized.toObject(
              message.itemsFinalized,
              options,
            );
          if (options.oneofs) object.action = "itemsFinalized";
        }
        if (
          message.orderCanceled != null &&
          message.hasOwnProperty("orderCanceled")
        ) {
          object.orderCanceled =
            $root.market.mass.UpdateOrder.OrderCanceled.toObject(
              message.orderCanceled,
              options,
            );
          if (options.oneofs) object.action = "orderCanceled";
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

      UpdateOrder.ChangeItems = (function () {
        /**
         * Properties of a ChangeItems.
         * @memberof market.mass.UpdateOrder
         * @interface IChangeItems
         * @property {Uint8Array|null} [itemId] ChangeItems itemId
         * @property {number|null} [quantity] ChangeItems quantity
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
          if (properties)
            for (
              let keys = Object.keys(properties), i = 0;
              i < keys.length;
              ++i
            )
              if (properties[keys[i]] != null)
                this[keys[i]] = properties[keys[i]];
        }

        /**
         * ChangeItems itemId.
         * @member {Uint8Array} itemId
         * @memberof market.mass.UpdateOrder.ChangeItems
         * @instance
         */
        ChangeItems.prototype.itemId = $util.newBuffer([]);

        /**
         * ChangeItems quantity.
         * @member {number} quantity
         * @memberof market.mass.UpdateOrder.ChangeItems
         * @instance
         */
        ChangeItems.prototype.quantity = 0;

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
          if (!writer) writer = $Writer.create();
          if (
            message.itemId != null &&
            Object.hasOwnProperty.call(message, "itemId")
          )
            writer.uint32(/* id 1, wireType 2 =*/ 10).bytes(message.itemId);
          if (
            message.quantity != null &&
            Object.hasOwnProperty.call(message, "quantity")
          )
            writer.uint32(/* id 2, wireType 0 =*/ 16).sint32(message.quantity);
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
        ChangeItems.encodeDelimited = function encodeDelimited(
          message,
          writer,
        ) {
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
          if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
          let end = length === undefined ? reader.len : reader.pos + length,
            message = new $root.market.mass.UpdateOrder.ChangeItems();
          while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
              case 1: {
                message.itemId = reader.bytes();
                break;
              }
              case 2: {
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
          if (!(reader instanceof $Reader)) reader = new $Reader(reader);
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
          if (message.itemId != null && message.hasOwnProperty("itemId"))
            if (
              !(
                (message.itemId && typeof message.itemId.length === "number") ||
                $util.isString(message.itemId)
              )
            )
              return "itemId: buffer expected";
          if (message.quantity != null && message.hasOwnProperty("quantity"))
            if (!$util.isInteger(message.quantity))
              return "quantity: integer expected";
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
          let message = new $root.market.mass.UpdateOrder.ChangeItems();
          if (object.itemId != null)
            if (typeof object.itemId === "string")
              $util.base64.decode(
                object.itemId,
                (message.itemId = $util.newBuffer(
                  $util.base64.length(object.itemId),
                )),
                0,
              );
            else if (object.itemId.length >= 0) message.itemId = object.itemId;
          if (object.quantity != null) message.quantity = object.quantity | 0;
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
          if (!options) options = {};
          let object = {};
          if (options.defaults) {
            if (options.bytes === String) object.itemId = "";
            else {
              object.itemId = [];
              if (options.bytes !== Array)
                object.itemId = $util.newBuffer(object.itemId);
            }
            object.quantity = 0;
          }
          if (message.itemId != null && message.hasOwnProperty("itemId"))
            object.itemId =
              options.bytes === String
                ? $util.base64.encode(message.itemId, 0, message.itemId.length)
                : options.bytes === Array
                  ? Array.prototype.slice.call(message.itemId)
                  : message.itemId;
          if (message.quantity != null && message.hasOwnProperty("quantity"))
            object.quantity = message.quantity;
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

      UpdateOrder.ItemsFinalized = (function () {
        /**
         * Properties of an ItemsFinalized.
         * @memberof market.mass.UpdateOrder
         * @interface IItemsFinalized
         * @property {Uint8Array|null} [paymentId] ItemsFinalized paymentId
         * @property {string|null} [subTotal] ItemsFinalized subTotal
         * @property {string|null} [salesTax] ItemsFinalized salesTax
         * @property {string|null} [total] ItemsFinalized total
         * @property {string|null} [ttl] ItemsFinalized ttl
         * @property {Uint8Array|null} [orderHash] ItemsFinalized orderHash
         * @property {Uint8Array|null} [currencyAddr] ItemsFinalized currencyAddr
         * @property {string|null} [totalInCrypto] ItemsFinalized totalInCrypto
         * @property {Uint8Array|null} [payeeAddr] ItemsFinalized payeeAddr
         * @property {boolean|null} [isPaymentEndpoint] ItemsFinalized isPaymentEndpoint
         * @property {Uint8Array|null} [shopSignature] ItemsFinalized shopSignature
         */

        /**
         * Constructs a new ItemsFinalized.
         * @memberof market.mass.UpdateOrder
         * @classdesc Represents an ItemsFinalized.
         * @implements IItemsFinalized
         * @constructor
         * @param {market.mass.UpdateOrder.IItemsFinalized=} [properties] Properties to set
         */
        function ItemsFinalized(properties) {
          if (properties)
            for (
              let keys = Object.keys(properties), i = 0;
              i < keys.length;
              ++i
            )
              if (properties[keys[i]] != null)
                this[keys[i]] = properties[keys[i]];
        }

        /**
         * ItemsFinalized paymentId.
         * @member {Uint8Array} paymentId
         * @memberof market.mass.UpdateOrder.ItemsFinalized
         * @instance
         */
        ItemsFinalized.prototype.paymentId = $util.newBuffer([]);

        /**
         * ItemsFinalized subTotal.
         * @member {string} subTotal
         * @memberof market.mass.UpdateOrder.ItemsFinalized
         * @instance
         */
        ItemsFinalized.prototype.subTotal = "";

        /**
         * ItemsFinalized salesTax.
         * @member {string} salesTax
         * @memberof market.mass.UpdateOrder.ItemsFinalized
         * @instance
         */
        ItemsFinalized.prototype.salesTax = "";

        /**
         * ItemsFinalized total.
         * @member {string} total
         * @memberof market.mass.UpdateOrder.ItemsFinalized
         * @instance
         */
        ItemsFinalized.prototype.total = "";

        /**
         * ItemsFinalized ttl.
         * @member {string} ttl
         * @memberof market.mass.UpdateOrder.ItemsFinalized
         * @instance
         */
        ItemsFinalized.prototype.ttl = "";

        /**
         * ItemsFinalized orderHash.
         * @member {Uint8Array} orderHash
         * @memberof market.mass.UpdateOrder.ItemsFinalized
         * @instance
         */
        ItemsFinalized.prototype.orderHash = $util.newBuffer([]);

        /**
         * ItemsFinalized currencyAddr.
         * @member {Uint8Array} currencyAddr
         * @memberof market.mass.UpdateOrder.ItemsFinalized
         * @instance
         */
        ItemsFinalized.prototype.currencyAddr = $util.newBuffer([]);

        /**
         * ItemsFinalized totalInCrypto.
         * @member {string} totalInCrypto
         * @memberof market.mass.UpdateOrder.ItemsFinalized
         * @instance
         */
        ItemsFinalized.prototype.totalInCrypto = "";

        /**
         * ItemsFinalized payeeAddr.
         * @member {Uint8Array} payeeAddr
         * @memberof market.mass.UpdateOrder.ItemsFinalized
         * @instance
         */
        ItemsFinalized.prototype.payeeAddr = $util.newBuffer([]);

        /**
         * ItemsFinalized isPaymentEndpoint.
         * @member {boolean} isPaymentEndpoint
         * @memberof market.mass.UpdateOrder.ItemsFinalized
         * @instance
         */
        ItemsFinalized.prototype.isPaymentEndpoint = false;

        /**
         * ItemsFinalized shopSignature.
         * @member {Uint8Array} shopSignature
         * @memberof market.mass.UpdateOrder.ItemsFinalized
         * @instance
         */
        ItemsFinalized.prototype.shopSignature = $util.newBuffer([]);

        /**
         * Creates a new ItemsFinalized instance using the specified properties.
         * @function create
         * @memberof market.mass.UpdateOrder.ItemsFinalized
         * @static
         * @param {market.mass.UpdateOrder.IItemsFinalized=} [properties] Properties to set
         * @returns {market.mass.UpdateOrder.ItemsFinalized} ItemsFinalized instance
         */
        ItemsFinalized.create = function create(properties) {
          return new ItemsFinalized(properties);
        };

        /**
         * Encodes the specified ItemsFinalized message. Does not implicitly {@link market.mass.UpdateOrder.ItemsFinalized.verify|verify} messages.
         * @function encode
         * @memberof market.mass.UpdateOrder.ItemsFinalized
         * @static
         * @param {market.mass.UpdateOrder.IItemsFinalized} message ItemsFinalized message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ItemsFinalized.encode = function encode(message, writer) {
          if (!writer) writer = $Writer.create();
          if (
            message.paymentId != null &&
            Object.hasOwnProperty.call(message, "paymentId")
          )
            writer.uint32(/* id 1, wireType 2 =*/ 10).bytes(message.paymentId);
          if (
            message.subTotal != null &&
            Object.hasOwnProperty.call(message, "subTotal")
          )
            writer.uint32(/* id 2, wireType 2 =*/ 18).string(message.subTotal);
          if (
            message.salesTax != null &&
            Object.hasOwnProperty.call(message, "salesTax")
          )
            writer.uint32(/* id 3, wireType 2 =*/ 26).string(message.salesTax);
          if (
            message.total != null &&
            Object.hasOwnProperty.call(message, "total")
          )
            writer.uint32(/* id 4, wireType 2 =*/ 34).string(message.total);
          if (message.ttl != null && Object.hasOwnProperty.call(message, "ttl"))
            writer.uint32(/* id 5, wireType 2 =*/ 42).string(message.ttl);
          if (
            message.orderHash != null &&
            Object.hasOwnProperty.call(message, "orderHash")
          )
            writer.uint32(/* id 6, wireType 2 =*/ 50).bytes(message.orderHash);
          if (
            message.currencyAddr != null &&
            Object.hasOwnProperty.call(message, "currencyAddr")
          )
            writer
              .uint32(/* id 7, wireType 2 =*/ 58)
              .bytes(message.currencyAddr);
          if (
            message.totalInCrypto != null &&
            Object.hasOwnProperty.call(message, "totalInCrypto")
          )
            writer
              .uint32(/* id 8, wireType 2 =*/ 66)
              .string(message.totalInCrypto);
          if (
            message.payeeAddr != null &&
            Object.hasOwnProperty.call(message, "payeeAddr")
          )
            writer.uint32(/* id 9, wireType 2 =*/ 74).bytes(message.payeeAddr);
          if (
            message.isPaymentEndpoint != null &&
            Object.hasOwnProperty.call(message, "isPaymentEndpoint")
          )
            writer
              .uint32(/* id 10, wireType 0 =*/ 80)
              .bool(message.isPaymentEndpoint);
          if (
            message.shopSignature != null &&
            Object.hasOwnProperty.call(message, "shopSignature")
          )
            writer
              .uint32(/* id 11, wireType 2 =*/ 90)
              .bytes(message.shopSignature);
          return writer;
        };

        /**
         * Encodes the specified ItemsFinalized message, length delimited. Does not implicitly {@link market.mass.UpdateOrder.ItemsFinalized.verify|verify} messages.
         * @function encodeDelimited
         * @memberof market.mass.UpdateOrder.ItemsFinalized
         * @static
         * @param {market.mass.UpdateOrder.IItemsFinalized} message ItemsFinalized message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ItemsFinalized.encodeDelimited = function encodeDelimited(
          message,
          writer,
        ) {
          return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an ItemsFinalized message from the specified reader or buffer.
         * @function decode
         * @memberof market.mass.UpdateOrder.ItemsFinalized
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {market.mass.UpdateOrder.ItemsFinalized} ItemsFinalized
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ItemsFinalized.decode = function decode(reader, length) {
          if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
          let end = length === undefined ? reader.len : reader.pos + length,
            message = new $root.market.mass.UpdateOrder.ItemsFinalized();
          while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
              case 1: {
                message.paymentId = reader.bytes();
                break;
              }
              case 2: {
                message.subTotal = reader.string();
                break;
              }
              case 3: {
                message.salesTax = reader.string();
                break;
              }
              case 4: {
                message.total = reader.string();
                break;
              }
              case 5: {
                message.ttl = reader.string();
                break;
              }
              case 6: {
                message.orderHash = reader.bytes();
                break;
              }
              case 7: {
                message.currencyAddr = reader.bytes();
                break;
              }
              case 8: {
                message.totalInCrypto = reader.string();
                break;
              }
              case 9: {
                message.payeeAddr = reader.bytes();
                break;
              }
              case 10: {
                message.isPaymentEndpoint = reader.bool();
                break;
              }
              case 11: {
                message.shopSignature = reader.bytes();
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
         * Decodes an ItemsFinalized message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof market.mass.UpdateOrder.ItemsFinalized
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {market.mass.UpdateOrder.ItemsFinalized} ItemsFinalized
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ItemsFinalized.decodeDelimited = function decodeDelimited(reader) {
          if (!(reader instanceof $Reader)) reader = new $Reader(reader);
          return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an ItemsFinalized message.
         * @function verify
         * @memberof market.mass.UpdateOrder.ItemsFinalized
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ItemsFinalized.verify = function verify(message) {
          if (typeof message !== "object" || message === null)
            return "object expected";
          if (message.paymentId != null && message.hasOwnProperty("paymentId"))
            if (
              !(
                (message.paymentId &&
                  typeof message.paymentId.length === "number") ||
                $util.isString(message.paymentId)
              )
            )
              return "paymentId: buffer expected";
          if (message.subTotal != null && message.hasOwnProperty("subTotal"))
            if (!$util.isString(message.subTotal))
              return "subTotal: string expected";
          if (message.salesTax != null && message.hasOwnProperty("salesTax"))
            if (!$util.isString(message.salesTax))
              return "salesTax: string expected";
          if (message.total != null && message.hasOwnProperty("total"))
            if (!$util.isString(message.total)) return "total: string expected";
          if (message.ttl != null && message.hasOwnProperty("ttl"))
            if (!$util.isString(message.ttl)) return "ttl: string expected";
          if (message.orderHash != null && message.hasOwnProperty("orderHash"))
            if (
              !(
                (message.orderHash &&
                  typeof message.orderHash.length === "number") ||
                $util.isString(message.orderHash)
              )
            )
              return "orderHash: buffer expected";
          if (
            message.currencyAddr != null &&
            message.hasOwnProperty("currencyAddr")
          )
            if (
              !(
                (message.currencyAddr &&
                  typeof message.currencyAddr.length === "number") ||
                $util.isString(message.currencyAddr)
              )
            )
              return "currencyAddr: buffer expected";
          if (
            message.totalInCrypto != null &&
            message.hasOwnProperty("totalInCrypto")
          )
            if (!$util.isString(message.totalInCrypto))
              return "totalInCrypto: string expected";
          if (message.payeeAddr != null && message.hasOwnProperty("payeeAddr"))
            if (
              !(
                (message.payeeAddr &&
                  typeof message.payeeAddr.length === "number") ||
                $util.isString(message.payeeAddr)
              )
            )
              return "payeeAddr: buffer expected";
          if (
            message.isPaymentEndpoint != null &&
            message.hasOwnProperty("isPaymentEndpoint")
          )
            if (typeof message.isPaymentEndpoint !== "boolean")
              return "isPaymentEndpoint: boolean expected";
          if (
            message.shopSignature != null &&
            message.hasOwnProperty("shopSignature")
          )
            if (
              !(
                (message.shopSignature &&
                  typeof message.shopSignature.length === "number") ||
                $util.isString(message.shopSignature)
              )
            )
              return "shopSignature: buffer expected";
          return null;
        };

        /**
         * Creates an ItemsFinalized message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof market.mass.UpdateOrder.ItemsFinalized
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {market.mass.UpdateOrder.ItemsFinalized} ItemsFinalized
         */
        ItemsFinalized.fromObject = function fromObject(object) {
          if (object instanceof $root.market.mass.UpdateOrder.ItemsFinalized)
            return object;
          let message = new $root.market.mass.UpdateOrder.ItemsFinalized();
          if (object.paymentId != null)
            if (typeof object.paymentId === "string")
              $util.base64.decode(
                object.paymentId,
                (message.paymentId = $util.newBuffer(
                  $util.base64.length(object.paymentId),
                )),
                0,
              );
            else if (object.paymentId.length >= 0)
              message.paymentId = object.paymentId;
          if (object.subTotal != null)
            message.subTotal = String(object.subTotal);
          if (object.salesTax != null)
            message.salesTax = String(object.salesTax);
          if (object.total != null) message.total = String(object.total);
          if (object.ttl != null) message.ttl = String(object.ttl);
          if (object.orderHash != null)
            if (typeof object.orderHash === "string")
              $util.base64.decode(
                object.orderHash,
                (message.orderHash = $util.newBuffer(
                  $util.base64.length(object.orderHash),
                )),
                0,
              );
            else if (object.orderHash.length >= 0)
              message.orderHash = object.orderHash;
          if (object.currencyAddr != null)
            if (typeof object.currencyAddr === "string")
              $util.base64.decode(
                object.currencyAddr,
                (message.currencyAddr = $util.newBuffer(
                  $util.base64.length(object.currencyAddr),
                )),
                0,
              );
            else if (object.currencyAddr.length >= 0)
              message.currencyAddr = object.currencyAddr;
          if (object.totalInCrypto != null)
            message.totalInCrypto = String(object.totalInCrypto);
          if (object.payeeAddr != null)
            if (typeof object.payeeAddr === "string")
              $util.base64.decode(
                object.payeeAddr,
                (message.payeeAddr = $util.newBuffer(
                  $util.base64.length(object.payeeAddr),
                )),
                0,
              );
            else if (object.payeeAddr.length >= 0)
              message.payeeAddr = object.payeeAddr;
          if (object.isPaymentEndpoint != null)
            message.isPaymentEndpoint = Boolean(object.isPaymentEndpoint);
          if (object.shopSignature != null)
            if (typeof object.shopSignature === "string")
              $util.base64.decode(
                object.shopSignature,
                (message.shopSignature = $util.newBuffer(
                  $util.base64.length(object.shopSignature),
                )),
                0,
              );
            else if (object.shopSignature.length >= 0)
              message.shopSignature = object.shopSignature;
          return message;
        };

        /**
         * Creates a plain object from an ItemsFinalized message. Also converts values to other types if specified.
         * @function toObject
         * @memberof market.mass.UpdateOrder.ItemsFinalized
         * @static
         * @param {market.mass.UpdateOrder.ItemsFinalized} message ItemsFinalized
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ItemsFinalized.toObject = function toObject(message, options) {
          if (!options) options = {};
          let object = {};
          if (options.defaults) {
            if (options.bytes === String) object.paymentId = "";
            else {
              object.paymentId = [];
              if (options.bytes !== Array)
                object.paymentId = $util.newBuffer(object.paymentId);
            }
            object.subTotal = "";
            object.salesTax = "";
            object.total = "";
            object.ttl = "";
            if (options.bytes === String) object.orderHash = "";
            else {
              object.orderHash = [];
              if (options.bytes !== Array)
                object.orderHash = $util.newBuffer(object.orderHash);
            }
            if (options.bytes === String) object.currencyAddr = "";
            else {
              object.currencyAddr = [];
              if (options.bytes !== Array)
                object.currencyAddr = $util.newBuffer(object.currencyAddr);
            }
            object.totalInCrypto = "";
            if (options.bytes === String) object.payeeAddr = "";
            else {
              object.payeeAddr = [];
              if (options.bytes !== Array)
                object.payeeAddr = $util.newBuffer(object.payeeAddr);
            }
            object.isPaymentEndpoint = false;
            if (options.bytes === String) object.shopSignature = "";
            else {
              object.shopSignature = [];
              if (options.bytes !== Array)
                object.shopSignature = $util.newBuffer(object.shopSignature);
            }
          }
          if (message.paymentId != null && message.hasOwnProperty("paymentId"))
            object.paymentId =
              options.bytes === String
                ? $util.base64.encode(
                    message.paymentId,
                    0,
                    message.paymentId.length,
                  )
                : options.bytes === Array
                  ? Array.prototype.slice.call(message.paymentId)
                  : message.paymentId;
          if (message.subTotal != null && message.hasOwnProperty("subTotal"))
            object.subTotal = message.subTotal;
          if (message.salesTax != null && message.hasOwnProperty("salesTax"))
            object.salesTax = message.salesTax;
          if (message.total != null && message.hasOwnProperty("total"))
            object.total = message.total;
          if (message.ttl != null && message.hasOwnProperty("ttl"))
            object.ttl = message.ttl;
          if (message.orderHash != null && message.hasOwnProperty("orderHash"))
            object.orderHash =
              options.bytes === String
                ? $util.base64.encode(
                    message.orderHash,
                    0,
                    message.orderHash.length,
                  )
                : options.bytes === Array
                  ? Array.prototype.slice.call(message.orderHash)
                  : message.orderHash;
          if (
            message.currencyAddr != null &&
            message.hasOwnProperty("currencyAddr")
          )
            object.currencyAddr =
              options.bytes === String
                ? $util.base64.encode(
                    message.currencyAddr,
                    0,
                    message.currencyAddr.length,
                  )
                : options.bytes === Array
                  ? Array.prototype.slice.call(message.currencyAddr)
                  : message.currencyAddr;
          if (
            message.totalInCrypto != null &&
            message.hasOwnProperty("totalInCrypto")
          )
            object.totalInCrypto = message.totalInCrypto;
          if (message.payeeAddr != null && message.hasOwnProperty("payeeAddr"))
            object.payeeAddr =
              options.bytes === String
                ? $util.base64.encode(
                    message.payeeAddr,
                    0,
                    message.payeeAddr.length,
                  )
                : options.bytes === Array
                  ? Array.prototype.slice.call(message.payeeAddr)
                  : message.payeeAddr;
          if (
            message.isPaymentEndpoint != null &&
            message.hasOwnProperty("isPaymentEndpoint")
          )
            object.isPaymentEndpoint = message.isPaymentEndpoint;
          if (
            message.shopSignature != null &&
            message.hasOwnProperty("shopSignature")
          )
            object.shopSignature =
              options.bytes === String
                ? $util.base64.encode(
                    message.shopSignature,
                    0,
                    message.shopSignature.length,
                  )
                : options.bytes === Array
                  ? Array.prototype.slice.call(message.shopSignature)
                  : message.shopSignature;
          return object;
        };

        /**
         * Converts this ItemsFinalized to JSON.
         * @function toJSON
         * @memberof market.mass.UpdateOrder.ItemsFinalized
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ItemsFinalized.prototype.toJSON = function toJSON() {
          return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ItemsFinalized
         * @function getTypeUrl
         * @memberof market.mass.UpdateOrder.ItemsFinalized
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ItemsFinalized.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
          if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
          }
          return typeUrlPrefix + "/market.mass.UpdateOrder.ItemsFinalized";
        };

        return ItemsFinalized;
      })();

      UpdateOrder.OrderCanceled = (function () {
        /**
         * Properties of an OrderCanceled.
         * @memberof market.mass.UpdateOrder
         * @interface IOrderCanceled
         * @property {number|Long|null} [timestamp] OrderCanceled timestamp
         */

        /**
         * Constructs a new OrderCanceled.
         * @memberof market.mass.UpdateOrder
         * @classdesc Represents an OrderCanceled.
         * @implements IOrderCanceled
         * @constructor
         * @param {market.mass.UpdateOrder.IOrderCanceled=} [properties] Properties to set
         */
        function OrderCanceled(properties) {
          if (properties)
            for (
              let keys = Object.keys(properties), i = 0;
              i < keys.length;
              ++i
            )
              if (properties[keys[i]] != null)
                this[keys[i]] = properties[keys[i]];
        }

        /**
         * OrderCanceled timestamp.
         * @member {number|Long} timestamp
         * @memberof market.mass.UpdateOrder.OrderCanceled
         * @instance
         */
        OrderCanceled.prototype.timestamp = $util.Long
          ? $util.Long.fromBits(0, 0, true)
          : 0;

        /**
         * Creates a new OrderCanceled instance using the specified properties.
         * @function create
         * @memberof market.mass.UpdateOrder.OrderCanceled
         * @static
         * @param {market.mass.UpdateOrder.IOrderCanceled=} [properties] Properties to set
         * @returns {market.mass.UpdateOrder.OrderCanceled} OrderCanceled instance
         */
        OrderCanceled.create = function create(properties) {
          return new OrderCanceled(properties);
        };

        /**
         * Encodes the specified OrderCanceled message. Does not implicitly {@link market.mass.UpdateOrder.OrderCanceled.verify|verify} messages.
         * @function encode
         * @memberof market.mass.UpdateOrder.OrderCanceled
         * @static
         * @param {market.mass.UpdateOrder.IOrderCanceled} message OrderCanceled message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        OrderCanceled.encode = function encode(message, writer) {
          if (!writer) writer = $Writer.create();
          if (
            message.timestamp != null &&
            Object.hasOwnProperty.call(message, "timestamp")
          )
            writer.uint32(/* id 1, wireType 0 =*/ 8).uint64(message.timestamp);
          return writer;
        };

        /**
         * Encodes the specified OrderCanceled message, length delimited. Does not implicitly {@link market.mass.UpdateOrder.OrderCanceled.verify|verify} messages.
         * @function encodeDelimited
         * @memberof market.mass.UpdateOrder.OrderCanceled
         * @static
         * @param {market.mass.UpdateOrder.IOrderCanceled} message OrderCanceled message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        OrderCanceled.encodeDelimited = function encodeDelimited(
          message,
          writer,
        ) {
          return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an OrderCanceled message from the specified reader or buffer.
         * @function decode
         * @memberof market.mass.UpdateOrder.OrderCanceled
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {market.mass.UpdateOrder.OrderCanceled} OrderCanceled
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        OrderCanceled.decode = function decode(reader, length) {
          if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
          let end = length === undefined ? reader.len : reader.pos + length,
            message = new $root.market.mass.UpdateOrder.OrderCanceled();
          while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
              case 1: {
                message.timestamp = reader.uint64();
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
         * Decodes an OrderCanceled message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof market.mass.UpdateOrder.OrderCanceled
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {market.mass.UpdateOrder.OrderCanceled} OrderCanceled
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        OrderCanceled.decodeDelimited = function decodeDelimited(reader) {
          if (!(reader instanceof $Reader)) reader = new $Reader(reader);
          return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an OrderCanceled message.
         * @function verify
         * @memberof market.mass.UpdateOrder.OrderCanceled
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        OrderCanceled.verify = function verify(message) {
          if (typeof message !== "object" || message === null)
            return "object expected";
          if (message.timestamp != null && message.hasOwnProperty("timestamp"))
            if (
              !$util.isInteger(message.timestamp) &&
              !(
                message.timestamp &&
                $util.isInteger(message.timestamp.low) &&
                $util.isInteger(message.timestamp.high)
              )
            )
              return "timestamp: integer|Long expected";
          return null;
        };

        /**
         * Creates an OrderCanceled message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof market.mass.UpdateOrder.OrderCanceled
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {market.mass.UpdateOrder.OrderCanceled} OrderCanceled
         */
        OrderCanceled.fromObject = function fromObject(object) {
          if (object instanceof $root.market.mass.UpdateOrder.OrderCanceled)
            return object;
          let message = new $root.market.mass.UpdateOrder.OrderCanceled();
          if (object.timestamp != null)
            if ($util.Long)
              (message.timestamp = $util.Long.fromValue(
                object.timestamp,
              )).unsigned = true;
            else if (typeof object.timestamp === "string")
              message.timestamp = parseInt(object.timestamp, 10);
            else if (typeof object.timestamp === "number")
              message.timestamp = object.timestamp;
            else if (typeof object.timestamp === "object")
              message.timestamp = new $util.LongBits(
                object.timestamp.low >>> 0,
                object.timestamp.high >>> 0,
              ).toNumber(true);
          return message;
        };

        /**
         * Creates a plain object from an OrderCanceled message. Also converts values to other types if specified.
         * @function toObject
         * @memberof market.mass.UpdateOrder.OrderCanceled
         * @static
         * @param {market.mass.UpdateOrder.OrderCanceled} message OrderCanceled
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        OrderCanceled.toObject = function toObject(message, options) {
          if (!options) options = {};
          let object = {};
          if (options.defaults)
            if ($util.Long) {
              let long = new $util.Long(0, 0, true);
              object.timestamp =
                options.longs === String
                  ? long.toString()
                  : options.longs === Number
                    ? long.toNumber()
                    : long;
            } else object.timestamp = options.longs === String ? "0" : 0;
          if (message.timestamp != null && message.hasOwnProperty("timestamp"))
            if (typeof message.timestamp === "number")
              object.timestamp =
                options.longs === String
                  ? String(message.timestamp)
                  : message.timestamp;
            else
              object.timestamp =
                options.longs === String
                  ? $util.Long.prototype.toString.call(message.timestamp)
                  : options.longs === Number
                    ? new $util.LongBits(
                        message.timestamp.low >>> 0,
                        message.timestamp.high >>> 0,
                      ).toNumber(true)
                    : message.timestamp;
          return object;
        };

        /**
         * Converts this OrderCanceled to JSON.
         * @function toJSON
         * @memberof market.mass.UpdateOrder.OrderCanceled
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        OrderCanceled.prototype.toJSON = function toJSON() {
          return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for OrderCanceled
         * @function getTypeUrl
         * @memberof market.mass.UpdateOrder.OrderCanceled
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        OrderCanceled.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
          if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
          }
          return typeUrlPrefix + "/market.mass.UpdateOrder.OrderCanceled";
        };

        return OrderCanceled;
      })();

      return UpdateOrder;
    })();

    mass.StoreEvent = (function () {
      /**
       * Properties of a StoreEvent.
       * @memberof market.mass
       * @interface IStoreEvent
       * @property {Uint8Array|null} [signature] StoreEvent signature
       * @property {market.mass.IStoreManifest|null} [storeManifest] StoreEvent storeManifest
       * @property {market.mass.IUpdateStoreManifest|null} [updateStoreManifest] StoreEvent updateStoreManifest
       * @property {market.mass.ICreateItem|null} [createItem] StoreEvent createItem
       * @property {market.mass.IUpdateItem|null} [updateItem] StoreEvent updateItem
       * @property {market.mass.ICreateTag|null} [createTag] StoreEvent createTag
       * @property {market.mass.IUpdateTag|null} [updateTag] StoreEvent updateTag
       * @property {market.mass.ICreateOrder|null} [createOrder] StoreEvent createOrder
       * @property {market.mass.IUpdateOrder|null} [updateOrder] StoreEvent updateOrder
       * @property {market.mass.IChangeStock|null} [changeStock] StoreEvent changeStock
       * @property {market.mass.INewKeyCard|null} [newKeyCard] StoreEvent newKeyCard
       */

      /**
       * Constructs a new StoreEvent.
       * @memberof market.mass
       * @classdesc Represents a StoreEvent.
       * @implements IStoreEvent
       * @constructor
       * @param {market.mass.IStoreEvent=} [properties] Properties to set
       */
      function StoreEvent(properties) {
        if (properties)
          for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
            if (properties[keys[i]] != null)
              this[keys[i]] = properties[keys[i]];
      }

      /**
       * StoreEvent signature.
       * @member {Uint8Array} signature
       * @memberof market.mass.StoreEvent
       * @instance
       */
      StoreEvent.prototype.signature = $util.newBuffer([]);

      /**
       * StoreEvent storeManifest.
       * @member {market.mass.IStoreManifest|null|undefined} storeManifest
       * @memberof market.mass.StoreEvent
       * @instance
       */
      StoreEvent.prototype.storeManifest = null;

      /**
       * StoreEvent updateStoreManifest.
       * @member {market.mass.IUpdateStoreManifest|null|undefined} updateStoreManifest
       * @memberof market.mass.StoreEvent
       * @instance
       */
      StoreEvent.prototype.updateStoreManifest = null;

      /**
       * StoreEvent createItem.
       * @member {market.mass.ICreateItem|null|undefined} createItem
       * @memberof market.mass.StoreEvent
       * @instance
       */
      StoreEvent.prototype.createItem = null;

      /**
       * StoreEvent updateItem.
       * @member {market.mass.IUpdateItem|null|undefined} updateItem
       * @memberof market.mass.StoreEvent
       * @instance
       */
      StoreEvent.prototype.updateItem = null;

      /**
       * StoreEvent createTag.
       * @member {market.mass.ICreateTag|null|undefined} createTag
       * @memberof market.mass.StoreEvent
       * @instance
       */
      StoreEvent.prototype.createTag = null;

      /**
       * StoreEvent updateTag.
       * @member {market.mass.IUpdateTag|null|undefined} updateTag
       * @memberof market.mass.StoreEvent
       * @instance
       */
      StoreEvent.prototype.updateTag = null;

      /**
       * StoreEvent createOrder.
       * @member {market.mass.ICreateOrder|null|undefined} createOrder
       * @memberof market.mass.StoreEvent
       * @instance
       */
      StoreEvent.prototype.createOrder = null;

      /**
       * StoreEvent updateOrder.
       * @member {market.mass.IUpdateOrder|null|undefined} updateOrder
       * @memberof market.mass.StoreEvent
       * @instance
       */
      StoreEvent.prototype.updateOrder = null;

      /**
       * StoreEvent changeStock.
       * @member {market.mass.IChangeStock|null|undefined} changeStock
       * @memberof market.mass.StoreEvent
       * @instance
       */
      StoreEvent.prototype.changeStock = null;

      /**
       * StoreEvent newKeyCard.
       * @member {market.mass.INewKeyCard|null|undefined} newKeyCard
       * @memberof market.mass.StoreEvent
       * @instance
       */
      StoreEvent.prototype.newKeyCard = null;

      // OneOf field names bound to virtual getters and setters
      let $oneOfFields;

      /**
       * StoreEvent union.
       * @member {"storeManifest"|"updateStoreManifest"|"createItem"|"updateItem"|"createTag"|"updateTag"|"createOrder"|"updateOrder"|"changeStock"|"newKeyCard"|undefined} union
       * @memberof market.mass.StoreEvent
       * @instance
       */
      Object.defineProperty(StoreEvent.prototype, "union", {
        get: $util.oneOfGetter(
          ($oneOfFields = [
            "storeManifest",
            "updateStoreManifest",
            "createItem",
            "updateItem",
            "createTag",
            "updateTag",
            "createOrder",
            "updateOrder",
            "changeStock",
            "newKeyCard",
          ]),
        ),
        set: $util.oneOfSetter($oneOfFields),
      });

      /**
       * Creates a new StoreEvent instance using the specified properties.
       * @function create
       * @memberof market.mass.StoreEvent
       * @static
       * @param {market.mass.IStoreEvent=} [properties] Properties to set
       * @returns {market.mass.StoreEvent} StoreEvent instance
       */
      StoreEvent.create = function create(properties) {
        return new StoreEvent(properties);
      };

      /**
       * Encodes the specified StoreEvent message. Does not implicitly {@link market.mass.StoreEvent.verify|verify} messages.
       * @function encode
       * @memberof market.mass.StoreEvent
       * @static
       * @param {market.mass.IStoreEvent} message StoreEvent message or plain object to encode
       * @param {$protobuf.Writer} [writer] Writer to encode to
       * @returns {$protobuf.Writer} Writer
       */
      StoreEvent.encode = function encode(message, writer) {
        if (!writer) writer = $Writer.create();
        if (
          message.signature != null &&
          Object.hasOwnProperty.call(message, "signature")
        )
          writer.uint32(/* id 1, wireType 2 =*/ 10).bytes(message.signature);
        if (
          message.storeManifest != null &&
          Object.hasOwnProperty.call(message, "storeManifest")
        )
          $root.market.mass.StoreManifest.encode(
            message.storeManifest,
            writer.uint32(/* id 2, wireType 2 =*/ 18).fork(),
          ).ldelim();
        if (
          message.updateStoreManifest != null &&
          Object.hasOwnProperty.call(message, "updateStoreManifest")
        )
          $root.market.mass.UpdateStoreManifest.encode(
            message.updateStoreManifest,
            writer.uint32(/* id 3, wireType 2 =*/ 26).fork(),
          ).ldelim();
        if (
          message.createItem != null &&
          Object.hasOwnProperty.call(message, "createItem")
        )
          $root.market.mass.CreateItem.encode(
            message.createItem,
            writer.uint32(/* id 4, wireType 2 =*/ 34).fork(),
          ).ldelim();
        if (
          message.updateItem != null &&
          Object.hasOwnProperty.call(message, "updateItem")
        )
          $root.market.mass.UpdateItem.encode(
            message.updateItem,
            writer.uint32(/* id 5, wireType 2 =*/ 42).fork(),
          ).ldelim();
        if (
          message.createTag != null &&
          Object.hasOwnProperty.call(message, "createTag")
        )
          $root.market.mass.CreateTag.encode(
            message.createTag,
            writer.uint32(/* id 6, wireType 2 =*/ 50).fork(),
          ).ldelim();
        if (
          message.updateTag != null &&
          Object.hasOwnProperty.call(message, "updateTag")
        )
          $root.market.mass.UpdateTag.encode(
            message.updateTag,
            writer.uint32(/* id 7, wireType 2 =*/ 58).fork(),
          ).ldelim();
        if (
          message.createOrder != null &&
          Object.hasOwnProperty.call(message, "createOrder")
        )
          $root.market.mass.CreateOrder.encode(
            message.createOrder,
            writer.uint32(/* id 8, wireType 2 =*/ 66).fork(),
          ).ldelim();
        if (
          message.updateOrder != null &&
          Object.hasOwnProperty.call(message, "updateOrder")
        )
          $root.market.mass.UpdateOrder.encode(
            message.updateOrder,
            writer.uint32(/* id 9, wireType 2 =*/ 74).fork(),
          ).ldelim();
        if (
          message.changeStock != null &&
          Object.hasOwnProperty.call(message, "changeStock")
        )
          $root.market.mass.ChangeStock.encode(
            message.changeStock,
            writer.uint32(/* id 12, wireType 2 =*/ 98).fork(),
          ).ldelim();
        if (
          message.newKeyCard != null &&
          Object.hasOwnProperty.call(message, "newKeyCard")
        )
          $root.market.mass.NewKeyCard.encode(
            message.newKeyCard,
            writer.uint32(/* id 13, wireType 2 =*/ 106).fork(),
          ).ldelim();
        return writer;
      };

      /**
       * Encodes the specified StoreEvent message, length delimited. Does not implicitly {@link market.mass.StoreEvent.verify|verify} messages.
       * @function encodeDelimited
       * @memberof market.mass.StoreEvent
       * @static
       * @param {market.mass.IStoreEvent} message StoreEvent message or plain object to encode
       * @param {$protobuf.Writer} [writer] Writer to encode to
       * @returns {$protobuf.Writer} Writer
       */
      StoreEvent.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
      };

      /**
       * Decodes a StoreEvent message from the specified reader or buffer.
       * @function decode
       * @memberof market.mass.StoreEvent
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @param {number} [length] Message length if known beforehand
       * @returns {market.mass.StoreEvent} StoreEvent
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      StoreEvent.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length,
          message = new $root.market.mass.StoreEvent();
        while (reader.pos < end) {
          let tag = reader.uint32();
          switch (tag >>> 3) {
            case 1: {
              message.signature = reader.bytes();
              break;
            }
            case 2: {
              message.storeManifest = $root.market.mass.StoreManifest.decode(
                reader,
                reader.uint32(),
              );
              break;
            }
            case 3: {
              message.updateStoreManifest =
                $root.market.mass.UpdateStoreManifest.decode(
                  reader,
                  reader.uint32(),
                );
              break;
            }
            case 4: {
              message.createItem = $root.market.mass.CreateItem.decode(
                reader,
                reader.uint32(),
              );
              break;
            }
            case 5: {
              message.updateItem = $root.market.mass.UpdateItem.decode(
                reader,
                reader.uint32(),
              );
              break;
            }
            case 6: {
              message.createTag = $root.market.mass.CreateTag.decode(
                reader,
                reader.uint32(),
              );
              break;
            }
            case 7: {
              message.updateTag = $root.market.mass.UpdateTag.decode(
                reader,
                reader.uint32(),
              );
              break;
            }
            case 8: {
              message.createOrder = $root.market.mass.CreateOrder.decode(
                reader,
                reader.uint32(),
              );
              break;
            }
            case 9: {
              message.updateOrder = $root.market.mass.UpdateOrder.decode(
                reader,
                reader.uint32(),
              );
              break;
            }
            case 12: {
              message.changeStock = $root.market.mass.ChangeStock.decode(
                reader,
                reader.uint32(),
              );
              break;
            }
            case 13: {
              message.newKeyCard = $root.market.mass.NewKeyCard.decode(
                reader,
                reader.uint32(),
              );
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
       * Decodes a StoreEvent message from the specified reader or buffer, length delimited.
       * @function decodeDelimited
       * @memberof market.mass.StoreEvent
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @returns {market.mass.StoreEvent} StoreEvent
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      StoreEvent.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader)) reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
      };

      /**
       * Verifies a StoreEvent message.
       * @function verify
       * @memberof market.mass.StoreEvent
       * @static
       * @param {Object.<string,*>} message Plain object to verify
       * @returns {string|null} `null` if valid, otherwise the reason why it is not
       */
      StoreEvent.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
          return "object expected";
        let properties = {};
        if (message.signature != null && message.hasOwnProperty("signature"))
          if (
            !(
              (message.signature &&
                typeof message.signature.length === "number") ||
              $util.isString(message.signature)
            )
          )
            return "signature: buffer expected";
        if (
          message.storeManifest != null &&
          message.hasOwnProperty("storeManifest")
        ) {
          properties.union = 1;
          {
            let error = $root.market.mass.StoreManifest.verify(
              message.storeManifest,
            );
            if (error) return "storeManifest." + error;
          }
        }
        if (
          message.updateStoreManifest != null &&
          message.hasOwnProperty("updateStoreManifest")
        ) {
          if (properties.union === 1) return "union: multiple values";
          properties.union = 1;
          {
            let error = $root.market.mass.UpdateStoreManifest.verify(
              message.updateStoreManifest,
            );
            if (error) return "updateStoreManifest." + error;
          }
        }
        if (
          message.createItem != null &&
          message.hasOwnProperty("createItem")
        ) {
          if (properties.union === 1) return "union: multiple values";
          properties.union = 1;
          {
            let error = $root.market.mass.CreateItem.verify(message.createItem);
            if (error) return "createItem." + error;
          }
        }
        if (
          message.updateItem != null &&
          message.hasOwnProperty("updateItem")
        ) {
          if (properties.union === 1) return "union: multiple values";
          properties.union = 1;
          {
            let error = $root.market.mass.UpdateItem.verify(message.updateItem);
            if (error) return "updateItem." + error;
          }
        }
        if (message.createTag != null && message.hasOwnProperty("createTag")) {
          if (properties.union === 1) return "union: multiple values";
          properties.union = 1;
          {
            let error = $root.market.mass.CreateTag.verify(message.createTag);
            if (error) return "createTag." + error;
          }
        }
        if (message.updateTag != null && message.hasOwnProperty("updateTag")) {
          if (properties.union === 1) return "union: multiple values";
          properties.union = 1;
          {
            let error = $root.market.mass.UpdateTag.verify(message.updateTag);
            if (error) return "updateTag." + error;
          }
        }
        if (
          message.createOrder != null &&
          message.hasOwnProperty("createOrder")
        ) {
          if (properties.union === 1) return "union: multiple values";
          properties.union = 1;
          {
            let error = $root.market.mass.CreateOrder.verify(
              message.createOrder,
            );
            if (error) return "createOrder." + error;
          }
        }
        if (
          message.updateOrder != null &&
          message.hasOwnProperty("updateOrder")
        ) {
          if (properties.union === 1) return "union: multiple values";
          properties.union = 1;
          {
            let error = $root.market.mass.UpdateOrder.verify(
              message.updateOrder,
            );
            if (error) return "updateOrder." + error;
          }
        }
        if (
          message.changeStock != null &&
          message.hasOwnProperty("changeStock")
        ) {
          if (properties.union === 1) return "union: multiple values";
          properties.union = 1;
          {
            let error = $root.market.mass.ChangeStock.verify(
              message.changeStock,
            );
            if (error) return "changeStock." + error;
          }
        }
        if (
          message.newKeyCard != null &&
          message.hasOwnProperty("newKeyCard")
        ) {
          if (properties.union === 1) return "union: multiple values";
          properties.union = 1;
          {
            let error = $root.market.mass.NewKeyCard.verify(message.newKeyCard);
            if (error) return "newKeyCard." + error;
          }
        }
        return null;
      };

      /**
       * Creates a StoreEvent message from a plain object. Also converts values to their respective internal types.
       * @function fromObject
       * @memberof market.mass.StoreEvent
       * @static
       * @param {Object.<string,*>} object Plain object
       * @returns {market.mass.StoreEvent} StoreEvent
       */
      StoreEvent.fromObject = function fromObject(object) {
        if (object instanceof $root.market.mass.StoreEvent) return object;
        let message = new $root.market.mass.StoreEvent();
        if (object.signature != null)
          if (typeof object.signature === "string")
            $util.base64.decode(
              object.signature,
              (message.signature = $util.newBuffer(
                $util.base64.length(object.signature),
              )),
              0,
            );
          else if (object.signature.length >= 0)
            message.signature = object.signature;
        if (object.storeManifest != null) {
          if (typeof object.storeManifest !== "object")
            throw TypeError(
              ".market.mass.StoreEvent.storeManifest: object expected",
            );
          message.storeManifest = $root.market.mass.StoreManifest.fromObject(
            object.storeManifest,
          );
        }
        if (object.updateStoreManifest != null) {
          if (typeof object.updateStoreManifest !== "object")
            throw TypeError(
              ".market.mass.StoreEvent.updateStoreManifest: object expected",
            );
          message.updateStoreManifest =
            $root.market.mass.UpdateStoreManifest.fromObject(
              object.updateStoreManifest,
            );
        }
        if (object.createItem != null) {
          if (typeof object.createItem !== "object")
            throw TypeError(
              ".market.mass.StoreEvent.createItem: object expected",
            );
          message.createItem = $root.market.mass.CreateItem.fromObject(
            object.createItem,
          );
        }
        if (object.updateItem != null) {
          if (typeof object.updateItem !== "object")
            throw TypeError(
              ".market.mass.StoreEvent.updateItem: object expected",
            );
          message.updateItem = $root.market.mass.UpdateItem.fromObject(
            object.updateItem,
          );
        }
        if (object.createTag != null) {
          if (typeof object.createTag !== "object")
            throw TypeError(
              ".market.mass.StoreEvent.createTag: object expected",
            );
          message.createTag = $root.market.mass.CreateTag.fromObject(
            object.createTag,
          );
        }
        if (object.updateTag != null) {
          if (typeof object.updateTag !== "object")
            throw TypeError(
              ".market.mass.StoreEvent.updateTag: object expected",
            );
          message.updateTag = $root.market.mass.UpdateTag.fromObject(
            object.updateTag,
          );
        }
        if (object.createOrder != null) {
          if (typeof object.createOrder !== "object")
            throw TypeError(
              ".market.mass.StoreEvent.createOrder: object expected",
            );
          message.createOrder = $root.market.mass.CreateOrder.fromObject(
            object.createOrder,
          );
        }
        if (object.updateOrder != null) {
          if (typeof object.updateOrder !== "object")
            throw TypeError(
              ".market.mass.StoreEvent.updateOrder: object expected",
            );
          message.updateOrder = $root.market.mass.UpdateOrder.fromObject(
            object.updateOrder,
          );
        }
        if (object.changeStock != null) {
          if (typeof object.changeStock !== "object")
            throw TypeError(
              ".market.mass.StoreEvent.changeStock: object expected",
            );
          message.changeStock = $root.market.mass.ChangeStock.fromObject(
            object.changeStock,
          );
        }
        if (object.newKeyCard != null) {
          if (typeof object.newKeyCard !== "object")
            throw TypeError(
              ".market.mass.StoreEvent.newKeyCard: object expected",
            );
          message.newKeyCard = $root.market.mass.NewKeyCard.fromObject(
            object.newKeyCard,
          );
        }
        return message;
      };

      /**
       * Creates a plain object from a StoreEvent message. Also converts values to other types if specified.
       * @function toObject
       * @memberof market.mass.StoreEvent
       * @static
       * @param {market.mass.StoreEvent} message StoreEvent
       * @param {$protobuf.IConversionOptions} [options] Conversion options
       * @returns {Object.<string,*>} Plain object
       */
      StoreEvent.toObject = function toObject(message, options) {
        if (!options) options = {};
        let object = {};
        if (options.defaults)
          if (options.bytes === String) object.signature = "";
          else {
            object.signature = [];
            if (options.bytes !== Array)
              object.signature = $util.newBuffer(object.signature);
          }
        if (message.signature != null && message.hasOwnProperty("signature"))
          object.signature =
            options.bytes === String
              ? $util.base64.encode(
                  message.signature,
                  0,
                  message.signature.length,
                )
              : options.bytes === Array
                ? Array.prototype.slice.call(message.signature)
                : message.signature;
        if (
          message.storeManifest != null &&
          message.hasOwnProperty("storeManifest")
        ) {
          object.storeManifest = $root.market.mass.StoreManifest.toObject(
            message.storeManifest,
            options,
          );
          if (options.oneofs) object.union = "storeManifest";
        }
        if (
          message.updateStoreManifest != null &&
          message.hasOwnProperty("updateStoreManifest")
        ) {
          object.updateStoreManifest =
            $root.market.mass.UpdateStoreManifest.toObject(
              message.updateStoreManifest,
              options,
            );
          if (options.oneofs) object.union = "updateStoreManifest";
        }
        if (
          message.createItem != null &&
          message.hasOwnProperty("createItem")
        ) {
          object.createItem = $root.market.mass.CreateItem.toObject(
            message.createItem,
            options,
          );
          if (options.oneofs) object.union = "createItem";
        }
        if (
          message.updateItem != null &&
          message.hasOwnProperty("updateItem")
        ) {
          object.updateItem = $root.market.mass.UpdateItem.toObject(
            message.updateItem,
            options,
          );
          if (options.oneofs) object.union = "updateItem";
        }
        if (message.createTag != null && message.hasOwnProperty("createTag")) {
          object.createTag = $root.market.mass.CreateTag.toObject(
            message.createTag,
            options,
          );
          if (options.oneofs) object.union = "createTag";
        }
        if (message.updateTag != null && message.hasOwnProperty("updateTag")) {
          object.updateTag = $root.market.mass.UpdateTag.toObject(
            message.updateTag,
            options,
          );
          if (options.oneofs) object.union = "updateTag";
        }
        if (
          message.createOrder != null &&
          message.hasOwnProperty("createOrder")
        ) {
          object.createOrder = $root.market.mass.CreateOrder.toObject(
            message.createOrder,
            options,
          );
          if (options.oneofs) object.union = "createOrder";
        }
        if (
          message.updateOrder != null &&
          message.hasOwnProperty("updateOrder")
        ) {
          object.updateOrder = $root.market.mass.UpdateOrder.toObject(
            message.updateOrder,
            options,
          );
          if (options.oneofs) object.union = "updateOrder";
        }
        if (
          message.changeStock != null &&
          message.hasOwnProperty("changeStock")
        ) {
          object.changeStock = $root.market.mass.ChangeStock.toObject(
            message.changeStock,
            options,
          );
          if (options.oneofs) object.union = "changeStock";
        }
        if (
          message.newKeyCard != null &&
          message.hasOwnProperty("newKeyCard")
        ) {
          object.newKeyCard = $root.market.mass.NewKeyCard.toObject(
            message.newKeyCard,
            options,
          );
          if (options.oneofs) object.union = "newKeyCard";
        }
        return object;
      };

      /**
       * Converts this StoreEvent to JSON.
       * @function toJSON
       * @memberof market.mass.StoreEvent
       * @instance
       * @returns {Object.<string,*>} JSON object
       */
      StoreEvent.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
      };

      /**
       * Gets the default type url for StoreEvent
       * @function getTypeUrl
       * @memberof market.mass.StoreEvent
       * @static
       * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns {string} The default type url
       */
      StoreEvent.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
          typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/market.mass.StoreEvent";
      };

      return StoreEvent;
    })();

    mass.CommitItemsToOrderRequest = (function () {
      /**
       * Properties of a CommitItemsToOrderRequest.
       * @memberof market.mass
       * @interface ICommitItemsToOrderRequest
       * @property {Uint8Array|null} [requestId] CommitItemsToOrderRequest requestId
       * @property {Uint8Array|null} [orderId] CommitItemsToOrderRequest orderId
       * @property {Uint8Array|null} [erc20Addr] CommitItemsToOrderRequest erc20Addr
       * @property {number|Long|null} [chainId] CommitItemsToOrderRequest chainId
       */

      /**
       * Constructs a new CommitItemsToOrderRequest.
       * @memberof market.mass
       * @classdesc Represents a CommitItemsToOrderRequest.
       * @implements ICommitItemsToOrderRequest
       * @constructor
       * @param {market.mass.ICommitItemsToOrderRequest=} [properties] Properties to set
       */
      function CommitItemsToOrderRequest(properties) {
        if (properties)
          for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
            if (properties[keys[i]] != null)
              this[keys[i]] = properties[keys[i]];
      }

      /**
       * CommitItemsToOrderRequest requestId.
       * @member {Uint8Array} requestId
       * @memberof market.mass.CommitItemsToOrderRequest
       * @instance
       */
      CommitItemsToOrderRequest.prototype.requestId = $util.newBuffer([]);

      /**
       * CommitItemsToOrderRequest orderId.
       * @member {Uint8Array} orderId
       * @memberof market.mass.CommitItemsToOrderRequest
       * @instance
       */
      CommitItemsToOrderRequest.prototype.orderId = $util.newBuffer([]);

      /**
       * CommitItemsToOrderRequest erc20Addr.
       * @member {Uint8Array} erc20Addr
       * @memberof market.mass.CommitItemsToOrderRequest
       * @instance
       */
      CommitItemsToOrderRequest.prototype.erc20Addr = $util.newBuffer([]);

      /**
       * CommitItemsToOrderRequest chainId.
       * @member {number|Long} chainId
       * @memberof market.mass.CommitItemsToOrderRequest
       * @instance
       */
      CommitItemsToOrderRequest.prototype.chainId = $util.Long
        ? $util.Long.fromBits(0, 0, true)
        : 0;

      /**
       * Creates a new CommitItemsToOrderRequest instance using the specified properties.
       * @function create
       * @memberof market.mass.CommitItemsToOrderRequest
       * @static
       * @param {market.mass.ICommitItemsToOrderRequest=} [properties] Properties to set
       * @returns {market.mass.CommitItemsToOrderRequest} CommitItemsToOrderRequest instance
       */
      CommitItemsToOrderRequest.create = function create(properties) {
        return new CommitItemsToOrderRequest(properties);
      };

      /**
       * Encodes the specified CommitItemsToOrderRequest message. Does not implicitly {@link market.mass.CommitItemsToOrderRequest.verify|verify} messages.
       * @function encode
       * @memberof market.mass.CommitItemsToOrderRequest
       * @static
       * @param {market.mass.ICommitItemsToOrderRequest} message CommitItemsToOrderRequest message or plain object to encode
       * @param {$protobuf.Writer} [writer] Writer to encode to
       * @returns {$protobuf.Writer} Writer
       */
      CommitItemsToOrderRequest.encode = function encode(message, writer) {
        if (!writer) writer = $Writer.create();
        if (
          message.requestId != null &&
          Object.hasOwnProperty.call(message, "requestId")
        )
          writer.uint32(/* id 1, wireType 2 =*/ 10).bytes(message.requestId);
        if (
          message.orderId != null &&
          Object.hasOwnProperty.call(message, "orderId")
        )
          writer.uint32(/* id 2, wireType 2 =*/ 18).bytes(message.orderId);
        if (
          message.erc20Addr != null &&
          Object.hasOwnProperty.call(message, "erc20Addr")
        )
          writer.uint32(/* id 3, wireType 2 =*/ 26).bytes(message.erc20Addr);
        if (
          message.chainId != null &&
          Object.hasOwnProperty.call(message, "chainId")
        )
          writer.uint32(/* id 4, wireType 0 =*/ 32).uint64(message.chainId);
        return writer;
      };

      /**
       * Encodes the specified CommitItemsToOrderRequest message, length delimited. Does not implicitly {@link market.mass.CommitItemsToOrderRequest.verify|verify} messages.
       * @function encodeDelimited
       * @memberof market.mass.CommitItemsToOrderRequest
       * @static
       * @param {market.mass.ICommitItemsToOrderRequest} message CommitItemsToOrderRequest message or plain object to encode
       * @param {$protobuf.Writer} [writer] Writer to encode to
       * @returns {$protobuf.Writer} Writer
       */
      CommitItemsToOrderRequest.encodeDelimited = function encodeDelimited(
        message,
        writer,
      ) {
        return this.encode(message, writer).ldelim();
      };

      /**
       * Decodes a CommitItemsToOrderRequest message from the specified reader or buffer.
       * @function decode
       * @memberof market.mass.CommitItemsToOrderRequest
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @param {number} [length] Message length if known beforehand
       * @returns {market.mass.CommitItemsToOrderRequest} CommitItemsToOrderRequest
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      CommitItemsToOrderRequest.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length,
          message = new $root.market.mass.CommitItemsToOrderRequest();
        while (reader.pos < end) {
          let tag = reader.uint32();
          switch (tag >>> 3) {
            case 1: {
              message.requestId = reader.bytes();
              break;
            }
            case 2: {
              message.orderId = reader.bytes();
              break;
            }
            case 3: {
              message.erc20Addr = reader.bytes();
              break;
            }
            case 4: {
              message.chainId = reader.uint64();
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
       * Decodes a CommitItemsToOrderRequest message from the specified reader or buffer, length delimited.
       * @function decodeDelimited
       * @memberof market.mass.CommitItemsToOrderRequest
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @returns {market.mass.CommitItemsToOrderRequest} CommitItemsToOrderRequest
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      CommitItemsToOrderRequest.decodeDelimited = function decodeDelimited(
        reader,
      ) {
        if (!(reader instanceof $Reader)) reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
      };

      /**
       * Verifies a CommitItemsToOrderRequest message.
       * @function verify
       * @memberof market.mass.CommitItemsToOrderRequest
       * @static
       * @param {Object.<string,*>} message Plain object to verify
       * @returns {string|null} `null` if valid, otherwise the reason why it is not
       */
      CommitItemsToOrderRequest.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
          return "object expected";
        if (message.requestId != null && message.hasOwnProperty("requestId"))
          if (
            !(
              (message.requestId &&
                typeof message.requestId.length === "number") ||
              $util.isString(message.requestId)
            )
          )
            return "requestId: buffer expected";
        if (message.orderId != null && message.hasOwnProperty("orderId"))
          if (
            !(
              (message.orderId && typeof message.orderId.length === "number") ||
              $util.isString(message.orderId)
            )
          )
            return "orderId: buffer expected";
        if (message.erc20Addr != null && message.hasOwnProperty("erc20Addr"))
          if (
            !(
              (message.erc20Addr &&
                typeof message.erc20Addr.length === "number") ||
              $util.isString(message.erc20Addr)
            )
          )
            return "erc20Addr: buffer expected";
        if (message.chainId != null && message.hasOwnProperty("chainId"))
          if (
            !$util.isInteger(message.chainId) &&
            !(
              message.chainId &&
              $util.isInteger(message.chainId.low) &&
              $util.isInteger(message.chainId.high)
            )
          )
            return "chainId: integer|Long expected";
        return null;
      };

      /**
       * Creates a CommitItemsToOrderRequest message from a plain object. Also converts values to their respective internal types.
       * @function fromObject
       * @memberof market.mass.CommitItemsToOrderRequest
       * @static
       * @param {Object.<string,*>} object Plain object
       * @returns {market.mass.CommitItemsToOrderRequest} CommitItemsToOrderRequest
       */
      CommitItemsToOrderRequest.fromObject = function fromObject(object) {
        if (object instanceof $root.market.mass.CommitItemsToOrderRequest)
          return object;
        let message = new $root.market.mass.CommitItemsToOrderRequest();
        if (object.requestId != null)
          if (typeof object.requestId === "string")
            $util.base64.decode(
              object.requestId,
              (message.requestId = $util.newBuffer(
                $util.base64.length(object.requestId),
              )),
              0,
            );
          else if (object.requestId.length >= 0)
            message.requestId = object.requestId;
        if (object.orderId != null)
          if (typeof object.orderId === "string")
            $util.base64.decode(
              object.orderId,
              (message.orderId = $util.newBuffer(
                $util.base64.length(object.orderId),
              )),
              0,
            );
          else if (object.orderId.length >= 0) message.orderId = object.orderId;
        if (object.erc20Addr != null)
          if (typeof object.erc20Addr === "string")
            $util.base64.decode(
              object.erc20Addr,
              (message.erc20Addr = $util.newBuffer(
                $util.base64.length(object.erc20Addr),
              )),
              0,
            );
          else if (object.erc20Addr.length >= 0)
            message.erc20Addr = object.erc20Addr;
        if (object.chainId != null)
          if ($util.Long)
            (message.chainId = $util.Long.fromValue(object.chainId)).unsigned =
              true;
          else if (typeof object.chainId === "string")
            message.chainId = parseInt(object.chainId, 10);
          else if (typeof object.chainId === "number")
            message.chainId = object.chainId;
          else if (typeof object.chainId === "object")
            message.chainId = new $util.LongBits(
              object.chainId.low >>> 0,
              object.chainId.high >>> 0,
            ).toNumber(true);
        return message;
      };

      /**
       * Creates a plain object from a CommitItemsToOrderRequest message. Also converts values to other types if specified.
       * @function toObject
       * @memberof market.mass.CommitItemsToOrderRequest
       * @static
       * @param {market.mass.CommitItemsToOrderRequest} message CommitItemsToOrderRequest
       * @param {$protobuf.IConversionOptions} [options] Conversion options
       * @returns {Object.<string,*>} Plain object
       */
      CommitItemsToOrderRequest.toObject = function toObject(message, options) {
        if (!options) options = {};
        let object = {};
        if (options.defaults) {
          if (options.bytes === String) object.requestId = "";
          else {
            object.requestId = [];
            if (options.bytes !== Array)
              object.requestId = $util.newBuffer(object.requestId);
          }
          if (options.bytes === String) object.orderId = "";
          else {
            object.orderId = [];
            if (options.bytes !== Array)
              object.orderId = $util.newBuffer(object.orderId);
          }
          if (options.bytes === String) object.erc20Addr = "";
          else {
            object.erc20Addr = [];
            if (options.bytes !== Array)
              object.erc20Addr = $util.newBuffer(object.erc20Addr);
          }
          if ($util.Long) {
            let long = new $util.Long(0, 0, true);
            object.chainId =
              options.longs === String
                ? long.toString()
                : options.longs === Number
                  ? long.toNumber()
                  : long;
          } else object.chainId = options.longs === String ? "0" : 0;
        }
        if (message.requestId != null && message.hasOwnProperty("requestId"))
          object.requestId =
            options.bytes === String
              ? $util.base64.encode(
                  message.requestId,
                  0,
                  message.requestId.length,
                )
              : options.bytes === Array
                ? Array.prototype.slice.call(message.requestId)
                : message.requestId;
        if (message.orderId != null && message.hasOwnProperty("orderId"))
          object.orderId =
            options.bytes === String
              ? $util.base64.encode(message.orderId, 0, message.orderId.length)
              : options.bytes === Array
                ? Array.prototype.slice.call(message.orderId)
                : message.orderId;
        if (message.erc20Addr != null && message.hasOwnProperty("erc20Addr"))
          object.erc20Addr =
            options.bytes === String
              ? $util.base64.encode(
                  message.erc20Addr,
                  0,
                  message.erc20Addr.length,
                )
              : options.bytes === Array
                ? Array.prototype.slice.call(message.erc20Addr)
                : message.erc20Addr;
        if (message.chainId != null && message.hasOwnProperty("chainId"))
          if (typeof message.chainId === "number")
            object.chainId =
              options.longs === String
                ? String(message.chainId)
                : message.chainId;
          else
            object.chainId =
              options.longs === String
                ? $util.Long.prototype.toString.call(message.chainId)
                : options.longs === Number
                  ? new $util.LongBits(
                      message.chainId.low >>> 0,
                      message.chainId.high >>> 0,
                    ).toNumber(true)
                  : message.chainId;
        return object;
      };

      /**
       * Converts this CommitItemsToOrderRequest to JSON.
       * @function toJSON
       * @memberof market.mass.CommitItemsToOrderRequest
       * @instance
       * @returns {Object.<string,*>} JSON object
       */
      CommitItemsToOrderRequest.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
      };

      /**
       * Gets the default type url for CommitItemsToOrderRequest
       * @function getTypeUrl
       * @memberof market.mass.CommitItemsToOrderRequest
       * @static
       * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns {string} The default type url
       */
      CommitItemsToOrderRequest.getTypeUrl = function getTypeUrl(
        typeUrlPrefix,
      ) {
        if (typeUrlPrefix === undefined) {
          typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/market.mass.CommitItemsToOrderRequest";
      };

      return CommitItemsToOrderRequest;
    })();

    mass.CommitItemsToOrderResponse = (function () {
      /**
       * Properties of a CommitItemsToOrderResponse.
       * @memberof market.mass
       * @interface ICommitItemsToOrderResponse
       * @property {Uint8Array|null} [requestId] CommitItemsToOrderResponse requestId
       * @property {market.mass.IError|null} [error] CommitItemsToOrderResponse error
       * @property {Uint8Array|null} [orderFinalizedId] CommitItemsToOrderResponse orderFinalizedId
       */

      /**
       * Constructs a new CommitItemsToOrderResponse.
       * @memberof market.mass
       * @classdesc Represents a CommitItemsToOrderResponse.
       * @implements ICommitItemsToOrderResponse
       * @constructor
       * @param {market.mass.ICommitItemsToOrderResponse=} [properties] Properties to set
       */
      function CommitItemsToOrderResponse(properties) {
        if (properties)
          for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
            if (properties[keys[i]] != null)
              this[keys[i]] = properties[keys[i]];
      }

      /**
       * CommitItemsToOrderResponse requestId.
       * @member {Uint8Array} requestId
       * @memberof market.mass.CommitItemsToOrderResponse
       * @instance
       */
      CommitItemsToOrderResponse.prototype.requestId = $util.newBuffer([]);

      /**
       * CommitItemsToOrderResponse error.
       * @member {market.mass.IError|null|undefined} error
       * @memberof market.mass.CommitItemsToOrderResponse
       * @instance
       */
      CommitItemsToOrderResponse.prototype.error = null;

      /**
       * CommitItemsToOrderResponse orderFinalizedId.
       * @member {Uint8Array} orderFinalizedId
       * @memberof market.mass.CommitItemsToOrderResponse
       * @instance
       */
      CommitItemsToOrderResponse.prototype.orderFinalizedId = $util.newBuffer(
        [],
      );

      /**
       * Creates a new CommitItemsToOrderResponse instance using the specified properties.
       * @function create
       * @memberof market.mass.CommitItemsToOrderResponse
       * @static
       * @param {market.mass.ICommitItemsToOrderResponse=} [properties] Properties to set
       * @returns {market.mass.CommitItemsToOrderResponse} CommitItemsToOrderResponse instance
       */
      CommitItemsToOrderResponse.create = function create(properties) {
        return new CommitItemsToOrderResponse(properties);
      };

      /**
       * Encodes the specified CommitItemsToOrderResponse message. Does not implicitly {@link market.mass.CommitItemsToOrderResponse.verify|verify} messages.
       * @function encode
       * @memberof market.mass.CommitItemsToOrderResponse
       * @static
       * @param {market.mass.ICommitItemsToOrderResponse} message CommitItemsToOrderResponse message or plain object to encode
       * @param {$protobuf.Writer} [writer] Writer to encode to
       * @returns {$protobuf.Writer} Writer
       */
      CommitItemsToOrderResponse.encode = function encode(message, writer) {
        if (!writer) writer = $Writer.create();
        if (
          message.requestId != null &&
          Object.hasOwnProperty.call(message, "requestId")
        )
          writer.uint32(/* id 1, wireType 2 =*/ 10).bytes(message.requestId);
        if (
          message.error != null &&
          Object.hasOwnProperty.call(message, "error")
        )
          $root.market.mass.Error.encode(
            message.error,
            writer.uint32(/* id 2, wireType 2 =*/ 18).fork(),
          ).ldelim();
        if (
          message.orderFinalizedId != null &&
          Object.hasOwnProperty.call(message, "orderFinalizedId")
        )
          writer
            .uint32(/* id 3, wireType 2 =*/ 26)
            .bytes(message.orderFinalizedId);
        return writer;
      };

      /**
       * Encodes the specified CommitItemsToOrderResponse message, length delimited. Does not implicitly {@link market.mass.CommitItemsToOrderResponse.verify|verify} messages.
       * @function encodeDelimited
       * @memberof market.mass.CommitItemsToOrderResponse
       * @static
       * @param {market.mass.ICommitItemsToOrderResponse} message CommitItemsToOrderResponse message or plain object to encode
       * @param {$protobuf.Writer} [writer] Writer to encode to
       * @returns {$protobuf.Writer} Writer
       */
      CommitItemsToOrderResponse.encodeDelimited = function encodeDelimited(
        message,
        writer,
      ) {
        return this.encode(message, writer).ldelim();
      };

      /**
       * Decodes a CommitItemsToOrderResponse message from the specified reader or buffer.
       * @function decode
       * @memberof market.mass.CommitItemsToOrderResponse
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @param {number} [length] Message length if known beforehand
       * @returns {market.mass.CommitItemsToOrderResponse} CommitItemsToOrderResponse
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      CommitItemsToOrderResponse.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length,
          message = new $root.market.mass.CommitItemsToOrderResponse();
        while (reader.pos < end) {
          let tag = reader.uint32();
          switch (tag >>> 3) {
            case 1: {
              message.requestId = reader.bytes();
              break;
            }
            case 2: {
              message.error = $root.market.mass.Error.decode(
                reader,
                reader.uint32(),
              );
              break;
            }
            case 3: {
              message.orderFinalizedId = reader.bytes();
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
       * Decodes a CommitItemsToOrderResponse message from the specified reader or buffer, length delimited.
       * @function decodeDelimited
       * @memberof market.mass.CommitItemsToOrderResponse
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @returns {market.mass.CommitItemsToOrderResponse} CommitItemsToOrderResponse
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      CommitItemsToOrderResponse.decodeDelimited = function decodeDelimited(
        reader,
      ) {
        if (!(reader instanceof $Reader)) reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
      };

      /**
       * Verifies a CommitItemsToOrderResponse message.
       * @function verify
       * @memberof market.mass.CommitItemsToOrderResponse
       * @static
       * @param {Object.<string,*>} message Plain object to verify
       * @returns {string|null} `null` if valid, otherwise the reason why it is not
       */
      CommitItemsToOrderResponse.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
          return "object expected";
        if (message.requestId != null && message.hasOwnProperty("requestId"))
          if (
            !(
              (message.requestId &&
                typeof message.requestId.length === "number") ||
              $util.isString(message.requestId)
            )
          )
            return "requestId: buffer expected";
        if (message.error != null && message.hasOwnProperty("error")) {
          let error = $root.market.mass.Error.verify(message.error);
          if (error) return "error." + error;
        }
        if (
          message.orderFinalizedId != null &&
          message.hasOwnProperty("orderFinalizedId")
        )
          if (
            !(
              (message.orderFinalizedId &&
                typeof message.orderFinalizedId.length === "number") ||
              $util.isString(message.orderFinalizedId)
            )
          )
            return "orderFinalizedId: buffer expected";
        return null;
      };

      /**
       * Creates a CommitItemsToOrderResponse message from a plain object. Also converts values to their respective internal types.
       * @function fromObject
       * @memberof market.mass.CommitItemsToOrderResponse
       * @static
       * @param {Object.<string,*>} object Plain object
       * @returns {market.mass.CommitItemsToOrderResponse} CommitItemsToOrderResponse
       */
      CommitItemsToOrderResponse.fromObject = function fromObject(object) {
        if (object instanceof $root.market.mass.CommitItemsToOrderResponse)
          return object;
        let message = new $root.market.mass.CommitItemsToOrderResponse();
        if (object.requestId != null)
          if (typeof object.requestId === "string")
            $util.base64.decode(
              object.requestId,
              (message.requestId = $util.newBuffer(
                $util.base64.length(object.requestId),
              )),
              0,
            );
          else if (object.requestId.length >= 0)
            message.requestId = object.requestId;
        if (object.error != null) {
          if (typeof object.error !== "object")
            throw TypeError(
              ".market.mass.CommitItemsToOrderResponse.error: object expected",
            );
          message.error = $root.market.mass.Error.fromObject(object.error);
        }
        if (object.orderFinalizedId != null)
          if (typeof object.orderFinalizedId === "string")
            $util.base64.decode(
              object.orderFinalizedId,
              (message.orderFinalizedId = $util.newBuffer(
                $util.base64.length(object.orderFinalizedId),
              )),
              0,
            );
          else if (object.orderFinalizedId.length >= 0)
            message.orderFinalizedId = object.orderFinalizedId;
        return message;
      };

      /**
       * Creates a plain object from a CommitItemsToOrderResponse message. Also converts values to other types if specified.
       * @function toObject
       * @memberof market.mass.CommitItemsToOrderResponse
       * @static
       * @param {market.mass.CommitItemsToOrderResponse} message CommitItemsToOrderResponse
       * @param {$protobuf.IConversionOptions} [options] Conversion options
       * @returns {Object.<string,*>} Plain object
       */
      CommitItemsToOrderResponse.toObject = function toObject(
        message,
        options,
      ) {
        if (!options) options = {};
        let object = {};
        if (options.defaults) {
          if (options.bytes === String) object.requestId = "";
          else {
            object.requestId = [];
            if (options.bytes !== Array)
              object.requestId = $util.newBuffer(object.requestId);
          }
          object.error = null;
          if (options.bytes === String) object.orderFinalizedId = "";
          else {
            object.orderFinalizedId = [];
            if (options.bytes !== Array)
              object.orderFinalizedId = $util.newBuffer(
                object.orderFinalizedId,
              );
          }
        }
        if (message.requestId != null && message.hasOwnProperty("requestId"))
          object.requestId =
            options.bytes === String
              ? $util.base64.encode(
                  message.requestId,
                  0,
                  message.requestId.length,
                )
              : options.bytes === Array
                ? Array.prototype.slice.call(message.requestId)
                : message.requestId;
        if (message.error != null && message.hasOwnProperty("error"))
          object.error = $root.market.mass.Error.toObject(
            message.error,
            options,
          );
        if (
          message.orderFinalizedId != null &&
          message.hasOwnProperty("orderFinalizedId")
        )
          object.orderFinalizedId =
            options.bytes === String
              ? $util.base64.encode(
                  message.orderFinalizedId,
                  0,
                  message.orderFinalizedId.length,
                )
              : options.bytes === Array
                ? Array.prototype.slice.call(message.orderFinalizedId)
                : message.orderFinalizedId;
        return object;
      };

      /**
       * Converts this CommitItemsToOrderResponse to JSON.
       * @function toJSON
       * @memberof market.mass.CommitItemsToOrderResponse
       * @instance
       * @returns {Object.<string,*>} JSON object
       */
      CommitItemsToOrderResponse.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
      };

      /**
       * Gets the default type url for CommitItemsToOrderResponse
       * @function getTypeUrl
       * @memberof market.mass.CommitItemsToOrderResponse
       * @static
       * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns {string} The default type url
       */
      CommitItemsToOrderResponse.getTypeUrl = function getTypeUrl(
        typeUrlPrefix,
      ) {
        if (typeUrlPrefix === undefined) {
          typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/market.mass.CommitItemsToOrderResponse";
      };

      return CommitItemsToOrderResponse;
    })();

    mass.GetBlobUploadURLRequest = (function () {
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
        if (!writer) writer = $Writer.create();
        if (
          message.requestId != null &&
          Object.hasOwnProperty.call(message, "requestId")
        )
          writer.uint32(/* id 1, wireType 2 =*/ 10).bytes(message.requestId);
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
      GetBlobUploadURLRequest.encodeDelimited = function encodeDelimited(
        message,
        writer,
      ) {
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
        if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length,
          message = new $root.market.mass.GetBlobUploadURLRequest();
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
      GetBlobUploadURLRequest.decodeDelimited = function decodeDelimited(
        reader,
      ) {
        if (!(reader instanceof $Reader)) reader = new $Reader(reader);
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
          if (
            !(
              (message.requestId &&
                typeof message.requestId.length === "number") ||
              $util.isString(message.requestId)
            )
          )
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
            $util.base64.decode(
              object.requestId,
              (message.requestId = $util.newBuffer(
                $util.base64.length(object.requestId),
              )),
              0,
            );
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
        if (!options) options = {};
        let object = {};
        if (options.defaults)
          if (options.bytes === String) object.requestId = "";
          else {
            object.requestId = [];
            if (options.bytes !== Array)
              object.requestId = $util.newBuffer(object.requestId);
          }
        if (message.requestId != null && message.hasOwnProperty("requestId"))
          object.requestId =
            options.bytes === String
              ? $util.base64.encode(
                  message.requestId,
                  0,
                  message.requestId.length,
                )
              : options.bytes === Array
                ? Array.prototype.slice.call(message.requestId)
                : message.requestId;
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

    mass.GetBlobUploadURLResponse = (function () {
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
        if (!writer) writer = $Writer.create();
        if (
          message.requestId != null &&
          Object.hasOwnProperty.call(message, "requestId")
        )
          writer.uint32(/* id 1, wireType 2 =*/ 10).bytes(message.requestId);
        if (
          message.error != null &&
          Object.hasOwnProperty.call(message, "error")
        )
          $root.market.mass.Error.encode(
            message.error,
            writer.uint32(/* id 2, wireType 2 =*/ 18).fork(),
          ).ldelim();
        if (message.url != null && Object.hasOwnProperty.call(message, "url"))
          writer.uint32(/* id 3, wireType 2 =*/ 26).string(message.url);
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
      GetBlobUploadURLResponse.encodeDelimited = function encodeDelimited(
        message,
        writer,
      ) {
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
        if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length,
          message = new $root.market.mass.GetBlobUploadURLResponse();
        while (reader.pos < end) {
          let tag = reader.uint32();
          switch (tag >>> 3) {
            case 1: {
              message.requestId = reader.bytes();
              break;
            }
            case 2: {
              message.error = $root.market.mass.Error.decode(
                reader,
                reader.uint32(),
              );
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
      GetBlobUploadURLResponse.decodeDelimited = function decodeDelimited(
        reader,
      ) {
        if (!(reader instanceof $Reader)) reader = new $Reader(reader);
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
          if (
            !(
              (message.requestId &&
                typeof message.requestId.length === "number") ||
              $util.isString(message.requestId)
            )
          )
            return "requestId: buffer expected";
        if (message.error != null && message.hasOwnProperty("error")) {
          let error = $root.market.mass.Error.verify(message.error);
          if (error) return "error." + error;
        }
        if (message.url != null && message.hasOwnProperty("url"))
          if (!$util.isString(message.url)) return "url: string expected";
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
            $util.base64.decode(
              object.requestId,
              (message.requestId = $util.newBuffer(
                $util.base64.length(object.requestId),
              )),
              0,
            );
          else if (object.requestId.length >= 0)
            message.requestId = object.requestId;
        if (object.error != null) {
          if (typeof object.error !== "object")
            throw TypeError(
              ".market.mass.GetBlobUploadURLResponse.error: object expected",
            );
          message.error = $root.market.mass.Error.fromObject(object.error);
        }
        if (object.url != null) message.url = String(object.url);
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
        if (!options) options = {};
        let object = {};
        if (options.defaults) {
          if (options.bytes === String) object.requestId = "";
          else {
            object.requestId = [];
            if (options.bytes !== Array)
              object.requestId = $util.newBuffer(object.requestId);
          }
          object.error = null;
          object.url = "";
        }
        if (message.requestId != null && message.hasOwnProperty("requestId"))
          object.requestId =
            options.bytes === String
              ? $util.base64.encode(
                  message.requestId,
                  0,
                  message.requestId.length,
                )
              : options.bytes === Array
                ? Array.prototype.slice.call(message.requestId)
                : message.requestId;
        if (message.error != null && message.hasOwnProperty("error"))
          object.error = $root.market.mass.Error.toObject(
            message.error,
            options,
          );
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

    mass.EventWriteRequest = (function () {
      /**
       * Properties of an EventWriteRequest.
       * @memberof market.mass
       * @interface IEventWriteRequest
       * @property {Uint8Array|null} [requestId] EventWriteRequest requestId
       * @property {google.protobuf.IAny|null} [event] EventWriteRequest event
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
       * @member {google.protobuf.IAny|null|undefined} event
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
        if (!writer) writer = $Writer.create();
        if (
          message.requestId != null &&
          Object.hasOwnProperty.call(message, "requestId")
        )
          writer.uint32(/* id 1, wireType 2 =*/ 10).bytes(message.requestId);
        if (
          message.event != null &&
          Object.hasOwnProperty.call(message, "event")
        )
          $root.google.protobuf.Any.encode(
            message.event,
            writer.uint32(/* id 2, wireType 2 =*/ 18).fork(),
          ).ldelim();
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
      EventWriteRequest.encodeDelimited = function encodeDelimited(
        message,
        writer,
      ) {
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
        if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length,
          message = new $root.market.mass.EventWriteRequest();
        while (reader.pos < end) {
          let tag = reader.uint32();
          switch (tag >>> 3) {
            case 1: {
              message.requestId = reader.bytes();
              break;
            }
            case 2: {
              message.event = $root.google.protobuf.Any.decode(
                reader,
                reader.uint32(),
              );
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
        if (!(reader instanceof $Reader)) reader = new $Reader(reader);
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
          if (
            !(
              (message.requestId &&
                typeof message.requestId.length === "number") ||
              $util.isString(message.requestId)
            )
          )
            return "requestId: buffer expected";
        if (message.event != null && message.hasOwnProperty("event")) {
          let error = $root.google.protobuf.Any.verify(message.event);
          if (error) return "event." + error;
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
            $util.base64.decode(
              object.requestId,
              (message.requestId = $util.newBuffer(
                $util.base64.length(object.requestId),
              )),
              0,
            );
          else if (object.requestId.length >= 0)
            message.requestId = object.requestId;
        if (object.event != null) {
          if (typeof object.event !== "object")
            throw TypeError(
              ".market.mass.EventWriteRequest.event: object expected",
            );
          message.event = $root.google.protobuf.Any.fromObject(object.event);
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
        if (!options) options = {};
        let object = {};
        if (options.defaults) {
          if (options.bytes === String) object.requestId = "";
          else {
            object.requestId = [];
            if (options.bytes !== Array)
              object.requestId = $util.newBuffer(object.requestId);
          }
          object.event = null;
        }
        if (message.requestId != null && message.hasOwnProperty("requestId"))
          object.requestId =
            options.bytes === String
              ? $util.base64.encode(
                  message.requestId,
                  0,
                  message.requestId.length,
                )
              : options.bytes === Array
                ? Array.prototype.slice.call(message.requestId)
                : message.requestId;
        if (message.event != null && message.hasOwnProperty("event"))
          object.event = $root.google.protobuf.Any.toObject(
            message.event,
            options,
          );
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

    mass.EventWriteResponse = (function () {
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
      EventWriteResponse.prototype.eventSequenceNo = $util.Long
        ? $util.Long.fromBits(0, 0, true)
        : 0;

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
        if (!writer) writer = $Writer.create();
        if (
          message.requestId != null &&
          Object.hasOwnProperty.call(message, "requestId")
        )
          writer.uint32(/* id 1, wireType 2 =*/ 10).bytes(message.requestId);
        if (
          message.error != null &&
          Object.hasOwnProperty.call(message, "error")
        )
          $root.market.mass.Error.encode(
            message.error,
            writer.uint32(/* id 2, wireType 2 =*/ 18).fork(),
          ).ldelim();
        if (
          message.newStoreHash != null &&
          Object.hasOwnProperty.call(message, "newStoreHash")
        )
          writer.uint32(/* id 3, wireType 2 =*/ 26).bytes(message.newStoreHash);
        if (
          message.eventSequenceNo != null &&
          Object.hasOwnProperty.call(message, "eventSequenceNo")
        )
          writer
            .uint32(/* id 4, wireType 0 =*/ 32)
            .uint64(message.eventSequenceNo);
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
      EventWriteResponse.encodeDelimited = function encodeDelimited(
        message,
        writer,
      ) {
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
        if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length,
          message = new $root.market.mass.EventWriteResponse();
        while (reader.pos < end) {
          let tag = reader.uint32();
          switch (tag >>> 3) {
            case 1: {
              message.requestId = reader.bytes();
              break;
            }
            case 2: {
              message.error = $root.market.mass.Error.decode(
                reader,
                reader.uint32(),
              );
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
        if (!(reader instanceof $Reader)) reader = new $Reader(reader);
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
          if (
            !(
              (message.requestId &&
                typeof message.requestId.length === "number") ||
              $util.isString(message.requestId)
            )
          )
            return "requestId: buffer expected";
        if (message.error != null && message.hasOwnProperty("error")) {
          let error = $root.market.mass.Error.verify(message.error);
          if (error) return "error." + error;
        }
        if (
          message.newStoreHash != null &&
          message.hasOwnProperty("newStoreHash")
        )
          if (
            !(
              (message.newStoreHash &&
                typeof message.newStoreHash.length === "number") ||
              $util.isString(message.newStoreHash)
            )
          )
            return "newStoreHash: buffer expected";
        if (
          message.eventSequenceNo != null &&
          message.hasOwnProperty("eventSequenceNo")
        )
          if (
            !$util.isInteger(message.eventSequenceNo) &&
            !(
              message.eventSequenceNo &&
              $util.isInteger(message.eventSequenceNo.low) &&
              $util.isInteger(message.eventSequenceNo.high)
            )
          )
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
            $util.base64.decode(
              object.requestId,
              (message.requestId = $util.newBuffer(
                $util.base64.length(object.requestId),
              )),
              0,
            );
          else if (object.requestId.length >= 0)
            message.requestId = object.requestId;
        if (object.error != null) {
          if (typeof object.error !== "object")
            throw TypeError(
              ".market.mass.EventWriteResponse.error: object expected",
            );
          message.error = $root.market.mass.Error.fromObject(object.error);
        }
        if (object.newStoreHash != null)
          if (typeof object.newStoreHash === "string")
            $util.base64.decode(
              object.newStoreHash,
              (message.newStoreHash = $util.newBuffer(
                $util.base64.length(object.newStoreHash),
              )),
              0,
            );
          else if (object.newStoreHash.length >= 0)
            message.newStoreHash = object.newStoreHash;
        if (object.eventSequenceNo != null)
          if ($util.Long)
            (message.eventSequenceNo = $util.Long.fromValue(
              object.eventSequenceNo,
            )).unsigned = true;
          else if (typeof object.eventSequenceNo === "string")
            message.eventSequenceNo = parseInt(object.eventSequenceNo, 10);
          else if (typeof object.eventSequenceNo === "number")
            message.eventSequenceNo = object.eventSequenceNo;
          else if (typeof object.eventSequenceNo === "object")
            message.eventSequenceNo = new $util.LongBits(
              object.eventSequenceNo.low >>> 0,
              object.eventSequenceNo.high >>> 0,
            ).toNumber(true);
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
        if (!options) options = {};
        let object = {};
        if (options.defaults) {
          if (options.bytes === String) object.requestId = "";
          else {
            object.requestId = [];
            if (options.bytes !== Array)
              object.requestId = $util.newBuffer(object.requestId);
          }
          object.error = null;
          if (options.bytes === String) object.newStoreHash = "";
          else {
            object.newStoreHash = [];
            if (options.bytes !== Array)
              object.newStoreHash = $util.newBuffer(object.newStoreHash);
          }
          if ($util.Long) {
            let long = new $util.Long(0, 0, true);
            object.eventSequenceNo =
              options.longs === String
                ? long.toString()
                : options.longs === Number
                  ? long.toNumber()
                  : long;
          } else object.eventSequenceNo = options.longs === String ? "0" : 0;
        }
        if (message.requestId != null && message.hasOwnProperty("requestId"))
          object.requestId =
            options.bytes === String
              ? $util.base64.encode(
                  message.requestId,
                  0,
                  message.requestId.length,
                )
              : options.bytes === Array
                ? Array.prototype.slice.call(message.requestId)
                : message.requestId;
        if (message.error != null && message.hasOwnProperty("error"))
          object.error = $root.market.mass.Error.toObject(
            message.error,
            options,
          );
        if (
          message.newStoreHash != null &&
          message.hasOwnProperty("newStoreHash")
        )
          object.newStoreHash =
            options.bytes === String
              ? $util.base64.encode(
                  message.newStoreHash,
                  0,
                  message.newStoreHash.length,
                )
              : options.bytes === Array
                ? Array.prototype.slice.call(message.newStoreHash)
                : message.newStoreHash;
        if (
          message.eventSequenceNo != null &&
          message.hasOwnProperty("eventSequenceNo")
        )
          if (typeof message.eventSequenceNo === "number")
            object.eventSequenceNo =
              options.longs === String
                ? String(message.eventSequenceNo)
                : message.eventSequenceNo;
          else
            object.eventSequenceNo =
              options.longs === String
                ? $util.Long.prototype.toString.call(message.eventSequenceNo)
                : options.longs === Number
                  ? new $util.LongBits(
                      message.eventSequenceNo.low >>> 0,
                      message.eventSequenceNo.high >>> 0,
                    ).toNumber(true)
                  : message.eventSequenceNo;
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

    mass.EventPushRequest = (function () {
      /**
       * Properties of an EventPushRequest.
       * @memberof market.mass
       * @interface IEventPushRequest
       * @property {Uint8Array|null} [requestId] EventPushRequest requestId
       * @property {Array.<google.protobuf.IAny>|null} [events] EventPushRequest events
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
       * @member {Array.<google.protobuf.IAny>} events
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
        if (!writer) writer = $Writer.create();
        if (
          message.requestId != null &&
          Object.hasOwnProperty.call(message, "requestId")
        )
          writer.uint32(/* id 1, wireType 2 =*/ 10).bytes(message.requestId);
        if (message.events != null && message.events.length)
          for (let i = 0; i < message.events.length; ++i)
            $root.google.protobuf.Any.encode(
              message.events[i],
              writer.uint32(/* id 2, wireType 2 =*/ 18).fork(),
            ).ldelim();
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
      EventPushRequest.encodeDelimited = function encodeDelimited(
        message,
        writer,
      ) {
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
        if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length,
          message = new $root.market.mass.EventPushRequest();
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
              message.events.push(
                $root.google.protobuf.Any.decode(reader, reader.uint32()),
              );
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
        if (!(reader instanceof $Reader)) reader = new $Reader(reader);
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
          if (
            !(
              (message.requestId &&
                typeof message.requestId.length === "number") ||
              $util.isString(message.requestId)
            )
          )
            return "requestId: buffer expected";
        if (message.events != null && message.hasOwnProperty("events")) {
          if (!Array.isArray(message.events)) return "events: array expected";
          for (let i = 0; i < message.events.length; ++i) {
            let error = $root.google.protobuf.Any.verify(message.events[i]);
            if (error) return "events." + error;
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
        if (object instanceof $root.market.mass.EventPushRequest) return object;
        let message = new $root.market.mass.EventPushRequest();
        if (object.requestId != null)
          if (typeof object.requestId === "string")
            $util.base64.decode(
              object.requestId,
              (message.requestId = $util.newBuffer(
                $util.base64.length(object.requestId),
              )),
              0,
            );
          else if (object.requestId.length >= 0)
            message.requestId = object.requestId;
        if (object.events) {
          if (!Array.isArray(object.events))
            throw TypeError(
              ".market.mass.EventPushRequest.events: array expected",
            );
          message.events = [];
          for (let i = 0; i < object.events.length; ++i) {
            if (typeof object.events[i] !== "object")
              throw TypeError(
                ".market.mass.EventPushRequest.events: object expected",
              );
            message.events[i] = $root.google.protobuf.Any.fromObject(
              object.events[i],
            );
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
        if (!options) options = {};
        let object = {};
        if (options.arrays || options.defaults) object.events = [];
        if (options.defaults)
          if (options.bytes === String) object.requestId = "";
          else {
            object.requestId = [];
            if (options.bytes !== Array)
              object.requestId = $util.newBuffer(object.requestId);
          }
        if (message.requestId != null && message.hasOwnProperty("requestId"))
          object.requestId =
            options.bytes === String
              ? $util.base64.encode(
                  message.requestId,
                  0,
                  message.requestId.length,
                )
              : options.bytes === Array
                ? Array.prototype.slice.call(message.requestId)
                : message.requestId;
        if (message.events && message.events.length) {
          object.events = [];
          for (let j = 0; j < message.events.length; ++j)
            object.events[j] = $root.google.protobuf.Any.toObject(
              message.events[j],
              options,
            );
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

    mass.EventPushResponse = (function () {
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
        if (!writer) writer = $Writer.create();
        if (
          message.requestId != null &&
          Object.hasOwnProperty.call(message, "requestId")
        )
          writer.uint32(/* id 1, wireType 2 =*/ 10).bytes(message.requestId);
        if (
          message.error != null &&
          Object.hasOwnProperty.call(message, "error")
        )
          $root.market.mass.Error.encode(
            message.error,
            writer.uint32(/* id 2, wireType 2 =*/ 18).fork(),
          ).ldelim();
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
      EventPushResponse.encodeDelimited = function encodeDelimited(
        message,
        writer,
      ) {
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
        if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length,
          message = new $root.market.mass.EventPushResponse();
        while (reader.pos < end) {
          let tag = reader.uint32();
          switch (tag >>> 3) {
            case 1: {
              message.requestId = reader.bytes();
              break;
            }
            case 2: {
              message.error = $root.market.mass.Error.decode(
                reader,
                reader.uint32(),
              );
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
        if (!(reader instanceof $Reader)) reader = new $Reader(reader);
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
          if (
            !(
              (message.requestId &&
                typeof message.requestId.length === "number") ||
              $util.isString(message.requestId)
            )
          )
            return "requestId: buffer expected";
        if (message.error != null && message.hasOwnProperty("error")) {
          let error = $root.market.mass.Error.verify(message.error);
          if (error) return "error." + error;
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
            $util.base64.decode(
              object.requestId,
              (message.requestId = $util.newBuffer(
                $util.base64.length(object.requestId),
              )),
              0,
            );
          else if (object.requestId.length >= 0)
            message.requestId = object.requestId;
        if (object.error != null) {
          if (typeof object.error !== "object")
            throw TypeError(
              ".market.mass.EventPushResponse.error: object expected",
            );
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
        if (!options) options = {};
        let object = {};
        if (options.defaults) {
          if (options.bytes === String) object.requestId = "";
          else {
            object.requestId = [];
            if (options.bytes !== Array)
              object.requestId = $util.newBuffer(object.requestId);
          }
          object.error = null;
        }
        if (message.requestId != null && message.hasOwnProperty("requestId"))
          object.requestId =
            options.bytes === String
              ? $util.base64.encode(
                  message.requestId,
                  0,
                  message.requestId.length,
                )
              : options.bytes === Array
                ? Array.prototype.slice.call(message.requestId)
                : message.requestId;
        if (message.error != null && message.hasOwnProperty("error"))
          object.error = $root.market.mass.Error.toObject(
            message.error,
            options,
          );
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

    mass.SyncStatusRequest = (function () {
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
      SyncStatusRequest.prototype.unpushedEvents = $util.Long
        ? $util.Long.fromBits(0, 0, true)
        : 0;

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
        if (!writer) writer = $Writer.create();
        if (
          message.requestId != null &&
          Object.hasOwnProperty.call(message, "requestId")
        )
          writer.uint32(/* id 1, wireType 2 =*/ 10).bytes(message.requestId);
        if (
          message.unpushedEvents != null &&
          Object.hasOwnProperty.call(message, "unpushedEvents")
        )
          writer
            .uint32(/* id 2, wireType 0 =*/ 16)
            .uint64(message.unpushedEvents);
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
      SyncStatusRequest.encodeDelimited = function encodeDelimited(
        message,
        writer,
      ) {
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
        if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length,
          message = new $root.market.mass.SyncStatusRequest();
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
        if (!(reader instanceof $Reader)) reader = new $Reader(reader);
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
          if (
            !(
              (message.requestId &&
                typeof message.requestId.length === "number") ||
              $util.isString(message.requestId)
            )
          )
            return "requestId: buffer expected";
        if (
          message.unpushedEvents != null &&
          message.hasOwnProperty("unpushedEvents")
        )
          if (
            !$util.isInteger(message.unpushedEvents) &&
            !(
              message.unpushedEvents &&
              $util.isInteger(message.unpushedEvents.low) &&
              $util.isInteger(message.unpushedEvents.high)
            )
          )
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
            $util.base64.decode(
              object.requestId,
              (message.requestId = $util.newBuffer(
                $util.base64.length(object.requestId),
              )),
              0,
            );
          else if (object.requestId.length >= 0)
            message.requestId = object.requestId;
        if (object.unpushedEvents != null)
          if ($util.Long)
            (message.unpushedEvents = $util.Long.fromValue(
              object.unpushedEvents,
            )).unsigned = true;
          else if (typeof object.unpushedEvents === "string")
            message.unpushedEvents = parseInt(object.unpushedEvents, 10);
          else if (typeof object.unpushedEvents === "number")
            message.unpushedEvents = object.unpushedEvents;
          else if (typeof object.unpushedEvents === "object")
            message.unpushedEvents = new $util.LongBits(
              object.unpushedEvents.low >>> 0,
              object.unpushedEvents.high >>> 0,
            ).toNumber(true);
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
        if (!options) options = {};
        let object = {};
        if (options.defaults) {
          if (options.bytes === String) object.requestId = "";
          else {
            object.requestId = [];
            if (options.bytes !== Array)
              object.requestId = $util.newBuffer(object.requestId);
          }
          if ($util.Long) {
            let long = new $util.Long(0, 0, true);
            object.unpushedEvents =
              options.longs === String
                ? long.toString()
                : options.longs === Number
                  ? long.toNumber()
                  : long;
          } else object.unpushedEvents = options.longs === String ? "0" : 0;
        }
        if (message.requestId != null && message.hasOwnProperty("requestId"))
          object.requestId =
            options.bytes === String
              ? $util.base64.encode(
                  message.requestId,
                  0,
                  message.requestId.length,
                )
              : options.bytes === Array
                ? Array.prototype.slice.call(message.requestId)
                : message.requestId;
        if (
          message.unpushedEvents != null &&
          message.hasOwnProperty("unpushedEvents")
        )
          if (typeof message.unpushedEvents === "number")
            object.unpushedEvents =
              options.longs === String
                ? String(message.unpushedEvents)
                : message.unpushedEvents;
          else
            object.unpushedEvents =
              options.longs === String
                ? $util.Long.prototype.toString.call(message.unpushedEvents)
                : options.longs === Number
                  ? new $util.LongBits(
                      message.unpushedEvents.low >>> 0,
                      message.unpushedEvents.high >>> 0,
                    ).toNumber(true)
                  : message.unpushedEvents;
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

    mass.SyncStatusResponse = (function () {
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
        if (!writer) writer = $Writer.create();
        if (
          message.requestId != null &&
          Object.hasOwnProperty.call(message, "requestId")
        )
          writer.uint32(/* id 1, wireType 2 =*/ 10).bytes(message.requestId);
        if (
          message.error != null &&
          Object.hasOwnProperty.call(message, "error")
        )
          $root.market.mass.Error.encode(
            message.error,
            writer.uint32(/* id 2, wireType 2 =*/ 18).fork(),
          ).ldelim();
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
      SyncStatusResponse.encodeDelimited = function encodeDelimited(
        message,
        writer,
      ) {
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
        if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length,
          message = new $root.market.mass.SyncStatusResponse();
        while (reader.pos < end) {
          let tag = reader.uint32();
          switch (tag >>> 3) {
            case 1: {
              message.requestId = reader.bytes();
              break;
            }
            case 2: {
              message.error = $root.market.mass.Error.decode(
                reader,
                reader.uint32(),
              );
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
        if (!(reader instanceof $Reader)) reader = new $Reader(reader);
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
          if (
            !(
              (message.requestId &&
                typeof message.requestId.length === "number") ||
              $util.isString(message.requestId)
            )
          )
            return "requestId: buffer expected";
        if (message.error != null && message.hasOwnProperty("error")) {
          let error = $root.market.mass.Error.verify(message.error);
          if (error) return "error." + error;
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
            $util.base64.decode(
              object.requestId,
              (message.requestId = $util.newBuffer(
                $util.base64.length(object.requestId),
              )),
              0,
            );
          else if (object.requestId.length >= 0)
            message.requestId = object.requestId;
        if (object.error != null) {
          if (typeof object.error !== "object")
            throw TypeError(
              ".market.mass.SyncStatusResponse.error: object expected",
            );
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
        if (!options) options = {};
        let object = {};
        if (options.defaults) {
          if (options.bytes === String) object.requestId = "";
          else {
            object.requestId = [];
            if (options.bytes !== Array)
              object.requestId = $util.newBuffer(object.requestId);
          }
          object.error = null;
        }
        if (message.requestId != null && message.hasOwnProperty("requestId"))
          object.requestId =
            options.bytes === String
              ? $util.base64.encode(
                  message.requestId,
                  0,
                  message.requestId.length,
                )
              : options.bytes === Array
                ? Array.prototype.slice.call(message.requestId)
                : message.requestId;
        if (message.error != null && message.hasOwnProperty("error"))
          object.error = $root.market.mass.Error.toObject(
            message.error,
            options,
          );
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

    mass.PingRequest = (function () {
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
        if (!writer) writer = $Writer.create();
        if (
          message.requestId != null &&
          Object.hasOwnProperty.call(message, "requestId")
        )
          writer.uint32(/* id 1, wireType 2 =*/ 10).bytes(message.requestId);
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
        if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length,
          message = new $root.market.mass.PingRequest();
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
        if (!(reader instanceof $Reader)) reader = new $Reader(reader);
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
          if (
            !(
              (message.requestId &&
                typeof message.requestId.length === "number") ||
              $util.isString(message.requestId)
            )
          )
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
        if (object instanceof $root.market.mass.PingRequest) return object;
        let message = new $root.market.mass.PingRequest();
        if (object.requestId != null)
          if (typeof object.requestId === "string")
            $util.base64.decode(
              object.requestId,
              (message.requestId = $util.newBuffer(
                $util.base64.length(object.requestId),
              )),
              0,
            );
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
        if (!options) options = {};
        let object = {};
        if (options.defaults)
          if (options.bytes === String) object.requestId = "";
          else {
            object.requestId = [];
            if (options.bytes !== Array)
              object.requestId = $util.newBuffer(object.requestId);
          }
        if (message.requestId != null && message.hasOwnProperty("requestId"))
          object.requestId =
            options.bytes === String
              ? $util.base64.encode(
                  message.requestId,
                  0,
                  message.requestId.length,
                )
              : options.bytes === Array
                ? Array.prototype.slice.call(message.requestId)
                : message.requestId;
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

    mass.PingResponse = (function () {
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
        if (!writer) writer = $Writer.create();
        if (
          message.requestId != null &&
          Object.hasOwnProperty.call(message, "requestId")
        )
          writer.uint32(/* id 1, wireType 2 =*/ 10).bytes(message.requestId);
        if (
          message.error != null &&
          Object.hasOwnProperty.call(message, "error")
        )
          $root.market.mass.Error.encode(
            message.error,
            writer.uint32(/* id 2, wireType 2 =*/ 18).fork(),
          ).ldelim();
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
        if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length,
          message = new $root.market.mass.PingResponse();
        while (reader.pos < end) {
          let tag = reader.uint32();
          switch (tag >>> 3) {
            case 1: {
              message.requestId = reader.bytes();
              break;
            }
            case 2: {
              message.error = $root.market.mass.Error.decode(
                reader,
                reader.uint32(),
              );
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
        if (!(reader instanceof $Reader)) reader = new $Reader(reader);
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
          if (
            !(
              (message.requestId &&
                typeof message.requestId.length === "number") ||
              $util.isString(message.requestId)
            )
          )
            return "requestId: buffer expected";
        if (message.error != null && message.hasOwnProperty("error")) {
          let error = $root.market.mass.Error.verify(message.error);
          if (error) return "error." + error;
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
        if (object instanceof $root.market.mass.PingResponse) return object;
        let message = new $root.market.mass.PingResponse();
        if (object.requestId != null)
          if (typeof object.requestId === "string")
            $util.base64.decode(
              object.requestId,
              (message.requestId = $util.newBuffer(
                $util.base64.length(object.requestId),
              )),
              0,
            );
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
        if (!options) options = {};
        let object = {};
        if (options.defaults) {
          if (options.bytes === String) object.requestId = "";
          else {
            object.requestId = [];
            if (options.bytes !== Array)
              object.requestId = $util.newBuffer(object.requestId);
          }
          object.error = null;
        }
        if (message.requestId != null && message.hasOwnProperty("requestId"))
          object.requestId =
            options.bytes === String
              ? $util.base64.encode(
                  message.requestId,
                  0,
                  message.requestId.length,
                )
              : options.bytes === Array
                ? Array.prototype.slice.call(message.requestId)
                : message.requestId;
        if (message.error != null && message.hasOwnProperty("error"))
          object.error = $root.market.mass.Error.toObject(
            message.error,
            options,
          );
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

    return mass;
  })();

  return market;
})());

export const google = ($root.google = (() => {
  /**
   * Namespace google.
   * @exports google
   * @namespace
   */
  const google = {};

  google.protobuf = (function () {
    /**
     * Namespace protobuf.
     * @memberof google
     * @namespace
     */
    const protobuf = {};

    protobuf.Any = (function () {
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
          for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
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
        if (!writer) writer = $Writer.create();
        if (
          message.type_url != null &&
          Object.hasOwnProperty.call(message, "type_url")
        )
          writer.uint32(/* id 1, wireType 2 =*/ 10).string(message.type_url);
        if (
          message.value != null &&
          Object.hasOwnProperty.call(message, "value")
        )
          writer.uint32(/* id 2, wireType 2 =*/ 18).bytes(message.value);
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
        if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length,
          message = new $root.google.protobuf.Any();
        while (reader.pos < end) {
          let tag = reader.uint32();
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
        if (!(reader instanceof $Reader)) reader = new $Reader(reader);
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
          if (
            !(
              (message.value && typeof message.value.length === "number") ||
              $util.isString(message.value)
            )
          )
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
        if (object instanceof $root.google.protobuf.Any) return object;
        let message = new $root.google.protobuf.Any();
        if (object.type_url != null) message.type_url = String(object.type_url);
        if (object.value != null)
          if (typeof object.value === "string")
            $util.base64.decode(
              object.value,
              (message.value = $util.newBuffer(
                $util.base64.length(object.value),
              )),
              0,
            );
          else if (object.value.length >= 0) message.value = object.value;
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
        if (!options) options = {};
        let object = {};
        if (options.defaults) {
          object.type_url = "";
          if (options.bytes === String) object.value = "";
          else {
            object.value = [];
            if (options.bytes !== Array)
              object.value = $util.newBuffer(object.value);
          }
        }
        if (message.type_url != null && message.hasOwnProperty("type_url"))
          object.type_url = message.type_url;
        if (message.value != null && message.hasOwnProperty("value"))
          object.value =
            options.bytes === String
              ? $util.base64.encode(message.value, 0, message.value.length)
              : options.bytes === Array
                ? Array.prototype.slice.call(message.value)
                : message.value;
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
})());

export { $root as default };
