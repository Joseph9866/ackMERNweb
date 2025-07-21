#!/bin/bash

# Test script for booking notification Edge Function
# Make sure to replace the URL and API key with your actual values

# Configuration
SUPABASE_URL="https://your-project-id.supabase.co"
SUPABASE_ANON_KEY="your-anon-key-here"
EDGE_FUNCTION_URL="${SUPABASE_URL}/functions/v1/send-booking-notification"

# Test payload - simulates a booking webhook
TEST_PAYLOAD='{
  "type": "INSERT",
  "table": "bookings",
  "record": {
    "id": "test-booking-'$(date +%s)'",
    "room_id": "1",
    "guest_name": "John Doe",
    "guest_email": "john.doe@example.com",
    "guest_phone": "+254712345678",
    "check_in_date": "2025-02-01",
    "check_out_date": "2025-02-03",
    "number_of_guests": 2,
    "special_requests": "Late check-in requested",
    "total_amount": 7000,
    "status": "pending",
    "created_at": "'$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)'"
  }
}'

echo "🧪 Testing Booking Notification Edge Function"
echo "URL: $EDGE_FUNCTION_URL"
echo "Payload: $TEST_PAYLOAD"
echo ""

# Make the request
response=$(curl -s -w "\nHTTP_STATUS:%{http_code}\n" \
  -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -d "$TEST_PAYLOAD" \
  "$EDGE_FUNCTION_URL")

# Extract response body and status code
response_body=$(echo "$response" | sed '$d')
http_status=$(echo "$response" | tail -n1 | sed 's/HTTP_STATUS://')

echo "📤 Response Status: $http_status"
echo "📄 Response Body:"
echo "$response_body" | jq '.' 2>/dev/null || echo "$response_body"

# Check if successful
if [ "$http_status" -eq 200 ]; then
    echo ""
    echo "✅ Test successful! Check your admin email for the notification."
else
    echo ""
    echo "❌ Test failed with status $http_status"
fi

echo ""
echo "🔍 To debug further, check the Supabase Edge Function logs in your dashboard."