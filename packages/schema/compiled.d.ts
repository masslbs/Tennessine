import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace market. */
export namespace market {

    /** Namespace mass. */
    namespace mass {

        /** Properties of an AuthenticateRequest. */
        interface IAuthenticateRequest {

            /** AuthenticateRequest publicKey */
            publicKey?: (market.mass.IPublicKey|null);
        }

        /** Represents an AuthenticateRequest. */
        class AuthenticateRequest implements IAuthenticateRequest {

            /**
             * Constructs a new AuthenticateRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: market.mass.IAuthenticateRequest);

            /** AuthenticateRequest publicKey. */
            public publicKey?: (market.mass.IPublicKey|null);

            /**
             * Creates a new AuthenticateRequest instance using the specified properties.
             * @param [properties] Properties to set
             * @returns AuthenticateRequest instance
             */
            public static create(properties?: market.mass.IAuthenticateRequest): market.mass.AuthenticateRequest;

            /**
             * Encodes the specified AuthenticateRequest message. Does not implicitly {@link market.mass.AuthenticateRequest.verify|verify} messages.
             * @param message AuthenticateRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: market.mass.IAuthenticateRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified AuthenticateRequest message, length delimited. Does not implicitly {@link market.mass.AuthenticateRequest.verify|verify} messages.
             * @param message AuthenticateRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: market.mass.IAuthenticateRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an AuthenticateRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns AuthenticateRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): market.mass.AuthenticateRequest;

            /**
             * Decodes an AuthenticateRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns AuthenticateRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): market.mass.AuthenticateRequest;

            /**
             * Verifies an AuthenticateRequest message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an AuthenticateRequest message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns AuthenticateRequest
             */
            public static fromObject(object: { [k: string]: any }): market.mass.AuthenticateRequest;

            /**
             * Creates a plain object from an AuthenticateRequest message. Also converts values to other types if specified.
             * @param message AuthenticateRequest
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: market.mass.AuthenticateRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            signature?: (market.mass.ISignature|null);
        }

        /** Represents a ChallengeSolvedRequest. */
        class ChallengeSolvedRequest implements IChallengeSolvedRequest {

            /**
             * Constructs a new ChallengeSolvedRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: market.mass.IChallengeSolvedRequest);

            /** ChallengeSolvedRequest signature. */
            public signature?: (market.mass.ISignature|null);

            /**
             * Creates a new ChallengeSolvedRequest instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ChallengeSolvedRequest instance
             */
            public static create(properties?: market.mass.IChallengeSolvedRequest): market.mass.ChallengeSolvedRequest;

            /**
             * Encodes the specified ChallengeSolvedRequest message. Does not implicitly {@link market.mass.ChallengeSolvedRequest.verify|verify} messages.
             * @param message ChallengeSolvedRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: market.mass.IChallengeSolvedRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ChallengeSolvedRequest message, length delimited. Does not implicitly {@link market.mass.ChallengeSolvedRequest.verify|verify} messages.
             * @param message ChallengeSolvedRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: market.mass.IChallengeSolvedRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ChallengeSolvedRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ChallengeSolvedRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): market.mass.ChallengeSolvedRequest;

            /**
             * Decodes a ChallengeSolvedRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ChallengeSolvedRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): market.mass.ChallengeSolvedRequest;

            /**
             * Verifies a ChallengeSolvedRequest message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a ChallengeSolvedRequest message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ChallengeSolvedRequest
             */
            public static fromObject(object: { [k: string]: any }): market.mass.ChallengeSolvedRequest;

            /**
             * Creates a plain object from a ChallengeSolvedRequest message. Also converts values to other types if specified.
             * @param message ChallengeSolvedRequest
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: market.mass.ChallengeSolvedRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            raw?: (number|Long|null);
        }

        /** Represents a RequestId. */
        class RequestId implements IRequestId {

            /**
             * Constructs a new RequestId.
             * @param [properties] Properties to set
             */
            constructor(properties?: market.mass.IRequestId);

            /** RequestId raw. */
            public raw: (number|Long);

            /**
             * Creates a new RequestId instance using the specified properties.
             * @param [properties] Properties to set
             * @returns RequestId instance
             */
            public static create(properties?: market.mass.IRequestId): market.mass.RequestId;

            /**
             * Encodes the specified RequestId message. Does not implicitly {@link market.mass.RequestId.verify|verify} messages.
             * @param message RequestId message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: market.mass.IRequestId, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified RequestId message, length delimited. Does not implicitly {@link market.mass.RequestId.verify|verify} messages.
             * @param message RequestId message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: market.mass.IRequestId, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a RequestId message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns RequestId
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): market.mass.RequestId;

            /**
             * Decodes a RequestId message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns RequestId
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): market.mass.RequestId;

            /**
             * Verifies a RequestId message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a RequestId message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns RequestId
             */
            public static fromObject(object: { [k: string]: any }): market.mass.RequestId;

            /**
             * Creates a plain object from a RequestId message. Also converts values to other types if specified.
             * @param message RequestId
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: market.mass.RequestId, options?: $protobuf.IConversionOptions): { [k: string]: any };

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

        /** Properties of a Signature. */
        interface ISignature {

            /** Signature raw */
            raw?: (Uint8Array|null);
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
            public static create(properties?: market.mass.ISignature): market.mass.Signature;

            /**
             * Encodes the specified Signature message. Does not implicitly {@link market.mass.Signature.verify|verify} messages.
             * @param message Signature message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: market.mass.ISignature, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Signature message, length delimited. Does not implicitly {@link market.mass.Signature.verify|verify} messages.
             * @param message Signature message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: market.mass.ISignature, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Signature message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Signature
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): market.mass.Signature;

            /**
             * Decodes a Signature message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Signature
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): market.mass.Signature;

            /**
             * Verifies a Signature message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Signature message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Signature
             */
            public static fromObject(object: { [k: string]: any }): market.mass.Signature;

            /**
             * Creates a plain object from a Signature message. Also converts values to other types if specified.
             * @param message Signature
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: market.mass.Signature, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            raw?: (Uint8Array|null);
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
            public static create(properties?: market.mass.IPublicKey): market.mass.PublicKey;

            /**
             * Encodes the specified PublicKey message. Does not implicitly {@link market.mass.PublicKey.verify|verify} messages.
             * @param message PublicKey message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: market.mass.IPublicKey, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified PublicKey message, length delimited. Does not implicitly {@link market.mass.PublicKey.verify|verify} messages.
             * @param message PublicKey message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: market.mass.IPublicKey, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a PublicKey message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns PublicKey
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): market.mass.PublicKey;

            /**
             * Decodes a PublicKey message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns PublicKey
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): market.mass.PublicKey;

            /**
             * Verifies a PublicKey message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a PublicKey message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns PublicKey
             */
            public static fromObject(object: { [k: string]: any }): market.mass.PublicKey;

            /**
             * Creates a plain object from a PublicKey message. Also converts values to other types if specified.
             * @param message PublicKey
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: market.mass.PublicKey, options?: $protobuf.IConversionOptions): { [k: string]: any };

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

        /** Properties of an Uint256. */
        interface IUint256 {

            /** Uint256 raw */
            raw?: (Uint8Array|null);
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
            public static create(properties?: market.mass.IUint256): market.mass.Uint256;

            /**
             * Encodes the specified Uint256 message. Does not implicitly {@link market.mass.Uint256.verify|verify} messages.
             * @param message Uint256 message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: market.mass.IUint256, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Uint256 message, length delimited. Does not implicitly {@link market.mass.Uint256.verify|verify} messages.
             * @param message Uint256 message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: market.mass.IUint256, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an Uint256 message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Uint256
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): market.mass.Uint256;

            /**
             * Decodes an Uint256 message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Uint256
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): market.mass.Uint256;

            /**
             * Verifies an Uint256 message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an Uint256 message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Uint256
             */
            public static fromObject(object: { [k: string]: any }): market.mass.Uint256;

            /**
             * Creates a plain object from an Uint256 message. Also converts values to other types if specified.
             * @param message Uint256
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: market.mass.Uint256, options?: $protobuf.IConversionOptions): { [k: string]: any };

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

        /** Properties of an ObjectId. */
        interface IObjectId {

            /** ObjectId raw */
            raw?: (Uint8Array|null);
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
            public static create(properties?: market.mass.IObjectId): market.mass.ObjectId;

            /**
             * Encodes the specified ObjectId message. Does not implicitly {@link market.mass.ObjectId.verify|verify} messages.
             * @param message ObjectId message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: market.mass.IObjectId, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ObjectId message, length delimited. Does not implicitly {@link market.mass.ObjectId.verify|verify} messages.
             * @param message ObjectId message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: market.mass.IObjectId, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an ObjectId message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ObjectId
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): market.mass.ObjectId;

            /**
             * Decodes an ObjectId message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ObjectId
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): market.mass.ObjectId;

            /**
             * Verifies an ObjectId message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an ObjectId message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ObjectId
             */
            public static fromObject(object: { [k: string]: any }): market.mass.ObjectId;

            /**
             * Creates a plain object from an ObjectId message. Also converts values to other types if specified.
             * @param message ObjectId
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: market.mass.ObjectId, options?: $protobuf.IConversionOptions): { [k: string]: any };

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

        /** Properties of an Envelope. */
        interface IEnvelope {

            /** Envelope requestId */
            requestId?: (market.mass.IRequestId|null);

            /** Envelope response */
            response?: (market.mass.Envelope.IGenericResponse|null);

            /** Envelope patchSetWriteRequest */
            patchSetWriteRequest?: (market.mass.IPatchSetWriteRequest|null);

            /** Envelope subscriptionRequest */
            subscriptionRequest?: (market.mass.ISubscriptionRequest|null);

            /** Envelope subscriptionCancelRequest */
            subscriptionCancelRequest?: (market.mass.ISubscriptionCancelRequest|null);

            /** Envelope subscriptionPushRequest */
            subscriptionPushRequest?: (market.mass.ISubscriptionPushRequest|null);

            /** Envelope syncStatusRequest */
            syncStatusRequest?: (market.mass.ISyncStatusRequest|null);

            /** Envelope pingRequest */
            pingRequest?: (market.mass.IPingRequest|null);

            /** Envelope getBlobUploadUrlRequest */
            getBlobUploadUrlRequest?: (market.mass.IGetBlobUploadURLRequest|null);

            /** Envelope authRequest */
            authRequest?: (market.mass.IAuthenticateRequest|null);

            /** Envelope challengeSolutionRequest */
            challengeSolutionRequest?: (market.mass.IChallengeSolvedRequest|null);
        }

        /** Represents an Envelope. */
        class Envelope implements IEnvelope {

            /**
             * Constructs a new Envelope.
             * @param [properties] Properties to set
             */
            constructor(properties?: market.mass.IEnvelope);

            /** Envelope requestId. */
            public requestId?: (market.mass.IRequestId|null);

            /** Envelope response. */
            public response?: (market.mass.Envelope.IGenericResponse|null);

            /** Envelope patchSetWriteRequest. */
            public patchSetWriteRequest?: (market.mass.IPatchSetWriteRequest|null);

            /** Envelope subscriptionRequest. */
            public subscriptionRequest?: (market.mass.ISubscriptionRequest|null);

            /** Envelope subscriptionCancelRequest. */
            public subscriptionCancelRequest?: (market.mass.ISubscriptionCancelRequest|null);

            /** Envelope subscriptionPushRequest. */
            public subscriptionPushRequest?: (market.mass.ISubscriptionPushRequest|null);

            /** Envelope syncStatusRequest. */
            public syncStatusRequest?: (market.mass.ISyncStatusRequest|null);

            /** Envelope pingRequest. */
            public pingRequest?: (market.mass.IPingRequest|null);

            /** Envelope getBlobUploadUrlRequest. */
            public getBlobUploadUrlRequest?: (market.mass.IGetBlobUploadURLRequest|null);

            /** Envelope authRequest. */
            public authRequest?: (market.mass.IAuthenticateRequest|null);

            /** Envelope challengeSolutionRequest. */
            public challengeSolutionRequest?: (market.mass.IChallengeSolvedRequest|null);

            /** Envelope message. */
            public message?: ("response"|"patchSetWriteRequest"|"subscriptionRequest"|"subscriptionCancelRequest"|"subscriptionPushRequest"|"syncStatusRequest"|"pingRequest"|"getBlobUploadUrlRequest"|"authRequest"|"challengeSolutionRequest");

            /**
             * Creates a new Envelope instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Envelope instance
             */
            public static create(properties?: market.mass.IEnvelope): market.mass.Envelope;

            /**
             * Encodes the specified Envelope message. Does not implicitly {@link market.mass.Envelope.verify|verify} messages.
             * @param message Envelope message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: market.mass.IEnvelope, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Envelope message, length delimited. Does not implicitly {@link market.mass.Envelope.verify|verify} messages.
             * @param message Envelope message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: market.mass.IEnvelope, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an Envelope message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Envelope
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): market.mass.Envelope;

            /**
             * Decodes an Envelope message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Envelope
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): market.mass.Envelope;

            /**
             * Verifies an Envelope message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an Envelope message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Envelope
             */
            public static fromObject(object: { [k: string]: any }): market.mass.Envelope;

            /**
             * Creates a plain object from an Envelope message. Also converts values to other types if specified.
             * @param message Envelope
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: market.mass.Envelope, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
                error?: (market.mass.IError|null);

                /** GenericResponse payload */
                payload?: (Uint8Array|null);
            }

            /** Represents a GenericResponse. */
            class GenericResponse implements IGenericResponse {

                /**
                 * Constructs a new GenericResponse.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: market.mass.Envelope.IGenericResponse);

                /** GenericResponse error. */
                public error?: (market.mass.IError|null);

                /** GenericResponse payload. */
                public payload?: (Uint8Array|null);

                /** GenericResponse response. */
                public response?: ("error"|"payload");

                /**
                 * Creates a new GenericResponse instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns GenericResponse instance
                 */
                public static create(properties?: market.mass.Envelope.IGenericResponse): market.mass.Envelope.GenericResponse;

                /**
                 * Encodes the specified GenericResponse message. Does not implicitly {@link market.mass.Envelope.GenericResponse.verify|verify} messages.
                 * @param message GenericResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: market.mass.Envelope.IGenericResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified GenericResponse message, length delimited. Does not implicitly {@link market.mass.Envelope.GenericResponse.verify|verify} messages.
                 * @param message GenericResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: market.mass.Envelope.IGenericResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a GenericResponse message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns GenericResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): market.mass.Envelope.GenericResponse;

                /**
                 * Decodes a GenericResponse message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns GenericResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): market.mass.Envelope.GenericResponse;

                /**
                 * Verifies a GenericResponse message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a GenericResponse message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns GenericResponse
                 */
                public static fromObject(object: { [k: string]: any }): market.mass.Envelope.GenericResponse;

                /**
                 * Creates a plain object from a GenericResponse message. Also converts values to other types if specified.
                 * @param message GenericResponse
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: market.mass.Envelope.GenericResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            code?: (market.mass.ErrorCodes|null);

            /** Error message */
            message?: (string|null);
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
            public static encode(message: market.mass.IError, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Error message, length delimited. Does not implicitly {@link market.mass.Error.verify|verify} messages.
             * @param message Error message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: market.mass.IError, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an Error message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Error
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): market.mass.Error;

            /**
             * Decodes an Error message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Error
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): market.mass.Error;

            /**
             * Verifies an Error message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

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
            public static toObject(message: market.mass.Error, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            ERROR_CODES_CLOSE_SUBSCRIPTION = 11
        }

        /** Properties of a GetBlobUploadURLRequest. */
        interface IGetBlobUploadURLRequest {
        }

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
            public static create(properties?: market.mass.IGetBlobUploadURLRequest): market.mass.GetBlobUploadURLRequest;

            /**
             * Encodes the specified GetBlobUploadURLRequest message. Does not implicitly {@link market.mass.GetBlobUploadURLRequest.verify|verify} messages.
             * @param message GetBlobUploadURLRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: market.mass.IGetBlobUploadURLRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified GetBlobUploadURLRequest message, length delimited. Does not implicitly {@link market.mass.GetBlobUploadURLRequest.verify|verify} messages.
             * @param message GetBlobUploadURLRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: market.mass.IGetBlobUploadURLRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a GetBlobUploadURLRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns GetBlobUploadURLRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): market.mass.GetBlobUploadURLRequest;

            /**
             * Decodes a GetBlobUploadURLRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns GetBlobUploadURLRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): market.mass.GetBlobUploadURLRequest;

            /**
             * Verifies a GetBlobUploadURLRequest message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a GetBlobUploadURLRequest message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns GetBlobUploadURLRequest
             */
            public static fromObject(object: { [k: string]: any }): market.mass.GetBlobUploadURLRequest;

            /**
             * Creates a plain object from a GetBlobUploadURLRequest message. Also converts values to other types if specified.
             * @param message GetBlobUploadURLRequest
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: market.mass.GetBlobUploadURLRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            OBJECT_TYPE_INVENTORY = 6
        }

        /** Properties of a SubscriptionRequest. */
        interface ISubscriptionRequest {

            /** SubscriptionRequest startShopSeqNo */
            startShopSeqNo?: (number|Long|null);

            /** SubscriptionRequest shopId */
            shopId?: (market.mass.IUint256|null);

            /** SubscriptionRequest filters */
            filters?: (market.mass.SubscriptionRequest.IFilter[]|null);
        }

        /** Represents a SubscriptionRequest. */
        class SubscriptionRequest implements ISubscriptionRequest {

            /**
             * Constructs a new SubscriptionRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: market.mass.ISubscriptionRequest);

            /** SubscriptionRequest startShopSeqNo. */
            public startShopSeqNo: (number|Long);

            /** SubscriptionRequest shopId. */
            public shopId?: (market.mass.IUint256|null);

            /** SubscriptionRequest filters. */
            public filters: market.mass.SubscriptionRequest.IFilter[];

            /**
             * Creates a new SubscriptionRequest instance using the specified properties.
             * @param [properties] Properties to set
             * @returns SubscriptionRequest instance
             */
            public static create(properties?: market.mass.ISubscriptionRequest): market.mass.SubscriptionRequest;

            /**
             * Encodes the specified SubscriptionRequest message. Does not implicitly {@link market.mass.SubscriptionRequest.verify|verify} messages.
             * @param message SubscriptionRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: market.mass.ISubscriptionRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified SubscriptionRequest message, length delimited. Does not implicitly {@link market.mass.SubscriptionRequest.verify|verify} messages.
             * @param message SubscriptionRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: market.mass.ISubscriptionRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a SubscriptionRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns SubscriptionRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): market.mass.SubscriptionRequest;

            /**
             * Decodes a SubscriptionRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns SubscriptionRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): market.mass.SubscriptionRequest;

            /**
             * Verifies a SubscriptionRequest message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a SubscriptionRequest message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns SubscriptionRequest
             */
            public static fromObject(object: { [k: string]: any }): market.mass.SubscriptionRequest;

            /**
             * Creates a plain object from a SubscriptionRequest message. Also converts values to other types if specified.
             * @param message SubscriptionRequest
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: market.mass.SubscriptionRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
                objectType?: (market.mass.ObjectType|null);

                /** Filter objectId */
                objectId?: (market.mass.IObjectId|null);
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
                public objectId?: (market.mass.IObjectId|null);

                /**
                 * Creates a new Filter instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Filter instance
                 */
                public static create(properties?: market.mass.SubscriptionRequest.IFilter): market.mass.SubscriptionRequest.Filter;

                /**
                 * Encodes the specified Filter message. Does not implicitly {@link market.mass.SubscriptionRequest.Filter.verify|verify} messages.
                 * @param message Filter message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: market.mass.SubscriptionRequest.IFilter, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Filter message, length delimited. Does not implicitly {@link market.mass.SubscriptionRequest.Filter.verify|verify} messages.
                 * @param message Filter message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: market.mass.SubscriptionRequest.IFilter, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Filter message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Filter
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): market.mass.SubscriptionRequest.Filter;

                /**
                 * Decodes a Filter message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Filter
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): market.mass.SubscriptionRequest.Filter;

                /**
                 * Verifies a Filter message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Filter message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Filter
                 */
                public static fromObject(object: { [k: string]: any }): market.mass.SubscriptionRequest.Filter;

                /**
                 * Creates a plain object from a Filter message. Also converts values to other types if specified.
                 * @param message Filter
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: market.mass.SubscriptionRequest.Filter, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            subscriptionId?: (Uint8Array|null);

            /** SubscriptionPushRequest sets */
            sets?: (market.mass.SubscriptionPushRequest.ISequencedPartialPatchSet[]|null);
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

            /** SubscriptionPushRequest sets. */
            public sets: market.mass.SubscriptionPushRequest.ISequencedPartialPatchSet[];

            /**
             * Creates a new SubscriptionPushRequest instance using the specified properties.
             * @param [properties] Properties to set
             * @returns SubscriptionPushRequest instance
             */
            public static create(properties?: market.mass.ISubscriptionPushRequest): market.mass.SubscriptionPushRequest;

            /**
             * Encodes the specified SubscriptionPushRequest message. Does not implicitly {@link market.mass.SubscriptionPushRequest.verify|verify} messages.
             * @param message SubscriptionPushRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: market.mass.ISubscriptionPushRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified SubscriptionPushRequest message, length delimited. Does not implicitly {@link market.mass.SubscriptionPushRequest.verify|verify} messages.
             * @param message SubscriptionPushRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: market.mass.ISubscriptionPushRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a SubscriptionPushRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns SubscriptionPushRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): market.mass.SubscriptionPushRequest;

            /**
             * Decodes a SubscriptionPushRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns SubscriptionPushRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): market.mass.SubscriptionPushRequest;

            /**
             * Verifies a SubscriptionPushRequest message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a SubscriptionPushRequest message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns SubscriptionPushRequest
             */
            public static fromObject(object: { [k: string]: any }): market.mass.SubscriptionPushRequest;

            /**
             * Creates a plain object from a SubscriptionPushRequest message. Also converts values to other types if specified.
             * @param message SubscriptionPushRequest
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: market.mass.SubscriptionPushRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

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

            /** Properties of a SequencedPartialPatchSet. */
            interface ISequencedPartialPatchSet {

                /** SequencedPartialPatchSet shopSeqNo */
                shopSeqNo?: (number|Long|null);

                /** SequencedPartialPatchSet patchLeafIndex */
                patchLeafIndex?: (number|null);

                /** SequencedPartialPatchSet header */
                header?: (Uint8Array|null);

                /** SequencedPartialPatchSet signature */
                signature?: (Uint8Array|null);

                /** SequencedPartialPatchSet patches */
                patches?: (Uint8Array[]|null);

                /** SequencedPartialPatchSet proofs */
                proofs?: (Uint8Array[]|null);
            }

            /** Represents a SequencedPartialPatchSet. */
            class SequencedPartialPatchSet implements ISequencedPartialPatchSet {

                /**
                 * Constructs a new SequencedPartialPatchSet.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: market.mass.SubscriptionPushRequest.ISequencedPartialPatchSet);

                /** SequencedPartialPatchSet shopSeqNo. */
                public shopSeqNo: (number|Long);

                /** SequencedPartialPatchSet patchLeafIndex. */
                public patchLeafIndex: number;

                /** SequencedPartialPatchSet header. */
                public header: Uint8Array;

                /** SequencedPartialPatchSet signature. */
                public signature: Uint8Array;

                /** SequencedPartialPatchSet patches. */
                public patches: Uint8Array[];

                /** SequencedPartialPatchSet proofs. */
                public proofs: Uint8Array[];

                /**
                 * Creates a new SequencedPartialPatchSet instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns SequencedPartialPatchSet instance
                 */
                public static create(properties?: market.mass.SubscriptionPushRequest.ISequencedPartialPatchSet): market.mass.SubscriptionPushRequest.SequencedPartialPatchSet;

                /**
                 * Encodes the specified SequencedPartialPatchSet message. Does not implicitly {@link market.mass.SubscriptionPushRequest.SequencedPartialPatchSet.verify|verify} messages.
                 * @param message SequencedPartialPatchSet message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: market.mass.SubscriptionPushRequest.ISequencedPartialPatchSet, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified SequencedPartialPatchSet message, length delimited. Does not implicitly {@link market.mass.SubscriptionPushRequest.SequencedPartialPatchSet.verify|verify} messages.
                 * @param message SequencedPartialPatchSet message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: market.mass.SubscriptionPushRequest.ISequencedPartialPatchSet, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a SequencedPartialPatchSet message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns SequencedPartialPatchSet
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): market.mass.SubscriptionPushRequest.SequencedPartialPatchSet;

                /**
                 * Decodes a SequencedPartialPatchSet message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns SequencedPartialPatchSet
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): market.mass.SubscriptionPushRequest.SequencedPartialPatchSet;

                /**
                 * Verifies a SequencedPartialPatchSet message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a SequencedPartialPatchSet message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns SequencedPartialPatchSet
                 */
                public static fromObject(object: { [k: string]: any }): market.mass.SubscriptionPushRequest.SequencedPartialPatchSet;

                /**
                 * Creates a plain object from a SequencedPartialPatchSet message. Also converts values to other types if specified.
                 * @param message SequencedPartialPatchSet
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: market.mass.SubscriptionPushRequest.SequencedPartialPatchSet, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this SequencedPartialPatchSet to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for SequencedPartialPatchSet
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }
        }

        /** Properties of a SubscriptionCancelRequest. */
        interface ISubscriptionCancelRequest {

            /** SubscriptionCancelRequest subscriptionId */
            subscriptionId?: (Uint8Array|null);
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
            public static create(properties?: market.mass.ISubscriptionCancelRequest): market.mass.SubscriptionCancelRequest;

            /**
             * Encodes the specified SubscriptionCancelRequest message. Does not implicitly {@link market.mass.SubscriptionCancelRequest.verify|verify} messages.
             * @param message SubscriptionCancelRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: market.mass.ISubscriptionCancelRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified SubscriptionCancelRequest message, length delimited. Does not implicitly {@link market.mass.SubscriptionCancelRequest.verify|verify} messages.
             * @param message SubscriptionCancelRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: market.mass.ISubscriptionCancelRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a SubscriptionCancelRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns SubscriptionCancelRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): market.mass.SubscriptionCancelRequest;

            /**
             * Decodes a SubscriptionCancelRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns SubscriptionCancelRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): market.mass.SubscriptionCancelRequest;

            /**
             * Verifies a SubscriptionCancelRequest message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a SubscriptionCancelRequest message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns SubscriptionCancelRequest
             */
            public static fromObject(object: { [k: string]: any }): market.mass.SubscriptionCancelRequest;

            /**
             * Creates a plain object from a SubscriptionCancelRequest message. Also converts values to other types if specified.
             * @param message SubscriptionCancelRequest
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: market.mass.SubscriptionCancelRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

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

        /** Properties of a PatchSetWriteRequest. */
        interface IPatchSetWriteRequest {

            /** PatchSetWriteRequest patchSet */
            patchSet?: (Uint8Array|null);
        }

        /** Represents a PatchSetWriteRequest. */
        class PatchSetWriteRequest implements IPatchSetWriteRequest {

            /**
             * Constructs a new PatchSetWriteRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: market.mass.IPatchSetWriteRequest);

            /** PatchSetWriteRequest patchSet. */
            public patchSet: Uint8Array;

            /**
             * Creates a new PatchSetWriteRequest instance using the specified properties.
             * @param [properties] Properties to set
             * @returns PatchSetWriteRequest instance
             */
            public static create(properties?: market.mass.IPatchSetWriteRequest): market.mass.PatchSetWriteRequest;

            /**
             * Encodes the specified PatchSetWriteRequest message. Does not implicitly {@link market.mass.PatchSetWriteRequest.verify|verify} messages.
             * @param message PatchSetWriteRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: market.mass.IPatchSetWriteRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified PatchSetWriteRequest message, length delimited. Does not implicitly {@link market.mass.PatchSetWriteRequest.verify|verify} messages.
             * @param message PatchSetWriteRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: market.mass.IPatchSetWriteRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a PatchSetWriteRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns PatchSetWriteRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): market.mass.PatchSetWriteRequest;

            /**
             * Decodes a PatchSetWriteRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns PatchSetWriteRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): market.mass.PatchSetWriteRequest;

            /**
             * Verifies a PatchSetWriteRequest message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a PatchSetWriteRequest message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns PatchSetWriteRequest
             */
            public static fromObject(object: { [k: string]: any }): market.mass.PatchSetWriteRequest;

            /**
             * Creates a plain object from a PatchSetWriteRequest message. Also converts values to other types if specified.
             * @param message PatchSetWriteRequest
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: market.mass.PatchSetWriteRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this PatchSetWriteRequest to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for PatchSetWriteRequest
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a SyncStatusRequest. */
        interface ISyncStatusRequest {
            /** SyncStatusRequest subscriptionId */
            subscriptionId?: (number|Long|null);

            /** SyncStatusRequest unpushedPatches */
            unpushedPatches?: (number|Long|null);
        }

        /** Represents a SyncStatusRequest. */
        class SyncStatusRequest implements ISyncStatusRequest {

            /**
             * Constructs a new SyncStatusRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: market.mass.ISyncStatusRequest);

            /** SyncStatusRequest subscriptionId. */
            public subscriptionId: (number|Long);

            /** SyncStatusRequest unpushedPatches. */
            public unpushedPatches: (number|Long);

            /**
             * Creates a new SyncStatusRequest instance using the specified properties.
             * @param [properties] Properties to set
             * @returns SyncStatusRequest instance
             */
            public static create(properties?: market.mass.ISyncStatusRequest): market.mass.SyncStatusRequest;

            /**
             * Encodes the specified SyncStatusRequest message. Does not implicitly {@link market.mass.SyncStatusRequest.verify|verify} messages.
             * @param message SyncStatusRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: market.mass.ISyncStatusRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified SyncStatusRequest message, length delimited. Does not implicitly {@link market.mass.SyncStatusRequest.verify|verify} messages.
             * @param message SyncStatusRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: market.mass.ISyncStatusRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a SyncStatusRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns SyncStatusRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): market.mass.SyncStatusRequest;

            /**
             * Decodes a SyncStatusRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns SyncStatusRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): market.mass.SyncStatusRequest;

            /**
             * Verifies a SyncStatusRequest message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a SyncStatusRequest message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns SyncStatusRequest
             */
            public static fromObject(object: { [k: string]: any }): market.mass.SyncStatusRequest;

            /**
             * Creates a plain object from a SyncStatusRequest message. Also converts values to other types if specified.
             * @param message SyncStatusRequest
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: market.mass.SyncStatusRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
        interface IPingRequest {
        }

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
            public static create(properties?: market.mass.IPingRequest): market.mass.PingRequest;

            /**
             * Encodes the specified PingRequest message. Does not implicitly {@link market.mass.PingRequest.verify|verify} messages.
             * @param message PingRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: market.mass.IPingRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified PingRequest message, length delimited. Does not implicitly {@link market.mass.PingRequest.verify|verify} messages.
             * @param message PingRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: market.mass.IPingRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a PingRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns PingRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): market.mass.PingRequest;

            /**
             * Decodes a PingRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns PingRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): market.mass.PingRequest;

            /**
             * Verifies a PingRequest message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a PingRequest message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns PingRequest
             */
            public static fromObject(object: { [k: string]: any }): market.mass.PingRequest;

            /**
             * Creates a plain object from a PingRequest message. Also converts values to other types if specified.
             * @param message PingRequest
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: market.mass.PingRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
    }
}
