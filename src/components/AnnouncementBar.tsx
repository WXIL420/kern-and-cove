import { FREE_SHIPPING_THRESHOLD } from "@/lib/shipping";
import { formatPrice } from "@/lib/format";

export function AnnouncementBar() {
  return (
    <div className="bg-olive text-paper">
      <p className="wrap py-2.5 text-center text-xs leading-5 tracking-wide">
        <span className="font-semibold">Free U.S. shipping over {formatPrice(FREE_SHIPPING_THRESHOLD)}</span>
        <span className="text-paper/70"> &nbsp;·&nbsp; Portfolio demonstration</span>
      </p>
    </div>
  );
}
