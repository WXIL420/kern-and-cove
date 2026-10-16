export interface CheckoutForm {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export type CheckoutErrors = Partial<Record<keyof CheckoutForm, string>>;

export const EMPTY_FORM: CheckoutForm = {
  email: "",
  phone: "",
  firstName: "",
  lastName: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "United States",
};

export const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","DC","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY",
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const ZIP_RE = /^\d{5}(-\d{4})?$/;

export function validateCheckout(f: CheckoutForm): CheckoutErrors {
  const e: CheckoutErrors = {};
  if (!f.email.trim()) e.email = "Enter your email address.";
  else if (!EMAIL_RE.test(f.email.trim())) e.email = "Enter a valid email address, like name@example.com.";

  if (f.phone.trim()) {
    const digits = f.phone.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 15 || /[^\d\s()+.-]/.test(f.phone)) {
      e.phone = "Enter a valid phone number, or leave this blank.";
    }
  }

  if (!f.firstName.trim()) e.firstName = "Enter your first name.";
  if (!f.lastName.trim()) e.lastName = "Enter your last name.";
  if (!f.address1.trim()) e.address1 = "Enter your street address.";
  else if (f.address1.trim().length < 5) e.address1 = "That street address looks too short.";
  if (!f.city.trim()) e.city = "Enter your city.";
  if (!f.state) e.state = "Choose your state.";
  if (!f.postalCode.trim()) e.postalCode = "Enter your ZIP code.";
  else if (!ZIP_RE.test(f.postalCode.trim())) e.postalCode = "Enter a 5-digit ZIP code, like 94110.";
  return e;
}
