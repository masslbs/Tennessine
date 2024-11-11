// deno-lint-ignore-file
import { useEffect } from "react";
// setup matomo
export default function Matomo() {
  const matomoUrl = process.env.NEXT_PUBLIC_MATOMO_URL || null;
  useEffect(() => {
    if (matomoUrl) {
      const _mtm = (globalThis._mtm = globalThis._mtm || []);
      _mtm.push({ "mtm.startTime": new Date().getTime(), event: "mtm.Start" });
      var d = document,
        g = d.createElement("script"),
        s = d.getElementsByTagName("script")[0];
      g.async = true;
      g.src = matomoUrl;
      s.parentNode.insertBefore(g, s);
    }
  }, [matomoUrl]);
}
