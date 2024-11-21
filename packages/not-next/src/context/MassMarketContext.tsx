import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useWalletClient } from "wagmi";

import { logger } from "@massmarket/utils";
import * as abi from "@massmarket/contracts";

import { isMerchantPath } from "@/app/utils";
import { useClient } from "@/context/AuthContext";
import { Status } from "@/types";
import useShopId from "../hooks/useShopId";
import useRelayEndpoint from "../hooks/useRelayEndpoint";
import useClientWithStateManager from "../hooks/useClientWithStateManager";
import { useRouter } from "@tanstack/react-router";

export const MassMarketContext = createContext({});

const namespace = "frontend: massMarketContext";
const debug = logger(namespace);

export function MassMarketContextProvider(
  props: React.HTMLAttributes<HTMLDivElement>,
) {
  const router = useRouter();
  const pathname = router.state.location.pathname;

  const { data: _wallet, status: walletStatus } = useWalletClient();
  const { setIsConnected, setIsMerchantView, clientConnected } = useClient();

  const [merchantKC, setmerchantKC] = useState<`0x${string}` | null>(null);
  const [guestCheckoutKC, setGuestKC] = useState<`0x${string}` | null>(null);
  const [walletAddress, setWalletAddress] = useState<`0x${string}` | null>(
    null,
  );

  const { shopId, setShopId } = useShopId();
  const { relayEndpoint } = useRelayEndpoint();
  const { clientStateManager, setClientStateManager } =
    useClientWithStateManager();
  const authenticated = useRef(false);
  const merchantPath = isMerchantPath(pathname);

  useEffect(() => {
    if (merchantPath) {
      localStorage.removeItem("merchantKC");
      localStorage.removeItem("guestCheckoutKC");
    }

    //Load cached keycards
    const mKC = localStorage.getItem("merchantKC") as `0x${string}`;
    const gKC = localStorage.getItem("guestCheckoutKC") as `0x${string}`;
    if (mKC) {
      setmerchantKC(mKC);
    } else if (gKC) {
      setGuestKC(gKC);
    }
  }, []);

  useEffect(() => {
    if (_wallet && walletStatus == "success") {
      setWalletAddress(_wallet.account.address);
    }
  }, [walletStatus]);

  function checkPermissions() {
    return abi.useReadShopRegHasPermission({
      args: [shopId, walletAddress!, abi.permissions.updateRootHash],
    });
  }

  useEffect(() => {
    if (
      !shopId ||
      !relayEndpoint ||
      //If it's the connect merchant page we return, because this useEffect will rerun after setShopId is called in that component and reset the ClientWithStateManager, which we don't want.
      pathname === "/merchants/connect/" ||
      clientConnected !== Status.Pending ||
      authenticated.current
    ) {
      return;
    }
    const csm = useClientWithStateManager();
    debug("ClientWithStateManager set");
    if (merchantPath) return;
    (async () => {
      //If merchantKC is cached, double check that the KC has permission, then connect & authenticate.
      if (merchantKC && walletAddress) {
        debug("Connecting with merchant keycard");
        await csm.setClientAndConnect(merchantKC);
        const hasAccess = checkPermissions();
        if (hasAccess) {
          setIsMerchantView(true);
          await csm.sendMerchantSubscriptionRequest();
          setIsConnected(Status.Complete);
        }
      } else if (!merchantKC && !guestCheckoutKC) {
        //If no keycards are cached, create relayClient with guest wallet, then connect without enrolling a kc or authenticating.
        await csm.sendGuestSubscriptionRequest();
        debug("connected without keycard");
        setIsConnected(Status.Complete);
      } else if (guestCheckoutKC) {
        authenticated.current = true;

        //If guestCheckout keycard is cached, connect, authenticate, and subscribe to orders.
        await csm.setClientAndConnect(guestCheckoutKC);
        await csm.sendGuestCheckoutSubscriptionRequest();
        debug(`connected with guest checkout keycard ${guestCheckoutKC}`);
        setIsConnected(Status.Complete);
      }
    })();
  }, [relayEndpoint, walletAddress, shopId, merchantKC, guestCheckoutKC]);

  const value = {
    shopId,
    setShopId,
    clientStateManager,
    setClientStateManager,
  };

  return (
    <MassMarketContext.Provider value={value}>
      {props.children}
    </MassMarketContext.Provider>
  );
}

export const massMarketContext = () => useContext(MassMarketContext);
