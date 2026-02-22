#!/bin/bash
# Stripe invoice operations
# Usage: ./stripe-invoice.sh create_invoice "cus_xxx" "Project deposit" 5000
# Usage: ./stripe-invoice.sh list_invoices "cus_xxx"
# Usage: ./stripe-invoice.sh send_invoice "in_xxx"

set -euo pipefail

ACTION="${1:?Usage: stripe-invoice.sh <action> [args...]}"
shift

case "$ACTION" in
  create_invoice)
    CUSTOMER="$1"
    DESC="$2"
    AMOUNT="$3"  # in cents
    # Create invoice item
    curl -s -X POST "https://api.stripe.com/v1/invoiceitems" \
      -u "${STRIPE_SECRET_KEY}:" \
      -d "customer=${CUSTOMER}" \
      -d "amount=${AMOUNT}" \
      -d "currency=usd" \
      -d "description=${DESC}"
    # Create and finalize invoice
    INVOICE=$(curl -s -X POST "https://api.stripe.com/v1/invoices" \
      -u "${STRIPE_SECRET_KEY}:" \
      -d "customer=${CUSTOMER}" \
      -d "auto_advance=true" | jq -r '.id')
    curl -s -X POST "https://api.stripe.com/v1/invoices/${INVOICE}/finalize" \
      -u "${STRIPE_SECRET_KEY}:"
    ;;
  list_invoices)
    CUSTOMER="${1:-}"
    if [ -n "$CUSTOMER" ]; then
      curl -s "https://api.stripe.com/v1/invoices?customer=${CUSTOMER}&limit=10" \
        -u "${STRIPE_SECRET_KEY}:"
    else
      curl -s "https://api.stripe.com/v1/invoices?limit=10" \
        -u "${STRIPE_SECRET_KEY}:"
    fi
    ;;
  send_invoice)
    INVOICE_ID="$1"
    curl -s -X POST "https://api.stripe.com/v1/invoices/${INVOICE_ID}/send" \
      -u "${STRIPE_SECRET_KEY}:"
    ;;
  *)
    echo "Unknown action: $ACTION"
    echo "Available: create_invoice, list_invoices, send_invoice"
    exit 1
    ;;
esac
