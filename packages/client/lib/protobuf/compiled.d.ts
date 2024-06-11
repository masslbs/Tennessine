import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace market. */
export namespace market {
  /** Namespace mass. */
  namespace mass {
    /** Properties of an AuthenticateRequest. */
    interface IAuthenticateRequest {
      /** AuthenticateRequest requestId */
      requestId?: Uint8Array | null;

      /** AuthenticateRequest publicKey */
      publicKey?: Uint8Array | null;
    }

    /** Represents an AuthenticateRequest. */
    class AuthenticateRequest implements IAuthenticateRequest {
      /**
       * Constructs a new AuthenticateRequest.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.IAuthenticateRequest);

      /** AuthenticateRequest requestId. */
      public requestId: Uint8Array;

      /** AuthenticateRequest publicKey. */
      public publicKey: Uint8Array;

      /**
       * Creates a new AuthenticateRequest instance using the specified properties.
       * @param [properties] Properties to set
       * @returns AuthenticateRequest instance
       */
      public static create(
        properties?: market.mass.IAuthenticateRequest,
      ): market.mass.AuthenticateRequest;

      /**
       * Encodes the specified AuthenticateRequest message. Does not implicitly {@link market.mass.AuthenticateRequest.verify|verify} messages.
       * @param message AuthenticateRequest message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.IAuthenticateRequest,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified AuthenticateRequest message, length delimited. Does not implicitly {@link market.mass.AuthenticateRequest.verify|verify} messages.
       * @param message AuthenticateRequest message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.IAuthenticateRequest,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes an AuthenticateRequest message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns AuthenticateRequest
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.AuthenticateRequest;

      /**
       * Decodes an AuthenticateRequest message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns AuthenticateRequest
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.AuthenticateRequest;

      /**
       * Verifies an AuthenticateRequest message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates an AuthenticateRequest message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns AuthenticateRequest
       */
      public static fromObject(object: {
        [k: string]: any;
      }): market.mass.AuthenticateRequest;

      /**
       * Creates a plain object from an AuthenticateRequest message. Also converts values to other types if specified.
       * @param message AuthenticateRequest
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.AuthenticateRequest,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this AuthenticateRequest to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for AuthenticateRequest
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an AuthenticateResponse. */
    interface IAuthenticateResponse {
      /** AuthenticateResponse requestId */
      requestId?: Uint8Array | null;

      /** AuthenticateResponse error */
      error?: market.mass.IError | null;

      /** AuthenticateResponse challenge */
      challenge?: Uint8Array | null;
    }

    /** Represents an AuthenticateResponse. */
    class AuthenticateResponse implements IAuthenticateResponse {
      /**
       * Constructs a new AuthenticateResponse.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.IAuthenticateResponse);

      /** AuthenticateResponse requestId. */
      public requestId: Uint8Array;

      /** AuthenticateResponse error. */
      public error?: market.mass.IError | null;

      /** AuthenticateResponse challenge. */
      public challenge: Uint8Array;

      /**
       * Creates a new AuthenticateResponse instance using the specified properties.
       * @param [properties] Properties to set
       * @returns AuthenticateResponse instance
       */
      public static create(
        properties?: market.mass.IAuthenticateResponse,
      ): market.mass.AuthenticateResponse;

      /**
       * Encodes the specified AuthenticateResponse message. Does not implicitly {@link market.mass.AuthenticateResponse.verify|verify} messages.
       * @param message AuthenticateResponse message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.IAuthenticateResponse,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified AuthenticateResponse message, length delimited. Does not implicitly {@link market.mass.AuthenticateResponse.verify|verify} messages.
       * @param message AuthenticateResponse message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.IAuthenticateResponse,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes an AuthenticateResponse message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns AuthenticateResponse
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.AuthenticateResponse;

      /**
       * Decodes an AuthenticateResponse message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns AuthenticateResponse
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.AuthenticateResponse;

      /**
       * Verifies an AuthenticateResponse message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates an AuthenticateResponse message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns AuthenticateResponse
       */
      public static fromObject(object: {
        [k: string]: any;
      }): market.mass.AuthenticateResponse;

      /**
       * Creates a plain object from an AuthenticateResponse message. Also converts values to other types if specified.
       * @param message AuthenticateResponse
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.AuthenticateResponse,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this AuthenticateResponse to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for AuthenticateResponse
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a ChallengeSolvedRequest. */
    interface IChallengeSolvedRequest {
      /** ChallengeSolvedRequest requestId */
      requestId?: Uint8Array | null;

      /** ChallengeSolvedRequest signature */
      signature?: Uint8Array | null;
    }

    /** Represents a ChallengeSolvedRequest. */
    class ChallengeSolvedRequest implements IChallengeSolvedRequest {
      /**
       * Constructs a new ChallengeSolvedRequest.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.IChallengeSolvedRequest);

      /** ChallengeSolvedRequest requestId. */
      public requestId: Uint8Array;

      /** ChallengeSolvedRequest signature. */
      public signature: Uint8Array;

      /**
       * Creates a new ChallengeSolvedRequest instance using the specified properties.
       * @param [properties] Properties to set
       * @returns ChallengeSolvedRequest instance
       */
      public static create(
        properties?: market.mass.IChallengeSolvedRequest,
      ): market.mass.ChallengeSolvedRequest;

      /**
       * Encodes the specified ChallengeSolvedRequest message. Does not implicitly {@link market.mass.ChallengeSolvedRequest.verify|verify} messages.
       * @param message ChallengeSolvedRequest message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.IChallengeSolvedRequest,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified ChallengeSolvedRequest message, length delimited. Does not implicitly {@link market.mass.ChallengeSolvedRequest.verify|verify} messages.
       * @param message ChallengeSolvedRequest message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.IChallengeSolvedRequest,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes a ChallengeSolvedRequest message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns ChallengeSolvedRequest
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.ChallengeSolvedRequest;

      /**
       * Decodes a ChallengeSolvedRequest message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns ChallengeSolvedRequest
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.ChallengeSolvedRequest;

      /**
       * Verifies a ChallengeSolvedRequest message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates a ChallengeSolvedRequest message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns ChallengeSolvedRequest
       */
      public static fromObject(object: {
        [k: string]: any;
      }): market.mass.ChallengeSolvedRequest;

      /**
       * Creates a plain object from a ChallengeSolvedRequest message. Also converts values to other types if specified.
       * @param message ChallengeSolvedRequest
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.ChallengeSolvedRequest,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this ChallengeSolvedRequest to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for ChallengeSolvedRequest
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a ChallengeSolvedResponse. */
    interface IChallengeSolvedResponse {
      /** ChallengeSolvedResponse requestId */
      requestId?: Uint8Array | null;

      /** ChallengeSolvedResponse error */
      error?: market.mass.IError | null;
    }

    /** Represents a ChallengeSolvedResponse. */
    class ChallengeSolvedResponse implements IChallengeSolvedResponse {
      /**
       * Constructs a new ChallengeSolvedResponse.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.IChallengeSolvedResponse);

      /** ChallengeSolvedResponse requestId. */
      public requestId: Uint8Array;

      /** ChallengeSolvedResponse error. */
      public error?: market.mass.IError | null;

      /**
       * Creates a new ChallengeSolvedResponse instance using the specified properties.
       * @param [properties] Properties to set
       * @returns ChallengeSolvedResponse instance
       */
      public static create(
        properties?: market.mass.IChallengeSolvedResponse,
      ): market.mass.ChallengeSolvedResponse;

      /**
       * Encodes the specified ChallengeSolvedResponse message. Does not implicitly {@link market.mass.ChallengeSolvedResponse.verify|verify} messages.
       * @param message ChallengeSolvedResponse message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.IChallengeSolvedResponse,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified ChallengeSolvedResponse message, length delimited. Does not implicitly {@link market.mass.ChallengeSolvedResponse.verify|verify} messages.
       * @param message ChallengeSolvedResponse message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.IChallengeSolvedResponse,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes a ChallengeSolvedResponse message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns ChallengeSolvedResponse
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.ChallengeSolvedResponse;

      /**
       * Decodes a ChallengeSolvedResponse message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns ChallengeSolvedResponse
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.ChallengeSolvedResponse;

      /**
       * Verifies a ChallengeSolvedResponse message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates a ChallengeSolvedResponse message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns ChallengeSolvedResponse
       */
      public static fromObject(object: {
        [k: string]: any;
      }): market.mass.ChallengeSolvedResponse;

      /**
       * Creates a plain object from a ChallengeSolvedResponse message. Also converts values to other types if specified.
       * @param message ChallengeSolvedResponse
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.ChallengeSolvedResponse,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this ChallengeSolvedResponse to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for ChallengeSolvedResponse
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an Error. */
    interface IError {
      /** Error code */
      code?: market.mass.ErrorCodes | null;

      /** Error message */
      message?: string | null;
    }

    /** Represents an Error. */
    class Error implements IError {
      /**
       * Constructs a new Error.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.IError);

      /** Error code. */
      public code: market.mass.ErrorCodes;

      /** Error message. */
      public message: string;

      /**
       * Creates a new Error instance using the specified properties.
       * @param [properties] Properties to set
       * @returns Error instance
       */
      public static create(properties?: market.mass.IError): market.mass.Error;

      /**
       * Encodes the specified Error message. Does not implicitly {@link market.mass.Error.verify|verify} messages.
       * @param message Error message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.IError,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified Error message, length delimited. Does not implicitly {@link market.mass.Error.verify|verify} messages.
       * @param message Error message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.IError,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes an Error message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns Error
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.Error;

      /**
       * Decodes an Error message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns Error
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.Error;

      /**
       * Verifies an Error message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates an Error message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns Error
       */
      public static fromObject(object: { [k: string]: any }): market.mass.Error;

      /**
       * Creates a plain object from an Error message. Also converts values to other types if specified.
       * @param message Error
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.Error,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this Error to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for Error
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** ErrorCodes enum. */
    enum ErrorCodes {
      ERROR_CODES_UNSPECIFIED = 0,
      ERROR_CODES_NOT_FOUND = 1,
      ERROR_CODES_INVALID = 2,
      ERROR_CODES_NOT_AUTHENTICATED = 3,
      ERROR_CODES_ALREADY_AUTHENTICATED = 4,
      ERROR_CODES_ALREADY_CONNECTED = 5,
      ERROR_CODES_TOO_MANY_CONCURRENT_REQUESTS = 6,
      ERROR_CODES_UNLINKED_KEYCARD = 7,
      ERROR_CODES_MINUMUM_VERSION_NOT_REACHED = 8,
      ERROR_CODES_OUT_OF_STOCK = 9,
      ERROR_CODES_SIMULATED = 10,
    }

    /** Properties of a StoreManifest. */
    interface IStoreManifest {
      /** StoreManifest eventId */
      eventId?: Uint8Array | null;

      /** StoreManifest storeTokenId */
      storeTokenId?: Uint8Array | null;

      /** StoreManifest domain */
      domain?: string | null;

      /** StoreManifest publishedTagId */
      publishedTagId?: Uint8Array | null;
    }

    /** Represents a StoreManifest. */
    class StoreManifest implements IStoreManifest {
      /**
       * Constructs a new StoreManifest.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.IStoreManifest);

      /** StoreManifest eventId. */
      public eventId: Uint8Array;

      /** StoreManifest storeTokenId. */
      public storeTokenId: Uint8Array;

      /** StoreManifest domain. */
      public domain: string;

      /** StoreManifest publishedTagId. */
      public publishedTagId: Uint8Array;

      /**
       * Creates a new StoreManifest instance using the specified properties.
       * @param [properties] Properties to set
       * @returns StoreManifest instance
       */
      public static create(
        properties?: market.mass.IStoreManifest,
      ): market.mass.StoreManifest;

      /**
       * Encodes the specified StoreManifest message. Does not implicitly {@link market.mass.StoreManifest.verify|verify} messages.
       * @param message StoreManifest message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.IStoreManifest,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified StoreManifest message, length delimited. Does not implicitly {@link market.mass.StoreManifest.verify|verify} messages.
       * @param message StoreManifest message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.IStoreManifest,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes a StoreManifest message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns StoreManifest
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.StoreManifest;

      /**
       * Decodes a StoreManifest message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns StoreManifest
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.StoreManifest;

      /**
       * Verifies a StoreManifest message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates a StoreManifest message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns StoreManifest
       */
      public static fromObject(object: {
        [k: string]: any;
      }): market.mass.StoreManifest;

      /**
       * Creates a plain object from a StoreManifest message. Also converts values to other types if specified.
       * @param message StoreManifest
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.StoreManifest,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this StoreManifest to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for StoreManifest
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an UpdateStoreManifest. */
    interface IUpdateStoreManifest {
      /** UpdateStoreManifest eventId */
      eventId?: Uint8Array | null;

      /** UpdateStoreManifest domain */
      domain?: string | null;

      /** UpdateStoreManifest publishedTagId */
      publishedTagId?: Uint8Array | null;

      /** UpdateStoreManifest addErc20Addr */
      addErc20Addr?: Uint8Array | null;

      /** UpdateStoreManifest removeErc20Addr */
      removeErc20Addr?: Uint8Array | null;
    }

    /** Represents an UpdateStoreManifest. */
    class UpdateStoreManifest implements IUpdateStoreManifest {
      /**
       * Constructs a new UpdateStoreManifest.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.IUpdateStoreManifest);

      /** UpdateStoreManifest eventId. */
      public eventId: Uint8Array;

      /** UpdateStoreManifest domain. */
      public domain?: string | null;

      /** UpdateStoreManifest publishedTagId. */
      public publishedTagId?: Uint8Array | null;

      /** UpdateStoreManifest addErc20Addr. */
      public addErc20Addr?: Uint8Array | null;

      /** UpdateStoreManifest removeErc20Addr. */
      public removeErc20Addr?: Uint8Array | null;

      /** UpdateStoreManifest _domain. */
      public _domain?: "domain";

      /** UpdateStoreManifest _publishedTagId. */
      public _publishedTagId?: "publishedTagId";

      /** UpdateStoreManifest _addErc20Addr. */
      public _addErc20Addr?: "addErc20Addr";

      /** UpdateStoreManifest _removeErc20Addr. */
      public _removeErc20Addr?: "removeErc20Addr";

      /**
       * Creates a new UpdateStoreManifest instance using the specified properties.
       * @param [properties] Properties to set
       * @returns UpdateStoreManifest instance
       */
      public static create(
        properties?: market.mass.IUpdateStoreManifest,
      ): market.mass.UpdateStoreManifest;

      /**
       * Encodes the specified UpdateStoreManifest message. Does not implicitly {@link market.mass.UpdateStoreManifest.verify|verify} messages.
       * @param message UpdateStoreManifest message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.IUpdateStoreManifest,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified UpdateStoreManifest message, length delimited. Does not implicitly {@link market.mass.UpdateStoreManifest.verify|verify} messages.
       * @param message UpdateStoreManifest message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.IUpdateStoreManifest,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes an UpdateStoreManifest message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns UpdateStoreManifest
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.UpdateStoreManifest;

      /**
       * Decodes an UpdateStoreManifest message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns UpdateStoreManifest
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.UpdateStoreManifest;

      /**
       * Verifies an UpdateStoreManifest message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates an UpdateStoreManifest message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns UpdateStoreManifest
       */
      public static fromObject(object: {
        [k: string]: any;
      }): market.mass.UpdateStoreManifest;

      /**
       * Creates a plain object from an UpdateStoreManifest message. Also converts values to other types if specified.
       * @param message UpdateStoreManifest
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.UpdateStoreManifest,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this UpdateStoreManifest to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for UpdateStoreManifest
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a CreateItem. */
    interface ICreateItem {
      /** CreateItem eventId */
      eventId?: Uint8Array | null;

      /** CreateItem price */
      price?: string | null;

      /** CreateItem metadata */
      metadata?: Uint8Array | null;
    }

    /** Represents a CreateItem. */
    class CreateItem implements ICreateItem {
      /**
       * Constructs a new CreateItem.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.ICreateItem);

      /** CreateItem eventId. */
      public eventId: Uint8Array;

      /** CreateItem price. */
      public price: string;

      /** CreateItem metadata. */
      public metadata: Uint8Array;

      /**
       * Creates a new CreateItem instance using the specified properties.
       * @param [properties] Properties to set
       * @returns CreateItem instance
       */
      public static create(
        properties?: market.mass.ICreateItem,
      ): market.mass.CreateItem;

      /**
       * Encodes the specified CreateItem message. Does not implicitly {@link market.mass.CreateItem.verify|verify} messages.
       * @param message CreateItem message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.ICreateItem,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified CreateItem message, length delimited. Does not implicitly {@link market.mass.CreateItem.verify|verify} messages.
       * @param message CreateItem message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.ICreateItem,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes a CreateItem message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns CreateItem
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.CreateItem;

      /**
       * Decodes a CreateItem message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns CreateItem
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.CreateItem;

      /**
       * Verifies a CreateItem message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates a CreateItem message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns CreateItem
       */
      public static fromObject(object: {
        [k: string]: any;
      }): market.mass.CreateItem;

      /**
       * Creates a plain object from a CreateItem message. Also converts values to other types if specified.
       * @param message CreateItem
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.CreateItem,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this CreateItem to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for CreateItem
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an UpdateItem. */
    interface IUpdateItem {
      /** UpdateItem eventId */
      eventId?: Uint8Array | null;

      /** UpdateItem itemId */
      itemId?: Uint8Array | null;

      /** UpdateItem price */
      price?: string | null;

      /** UpdateItem metadata */
      metadata?: Uint8Array | null;
    }

    /** Represents an UpdateItem. */
    class UpdateItem implements IUpdateItem {
      /**
       * Constructs a new UpdateItem.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.IUpdateItem);

      /** UpdateItem eventId. */
      public eventId: Uint8Array;

      /** UpdateItem itemId. */
      public itemId: Uint8Array;

      /** UpdateItem price. */
      public price?: string | null;

      /** UpdateItem metadata. */
      public metadata?: Uint8Array | null;

      /** UpdateItem _price. */
      public _price?: "price";

      /** UpdateItem _metadata. */
      public _metadata?: "metadata";

      /**
       * Creates a new UpdateItem instance using the specified properties.
       * @param [properties] Properties to set
       * @returns UpdateItem instance
       */
      public static create(
        properties?: market.mass.IUpdateItem,
      ): market.mass.UpdateItem;

      /**
       * Encodes the specified UpdateItem message. Does not implicitly {@link market.mass.UpdateItem.verify|verify} messages.
       * @param message UpdateItem message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.IUpdateItem,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified UpdateItem message, length delimited. Does not implicitly {@link market.mass.UpdateItem.verify|verify} messages.
       * @param message UpdateItem message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.IUpdateItem,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes an UpdateItem message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns UpdateItem
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.UpdateItem;

      /**
       * Decodes an UpdateItem message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns UpdateItem
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.UpdateItem;

      /**
       * Verifies an UpdateItem message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates an UpdateItem message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns UpdateItem
       */
      public static fromObject(object: {
        [k: string]: any;
      }): market.mass.UpdateItem;

      /**
       * Creates a plain object from an UpdateItem message. Also converts values to other types if specified.
       * @param message UpdateItem
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.UpdateItem,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this UpdateItem to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for UpdateItem
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a CreateTag. */
    interface ICreateTag {
      /** CreateTag eventId */
      eventId?: Uint8Array | null;

      /** CreateTag name */
      name?: string | null;
    }

    /** Represents a CreateTag. */
    class CreateTag implements ICreateTag {
      /**
       * Constructs a new CreateTag.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.ICreateTag);

      /** CreateTag eventId. */
      public eventId: Uint8Array;

      /** CreateTag name. */
      public name: string;

      /**
       * Creates a new CreateTag instance using the specified properties.
       * @param [properties] Properties to set
       * @returns CreateTag instance
       */
      public static create(
        properties?: market.mass.ICreateTag,
      ): market.mass.CreateTag;

      /**
       * Encodes the specified CreateTag message. Does not implicitly {@link market.mass.CreateTag.verify|verify} messages.
       * @param message CreateTag message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.ICreateTag,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified CreateTag message, length delimited. Does not implicitly {@link market.mass.CreateTag.verify|verify} messages.
       * @param message CreateTag message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.ICreateTag,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes a CreateTag message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns CreateTag
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.CreateTag;

      /**
       * Decodes a CreateTag message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns CreateTag
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.CreateTag;

      /**
       * Verifies a CreateTag message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates a CreateTag message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns CreateTag
       */
      public static fromObject(object: {
        [k: string]: any;
      }): market.mass.CreateTag;

      /**
       * Creates a plain object from a CreateTag message. Also converts values to other types if specified.
       * @param message CreateTag
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.CreateTag,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this CreateTag to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for CreateTag
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an UpdateTag. */
    interface IUpdateTag {
      /** UpdateTag eventId */
      eventId?: Uint8Array | null;

      /** UpdateTag tagId */
      tagId?: Uint8Array | null;

      /** UpdateTag addItemId */
      addItemId?: Uint8Array | null;

      /** UpdateTag removeItemId */
      removeItemId?: Uint8Array | null;

      /** UpdateTag delete */
      delete?: boolean | null;

      /** UpdateTag rename */
      rename?: string | null;
    }

    /** Represents an UpdateTag. */
    class UpdateTag implements IUpdateTag {
      /**
       * Constructs a new UpdateTag.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.IUpdateTag);

      /** UpdateTag eventId. */
      public eventId: Uint8Array;

      /** UpdateTag tagId. */
      public tagId: Uint8Array;

      /** UpdateTag addItemId. */
      public addItemId?: Uint8Array | null;

      /** UpdateTag removeItemId. */
      public removeItemId?: Uint8Array | null;

      /** UpdateTag delete. */
      public delete?: boolean | null;

      /** UpdateTag rename. */
      public rename?: string | null;

      /** UpdateTag _addItemId. */
      public _addItemId?: "addItemId";

      /** UpdateTag _removeItemId. */
      public _removeItemId?: "removeItemId";

      /** UpdateTag _delete. */
      public _delete?: "delete";

      /** UpdateTag _rename. */
      public _rename?: "rename";

      /**
       * Creates a new UpdateTag instance using the specified properties.
       * @param [properties] Properties to set
       * @returns UpdateTag instance
       */
      public static create(
        properties?: market.mass.IUpdateTag,
      ): market.mass.UpdateTag;

      /**
       * Encodes the specified UpdateTag message. Does not implicitly {@link market.mass.UpdateTag.verify|verify} messages.
       * @param message UpdateTag message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.IUpdateTag,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified UpdateTag message, length delimited. Does not implicitly {@link market.mass.UpdateTag.verify|verify} messages.
       * @param message UpdateTag message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.IUpdateTag,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes an UpdateTag message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns UpdateTag
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.UpdateTag;

      /**
       * Decodes an UpdateTag message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns UpdateTag
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.UpdateTag;

      /**
       * Verifies an UpdateTag message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates an UpdateTag message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns UpdateTag
       */
      public static fromObject(object: {
        [k: string]: any;
      }): market.mass.UpdateTag;

      /**
       * Creates a plain object from an UpdateTag message. Also converts values to other types if specified.
       * @param message UpdateTag
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.UpdateTag,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this UpdateTag to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for UpdateTag
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a ChangeStock. */
    interface IChangeStock {
      /** ChangeStock eventId */
      eventId?: Uint8Array | null;

      /** ChangeStock itemIds */
      itemIds?: Uint8Array[] | null;

      /** ChangeStock diffs */
      diffs?: number[] | null;

      /** ChangeStock orderId */
      orderId?: Uint8Array | null;

      /** ChangeStock txHash */
      txHash?: Uint8Array | null;
    }

    /** Represents a ChangeStock. */
    class ChangeStock implements IChangeStock {
      /**
       * Constructs a new ChangeStock.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.IChangeStock);

      /** ChangeStock eventId. */
      public eventId: Uint8Array;

      /** ChangeStock itemIds. */
      public itemIds: Uint8Array[];

      /** ChangeStock diffs. */
      public diffs: number[];

      /** ChangeStock orderId. */
      public orderId: Uint8Array;

      /** ChangeStock txHash. */
      public txHash: Uint8Array;

      /**
       * Creates a new ChangeStock instance using the specified properties.
       * @param [properties] Properties to set
       * @returns ChangeStock instance
       */
      public static create(
        properties?: market.mass.IChangeStock,
      ): market.mass.ChangeStock;

      /**
       * Encodes the specified ChangeStock message. Does not implicitly {@link market.mass.ChangeStock.verify|verify} messages.
       * @param message ChangeStock message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.IChangeStock,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified ChangeStock message, length delimited. Does not implicitly {@link market.mass.ChangeStock.verify|verify} messages.
       * @param message ChangeStock message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.IChangeStock,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes a ChangeStock message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns ChangeStock
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.ChangeStock;

      /**
       * Decodes a ChangeStock message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns ChangeStock
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.ChangeStock;

      /**
       * Verifies a ChangeStock message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates a ChangeStock message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns ChangeStock
       */
      public static fromObject(object: {
        [k: string]: any;
      }): market.mass.ChangeStock;

      /**
       * Creates a plain object from a ChangeStock message. Also converts values to other types if specified.
       * @param message ChangeStock
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.ChangeStock,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this ChangeStock to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for ChangeStock
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a NewKeyCard. */
    interface INewKeyCard {
      /** NewKeyCard eventId */
      eventId?: Uint8Array | null;

      /** NewKeyCard userWalletAddr */
      userWalletAddr?: Uint8Array | null;

      /** NewKeyCard cardPublicKey */
      cardPublicKey?: Uint8Array | null;

      /** NewKeyCard isGuest */
      isGuest?: boolean | null;
    }

    /** Represents a NewKeyCard. */
    class NewKeyCard implements INewKeyCard {
      /**
       * Constructs a new NewKeyCard.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.INewKeyCard);

      /** NewKeyCard eventId. */
      public eventId: Uint8Array;

      /** NewKeyCard userWalletAddr. */
      public userWalletAddr: Uint8Array;

      /** NewKeyCard cardPublicKey. */
      public cardPublicKey: Uint8Array;

      /** NewKeyCard isGuest. */
      public isGuest: boolean;

      /**
       * Creates a new NewKeyCard instance using the specified properties.
       * @param [properties] Properties to set
       * @returns NewKeyCard instance
       */
      public static create(
        properties?: market.mass.INewKeyCard,
      ): market.mass.NewKeyCard;

      /**
       * Encodes the specified NewKeyCard message. Does not implicitly {@link market.mass.NewKeyCard.verify|verify} messages.
       * @param message NewKeyCard message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.INewKeyCard,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified NewKeyCard message, length delimited. Does not implicitly {@link market.mass.NewKeyCard.verify|verify} messages.
       * @param message NewKeyCard message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.INewKeyCard,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes a NewKeyCard message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns NewKeyCard
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.NewKeyCard;

      /**
       * Decodes a NewKeyCard message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns NewKeyCard
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.NewKeyCard;

      /**
       * Verifies a NewKeyCard message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates a NewKeyCard message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns NewKeyCard
       */
      public static fromObject(object: {
        [k: string]: any;
      }): market.mass.NewKeyCard;

      /**
       * Creates a plain object from a NewKeyCard message. Also converts values to other types if specified.
       * @param message NewKeyCard
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.NewKeyCard,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this NewKeyCard to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for NewKeyCard
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a CreateOrder. */
    interface ICreateOrder {
      /** CreateOrder eventId */
      eventId?: Uint8Array | null;
    }

    /** Represents a CreateOrder. */
    class CreateOrder implements ICreateOrder {
      /**
       * Constructs a new CreateOrder.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.ICreateOrder);

      /** CreateOrder eventId. */
      public eventId: Uint8Array;

      /**
       * Creates a new CreateOrder instance using the specified properties.
       * @param [properties] Properties to set
       * @returns CreateOrder instance
       */
      public static create(
        properties?: market.mass.ICreateOrder,
      ): market.mass.CreateOrder;

      /**
       * Encodes the specified CreateOrder message. Does not implicitly {@link market.mass.CreateOrder.verify|verify} messages.
       * @param message CreateOrder message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.ICreateOrder,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified CreateOrder message, length delimited. Does not implicitly {@link market.mass.CreateOrder.verify|verify} messages.
       * @param message CreateOrder message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.ICreateOrder,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes a CreateOrder message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns CreateOrder
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.CreateOrder;

      /**
       * Decodes a CreateOrder message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns CreateOrder
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.CreateOrder;

      /**
       * Verifies a CreateOrder message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates a CreateOrder message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns CreateOrder
       */
      public static fromObject(object: {
        [k: string]: any;
      }): market.mass.CreateOrder;

      /**
       * Creates a plain object from a CreateOrder message. Also converts values to other types if specified.
       * @param message CreateOrder
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.CreateOrder,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this CreateOrder to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for CreateOrder
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an UpdateOrder. */
    interface IUpdateOrder {
      /** UpdateOrder eventId */
      eventId?: Uint8Array | null;

      /** UpdateOrder orderId */
      orderId?: Uint8Array | null;

      /** UpdateOrder changeItems */
      changeItems?: market.mass.UpdateOrder.IChangeItems | null;

      /** UpdateOrder itemsFinalized */
      itemsFinalized?: market.mass.UpdateOrder.IItemsFinalized | null;

      /** UpdateOrder orderCanceled */
      orderCanceled?: market.mass.UpdateOrder.IOrderCanceled | null;
    }

    /** Represents an UpdateOrder. */
    class UpdateOrder implements IUpdateOrder {
      /**
       * Constructs a new UpdateOrder.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.IUpdateOrder);

      /** UpdateOrder eventId. */
      public eventId: Uint8Array;

      /** UpdateOrder orderId. */
      public orderId: Uint8Array;

      /** UpdateOrder changeItems. */
      public changeItems?: market.mass.UpdateOrder.IChangeItems | null;

      /** UpdateOrder itemsFinalized. */
      public itemsFinalized?: market.mass.UpdateOrder.IItemsFinalized | null;

      /** UpdateOrder orderCanceled. */
      public orderCanceled?: market.mass.UpdateOrder.IOrderCanceled | null;

      /** UpdateOrder action. */
      public action?: "changeItems" | "itemsFinalized" | "orderCanceled";

      /**
       * Creates a new UpdateOrder instance using the specified properties.
       * @param [properties] Properties to set
       * @returns UpdateOrder instance
       */
      public static create(
        properties?: market.mass.IUpdateOrder,
      ): market.mass.UpdateOrder;

      /**
       * Encodes the specified UpdateOrder message. Does not implicitly {@link market.mass.UpdateOrder.verify|verify} messages.
       * @param message UpdateOrder message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.IUpdateOrder,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified UpdateOrder message, length delimited. Does not implicitly {@link market.mass.UpdateOrder.verify|verify} messages.
       * @param message UpdateOrder message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.IUpdateOrder,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes an UpdateOrder message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns UpdateOrder
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.UpdateOrder;

      /**
       * Decodes an UpdateOrder message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns UpdateOrder
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.UpdateOrder;

      /**
       * Verifies an UpdateOrder message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates an UpdateOrder message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns UpdateOrder
       */
      public static fromObject(object: {
        [k: string]: any;
      }): market.mass.UpdateOrder;

      /**
       * Creates a plain object from an UpdateOrder message. Also converts values to other types if specified.
       * @param message UpdateOrder
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.UpdateOrder,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this UpdateOrder to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for UpdateOrder
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace UpdateOrder {
      /** Properties of a ChangeItems. */
      interface IChangeItems {
        /** ChangeItems itemId */
        itemId?: Uint8Array | null;

        /** ChangeItems quantity */
        quantity?: number | null;
      }

      /** Represents a ChangeItems. */
      class ChangeItems implements IChangeItems {
        /**
         * Constructs a new ChangeItems.
         * @param [properties] Properties to set
         */
        constructor(properties?: market.mass.UpdateOrder.IChangeItems);

        /** ChangeItems itemId. */
        public itemId: Uint8Array;

        /** ChangeItems quantity. */
        public quantity: number;

        /**
         * Creates a new ChangeItems instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ChangeItems instance
         */
        public static create(
          properties?: market.mass.UpdateOrder.IChangeItems,
        ): market.mass.UpdateOrder.ChangeItems;

        /**
         * Encodes the specified ChangeItems message. Does not implicitly {@link market.mass.UpdateOrder.ChangeItems.verify|verify} messages.
         * @param message ChangeItems message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(
          message: market.mass.UpdateOrder.IChangeItems,
          writer?: $protobuf.Writer,
        ): $protobuf.Writer;

        /**
         * Encodes the specified ChangeItems message, length delimited. Does not implicitly {@link market.mass.UpdateOrder.ChangeItems.verify|verify} messages.
         * @param message ChangeItems message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(
          message: market.mass.UpdateOrder.IChangeItems,
          writer?: $protobuf.Writer,
        ): $protobuf.Writer;

        /**
         * Decodes a ChangeItems message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ChangeItems
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(
          reader: $protobuf.Reader | Uint8Array,
          length?: number,
        ): market.mass.UpdateOrder.ChangeItems;

        /**
         * Decodes a ChangeItems message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ChangeItems
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(
          reader: $protobuf.Reader | Uint8Array,
        ): market.mass.UpdateOrder.ChangeItems;

        /**
         * Verifies a ChangeItems message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): string | null;

        /**
         * Creates a ChangeItems message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ChangeItems
         */
        public static fromObject(object: {
          [k: string]: any;
        }): market.mass.UpdateOrder.ChangeItems;

        /**
         * Creates a plain object from a ChangeItems message. Also converts values to other types if specified.
         * @param message ChangeItems
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(
          message: market.mass.UpdateOrder.ChangeItems,
          options?: $protobuf.IConversionOptions,
        ): { [k: string]: any };

        /**
         * Converts this ChangeItems to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ChangeItems
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
      }

      /** Properties of an ItemsFinalized. */
      interface IItemsFinalized {
        /** ItemsFinalized paymentId */
        paymentId?: Uint8Array | null;

        /** ItemsFinalized subTotal */
        subTotal?: string | null;

        /** ItemsFinalized salesTax */
        salesTax?: string | null;

        /** ItemsFinalized total */
        total?: string | null;

        /** ItemsFinalized ttl */
        ttl?: string | null;

        /** ItemsFinalized orderHash */
        orderHash?: Uint8Array | null;

        /** ItemsFinalized currencyAddr */
        currencyAddr?: Uint8Array | null;

        /** ItemsFinalized totalInCrypto */
        totalInCrypto?: string | null;

        /** ItemsFinalized payeeAddr */
        payeeAddr?: Uint8Array | null;

        /** ItemsFinalized isPaymentEndpoint */
        isPaymentEndpoint?: boolean | null;

        /** ItemsFinalized shopSignature */
        shopSignature?: Uint8Array | null;
      }

      /** Represents an ItemsFinalized. */
      class ItemsFinalized implements IItemsFinalized {
        /**
         * Constructs a new ItemsFinalized.
         * @param [properties] Properties to set
         */
        constructor(properties?: market.mass.UpdateOrder.IItemsFinalized);

        /** ItemsFinalized paymentId. */
        public paymentId: Uint8Array;

        /** ItemsFinalized subTotal. */
        public subTotal: string;

        /** ItemsFinalized salesTax. */
        public salesTax: string;

        /** ItemsFinalized total. */
        public total: string;

        /** ItemsFinalized ttl. */
        public ttl: string;

        /** ItemsFinalized orderHash. */
        public orderHash: Uint8Array;

        /** ItemsFinalized currencyAddr. */
        public currencyAddr: Uint8Array;

        /** ItemsFinalized totalInCrypto. */
        public totalInCrypto: string;

        /** ItemsFinalized payeeAddr. */
        public payeeAddr: Uint8Array;

        /** ItemsFinalized isPaymentEndpoint. */
        public isPaymentEndpoint: boolean;

        /** ItemsFinalized shopSignature. */
        public shopSignature: Uint8Array;

        /**
         * Creates a new ItemsFinalized instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ItemsFinalized instance
         */
        public static create(
          properties?: market.mass.UpdateOrder.IItemsFinalized,
        ): market.mass.UpdateOrder.ItemsFinalized;

        /**
         * Encodes the specified ItemsFinalized message. Does not implicitly {@link market.mass.UpdateOrder.ItemsFinalized.verify|verify} messages.
         * @param message ItemsFinalized message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(
          message: market.mass.UpdateOrder.IItemsFinalized,
          writer?: $protobuf.Writer,
        ): $protobuf.Writer;

        /**
         * Encodes the specified ItemsFinalized message, length delimited. Does not implicitly {@link market.mass.UpdateOrder.ItemsFinalized.verify|verify} messages.
         * @param message ItemsFinalized message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(
          message: market.mass.UpdateOrder.IItemsFinalized,
          writer?: $protobuf.Writer,
        ): $protobuf.Writer;

        /**
         * Decodes an ItemsFinalized message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ItemsFinalized
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(
          reader: $protobuf.Reader | Uint8Array,
          length?: number,
        ): market.mass.UpdateOrder.ItemsFinalized;

        /**
         * Decodes an ItemsFinalized message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ItemsFinalized
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(
          reader: $protobuf.Reader | Uint8Array,
        ): market.mass.UpdateOrder.ItemsFinalized;

        /**
         * Verifies an ItemsFinalized message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): string | null;

        /**
         * Creates an ItemsFinalized message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ItemsFinalized
         */
        public static fromObject(object: {
          [k: string]: any;
        }): market.mass.UpdateOrder.ItemsFinalized;

        /**
         * Creates a plain object from an ItemsFinalized message. Also converts values to other types if specified.
         * @param message ItemsFinalized
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(
          message: market.mass.UpdateOrder.ItemsFinalized,
          options?: $protobuf.IConversionOptions,
        ): { [k: string]: any };

        /**
         * Converts this ItemsFinalized to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ItemsFinalized
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
      }

      /** Properties of an OrderCanceled. */
      interface IOrderCanceled {
        /** OrderCanceled timestamp */
        timestamp?: number | Long | null;
      }

      /** Represents an OrderCanceled. */
      class OrderCanceled implements IOrderCanceled {
        /**
         * Constructs a new OrderCanceled.
         * @param [properties] Properties to set
         */
        constructor(properties?: market.mass.UpdateOrder.IOrderCanceled);

        /** OrderCanceled timestamp. */
        public timestamp: number | Long;

        /**
         * Creates a new OrderCanceled instance using the specified properties.
         * @param [properties] Properties to set
         * @returns OrderCanceled instance
         */
        public static create(
          properties?: market.mass.UpdateOrder.IOrderCanceled,
        ): market.mass.UpdateOrder.OrderCanceled;

        /**
         * Encodes the specified OrderCanceled message. Does not implicitly {@link market.mass.UpdateOrder.OrderCanceled.verify|verify} messages.
         * @param message OrderCanceled message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(
          message: market.mass.UpdateOrder.IOrderCanceled,
          writer?: $protobuf.Writer,
        ): $protobuf.Writer;

        /**
         * Encodes the specified OrderCanceled message, length delimited. Does not implicitly {@link market.mass.UpdateOrder.OrderCanceled.verify|verify} messages.
         * @param message OrderCanceled message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(
          message: market.mass.UpdateOrder.IOrderCanceled,
          writer?: $protobuf.Writer,
        ): $protobuf.Writer;

        /**
         * Decodes an OrderCanceled message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns OrderCanceled
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(
          reader: $protobuf.Reader | Uint8Array,
          length?: number,
        ): market.mass.UpdateOrder.OrderCanceled;

        /**
         * Decodes an OrderCanceled message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns OrderCanceled
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(
          reader: $protobuf.Reader | Uint8Array,
        ): market.mass.UpdateOrder.OrderCanceled;

        /**
         * Verifies an OrderCanceled message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): string | null;

        /**
         * Creates an OrderCanceled message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns OrderCanceled
         */
        public static fromObject(object: {
          [k: string]: any;
        }): market.mass.UpdateOrder.OrderCanceled;

        /**
         * Creates a plain object from an OrderCanceled message. Also converts values to other types if specified.
         * @param message OrderCanceled
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(
          message: market.mass.UpdateOrder.OrderCanceled,
          options?: $protobuf.IConversionOptions,
        ): { [k: string]: any };

        /**
         * Converts this OrderCanceled to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for OrderCanceled
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
      }
    }

    /** Properties of a StoreEvent. */
    interface IStoreEvent {
      /** StoreEvent signature */
      signature?: Uint8Array | null;

      /** StoreEvent storeManifest */
      storeManifest?: market.mass.IStoreManifest | null;

      /** StoreEvent updateStoreManifest */
      updateStoreManifest?: market.mass.IUpdateStoreManifest | null;

      /** StoreEvent createItem */
      createItem?: market.mass.ICreateItem | null;

      /** StoreEvent updateItem */
      updateItem?: market.mass.IUpdateItem | null;

      /** StoreEvent createTag */
      createTag?: market.mass.ICreateTag | null;

      /** StoreEvent updateTag */
      updateTag?: market.mass.IUpdateTag | null;

      /** StoreEvent createOrder */
      createOrder?: market.mass.ICreateOrder | null;

      /** StoreEvent updateOrder */
      updateOrder?: market.mass.IUpdateOrder | null;

      /** StoreEvent changeStock */
      changeStock?: market.mass.IChangeStock | null;

      /** StoreEvent newKeyCard */
      newKeyCard?: market.mass.INewKeyCard | null;
    }

    /** Represents a StoreEvent. */
    class StoreEvent implements IStoreEvent {
      /**
       * Constructs a new StoreEvent.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.IStoreEvent);

      /** StoreEvent signature. */
      public signature: Uint8Array;

      /** StoreEvent storeManifest. */
      public storeManifest?: market.mass.IStoreManifest | null;

      /** StoreEvent updateStoreManifest. */
      public updateStoreManifest?: market.mass.IUpdateStoreManifest | null;

      /** StoreEvent createItem. */
      public createItem?: market.mass.ICreateItem | null;

      /** StoreEvent updateItem. */
      public updateItem?: market.mass.IUpdateItem | null;

      /** StoreEvent createTag. */
      public createTag?: market.mass.ICreateTag | null;

      /** StoreEvent updateTag. */
      public updateTag?: market.mass.IUpdateTag | null;

      /** StoreEvent createOrder. */
      public createOrder?: market.mass.ICreateOrder | null;

      /** StoreEvent updateOrder. */
      public updateOrder?: market.mass.IUpdateOrder | null;

      /** StoreEvent changeStock. */
      public changeStock?: market.mass.IChangeStock | null;

      /** StoreEvent newKeyCard. */
      public newKeyCard?: market.mass.INewKeyCard | null;

      /** StoreEvent union. */
      public union?:
        | "storeManifest"
        | "updateStoreManifest"
        | "createItem"
        | "updateItem"
        | "createTag"
        | "updateTag"
        | "createOrder"
        | "updateOrder"
        | "changeStock"
        | "newKeyCard";

      /**
       * Creates a new StoreEvent instance using the specified properties.
       * @param [properties] Properties to set
       * @returns StoreEvent instance
       */
      public static create(
        properties?: market.mass.IStoreEvent,
      ): market.mass.StoreEvent;

      /**
       * Encodes the specified StoreEvent message. Does not implicitly {@link market.mass.StoreEvent.verify|verify} messages.
       * @param message StoreEvent message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.IStoreEvent,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified StoreEvent message, length delimited. Does not implicitly {@link market.mass.StoreEvent.verify|verify} messages.
       * @param message StoreEvent message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.IStoreEvent,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes a StoreEvent message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns StoreEvent
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.StoreEvent;

      /**
       * Decodes a StoreEvent message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns StoreEvent
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.StoreEvent;

      /**
       * Verifies a StoreEvent message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates a StoreEvent message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns StoreEvent
       */
      public static fromObject(object: {
        [k: string]: any;
      }): market.mass.StoreEvent;

      /**
       * Creates a plain object from a StoreEvent message. Also converts values to other types if specified.
       * @param message StoreEvent
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.StoreEvent,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this StoreEvent to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for StoreEvent
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a CommitItemsToOrderRequest. */
    interface ICommitItemsToOrderRequest {
      /** CommitItemsToOrderRequest requestId */
      requestId?: Uint8Array | null;

      /** CommitItemsToOrderRequest orderId */
      orderId?: Uint8Array | null;

      /** CommitItemsToOrderRequest erc20Addr */
      erc20Addr?: Uint8Array | null;

      /** CommitItemsToOrderRequest chainId */
      chainId?: number | Long | null;
    }

    /** Represents a CommitItemsToOrderRequest. */
    class CommitItemsToOrderRequest implements ICommitItemsToOrderRequest {
      /**
       * Constructs a new CommitItemsToOrderRequest.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.ICommitItemsToOrderRequest);

      /** CommitItemsToOrderRequest requestId. */
      public requestId: Uint8Array;

      /** CommitItemsToOrderRequest orderId. */
      public orderId: Uint8Array;

      /** CommitItemsToOrderRequest erc20Addr. */
      public erc20Addr: Uint8Array;

      /** CommitItemsToOrderRequest chainId. */
      public chainId: number | Long;

      /**
       * Creates a new CommitItemsToOrderRequest instance using the specified properties.
       * @param [properties] Properties to set
       * @returns CommitItemsToOrderRequest instance
       */
      public static create(
        properties?: market.mass.ICommitItemsToOrderRequest,
      ): market.mass.CommitItemsToOrderRequest;

      /**
       * Encodes the specified CommitItemsToOrderRequest message. Does not implicitly {@link market.mass.CommitItemsToOrderRequest.verify|verify} messages.
       * @param message CommitItemsToOrderRequest message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.ICommitItemsToOrderRequest,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified CommitItemsToOrderRequest message, length delimited. Does not implicitly {@link market.mass.CommitItemsToOrderRequest.verify|verify} messages.
       * @param message CommitItemsToOrderRequest message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.ICommitItemsToOrderRequest,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes a CommitItemsToOrderRequest message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns CommitItemsToOrderRequest
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.CommitItemsToOrderRequest;

      /**
       * Decodes a CommitItemsToOrderRequest message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns CommitItemsToOrderRequest
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.CommitItemsToOrderRequest;

      /**
       * Verifies a CommitItemsToOrderRequest message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates a CommitItemsToOrderRequest message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns CommitItemsToOrderRequest
       */
      public static fromObject(object: {
        [k: string]: any;
      }): market.mass.CommitItemsToOrderRequest;

      /**
       * Creates a plain object from a CommitItemsToOrderRequest message. Also converts values to other types if specified.
       * @param message CommitItemsToOrderRequest
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.CommitItemsToOrderRequest,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this CommitItemsToOrderRequest to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for CommitItemsToOrderRequest
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a CommitItemsToOrderResponse. */
    interface ICommitItemsToOrderResponse {
      /** CommitItemsToOrderResponse requestId */
      requestId?: Uint8Array | null;

      /** CommitItemsToOrderResponse error */
      error?: market.mass.IError | null;

      /** CommitItemsToOrderResponse orderFinalizedId */
      orderFinalizedId?: Uint8Array | null;
    }

    /** Represents a CommitItemsToOrderResponse. */
    class CommitItemsToOrderResponse implements ICommitItemsToOrderResponse {
      /**
       * Constructs a new CommitItemsToOrderResponse.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.ICommitItemsToOrderResponse);

      /** CommitItemsToOrderResponse requestId. */
      public requestId: Uint8Array;

      /** CommitItemsToOrderResponse error. */
      public error?: market.mass.IError | null;

      /** CommitItemsToOrderResponse orderFinalizedId. */
      public orderFinalizedId: Uint8Array;

      /**
       * Creates a new CommitItemsToOrderResponse instance using the specified properties.
       * @param [properties] Properties to set
       * @returns CommitItemsToOrderResponse instance
       */
      public static create(
        properties?: market.mass.ICommitItemsToOrderResponse,
      ): market.mass.CommitItemsToOrderResponse;

      /**
       * Encodes the specified CommitItemsToOrderResponse message. Does not implicitly {@link market.mass.CommitItemsToOrderResponse.verify|verify} messages.
       * @param message CommitItemsToOrderResponse message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.ICommitItemsToOrderResponse,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified CommitItemsToOrderResponse message, length delimited. Does not implicitly {@link market.mass.CommitItemsToOrderResponse.verify|verify} messages.
       * @param message CommitItemsToOrderResponse message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.ICommitItemsToOrderResponse,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes a CommitItemsToOrderResponse message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns CommitItemsToOrderResponse
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.CommitItemsToOrderResponse;

      /**
       * Decodes a CommitItemsToOrderResponse message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns CommitItemsToOrderResponse
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.CommitItemsToOrderResponse;

      /**
       * Verifies a CommitItemsToOrderResponse message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates a CommitItemsToOrderResponse message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns CommitItemsToOrderResponse
       */
      public static fromObject(object: {
        [k: string]: any;
      }): market.mass.CommitItemsToOrderResponse;

      /**
       * Creates a plain object from a CommitItemsToOrderResponse message. Also converts values to other types if specified.
       * @param message CommitItemsToOrderResponse
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.CommitItemsToOrderResponse,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this CommitItemsToOrderResponse to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for CommitItemsToOrderResponse
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GetBlobUploadURLRequest. */
    interface IGetBlobUploadURLRequest {
      /** GetBlobUploadURLRequest requestId */
      requestId?: Uint8Array | null;
    }

    /** Represents a GetBlobUploadURLRequest. */
    class GetBlobUploadURLRequest implements IGetBlobUploadURLRequest {
      /**
       * Constructs a new GetBlobUploadURLRequest.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.IGetBlobUploadURLRequest);

      /** GetBlobUploadURLRequest requestId. */
      public requestId: Uint8Array;

      /**
       * Creates a new GetBlobUploadURLRequest instance using the specified properties.
       * @param [properties] Properties to set
       * @returns GetBlobUploadURLRequest instance
       */
      public static create(
        properties?: market.mass.IGetBlobUploadURLRequest,
      ): market.mass.GetBlobUploadURLRequest;

      /**
       * Encodes the specified GetBlobUploadURLRequest message. Does not implicitly {@link market.mass.GetBlobUploadURLRequest.verify|verify} messages.
       * @param message GetBlobUploadURLRequest message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.IGetBlobUploadURLRequest,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified GetBlobUploadURLRequest message, length delimited. Does not implicitly {@link market.mass.GetBlobUploadURLRequest.verify|verify} messages.
       * @param message GetBlobUploadURLRequest message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.IGetBlobUploadURLRequest,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes a GetBlobUploadURLRequest message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns GetBlobUploadURLRequest
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.GetBlobUploadURLRequest;

      /**
       * Decodes a GetBlobUploadURLRequest message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns GetBlobUploadURLRequest
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.GetBlobUploadURLRequest;

      /**
       * Verifies a GetBlobUploadURLRequest message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates a GetBlobUploadURLRequest message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns GetBlobUploadURLRequest
       */
      public static fromObject(object: {
        [k: string]: any;
      }): market.mass.GetBlobUploadURLRequest;

      /**
       * Creates a plain object from a GetBlobUploadURLRequest message. Also converts values to other types if specified.
       * @param message GetBlobUploadURLRequest
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.GetBlobUploadURLRequest,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this GetBlobUploadURLRequest to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for GetBlobUploadURLRequest
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GetBlobUploadURLResponse. */
    interface IGetBlobUploadURLResponse {
      /** GetBlobUploadURLResponse requestId */
      requestId?: Uint8Array | null;

      /** GetBlobUploadURLResponse error */
      error?: market.mass.IError | null;

      /** GetBlobUploadURLResponse url */
      url?: string | null;
    }

    /** Represents a GetBlobUploadURLResponse. */
    class GetBlobUploadURLResponse implements IGetBlobUploadURLResponse {
      /**
       * Constructs a new GetBlobUploadURLResponse.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.IGetBlobUploadURLResponse);

      /** GetBlobUploadURLResponse requestId. */
      public requestId: Uint8Array;

      /** GetBlobUploadURLResponse error. */
      public error?: market.mass.IError | null;

      /** GetBlobUploadURLResponse url. */
      public url: string;

      /**
       * Creates a new GetBlobUploadURLResponse instance using the specified properties.
       * @param [properties] Properties to set
       * @returns GetBlobUploadURLResponse instance
       */
      public static create(
        properties?: market.mass.IGetBlobUploadURLResponse,
      ): market.mass.GetBlobUploadURLResponse;

      /**
       * Encodes the specified GetBlobUploadURLResponse message. Does not implicitly {@link market.mass.GetBlobUploadURLResponse.verify|verify} messages.
       * @param message GetBlobUploadURLResponse message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.IGetBlobUploadURLResponse,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified GetBlobUploadURLResponse message, length delimited. Does not implicitly {@link market.mass.GetBlobUploadURLResponse.verify|verify} messages.
       * @param message GetBlobUploadURLResponse message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.IGetBlobUploadURLResponse,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes a GetBlobUploadURLResponse message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns GetBlobUploadURLResponse
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.GetBlobUploadURLResponse;

      /**
       * Decodes a GetBlobUploadURLResponse message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns GetBlobUploadURLResponse
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.GetBlobUploadURLResponse;

      /**
       * Verifies a GetBlobUploadURLResponse message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates a GetBlobUploadURLResponse message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns GetBlobUploadURLResponse
       */
      public static fromObject(object: {
        [k: string]: any;
      }): market.mass.GetBlobUploadURLResponse;

      /**
       * Creates a plain object from a GetBlobUploadURLResponse message. Also converts values to other types if specified.
       * @param message GetBlobUploadURLResponse
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.GetBlobUploadURLResponse,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this GetBlobUploadURLResponse to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for GetBlobUploadURLResponse
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an EventWriteRequest. */
    interface IEventWriteRequest {
      /** EventWriteRequest requestId */
      requestId?: Uint8Array | null;

      /** EventWriteRequest event */
      event?: google.protobuf.IAny | null;
    }

    /** Represents an EventWriteRequest. */
    class EventWriteRequest implements IEventWriteRequest {
      /**
       * Constructs a new EventWriteRequest.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.IEventWriteRequest);

      /** EventWriteRequest requestId. */
      public requestId: Uint8Array;

      /** EventWriteRequest event. */
      public event?: google.protobuf.IAny | null;

      /**
       * Creates a new EventWriteRequest instance using the specified properties.
       * @param [properties] Properties to set
       * @returns EventWriteRequest instance
       */
      public static create(
        properties?: market.mass.IEventWriteRequest,
      ): market.mass.EventWriteRequest;

      /**
       * Encodes the specified EventWriteRequest message. Does not implicitly {@link market.mass.EventWriteRequest.verify|verify} messages.
       * @param message EventWriteRequest message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.IEventWriteRequest,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified EventWriteRequest message, length delimited. Does not implicitly {@link market.mass.EventWriteRequest.verify|verify} messages.
       * @param message EventWriteRequest message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.IEventWriteRequest,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes an EventWriteRequest message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns EventWriteRequest
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.EventWriteRequest;

      /**
       * Decodes an EventWriteRequest message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns EventWriteRequest
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.EventWriteRequest;

      /**
       * Verifies an EventWriteRequest message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates an EventWriteRequest message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns EventWriteRequest
       */
      public static fromObject(object: {
        [k: string]: any;
      }): market.mass.EventWriteRequest;

      /**
       * Creates a plain object from an EventWriteRequest message. Also converts values to other types if specified.
       * @param message EventWriteRequest
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.EventWriteRequest,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this EventWriteRequest to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for EventWriteRequest
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an EventWriteResponse. */
    interface IEventWriteResponse {
      /** EventWriteResponse requestId */
      requestId?: Uint8Array | null;

      /** EventWriteResponse error */
      error?: market.mass.IError | null;

      /** EventWriteResponse newStoreHash */
      newStoreHash?: Uint8Array | null;

      /** EventWriteResponse eventSequenceNo */
      eventSequenceNo?: number | Long | null;
    }

    /** Represents an EventWriteResponse. */
    class EventWriteResponse implements IEventWriteResponse {
      /**
       * Constructs a new EventWriteResponse.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.IEventWriteResponse);

      /** EventWriteResponse requestId. */
      public requestId: Uint8Array;

      /** EventWriteResponse error. */
      public error?: market.mass.IError | null;

      /** EventWriteResponse newStoreHash. */
      public newStoreHash: Uint8Array;

      /** EventWriteResponse eventSequenceNo. */
      public eventSequenceNo: number | Long;

      /**
       * Creates a new EventWriteResponse instance using the specified properties.
       * @param [properties] Properties to set
       * @returns EventWriteResponse instance
       */
      public static create(
        properties?: market.mass.IEventWriteResponse,
      ): market.mass.EventWriteResponse;

      /**
       * Encodes the specified EventWriteResponse message. Does not implicitly {@link market.mass.EventWriteResponse.verify|verify} messages.
       * @param message EventWriteResponse message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.IEventWriteResponse,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified EventWriteResponse message, length delimited. Does not implicitly {@link market.mass.EventWriteResponse.verify|verify} messages.
       * @param message EventWriteResponse message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.IEventWriteResponse,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes an EventWriteResponse message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns EventWriteResponse
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.EventWriteResponse;

      /**
       * Decodes an EventWriteResponse message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns EventWriteResponse
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.EventWriteResponse;

      /**
       * Verifies an EventWriteResponse message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates an EventWriteResponse message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns EventWriteResponse
       */
      public static fromObject(object: {
        [k: string]: any;
      }): market.mass.EventWriteResponse;

      /**
       * Creates a plain object from an EventWriteResponse message. Also converts values to other types if specified.
       * @param message EventWriteResponse
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.EventWriteResponse,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this EventWriteResponse to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for EventWriteResponse
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an EventPushRequest. */
    interface IEventPushRequest {
      /** EventPushRequest requestId */
      requestId?: Uint8Array | null;

      /** EventPushRequest events */
      events?: google.protobuf.IAny[] | null;
    }

    /** Represents an EventPushRequest. */
    class EventPushRequest implements IEventPushRequest {
      /**
       * Constructs a new EventPushRequest.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.IEventPushRequest);

      /** EventPushRequest requestId. */
      public requestId: Uint8Array;

      /** EventPushRequest events. */
      public events: google.protobuf.IAny[];

      /**
       * Creates a new EventPushRequest instance using the specified properties.
       * @param [properties] Properties to set
       * @returns EventPushRequest instance
       */
      public static create(
        properties?: market.mass.IEventPushRequest,
      ): market.mass.EventPushRequest;

      /**
       * Encodes the specified EventPushRequest message. Does not implicitly {@link market.mass.EventPushRequest.verify|verify} messages.
       * @param message EventPushRequest message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.IEventPushRequest,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified EventPushRequest message, length delimited. Does not implicitly {@link market.mass.EventPushRequest.verify|verify} messages.
       * @param message EventPushRequest message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.IEventPushRequest,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes an EventPushRequest message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns EventPushRequest
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.EventPushRequest;

      /**
       * Decodes an EventPushRequest message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns EventPushRequest
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.EventPushRequest;

      /**
       * Verifies an EventPushRequest message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates an EventPushRequest message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns EventPushRequest
       */
      public static fromObject(object: {
        [k: string]: any;
      }): market.mass.EventPushRequest;

      /**
       * Creates a plain object from an EventPushRequest message. Also converts values to other types if specified.
       * @param message EventPushRequest
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.EventPushRequest,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this EventPushRequest to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for EventPushRequest
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an EventPushResponse. */
    interface IEventPushResponse {
      /** EventPushResponse requestId */
      requestId?: Uint8Array | null;

      /** EventPushResponse error */
      error?: market.mass.IError | null;
    }

    /** Represents an EventPushResponse. */
    class EventPushResponse implements IEventPushResponse {
      /**
       * Constructs a new EventPushResponse.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.IEventPushResponse);

      /** EventPushResponse requestId. */
      public requestId: Uint8Array;

      /** EventPushResponse error. */
      public error?: market.mass.IError | null;

      /**
       * Creates a new EventPushResponse instance using the specified properties.
       * @param [properties] Properties to set
       * @returns EventPushResponse instance
       */
      public static create(
        properties?: market.mass.IEventPushResponse,
      ): market.mass.EventPushResponse;

      /**
       * Encodes the specified EventPushResponse message. Does not implicitly {@link market.mass.EventPushResponse.verify|verify} messages.
       * @param message EventPushResponse message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.IEventPushResponse,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified EventPushResponse message, length delimited. Does not implicitly {@link market.mass.EventPushResponse.verify|verify} messages.
       * @param message EventPushResponse message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.IEventPushResponse,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes an EventPushResponse message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns EventPushResponse
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.EventPushResponse;

      /**
       * Decodes an EventPushResponse message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns EventPushResponse
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.EventPushResponse;

      /**
       * Verifies an EventPushResponse message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates an EventPushResponse message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns EventPushResponse
       */
      public static fromObject(object: {
        [k: string]: any;
      }): market.mass.EventPushResponse;

      /**
       * Creates a plain object from an EventPushResponse message. Also converts values to other types if specified.
       * @param message EventPushResponse
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.EventPushResponse,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this EventPushResponse to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for EventPushResponse
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a SyncStatusRequest. */
    interface ISyncStatusRequest {
      /** SyncStatusRequest requestId */
      requestId?: Uint8Array | null;

      /** SyncStatusRequest unpushedEvents */
      unpushedEvents?: number | Long | null;
    }

    /** Represents a SyncStatusRequest. */
    class SyncStatusRequest implements ISyncStatusRequest {
      /**
       * Constructs a new SyncStatusRequest.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.ISyncStatusRequest);

      /** SyncStatusRequest requestId. */
      public requestId: Uint8Array;

      /** SyncStatusRequest unpushedEvents. */
      public unpushedEvents: number | Long;

      /**
       * Creates a new SyncStatusRequest instance using the specified properties.
       * @param [properties] Properties to set
       * @returns SyncStatusRequest instance
       */
      public static create(
        properties?: market.mass.ISyncStatusRequest,
      ): market.mass.SyncStatusRequest;

      /**
       * Encodes the specified SyncStatusRequest message. Does not implicitly {@link market.mass.SyncStatusRequest.verify|verify} messages.
       * @param message SyncStatusRequest message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.ISyncStatusRequest,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified SyncStatusRequest message, length delimited. Does not implicitly {@link market.mass.SyncStatusRequest.verify|verify} messages.
       * @param message SyncStatusRequest message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.ISyncStatusRequest,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes a SyncStatusRequest message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns SyncStatusRequest
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.SyncStatusRequest;

      /**
       * Decodes a SyncStatusRequest message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns SyncStatusRequest
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.SyncStatusRequest;

      /**
       * Verifies a SyncStatusRequest message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates a SyncStatusRequest message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns SyncStatusRequest
       */
      public static fromObject(object: {
        [k: string]: any;
      }): market.mass.SyncStatusRequest;

      /**
       * Creates a plain object from a SyncStatusRequest message. Also converts values to other types if specified.
       * @param message SyncStatusRequest
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.SyncStatusRequest,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this SyncStatusRequest to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for SyncStatusRequest
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a SyncStatusResponse. */
    interface ISyncStatusResponse {
      /** SyncStatusResponse requestId */
      requestId?: Uint8Array | null;

      /** SyncStatusResponse error */
      error?: market.mass.IError | null;
    }

    /** Represents a SyncStatusResponse. */
    class SyncStatusResponse implements ISyncStatusResponse {
      /**
       * Constructs a new SyncStatusResponse.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.ISyncStatusResponse);

      /** SyncStatusResponse requestId. */
      public requestId: Uint8Array;

      /** SyncStatusResponse error. */
      public error?: market.mass.IError | null;

      /**
       * Creates a new SyncStatusResponse instance using the specified properties.
       * @param [properties] Properties to set
       * @returns SyncStatusResponse instance
       */
      public static create(
        properties?: market.mass.ISyncStatusResponse,
      ): market.mass.SyncStatusResponse;

      /**
       * Encodes the specified SyncStatusResponse message. Does not implicitly {@link market.mass.SyncStatusResponse.verify|verify} messages.
       * @param message SyncStatusResponse message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.ISyncStatusResponse,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified SyncStatusResponse message, length delimited. Does not implicitly {@link market.mass.SyncStatusResponse.verify|verify} messages.
       * @param message SyncStatusResponse message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.ISyncStatusResponse,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes a SyncStatusResponse message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns SyncStatusResponse
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.SyncStatusResponse;

      /**
       * Decodes a SyncStatusResponse message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns SyncStatusResponse
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.SyncStatusResponse;

      /**
       * Verifies a SyncStatusResponse message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates a SyncStatusResponse message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns SyncStatusResponse
       */
      public static fromObject(object: {
        [k: string]: any;
      }): market.mass.SyncStatusResponse;

      /**
       * Creates a plain object from a SyncStatusResponse message. Also converts values to other types if specified.
       * @param message SyncStatusResponse
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.SyncStatusResponse,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this SyncStatusResponse to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for SyncStatusResponse
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PingRequest. */
    interface IPingRequest {
      /** PingRequest requestId */
      requestId?: Uint8Array | null;
    }

    /** Represents a PingRequest. */
    class PingRequest implements IPingRequest {
      /**
       * Constructs a new PingRequest.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.IPingRequest);

      /** PingRequest requestId. */
      public requestId: Uint8Array;

      /**
       * Creates a new PingRequest instance using the specified properties.
       * @param [properties] Properties to set
       * @returns PingRequest instance
       */
      public static create(
        properties?: market.mass.IPingRequest,
      ): market.mass.PingRequest;

      /**
       * Encodes the specified PingRequest message. Does not implicitly {@link market.mass.PingRequest.verify|verify} messages.
       * @param message PingRequest message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.IPingRequest,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified PingRequest message, length delimited. Does not implicitly {@link market.mass.PingRequest.verify|verify} messages.
       * @param message PingRequest message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.IPingRequest,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes a PingRequest message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns PingRequest
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.PingRequest;

      /**
       * Decodes a PingRequest message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns PingRequest
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.PingRequest;

      /**
       * Verifies a PingRequest message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates a PingRequest message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns PingRequest
       */
      public static fromObject(object: {
        [k: string]: any;
      }): market.mass.PingRequest;

      /**
       * Creates a plain object from a PingRequest message. Also converts values to other types if specified.
       * @param message PingRequest
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.PingRequest,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this PingRequest to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for PingRequest
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PingResponse. */
    interface IPingResponse {
      /** PingResponse requestId */
      requestId?: Uint8Array | null;

      /** PingResponse error */
      error?: market.mass.IError | null;
    }

    /** Represents a PingResponse. */
    class PingResponse implements IPingResponse {
      /**
       * Constructs a new PingResponse.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.IPingResponse);

      /** PingResponse requestId. */
      public requestId: Uint8Array;

      /** PingResponse error. */
      public error?: market.mass.IError | null;

      /**
       * Creates a new PingResponse instance using the specified properties.
       * @param [properties] Properties to set
       * @returns PingResponse instance
       */
      public static create(
        properties?: market.mass.IPingResponse,
      ): market.mass.PingResponse;

      /**
       * Encodes the specified PingResponse message. Does not implicitly {@link market.mass.PingResponse.verify|verify} messages.
       * @param message PingResponse message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.IPingResponse,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified PingResponse message, length delimited. Does not implicitly {@link market.mass.PingResponse.verify|verify} messages.
       * @param message PingResponse message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.IPingResponse,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes a PingResponse message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns PingResponse
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.PingResponse;

      /**
       * Decodes a PingResponse message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns PingResponse
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.PingResponse;

      /**
       * Verifies a PingResponse message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates a PingResponse message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns PingResponse
       */
      public static fromObject(object: {
        [k: string]: any;
      }): market.mass.PingResponse;

      /**
       * Creates a plain object from a PingResponse message. Also converts values to other types if specified.
       * @param message PingResponse
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.PingResponse,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this PingResponse to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for PingResponse
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }
  }
}

/** Namespace google. */
export namespace google {
  /** Namespace protobuf. */
  namespace protobuf {
    /** Properties of an Any. */
    interface IAny {
      /** Any type_url */
      type_url?: string | null;

      /** Any value */
      value?: Uint8Array | null;
    }

    /** Represents an Any. */
    class Any implements IAny {
      /**
       * Constructs a new Any.
       * @param [properties] Properties to set
       */
      constructor(properties?: google.protobuf.IAny);

      /** Any type_url. */
      public type_url: string;

      /** Any value. */
      public value: Uint8Array;

      /**
       * Creates a new Any instance using the specified properties.
       * @param [properties] Properties to set
       * @returns Any instance
       */
      public static create(
        properties?: google.protobuf.IAny,
      ): google.protobuf.Any;

      /**
       * Encodes the specified Any message. Does not implicitly {@link google.protobuf.Any.verify|verify} messages.
       * @param message Any message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: google.protobuf.IAny,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified Any message, length delimited. Does not implicitly {@link google.protobuf.Any.verify|verify} messages.
       * @param message Any message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: google.protobuf.IAny,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes an Any message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns Any
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): google.protobuf.Any;

      /**
       * Decodes an Any message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns Any
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): google.protobuf.Any;

      /**
       * Verifies an Any message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates an Any message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns Any
       */
      public static fromObject(object: {
        [k: string]: any;
      }): google.protobuf.Any;

      /**
       * Creates a plain object from an Any message. Also converts values to other types if specified.
       * @param message Any
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: google.protobuf.Any,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this Any to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for Any
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }
  }
}
