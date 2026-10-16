import { FREE_SHIPPING_THRESHOLD } from "@/lib/shipping";
import { formatPrice } from "@/lib/format";

export function AnnouncementBar() {
  return (
    <div className="bg-olive text-paper">
      <p className="wrap py-2.5 text-center text-xs leading-5 tracking-wide">
        <span className="font-semibold">
          Free U.S. shipping on orders over {formatPrice(FREE_SHIPPING_THRESHOLD)}
        </span>
        <span className="hidden text-paper/70 sm:inline">
          {" "}
          &nbsp;·&nbsp; Portfolio demonstration — nothing here is for sale
        </span>
      </p>
    </div>
  );
}
