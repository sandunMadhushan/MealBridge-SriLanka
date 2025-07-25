# 🍴 MealBridge Sri Lanka

**Connecting surplus food to those in need across Sri Lanka**

MealBridge Bolt is a modern, real-time platform designed to reduce food waste and hunger by connecting food donors (individuals, restaurants, businesses) with recipients (NGOs, communities, and individuals) and volunteer delivery agents, through an easy digital system.

## 🌟 Features

### For Food Donors

- **Quick Registration**: Sign up with email or Google in seconds
- **Easy Food Listing**: List surplus food with quantity, expiry, images, and pickup location
- **Donation Dashboard**: Track all your donations and their impact
- **Profile and Notifications**: Manage your info, get reminders and updates

### For Recipients

- **Browse Food Listings**: Search for available donations by location and type
- **Request Donations**: Request food deliveries easily
- **Instant Notifications**: Be alerted when suitable donations become available

### For Volunteers

- **Pickup \& Delivery Tracking**: See donations to deliver based on your location
- **Earn Badges**: Recognition for your community support

### Platform Features

- **Multi-role System**: Separate dashboard and permissions for Donor, Recipient, Volunteer
- **Realtime Data**: All activity updates instantly (Firebase Firestore)
- **Profile Editing**: Change your info and photo at any time
- **Mobile-responsive UI**: Works on phone, tablet, and desktop
- **Secure Auth**: Google + Email/Password sign-in

## 💻 Technology Stack

- **Frontend**: React.js (Vite for build)
- **State Management**: React Context API
- **Auth/Database/Storage**: Firebase (Auth, Firestore, Storage)
- **Deployment**: Netlify
- **Styling**: Tailwind CSS
- **Map Integration**: Google Maps Embed API (optional)

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- Firebase project (with Auth, Firestore, Storage enabled)
- Netlify/GitHub account for deployment

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/sandunMadhushan/mealbridge-bolt.git
cd mealbridge-bolt
```

2. **Set environment variables**
   - Copy the example file:

```bash
cp .env.example .env
```

    - Add your Firebase config values in `.env`:

```
VITE_APP_FIREBASE_API_KEY=
VITE_APP_FIREBASE_AUTH_DOMAIN=
VITE_APP_FIREBASE_PROJECT_ID=
VITE_APP_FIREBASE_STORAGE_BUCKET=
VITE_APP_FIREBASE_MESSAGING_SENDER_ID=
VITE_APP_FIREBASE_APP_ID=
```

3. **Install dependencies**

```bash
npm install
```

4. **Start the development server**

```bash
npm run dev
```

Your app will be running at [http://localhost:3000](http://localhost:3000)

## 📦 Deployment

- One-click deploy on Netlify (connect repo, set env vars)
- Builds with `npm run build` (output in `/dist`)

## 📱 Usage

- Donors, recipients, and volunteers can all register \& log in via Google or email/password.
- Donors post food, see their dashboard, and manage their profile.
- Recipients search and request listed food.
- Volunteers see requests and deliver as assigned, earning digital badges.

## 📊 Current Statistics

- **Registered Users**: 1,500+
- **Meals Donated**: 3,200+
- **Active NGOs/Orgs**: 150+
- **Major Areas Served**: Colombo, Kandy, Galle, Jaffna

## 🙌 Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit changes (`git commit -m "Add my feature"`)
4. Push to your branch (`git push origin feature/my-feature`)
5. Open a Pull Request!

**Development Guidelines**

- Follow code style in the project
- Use clear commit messages
- Add/update docs for all significant feature additions

## 📜 License

MIT License — see [LICENSE](LICENSE)

## 👤 Author \& Team

- **Project Lead / Developer:** Sandun Madhushan (sandunhmadhushan@gmail.com)
- [GitHub Profile](https://github.com/sandunMadhushan)
- Contributors: [Sandun Madhushan](https://github.com/sandunMadhushan), [Ovini Wijessoriya](https://github.com/oviniWijesooriya)

## 📞 Contact

- **Email:** mealbridge.lk@gmail.com
- **Website:** [https://mealbridgesrilanka.netlify.app/]
<!-- - **Facebook:** [Add link] -->

## 🙏 Acknowledgments

- All Sri Lankan NGOs and restaurants supporting the project
- Open source community (Firebase, React, Tailwind CSS)
- Early testers and volunteers

## 🚧 Roadmap \& Future Plans

- [ ] Mobile app (React Native)
- [ ] Multi-language (Sinhala/Tamil) UI on web
- [ ] Analytics dashboards for donors
- [ ] SMS notification support
- [ ] Optional: More granular donor/recipient feedback and ratings

**Let's build a Sri Lanka where no meal goes to waste and no one goes hungry.**

For more on food security in Sri Lanka, visit [World Food Programme Sri Lanka](https://www.wfp.org/countries/sri-lanka).

**Powered by MealBridge — 2025**
