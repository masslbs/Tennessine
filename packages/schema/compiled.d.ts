import * as $protobuf from "npm:protobufjs";
import Long from "npm:long";
/** Namespace market. */
export namespace market {
  /** Namespace mass. */
  namespace mass {
    /** Properties of an AuthenticateRequest. */
    interface IAuthenticateRequest {
      /** AuthenticateRequest publicKey */
      publicKey?: market.mass.IPublicKey | null;
    }

    /** Represents an AuthenticateRequest. */
    class AuthenticateRequest implements IAuthenticateRequest {
      /**
       * Constructs a new AuthenticateRequest.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.IAuthenticateRequest);

      /** AuthenticateRequest publicKey. */
      public publicKey?: market.mass.IPublicKey | null;

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

    /** Properties of a ChallengeSolvedRequest. */
    interface IChallengeSolvedRequest {
      /** ChallengeSolvedRequest signature */
      signature?: market.mass.ISignature | null;
    }

    /** Represents a ChallengeSolvedRequest. */
    class ChallengeSolvedRequest implements IChallengeSolvedRequest {
      /**
       * Constructs a new ChallengeSolvedRequest.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.IChallengeSolvedRequest);

      /** ChallengeSolvedRequest signature. */
      public signature?: market.mass.ISignature | null;

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

    /** Properties of a RequestId. */
    interface IRequestId {
      /** RequestId raw */
      raw?: number | Long | null;
    }

    /** Represents a RequestId. */
    class RequestId implements IRequestId {
      /**
       * Constructs a new RequestId.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.IRequestId);

      /** RequestId raw. */
      public raw: number | Long;

      /**
       * Creates a new RequestId instance using the specified properties.
       * @param [properties] Properties to set
       * @returns RequestId instance
       */
      public static create(
        properties?: market.mass.IRequestId,
      ): market.mass.RequestId;

      /**
       * Encodes the specified RequestId message. Does not implicitly {@link market.mass.RequestId.verify|verify} messages.
       * @param message RequestId message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.IRequestId,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified RequestId message, length delimited. Does not implicitly {@link market.mass.RequestId.verify|verify} messages.
       * @param message RequestId message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.IRequestId,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes a RequestId message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns RequestId
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.RequestId;

      /**
       * Decodes a RequestId message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns RequestId
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.RequestId;

      /**
       * Verifies a RequestId message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates a RequestId message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns RequestId
       */
      public static fromObject(object: {
        [k: string]: any;
      }): market.mass.RequestId;

      /**
       * Creates a plain object from a RequestId message. Also converts values to other types if specified.
       * @param message RequestId
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.RequestId,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this RequestId to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for RequestId
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an ObjectId. */
    interface IObjectId {
      /** ObjectId raw */
      raw?: Uint8Array | null;
    }

    /** Represents an ObjectId. */
    class ObjectId implements IObjectId {
      /**
       * Constructs a new ObjectId.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.IObjectId);

      /** ObjectId raw. */
      public raw: Uint8Array;

      /**
       * Creates a new ObjectId instance using the specified properties.
       * @param [properties] Properties to set
       * @returns ObjectId instance
       */
      public static create(
        properties?: market.mass.IObjectId,
      ): market.mass.ObjectId;

      /**
       * Encodes the specified ObjectId message. Does not implicitly {@link market.mass.ObjectId.verify|verify} messages.
       * @param message ObjectId message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.IObjectId,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified ObjectId message, length delimited. Does not implicitly {@link market.mass.ObjectId.verify|verify} messages.
       * @param message ObjectId message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.IObjectId,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes an ObjectId message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns ObjectId
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.ObjectId;

      /**
       * Decodes an ObjectId message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns ObjectId
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.ObjectId;

      /**
       * Verifies an ObjectId message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates an ObjectId message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns ObjectId
       */
      public static fromObject(object: {
        [k: string]: any;
      }): market.mass.ObjectId;

      /**
       * Creates a plain object from an ObjectId message. Also converts values to other types if specified.
       * @param message ObjectId
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.ObjectId,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this ObjectId to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for ObjectId
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a Signature. */
    interface ISignature {
      /** Signature raw */
      raw?: Uint8Array | null;
    }

    /** Represents a Signature. */
    class Signature implements ISignature {
      /**
       * Constructs a new Signature.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.ISignature);

      /** Signature raw. */
      public raw: Uint8Array;

      /**
       * Creates a new Signature instance using the specified properties.
       * @param [properties] Properties to set
       * @returns Signature instance
       */
      public static create(
        properties?: market.mass.ISignature,
      ): market.mass.Signature;

      /**
       * Encodes the specified Signature message. Does not implicitly {@link market.mass.Signature.verify|verify} messages.
       * @param message Signature message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.ISignature,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified Signature message, length delimited. Does not implicitly {@link market.mass.Signature.verify|verify} messages.
       * @param message Signature message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.ISignature,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes a Signature message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns Signature
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.Signature;

      /**
       * Decodes a Signature message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns Signature
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.Signature;

      /**
       * Verifies a Signature message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates a Signature message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns Signature
       */
      public static fromObject(object: {
        [k: string]: any;
      }): market.mass.Signature;

      /**
       * Creates a plain object from a Signature message. Also converts values to other types if specified.
       * @param message Signature
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.Signature,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this Signature to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for Signature
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PublicKey. */
    interface IPublicKey {
      /** PublicKey raw */
      raw?: Uint8Array | null;
    }

    /** Represents a PublicKey. */
    class PublicKey implements IPublicKey {
      /**
       * Constructs a new PublicKey.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.IPublicKey);

      /** PublicKey raw. */
      public raw: Uint8Array;

      /**
       * Creates a new PublicKey instance using the specified properties.
       * @param [properties] Properties to set
       * @returns PublicKey instance
       */
      public static create(
        properties?: market.mass.IPublicKey,
      ): market.mass.PublicKey;

      /**
       * Encodes the specified PublicKey message. Does not implicitly {@link market.mass.PublicKey.verify|verify} messages.
       * @param message PublicKey message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.IPublicKey,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified PublicKey message, length delimited. Does not implicitly {@link market.mass.PublicKey.verify|verify} messages.
       * @param message PublicKey message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.IPublicKey,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes a PublicKey message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns PublicKey
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.PublicKey;

      /**
       * Decodes a PublicKey message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns PublicKey
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.PublicKey;

      /**
       * Verifies a PublicKey message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates a PublicKey message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns PublicKey
       */
      public static fromObject(object: {
        [k: string]: any;
      }): market.mass.PublicKey;

      /**
       * Creates a plain object from a PublicKey message. Also converts values to other types if specified.
       * @param message PublicKey
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.PublicKey,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this PublicKey to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for PublicKey
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a Hash. */
    interface IHash {
      /** Hash raw */
      raw?: Uint8Array | null;
    }

    /** Represents a Hash. */
    class Hash implements IHash {
      /**
       * Constructs a new Hash.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.IHash);

      /** Hash raw. */
      public raw: Uint8Array;

      /**
       * Creates a new Hash instance using the specified properties.
       * @param [properties] Properties to set
       * @returns Hash instance
       */
      public static create(properties?: market.mass.IHash): market.mass.Hash;

      /**
       * Encodes the specified Hash message. Does not implicitly {@link market.mass.Hash.verify|verify} messages.
       * @param message Hash message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.IHash,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified Hash message, length delimited. Does not implicitly {@link market.mass.Hash.verify|verify} messages.
       * @param message Hash message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.IHash,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes a Hash message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns Hash
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.Hash;

      /**
       * Decodes a Hash message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns Hash
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.Hash;

      /**
       * Verifies a Hash message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates a Hash message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns Hash
       */
      public static fromObject(object: { [k: string]: any }): market.mass.Hash;

      /**
       * Creates a plain object from a Hash message. Also converts values to other types if specified.
       * @param message Hash
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.Hash,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this Hash to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for Hash
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an EthereumAddress. */
    interface IEthereumAddress {
      /** EthereumAddress raw */
      raw?: Uint8Array | null;
    }

    /** Represents an EthereumAddress. */
    class EthereumAddress implements IEthereumAddress {
      /**
       * Constructs a new EthereumAddress.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.IEthereumAddress);

      /** EthereumAddress raw. */
      public raw: Uint8Array;

      /**
       * Creates a new EthereumAddress instance using the specified properties.
       * @param [properties] Properties to set
       * @returns EthereumAddress instance
       */
      public static create(
        properties?: market.mass.IEthereumAddress,
      ): market.mass.EthereumAddress;

      /**
       * Encodes the specified EthereumAddress message. Does not implicitly {@link market.mass.EthereumAddress.verify|verify} messages.
       * @param message EthereumAddress message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.IEthereumAddress,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified EthereumAddress message, length delimited. Does not implicitly {@link market.mass.EthereumAddress.verify|verify} messages.
       * @param message EthereumAddress message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.IEthereumAddress,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes an EthereumAddress message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns EthereumAddress
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.EthereumAddress;

      /**
       * Decodes an EthereumAddress message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns EthereumAddress
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.EthereumAddress;

      /**
       * Verifies an EthereumAddress message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates an EthereumAddress message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns EthereumAddress
       */
      public static fromObject(object: {
        [k: string]: any;
      }): market.mass.EthereumAddress;

      /**
       * Creates a plain object from an EthereumAddress message. Also converts values to other types if specified.
       * @param message EthereumAddress
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.EthereumAddress,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this EthereumAddress to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for EthereumAddress
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a IPFSAddress. */
    interface IIPFSAddress {
      /** IPFSAddress cid */
      cid?: string | null;
    }

    /** Represents a IPFSAddress. */
    class IPFSAddress implements IIPFSAddress {
      /**
       * Constructs a new IPFSAddress.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.IIPFSAddress);

      /** IPFSAddress cid. */
      public cid: string;

      /**
       * Creates a new IPFSAddress instance using the specified properties.
       * @param [properties] Properties to set
       * @returns IPFSAddress instance
       */
      public static create(
        properties?: market.mass.IIPFSAddress,
      ): market.mass.IPFSAddress;

      /**
       * Encodes the specified IPFSAddress message. Does not implicitly {@link market.mass.IPFSAddress.verify|verify} messages.
       * @param message IPFSAddress message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.IIPFSAddress,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified IPFSAddress message, length delimited. Does not implicitly {@link market.mass.IPFSAddress.verify|verify} messages.
       * @param message IPFSAddress message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.IIPFSAddress,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes a IPFSAddress message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns IPFSAddress
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.IPFSAddress;

      /**
       * Decodes a IPFSAddress message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns IPFSAddress
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.IPFSAddress;

      /**
       * Verifies a IPFSAddress message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates a IPFSAddress message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns IPFSAddress
       */
      public static fromObject(object: {
        [k: string]: any;
      }): market.mass.IPFSAddress;

      /**
       * Creates a plain object from a IPFSAddress message. Also converts values to other types if specified.
       * @param message IPFSAddress
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.IPFSAddress,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this IPFSAddress to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for IPFSAddress
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an Uint256. */
    interface IUint256 {
      /** Uint256 raw */
      raw?: Uint8Array | null;
    }

    /** Represents an Uint256. */
    class Uint256 implements IUint256 {
      /**
       * Constructs a new Uint256.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.IUint256);

      /** Uint256 raw. */
      public raw: Uint8Array;

      /**
       * Creates a new Uint256 instance using the specified properties.
       * @param [properties] Properties to set
       * @returns Uint256 instance
       */
      public static create(
        properties?: market.mass.IUint256,
      ): market.mass.Uint256;

      /**
       * Encodes the specified Uint256 message. Does not implicitly {@link market.mass.Uint256.verify|verify} messages.
       * @param message Uint256 message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.IUint256,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified Uint256 message, length delimited. Does not implicitly {@link market.mass.Uint256.verify|verify} messages.
       * @param message Uint256 message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.IUint256,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes an Uint256 message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns Uint256
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.Uint256;

      /**
       * Decodes an Uint256 message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns Uint256
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.Uint256;

      /**
       * Verifies an Uint256 message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates an Uint256 message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns Uint256
       */
      public static fromObject(object: {
        [k: string]: any;
      }): market.mass.Uint256;

      /**
       * Creates a plain object from an Uint256 message. Also converts values to other types if specified.
       * @param message Uint256
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.Uint256,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this Uint256 to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for Uint256
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a ShopCurrency. */
    interface IShopCurrency {
      /** ShopCurrency chainId */
      chainId?: number | Long | null;

      /** ShopCurrency address */
      address?: market.mass.IEthereumAddress | null;
    }

    /** Represents a ShopCurrency. */
    class ShopCurrency implements IShopCurrency {
      /**
       * Constructs a new ShopCurrency.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.IShopCurrency);

      /** ShopCurrency chainId. */
      public chainId: number | Long;

      /** ShopCurrency address. */
      public address?: market.mass.IEthereumAddress | null;

      /**
       * Creates a new ShopCurrency instance using the specified properties.
       * @param [properties] Properties to set
       * @returns ShopCurrency instance
       */
      public static create(
        properties?: market.mass.IShopCurrency,
      ): market.mass.ShopCurrency;

      /**
       * Encodes the specified ShopCurrency message. Does not implicitly {@link market.mass.ShopCurrency.verify|verify} messages.
       * @param message ShopCurrency message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.IShopCurrency,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified ShopCurrency message, length delimited. Does not implicitly {@link market.mass.ShopCurrency.verify|verify} messages.
       * @param message ShopCurrency message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.IShopCurrency,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes a ShopCurrency message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns ShopCurrency
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.ShopCurrency;

      /**
       * Decodes a ShopCurrency message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns ShopCurrency
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.ShopCurrency;

      /**
       * Verifies a ShopCurrency message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates a ShopCurrency message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns ShopCurrency
       */
      public static fromObject(object: {
        [k: string]: any;
      }): market.mass.ShopCurrency;

      /**
       * Creates a plain object from a ShopCurrency message. Also converts values to other types if specified.
       * @param message ShopCurrency
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.ShopCurrency,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this ShopCurrency to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for ShopCurrency
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a Payee. */
    interface IPayee {
      /** Payee name */
      name?: string | null;

      /** Payee address */
      address?: market.mass.IEthereumAddress | null;

      /** Payee chainId */
      chainId?: number | Long | null;

      /** Payee callAsContract */
      callAsContract?: boolean | null;
    }

    /** Represents a Payee. */
    class Payee implements IPayee {
      /**
       * Constructs a new Payee.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.IPayee);

      /** Payee name. */
      public name: string;

      /** Payee address. */
      public address?: market.mass.IEthereumAddress | null;

      /** Payee chainId. */
      public chainId: number | Long;

      /** Payee callAsContract. */
      public callAsContract: boolean;

      /**
       * Creates a new Payee instance using the specified properties.
       * @param [properties] Properties to set
       * @returns Payee instance
       */
      public static create(properties?: market.mass.IPayee): market.mass.Payee;

      /**
       * Encodes the specified Payee message. Does not implicitly {@link market.mass.Payee.verify|verify} messages.
       * @param message Payee message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.IPayee,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified Payee message, length delimited. Does not implicitly {@link market.mass.Payee.verify|verify} messages.
       * @param message Payee message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.IPayee,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes a Payee message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns Payee
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.Payee;

      /**
       * Decodes a Payee message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns Payee
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.Payee;

      /**
       * Verifies a Payee message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates a Payee message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns Payee
       */
      public static fromObject(object: { [k: string]: any }): market.mass.Payee;

      /**
       * Creates a plain object from a Payee message. Also converts values to other types if specified.
       * @param message Payee
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.Payee,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this Payee to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for Payee
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a ShippingRegion. */
    interface IShippingRegion {
      /** ShippingRegion name */
      name?: string | null;

      /** ShippingRegion country */
      country?: string | null;

      /** ShippingRegion postalCode */
      postalCode?: string | null;

      /** ShippingRegion city */
      city?: string | null;

      /** ShippingRegion orderPriceModifiers */
      orderPriceModifiers?: market.mass.IOrderPriceModifier[] | null;
    }

    /** Represents a ShippingRegion. */
    class ShippingRegion implements IShippingRegion {
      /**
       * Constructs a new ShippingRegion.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.IShippingRegion);

      /** ShippingRegion name. */
      public name: string;

      /** ShippingRegion country. */
      public country: string;

      /** ShippingRegion postalCode. */
      public postalCode: string;

      /** ShippingRegion city. */
      public city: string;

      /** ShippingRegion orderPriceModifiers. */
      public orderPriceModifiers: market.mass.IOrderPriceModifier[];

      /**
       * Creates a new ShippingRegion instance using the specified properties.
       * @param [properties] Properties to set
       * @returns ShippingRegion instance
       */
      public static create(
        properties?: market.mass.IShippingRegion,
      ): market.mass.ShippingRegion;

      /**
       * Encodes the specified ShippingRegion message. Does not implicitly {@link market.mass.ShippingRegion.verify|verify} messages.
       * @param message ShippingRegion message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.IShippingRegion,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified ShippingRegion message, length delimited. Does not implicitly {@link market.mass.ShippingRegion.verify|verify} messages.
       * @param message ShippingRegion message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.IShippingRegion,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes a ShippingRegion message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns ShippingRegion
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.ShippingRegion;

      /**
       * Decodes a ShippingRegion message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns ShippingRegion
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.ShippingRegion;

      /**
       * Verifies a ShippingRegion message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates a ShippingRegion message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns ShippingRegion
       */
      public static fromObject(object: {
        [k: string]: any;
      }): market.mass.ShippingRegion;

      /**
       * Creates a plain object from a ShippingRegion message. Also converts values to other types if specified.
       * @param message ShippingRegion
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.ShippingRegion,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this ShippingRegion to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for ShippingRegion
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an OrderPriceModifier. */
    interface IOrderPriceModifier {
      /** OrderPriceModifier title */
      title?: string | null;

      /** OrderPriceModifier percentage */
      percentage?: market.mass.IUint256 | null;

      /** OrderPriceModifier absolute */
      absolute?: market.mass.IPlusMinus | null;
    }

    /** Represents an OrderPriceModifier. */
    class OrderPriceModifier implements IOrderPriceModifier {
      /**
       * Constructs a new OrderPriceModifier.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.IOrderPriceModifier);

      /** OrderPriceModifier title. */
      public title: string;

      /** OrderPriceModifier percentage. */
      public percentage?: market.mass.IUint256 | null;

      /** OrderPriceModifier absolute. */
      public absolute?: market.mass.IPlusMinus | null;

      /** OrderPriceModifier modification. */
      public modification?: "percentage" | "absolute";

      /**
       * Creates a new OrderPriceModifier instance using the specified properties.
       * @param [properties] Properties to set
       * @returns OrderPriceModifier instance
       */
      public static create(
        properties?: market.mass.IOrderPriceModifier,
      ): market.mass.OrderPriceModifier;

      /**
       * Encodes the specified OrderPriceModifier message. Does not implicitly {@link market.mass.OrderPriceModifier.verify|verify} messages.
       * @param message OrderPriceModifier message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.IOrderPriceModifier,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified OrderPriceModifier message, length delimited. Does not implicitly {@link market.mass.OrderPriceModifier.verify|verify} messages.
       * @param message OrderPriceModifier message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.IOrderPriceModifier,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes an OrderPriceModifier message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns OrderPriceModifier
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.OrderPriceModifier;

      /**
       * Decodes an OrderPriceModifier message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns OrderPriceModifier
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.OrderPriceModifier;

      /**
       * Verifies an OrderPriceModifier message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates an OrderPriceModifier message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns OrderPriceModifier
       */
      public static fromObject(object: {
        [k: string]: any;
      }): market.mass.OrderPriceModifier;

      /**
       * Creates a plain object from an OrderPriceModifier message. Also converts values to other types if specified.
       * @param message OrderPriceModifier
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.OrderPriceModifier,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this OrderPriceModifier to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for OrderPriceModifier
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PlusMinus. */
    interface IPlusMinus {
      /** PlusMinus plusSign */
      plusSign?: boolean | null;

      /** PlusMinus diff */
      diff?: market.mass.IUint256 | null;
    }

    /** Represents a PlusMinus. */
    class PlusMinus implements IPlusMinus {
      /**
       * Constructs a new PlusMinus.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.IPlusMinus);

      /** PlusMinus plusSign. */
      public plusSign: boolean;

      /** PlusMinus diff. */
      public diff?: market.mass.IUint256 | null;

      /**
       * Creates a new PlusMinus instance using the specified properties.
       * @param [properties] Properties to set
       * @returns PlusMinus instance
       */
      public static create(
        properties?: market.mass.IPlusMinus,
      ): market.mass.PlusMinus;

      /**
       * Encodes the specified PlusMinus message. Does not implicitly {@link market.mass.PlusMinus.verify|verify} messages.
       * @param message PlusMinus message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.IPlusMinus,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified PlusMinus message, length delimited. Does not implicitly {@link market.mass.PlusMinus.verify|verify} messages.
       * @param message PlusMinus message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.IPlusMinus,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes a PlusMinus message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns PlusMinus
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.PlusMinus;

      /**
       * Decodes a PlusMinus message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns PlusMinus
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.PlusMinus;

      /**
       * Verifies a PlusMinus message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates a PlusMinus message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns PlusMinus
       */
      public static fromObject(object: {
        [k: string]: any;
      }): market.mass.PlusMinus;

      /**
       * Creates a plain object from a PlusMinus message. Also converts values to other types if specified.
       * @param message PlusMinus
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.PlusMinus,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this PlusMinus to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for PlusMinus
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a ListingMetadata. */
    interface IListingMetadata {
      /** ListingMetadata title */
      title?: string | null;

      /** ListingMetadata description */
      description?: string | null;

      /** ListingMetadata images */
      images?: string[] | null;
    }

    /** Represents a ListingMetadata. */
    class ListingMetadata implements IListingMetadata {
      /**
       * Constructs a new ListingMetadata.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.IListingMetadata);

      /** ListingMetadata title. */
      public title: string;

      /** ListingMetadata description. */
      public description: string;

      /** ListingMetadata images. */
      public images: string[];

      /**
       * Creates a new ListingMetadata instance using the specified properties.
       * @param [properties] Properties to set
       * @returns ListingMetadata instance
       */
      public static create(
        properties?: market.mass.IListingMetadata,
      ): market.mass.ListingMetadata;

      /**
       * Encodes the specified ListingMetadata message. Does not implicitly {@link market.mass.ListingMetadata.verify|verify} messages.
       * @param message ListingMetadata message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.IListingMetadata,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified ListingMetadata message, length delimited. Does not implicitly {@link market.mass.ListingMetadata.verify|verify} messages.
       * @param message ListingMetadata message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.IListingMetadata,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes a ListingMetadata message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns ListingMetadata
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.ListingMetadata;

      /**
       * Decodes a ListingMetadata message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns ListingMetadata
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.ListingMetadata;

      /**
       * Verifies a ListingMetadata message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates a ListingMetadata message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns ListingMetadata
       */
      public static fromObject(object: {
        [k: string]: any;
      }): market.mass.ListingMetadata;

      /**
       * Creates a plain object from a ListingMetadata message. Also converts values to other types if specified.
       * @param message ListingMetadata
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.ListingMetadata,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this ListingMetadata to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for ListingMetadata
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a ListingOption. */
    interface IListingOption {
      /** ListingOption id */
      id?: market.mass.IObjectId | null;

      /** ListingOption title */
      title?: string | null;

      /** ListingOption variations */
      variations?: market.mass.IListingVariation[] | null;
    }

    /** Represents a ListingOption. */
    class ListingOption implements IListingOption {
      /**
       * Constructs a new ListingOption.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.IListingOption);

      /** ListingOption id. */
      public id?: market.mass.IObjectId | null;

      /** ListingOption title. */
      public title: string;

      /** ListingOption variations. */
      public variations: market.mass.IListingVariation[];

      /**
       * Creates a new ListingOption instance using the specified properties.
       * @param [properties] Properties to set
       * @returns ListingOption instance
       */
      public static create(
        properties?: market.mass.IListingOption,
      ): market.mass.ListingOption;

      /**
       * Encodes the specified ListingOption message. Does not implicitly {@link market.mass.ListingOption.verify|verify} messages.
       * @param message ListingOption message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.IListingOption,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified ListingOption message, length delimited. Does not implicitly {@link market.mass.ListingOption.verify|verify} messages.
       * @param message ListingOption message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.IListingOption,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes a ListingOption message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns ListingOption
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.ListingOption;

      /**
       * Decodes a ListingOption message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns ListingOption
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.ListingOption;

      /**
       * Verifies a ListingOption message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates a ListingOption message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns ListingOption
       */
      public static fromObject(object: {
        [k: string]: any;
      }): market.mass.ListingOption;

      /**
       * Creates a plain object from a ListingOption message. Also converts values to other types if specified.
       * @param message ListingOption
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.ListingOption,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this ListingOption to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for ListingOption
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a ListingVariation. */
    interface IListingVariation {
      /** ListingVariation id */
      id?: market.mass.IObjectId | null;

      /** ListingVariation variationInfo */
      variationInfo?: market.mass.IListingMetadata | null;

      /** ListingVariation diff */
      diff?: market.mass.IPlusMinus | null;
    }

    /** Represents a ListingVariation. */
    class ListingVariation implements IListingVariation {
      /**
       * Constructs a new ListingVariation.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.IListingVariation);

      /** ListingVariation id. */
      public id?: market.mass.IObjectId | null;

      /** ListingVariation variationInfo. */
      public variationInfo?: market.mass.IListingMetadata | null;

      /** ListingVariation diff. */
      public diff?: market.mass.IPlusMinus | null;

      /**
       * Creates a new ListingVariation instance using the specified properties.
       * @param [properties] Properties to set
       * @returns ListingVariation instance
       */
      public static create(
        properties?: market.mass.IListingVariation,
      ): market.mass.ListingVariation;

      /**
       * Encodes the specified ListingVariation message. Does not implicitly {@link market.mass.ListingVariation.verify|verify} messages.
       * @param message ListingVariation message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.IListingVariation,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified ListingVariation message, length delimited. Does not implicitly {@link market.mass.ListingVariation.verify|verify} messages.
       * @param message ListingVariation message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.IListingVariation,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes a ListingVariation message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns ListingVariation
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.ListingVariation;

      /**
       * Decodes a ListingVariation message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns ListingVariation
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.ListingVariation;

      /**
       * Verifies a ListingVariation message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates a ListingVariation message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns ListingVariation
       */
      public static fromObject(object: {
        [k: string]: any;
      }): market.mass.ListingVariation;

      /**
       * Creates a plain object from a ListingVariation message. Also converts values to other types if specified.
       * @param message ListingVariation
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.ListingVariation,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this ListingVariation to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for ListingVariation
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** ListingViewState enum. */
    enum ListingViewState {
      LISTING_VIEW_STATE_UNSPECIFIED = 0,
      LISTING_VIEW_STATE_PUBLISHED = 1,
      LISTING_VIEW_STATE_DELETED = 2,
    }

    /** Properties of a ListingStockStatus. */
    interface IListingStockStatus {
      /** ListingStockStatus variationIds */
      variationIds?: market.mass.IObjectId[] | null;

      /** ListingStockStatus inStock */
      inStock?: boolean | null;

      /** ListingStockStatus expectedInStockBy */
      expectedInStockBy?: google.protobuf.ITimestamp | null;
    }

    /** Represents a ListingStockStatus. */
    class ListingStockStatus implements IListingStockStatus {
      /**
       * Constructs a new ListingStockStatus.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.IListingStockStatus);

      /** ListingStockStatus variationIds. */
      public variationIds: market.mass.IObjectId[];

      /** ListingStockStatus inStock. */
      public inStock?: boolean | null;

      /** ListingStockStatus expectedInStockBy. */
      public expectedInStockBy?: google.protobuf.ITimestamp | null;

      /** ListingStockStatus status. */
      public status?: "inStock" | "expectedInStockBy";

      /**
       * Creates a new ListingStockStatus instance using the specified properties.
       * @param [properties] Properties to set
       * @returns ListingStockStatus instance
       */
      public static create(
        properties?: market.mass.IListingStockStatus,
      ): market.mass.ListingStockStatus;

      /**
       * Encodes the specified ListingStockStatus message. Does not implicitly {@link market.mass.ListingStockStatus.verify|verify} messages.
       * @param message ListingStockStatus message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.IListingStockStatus,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified ListingStockStatus message, length delimited. Does not implicitly {@link market.mass.ListingStockStatus.verify|verify} messages.
       * @param message ListingStockStatus message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.IListingStockStatus,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes a ListingStockStatus message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns ListingStockStatus
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.ListingStockStatus;

      /**
       * Decodes a ListingStockStatus message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns ListingStockStatus
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.ListingStockStatus;

      /**
       * Verifies a ListingStockStatus message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates a ListingStockStatus message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns ListingStockStatus
       */
      public static fromObject(object: {
        [k: string]: any;
      }): market.mass.ListingStockStatus;

      /**
       * Creates a plain object from a ListingStockStatus message. Also converts values to other types if specified.
       * @param message ListingStockStatus
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.ListingStockStatus,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this ListingStockStatus to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for ListingStockStatus
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an AddressDetails. */
    interface IAddressDetails {
      /** AddressDetails name */
      name?: string | null;

      /** AddressDetails address1 */
      address1?: string | null;

      /** AddressDetails address2 */
      address2?: string | null;

      /** AddressDetails city */
      city?: string | null;

      /** AddressDetails postalCode */
      postalCode?: string | null;

      /** AddressDetails country */
      country?: string | null;

      /** AddressDetails emailAddress */
      emailAddress?: string | null;

      /** AddressDetails phoneNumber */
      phoneNumber?: string | null;
    }

    /** Represents an AddressDetails. */
    class AddressDetails implements IAddressDetails {
      /**
       * Constructs a new AddressDetails.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.IAddressDetails);

      /** AddressDetails name. */
      public name: string;

      /** AddressDetails address1. */
      public address1: string;

      /** AddressDetails address2. */
      public address2: string;

      /** AddressDetails city. */
      public city: string;

      /** AddressDetails postalCode. */
      public postalCode: string;

      /** AddressDetails country. */
      public country: string;

      /** AddressDetails emailAddress. */
      public emailAddress: string;

      /** AddressDetails phoneNumber. */
      public phoneNumber?: string | null;

      /**
       * Creates a new AddressDetails instance using the specified properties.
       * @param [properties] Properties to set
       * @returns AddressDetails instance
       */
      public static create(
        properties?: market.mass.IAddressDetails,
      ): market.mass.AddressDetails;

      /**
       * Encodes the specified AddressDetails message. Does not implicitly {@link market.mass.AddressDetails.verify|verify} messages.
       * @param message AddressDetails message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.IAddressDetails,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified AddressDetails message, length delimited. Does not implicitly {@link market.mass.AddressDetails.verify|verify} messages.
       * @param message AddressDetails message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.IAddressDetails,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes an AddressDetails message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns AddressDetails
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.AddressDetails;

      /**
       * Decodes an AddressDetails message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns AddressDetails
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.AddressDetails;

      /**
       * Verifies an AddressDetails message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates an AddressDetails message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns AddressDetails
       */
      public static fromObject(object: {
        [k: string]: any;
      }): market.mass.AddressDetails;

      /**
       * Creates a plain object from an AddressDetails message. Also converts values to other types if specified.
       * @param message AddressDetails
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.AddressDetails,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this AddressDetails to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for AddressDetails
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PaymentDetails. */
    interface IPaymentDetails {
      /** PaymentDetails paymentId */
      paymentId?: market.mass.IHash | null;

      /** PaymentDetails total */
      total?: market.mass.IUint256 | null;

      /** PaymentDetails listingHashes */
      listingHashes?: market.mass.IIPFSAddress[] | null;

      /** PaymentDetails ttl */
      ttl?: string | null;

      /** PaymentDetails shopSignature */
      shopSignature?: market.mass.ISignature | null;

      /** PaymentDetails shippingRegion */
      shippingRegion?: market.mass.IShippingRegion | null;
    }

    /** Represents a PaymentDetails. */
    class PaymentDetails implements IPaymentDetails {
      /**
       * Constructs a new PaymentDetails.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.IPaymentDetails);

      /** PaymentDetails paymentId. */
      public paymentId?: market.mass.IHash | null;

      /** PaymentDetails total. */
      public total?: market.mass.IUint256 | null;

      /** PaymentDetails listingHashes. */
      public listingHashes: market.mass.IIPFSAddress[];

      /** PaymentDetails ttl. */
      public ttl: string;

      /** PaymentDetails shopSignature. */
      public shopSignature?: market.mass.ISignature | null;

      /** PaymentDetails shippingRegion. */
      public shippingRegion?: market.mass.IShippingRegion | null;

      /**
       * Creates a new PaymentDetails instance using the specified properties.
       * @param [properties] Properties to set
       * @returns PaymentDetails instance
       */
      public static create(
        properties?: market.mass.IPaymentDetails,
      ): market.mass.PaymentDetails;

      /**
       * Encodes the specified PaymentDetails message. Does not implicitly {@link market.mass.PaymentDetails.verify|verify} messages.
       * @param message PaymentDetails message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.IPaymentDetails,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified PaymentDetails message, length delimited. Does not implicitly {@link market.mass.PaymentDetails.verify|verify} messages.
       * @param message PaymentDetails message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.IPaymentDetails,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes a PaymentDetails message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns PaymentDetails
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.PaymentDetails;

      /**
       * Decodes a PaymentDetails message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns PaymentDetails
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.PaymentDetails;

      /**
       * Verifies a PaymentDetails message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates a PaymentDetails message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns PaymentDetails
       */
      public static fromObject(object: {
        [k: string]: any;
      }): market.mass.PaymentDetails;

      /**
       * Creates a plain object from a PaymentDetails message. Also converts values to other types if specified.
       * @param message PaymentDetails
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.PaymentDetails,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this PaymentDetails to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for PaymentDetails
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an OrderTransaction. */
    interface IOrderTransaction {
      /** OrderTransaction txHash */
      txHash?: market.mass.IHash | null;

      /** OrderTransaction blockHash */
      blockHash?: market.mass.IHash | null;
    }

    /** Represents an OrderTransaction. */
    class OrderTransaction implements IOrderTransaction {
      /**
       * Constructs a new OrderTransaction.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.IOrderTransaction);

      /** OrderTransaction txHash. */
      public txHash?: market.mass.IHash | null;

      /** OrderTransaction blockHash. */
      public blockHash?: market.mass.IHash | null;

      /**
       * Creates a new OrderTransaction instance using the specified properties.
       * @param [properties] Properties to set
       * @returns OrderTransaction instance
       */
      public static create(
        properties?: market.mass.IOrderTransaction,
      ): market.mass.OrderTransaction;

      /**
       * Encodes the specified OrderTransaction message. Does not implicitly {@link market.mass.OrderTransaction.verify|verify} messages.
       * @param message OrderTransaction message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.IOrderTransaction,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified OrderTransaction message, length delimited. Does not implicitly {@link market.mass.OrderTransaction.verify|verify} messages.
       * @param message OrderTransaction message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.IOrderTransaction,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes an OrderTransaction message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns OrderTransaction
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.OrderTransaction;

      /**
       * Decodes an OrderTransaction message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns OrderTransaction
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.OrderTransaction;

      /**
       * Verifies an OrderTransaction message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates an OrderTransaction message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns OrderTransaction
       */
      public static fromObject(object: {
        [k: string]: any;
      }): market.mass.OrderTransaction;

      /**
       * Creates a plain object from an OrderTransaction message. Also converts values to other types if specified.
       * @param message OrderTransaction
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.OrderTransaction,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this OrderTransaction to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for OrderTransaction
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an OrderedItem. */
    interface IOrderedItem {
      /** OrderedItem listingId */
      listingId?: market.mass.IObjectId | null;

      /** OrderedItem variationIds */
      variationIds?: market.mass.IObjectId[] | null;

      /** OrderedItem quantity */
      quantity?: number | null;
    }

    /** Represents an OrderedItem. */
    class OrderedItem implements IOrderedItem {
      /**
       * Constructs a new OrderedItem.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.IOrderedItem);

      /** OrderedItem listingId. */
      public listingId?: market.mass.IObjectId | null;

      /** OrderedItem variationIds. */
      public variationIds: market.mass.IObjectId[];

      /** OrderedItem quantity. */
      public quantity: number;

      /**
       * Creates a new OrderedItem instance using the specified properties.
       * @param [properties] Properties to set
       * @returns OrderedItem instance
       */
      public static create(
        properties?: market.mass.IOrderedItem,
      ): market.mass.OrderedItem;

      /**
       * Encodes the specified OrderedItem message. Does not implicitly {@link market.mass.OrderedItem.verify|verify} messages.
       * @param message OrderedItem message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.IOrderedItem,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified OrderedItem message, length delimited. Does not implicitly {@link market.mass.OrderedItem.verify|verify} messages.
       * @param message OrderedItem message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.IOrderedItem,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes an OrderedItem message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns OrderedItem
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.OrderedItem;

      /**
       * Decodes an OrderedItem message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns OrderedItem
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.OrderedItem;

      /**
       * Verifies an OrderedItem message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates an OrderedItem message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns OrderedItem
       */
      public static fromObject(object: {
        [k: string]: any;
      }): market.mass.OrderedItem;

      /**
       * Creates a plain object from an OrderedItem message. Also converts values to other types if specified.
       * @param message OrderedItem
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.OrderedItem,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this OrderedItem to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for OrderedItem
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an Envelope. */
    interface IEnvelope {
      /** Envelope requestId */
      requestId?: market.mass.IRequestId | null;

      /** Envelope response */
      response?: market.mass.Envelope.IGenericResponse | null;

      /** Envelope eventWriteRequest */
      eventWriteRequest?: market.mass.IEventWriteRequest | null;

      /** Envelope subscriptionRequest */
      subscriptionRequest?: market.mass.ISubscriptionRequest | null;

      /** Envelope subscriptionCancelRequest */
      subscriptionCancelRequest?: market.mass.ISubscriptionCancelRequest | null;

      /** Envelope subscriptionPushRequest */
      subscriptionPushRequest?: market.mass.ISubscriptionPushRequest | null;

      /** Envelope syncStatusRequest */
      syncStatusRequest?: market.mass.ISyncStatusRequest | null;

      /** Envelope pingRequest */
      pingRequest?: market.mass.IPingRequest | null;

      /** Envelope getBlobUploadUrlRequest */
      getBlobUploadUrlRequest?: market.mass.IGetBlobUploadURLRequest | null;

      /** Envelope authRequest */
      authRequest?: market.mass.IAuthenticateRequest | null;

      /** Envelope challengeSolutionRequest */
      challengeSolutionRequest?: market.mass.IChallengeSolvedRequest | null;
    }

    /** Represents an Envelope. */
    class Envelope implements IEnvelope {
      /**
       * Constructs a new Envelope.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.IEnvelope);

      /** Envelope requestId. */
      public requestId?: market.mass.IRequestId | null;

      /** Envelope response. */
      public response?: market.mass.Envelope.IGenericResponse | null;

      /** Envelope eventWriteRequest. */
      public eventWriteRequest?: market.mass.IEventWriteRequest | null;

      /** Envelope subscriptionRequest. */
      public subscriptionRequest?: market.mass.ISubscriptionRequest | null;

      /** Envelope subscriptionCancelRequest. */
      public subscriptionCancelRequest?:
        | market.mass.ISubscriptionCancelRequest
        | null;

      /** Envelope subscriptionPushRequest. */
      public subscriptionPushRequest?:
        | market.mass.ISubscriptionPushRequest
        | null;

      /** Envelope syncStatusRequest. */
      public syncStatusRequest?: market.mass.ISyncStatusRequest | null;

      /** Envelope pingRequest. */
      public pingRequest?: market.mass.IPingRequest | null;

      /** Envelope getBlobUploadUrlRequest. */
      public getBlobUploadUrlRequest?:
        | market.mass.IGetBlobUploadURLRequest
        | null;

      /** Envelope authRequest. */
      public authRequest?: market.mass.IAuthenticateRequest | null;

      /** Envelope challengeSolutionRequest. */
      public challengeSolutionRequest?:
        | market.mass.IChallengeSolvedRequest
        | null;

      /** Envelope message. */
      public message?:
        | "response"
        | "eventWriteRequest"
        | "subscriptionRequest"
        | "subscriptionCancelRequest"
        | "subscriptionPushRequest"
        | "syncStatusRequest"
        | "pingRequest"
        | "getBlobUploadUrlRequest"
        | "authRequest"
        | "challengeSolutionRequest";

      /**
       * Creates a new Envelope instance using the specified properties.
       * @param [properties] Properties to set
       * @returns Envelope instance
       */
      public static create(
        properties?: market.mass.IEnvelope,
      ): market.mass.Envelope;

      /**
       * Encodes the specified Envelope message. Does not implicitly {@link market.mass.Envelope.verify|verify} messages.
       * @param message Envelope message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.IEnvelope,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified Envelope message, length delimited. Does not implicitly {@link market.mass.Envelope.verify|verify} messages.
       * @param message Envelope message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.IEnvelope,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes an Envelope message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns Envelope
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.Envelope;

      /**
       * Decodes an Envelope message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns Envelope
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.Envelope;

      /**
       * Verifies an Envelope message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates an Envelope message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns Envelope
       */
      public static fromObject(object: {
        [k: string]: any;
      }): market.mass.Envelope;

      /**
       * Creates a plain object from an Envelope message. Also converts values to other types if specified.
       * @param message Envelope
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.Envelope,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this Envelope to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for Envelope
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace Envelope {
      /** Properties of a GenericResponse. */
      interface IGenericResponse {
        /** GenericResponse error */
        error?: market.mass.IError | null;

        /** GenericResponse payload */
        payload?: Uint8Array | null;
      }

      /** Represents a GenericResponse. */
      class GenericResponse implements IGenericResponse {
        /**
         * Constructs a new GenericResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: market.mass.Envelope.IGenericResponse);

        /** GenericResponse error. */
        public error?: market.mass.IError | null;

        /** GenericResponse payload. */
        public payload?: Uint8Array | null;

        /** GenericResponse response. */
        public response?: "error" | "payload";

        /**
         * Creates a new GenericResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GenericResponse instance
         */
        public static create(
          properties?: market.mass.Envelope.IGenericResponse,
        ): market.mass.Envelope.GenericResponse;

        /**
         * Encodes the specified GenericResponse message. Does not implicitly {@link market.mass.Envelope.GenericResponse.verify|verify} messages.
         * @param message GenericResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(
          message: market.mass.Envelope.IGenericResponse,
          writer?: $protobuf.Writer,
        ): $protobuf.Writer;

        /**
         * Encodes the specified GenericResponse message, length delimited. Does not implicitly {@link market.mass.Envelope.GenericResponse.verify|verify} messages.
         * @param message GenericResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(
          message: market.mass.Envelope.IGenericResponse,
          writer?: $protobuf.Writer,
        ): $protobuf.Writer;

        /**
         * Decodes a GenericResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GenericResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(
          reader: $protobuf.Reader | Uint8Array,
          length?: number,
        ): market.mass.Envelope.GenericResponse;

        /**
         * Decodes a GenericResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GenericResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(
          reader: $protobuf.Reader | Uint8Array,
        ): market.mass.Envelope.GenericResponse;

        /**
         * Verifies a GenericResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): string | null;

        /**
         * Creates a GenericResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GenericResponse
         */
        public static fromObject(object: {
          [k: string]: any;
        }): market.mass.Envelope.GenericResponse;

        /**
         * Creates a plain object from a GenericResponse message. Also converts values to other types if specified.
         * @param message GenericResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(
          message: market.mass.Envelope.GenericResponse,
          options?: $protobuf.IConversionOptions,
        ): { [k: string]: any };

        /**
         * Converts this GenericResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for GenericResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
      }
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
      ERROR_CODES_CLOSE_SUBSCRIPTION = 11,
    }

    /** Properties of a GetBlobUploadURLRequest. */
    interface IGetBlobUploadURLRequest {}

    /** Represents a GetBlobUploadURLRequest. */
    class GetBlobUploadURLRequest implements IGetBlobUploadURLRequest {
      /**
       * Constructs a new GetBlobUploadURLRequest.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.IGetBlobUploadURLRequest);

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

    /** ObjectType enum. */
    enum ObjectType {
      OBJECT_TYPE_UNSPECIFIED = 0,
      OBJECT_TYPE_LISTING = 1,
      OBJECT_TYPE_TAG = 2,
      OBJECT_TYPE_ORDER = 3,
      OBJECT_TYPE_ACCOUNT = 4,
      OBJECT_TYPE_MANIFEST = 5,
      OBJECT_TYPE_INVENTORY = 6,
    }

    /** Properties of a SubscriptionRequest. */
    interface ISubscriptionRequest {
      /** SubscriptionRequest startShopSeqNo */
      startShopSeqNo?: number | Long | null;

      /** SubscriptionRequest shopId */
      shopId?: market.mass.IUint256 | null;

      /** SubscriptionRequest filters */
      filters?: market.mass.SubscriptionRequest.IFilter[] | null;
    }

    /** Represents a SubscriptionRequest. */
    class SubscriptionRequest implements ISubscriptionRequest {
      /**
       * Constructs a new SubscriptionRequest.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.ISubscriptionRequest);

      /** SubscriptionRequest startShopSeqNo. */
      public startShopSeqNo: number | Long;

      /** SubscriptionRequest shopId. */
      public shopId?: market.mass.IUint256 | null;

      /** SubscriptionRequest filters. */
      public filters: market.mass.SubscriptionRequest.IFilter[];

      /**
       * Creates a new SubscriptionRequest instance using the specified properties.
       * @param [properties] Properties to set
       * @returns SubscriptionRequest instance
       */
      public static create(
        properties?: market.mass.ISubscriptionRequest,
      ): market.mass.SubscriptionRequest;

      /**
       * Encodes the specified SubscriptionRequest message. Does not implicitly {@link market.mass.SubscriptionRequest.verify|verify} messages.
       * @param message SubscriptionRequest message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.ISubscriptionRequest,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified SubscriptionRequest message, length delimited. Does not implicitly {@link market.mass.SubscriptionRequest.verify|verify} messages.
       * @param message SubscriptionRequest message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.ISubscriptionRequest,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes a SubscriptionRequest message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns SubscriptionRequest
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.SubscriptionRequest;

      /**
       * Decodes a SubscriptionRequest message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns SubscriptionRequest
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.SubscriptionRequest;

      /**
       * Verifies a SubscriptionRequest message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates a SubscriptionRequest message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns SubscriptionRequest
       */
      public static fromObject(object: {
        [k: string]: any;
      }): market.mass.SubscriptionRequest;

      /**
       * Creates a plain object from a SubscriptionRequest message. Also converts values to other types if specified.
       * @param message SubscriptionRequest
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.SubscriptionRequest,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this SubscriptionRequest to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for SubscriptionRequest
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace SubscriptionRequest {
      /** Properties of a Filter. */
      interface IFilter {
        /** Filter objectType */
        objectType?: market.mass.ObjectType | null;

        /** Filter objectId */
        objectId?: market.mass.IObjectId | null;
      }

      /** Represents a Filter. */
      class Filter implements IFilter {
        /**
         * Constructs a new Filter.
         * @param [properties] Properties to set
         */
        constructor(properties?: market.mass.SubscriptionRequest.IFilter);

        /** Filter objectType. */
        public objectType: market.mass.ObjectType;

        /** Filter objectId. */
        public objectId?: market.mass.IObjectId | null;

        /**
         * Creates a new Filter instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Filter instance
         */
        public static create(
          properties?: market.mass.SubscriptionRequest.IFilter,
        ): market.mass.SubscriptionRequest.Filter;

        /**
         * Encodes the specified Filter message. Does not implicitly {@link market.mass.SubscriptionRequest.Filter.verify|verify} messages.
         * @param message Filter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(
          message: market.mass.SubscriptionRequest.IFilter,
          writer?: $protobuf.Writer,
        ): $protobuf.Writer;

        /**
         * Encodes the specified Filter message, length delimited. Does not implicitly {@link market.mass.SubscriptionRequest.Filter.verify|verify} messages.
         * @param message Filter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(
          message: market.mass.SubscriptionRequest.IFilter,
          writer?: $protobuf.Writer,
        ): $protobuf.Writer;

        /**
         * Decodes a Filter message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Filter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(
          reader: $protobuf.Reader | Uint8Array,
          length?: number,
        ): market.mass.SubscriptionRequest.Filter;

        /**
         * Decodes a Filter message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Filter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(
          reader: $protobuf.Reader | Uint8Array,
        ): market.mass.SubscriptionRequest.Filter;

        /**
         * Verifies a Filter message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): string | null;

        /**
         * Creates a Filter message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Filter
         */
        public static fromObject(object: {
          [k: string]: any;
        }): market.mass.SubscriptionRequest.Filter;

        /**
         * Creates a plain object from a Filter message. Also converts values to other types if specified.
         * @param message Filter
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(
          message: market.mass.SubscriptionRequest.Filter,
          options?: $protobuf.IConversionOptions,
        ): { [k: string]: any };

        /**
         * Converts this Filter to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for Filter
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
      }
    }

    /** Properties of a SubscriptionPushRequest. */
    interface ISubscriptionPushRequest {
      /** SubscriptionPushRequest subscriptionId */
      subscriptionId?: Uint8Array | null;

      /** SubscriptionPushRequest events */
      events?: market.mass.SubscriptionPushRequest.ISequencedEvent[] | null;
    }

    /** Represents a SubscriptionPushRequest. */
    class SubscriptionPushRequest implements ISubscriptionPushRequest {
      /**
       * Constructs a new SubscriptionPushRequest.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.ISubscriptionPushRequest);

      /** SubscriptionPushRequest subscriptionId. */
      public subscriptionId: Uint8Array;

      /** SubscriptionPushRequest events. */
      public events: market.mass.SubscriptionPushRequest.ISequencedEvent[];

      /**
       * Creates a new SubscriptionPushRequest instance using the specified properties.
       * @param [properties] Properties to set
       * @returns SubscriptionPushRequest instance
       */
      public static create(
        properties?: market.mass.ISubscriptionPushRequest,
      ): market.mass.SubscriptionPushRequest;

      /**
       * Encodes the specified SubscriptionPushRequest message. Does not implicitly {@link market.mass.SubscriptionPushRequest.verify|verify} messages.
       * @param message SubscriptionPushRequest message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.ISubscriptionPushRequest,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified SubscriptionPushRequest message, length delimited. Does not implicitly {@link market.mass.SubscriptionPushRequest.verify|verify} messages.
       * @param message SubscriptionPushRequest message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.ISubscriptionPushRequest,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes a SubscriptionPushRequest message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns SubscriptionPushRequest
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.SubscriptionPushRequest;

      /**
       * Decodes a SubscriptionPushRequest message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns SubscriptionPushRequest
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.SubscriptionPushRequest;

      /**
       * Verifies a SubscriptionPushRequest message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates a SubscriptionPushRequest message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns SubscriptionPushRequest
       */
      public static fromObject(object: {
        [k: string]: any;
      }): market.mass.SubscriptionPushRequest;

      /**
       * Creates a plain object from a SubscriptionPushRequest message. Also converts values to other types if specified.
       * @param message SubscriptionPushRequest
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.SubscriptionPushRequest,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this SubscriptionPushRequest to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for SubscriptionPushRequest
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace SubscriptionPushRequest {
      /** Properties of a SequencedEvent. */
      interface ISequencedEvent {
        /** SequencedEvent event */
        event?: market.mass.ISignedEvent | null;

        /** SequencedEvent seqNo */
        seqNo?: number | Long | null;
      }

      /** Represents a SequencedEvent. */
      class SequencedEvent implements ISequencedEvent {
        /**
         * Constructs a new SequencedEvent.
         * @param [properties] Properties to set
         */
        constructor(
          properties?: market.mass.SubscriptionPushRequest.ISequencedEvent,
        );

        /** SequencedEvent event. */
        public event?: market.mass.ISignedEvent | null;

        /** SequencedEvent seqNo. */
        public seqNo: number | Long;

        /**
         * Creates a new SequencedEvent instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SequencedEvent instance
         */
        public static create(
          properties?: market.mass.SubscriptionPushRequest.ISequencedEvent,
        ): market.mass.SubscriptionPushRequest.SequencedEvent;

        /**
         * Encodes the specified SequencedEvent message. Does not implicitly {@link market.mass.SubscriptionPushRequest.SequencedEvent.verify|verify} messages.
         * @param message SequencedEvent message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(
          message: market.mass.SubscriptionPushRequest.ISequencedEvent,
          writer?: $protobuf.Writer,
        ): $protobuf.Writer;

        /**
         * Encodes the specified SequencedEvent message, length delimited. Does not implicitly {@link market.mass.SubscriptionPushRequest.SequencedEvent.verify|verify} messages.
         * @param message SequencedEvent message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(
          message: market.mass.SubscriptionPushRequest.ISequencedEvent,
          writer?: $protobuf.Writer,
        ): $protobuf.Writer;

        /**
         * Decodes a SequencedEvent message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SequencedEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(
          reader: $protobuf.Reader | Uint8Array,
          length?: number,
        ): market.mass.SubscriptionPushRequest.SequencedEvent;

        /**
         * Decodes a SequencedEvent message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SequencedEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(
          reader: $protobuf.Reader | Uint8Array,
        ): market.mass.SubscriptionPushRequest.SequencedEvent;

        /**
         * Verifies a SequencedEvent message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): string | null;

        /**
         * Creates a SequencedEvent message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SequencedEvent
         */
        public static fromObject(object: {
          [k: string]: any;
        }): market.mass.SubscriptionPushRequest.SequencedEvent;

        /**
         * Creates a plain object from a SequencedEvent message. Also converts values to other types if specified.
         * @param message SequencedEvent
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(
          message: market.mass.SubscriptionPushRequest.SequencedEvent,
          options?: $protobuf.IConversionOptions,
        ): { [k: string]: any };

        /**
         * Converts this SequencedEvent to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for SequencedEvent
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
      }
    }

    /** Properties of a SubscriptionCancelRequest. */
    interface ISubscriptionCancelRequest {
      /** SubscriptionCancelRequest subscriptionId */
      subscriptionId?: Uint8Array | null;
    }

    /** Represents a SubscriptionCancelRequest. */
    class SubscriptionCancelRequest implements ISubscriptionCancelRequest {
      /**
       * Constructs a new SubscriptionCancelRequest.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.ISubscriptionCancelRequest);

      /** SubscriptionCancelRequest subscriptionId. */
      public subscriptionId: Uint8Array;

      /**
       * Creates a new SubscriptionCancelRequest instance using the specified properties.
       * @param [properties] Properties to set
       * @returns SubscriptionCancelRequest instance
       */
      public static create(
        properties?: market.mass.ISubscriptionCancelRequest,
      ): market.mass.SubscriptionCancelRequest;

      /**
       * Encodes the specified SubscriptionCancelRequest message. Does not implicitly {@link market.mass.SubscriptionCancelRequest.verify|verify} messages.
       * @param message SubscriptionCancelRequest message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.ISubscriptionCancelRequest,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified SubscriptionCancelRequest message, length delimited. Does not implicitly {@link market.mass.SubscriptionCancelRequest.verify|verify} messages.
       * @param message SubscriptionCancelRequest message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.ISubscriptionCancelRequest,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes a SubscriptionCancelRequest message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns SubscriptionCancelRequest
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.SubscriptionCancelRequest;

      /**
       * Decodes a SubscriptionCancelRequest message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns SubscriptionCancelRequest
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.SubscriptionCancelRequest;

      /**
       * Verifies a SubscriptionCancelRequest message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates a SubscriptionCancelRequest message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns SubscriptionCancelRequest
       */
      public static fromObject(object: {
        [k: string]: any;
      }): market.mass.SubscriptionCancelRequest;

      /**
       * Creates a plain object from a SubscriptionCancelRequest message. Also converts values to other types if specified.
       * @param message SubscriptionCancelRequest
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.SubscriptionCancelRequest,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this SubscriptionCancelRequest to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for SubscriptionCancelRequest
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a SignedEvent. */
    interface ISignedEvent {
      /** SignedEvent event */
      event?: google.protobuf.IAny | null;

      /** SignedEvent signature */
      signature?: market.mass.ISignature | null;
    }

    /** Represents a SignedEvent. */
    class SignedEvent implements ISignedEvent {
      /**
       * Constructs a new SignedEvent.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.ISignedEvent);

      /** SignedEvent event. */
      public event?: google.protobuf.IAny | null;

      /** SignedEvent signature. */
      public signature?: market.mass.ISignature | null;

      /**
       * Creates a new SignedEvent instance using the specified properties.
       * @param [properties] Properties to set
       * @returns SignedEvent instance
       */
      public static create(
        properties?: market.mass.ISignedEvent,
      ): market.mass.SignedEvent;

      /**
       * Encodes the specified SignedEvent message. Does not implicitly {@link market.mass.SignedEvent.verify|verify} messages.
       * @param message SignedEvent message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.ISignedEvent,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified SignedEvent message, length delimited. Does not implicitly {@link market.mass.SignedEvent.verify|verify} messages.
       * @param message SignedEvent message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.ISignedEvent,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes a SignedEvent message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns SignedEvent
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.SignedEvent;

      /**
       * Decodes a SignedEvent message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns SignedEvent
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.SignedEvent;

      /**
       * Verifies a SignedEvent message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates a SignedEvent message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns SignedEvent
       */
      public static fromObject(object: {
        [k: string]: any;
      }): market.mass.SignedEvent;

      /**
       * Creates a plain object from a SignedEvent message. Also converts values to other types if specified.
       * @param message SignedEvent
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.SignedEvent,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this SignedEvent to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for SignedEvent
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an EventWriteRequest. */
    interface IEventWriteRequest {
      /** EventWriteRequest events */
      events?: market.mass.ISignedEvent[] | null;
    }

    /** Represents an EventWriteRequest. */
    class EventWriteRequest implements IEventWriteRequest {
      /**
       * Constructs a new EventWriteRequest.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.IEventWriteRequest);

      /** EventWriteRequest events. */
      public events: market.mass.ISignedEvent[];

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

    /** Properties of a SyncStatusRequest. */
    interface ISyncStatusRequest {
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

    /** Properties of a PingRequest. */
    interface IPingRequest {}

    /** Represents a PingRequest. */
    class PingRequest implements IPingRequest {
      /**
       * Constructs a new PingRequest.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.IPingRequest);

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

    /** Properties of a Manifest. */
    interface IManifest {
      /** Manifest tokenId */
      tokenId?: market.mass.IUint256 | null;

      /** Manifest payees */
      payees?: market.mass.IPayee[] | null;

      /** Manifest acceptedCurrencies */
      acceptedCurrencies?: market.mass.IShopCurrency[] | null;

      /** Manifest pricingCurrency */
      pricingCurrency?: market.mass.IShopCurrency | null;

      /** Manifest shippingRegions */
      shippingRegions?: market.mass.IShippingRegion[] | null;
    }

    /** Represents a Manifest. */
    class Manifest implements IManifest {
      /**
       * Constructs a new Manifest.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.IManifest);

      /** Manifest tokenId. */
      public tokenId?: market.mass.IUint256 | null;

      /** Manifest payees. */
      public payees: market.mass.IPayee[];

      /** Manifest acceptedCurrencies. */
      public acceptedCurrencies: market.mass.IShopCurrency[];

      /** Manifest pricingCurrency. */
      public pricingCurrency?: market.mass.IShopCurrency | null;

      /** Manifest shippingRegions. */
      public shippingRegions: market.mass.IShippingRegion[];

      /**
       * Creates a new Manifest instance using the specified properties.
       * @param [properties] Properties to set
       * @returns Manifest instance
       */
      public static create(
        properties?: market.mass.IManifest,
      ): market.mass.Manifest;

      /**
       * Encodes the specified Manifest message. Does not implicitly {@link market.mass.Manifest.verify|verify} messages.
       * @param message Manifest message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.IManifest,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified Manifest message, length delimited. Does not implicitly {@link market.mass.Manifest.verify|verify} messages.
       * @param message Manifest message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.IManifest,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes a Manifest message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns Manifest
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.Manifest;

      /**
       * Decodes a Manifest message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns Manifest
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.Manifest;

      /**
       * Verifies a Manifest message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates a Manifest message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns Manifest
       */
      public static fromObject(object: {
        [k: string]: any;
      }): market.mass.Manifest;

      /**
       * Creates a plain object from a Manifest message. Also converts values to other types if specified.
       * @param message Manifest
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.Manifest,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this Manifest to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for Manifest
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an UpdateManifest. */
    interface IUpdateManifest {
      /** UpdateManifest addPayee */
      addPayee?: market.mass.IPayee | null;

      /** UpdateManifest removePayee */
      removePayee?: market.mass.IPayee | null;

      /** UpdateManifest addAcceptedCurrencies */
      addAcceptedCurrencies?: market.mass.IShopCurrency[] | null;

      /** UpdateManifest removeAcceptedCurrencies */
      removeAcceptedCurrencies?: market.mass.IShopCurrency[] | null;

      /** UpdateManifest setPricingCurrency */
      setPricingCurrency?: market.mass.IShopCurrency | null;

      /** UpdateManifest addShippingRegions */
      addShippingRegions?: market.mass.IShippingRegion[] | null;

      /** UpdateManifest removeShippingRegions */
      removeShippingRegions?: string[] | null;
    }

    /** Represents an UpdateManifest. */
    class UpdateManifest implements IUpdateManifest {
      /**
       * Constructs a new UpdateManifest.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.IUpdateManifest);

      /** UpdateManifest addPayee. */
      public addPayee?: market.mass.IPayee | null;

      /** UpdateManifest removePayee. */
      public removePayee?: market.mass.IPayee | null;

      /** UpdateManifest addAcceptedCurrencies. */
      public addAcceptedCurrencies: market.mass.IShopCurrency[];

      /** UpdateManifest removeAcceptedCurrencies. */
      public removeAcceptedCurrencies: market.mass.IShopCurrency[];

      /** UpdateManifest setPricingCurrency. */
      public setPricingCurrency?: market.mass.IShopCurrency | null;

      /** UpdateManifest addShippingRegions. */
      public addShippingRegions: market.mass.IShippingRegion[];

      /** UpdateManifest removeShippingRegions. */
      public removeShippingRegions: string[];

      /**
       * Creates a new UpdateManifest instance using the specified properties.
       * @param [properties] Properties to set
       * @returns UpdateManifest instance
       */
      public static create(
        properties?: market.mass.IUpdateManifest,
      ): market.mass.UpdateManifest;

      /**
       * Encodes the specified UpdateManifest message. Does not implicitly {@link market.mass.UpdateManifest.verify|verify} messages.
       * @param message UpdateManifest message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.IUpdateManifest,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified UpdateManifest message, length delimited. Does not implicitly {@link market.mass.UpdateManifest.verify|verify} messages.
       * @param message UpdateManifest message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.IUpdateManifest,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes an UpdateManifest message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns UpdateManifest
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.UpdateManifest;

      /**
       * Decodes an UpdateManifest message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns UpdateManifest
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.UpdateManifest;

      /**
       * Verifies an UpdateManifest message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates an UpdateManifest message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns UpdateManifest
       */
      public static fromObject(object: {
        [k: string]: any;
      }): market.mass.UpdateManifest;

      /**
       * Creates a plain object from an UpdateManifest message. Also converts values to other types if specified.
       * @param message UpdateManifest
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.UpdateManifest,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this UpdateManifest to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for UpdateManifest
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an Account. */
    interface IAccount {
      /** Account add */
      add?: market.mass.Account.IOnchainAction | null;

      /** Account remove */
      remove?: market.mass.Account.IOnchainAction | null;

      /** Account enrollKeycard */
      enrollKeycard?: market.mass.Account.IKeyCardEnroll | null;

      /** Account revokeKeycard */
      revokeKeycard?: market.mass.IPublicKey | null;
    }

    /** Represents an Account. */
    class Account implements IAccount {
      /**
       * Constructs a new Account.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.IAccount);

      /** Account add. */
      public add?: market.mass.Account.IOnchainAction | null;

      /** Account remove. */
      public remove?: market.mass.Account.IOnchainAction | null;

      /** Account enrollKeycard. */
      public enrollKeycard?: market.mass.Account.IKeyCardEnroll | null;

      /** Account revokeKeycard. */
      public revokeKeycard?: market.mass.IPublicKey | null;

      /** Account action. */
      public action?: "add" | "remove" | "enrollKeycard" | "revokeKeycard";

      /**
       * Creates a new Account instance using the specified properties.
       * @param [properties] Properties to set
       * @returns Account instance
       */
      public static create(
        properties?: market.mass.IAccount,
      ): market.mass.Account;

      /**
       * Encodes the specified Account message. Does not implicitly {@link market.mass.Account.verify|verify} messages.
       * @param message Account message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.IAccount,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified Account message, length delimited. Does not implicitly {@link market.mass.Account.verify|verify} messages.
       * @param message Account message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.IAccount,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes an Account message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns Account
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.Account;

      /**
       * Decodes an Account message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns Account
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.Account;

      /**
       * Verifies an Account message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates an Account message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns Account
       */
      public static fromObject(object: {
        [k: string]: any;
      }): market.mass.Account;

      /**
       * Creates a plain object from an Account message. Also converts values to other types if specified.
       * @param message Account
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.Account,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this Account to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for Account
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace Account {
      /** Properties of an OnchainAction. */
      interface IOnchainAction {
        /** OnchainAction accountAddress */
        accountAddress?: market.mass.IEthereumAddress | null;

        /** OnchainAction tx */
        tx?: market.mass.IHash | null;
      }

      /** Represents an OnchainAction. */
      class OnchainAction implements IOnchainAction {
        /**
         * Constructs a new OnchainAction.
         * @param [properties] Properties to set
         */
        constructor(properties?: market.mass.Account.IOnchainAction);

        /** OnchainAction accountAddress. */
        public accountAddress?: market.mass.IEthereumAddress | null;

        /** OnchainAction tx. */
        public tx?: market.mass.IHash | null;

        /**
         * Creates a new OnchainAction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns OnchainAction instance
         */
        public static create(
          properties?: market.mass.Account.IOnchainAction,
        ): market.mass.Account.OnchainAction;

        /**
         * Encodes the specified OnchainAction message. Does not implicitly {@link market.mass.Account.OnchainAction.verify|verify} messages.
         * @param message OnchainAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(
          message: market.mass.Account.IOnchainAction,
          writer?: $protobuf.Writer,
        ): $protobuf.Writer;

        /**
         * Encodes the specified OnchainAction message, length delimited. Does not implicitly {@link market.mass.Account.OnchainAction.verify|verify} messages.
         * @param message OnchainAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(
          message: market.mass.Account.IOnchainAction,
          writer?: $protobuf.Writer,
        ): $protobuf.Writer;

        /**
         * Decodes an OnchainAction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns OnchainAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(
          reader: $protobuf.Reader | Uint8Array,
          length?: number,
        ): market.mass.Account.OnchainAction;

        /**
         * Decodes an OnchainAction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns OnchainAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(
          reader: $protobuf.Reader | Uint8Array,
        ): market.mass.Account.OnchainAction;

        /**
         * Verifies an OnchainAction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): string | null;

        /**
         * Creates an OnchainAction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns OnchainAction
         */
        public static fromObject(object: {
          [k: string]: any;
        }): market.mass.Account.OnchainAction;

        /**
         * Creates a plain object from an OnchainAction message. Also converts values to other types if specified.
         * @param message OnchainAction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(
          message: market.mass.Account.OnchainAction,
          options?: $protobuf.IConversionOptions,
        ): { [k: string]: any };

        /**
         * Converts this OnchainAction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for OnchainAction
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
      }

      /** Properties of a KeyCardEnroll. */
      interface IKeyCardEnroll {
        /** KeyCardEnroll keycardPubkey */
        keycardPubkey?: market.mass.IPublicKey | null;

        /** KeyCardEnroll userWallet */
        userWallet?: market.mass.IEthereumAddress | null;
      }

      /** Represents a KeyCardEnroll. */
      class KeyCardEnroll implements IKeyCardEnroll {
        /**
         * Constructs a new KeyCardEnroll.
         * @param [properties] Properties to set
         */
        constructor(properties?: market.mass.Account.IKeyCardEnroll);

        /** KeyCardEnroll keycardPubkey. */
        public keycardPubkey?: market.mass.IPublicKey | null;

        /** KeyCardEnroll userWallet. */
        public userWallet?: market.mass.IEthereumAddress | null;

        /**
         * Creates a new KeyCardEnroll instance using the specified properties.
         * @param [properties] Properties to set
         * @returns KeyCardEnroll instance
         */
        public static create(
          properties?: market.mass.Account.IKeyCardEnroll,
        ): market.mass.Account.KeyCardEnroll;

        /**
         * Encodes the specified KeyCardEnroll message. Does not implicitly {@link market.mass.Account.KeyCardEnroll.verify|verify} messages.
         * @param message KeyCardEnroll message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(
          message: market.mass.Account.IKeyCardEnroll,
          writer?: $protobuf.Writer,
        ): $protobuf.Writer;

        /**
         * Encodes the specified KeyCardEnroll message, length delimited. Does not implicitly {@link market.mass.Account.KeyCardEnroll.verify|verify} messages.
         * @param message KeyCardEnroll message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(
          message: market.mass.Account.IKeyCardEnroll,
          writer?: $protobuf.Writer,
        ): $protobuf.Writer;

        /**
         * Decodes a KeyCardEnroll message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns KeyCardEnroll
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(
          reader: $protobuf.Reader | Uint8Array,
          length?: number,
        ): market.mass.Account.KeyCardEnroll;

        /**
         * Decodes a KeyCardEnroll message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns KeyCardEnroll
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(
          reader: $protobuf.Reader | Uint8Array,
        ): market.mass.Account.KeyCardEnroll;

        /**
         * Verifies a KeyCardEnroll message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): string | null;

        /**
         * Creates a KeyCardEnroll message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns KeyCardEnroll
         */
        public static fromObject(object: {
          [k: string]: any;
        }): market.mass.Account.KeyCardEnroll;

        /**
         * Creates a plain object from a KeyCardEnroll message. Also converts values to other types if specified.
         * @param message KeyCardEnroll
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(
          message: market.mass.Account.KeyCardEnroll,
          options?: $protobuf.IConversionOptions,
        ): { [k: string]: any };

        /**
         * Converts this KeyCardEnroll to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for KeyCardEnroll
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
      }
    }

    /** Properties of a Listing. */
    interface IListing {
      /** Listing id */
      id?: market.mass.IObjectId | null;

      /** Listing price */
      price?: market.mass.IUint256 | null;

      /** Listing metadata */
      metadata?: market.mass.IListingMetadata | null;

      /** Listing viewState */
      viewState?: market.mass.ListingViewState | null;

      /** Listing options */
      options?: market.mass.IListingOption[] | null;

      /** Listing stockStatuses */
      stockStatuses?: market.mass.IListingStockStatus[] | null;
    }

    /** Represents a Listing. */
    class Listing implements IListing {
      /**
       * Constructs a new Listing.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.IListing);

      /** Listing id. */
      public id?: market.mass.IObjectId | null;

      /** Listing price. */
      public price?: market.mass.IUint256 | null;

      /** Listing metadata. */
      public metadata?: market.mass.IListingMetadata | null;

      /** Listing viewState. */
      public viewState: market.mass.ListingViewState;

      /** Listing options. */
      public options: market.mass.IListingOption[];

      /** Listing stockStatuses. */
      public stockStatuses: market.mass.IListingStockStatus[];

      /**
       * Creates a new Listing instance using the specified properties.
       * @param [properties] Properties to set
       * @returns Listing instance
       */
      public static create(
        properties?: market.mass.IListing,
      ): market.mass.Listing;

      /**
       * Encodes the specified Listing message. Does not implicitly {@link market.mass.Listing.verify|verify} messages.
       * @param message Listing message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.IListing,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified Listing message, length delimited. Does not implicitly {@link market.mass.Listing.verify|verify} messages.
       * @param message Listing message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.IListing,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes a Listing message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns Listing
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.Listing;

      /**
       * Decodes a Listing message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns Listing
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.Listing;

      /**
       * Verifies a Listing message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates a Listing message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns Listing
       */
      public static fromObject(object: {
        [k: string]: any;
      }): market.mass.Listing;

      /**
       * Creates a plain object from a Listing message. Also converts values to other types if specified.
       * @param message Listing
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.Listing,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this Listing to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for Listing
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an UpdateListing. */
    interface IUpdateListing {
      /** UpdateListing id */
      id?: market.mass.IObjectId | null;

      /** UpdateListing price */
      price?: market.mass.IUint256 | null;

      /** UpdateListing metadata */
      metadata?: market.mass.IListingMetadata | null;

      /** UpdateListing viewState */
      viewState?: market.mass.ListingViewState | null;

      /** UpdateListing addOptions */
      addOptions?: market.mass.IListingOption[] | null;

      /** UpdateListing removeOptionIds */
      removeOptionIds?: market.mass.IObjectId[] | null;

      /** UpdateListing addVariations */
      addVariations?: market.mass.UpdateListing.IAddVariation[] | null;

      /** UpdateListing removeVariationIds */
      removeVariationIds?: market.mass.IObjectId[] | null;

      /** UpdateListing stockUpdates */
      stockUpdates?: market.mass.IListingStockStatus[] | null;
    }

    /** Represents an UpdateListing. */
    class UpdateListing implements IUpdateListing {
      /**
       * Constructs a new UpdateListing.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.IUpdateListing);

      /** UpdateListing id. */
      public id?: market.mass.IObjectId | null;

      /** UpdateListing price. */
      public price?: market.mass.IUint256 | null;

      /** UpdateListing metadata. */
      public metadata?: market.mass.IListingMetadata | null;

      /** UpdateListing viewState. */
      public viewState?: market.mass.ListingViewState | null;

      /** UpdateListing addOptions. */
      public addOptions: market.mass.IListingOption[];

      /** UpdateListing removeOptionIds. */
      public removeOptionIds: market.mass.IObjectId[];

      /** UpdateListing addVariations. */
      public addVariations: market.mass.UpdateListing.IAddVariation[];

      /** UpdateListing removeVariationIds. */
      public removeVariationIds: market.mass.IObjectId[];

      /** UpdateListing stockUpdates. */
      public stockUpdates: market.mass.IListingStockStatus[];

      /**
       * Creates a new UpdateListing instance using the specified properties.
       * @param [properties] Properties to set
       * @returns UpdateListing instance
       */
      public static create(
        properties?: market.mass.IUpdateListing,
      ): market.mass.UpdateListing;

      /**
       * Encodes the specified UpdateListing message. Does not implicitly {@link market.mass.UpdateListing.verify|verify} messages.
       * @param message UpdateListing message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.IUpdateListing,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified UpdateListing message, length delimited. Does not implicitly {@link market.mass.UpdateListing.verify|verify} messages.
       * @param message UpdateListing message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.IUpdateListing,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes an UpdateListing message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns UpdateListing
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.UpdateListing;

      /**
       * Decodes an UpdateListing message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns UpdateListing
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.UpdateListing;

      /**
       * Verifies an UpdateListing message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates an UpdateListing message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns UpdateListing
       */
      public static fromObject(object: {
        [k: string]: any;
      }): market.mass.UpdateListing;

      /**
       * Creates a plain object from an UpdateListing message. Also converts values to other types if specified.
       * @param message UpdateListing
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.UpdateListing,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this UpdateListing to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for UpdateListing
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace UpdateListing {
      /** Properties of an AddVariation. */
      interface IAddVariation {
        /** AddVariation optionId */
        optionId?: market.mass.IObjectId | null;

        /** AddVariation variation */
        variation?: market.mass.IListingVariation | null;
      }

      /** Represents an AddVariation. */
      class AddVariation implements IAddVariation {
        /**
         * Constructs a new AddVariation.
         * @param [properties] Properties to set
         */
        constructor(properties?: market.mass.UpdateListing.IAddVariation);

        /** AddVariation optionId. */
        public optionId?: market.mass.IObjectId | null;

        /** AddVariation variation. */
        public variation?: market.mass.IListingVariation | null;

        /**
         * Creates a new AddVariation instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AddVariation instance
         */
        public static create(
          properties?: market.mass.UpdateListing.IAddVariation,
        ): market.mass.UpdateListing.AddVariation;

        /**
         * Encodes the specified AddVariation message. Does not implicitly {@link market.mass.UpdateListing.AddVariation.verify|verify} messages.
         * @param message AddVariation message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(
          message: market.mass.UpdateListing.IAddVariation,
          writer?: $protobuf.Writer,
        ): $protobuf.Writer;

        /**
         * Encodes the specified AddVariation message, length delimited. Does not implicitly {@link market.mass.UpdateListing.AddVariation.verify|verify} messages.
         * @param message AddVariation message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(
          message: market.mass.UpdateListing.IAddVariation,
          writer?: $protobuf.Writer,
        ): $protobuf.Writer;

        /**
         * Decodes an AddVariation message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AddVariation
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(
          reader: $protobuf.Reader | Uint8Array,
          length?: number,
        ): market.mass.UpdateListing.AddVariation;

        /**
         * Decodes an AddVariation message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AddVariation
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(
          reader: $protobuf.Reader | Uint8Array,
        ): market.mass.UpdateListing.AddVariation;

        /**
         * Verifies an AddVariation message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): string | null;

        /**
         * Creates an AddVariation message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AddVariation
         */
        public static fromObject(object: {
          [k: string]: any;
        }): market.mass.UpdateListing.AddVariation;

        /**
         * Creates a plain object from an AddVariation message. Also converts values to other types if specified.
         * @param message AddVariation
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(
          message: market.mass.UpdateListing.AddVariation,
          options?: $protobuf.IConversionOptions,
        ): { [k: string]: any };

        /**
         * Converts this AddVariation to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for AddVariation
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
      }
    }

    /** Properties of a ChangeInventory. */
    interface IChangeInventory {
      /** ChangeInventory id */
      id?: market.mass.IObjectId | null;

      /** ChangeInventory variationIds */
      variationIds?: market.mass.IObjectId[] | null;

      /** ChangeInventory diff */
      diff?: number | null;
    }

    /** Represents a ChangeInventory. */
    class ChangeInventory implements IChangeInventory {
      /**
       * Constructs a new ChangeInventory.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.IChangeInventory);

      /** ChangeInventory id. */
      public id?: market.mass.IObjectId | null;

      /** ChangeInventory variationIds. */
      public variationIds: market.mass.IObjectId[];

      /** ChangeInventory diff. */
      public diff: number;

      /**
       * Creates a new ChangeInventory instance using the specified properties.
       * @param [properties] Properties to set
       * @returns ChangeInventory instance
       */
      public static create(
        properties?: market.mass.IChangeInventory,
      ): market.mass.ChangeInventory;

      /**
       * Encodes the specified ChangeInventory message. Does not implicitly {@link market.mass.ChangeInventory.verify|verify} messages.
       * @param message ChangeInventory message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.IChangeInventory,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified ChangeInventory message, length delimited. Does not implicitly {@link market.mass.ChangeInventory.verify|verify} messages.
       * @param message ChangeInventory message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.IChangeInventory,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes a ChangeInventory message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns ChangeInventory
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.ChangeInventory;

      /**
       * Decodes a ChangeInventory message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns ChangeInventory
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.ChangeInventory;

      /**
       * Verifies a ChangeInventory message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates a ChangeInventory message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns ChangeInventory
       */
      public static fromObject(object: {
        [k: string]: any;
      }): market.mass.ChangeInventory;

      /**
       * Creates a plain object from a ChangeInventory message. Also converts values to other types if specified.
       * @param message ChangeInventory
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.ChangeInventory,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this ChangeInventory to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for ChangeInventory
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a Tag. */
    interface ITag {
      /** Tag id */
      id?: market.mass.IObjectId | null;

      /** Tag name */
      name?: string | null;

      /** Tag listingIds */
      listingIds?: market.mass.IObjectId[] | null;

      /** Tag deleted */
      deleted?: boolean | null;
    }

    /** Represents a Tag. */
    class Tag implements ITag {
      /**
       * Constructs a new Tag.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.ITag);

      /** Tag id. */
      public id?: market.mass.IObjectId | null;

      /** Tag name. */
      public name: string;

      /** Tag listingIds. */
      public listingIds: market.mass.IObjectId[];

      /** Tag deleted. */
      public deleted: boolean;

      /**
       * Creates a new Tag instance using the specified properties.
       * @param [properties] Properties to set
       * @returns Tag instance
       */
      public static create(properties?: market.mass.ITag): market.mass.Tag;

      /**
       * Encodes the specified Tag message. Does not implicitly {@link market.mass.Tag.verify|verify} messages.
       * @param message Tag message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.ITag,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified Tag message, length delimited. Does not implicitly {@link market.mass.Tag.verify|verify} messages.
       * @param message Tag message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.ITag,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes a Tag message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns Tag
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.Tag;

      /**
       * Decodes a Tag message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns Tag
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.Tag;

      /**
       * Verifies a Tag message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates a Tag message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns Tag
       */
      public static fromObject(object: { [k: string]: any }): market.mass.Tag;

      /**
       * Creates a plain object from a Tag message. Also converts values to other types if specified.
       * @param message Tag
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.Tag,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this Tag to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for Tag
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an UpdateTag. */
    interface IUpdateTag {
      /** UpdateTag id */
      id?: market.mass.IObjectId | null;

      /** UpdateTag rename */
      rename?: string | null;

      /** UpdateTag addListingIds */
      addListingIds?: market.mass.IObjectId[] | null;

      /** UpdateTag removeListingIds */
      removeListingIds?: market.mass.IObjectId[] | null;

      /** UpdateTag delete */
      delete?: boolean | null;
    }

    /** Represents an UpdateTag. */
    class UpdateTag implements IUpdateTag {
      /**
       * Constructs a new UpdateTag.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.IUpdateTag);

      /** UpdateTag id. */
      public id?: market.mass.IObjectId | null;

      /** UpdateTag rename. */
      public rename?: string | null;

      /** UpdateTag addListingIds. */
      public addListingIds: market.mass.IObjectId[];

      /** UpdateTag removeListingIds. */
      public removeListingIds: market.mass.IObjectId[];

      /** UpdateTag delete. */
      public delete?: boolean | null;

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

    /** Properties of a CreateOrder. */
    interface ICreateOrder {
      /** CreateOrder id */
      id?: market.mass.IObjectId | null;
    }

    /** Represents a CreateOrder. */
    class CreateOrder implements ICreateOrder {
      /**
       * Constructs a new CreateOrder.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.ICreateOrder);

      /** CreateOrder id. */
      public id?: market.mass.IObjectId | null;

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
      /** UpdateOrder id */
      id?: market.mass.IObjectId | null;

      /** UpdateOrder cancel */
      cancel?: market.mass.UpdateOrder.ICancel | null;

      /** UpdateOrder changeItems */
      changeItems?: market.mass.UpdateOrder.IChangeItems | null;

      /** UpdateOrder commitItems */
      commitItems?: market.mass.UpdateOrder.ICommitItems | null;

      /** UpdateOrder setInvoiceAddress */
      setInvoiceAddress?: market.mass.IAddressDetails | null;

      /** UpdateOrder setShippingAddress */
      setShippingAddress?: market.mass.IAddressDetails | null;

      /** UpdateOrder choosePayment */
      choosePayment?: market.mass.UpdateOrder.IChoosePaymentMethod | null;

      /** UpdateOrder setPaymentDetails */
      setPaymentDetails?: market.mass.IPaymentDetails | null;

      /** UpdateOrder addPaymentTx */
      addPaymentTx?: market.mass.IOrderTransaction | null;

      /** UpdateOrder setShippingStatus */
      setShippingStatus?: string | null;
    }

    /** Represents an UpdateOrder. */
    class UpdateOrder implements IUpdateOrder {
      /**
       * Constructs a new UpdateOrder.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.IUpdateOrder);

      /** UpdateOrder id. */
      public id?: market.mass.IObjectId | null;

      /** UpdateOrder cancel. */
      public cancel?: market.mass.UpdateOrder.ICancel | null;

      /** UpdateOrder changeItems. */
      public changeItems?: market.mass.UpdateOrder.IChangeItems | null;

      /** UpdateOrder commitItems. */
      public commitItems?: market.mass.UpdateOrder.ICommitItems | null;

      /** UpdateOrder setInvoiceAddress. */
      public setInvoiceAddress?: market.mass.IAddressDetails | null;

      /** UpdateOrder setShippingAddress. */
      public setShippingAddress?: market.mass.IAddressDetails | null;

      /** UpdateOrder choosePayment. */
      public choosePayment?:
        | market.mass.UpdateOrder.IChoosePaymentMethod
        | null;

      /** UpdateOrder setPaymentDetails. */
      public setPaymentDetails?: market.mass.IPaymentDetails | null;

      /** UpdateOrder addPaymentTx. */
      public addPaymentTx?: market.mass.IOrderTransaction | null;

      /** UpdateOrder setShippingStatus. */
      public setShippingStatus?: string | null;

      /** UpdateOrder action. */
      public action?:
        | "cancel"
        | "changeItems"
        | "commitItems"
        | "setInvoiceAddress"
        | "setShippingAddress"
        | "choosePayment"
        | "setPaymentDetails"
        | "addPaymentTx"
        | "setShippingStatus";

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
      /** Properties of a Cancel. */
      interface ICancel {}

      /** Represents a Cancel. */
      class Cancel implements ICancel {
        /**
         * Constructs a new Cancel.
         * @param [properties] Properties to set
         */
        constructor(properties?: market.mass.UpdateOrder.ICancel);

        /**
         * Creates a new Cancel instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Cancel instance
         */
        public static create(
          properties?: market.mass.UpdateOrder.ICancel,
        ): market.mass.UpdateOrder.Cancel;

        /**
         * Encodes the specified Cancel message. Does not implicitly {@link market.mass.UpdateOrder.Cancel.verify|verify} messages.
         * @param message Cancel message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(
          message: market.mass.UpdateOrder.ICancel,
          writer?: $protobuf.Writer,
        ): $protobuf.Writer;

        /**
         * Encodes the specified Cancel message, length delimited. Does not implicitly {@link market.mass.UpdateOrder.Cancel.verify|verify} messages.
         * @param message Cancel message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(
          message: market.mass.UpdateOrder.ICancel,
          writer?: $protobuf.Writer,
        ): $protobuf.Writer;

        /**
         * Decodes a Cancel message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Cancel
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(
          reader: $protobuf.Reader | Uint8Array,
          length?: number,
        ): market.mass.UpdateOrder.Cancel;

        /**
         * Decodes a Cancel message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Cancel
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(
          reader: $protobuf.Reader | Uint8Array,
        ): market.mass.UpdateOrder.Cancel;

        /**
         * Verifies a Cancel message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): string | null;

        /**
         * Creates a Cancel message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Cancel
         */
        public static fromObject(object: {
          [k: string]: any;
        }): market.mass.UpdateOrder.Cancel;

        /**
         * Creates a plain object from a Cancel message. Also converts values to other types if specified.
         * @param message Cancel
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(
          message: market.mass.UpdateOrder.Cancel,
          options?: $protobuf.IConversionOptions,
        ): { [k: string]: any };

        /**
         * Converts this Cancel to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for Cancel
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
      }

      /** Properties of a ChangeItems. */
      interface IChangeItems {
        /** ChangeItems adds */
        adds?: market.mass.IOrderedItem[] | null;

        /** ChangeItems removes */
        removes?: market.mass.IOrderedItem[] | null;
      }

      /** Represents a ChangeItems. */
      class ChangeItems implements IChangeItems {
        /**
         * Constructs a new ChangeItems.
         * @param [properties] Properties to set
         */
        constructor(properties?: market.mass.UpdateOrder.IChangeItems);

        /** ChangeItems adds. */
        public adds: market.mass.IOrderedItem[];

        /** ChangeItems removes. */
        public removes: market.mass.IOrderedItem[];

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

      /** Properties of a CommitItems. */
      interface ICommitItems {}

      /** Represents a CommitItems. */
      class CommitItems implements ICommitItems {
        /**
         * Constructs a new CommitItems.
         * @param [properties] Properties to set
         */
        constructor(properties?: market.mass.UpdateOrder.ICommitItems);

        /**
         * Creates a new CommitItems instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CommitItems instance
         */
        public static create(
          properties?: market.mass.UpdateOrder.ICommitItems,
        ): market.mass.UpdateOrder.CommitItems;

        /**
         * Encodes the specified CommitItems message. Does not implicitly {@link market.mass.UpdateOrder.CommitItems.verify|verify} messages.
         * @param message CommitItems message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(
          message: market.mass.UpdateOrder.ICommitItems,
          writer?: $protobuf.Writer,
        ): $protobuf.Writer;

        /**
         * Encodes the specified CommitItems message, length delimited. Does not implicitly {@link market.mass.UpdateOrder.CommitItems.verify|verify} messages.
         * @param message CommitItems message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(
          message: market.mass.UpdateOrder.ICommitItems,
          writer?: $protobuf.Writer,
        ): $protobuf.Writer;

        /**
         * Decodes a CommitItems message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CommitItems
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(
          reader: $protobuf.Reader | Uint8Array,
          length?: number,
        ): market.mass.UpdateOrder.CommitItems;

        /**
         * Decodes a CommitItems message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CommitItems
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(
          reader: $protobuf.Reader | Uint8Array,
        ): market.mass.UpdateOrder.CommitItems;

        /**
         * Verifies a CommitItems message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): string | null;

        /**
         * Creates a CommitItems message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CommitItems
         */
        public static fromObject(object: {
          [k: string]: any;
        }): market.mass.UpdateOrder.CommitItems;

        /**
         * Creates a plain object from a CommitItems message. Also converts values to other types if specified.
         * @param message CommitItems
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(
          message: market.mass.UpdateOrder.CommitItems,
          options?: $protobuf.IConversionOptions,
        ): { [k: string]: any };

        /**
         * Converts this CommitItems to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for CommitItems
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
      }

      /** Properties of a ChoosePaymentMethod. */
      interface IChoosePaymentMethod {
        /** ChoosePaymentMethod currency */
        currency?: market.mass.IShopCurrency | null;

        /** ChoosePaymentMethod payee */
        payee?: market.mass.IPayee | null;
      }

      /** Represents a ChoosePaymentMethod. */
      class ChoosePaymentMethod implements IChoosePaymentMethod {
        /**
         * Constructs a new ChoosePaymentMethod.
         * @param [properties] Properties to set
         */
        constructor(properties?: market.mass.UpdateOrder.IChoosePaymentMethod);

        /** ChoosePaymentMethod currency. */
        public currency?: market.mass.IShopCurrency | null;

        /** ChoosePaymentMethod payee. */
        public payee?: market.mass.IPayee | null;

        /**
         * Creates a new ChoosePaymentMethod instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ChoosePaymentMethod instance
         */
        public static create(
          properties?: market.mass.UpdateOrder.IChoosePaymentMethod,
        ): market.mass.UpdateOrder.ChoosePaymentMethod;

        /**
         * Encodes the specified ChoosePaymentMethod message. Does not implicitly {@link market.mass.UpdateOrder.ChoosePaymentMethod.verify|verify} messages.
         * @param message ChoosePaymentMethod message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(
          message: market.mass.UpdateOrder.IChoosePaymentMethod,
          writer?: $protobuf.Writer,
        ): $protobuf.Writer;

        /**
         * Encodes the specified ChoosePaymentMethod message, length delimited. Does not implicitly {@link market.mass.UpdateOrder.ChoosePaymentMethod.verify|verify} messages.
         * @param message ChoosePaymentMethod message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(
          message: market.mass.UpdateOrder.IChoosePaymentMethod,
          writer?: $protobuf.Writer,
        ): $protobuf.Writer;

        /**
         * Decodes a ChoosePaymentMethod message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ChoosePaymentMethod
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(
          reader: $protobuf.Reader | Uint8Array,
          length?: number,
        ): market.mass.UpdateOrder.ChoosePaymentMethod;

        /**
         * Decodes a ChoosePaymentMethod message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ChoosePaymentMethod
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(
          reader: $protobuf.Reader | Uint8Array,
        ): market.mass.UpdateOrder.ChoosePaymentMethod;

        /**
         * Verifies a ChoosePaymentMethod message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): string | null;

        /**
         * Creates a ChoosePaymentMethod message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ChoosePaymentMethod
         */
        public static fromObject(object: {
          [k: string]: any;
        }): market.mass.UpdateOrder.ChoosePaymentMethod;

        /**
         * Creates a plain object from a ChoosePaymentMethod message. Also converts values to other types if specified.
         * @param message ChoosePaymentMethod
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(
          message: market.mass.UpdateOrder.ChoosePaymentMethod,
          options?: $protobuf.IConversionOptions,
        ): { [k: string]: any };

        /**
         * Converts this ChoosePaymentMethod to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ChoosePaymentMethod
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
      }
    }

    /** Properties of a ShopEvent. */
    interface IShopEvent {
      /** ShopEvent nonce */
      nonce?: number | Long | null;

      /** ShopEvent shopId */
      shopId?: market.mass.IUint256 | null;

      /** ShopEvent timestamp */
      timestamp?: google.protobuf.ITimestamp | null;

      /** ShopEvent manifest */
      manifest?: market.mass.IManifest | null;

      /** ShopEvent updateManifest */
      updateManifest?: market.mass.IUpdateManifest | null;

      /** ShopEvent account */
      account?: market.mass.IAccount | null;

      /** ShopEvent listing */
      listing?: market.mass.IListing | null;

      /** ShopEvent updateListing */
      updateListing?: market.mass.IUpdateListing | null;

      /** ShopEvent changeInventory */
      changeInventory?: market.mass.IChangeInventory | null;

      /** ShopEvent tag */
      tag?: market.mass.ITag | null;

      /** ShopEvent updateTag */
      updateTag?: market.mass.IUpdateTag | null;

      /** ShopEvent createOrder */
      createOrder?: market.mass.ICreateOrder | null;

      /** ShopEvent updateOrder */
      updateOrder?: market.mass.IUpdateOrder | null;
    }

    /** Represents a ShopEvent. */
    class ShopEvent implements IShopEvent {
      /**
       * Constructs a new ShopEvent.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.IShopEvent);

      /** ShopEvent nonce. */
      public nonce: number | Long;

      /** ShopEvent shopId. */
      public shopId?: market.mass.IUint256 | null;

      /** ShopEvent timestamp. */
      public timestamp?: google.protobuf.ITimestamp | null;

      /** ShopEvent manifest. */
      public manifest?: market.mass.IManifest | null;

      /** ShopEvent updateManifest. */
      public updateManifest?: market.mass.IUpdateManifest | null;

      /** ShopEvent account. */
      public account?: market.mass.IAccount | null;

      /** ShopEvent listing. */
      public listing?: market.mass.IListing | null;

      /** ShopEvent updateListing. */
      public updateListing?: market.mass.IUpdateListing | null;

      /** ShopEvent changeInventory. */
      public changeInventory?: market.mass.IChangeInventory | null;

      /** ShopEvent tag. */
      public tag?: market.mass.ITag | null;

      /** ShopEvent updateTag. */
      public updateTag?: market.mass.IUpdateTag | null;

      /** ShopEvent createOrder. */
      public createOrder?: market.mass.ICreateOrder | null;

      /** ShopEvent updateOrder. */
      public updateOrder?: market.mass.IUpdateOrder | null;

      /** ShopEvent union. */
      public union?:
        | "manifest"
        | "updateManifest"
        | "account"
        | "listing"
        | "updateListing"
        | "changeInventory"
        | "tag"
        | "updateTag"
        | "createOrder"
        | "updateOrder";

      /**
       * Creates a new ShopEvent instance using the specified properties.
       * @param [properties] Properties to set
       * @returns ShopEvent instance
       */
      public static create(
        properties?: market.mass.IShopEvent,
      ): market.mass.ShopEvent;

      /**
       * Encodes the specified ShopEvent message. Does not implicitly {@link market.mass.ShopEvent.verify|verify} messages.
       * @param message ShopEvent message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.IShopEvent,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified ShopEvent message, length delimited. Does not implicitly {@link market.mass.ShopEvent.verify|verify} messages.
       * @param message ShopEvent message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.IShopEvent,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes a ShopEvent message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns ShopEvent
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.ShopEvent;

      /**
       * Decodes a ShopEvent message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns ShopEvent
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.ShopEvent;

      /**
       * Verifies a ShopEvent message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates a ShopEvent message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns ShopEvent
       */
      public static fromObject(object: {
        [k: string]: any;
      }): market.mass.ShopEvent;

      /**
       * Creates a plain object from a ShopEvent message. Also converts values to other types if specified.
       * @param message ShopEvent
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.ShopEvent,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this ShopEvent to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for ShopEvent
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an Order. */
    interface IOrder {
      /** Order id */
      id?: market.mass.IObjectId | null;

      /** Order items */
      items?: market.mass.IOrderedItem[] | null;

      /** Order shippingStatus */
      shippingStatus?: string | null;

      /** Order canceledAt */
      canceledAt?: google.protobuf.ITimestamp | null;

      /** Order commitedAt */
      commitedAt?: google.protobuf.ITimestamp | null;

      /** Order invoiceAddress */
      invoiceAddress?: market.mass.IAddressDetails | null;

      /** Order shippingAddress */
      shippingAddress?: market.mass.IAddressDetails | null;

      /** Order addressUpdatedAt */
      addressUpdatedAt?: google.protobuf.ITimestamp | null;

      /** Order chosenPayee */
      chosenPayee?: market.mass.IPayee | null;

      /** Order chosenCurrency */
      chosenCurrency?: market.mass.IShopCurrency | null;

      /** Order paymentDetails */
      paymentDetails?: market.mass.IPaymentDetails | null;

      /** Order paymentDetailsCreatedAt */
      paymentDetailsCreatedAt?: google.protobuf.ITimestamp | null;

      /** Order paymentTransactions */
      paymentTransactions?: market.mass.IOrderTransaction[] | null;
    }

    /** Represents an Order. */
    class Order implements IOrder {
      /**
       * Constructs a new Order.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.IOrder);

      /** Order id. */
      public id?: market.mass.IObjectId | null;

      /** Order items. */
      public items: market.mass.IOrderedItem[];

      /** Order shippingStatus. */
      public shippingStatus: string;

      /** Order canceledAt. */
      public canceledAt?: google.protobuf.ITimestamp | null;

      /** Order commitedAt. */
      public commitedAt?: google.protobuf.ITimestamp | null;

      /** Order invoiceAddress. */
      public invoiceAddress?: market.mass.IAddressDetails | null;

      /** Order shippingAddress. */
      public shippingAddress?: market.mass.IAddressDetails | null;

      /** Order addressUpdatedAt. */
      public addressUpdatedAt?: google.protobuf.ITimestamp | null;

      /** Order chosenPayee. */
      public chosenPayee?: market.mass.IPayee | null;

      /** Order chosenCurrency. */
      public chosenCurrency?: market.mass.IShopCurrency | null;

      /** Order paymentDetails. */
      public paymentDetails?: market.mass.IPaymentDetails | null;

      /** Order paymentDetailsCreatedAt. */
      public paymentDetailsCreatedAt?: google.protobuf.ITimestamp | null;

      /** Order paymentTransactions. */
      public paymentTransactions: market.mass.IOrderTransaction[];

      /**
       * Creates a new Order instance using the specified properties.
       * @param [properties] Properties to set
       * @returns Order instance
       */
      public static create(properties?: market.mass.IOrder): market.mass.Order;

      /**
       * Encodes the specified Order message. Does not implicitly {@link market.mass.Order.verify|verify} messages.
       * @param message Order message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.IOrder,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified Order message, length delimited. Does not implicitly {@link market.mass.Order.verify|verify} messages.
       * @param message Order message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.IOrder,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes an Order message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns Order
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.Order;

      /**
       * Decodes an Order message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns Order
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.Order;

      /**
       * Verifies an Order message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates an Order message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns Order
       */
      public static fromObject(object: { [k: string]: any }): market.mass.Order;

      /**
       * Creates a plain object from an Order message. Also converts values to other types if specified.
       * @param message Order
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.Order,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this Order to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for Order
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
    /** Properties of a Timestamp. */
    interface ITimestamp {
      /** Timestamp seconds */
      seconds?: number | Long | null;

      /** Timestamp nanos */
      nanos?: number | null;
    }

    /** Represents a Timestamp. */
    class Timestamp implements ITimestamp {
      /**
       * Constructs a new Timestamp.
       * @param [properties] Properties to set
       */
      constructor(properties?: google.protobuf.ITimestamp);

      /** Timestamp seconds. */
      public seconds: number | Long;

      /** Timestamp nanos. */
      public nanos: number;

      /**
       * Creates a new Timestamp instance using the specified properties.
       * @param [properties] Properties to set
       * @returns Timestamp instance
       */
      public static create(
        properties?: google.protobuf.ITimestamp,
      ): google.protobuf.Timestamp;

      /**
       * Encodes the specified Timestamp message. Does not implicitly {@link google.protobuf.Timestamp.verify|verify} messages.
       * @param message Timestamp message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: google.protobuf.ITimestamp,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified Timestamp message, length delimited. Does not implicitly {@link google.protobuf.Timestamp.verify|verify} messages.
       * @param message Timestamp message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: google.protobuf.ITimestamp,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes a Timestamp message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns Timestamp
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): google.protobuf.Timestamp;

      /**
       * Decodes a Timestamp message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns Timestamp
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): google.protobuf.Timestamp;

      /**
       * Verifies a Timestamp message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates a Timestamp message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns Timestamp
       */
      public static fromObject(object: {
        [k: string]: any;
      }): google.protobuf.Timestamp;

      /**
       * Creates a plain object from a Timestamp message. Also converts values to other types if specified.
       * @param message Timestamp
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: google.protobuf.Timestamp,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this Timestamp to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for Timestamp
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

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
