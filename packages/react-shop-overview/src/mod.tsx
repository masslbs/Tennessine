import { abi } from "@massmarket/contracts";

import { createConfig, http, readContracts } from "@wagmi/core";
import { hardhat, mainnet, optimism, sepolia } from "wagmi/chains";
import type { Chain } from "wagmi/chains";

// peer dependencies
import styled from "styled-components";
import type { ReactNode } from "react";
import type { IStyledComponent } from "styled-components";

/* Dependencies (peer dependencies) needed by projects importing this module:

 styled-components@^6.1.19
 react@^16.3
 react-dom@^16.3

 See styled-components advice to library authors for why `styled-components` isn't imported in this module:
 https://styled-components.com/docs/faqs#i-am-a-library-author.-should-i-bundle-styled-components-with-my-library
*/

// NOTE: the main components are ShopCard and ShopOverviewRow. ShopsOverview is just intended as a demonstration of its
// use; it was used during development and left intact in case it would be illustrative.

/* use as (in a react project):
import { useEffect, useRef, useState } from "react";
import {
  featuredShopsContractCalls,
  selectChain,
  ShopCard,
  ShopOverviewRow,
  ShopsOverview,
} from "path-to-bundle/bundle.js";


function DisplayComponent() {
  const [displayShops, setDisplayShops] = useState([]);
  const hasBeenCalled = useRef(false);

  useEffect(() => {
    async function getShops() {
      const resolvedShops = await featuredShopsContractCalls(
        selectChain("hardhat"),
        3,
      );
      setDisplayShops(resolvedShops);
    }
    if (!hasBeenCalled.current) {
      hasBeenCalled.current = true;
      getShops();
    }
  }, []);

  return (
    <ShopsOverview
      ShopCard={ShopCard}
      ShopOverviewRow={ShopOverviewRow}
      shops={displayShops}
    />
    // <ConnectMerchant />;
  );
}
*/

type SimpleURL = `${"http" | "https"}://${string}`;
type ERC721ExtendedMetadata = {
  name: string;
  brief: string;
  description: string;
  image: SimpleURL;
  background: SimpleURL;
  shopID: bigint;
};

type ERC721Shop = ERC721ExtendedMetadata & {
  passedValidation: boolean;
};

type tokenByIndexSuccess = {
  result: object | bigint;
  status: "success";
};
type tokenByIndexFailure = {
  error: Error;
  result: undefined;
  status: "failure";
};
type tokenURISuccess = {
  status: "success";
  result: object | string;
};
type tokenURIFailure = {
  status: "failure";
  error: Error;
  result: undefined;
};

type ShopOverviewRowProps = {
  children: ReactNode[];
};
type ShopsOverviewProps = {
  ShopCard: IStyledComponent<"web", ERC721ExtendedMetadata>;
  ShopOverviewRow: IStyledComponent<"web", ShopOverviewRowProps>;
  shops: ERC721ExtendedMetadata[];
};

const backgroundPlaceholder =
  "https://images.unsplash.com/photo-1664735245999-840a7bf12d0e?q=80&w=1127&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

// @ts-ignore: tsc can't pick up the tagged template literal
export const ShopOverviewRow = styled.div`
  display: flex;
  flex-flow: row wrap;
  width: auto;
  gap: 0.5rem;
  padding: 0.5rem;
`;

// @ts-ignore: tsc can't pick up the tagged template literal
const ShopCardLinkWrapper = styled.a`
  color: #111827;
`;
/* TODO (2025-08-21): improve responsivity (alter width?) on smaller viewports? */
// @ts-ignore: tsc can't pick up the tagged template literal
const ShopCardContainer = styled.div`
  display: grid;
  grid-template-columns: 23.5rem;
  grid-row-gap: 0.25rem;
  border: 0.1rem solid #c8c8c8;
  border-radius: 0.5rem;
  cursor: pointer;
  &:hover {
    background: white;
    box-shadow: 0 0.25rem 0.25rem #aaa;
  }
  @media screen and (max-width: 768px) {}
`;
// @ts-ignore: tsc can't pick up the tagged template literal
const ShopBackground = styled.img`
`;
// @ts-ignore: tsc can't pick up the tagged template literal
const ShopProfileImage = styled.img`
  border-radius: 100%;
  width: 2.5rem;
  height: 2.5rem;
`;
// @ts-ignore: tsc can't pick up the tagged template literal
const ShopTitleLine = styled.div`
  display: flex;
  column-gap: 0.5rem;
  align-items: center;
  padding: 0.75rem 1.25rem 0.25rem 1.25rem;
  word-break: keep-all;
`;
// @ts-ignore: tsc can't pick up the tagged template literal
const ShopBrief = styled.p`
  padding: 0 1.25rem 1.25rem 1.25rem;
  font-size: 1.125rem;
  hyphens: auto;
  min-height: 7rem;
`;
// @ts-ignore: tsc can't pick up the tagged template literal
const ShopTitle = styled.span`
  font-weight: 500;
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

// the shop card's dimensions are based on the following constraints
//
// * description: textual, no length constrained defined as of 2025-08-11
// * brief: textual, length constrained to 120 characters
// * image: image, height [320, 1080], width [320, 1080]
// * background: image, height[168, 567] width [320, 1080]

export function ShopCard(
  { name, brief, description, shopID, image, background }:
    ERC721ExtendedMetadata,
) {
  return (
    <ShopCardLinkWrapper
      key={shopID.toString()}
      href={`https://shop.mass.market/listings?shopId=${shopID}`}
    >
      <ShopCardContainer key={shopID}>
        <ShopBackground
          src={background ||
            backgroundPlaceholder}
        />
        <ShopTitleLine>
          <ShopProfileImage src={image} />
          <ShopTitle>{name}</ShopTitle>
        </ShopTitleLine>
        <ShopBrief>{brief || description}</ShopBrief>
      </ShopCardContainer>
    </ShopCardLinkWrapper>
  );
}

function cmpByName(
  a: ERC721ExtendedMetadata,
  b: ERC721ExtendedMetadata,
): number {
  if (a.name > b.name) {
    return 1;
  } else if (a.name < b.name) {
    return -1;
  }
  return 0;
}

export function sortShops(
  incomingShops: ERC721ExtendedMetadata[],
): ERC721ExtendedMetadata[] {
  return incomingShops.sort(cmpByName);
}

const shopRegContract = {
  address: abi.shopRegAddress,
  abi: abi.shopRegAbi,
} as const;

/* featuredShopsContractCalls
 *
 * params:
 `chain`: chain information (hardhat, sepolia, mainnet, optimism)
 `N`: amount of IDs to query after
*/
export async function featuredShopsContractCalls(
  chain: Chain,
  N: number,
): Promise<ERC721ExtendedMetadata[]> {
  const wagmiConfig = createConfig({
    chains: [chain],
    transports: {
      [chain.id]: http(),
    },
  });

  // note: initially there may not be 3 published shops.
  // `indices` descends from the highest index (N-1) to 0
  const indices = Array.from(Array(N), (_, v: number) => v).reverse();
  const resultShopID: (tokenByIndexSuccess | tokenByIndexFailure)[] =
    // @ts-ignore: tsc complains about "Type instantiation is excessively deep and possibly infinite" but this is the intended signature
    await readContracts(wagmiConfig, {
      contracts: indices.map((i: number) => {
        return {
          ...shopRegContract,
          functionName: "tokenByIndex",
          args: [i],
        };
      }),
    });

  /* results objects may be returned with mixed success, e.g:
[{
    error: Error
    result: bigint | undefined,
    status: "success" | "failure",
},
  */
  // filter out contract call failures and convert the returned result into a list of shopIDs
  // NOTE: we filter out results where the shopID is set to 1n because that result is currently unknown where it
  // originates from
  const shopResults = new Map();
  function isTokenByIndexSuccess(
    obj: tokenByIndexSuccess | tokenByIndexFailure,
  ): obj is tokenByIndexSuccess {
    return obj.status === "success" && typeof obj.result === "bigint" &&
      obj.result !== 1n;
  }
  const shopIDs: bigint[] = resultShopID.filter(isTokenByIndexSuccess).map(
    (o: tokenByIndexSuccess): bigint => {
      if (o && typeof o.result === "bigint") {
        return o.result;
      }
      return -1n;
    },
  );
  shopIDs.forEach((shopID: bigint, queryIndex: number) => {
    const stringID = shopID.toString();
    const stringIDHex = shopID.toString(16);
    shopResults.set(stringID, {
      shopIDBigInt: stringID,
      shopID: `0x${stringIDHex}`,
      queryIndex,
      URI: "",
      JSON: {},
    });
  });

  // @ts-ignore: tsc complains about "Type instantiation is excessively deep and possibly infinite" but this is the intended signature
  const resultTokenURI = await readContracts(wagmiConfig, {
    contracts: shopIDs.map((shopID: bigint) => {
      return {
        ...shopRegContract,
        functionName: "tokenURI",
        args: [shopID],
      };
    }),
  });

  const promises = resultTokenURI.map(
    async (
      { status, result }: tokenURISuccess | tokenURIFailure,
      i: number,
    ) => {
      if (status === "success") {
        if (!shopIDs[i] || typeof shopIDs[i] !== "bigint") {
          return;
        }
        const stringID = shopIDs[i].toString();
        const val = shopResults.get(stringID);
        if (result === "" || typeof result === "object") {
          // console.log("shop overview tokenURI: empty return result");
          return;
        }
        val.URI = result;
        const response = await fetch(result);
        if (!response.ok) {
          // console.log("shop overview tokenURI: failed to fetch", result);
          return;
        }
        val.JSON = await response.json();
        shopResults.set(stringID, val);
      }
    },
  );

  // wait to resolve the JSON blobs
  await Promise.all(promises);

  const shopsArray = shopIDs.map(
    (_, i: number): ERC721Shop => {
      if (!shopIDs[i] || typeof shopIDs[i] !== "bigint") {
        return {
          passedValidation: false,
          shopID: -1n,
          name: "",
          brief: "",
          background: "http://example.com",
          image: "http://example.com",
          description: "",
        };
      }
      const stringID = shopIDs[i].toString();
      const val = shopResults.get(stringID);
      return {
        passedValidation: true,
        shopID: val.shopID,
        brief: val.JSON.description,
        background: false,
        ...val.JSON,
      };
    },
  );
  return shopsArray.filter((shop: ERC721Shop) => shop.passedValidation).map(
    (s: ERC721Shop): ERC721ExtendedMetadata => {
      return {
        name: s.name,
        brief: s.brief,
        description: s.description,
        image: s.image,
        background: s.background,
        shopID: s.shopID,
      } as ERC721ExtendedMetadata;
    },
  );
}

export function selectChain(chainName: string) {
  switch (chainName) {
    case "optimism":
      return optimism;
    case "mainnet":
      return mainnet;
    case "sepolia":
      return sepolia;
    case "hardhat":
      return hardhat;
    default:
      return hardhat;
  }
}

export function ShopsOverview(
  { ShopCard, ShopOverviewRow, shops }: ShopsOverviewProps,
) {
  return (
    <main>
      <h2>Featured shops</h2>
      <ShopOverviewRow>
        {sortShops(shops).map(ShopCard)}
      </ShopOverviewRow>
      <div>
        <a href="/">
          View more shops
        </a>
      </div>
    </main>
  );
}
