"use client";
import React, { Suspense, lazy } from "react";
import { TextHoverEffect } from "../components/UI/text-hover-effect";

const LazyTextFlippingBoard = lazy(() =>
  import("../../src/components/UI/UI_Page/text-flipping-board-demo")
);


export function VaultPage() {
  return (
    // The main container: Black background
    <div className="w-full">
      
      <div className="h-screen w-full flex items-center justify-center p-10 ">
        <TextHoverEffect text="VAULT" />
      </div>
      

      {/* <Suspense
        fallback={
          <div className="h-screen flex items-center justify-center text-white">
            Initializing board...
          </div>
        }
      >
        <LazyTextFlippingBoard />
      </Suspense> */}

    </div>
  );
}

export default VaultPage;