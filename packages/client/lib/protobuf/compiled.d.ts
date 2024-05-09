// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: MIT

import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace market. */
export namespace market {
  /** Namespace mass. */
  namespace mass {
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

    /** Properties of an UpdateManifest. */
    interface IUpdateManifest {
      /** UpdateManifest eventId */
      eventId?: Uint8Array | null;

      /** UpdateManifest field */
      field?: market.mass.UpdateManifest.ManifestField | null;

      /** UpdateManifest string */
      string?: string | null;

      /** UpdateManifest tagId */
      tagId?: Uint8Array | null;

      /** UpdateManifest erc20Addr */
      erc20Addr?: Uint8Array | null;
    }

    /** Represents an UpdateManifest. */
    class UpdateManifest implements IUpdateManifest {
      /**
       * Constructs a new UpdateManifest.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.IUpdateManifest);

      /** UpdateManifest eventId. */
      public eventId: Uint8Array;

      /** UpdateManifest field. */
      public field: market.mass.UpdateManifest.ManifestField;

      /** UpdateManifest string. */
      public string?: string | null;

      /** UpdateManifest tagId. */
      public tagId?: Uint8Array | null;

      /** UpdateManifest erc20Addr. */
      public erc20Addr?: Uint8Array | null;

      /** UpdateManifest value. */
      public value?: "string" | "tagId" | "erc20Addr";

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

    namespace UpdateManifest {
      /** ManifestField enum. */
      enum ManifestField {
        MANIFEST_FIELD_UNSPECIFIED = 0,
        MANIFEST_FIELD_DOMAIN = 1,
        MANIFEST_FIELD_PUBLISHED_TAG = 2,
        MANIFEST_FIELD_ADD_ERC20 = 3,
        MANIFEST_FIELD_REMOVE_ERC20 = 4,
      }
    }

    /** Properties of a CreateItem. */
    interface ICreateItem {
      /** CreateItem eventId */
      eventId: Uint8Array;

      /** CreateItem price */
      price: string;

      /** CreateItem metadata */
      metadata: Uint8Array;
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
      eventId: Uint8Array;

      /** UpdateItem itemId */
      itemId: Uint8Array;

      /** UpdateItem field */
      field?: market.mass.UpdateItem.ItemField | null;

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

      /** UpdateItem field. */
      public field: market.mass.UpdateItem.ItemField;

      /** UpdateItem price. */
      public price?: string | null;

      /** UpdateItem metadata. */
      public metadata?: Uint8Array | null;

      /** UpdateItem value. */
      public value?: "price" | "metadata";

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

    namespace UpdateItem {
      /** ItemField enum. */
      enum ItemField {
        ITEM_FIELD_UNSPECIFIED = 0,
        ITEM_FIELD_PRICE = 1,
        ITEM_FIELD_METADATA = 2,
      }
    }

    /** Properties of a CreateTag. */
    interface ICreateTag {
      /** CreateTag eventId */
      eventId: Uint8Array;

      /** CreateTag name */
      name: string;
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

    /** Properties of an AddToTag. */
    interface IAddToTag {
      /** AddToTag eventId */
      eventId: Uint8Array;

      /** AddToTag tagId */
      tagId: Uint8Array;

      /** AddToTag itemId */
      itemId: Uint8Array;
    }

    /** Represents an AddToTag. */
    class AddToTag implements IAddToTag {
      /**
       * Constructs a new AddToTag.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.IAddToTag);

      /** AddToTag eventId. */
      public eventId: Uint8Array;

      /** AddToTag tagId. */
      public tagId: Uint8Array;

      /** AddToTag itemId. */
      public itemId: Uint8Array;

      /**
       * Creates a new AddToTag instance using the specified properties.
       * @param [properties] Properties to set
       * @returns AddToTag instance
       */
      public static create(
        properties?: market.mass.IAddToTag,
      ): market.mass.AddToTag;

      /**
       * Encodes the specified AddToTag message. Does not implicitly {@link market.mass.AddToTag.verify|verify} messages.
       * @param message AddToTag message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.IAddToTag,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified AddToTag message, length delimited. Does not implicitly {@link market.mass.AddToTag.verify|verify} messages.
       * @param message AddToTag message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.IAddToTag,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes an AddToTag message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns AddToTag
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.AddToTag;

      /**
       * Decodes an AddToTag message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns AddToTag
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.AddToTag;

      /**
       * Verifies an AddToTag message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates an AddToTag message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns AddToTag
       */
      public static fromObject(object: {
        [k: string]: any;
      }): market.mass.AddToTag;

      /**
       * Creates a plain object from an AddToTag message. Also converts values to other types if specified.
       * @param message AddToTag
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.AddToTag,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this AddToTag to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for AddToTag
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a RemoveFromTag. */
    interface IRemoveFromTag {
      /** RemoveFromTag eventId */
      eventId: Uint8Array;

      /** RemoveFromTag tagId */
      tagId: Uint8Array;

      /** RemoveFromTag itemId */
      itemId: Uint8Array;
    }

    /** Represents a RemoveFromTag. */
    class RemoveFromTag implements IRemoveFromTag {
      /**
       * Constructs a new RemoveFromTag.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.IRemoveFromTag);

      /** RemoveFromTag eventId. */
      public eventId: Uint8Array;

      /** RemoveFromTag tagId. */
      public tagId: Uint8Array;

      /** RemoveFromTag itemId. */
      public itemId: Uint8Array;

      /**
       * Creates a new RemoveFromTag instance using the specified properties.
       * @param [properties] Properties to set
       * @returns RemoveFromTag instance
       */
      public static create(
        properties?: market.mass.IRemoveFromTag,
      ): market.mass.RemoveFromTag;

      /**
       * Encodes the specified RemoveFromTag message. Does not implicitly {@link market.mass.RemoveFromTag.verify|verify} messages.
       * @param message RemoveFromTag message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.IRemoveFromTag,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified RemoveFromTag message, length delimited. Does not implicitly {@link market.mass.RemoveFromTag.verify|verify} messages.
       * @param message RemoveFromTag message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.IRemoveFromTag,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes a RemoveFromTag message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns RemoveFromTag
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.RemoveFromTag;

      /**
       * Decodes a RemoveFromTag message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns RemoveFromTag
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.RemoveFromTag;

      /**
       * Verifies a RemoveFromTag message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates a RemoveFromTag message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns RemoveFromTag
       */
      public static fromObject(object: {
        [k: string]: any;
      }): market.mass.RemoveFromTag;

      /**
       * Creates a plain object from a RemoveFromTag message. Also converts values to other types if specified.
       * @param message RemoveFromTag
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.RemoveFromTag,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this RemoveFromTag to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for RemoveFromTag
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a RenameTag. */
    interface IRenameTag {
      /** RenameTag eventId */
      eventId?: Uint8Array | null;

      /** RenameTag tagId */
      tagId?: Uint8Array | null;

      /** RenameTag name */
      name?: string | null;
    }

    /** Represents a RenameTag. */
    class RenameTag implements IRenameTag {
      /**
       * Constructs a new RenameTag.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.IRenameTag);

      /** RenameTag eventId. */
      public eventId: Uint8Array;

      /** RenameTag tagId. */
      public tagId: Uint8Array;

      /** RenameTag name. */
      public name: string;

      /**
       * Creates a new RenameTag instance using the specified properties.
       * @param [properties] Properties to set
       * @returns RenameTag instance
       */
      public static create(
        properties?: market.mass.IRenameTag,
      ): market.mass.RenameTag;

      /**
       * Encodes the specified RenameTag message. Does not implicitly {@link market.mass.RenameTag.verify|verify} messages.
       * @param message RenameTag message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.IRenameTag,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified RenameTag message, length delimited. Does not implicitly {@link market.mass.RenameTag.verify|verify} messages.
       * @param message RenameTag message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.IRenameTag,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes a RenameTag message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns RenameTag
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.RenameTag;

      /**
       * Decodes a RenameTag message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns RenameTag
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.RenameTag;

      /**
       * Verifies a RenameTag message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates a RenameTag message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns RenameTag
       */
      public static fromObject(object: {
        [k: string]: any;
      }): market.mass.RenameTag;

      /**
       * Creates a plain object from a RenameTag message. Also converts values to other types if specified.
       * @param message RenameTag
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.RenameTag,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this RenameTag to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for RenameTag
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a DeleteTag. */
    interface IDeleteTag {
      /** DeleteTag eventId */
      eventId?: Uint8Array | null;

      /** DeleteTag tagId */
      tagId?: Uint8Array | null;
    }

    /** Represents a DeleteTag. */
    class DeleteTag implements IDeleteTag {
      /**
       * Constructs a new DeleteTag.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.IDeleteTag);

      /** DeleteTag eventId. */
      public eventId: Uint8Array;

      /** DeleteTag tagId. */
      public tagId: Uint8Array;

      /**
       * Creates a new DeleteTag instance using the specified properties.
       * @param [properties] Properties to set
       * @returns DeleteTag instance
       */
      public static create(
        properties?: market.mass.IDeleteTag,
      ): market.mass.DeleteTag;

      /**
       * Encodes the specified DeleteTag message. Does not implicitly {@link market.mass.DeleteTag.verify|verify} messages.
       * @param message DeleteTag message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.IDeleteTag,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified DeleteTag message, length delimited. Does not implicitly {@link market.mass.DeleteTag.verify|verify} messages.
       * @param message DeleteTag message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.IDeleteTag,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes a DeleteTag message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns DeleteTag
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.DeleteTag;

      /**
       * Decodes a DeleteTag message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns DeleteTag
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.DeleteTag;

      /**
       * Verifies a DeleteTag message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates a DeleteTag message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns DeleteTag
       */
      public static fromObject(object: {
        [k: string]: any;
      }): market.mass.DeleteTag;

      /**
       * Creates a plain object from a DeleteTag message. Also converts values to other types if specified.
       * @param message DeleteTag
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.DeleteTag,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this DeleteTag to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for DeleteTag
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

      /** ChangeStock cartId */
      cartId?: Uint8Array | null;

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

      /** ChangeStock cartId. */
      public cartId: Uint8Array;

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

    /** Properties of a CreateCart. */
    interface ICreateCart {
      /** CreateCart eventId */
      eventId?: Uint8Array | null;
    }

    /** Represents a CreateCart. */
    class CreateCart implements ICreateCart {
      /**
       * Constructs a new CreateCart.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.ICreateCart);

      /** CreateCart eventId. */
      public eventId: Uint8Array;

      /**
       * Creates a new CreateCart instance using the specified properties.
       * @param [properties] Properties to set
       * @returns CreateCart instance
       */
      public static create(
        properties?: market.mass.ICreateCart,
      ): market.mass.CreateCart;

      /**
       * Encodes the specified CreateCart message. Does not implicitly {@link market.mass.CreateCart.verify|verify} messages.
       * @param message CreateCart message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.ICreateCart,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified CreateCart message, length delimited. Does not implicitly {@link market.mass.CreateCart.verify|verify} messages.
       * @param message CreateCart message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.ICreateCart,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes a CreateCart message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns CreateCart
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.CreateCart;

      /**
       * Decodes a CreateCart message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns CreateCart
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.CreateCart;

      /**
       * Verifies a CreateCart message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates a CreateCart message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns CreateCart
       */
      public static fromObject(object: {
        [k: string]: any;
      }): market.mass.CreateCart;

      /**
       * Creates a plain object from a CreateCart message. Also converts values to other types if specified.
       * @param message CreateCart
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.CreateCart,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this CreateCart to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for CreateCart
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a ChangeCart. */
    interface IChangeCart {
      /** ChangeCart eventId */
      eventId: Uint8Array;

      /** ChangeCart cartId */
      cartId: Uint8Array;

      /** ChangeCart itemId */
      itemId: Uint8Array;

      /** ChangeCart quantity */
      quantity: number;
    }

    /** Represents a ChangeCart. */
    class ChangeCart implements IChangeCart {
      /**
       * Constructs a new ChangeCart.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.IChangeCart);

      /** ChangeCart eventId. */
      public eventId: Uint8Array;

      /** ChangeCart cartId. */
      public cartId: Uint8Array;

      /** ChangeCart itemId. */
      public itemId: Uint8Array;

      /** ChangeCart quantity. */
      public quantity: number;

      /**
       * Creates a new ChangeCart instance using the specified properties.
       * @param [properties] Properties to set
       * @returns ChangeCart instance
       */
      public static create(
        properties?: market.mass.IChangeCart,
      ): market.mass.ChangeCart;

      /**
       * Encodes the specified ChangeCart message. Does not implicitly {@link market.mass.ChangeCart.verify|verify} messages.
       * @param message ChangeCart message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.IChangeCart,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified ChangeCart message, length delimited. Does not implicitly {@link market.mass.ChangeCart.verify|verify} messages.
       * @param message ChangeCart message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.IChangeCart,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes a ChangeCart message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns ChangeCart
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.ChangeCart;

      /**
       * Decodes a ChangeCart message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns ChangeCart
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.ChangeCart;

      /**
       * Verifies a ChangeCart message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates a ChangeCart message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns ChangeCart
       */
      public static fromObject(object: {
        [k: string]: any;
      }): market.mass.ChangeCart;

      /**
       * Creates a plain object from a ChangeCart message. Also converts values to other types if specified.
       * @param message ChangeCart
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.ChangeCart,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this ChangeCart to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for ChangeCart
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a CartFinalized. */
    interface ICartFinalized {
      /** CartFinalized eventId */
      eventId: Uint8Array;

      /** CartFinalized cartId */
      cartId: Uint8Array;

      /** CartFinalized purchaseAddr */
      purchaseAddr: Uint8Array;

      /** CartFinalized erc20Addr */
      erc20Addr?: Uint8Array | null;

      /** CartFinalized subTotal */
      subTotal?: string | null;

      /** CartFinalized salesTax */
      salesTax?: string | null;

      /** CartFinalized total */
      total?: string | null;

      /** CartFinalized totalInCrypto */
      totalInCrypto?: string | null;
    }

    /** Represents a CartFinalized. */
    class CartFinalized implements ICartFinalized {
      /**
       * Constructs a new CartFinalized.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.ICartFinalized);

      /** CartFinalized eventId. */
      public eventId: Uint8Array;

      /** CartFinalized cartId. */
      public cartId: Uint8Array;

      /** CartFinalized purchaseAddr. */
      public purchaseAddr: Uint8Array;

      /** CartFinalized erc20Addr. */
      public erc20Addr: Uint8Array;

      /** CartFinalized subTotal. */
      public subTotal: string;

      /** CartFinalized salesTax. */
      public salesTax: string;

      /** CartFinalized total. */
      public total: string;

      /** CartFinalized totalInCrypto. */
      public totalInCrypto: string;

      /**
       * Creates a new CartFinalized instance using the specified properties.
       * @param [properties] Properties to set
       * @returns CartFinalized instance
       */
      public static create(
        properties?: market.mass.ICartFinalized,
      ): market.mass.CartFinalized;

      /**
       * Encodes the specified CartFinalized message. Does not implicitly {@link market.mass.CartFinalized.verify|verify} messages.
       * @param message CartFinalized message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.ICartFinalized,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified CartFinalized message, length delimited. Does not implicitly {@link market.mass.CartFinalized.verify|verify} messages.
       * @param message CartFinalized message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.ICartFinalized,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes a CartFinalized message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns CartFinalized
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.CartFinalized;

      /**
       * Decodes a CartFinalized message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns CartFinalized
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.CartFinalized;

      /**
       * Verifies a CartFinalized message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates a CartFinalized message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns CartFinalized
       */
      public static fromObject(object: {
        [k: string]: any;
      }): market.mass.CartFinalized;

      /**
       * Creates a plain object from a CartFinalized message. Also converts values to other types if specified.
       * @param message CartFinalized
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.CartFinalized,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this CartFinalized to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for CartFinalized
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a CartAbandoned. */
    interface ICartAbandoned {
      /** CartAbandoned eventId */
      eventId: Uint8Array;

      /** CartAbandoned cartId */
      cartId: Uint8Array;
    }

    /** Represents a CartAbandoned. */
    class CartAbandoned implements ICartAbandoned {
      /**
       * Constructs a new CartAbandoned.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.ICartAbandoned);

      /** CartAbandoned eventId. */
      public eventId: Uint8Array;

      /** CartAbandoned cartId. */
      public cartId: Uint8Array;

      /**
       * Creates a new CartAbandoned instance using the specified properties.
       * @param [properties] Properties to set
       * @returns CartAbandoned instance
       */
      public static create(
        properties?: market.mass.ICartAbandoned,
      ): market.mass.CartAbandoned;

      /**
       * Encodes the specified CartAbandoned message. Does not implicitly {@link market.mass.CartAbandoned.verify|verify} messages.
       * @param message CartAbandoned message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.ICartAbandoned,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified CartAbandoned message, length delimited. Does not implicitly {@link market.mass.CartAbandoned.verify|verify} messages.
       * @param message CartAbandoned message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.ICartAbandoned,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes a CartAbandoned message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns CartAbandoned
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.CartAbandoned;

      /**
       * Decodes a CartAbandoned message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns CartAbandoned
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.CartAbandoned;

      /**
       * Verifies a CartAbandoned message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates a CartAbandoned message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns CartAbandoned
       */
      public static fromObject(object: {
        [k: string]: any;
      }): market.mass.CartAbandoned;

      /**
       * Creates a plain object from a CartAbandoned message. Also converts values to other types if specified.
       * @param message CartAbandoned
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.CartAbandoned,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this CartAbandoned to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for CartAbandoned
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an Event. */
    interface IEvent {
      /** Event signature */
      signature?: Uint8Array | null;

      /** Event storeManifest */
      storeManifest?: market.mass.IStoreManifest | null;

      /** Event updateManifest */
      updateManifest?: market.mass.IUpdateManifest | null;

      /** Event createItem */
      createItem?: market.mass.ICreateItem | null;

      /** Event updateItem */
      updateItem?: market.mass.IUpdateItem | null;

      /** Event createTag */
      createTag?: market.mass.ICreateTag | null;

      /** Event addToTag */
      addToTag?: market.mass.IAddToTag | null;

      /** Event removeFromTag */
      removeFromTag?: market.mass.IRemoveFromTag | null;

      /** Event renameTag */
      renameTag?: market.mass.IRenameTag | null;

      /** Event deleteTag */
      deleteTag?: market.mass.IDeleteTag | null;

      /** Event createCart */
      createCart?: market.mass.ICreateCart | null;

      /** Event changeCart */
      changeCart?: market.mass.IChangeCart | null;

      /** Event cartFinalized */
      cartFinalized?: market.mass.ICartFinalized | null;

      /** Event cartAbandoned */
      cartAbandoned?: market.mass.ICartAbandoned | null;

      /** Event changeStock */
      changeStock?: market.mass.IChangeStock | null;

      /** Event newKeyCard */
      newKeyCard?: market.mass.INewKeyCard | null;
    }

    /** Represents an Event. */
    class Event implements IEvent {
      /**
       * Constructs a new Event.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.IEvent);

      /** Event signature. */
      public signature: Uint8Array;

      /** Event storeManifest. */
      public storeManifest?: market.mass.IStoreManifest | null;

      /** Event updateManifest. */
      public updateManifest?: market.mass.IUpdateManifest | null;

      /** Event createItem. */
      public createItem?: market.mass.ICreateItem | null;

      /** Event updateItem. */
      public updateItem?: market.mass.IUpdateItem | null;

      /** Event createTag. */
      public createTag?: market.mass.ICreateTag | null;

      /** Event addToTag. */
      public addToTag?: market.mass.IAddToTag | null;

      /** Event removeFromTag. */
      public removeFromTag?: market.mass.IRemoveFromTag | null;

      /** Event renameTag. */
      public renameTag?: market.mass.IRenameTag | null;

      /** Event deleteTag. */
      public deleteTag?: market.mass.IDeleteTag | null;

      /** Event createCart. */
      public createCart?: market.mass.ICreateCart | null;

      /** Event changeCart. */
      public changeCart?: market.mass.IChangeCart | null;

      /** Event cartFinalized. */
      public cartFinalized?: market.mass.ICartFinalized | null;

      /** Event cartAbandoned. */
      public cartAbandoned?: market.mass.ICartAbandoned | null;

      /** Event changeStock. */
      public changeStock?: market.mass.IChangeStock | null;

      /** Event newKeyCard. */
      public newKeyCard?: market.mass.INewKeyCard | null;

      /** Event union. */
      public union?:
        | "storeManifest"
        | "updateManifest"
        | "createItem"
        | "updateItem"
        | "createTag"
        | "addToTag"
        | "removeFromTag"
        | "renameTag"
        | "deleteTag"
        | "createCart"
        | "changeCart"
        | "cartFinalized"
        | "cartAbandoned"
        | "changeStock"
        | "newKeyCard";

      /**
       * Creates a new Event instance using the specified properties.
       * @param [properties] Properties to set
       * @returns Event instance
       */
      public static create(properties?: market.mass.IEvent): market.mass.Event;

      /**
       * Encodes the specified Event message. Does not implicitly {@link market.mass.Event.verify|verify} messages.
       * @param message Event message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.IEvent,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified Event message, length delimited. Does not implicitly {@link market.mass.Event.verify|verify} messages.
       * @param message Event message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.IEvent,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes an Event message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns Event
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.Event;

      /**
       * Decodes an Event message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns Event
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.Event;

      /**
       * Verifies an Event message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates an Event message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns Event
       */
      public static fromObject(object: { [k: string]: any }): market.mass.Event;

      /**
       * Creates a plain object from an Event message. Also converts values to other types if specified.
       * @param message Event
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.Event,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this Event to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for Event
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

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

    /** Properties of a CommitCartRequest. */
    interface ICommitCartRequest {
      /** CommitCartRequest requestId */
      requestId?: Uint8Array | null;

      /** CommitCartRequest cartId */
      cartId?: Uint8Array | null;

      /** CommitCartRequest erc20Addr */
      erc20Addr?: Uint8Array | null;
    }

    /** Represents a CommitCartRequest. */
    class CommitCartRequest implements ICommitCartRequest {
      /**
       * Constructs a new CommitCartRequest.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.ICommitCartRequest);

      /** CommitCartRequest requestId. */
      public requestId: Uint8Array;

      /** CommitCartRequest cartId. */
      public cartId: Uint8Array;

      /** CommitCartRequest erc20Addr. */
      public erc20Addr: Uint8Array;

      /**
       * Creates a new CommitCartRequest instance using the specified properties.
       * @param [properties] Properties to set
       * @returns CommitCartRequest instance
       */
      public static create(
        properties?: market.mass.ICommitCartRequest,
      ): market.mass.CommitCartRequest;

      /**
       * Encodes the specified CommitCartRequest message. Does not implicitly {@link market.mass.CommitCartRequest.verify|verify} messages.
       * @param message CommitCartRequest message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.ICommitCartRequest,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified CommitCartRequest message, length delimited. Does not implicitly {@link market.mass.CommitCartRequest.verify|verify} messages.
       * @param message CommitCartRequest message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.ICommitCartRequest,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes a CommitCartRequest message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns CommitCartRequest
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.CommitCartRequest;

      /**
       * Decodes a CommitCartRequest message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns CommitCartRequest
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.CommitCartRequest;

      /**
       * Verifies a CommitCartRequest message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates a CommitCartRequest message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns CommitCartRequest
       */
      public static fromObject(object: {
        [k: string]: any;
      }): market.mass.CommitCartRequest;

      /**
       * Creates a plain object from a CommitCartRequest message. Also converts values to other types if specified.
       * @param message CommitCartRequest
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.CommitCartRequest,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this CommitCartRequest to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for CommitCartRequest
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a CommitCartResponse. */
    interface ICommitCartResponse {
      /** CommitCartResponse requestId */
      requestId?: Uint8Array | null;

      /** CommitCartResponse error */
      error?: market.mass.IError | null;

      /** CommitCartResponse cartFinalizedId */
      cartFinalizedId?: Uint8Array | null;
    }

    /** Represents a CommitCartResponse. */
    class CommitCartResponse implements ICommitCartResponse {
      /**
       * Constructs a new CommitCartResponse.
       * @param [properties] Properties to set
       */
      constructor(properties?: market.mass.ICommitCartResponse);

      /** CommitCartResponse requestId. */
      public requestId: Uint8Array;

      /** CommitCartResponse error. */
      public error?: market.mass.IError | null;

      /** CommitCartResponse cartFinalizedId. */
      public cartFinalizedId: Uint8Array;

      /**
       * Creates a new CommitCartResponse instance using the specified properties.
       * @param [properties] Properties to set
       * @returns CommitCartResponse instance
       */
      public static create(
        properties?: market.mass.ICommitCartResponse,
      ): market.mass.CommitCartResponse;

      /**
       * Encodes the specified CommitCartResponse message. Does not implicitly {@link market.mass.CommitCartResponse.verify|verify} messages.
       * @param message CommitCartResponse message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: market.mass.ICommitCartResponse,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified CommitCartResponse message, length delimited. Does not implicitly {@link market.mass.CommitCartResponse.verify|verify} messages.
       * @param message CommitCartResponse message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: market.mass.ICommitCartResponse,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes a CommitCartResponse message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns CommitCartResponse
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): market.mass.CommitCartResponse;

      /**
       * Decodes a CommitCartResponse message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns CommitCartResponse
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): market.mass.CommitCartResponse;

      /**
       * Verifies a CommitCartResponse message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: { [k: string]: any }): string | null;

      /**
       * Creates a CommitCartResponse message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns CommitCartResponse
       */
      public static fromObject(object: {
        [k: string]: any;
      }): market.mass.CommitCartResponse;

      /**
       * Creates a plain object from a CommitCartResponse message. Also converts values to other types if specified.
       * @param message CommitCartResponse
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: market.mass.CommitCartResponse,
        options?: $protobuf.IConversionOptions,
      ): { [k: string]: any };

      /**
       * Converts this CommitCartResponse to JSON.
       * @returns JSON object
       */
      public toJSON(): { [k: string]: any };

      /**
       * Gets the default type url for CommitCartResponse
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
      event?: market.mass.IEvent | null;
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
      public event?: market.mass.IEvent | null;

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

    /** Properties of an EventPushRequest. */
    interface IEventPushRequest {
      /** EventPushRequest requestId */
      requestId?: Uint8Array | null;

      /** EventPushRequest events */
      events?: market.mass.IEvent[] | null;
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
      public events: market.mass.IEvent[];

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

    /** Properties of an Error. */
    interface IError {
      /** Error code */
      code?: string | null;

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
      public code: string;

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
  }
}
