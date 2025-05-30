import React from "react";
import { IPaginationStore } from "../util/stores/abstract.store";

export const useScroll = (store: IPaginationStore, threshold: number = 250): React.RefObject<HTMLDivElement | null> => {
    const containerRef: React.RefObject<HTMLDivElement | null> = React.useRef<HTMLDivElement | null>(null);

    const handleScroll = (): void => {
      const container: HTMLDivElement | null = containerRef.current;
      if (container === null){
        return;
      }

      const scrollBottom: number = container.scrollTop + container.clientHeight;
      const scrollHeight: number = container.scrollHeight;

      if (scrollBottom + threshold >= scrollHeight) {
        store.loadNext();
      }
    };

    React.useEffect(() => {
        const container: HTMLDivElement | null = containerRef.current;
        if (container !== null) {
          container.addEventListener("scroll", handleScroll);
        }
    
        return () => {
          if (container !== null) {
            container.removeEventListener("scroll", handleScroll);
          }
        };
      });

      return containerRef
}