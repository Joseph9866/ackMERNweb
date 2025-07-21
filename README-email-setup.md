# Email Notification Setup Guide

This guide explains how to set up automated email notifications for new bookings at ACK Mt. Kenya Guest House.

## 📧 Email Service Setup

### Option 1: Resend (Recommended)

1. **Create Resend Account**
   - Go to [resend.com](https://resend.com)
   - Sign up for a free account
   - Verify your email address

2. **Get API Key**
   - Go to API Keys section
   - Create a new API key
   - Copy the key (starts with `re_`)

3. **Add Domain (Optional but Recommended)**
   - Go to Domains section
   - Add your domain (e.g., `ackguesthouse.com`)
   - Follow DNS verification steps
   - Use `bookings@yourdomain.com` as sender

### Option 2: SendGrid

1. **Create SendGrid Account**
   - Go to [sendgrid.com](https://sendgrid.com)
   - Sign up for free account
   - Complete email verification

2. **Get API Key**
   - Go to Settings > API Keys
   - Create new API key with "Full Access"
   - Copy the key

3. **Verify Sender Identity**
   - Go to Settings > Sender Authentication
   - Verify your email address or domain

## 🔧 Supabase Configuration

### 1. Deploy Edge Function

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-id

# Deploy the Edge Function
supabase functions deploy send-booking-notification
```

### 2. Set Environment Variables

In your Supabase dashboard:

1. Go to **Settings** > **Edge Functions**
2. Add these environment variables:

```env
RESEND_API_KEY=re_your_resend_api_key_here
ADMIN_EMAIL=manager@ackguesthouse.com
```

Or for SendGrid:
```env
SENDGRID_API_KEY=SG.your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=bookings@ackguesthouse.com
ADMIN_EMAIL=manager@ackguesthouse.com
```

### 3. Run Database Migration

Execute the SQL migration in your Supabase SQL Editor:

```sql
-- Copy and paste the content from:
-- supabase/migrations/create_booking_notification_trigger.sql
```

### 4. Enable HTTP Extension (Optional)

For direct trigger-based notifications, enable the HTTP extension:

```sql
-- Run this as a superuser (contact Supabase support if needed)
CREATE EXTENSION IF NOT EXISTS http;
```

## 🧪 Testing

### 1. Manual Test

Use the provided test script:

```bash
# Make the script executable
chmod +x test-booking-notification.sh

# Edit the script with your actual values
nano test-booking-notification.sh

# Run the test
./test-booking-notification.sh
```

### 2. Test via Booking Form

1. Go to your website's booking page
2. Fill out and submit a booking form
3. Check your admin email for the notification
4. Check Supabase logs for any errors

### 3. Monitor Notifications

Query the notification tracking table:

```sql
-- Check recent notifications
SELECT * FROM booking_notification_summary 
ORDER BY notification_created DESC 
LIMIT 10;

-- Check failed notifications
SELECT * FROM booking_notifications 
WHERE status = 'failed' 
ORDER BY created_at DESC;
```

## 📧 Email Template Customization

The email template includes:

- **Professional Design**: Responsive HTML with ACK branding
- **Complete Booking Details**: Guest info, room, dates, pricing
- **Quick Actions**: Direct links to call, email, or WhatsApp guest
- **Mobile Responsive**: Works on all devices
- **Urgent Styling**: Clear visual indicators for new bookings

To customize the template:

1. Edit the `emailHtml` variable in `send-booking-notification/index.ts`
2. Modify colors, layout, or content as needed
3. Redeploy the function: `supabase functions deploy send-booking-notification`

## 🔒 Security Best Practices

1. **Environment Variables**: Never commit API keys to version control
2. **CORS Headers**: Function includes proper CORS configuration
3. **Input Validation**: Payload is validated before processing
4. **Error Handling**: Graceful error handling prevents booking failures
5. **Rate Limiting**: Consider implementing rate limiting for production

## 🚨 Troubleshooting

### Common Issues

1. **Email Not Received**
   - Check spam/junk folder
   - Verify API key is correct
   - Check Supabase function logs
   - Verify admin email address

2. **Function Timeout**
   - Check network connectivity
   - Verify Supabase service status
   - Review function logs for errors

3. **Database Trigger Not Firing**
   - Verify trigger is created: `\d+ bookings` in SQL editor
   - Check if HTTP extension is enabled
   - Review notification tracking table

4. **API Key Issues**
   - Regenerate API key in email service
   - Update environment variables in Supabase
   - Redeploy function after changes

### Debug Commands

```sql
-- Check if trigger exists
SELECT * FROM information_schema.triggers 
WHERE trigger_name = 'booking_notification_trigger';

-- Check recent notifications
SELECT * FROM booking_notifications 
ORDER BY created_at DESC LIMIT 5;

-- Test trigger manually
INSERT INTO bookings (room_id, guest_name, guest_email, guest_phone, 
  check_in_date, check_out_date, total_amount) 
VALUES ('1', 'Test Guest', 'test@example.com', '+254712345678', 
  '2025-02-01', '2025-02-03', 7000);
```

## 📞 Support

If you need help with setup:

1. Check Supabase documentation
2. Review email service documentation (Resend/SendGrid)
3. Contact the development team
4. Check GitHub issues for common problems

## 🔄 Alternative Implementations

### Webhook-Based (Recommended for Production)

Instead of database triggers, you can use Supabase webhooks:

1. Go to **Database** > **Webhooks** in Supabase dashboard
2. Create webhook for `bookings` table `INSERT` events
3. Point to your Edge Function URL
4. This approach is more reliable and easier to debug

### Background Job Processing

For high-volume applications:

1. Store notifications in queue table
2. Process with background job (cron function)
3. Retry failed notifications
4. Better for handling email service outages

---

**🎉 Once set up, you'll receive instant email notifications for every new booking, helping you provide excellent customer service!**