"use client";

import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";

type FavoriteAddressButtonProps = {
  address: string;
};

export function FavoriteAddressButton({ address }: FavoriteAddressButtonProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const favorited = useQuery(
    api.favorites.isFavorited,
    isAuthenticated ? { address } : "skip",
  );
  const toggle = useMutation(api.favorites.toggle);
  const [pending, setPending] = useState(false);

  const isFavorited = favorited === true;
  const loginHref = `/login?next=${encodeURIComponent(`/address/${address}`)}`;

  async function handleClick() {
    if (authLoading) {
      return;
    }
    if (!isAuthenticated) {
      router.push(loginHref);
      return;
    }
    if (pending) {
      return;
    }
    setPending(true);
    try {
      await toggle({ address });
    } finally {
      setPending(false);
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      onClick={() => {
        void handleClick();
      }}
      disabled={pending || (isAuthenticated && favorited === undefined)}
      aria-label={
        isFavorited ? "Remove from favorites" : "Add to favorites"
      }
      aria-pressed={isFavorited}
      title={isFavorited ? "Remove favorite" : "Favorite"}
    >
      <Star
        className={cn(
          isFavorited &&
            "fill-[var(--brand-cyan)] text-[var(--brand-cyan)]",
        )}
      />
    </Button>
  );
}
