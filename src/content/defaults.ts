import type { SiteContent } from './types';

// The site's built-in content. Anything saved from /admin is layered on top of
// this, so new fields added here show up automatically on existing sites.
export const defaultContent: SiteContent = {
  business: {
    name: 'Signage Crafting',
    logoText: 'SC',
    logoImage: '/logo-mark-dark.png',
    logoImageLight: '/logo-mark-light.png',
    phone: '+1 (209) 340-4633',
    email: 'info@signagecrafting.com',
    hours: 'Mon-Fri 8AM-6PM',
    street: '1310 Auto Center Dr Unit C',
    city: 'Lodi',
    state: 'CA',
    postalCode: '95240',
    country: 'USA',
    social: { instagram: '', facebook: '', linkedin: '' },
  },

  header: {
    navLinks: [
      { label: 'Home', path: '/' },
      { label: 'Sign Types', path: '/sign-types' },
      { label: 'About', path: '/about' },
      { label: 'Get a Quote', path: '/quote' },
      { label: 'Contact', path: '/contact' },
    ],
    ctaLabel: 'Get a Quote',
    ctaPath: '/quote',
    showPhone: true,
  },

  footer: {
    description: 'Premium custom signs crafted with precision. From neon to metal, we bring your brand to life. 15+ years, 10,000+ signs, 3,500+ happy clients.',
    quickLinksTitle: 'QUICK LINKS',
    quickLinks: [
      { label: 'Home', path: '/' },
      { label: 'About Us', path: '/about' },
      { label: 'Sign Types', path: '/sign-types' },
      { label: 'Get a Quote', path: '/quote' },
      { label: 'Contact', path: '/contact' },
    ],
    legalTitle: 'LEGAL',
    legalLinks: [
      { label: 'Privacy Policy', path: '/privacy' },
      { label: 'Terms of Service', path: '/terms' },
      { label: 'Refund Policy', path: '/refund' },
      { label: 'Shipping Policy', path: '/shipping' },
    ],
    contactTitle: 'CONTACT',
    copyright: '© {year} Signage Crafting. All rights reserved.',
    bottomLinks: [
      { label: 'Privacy', path: '/privacy' },
      { label: 'Terms', path: '/terms' },
    ],
  },

  home: {
    hero: {
      badge: '',
      headline: 'HIGH-QUALITY, CUSTOM SIGNS FOR YOUR',
      headlineHighlight: 'BUSINESS',
      description: 'Premium custom signs crafted with precision. From neon to metal, we bring your brand to life with stunning signage that attracts customers.',
      features: ['Free digital mockup in 2 hours', 'Premium materials & craftsmanship', 'Free worldwide shipping'],
      ctaLabel: 'GET A FREE QUOTE',
      trustLabel: 'Every order includes:',
      trustPoints: ['1-Year Warranty', 'Free Digital Mockup', 'Nationwide Delivery', 'No-Obligation Quote'],
      cubeImages: ['/neon-sign-01.jpg', '/channel-letters-01.jpg', '/portfolio-01.jpg', '/blade-sign-01.jpg', '/metal-sign-01.jpg', '/monument-sign-01.jpg'],
    },
    stats: [
      { value: '15+', label: 'Years Experience' },
      { value: '10,000+', label: 'Signs Crafted' },
      { value: '3,500+', label: 'Happy Clients' },
      { value: '1-Year', label: 'Warranty' },
      { value: '100%', label: 'Satisfaction' },
      { value: '24/7', label: 'Support' },
    ],
    collection: {
      label: 'Our Collection',
      title: 'PREMIUM SIGN TYPES',
      subtitle: 'Explore our wide range of custom sign solutions designed to make your business stand out.',
      detailsLabel: 'View Details',
      buttonLabel: 'VIEW ALL SIGN TYPES',
    },
    process: {
      label: 'Simple Process',
      title: 'HOW IT WORKS',
      subtitle: 'From concept to your doorstep in four simple steps.',
      steps: [
        { title: 'Request a Quote', desc: 'Fill out our quick form with your project details. We respond with a detailed quote within 2 hours.' },
        { title: 'Design & Approve', desc: 'Our designers create a digital mockup of your sign. Review, request revisions, and approve when perfect.' },
        { title: 'Production', desc: 'We craft your sign using premium materials and state-of-the-art manufacturing. Quality checked at every step.' },
        { title: 'Delivery', desc: 'Your sign is carefully packaged and shipped to your door with tracking, ready for your local installer. Ready to shine!' },
      ],
    },
    why: {
      label: 'Why Us',
      title: 'WHY CHOOSE SIGNAGE CRAFTING',
      subtitle: 'We combine craftsmanship, technology, and customer service to deliver the best signs in the industry.',
      items: [
        { icon: 'Quality', title: 'Premium Materials', desc: 'We use only the highest-grade LEDs, acrylics, metals, and weatherproof components. Every sign is built to last.' },
        { icon: 'Speed', title: 'Fast Turnaround', desc: 'Most orders are manufactured and delivered within 13-17 working days of design approval. Rush orders available on request.' },
        { icon: 'Support', title: 'Expert Support', desc: 'Our team of designers and engineers guide you through every step, from concept to delivery.' },
        { icon: 'Warranty', title: '1-Year Warranty', desc: 'Every custom sign comes with a 1-year limited warranty covering LED modules, power supplies, wiring and manufacturing defects.' },
      ],
    },
    portfolio: {
      label: 'Portfolio',
      title: 'OUR WORK',
      subtitle: 'Real signs for real businesses. Browse our latest projects.',
      hoverLabel: 'View Project',
      images: ['/neon-sign-02.jpg', '/case-neon-01.jpg', '/case-signboard-01.jpg', '/portfolio-02.jpg', '/metal-sign-01.jpg', '/specialty-sign-01.jpg'],
    },
    testimonials: {
      label: 'Testimonials',
      title: 'WHAT OUR CLIENTS SAY',
      subtitle: "Don't just take our word for it. Here's what business owners say about working with us.",
      items: [
        { name: 'Sarah Mitchell', role: 'Owner, Brew & Bloom Cafe', rating: 5, text: 'Signage Crafting transformed our storefront. The neon sign they designed perfectly captures our brand. Sales increased 30% in the first month!' },
        { name: 'James Rodriguez', role: 'Manager, Apex Fitness', rating: 5, text: 'Professional from start to finish. The channel letters look incredible on our building. The whole process was seamless and the team was fantastic.' },
        { name: 'Emily Chen', role: 'Director, Lumiere Boutique', rating: 5, text: 'I shopped around for months. Signage Crafting offered the best quality at the best price. Our lightbox sign is absolutely stunning.' },
        { name: 'Michael Torres', role: 'Owner, El Sabor Restaurant', rating: 5, text: 'They nailed the design on the first mockup. The metal sign with LED backlighting gives our restaurant such a premium feel. Highly recommend!' },
      ],
    },
    cta: {
      title: 'READY TO MAKE YOUR MARK?',
      text: 'Get a free quote and digital mockup for your custom sign today. No obligation, fast turnaround.',
      buttonLabel: 'GET A FREE QUOTE',
    },
  },

  signTypesPage: {
    label: 'Sign Types',
    title: 'OUR SIGN COLLECTION',
    subtitle: 'Browse our complete range of custom sign solutions. Click any category to filter.',
    allLabel: 'All',
    quoteButtonLabel: 'GET A QUOTE',
    pricePrefix: 'From',
    ctaTitle: 'Not Sure Which Sign is Right for You?',
    ctaText: 'Our experts can help you choose the perfect sign for your business, budget, and location.',
    ctaButtonLabel: 'GET FREE CONSULTATION',
  },

  signTypes: [
    {
      id: 'neon',
      name: 'Neon Signs',
      category: 'Neon',
      tag: 'Most Popular',
      designs: '450+ Designs',
      startingPrice: '$299',
      shortDescription: 'Eye-catching LED neon signs with vibrant colors and custom shapes. Perfect for storefronts, bars, and modern interiors.',
      description: 'Our LED neon signs combine the classic look of traditional neon with modern energy-efficient technology. Perfect for bars, restaurants, retail stores, and home decor. Available in any color, shape, or font.',
      features: ['LED neon technology', 'Custom shapes & fonts', 'Indoor & outdoor rated', 'Energy efficient', '1-year warranty'],
      images: ['/neon-sign-01.jpg', '/neon-sign-02.jpg', '/neon-sign-03.jpg'],
      showOnHome: true,
      seoTitle: 'Custom LED Neon Signs for Business | Signage Crafting',
      seoDescription: 'Custom LED neon signs in any color, font or logo. Energy-efficient, indoor & outdoor rated, 1-year warranty. Free mockup in 2 hours. From $299.',
    },
    {
      id: 'light-box',
      name: 'Light Box Signs',
      category: 'Light Box',
      tag: 'Bestseller',
      designs: '320+ Designs',
      startingPrice: '$450',
      shortDescription: 'Illuminated cabinet signs with even, bright lighting. Great for retail stores, restaurants, and professional offices.',
      description: 'Light box signs provide bright, even illumination that makes your brand visible day and night. Ideal for storefronts, shopping centers, and any business that needs to stand out after dark.',
      features: ['Even illumination', 'Weatherproof', 'Custom graphics', 'Face-lit or backlit', '1-year warranty'],
      images: ['/portfolio-01.jpg', '/case-neon-01.jpg', '/case-signboard-02.jpg'],
      showOnHome: true,
      seoTitle: 'Custom Light Box Signs for Storefronts | Signage Crafting',
      seoDescription: 'Bright, evenly lit light box signs for storefronts, restaurants and plazas. Weatherproof, face-lit or backlit. Free quote and mockup. From $450.',
    },
    {
      id: 'channel-letters',
      name: '3D Channel Letters',
      category: '3D Letters',
      tag: 'Premium',
      designs: '280+ Designs',
      startingPrice: '$599',
      shortDescription: 'Individual dimensional letters with LED illumination. The gold standard for corporate branding and retail visibility.',
      description: 'Channel letters are the industry standard for professional business signage. Each letter is individually crafted and illuminated, creating a bold, dimensional look that commands attention.',
      features: ['Individual letters', 'Face-lit or halo-lit', 'Metal or acrylic', 'Flush or raceway mount', 'Premium look'],
      images: ['/channel-letters-01.jpg', '/case-signboard-01.jpg', '/portfolio-02.jpg'],
      showOnHome: true,
      seoTitle: 'Channel Letter Signs – Custom 3D Letters | Signage Crafting',
      seoDescription: 'Custom channel letter signs with LED illumination: face-lit, halo-lit, flush or raceway mount. Free design mockup in 2 hours. From $599.',
    },
    {
      id: 'blade',
      name: 'Blade Signs',
      category: 'Blade',
      tag: 'Classic',
      designs: '150+ Designs',
      startingPrice: '$399',
      shortDescription: 'Projecting signs mounted perpendicular to the building. Ideal for pedestrian-heavy streets and shopping districts.',
      description: 'Blade signs project perpendicular to your building, making them visible to pedestrians from both directions. A timeless choice for downtown shops, restaurants, and historic districts.',
      features: ['Double-sided display', 'Projecting mount', 'Classic & modern styles', 'Illuminated options', 'ADA compliant'],
      images: ['/blade-sign-01.jpg', '/hero-main.jpg', '/portfolio-hero.jpg'],
      showOnHome: true,
      seoTitle: 'Custom Blade Signs & Projecting Signs | Signage Crafting',
      seoDescription: 'Double-sided blade signs that project from your building and catch foot traffic from both directions. Illuminated options. From $399.',
    },
    {
      id: 'metal',
      name: 'Metal Signs',
      category: 'Metal',
      tag: 'Durable',
      designs: '200+ Designs',
      startingPrice: '$349',
      shortDescription: 'Brushed aluminum, stainless steel, and brass signs. Sleek, professional, and built to last for decades.',
      description: 'Metal signs offer unmatched durability and a premium aesthetic. Choose from brushed aluminum, stainless steel, brass, or copper. Perfect for professional offices, luxury brands, and outdoor applications.',
      features: ['Brushed aluminum', 'Stainless steel', 'Brass & copper', 'Etched or engraved', 'Lifetime durability'],
      images: ['/metal-sign-01.jpg', '/case-logistics-02.jpg', '/about-hero.jpg'],
      showOnHome: true,
      seoTitle: 'Custom Metal Signs for Business | Signage Crafting',
      seoDescription: 'Custom metal signs in brushed aluminum, stainless steel, brass and copper. Etched or engraved, built to last. Free quote & mockup. From $349.',
    },
    {
      id: 'monument',
      name: 'Monument Signs',
      category: 'Monument',
      tag: 'Outdoor',
      designs: '120+ Designs',
      startingPrice: '$1,200',
      shortDescription: 'Free-standing ground signs for businesses, shopping centers, and residential communities. Bold visibility from the road.',
      description: 'Monument signs make a bold statement at the entrance to your property. Built to withstand the elements and designed to match your architecture, these signs establish a strong professional presence.',
      features: ['Free-standing', 'Stone, metal, or acrylic', 'LED illuminated', 'Changeable panels', 'Weather resistant'],
      images: ['/monument-sign-01.jpg', '/case-signboard-03.jpg', '/case-logistics-01.jpg'],
      showOnHome: true,
      seoTitle: 'Custom Monument Signs for Business | Signage Crafting',
      seoDescription: 'Freestanding monument signs in stone, metal or acrylic with LED lighting for business entrances and properties. Free quote. From $1,200.',
    },
    {
      id: 'specialty',
      name: 'Specialty & Custom Signs',
      category: 'Specialty',
      tag: 'Custom',
      designs: 'Unlimited',
      startingPrice: 'Custom',
      shortDescription: 'Unique signage in any shape, size or material, from architectural installations to one-of-a-kind artistic pieces.',
      description: 'Have a unique vision? Our specialty sign team can bring any concept to life. From architectural signage to artistic installations, we handle projects that push the boundaries of conventional signage.',
      features: ['Any shape or size', 'Mixed materials', 'Interactive elements', 'Artistic designs', 'Fully custom'],
      images: ['/specialty-sign-01.jpg', '/case-neon-03.jpg', '/case-neon-02.jpg'],
      showOnHome: false,
      seoTitle: 'Custom Acrylic & Specialty Signs | Signage Crafting',
      seoDescription: 'One-of-a-kind acrylic, wood and mixed-material signs in any shape or size, from lobby logos to art installations. Free quote and mockup.',
    },
  ],

  about: {
    label: 'About Us',
    title: 'CRAFTING SIGNS\nTHAT',
    titleHighlight: 'STAND OUT',
    subtitle: 'For over 15 years, Signage Crafting has been the trusted partner for businesses seeking premium custom signage solutions.',
    image: '/about-workshop.jpg',
    storyTitle: 'OUR STORY',
    story: "Signage Crafting was founded with a simple mission: to create signs that don't just display a name, but tell a story. What started as a small workshop in Lodi, California has grown into a nationwide leader in custom signage.\n\nOver the past 15 years, we have crafted over 10,000 signs for businesses ranging from local coffee shops to Fortune 500 companies. Our team of designers, engineers, and craftsmen brings together decades of combined experience.\n\nWe believe that every business deserves a sign that reflects its unique identity. That is why we offer fully customized solutions, from concept to delivery, ensuring that your sign is as unique as your brand.",
    stats: [
      { value: '15+', label: 'Years in Business' },
      { value: '10,000+', label: 'Signs Crafted' },
      { value: '3,500+', label: 'Happy Clients' },
      { value: '50+', label: 'States Served' },
    ],
    valuesLabel: 'Our Values',
    valuesTitle: 'WHAT DRIVES US',
    values: [
      { icon: 'Quality', title: 'Craftsmanship First', desc: 'Every sign is handcrafted by skilled artisans using premium materials. We never cut corners.' },
      { icon: 'Innovation', title: 'Innovation', desc: 'We stay ahead of industry trends, incorporating the latest LED technology and design techniques.' },
      { icon: 'Integrity', title: 'Integrity', desc: 'Transparent pricing, honest timelines, and clear communication. No hidden fees, no surprises.' },
      { icon: 'Service', title: 'Customer Service', desc: 'From your first inquiry to after-sales support, we are with you every step of the way.' },
    ],
    ctaTitle: "LET'S WORK TOGETHER",
    ctaText: 'Ready to create a sign that makes your business unforgettable? Get in touch today.',
    ctaButtonLabel: 'GET A FREE QUOTE',
  },

  quote: {
    label: 'Get Your Free Quote',
    title: "LET'S CREATE SOMETHING\nAMAZING",
    subtitle: 'Fill out the form below and receive a detailed quote and digital mockup in as fast as 2 hours.',
    badges: ['No obligation', 'Free mockup', '2-hour response'],
    signTypeOptions: ['Neon Signs', 'Light Box Signs', '3D Channel Letters', 'Blade Signs', 'Metal Signs', 'Monument Signs', 'Specialty/Custom', 'Not Sure - Need Advice'],
    budgetOptions: ['Under $500', '$500 - $1,000', '$1,000 - $2,500', '$2,500 - $5,000', '$5,000+', 'Not Sure'],
    submitLabel: 'GET MY FREE QUOTE',
    footnotes: ['Secure form', '2-hour response', 'No obligation'],
    successTitle: 'Quote Request Received!',
    successText: 'Thank you for reaching out. Our team will review your project details and send you a detailed quote with digital mockups within 2 hours.',
  },

  contact: {
    label: 'Contact Us',
    title: 'GET IN TOUCH',
    subtitle: "Have questions? We're here to help. Reach out and our team will get back to you within 1 hour.",
    submitLabel: 'SEND MESSAGE',
    successTitle: 'Message Sent!',
    successText: "Thank you for reaching out. We'll get back to you within 1 hour.",
    infoTitle: 'Contact Information',
    socialTitle: 'Follow Us',
  },

  legal: {
    "privacy": {
      "title": "Signage Crafting – Privacy & Security Policy",
      "lastUpdated": "",
      "sections": [
        {
          "heading": "",
          "body": "**Effective Date:** July 2026 **Website:** signagecrafting.com\n\nAt Signage Crafting, we are deeply committed to maintaining the confidentiality and security of our customers. This Privacy Policy outlines how we collect, utilize, and safeguard your Personal Information when you visit our website or make a purchase from us. We do not share, sell, or otherwise disclose information about our clients to any outside party, except as strictly required to process and ship your custom purchases."
        },
        {
          "heading": "1. Information Collection & Use",
          "body": "When you navigate our Site, register an account, or request a quote, we collect specific details to process your orders and optimize your experience. \"Personal Information\" refers to any data that can uniquely identify an individual.\n\n**Order & Registration Information**\n\n- **Purpose:** To manufacture your custom signage, process secure payments, arrange logistics, issue invoices, and communicate order updates.\n- **Information Collected:** Name, billing and shipping addresses, email address, phone number, and secure payment details (e.g., credit card information).\n- **Source:** Collected directly from you during checkout or registration.\n\n**Device & Log File Information**\n\n- **Purpose:** To accurately load the Site, perform analytics, administer the site, and gather broad demographic information to optimize your browsing experience.\n- **Information Collected:** IP addresses, browser type, internet service provider (ISP), referring/exit pages, time zone, and site interaction metrics.\n- **Source:** Automatically collected via standard website log files, cookies, web beacons, and pixels.\n\n**Customer Support Information**\n\n- **Purpose:** To deliver prompt, effective assistance regarding your custom projects.\n- **Information Collected:** Name, email, purchase history, and specific project details."
        },
        {
          "heading": "2. SMS Data Protection & Communications",
          "body": "We strictly respect your direct communication preferences.\n\n- **SMS Privacy:** We **do not** share any individual’s consent to receive SMS from Signage Crafting with third parties. We absolutely do not share, sell, or rent phone numbers for SMS purposes or third-party affiliate marketing.\n- **Customer Service & Updates:** Our production and customer service teams use both email and phone information to communicate with you exclusively regarding in-process orders.\n- **Newsletters & Special Offers:** Customers may occasionally receive information on products or special deals. You may easily opt-out of these communications at any time by clicking \"unsubscribe\" in the email or by contacting us directly."
        },
        {
          "heading": "3. Information Sharing & Third-Party Intermediaries",
          "body": "We share your data with trusted third parties strictly to help us deliver our services to you. These companies do not retain, share, store, or use personally identifiable information for any secondary purposes.\n\n- **E-commerce & Payments:** We use highly secure, industry-standard credit card processing companies to bill users for goods.\n- **Logistics:** We share necessary shipping details (name and address) with outside shipping couriers to deliver your physical orders.\n- **Business Transitions:** If Signage Crafting goes through a business transition, such as a merger, acquisition, or sale of assets, users’ personal information will typically be part of the transferred assets. Users will be notified of any such change in ownership or control of personal information.\n- **Legal Disclaimer:** We may disclose personal information when required by law, or when we have a good-faith belief that such action is necessary to comply with a current judicial proceeding, court order, or legal process."
        },
        {
          "heading": "4. Security & Data Protection",
          "body": "Signage Crafting takes every precaution to protect our users’ information, both online and offline.\n\n- **Online Encryption (SSL):** When our order form asks users to enter sensitive information (such as credit card numbers), that information is heavily encrypted and protected with industry-leading SSL (Secure Sockets Layer) software.\n- **Offline Security:** All user information is strictly restricted within our offices. Only employees who need the information to perform a specific job (e.g., billing clerks or customer service representatives) are granted access to personally identifiable information, and their access is password-protected."
        },
        {
          "heading": "5. Cookies",
          "body": "Cookies are small files stored on your device that uniquely identify users, associate files with orders, and enable the shopping cart functionality. We utilize functional cookies for site stability, performance cookies for analytics, and advertising cookies for marketing purposes. You can remove persistent cookies or manage your preferences directly within your browser’s settings; however, our site’s checkout process cannot be fully utilized with cookies turned off."
        },
        {
          "heading": "6. Behavioral Advertising & Opt-Out Options",
          "body": "We may use your Personal Information to provide targeted marketing that aligns with your interests.\n\n- **Analytics:** We partner with trusted providers like Google Analytics to understand user trends.\n- **Opt-Out Mechanisms:** Our users are always given the opportunity to opt-out. You can adjust your ad preferences through Google Ad Settings or Facebook Ad Settings, or opt-out of targeted advertising portals entirely via the Digital Advertising Alliance."
        },
        {
          "heading": "7. Lawful Basis & Rights (GDPR & CCPA)",
          "body": "**For European Economic Area (EEA) Residents:** We process your information under the lawful bases of consent, contract performance, legal compliance, and legitimate business interests. You have the right to access, correct, update, or erase your data.\n\n**For United States & California Residents (CCPA):** Our Site **does not sell** Personal Information. You have the explicit right to know, access, and request the deletion of your data. You may also designate an authorized agent to make these requests on your behalf."
        },
        {
          "heading": "8. Protection of Minors",
          "body": "Signage Crafting is a commercial manufacturing platform not intended for individuals under the age of 18. We do not knowingly collect Personal Information from children. If you believe a minor has inadvertently provided us with data, please contact us immediately to request its deletion."
        },
        {
          "heading": "9. Notification of Changes",
          "body": "If we decide to materially change our privacy practices, we will post those changes to this privacy statement and other appropriate places so our users are always aware of what information we collect and how we use it. If we intend to use your personally identifiable information in a manner different from that stated at the time of collection, we will notify you via email, providing you with a choice to opt-out of this new usage."
        },
        {
          "heading": "10. Contact Us",
          "body": "If you have any questions after reviewing this policy, require further details about our security practices, or wish to update your communication preferences, please reach out to our dedicated support team:\n\n**Email:** info@signagecrafting.com All inquiries are logged and handled promptly by our internal team."
        }
      ]
    },
    "terms": {
      "title": "Signage Crafting – Terms of Service & General Conditions of Sale",
      "lastUpdated": "",
      "sections": [
        {
          "heading": "",
          "body": "**Effective Date:** July 2026\n\n**Website:** signagecrafting.com"
        },
        {
          "heading": "Overview",
          "body": "This website is owned and operated by Signage Crafting. Throughout the Site, the terms \"we,\" \"us,\" and \"our\" refer exclusively to Signage Crafting. We provide this website, including all information, tools, and custom manufacturing services available herein, to you, the user, conditioned upon your acceptance of all terms, conditions, policies, and notices stated here.\n\nBy visiting our Site, placing an order, approving a proof, or purchasing products from us, you engage in our \"Service\" and agree to be legally bound by the following Terms of Service (\"Terms\"). These Terms apply to all users of the Site without limitation. We kindly ask that you read them carefully before accessing or using our services."
        },
        {
          "heading": "Section 1 - Online Store & General Provisions",
          "body": "By agreeing to these Terms, you represent that you are at least the age of majority in your state, province, or country of residence.\n\n- **Lawful Use:** We ask that you do not use our premium signage products for any illegal or unauthorized purpose, nor violate any laws in your jurisdiction, including but not limited to copyright and intellectual property laws.\n- **Security:** You must not transmit any worms, viruses, or any code of a destructive nature to the Site.\n- **Right of Refusal:** We reserve the right to respectfully refuse service to anyone for any reason at any time.\n- **Data Transmission:** You acknowledge that your content (excluding credit card information) may be transferred unencrypted across various networks. Please be assured that credit card information is always securely encrypted during network transfers."
        },
        {
          "heading": "Section 2 - Customer Content & Intellectual Property Warranty",
          "body": "**Ownership & Authority**\n\nYou are solely responsible for all content, images, trademarks, logos, and graphic layouts submitted for custom sign manufacturing. By placing an order, you guarantee that:\n\n- You hold all necessary copyrights, trademarks, licenses, and legal permissions to reproduce the submitted materials.\n- Your product designs do not infringe upon any third-party intellectual property, privacy, or proprietary rights.\n- You fully authorize Signage Crafting to manufacture products containing these design elements on your behalf.\n\n**Design File & Resolution Standards**\n\n- **Formatting:** For the highest quality result, all artwork must be submitted in CMYK color format with a minimum resolution of 300 DPI."
        },
        {
          "heading": "Section 3 - Proofing, Specifications & Approvals",
          "body": "**Proof Approval as Final Authorization**\n\nTo ensure your sign is crafted exactly to your vision, all manufacturing requires written customer approval of the final digital layout proof and job specification sheet.\n\n- **Customer Audit Duty:** You are responsible for carefully proofreading and verifying all aspects of the proof—including text spelling, business names, dimensions, font choices, mounting hole positions, graphic alignment, and illuminated element placements.\n- **Liability Release:** What is shown on the approved final proof represents exactly what will be built. Signage Crafting is released from liability for design, layout, or typographical errors once the proof is officially approved by you.\n\n**Color Reproduction & Finish Accuracy**\n\n- **Screen vs. Physical Match:** Digital screen proofs accurately predict layout and proportion, but not exact physical color or LED illumination intensity. Color reproduction is guaranteed within 90% accuracy due to material substrates and screen calibration variances.\n- **Handcrafted Variations:** Subtle variations in surface texture, micro-finishes, or slight seam alignments are inherent to custom handcrafted manufacturing (e.g., edge polishing, metal cutting, liquid acrylic pouring) and do not constitute manufacturing defects.\n- **AI-Generated Mockups:** Mockups, renderings, and preview images created with AI-assisted design tools are provided for visualization purposes only and will not be 100% identical to the finished sign. The final product may differ in color, brightness, scale, texture, material finish, and fine details. Differences between an AI-generated mockup and the manufactured sign do not constitute manufacturing defects and do not qualify an order for a refund, replacement, or cancellation."
        },
        {
          "heading": "Section 4 - Order Cancellations & Tiered Fee Structure",
          "body": "Because every sign is exclusively custom-manufactured to your specific branding and structural specifications, orders understandably cannot be freely canceled once production has commenced. Should you need to request a cancellation, the following tiered fee schedule applies to cover labor and materials already utilized:\n\n| **Order Status / Stage** | **Cancellation Eligibility & Administrative Fees** |\n|---|---|\n| **Stage 1: Pre-Design** | Cancelable. A fee of $15 + 5% of the order total is deducted to cover standard payment processing. |\n| **Stage 2: Design & Proofing** | Cancelable. A 20% non-refundable fee is retained for our design and engineering labor. |\n| **Stage 3: Production Active** | Cancellation is not guaranteed. If approved, a minimum 50% material and labor fee applies. |\n| **Stage 4: Completed/Shipped** | 100% Non-refundable. Orders at this stage cannot be canceled or modified. |"
        },
        {
          "heading": "Section 5 - Delivery Inspection, Transit Damage & Logistics",
          "body": "**Mandatory 48-Hour Delivery Inspection**\n\nTo ensure any transit issues are swiftly addressed, we require you to inspect all shipping containers and physical products for visible damage or missing parts prior to signing for delivery.\n\n**Claims for Transit Damage**\n\nIf your signage arrives damaged, please file a claim in writing to **info@signagecrafting.com** within 48 hours of carrier delivery. You must include:\n\n- Clear photographic and video evidence of the damaged component.\n- Photos of the inner protective packaging.\n- Photos of the exterior shipping box showing the shipping label.\n\nPlease note that failure to report transit damage within this 48-hour window results in the product being deemed delivered free of defects and may void replacement obligations.\n\n**Production Timelines & Transit Estimates**\n\nWe strive to meet all estimated production and delivery timelines to ensure your project stays on schedule. However, because our custom signage involves intricate manufacturing processes and relies on third-party logistics, all provided dates are strictly estimates and cannot be guaranteed.\n\nPlease note that we are unable to offer financial compensation or issue refunds for transit or production delays, including those caused by supply chain variables, carrier disruptions, customs processing, or weather events. We appreciate your understanding that unexpected delays do not constitute a breach of our service agreement and do not qualify an order for cancellation or reimbursement."
        },
        {
          "heading": "Section 6 - 1-Year Limited Warranty",
          "body": "Signage Crafting proudly stands behind the engineering of its products. We provide a 1-year warranty on all custom signs covering manufacturing defects and internal electrical components (LED modules, power supplies, and internal wiring).\n\n- **Claims:** Please provide video/photo evidence demonstrating the operational fault. Upon verification, we will promptly ship replacement parts not the complete sign.\n- **Exclusions:** This warranty understandably does not cover damage caused by improper third-party installation, physical abuse, unapproved voltage modification, acts of God, or normal external weathering."
        },
        {
          "heading": "Section 7 - Accuracy of Information & Modifications to Service",
          "body": "- **Information Accuracy:** While we strive for excellence, we are not responsible if information made available on this Site is not accurate, complete, or current. Any reliance on the material on this Site is at your own risk.\n- **Service & Price Modifications:** Prices for our custom signage products are subject to change without notice. We reserve the right to modify or discontinue the Service without notice. We shall not be liable to you or to any third-party for any modification, price change, or discontinuance.\n- **Billing Accuracy:** You agree to provide current, complete, and accurate purchase and account information. We reserve the right to respectfully refuse, limit, or cancel any order placed with us."
        },
        {
          "heading": "Section 8 - Limitation of Liability & Indemnification",
          "body": "**Indemnification**\n\nYou agree to defend, indemnify, and hold harmless Signage Crafting, its officers, directors, employees, vendors, and suppliers against all claims, liabilities, losses, damages, costs, and legal fees resulting from your breach of these Terms or any claim that your submitted artwork or trademark infringes upon a third party's proprietary rights.\n\n**Limitation of Liability & Consequential Damages**\n\nWhile we are deeply committed to delivering high-quality custom products, Signage Crafting cannot accept liability for indirect, incidental, punitive, or consequential damages. This includes, without limitation, potential loss of business revenue, missed grand opening deadlines, marketing expenses, or invoices from third-party installation contractors.\n\nOur financial responsibility is strictly limited to the manufacturing of the physical product as specified in your approved proof. We respectfully decline any requests for refunds, reimbursements, or additional financial compensation stemming from delivery delays or consequential business impacts. By agreeing to these terms, you acknowledge that Signage Crafting is fully released from liability regarding any third-party expenses or lost profits under all circumstances."
        },
        {
          "heading": "Section 9 - Governing Law & Dispute Resolution",
          "body": "These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of the State of Wyoming, without regard to its conflict of law provisions. Any legal action or proceeding arising under these Terms will be brought exclusively in the federal or state courts located in Wyoming, and the parties hereby irrevocably consent to the personal jurisdiction and venue therein."
        },
        {
          "heading": "Section 10 - Contact Information",
          "body": "For project inquiries, technical assistance, or order status updates, our support team is available 24/7.\n\n- **Email:** info@signagecrafting.com\n- **Response Commitment:** Written inquiries are logged and addressed promptly by our dedicated support team to ensure you receive the assistance you need."
        }
      ]
    },
    "refund": {
      "title": "Signage Crafting – Return & Refund Policy",
      "lastUpdated": "",
      "sections": [
        {
          "heading": "",
          "body": "Please review our Return & Refund Policy carefully to understand your rights, obligations, and the procedures regarding orders, returns, and cancellations. At Signage Crafting, we take immense pride in the quality of our custom manufacturing, and this policy is designed to ensure a smooth, transparent, and fair process for every client."
        },
        {
          "heading": "1. All Sales Are Final",
          "body": "Due to the highly customized nature of our products—which are manufactured specifically to your branding, dimensions, and material requirements—all sales are final. We do not offer refunds, returns, or credits once a custom-made order has entered production or been delivered.\n\nIf a verified manufacturing error occurs on our end, our sole obligation and remedy will be to re-manufacture and replace the defective component of sign."
        },
        {
          "heading": "2. Order Cancellations & Tiered Refunds",
          "body": "Orders can be canceled at various stages prior to full manufacturing, but cancellation charges will apply to cover labor and materials already utilized.\n\n- **Stage 1 (Prior to Design & Engineering):** Cancelable. You will be charged a $15 fee plus 5% of the total order amount to cover payment processing and initial administrative setup.\n- **Stage 2 (Design & Proofing In Progress):** Cancelable. A 20% non-refundable fee of the total order amount is retained to cover our design department's labor.\n- **Stage 3 (Active Production / Sent to Press):** Cancellation is not guaranteed. If an order is successfully halted at this stage, a minimum of 50% of the total order amount will be deducted to cover wasted materials and labor.\n- **Stage 4 (Completed or Shipped):** Once your order is completed or collected by the shipping courier, it is 100% non-refundable and cannot be canceled.\n\nPlease Note: Any charges related to expedited processing, rush manufacturing, or expedited shipping are strictly non-refundable under all circumstances."
        },
        {
          "heading": "3. Printing Standards & Final Approval Liability",
          "body": "Before we proceed with manufacturing, our team will provide you with a final digital proof and job specification sheet. It is your strict responsibility to review this carefully.\n\nSignage Crafting is **not liable** for errors in the final physical product caused by any of the following customer-approved details:\n\n- Incorrect spelling, grammar, or punctuation.\n- Wrong graphics orientation, placement, or font usage.\n- Inaccurate dimensions or finished product sizes approved on the proof.\n- Incorrect mounting hole placements or wiring exit locations.\n\nFailure to notify us of any required changes before granting your final approval releases Signage Crafting from any liability regarding these elements."
        },
        {
          "heading": "4. Delivery Inspection, Damaged Goods & Re-Prints",
          "body": "Upon delivery, it is your responsibility to thoroughly inspect the goods before signing off with the courier. While we package our signs with extensive protective materials, transit damage can occasionally occur.\n\n**Filing a Claim for Damage or Defects:** If your order has a defect, is damaged, or has missing items, you must notify Signage Crafting in writing at **info@signagecrafting.com** within **48 hours (2 business days)** of the delivery date. You must include:\n\n- Clear photographic or video evidence of the damaged product.\n- Images of the interior protective packaging.\n- Images of the exterior shipping box showing the shipping label.\n\n**Re-Print Conditions:** Failure to notify us and provide the required evidence within this 48-hour timeframe will result in the goods being deemed delivered free of defects and will void our replacement obligations. To receive a full replacement for severe transit damage, Signage Crafting may require you to return at least 99% of the damaged product at your own expense prior to authorizing the re-manufacture."
        },
        {
          "heading": "5. Shipping Discrepancies & Delays",
          "body": "While we partner with reliable global logistics providers, Signage Crafting cannot be held financially responsible—nor will we issue refunds—if the shipping company provides valid proof of delivery to your provided address, but the product is ultimately lost or stolen.\n\nAdditionally, as stated in our Terms of Service, we do not offer refunds or financial compensation for delays in transit caused by customs holds, carrier disruptions, or weather events."
        },
        {
          "heading": "6. Material Variations & Color Matching",
          "body": "Due to the bespoke, handcrafted nature of our manufacturing process (including metal cutting, acrylic pouring, and edge polishing), slight variations in finish, texture, or micro-alignments may occur.\n\nFurthermore, we guarantee that color reproduction will be within 90% of the final digital proof you approved. Differences in perceived color may arise due to variations in individual computer screen calibrations, LED temperatures, and material substrates. By placing an order, you acknowledge and accept these potential variations as a natural part of custom manufacturing, and they do not qualify as defects for a refund.\n\n**AI-Generated Mockups:** Mockups and preview images created with AI-assisted design tools are for visualization purposes only and will not be 100% identical to the finished sign. Differences between an AI-generated mockup and the final manufactured product are not considered defects and do not qualify for a refund or replacement."
        },
        {
          "heading": "7. 1-Year Limited Warranty",
          "body": "We stand behind the premium quality and craftsmanship of our products. Signage Crafting offers a 1-year warranty on all custom signs covering internal electrical components (LED modules, power supplies, and wiring) and manufacturing defects.\n\nIf you experience operational issues during this period, please contact us with video evidence demonstrating the fault. Upon technical verification, we will promptly manufacture and ship replacement parts so your sign remains fully functional."
        },
        {
          "heading": "8. Contact & Customer Support",
          "body": "Your satisfaction and feedback are highly valued. If you have any questions, need to start a claim, or require assistance with an order, our dedicated team is available 24/7.\n\n**Email:** info@signagecrafting.com Written inquiries are logged and addressed promptly by our dedicated support team."
        }
      ]
    },
    "shipping": {
      "title": "Signage Crafting – Shipping Policy",
      "lastUpdated": "",
      "sections": [
        {
          "heading": "",
          "body": "**Secure & Global Logistics** At Signage Crafting, we proudly offer complimentary worldwide shipping on all custom commercial signage. We are dedicated to ensuring that your high-quality signs are manufactured precisely and delivered to your doorstep securely and efficiently.\n\nPlease review our shipping procedures and policies below."
        },
        {
          "heading": "1. Order Processing & Manufacturing Timeline",
          "body": "Because every sign is exclusively custom-built to your specifications, all orders require your final digital design approval before entering the active production phase.\n\n- **Standard Timeline:** Once your design is officially approved, the combined manufacturing and shipping process takes approximately **13 to 17 working days** for final delivery.\n- **Operating Hours:** Our production facilities and order processing teams operate Monday through Friday, excluding major public holidays.\n- **Timeline Estimates:** Please note that because custom manufacturing involves intricate processes and relies on third-party global logistics, all provided timelines are estimates and cannot be strictly guaranteed."
        },
        {
          "heading": "2. Expedited & Rush Orders",
          "body": "While our standard service covers manufacturing and delivery within the estimated timelines, we understand that some projects are highly time-sensitive. If you require rush production and expedited shipping, please contact us at **info@signagecrafting.com** before placing your order.\n\nRush requests are evaluated on a case-by-case basis depending on current manufacturing capacity. Please note that any fees associated with approved rush production or expedited shipping are strictly non-refundable under all circumstances."
        },
        {
          "heading": "3. Tracking & Logistics Updates",
          "body": "As soon as your custom signage passes our final quality control inspection and is dispatched from our facility, you will receive an automated email containing your tracking number and the designated logistics provider. This allows you to monitor your shipment's progress in real-time until it arrives at your destination."
        },
        {
          "heading": "4. Delivery Inspection & Transit Damage",
          "body": "We take extensive precautions to package our signs securely in protective crates and padding; however, transit damage can occasionally occur.\n\n**Mandatory 48-Hour Reporting:** If your product sustains damage during transit, you must contact us at info@signagecrafting.com within **48 hours (2 business days)** of delivery. You must provide:\n\n- Clear photographic/video evidence of the damaged product.\n- Images of the interior protective packaging.\n- Images of the exterior shipping box showing the shipping label.\n\nUpon verification of the transit damage, our sole obligation and remedy will be to promptly manufacture and ship a replacement component or sign at no additional cost to you. Failure to report damage within the 48-hour window will result in the shipment being deemed delivered free of defects."
        },
        {
          "heading": "5. Delays, Lost, or Stolen Shipments",
          "body": "- **Unforeseen Delays:** Shipping delays caused by severe weather events, customs clearance holds, or carrier-specific logistical bottlenecks are beyond our direct control. As outlined in our Terms of Service, we do not issue refunds or offer financial compensation for delayed deliveries.\n- **Lost in Transit:** In the rare event that a carrier completely loses your shipment while it is still in transit, please notify our team immediately. We will act as a liaison to file a formal claim with the courier and work to provide a replacement.\n- **Stolen After Delivery:** Please note that Signage Crafting cannot be held financially responsible for items lost or stolen after the shipping carrier provides valid delivery confirmation (e.g., a delivery scan, signature, or photo at the delivery address)."
        },
        {
          "heading": "6. Customs, Taxes & International Duties",
          "body": "While Signage Crafting covers the base cost of international shipping, we do not cover local government taxes or import fees.\n\nFor international deliveries, the customer is strictly responsible for clearing their local customs process and paying any applicable regional tariffs, import duties, or taxes required by their country. Customs delays are not the responsibility of Signage Crafting."
        },
        {
          "heading": "7. Questions & Support",
          "body": "For any further inquiries regarding our logistics network, transit times, or specific shipping procedures, please feel free to reach out to our dedicated support team.\n\n**Email:** info@signagecrafting.com We are fully committed to helping you with any questions or concerns you may have."
        }
      ]
    }
  },

  faq: {
    label: 'FAQ',
    title: 'CUSTOM SIGN QUESTIONS, ANSWERED',
    subtitle: 'Straight answers about pricing, timelines, installation and care for custom business signs.',
    homeTitle: 'FREQUENTLY ASKED QUESTIONS',
    homeLimit: 5,
    items: [
      {
        question: 'How much does a custom business sign cost?',
        answer: 'The price depends on the sign type, size, materials and lighting. As a guide, our custom LED neon signs start at $299, metal signs at $349, blade signs at $399, light box signs at $450, 3D channel letters at $599 and monument signs at $1,200. [Request a free quote](/quote) and we will send an exact price with a digital mockup in as fast as 2 hours.',
      },
      {
        question: 'How long does it take to make a custom sign?',
        answer: 'You get a digital mockup in as fast as 2 hours. Once you approve the final design, manufacturing and shipping take approximately 13 to 17 working days for final delivery. If you need rush production or expedited shipping, email {email} before placing your order.',
      },
      {
        question: 'What is the difference between LED neon and glass neon signs?',
        answer: 'LED neon signs recreate the glow of traditional glass neon with flexible LED strips inside a silicone housing. They use far less electricity, run cool to the touch, are much harder to break and can be made in any color, shape or font.',
      },
      {
        question: 'How long do LED neon signs last?',
        answer: 'Quality LED neon is typically rated for around 50,000 hours of use, which is years of nightly operation. Every custom sign also comes with our 1-year limited warranty covering LED modules, power supplies, wiring and manufacturing defects.',
      },
      {
        question: 'Do LED neon signs use a lot of electricity?',
        answer: 'No. LED neon uses far less power than traditional glass neon. A small indoor LED neon sign draws roughly as much electricity as a household light bulb, so it is inexpensive to leave on every night.',
      },
      {
        question: 'What are channel letters?',
        answer: 'Channel letters are individual 3D letters and logo shapes mounted on a building, usually with internal LED lighting. They can be face-lit (the front glows) or halo-lit (light glows around the back), and mounted flush to the wall or on a raceway. They are the most common sign type for storefronts and office buildings.',
      },
      {
        question: 'Can your signs be installed outdoors?',
        answer: 'Yes. Our LED neon, light box, channel letter, blade, metal and monument signs are all available in outdoor-rated, weather-resistant builds. Let us know where the sign will be installed in your quote request and we will recommend the right materials.',
      },
      {
        question: 'Do you install signs?',
        answer: 'No. We design, manufacture and ship your sign, and your own local sign installer or licensed electrician handles the installation. Many cities require a permit for exterior business signs, and requirements vary by location, so check with your local building department before installing.',
      },
      {
        question: 'Do you ship custom signs nationwide and internationally?',
        answer: 'Yes. Shipping is complimentary worldwide on all custom commercial signage, and you get a tracking number as soon as your sign is dispatched. For international deliveries, local customs duties, import fees and taxes are paid by the customer.',
      },
      {
        question: 'What warranty do your signs come with?',
        answer: 'Every custom sign comes with a 1-year limited warranty covering internal electrical components (LED modules, power supplies and wiring) and manufacturing defects. If something stops working, send us a video of the fault and we will ship replacement parts once it is verified. See our [Terms of Service](/terms) for details.',
      },
      {
        question: 'What do I need to get a quote?',
        answer: 'Just tell us the type of sign you want, the approximate size, where it will go (indoors or outdoors), your logo or design idea and your budget. Quotes and digital mockups are free with no obligation. You can [fill out the quote form](/quote) or call us at {phone}.',
      },
      {
        question: 'Where is Signage Crafting located?',
        answer: 'Our workshop is at {address}, and we are open Mon-Fri 8AM-6PM. We design and build signs for businesses across the United States.',
      },
    ],
  },

  seo: {
    siteUrl: '',
    title: 'Custom Business Signs & LED Neon Signs | Signage Crafting',
    description: 'Custom business signs built to order: LED neon, channel letters, light boxes, metal and monument signs. Free quote & mockup in 2 hours. Nationwide shipping.',
    ogImage: '/hero-main.jpg',
    pages: {
      signTypes: {
        title: 'Custom Signs for Business: Neon, Channel Letters & More',
        description: 'Compare custom sign types for your business: LED neon, light box, channel letters, blade, metal, monument and specialty signs, with starting prices.',
      },
      about: {
        title: 'About Signage Crafting – Custom Sign Company in Lodi, CA',
        description: 'Signage Crafting designs and builds custom business signs in Lodi, California: 15+ years, 10,000+ signs and 3,500+ clients across the United States.',
      },
      quote: {
        title: 'Free Custom Sign Quote & Mockup | Signage Crafting',
        description: 'Tell us about your sign and get a detailed quote and free digital mockup in as fast as 2 hours. No obligation. Neon, channel letters, light boxes & more.',
      },
      contact: {
        title: 'Contact Signage Crafting | Custom Sign Company, Lodi CA',
        description: 'Call +1 (209) 340-4633, email info@signagecrafting.com or visit our workshop at 1310 Auto Center Dr, Lodi, CA. Mon-Fri 8AM-6PM.',
      },
      faq: {
        title: 'Business Sign FAQs: Cost, Timelines & Care | Signage Crafting',
        description: 'Answers to common questions about custom business signs: pricing, production time, LED neon vs glass neon, installation, permits, shipping and warranty.',
      },
    },
    businessType: 'LocalBusiness',
    priceRange: '$$',
    openingHours: 'Mo-Fr 08:00-18:00',
    areaServed: 'United States',
    latitude: '',
    longitude: '',
    googleVerification: '',
    bingVerification: '',
  },

  googleAds: {
    id: 'AW-18436661648',
    quoteFormLabel: '',
    contactFormLabel: '',
    phoneClickLabel: '',
  },
};
