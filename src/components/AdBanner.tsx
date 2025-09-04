"use client";

import { useEffect } from "react";

type AdBannerProps = {
  "data-ad-slot": string;
  "data-ad-format"?: string;
  "data-full-width-responsive"?: string;
};

export const AdBanner = (props: AdBannerProps) => {
  useEffect(() => {
    try {
      // @ts-expect-error
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch (err) {
      console.error(err);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID}
      data-ad-format="auto"
      data-full-width-responsive="true"
      {...props}
    ></ins>
  );
};
