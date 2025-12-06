// Help Center FAQ Data
// All questions and answers for the Help Center page

export const helpCenterData = {
    forCustomers: [
        {
            id: "c1",
            question: "How do I place an order?",
            answer: "To place an order: 1) Browse products/services on the platform, 2) Click on a product to view details, 3) Click 'Add to Cart' or 'Book Now', 4) Go to your cart and click 'Checkout', 5) Enter delivery address, 6) Choose payment method and complete payment. You'll receive an order confirmation via email and in your dashboard.",
            links: [
                { text: "Browse Products", url: "/" },
                { text: "View My Orders", url: "/customer/dashboard" }
            ]
        },
        {
            id: "c2",
            question: "How do I track my order?",
            answer: "Track your order by: 1) Go to your Customer Dashboard, 2) Click on 'Orders' section, 3) Find your order in the list, 4) Click 'View Details' to see current status and tracking information. You'll see real-time updates on order preparation, shipping, and delivery.",
            links: [
                { text: "Go to Orders", url: "/customer/dashboard" }
            ]
        },
        {
            id: "c3",
            question: "What payment methods are accepted?",
            answer: "We accept multiple payment methods for your convenience: Credit/Debit Cards (Visa, Mastercard, RuPay), UPI (Google Pay, PhonePe, Paytm), Net Banking, and Wallets. All payments are processed securely through our payment gateway with 256-bit encryption.",
            links: []
        },
        {
            id: "c4",
            question: "How do I cancel or modify my order?",
            answer: "To cancel or modify an order: 1) Go to Customer Dashboard > Orders, 2) Find the order you want to cancel/modify, 3) Click on the order, 4) If the order hasn't been processed by the seller, you'll see 'Cancel Order' or 'Modify' options. Note: Orders in 'Preparing' or 'Shipped' status may not be cancellable. Contact the seller directly for assistance.",
            links: [
                { text: "My Orders", url: "/customer/dashboard" },
                { text: "Contact Support", url: "/contact" }
            ]
        },
        {
            id: "c5",
            question: "What is the return policy?",
            answer: "Return policy varies by seller and product category. Generally: 1) Products can be returned within 7 days of delivery, 2) Item must be unused and in original packaging, 3) Initiate return from Customer Dashboard > Orders > Return Item, 4) Seller will review and approve/reject return request, 5) Refund processed within 5-7 business days after return approval. Services typically cannot be returned once completed.",
            links: [
                { text: "Initiate Return", url: "/customer/dashboard" }
            ]
        },
        {
            id: "c6",
            question: "How do I contact a seller?",
            answer: "To contact a seller: 1) Go to the product/service page, 2) Click 'Message Seller', 3) Type your message in the chat window, 4) Seller will receive notification and respond. You can also access all your conversations from Customer Dashboard > Messages. Chat is encrypted for your privacy.",
            links: [
                { text: "My Messages", url: "/customer/dashboard" }
            ]
        },
        {
            id: "c7",
            question: "How do I update my profile information?",
            answer: "Update your profile by: 1) Go to Customer Dashboard, 2) Click 'Profile' tab, 3) Click 'Edit' button, 4) Update your name, email, phone, address, or profile picture, 5) Click 'Save Changes'. Your information is securely stored and used only for order fulfillment.",
            links: [
                { text: "Edit Profile", url: "/customer/dashboard" }
            ]
        },
        {
            id: "c8",
            question: "How do I add or change my delivery address?",
            answer: "Manage delivery addresses: 1) Go to Customer Dashboard > Profile, 2) Scroll to 'Address' section, 3) Click 'Edit' to modify existing address or add new one, 4) Use the map to pinpoint exact location, 5) Fill in complete address details, 6) Save. You can set a default address for faster checkout.",
            links: [
                { text: "Manage Addresses", url: "/customer/dashboard" }
            ]
        }
    ],

    forSellers: [
        {
            id: "s1",
            question: "How do I create a seller account?",
            answer: "Create your seller account: 1) Click 'Register' or 'Join Now', 2) Choose seller type (Product or Service), 3) Complete the onboarding steps: Personal Info, Business Details, Location, FSSAI (if food seller), 4) Choose subscription plan (Free, Basic, or Premium), 5) Submit for verification. Once approved, you can start listing products/services.",
            links: [
                { text: "Register as Seller", url: "/seller" },
                { text: "View Plans", url: "/seller/plans" }
            ]
        },
        {
            id: "s2",
            question: "How do I add products or services?",
            answer: "Add products/services: 1) Go to Seller Dashboard, 2) Click 'Products' or 'Services' tab, 3) Click 'Add New Product/Service', 4) Fill in details: name, description, price, category, images, 5) Set availability and delivery options, 6) Click 'Publish'. Your listing goes live immediately and appears in customer search results.",
            links: [
                { text: "Seller Dashboard", url: "/seller/dashboard" }
            ]
        },
        {
            id: "s3",
            question: "What are the fees and commissions?",
            answer: "Fees vary by subscription plan: FREE Plan (0/month): 15% commission per sale. BASIC Plan (₹99/month): 10% commission, up to 50 products. PREMIUM Plan (₹299/month): 5% commission, unlimited products, priority support, analytics. No hidden fees. Commission is automatically deducted from each transaction before payout.",
            links: [
                { text: "View Plans", url: "/seller/plans" },
                { text: "Upgrade Plan", url: "/seller/dashboard" }
            ]
        },
        {
            id: "s4",
            question: "How do I manage orders?",
            answer: "Manage orders from Seller Dashboard: 1) Go to 'Orders' section, 2) View all pending, processing, and completed orders, 3) Click on order to see details, 4) Update order status (Confirmed → Preparing → Ready → Delivered), 5) Communicate with customer via built-in chat, 6) Mark order as complete after delivery. Keep customers updated for better ratings.",
            links: [
                { text: "Manage Orders", url: "/seller/dashboard" }
            ]
        },
        {
            id: "s5",
            question: "How do I get paid?",
            answer: "Payment process: 1) Customer pays for order, 2) Amount is held in escrow, 3) Complete the order and mark as 'Delivered', 4) After customer confirms delivery (or 7-day auto-confirmation), 5) Funds released to your account within 2-3 business days. View earnings in Dashboard > Analytics. Set up bank details in Profile for payouts.",
            links: [
                { text: "View Analytics", url: "/seller/dashboard" },
                { text: "Payment Settings", url: "/seller/profile" }
            ]
        },
        {
            id: "s6",
            question: "How do I edit my shop details?",
            answer: "Edit shop details: 1) Go to Seller Dashboard, 2) Click 'Profile' in navigation, 3) View your business information, 4) Click 'Edit Profile' button, 5) Update shop name, description, business hours, contact details, address with map, 6) Upload shop logo, 7) Save changes. Updated info reflects immediately on your shop page.",
            links: [
                { text: "Edit Profile", url: "/seller/profile" }
            ]
        },
        {
            id: "s7",
            question: "How do I handle returns and refunds?",
            answer: "Handle returns: 1) Customer initiates return request from their dashboard, 2) You receive notification in Orders section, 3) Review return reason and images (if provided), 4) Accept or reject return with explanation, 5) If accepted, customer ships back product, 6) Verify received product condition, 7) Issue refund. Refund amount deducted from next payout.",
            links: [
                { text: "View Return Requests", url: "/seller/dashboard" }
            ]
        },
        {
            id: "s8",
            question: "How can I improve my shop visibility?",
            answer: "Boost visibility: 1) Upgrade to Premium plan for priority listing, 2) Add high-quality product images, 3) Write detailed descriptions with keywords, 4) Price competitively, 5) Respond quickly to messages, 6) Maintain high ratings (complete orders on time), 7) Offer promotions/discounts, 8) Keep inventory updated. Premium sellers get analytics to track performance.",
            links: [
                { text: "Upgrade to Premium", url: "/seller/plans" },
                { text: "View Analytics", url: "/seller/dashboard" }
            ]
        }
    ],

    commonTopics: {
        accountProfile: [
            {
                id: "ap1",
                question: "How do I create an account?",
                answer: "Creating an account is easy: 1) Click 'Login' for customers or 'Register' for sellers, 2) Enter your phone number and create a password, 3) Fill in basic information (name, email), 4) Verify your phone number, 5) Complete your profile. For sellers, additional business information and verification is required.",
                links: [
                    { text: "Customer Login", url: "/customer" },
                    { text: "Seller Registration", url: "/seller" }
                ]
            },
            {
                id: "ap2",
                question: "How do I reset my password?",
                answer: "Reset password: 1) Go to login page, 2) Click 'Forgot Password?', 3) Enter registered phone number or email, 4) Receive OTP/reset link, 5) Verify OTP or click link, 6) Enter new password, 7) Confirm password. For security, use a strong password with letters, numbers, and symbols.",
                links: [
                    { text: "Customer Login", url: "/customer" },
                    { text: "Seller Login", url: "/seller" }
                ]
            },
            {
                id: "ap3",
                question: "How do I update my profile picture?",
                answer: "Update profile picture: 1) Go to your Dashboard, 2) Navigate to Profile section, 3) Click 'Edit' or 'Edit Profile', 4) Click on profile picture area or 'Upload Photo', 5) Select image from device (max 5MB, JPG/PNG), 6) Crop if needed, 7) Save. Profile picture appears on your account and in messages.",
                links: []
            },
            {
                id: "ap4",
                question: "How do I delete my account?",
                answer: "Delete account: 1) Go to Dashboard > Profile, 2) Scroll to 'Danger Zone' section, 3) Click 'Delete Account', 4) Read warning carefully - this action is permanent, 5) Click 'Yes, Delete My Account', 6) Confirm deletion. All your data (orders, products, messages, analytics) will be permanently deleted and cannot be recovered.",
                links: [
                    { text: "Help & Support", url: "/contact" }
                ]
            }
        ],

        ordersPayments: [
            {
                id: "op1",
                question: "Are my payments secure?",
                answer: "Yes, absolutely secure. We use industry-standard security: 1) 256-bit SSL encryption for all transactions, 2) Payment gateway certified by PCI-DSS, 3) No card details stored on our servers, 4) Two-factor authentication for accounts, 5) Escrow system for seller payments. Your financial information is protected at all times.",
                links: []
            },
            {
                id: "op2",
                question: "How long does refund take?",
                answer: "Refund timeline: 1) Seller approves return/refund request (1-2 days), 2) Refund initiated (immediately), 3) Amount credited to original payment method: Cards (5-7 business days), UPI/Wallets (1-3 business days), Net Banking (3-5 business days). You'll receive email notification when refund is processed.",
                links: [
                    { text: "Track Refund Status", url: "/customer/dashboard" }
                ]
            },
            {
                id: "op3",
                question: "Can I get an invoice or receipt?",
                answer: "Yes, download invoice/receipt: 1) Go to Dashboard > Orders, 2) Click on completed order, 3) Click 'Download Invoice', 4) PDF will download with complete breakdown (items, prices, taxes, seller details). For sellers, access customer invoices from order details to help with accounting.",
                links: [
                    { text: "My Orders", url: "/customer/dashboard" }
                ]
            },
            {
                id: "op4",
                question: "What if payment failed but money was deducted?",
                answer: "If payment failed but amount deducted: 1) Don't retry payment immediately, 2) Wait 24 hours - amount usually auto-refunds if order wasn't created, 3) Check your bank/UPI app for transaction status, 4) If still not refunded after 48 hours, contact us at support with: transaction ID, amount, date/time, payment method. We'll investigate with payment gateway and resolve within 3-5 business days.",
                links: [
                    { text: "Contact Support", url: "/contact" }
                ]
            }
        ],

        technicalSupport: [
            {
                id: "ts1",
                question: "The app/website is not working properly",
                answer: "Troubleshoot issues: 1) Clear browser cache and cookies, 2) Try different browser (Chrome, Firefox, Safari), 3) Check internet connection, 4) Disable browser extensions, 5) Update to latest browser version, 6) Try incognito/private mode. For mobile: Update app to latest version, clear app cache, restart device. If problem persists, contact support with error message screenshot.",
                links: [
                    { text: "Contact Support", url: "/contact" }
                ]
            },
            {
                id: "ts2",
                question: "I can't log in to my account",
                answer: "Login troubleshooting: 1) Verify you're using correct phone number/email, 2) Check if password is correct (case-sensitive), 3) Clear browser cache, 4) Try 'Forgot Password' to reset, 5) Ensure account hasn't been deleted, 6) Check if you're using customer login for customer account (and seller login for seller). Still stuck? Contact support.",
                links: [
                    { text: "Reset Password", url: "/customer" },
                    { text: "Contact Support", url: "/contact" }
                ]
            },
            {
                id: "ts3",
                question: "Images are not uploading",
                answer: "Image upload issues: 1) Check file size (max 5MB per image), 2) Verify file format (JPG, PNG, WebP only), 3) Check internet connection speed, 4) Try compressing image using online tools, 5) Try different browser, 6) Disable ad-blockers temporarily. For sellers uploading multiple product images, upload one at a time if batch upload fails.",
                links: []
            },
            {
                id: "ts4",
                question: "How do I report a bug or issue?",
                answer: "Report bugs: 1) Go to Contact Us page, 2) Choose 'Technical Support' as subject, 3) Describe issue in detail: what you were doing, what happened, error message, 4) Attach screenshot if helpful, 5) Include: browser/device, operating system, account type. We investigate all reports and fix critical bugs within 48 hours. You'll receive update via email.",
                links: [
                    { text: "Report Bug", url: "/contact" }
                ]
            }
        ]
    }
};
