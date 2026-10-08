// Fournie : transforme 220 en "2,20 €". Tu n'as pas à la modifier.
export function formatPrice(cents) {
  return (cents / 100).toFixed(2).replace(".", ",") + " €";
}