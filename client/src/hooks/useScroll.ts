import React from "react";
import { IInfiniteScrollStore } from "../util/stores/abstract.store";

/**
 * A Reusable hook that enables auto fetching when reaching to the buttom of a scroller
 * @param store The store object we would like to update any store that implements IInfiniteScrollStore interface is valid
 * @param threshold The distance in pixels from the buttom of a scroller UI element in which an api request is triggered   
 */

export const useScroll = (store: IInfiniteScrollStore, threshold: number = 250): React.RefObject<HTMLDivElement | null> => {
    const containerRef: React.RefObject<HTMLDivElement | null> = React.useRef<HTMLDivElement | null>(null);

    const handleScroll = (): void => {
      const container: HTMLDivElement | null = containerRef.current;
      if (container === null){
        return;
      }

      const scrollBottom: number = container.scrollTop + container.clientHeight;
      const scrollHeight: number = container.scrollHeight;

      //When we reach a distance of threshold px from the buttom the loadNext method is triggered
      if (scrollBottom + threshold >= scrollHeight) {
        store.loadNext();
      }
    };

    React.useEffect(() => {
        const container: HTMLDivElement | null = containerRef.current;
        if (container !== null) {
          container.addEventListener("scroll", handleScroll);
        }
        
        //cleaning the event from the DOM
        return () => {
          if (container !== null) {
            container.removeEventListener("scroll", handleScroll);
          }
        };
      });

      return containerRef
}