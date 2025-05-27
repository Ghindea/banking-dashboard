#!/bin/bash

# Configurare date
URL="http://127.0.0.1:5000"
USERNAME="admin"
PASSWORD="1234"

# Date credit
LOAN_AMOUNT=250000
INTEREST_RATE=4.5
HOME_VALUE=300000
DOWNPAYMENT=50000
DURATION_YEARS=30
MONTHLY_HOA=100
ANNUAL_PROPERTY_TAX=1500
ANNUAL_HOME_INSURANCE=1200

# 1. Autentificare
echo "[INFO] Autentificare..."
TOKEN=$(curl -s -X POST "$URL/login" \
  -H "Content-Type: application/json" \
  -d "{\"username\": \"$USERNAME\", \"password\": \"$PASSWORD\"}" | jq -r '.access_token')

if [[ "$TOKEN" == "null" || -z "$TOKEN" ]]; then
  echo "[ERROR] Autentificare eșuată."
  exit 1
fi

echo "[INFO] Token obținut."

# 2. Cerere cu toți parametrii
echo "[INFO] Trimit cerere la /calculate-mortgage..."
curl -s -X POST "$URL/calculate-mortgage" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
        \"loan_amount\": $LOAN_AMOUNT,
        \"interest_rate\": $INTEREST_RATE,
        \"home_value\": $HOME_VALUE,
        \"downpayment\": $DOWNPAYMENT,
        \"duration_years\": $DURATION_YEARS,
        \"monthly_hoa\": $MONTHLY_HOA,
        \"annual_property_tax\": $ANNUAL_PROPERTY_TAX,
        \"annual_home_insurance\": $ANNUAL_HOME_INSURANCE
      }" | jq
