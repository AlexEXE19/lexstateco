import { useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../state/store";

export type Locale = "en" | "ro";

type Dictionary = Record<string, string>;

type Translations = Record<Locale, Dictionary>;

const translations: Translations = {
  en: {
    "navbar.brandTag": "Homes without the noise",
    "navbar.language": "Language",
    "navbar.myAccount": "My Account",
    "navbar.logout": "Logout",
    "navbar.login": "Login",
    "navbar.register": "Register",
    "navbar.english": "English",
    "navbar.romanian": "Romanian",

    "audience.title": "Incoming tour requests",
    "audience.loading": "Loading incoming requests...",
    "audience.empty": "No one has requested a tour yet.",
    "audience.select": "Select a request to see details.",
    "audience.price": "Price",
    "audience.size": "Size",
    "audience.neighborhood": "Neighborhood",
    "audience.zip": "ZIP",
    "audience.map": "Map preview",
    "audience.accept": "Accept",
    "audience.reject": "Reject",
    "audience.updating": "Updating...",

    "status.pending": "pending",
    "status.accepted": "accepted",
    "status.rejected": "rejected",
    "status.canceled": "canceled",

    "account.tabs.saved": "Saved",
    "account.tabs.myProperties": "My Properties",
    "account.tabs.list": "List a Property",
    "account.tabs.requests": "My Requests",
    "account.tabs.audience": "My Audience",
    "account.tabs.messages": "Messages",

    "account.group.buyer": "Buyer tools",
    "account.group.seller": "Seller tools",
    "account.group.chat": "Conversations",

    "account.messages.title": "Messages",
    "account.messages.subtitle":
      "Chat with buyers and sellers from one inbox.",
    "account.messages.placeholder":
      "Chat workspace coming soon. You'll see threads, message history, and quick actions here.",

    "saved.title": "Your Saved Properties",
    "saved.cta": "Let's find some nice properties!",

    "userProps.title": "Your Properties",
    "userProps.empty": "Let's list a property!",

    "requests.title": "Tour requests you sent",
    "requests.loading": "Loading your tour requests...",
    "requests.empty": "You haven't requested any tours yet.",
    "requests.select": "Select a request to see details.",
    "requests.cancel": "Cancel request",
    "requests.canceling": "Canceling...",

    "properties.filter.heading":
      "Explore properties with clean, focused filters.",
    "properties.filter.sub":
      "Dial in by price, location, or neighborhood. No clutter—just listings ready to tour.",
    "properties.filter.tag": "Filter smarter",
    "properties.filter.min": "Min price",
    "properties.filter.max": "Max price",
    "properties.filter.location": "Location",
    "properties.filter.neighborhood": "Neighborhood",
    "properties.filter.placeholder.min": "e.g. 120000",
    "properties.filter.placeholder.max": "e.g. 450000",
    "properties.filter.placeholder.location": "City or town (even village)",
    "properties.filter.placeholder.neighborhood": "e.g. Drumul Taberei",
    "properties.filter.apply": "Apply filters",
    "properties.resultsLabel": "Results",
    "properties.results": "properties",
    "properties.browse": "Browse more",
    "properties.map": "Map preview",
    "properties.details": "Details",
    "properties.back": "Back to results",
    "properties.request": "Request a tour",
    "properties.requested": "Tour requested",
    "properties.canceling": "Canceling...",
    "properties.sending": "Sending...",
    "properties.requestSaved": "Request saved. See it in My Requests.",
    "properties.requestCanceled": "Request canceled.",
    "properties.lastCanceled":
      "Last request was canceled. Choose a new time to book again.",
    "properties.label.price": "Price",
    "properties.label.size": "Size",
    "properties.label.neighborhood": "Neighborhood",
    "properties.label.zip": "ZIP",
    "properties.label.seller": "Seller",
    "properties.label.date": "Date",
    "properties.label.time": "Time",
    "properties.empty":
      "No properties match your filters yet. Try widening your search.",
    "properties.errorAuth":
      "Could not send request. Please log in and try again.",

    "listing.title": "Showcase your home",
    "listing.subtitle":
      "Add the essentials so buyers can discover and tour quickly.",
    "listing.label.title": "Title",
    "listing.label.price": "Price (USD)",
    "listing.label.location": "Location",
    "listing.label.description": "Description",
    "listing.label.neighborhood": "Neighborhood",
    "listing.label.zip": "ZIP code",
    "listing.label.size": "Size (sq ft)",
    "listing.label.upload": "Upload images (max 8)",
    "listing.submit": "List property",

    "home.hero.tag": "Modern spaces, curated for you",
    "home.hero.title": "Find a home you love, or list yours with confidence.",
    "home.hero.subtitle":
      "Compare neighborhoods, tour faster, and get personalized help from real people—not generic feeds.",
    "home.hero.inputLabel": "Start with a location",
    "home.hero.inputPlaceholder": "City, neighborhood, or ZIP",
    "home.hero.browse": "Browse properties",
    "home.hero.viewListings": "View listings",
    "home.hero.listProperty": "List your property",
    "home.hero.stat.active": "Active listings",
    "home.hero.stat.response": "Avg. response",
    "home.hero.stat.rating": "Client rating",
    "home.hero.freshDrops": "Fresh drops",
    "home.hero.updated": "Updated daily",
    "home.hero.curated": "Curated for today",
    "home.hero.curatedCount": "15 picks",
    "home.hero.curatedExplore": "Explore",
    "home.curated.idea1.title": "Waterfront escapes",
    "home.curated.idea1.meta": "Seattle & Portland",
    "home.curated.idea2.title": "Family-ready homes",
    "home.curated.idea2.meta": "Austin suburbs",
    "home.curated.idea3.title": "Modern downtown lofts",
    "home.curated.idea3.meta": "Chicago & Denver",
    "home.section.label": "For buyers and sellers",
    "home.section.title": "Move faster with a calmer, cleaner experience.",
    "home.section.desc":
      "Choose your path, see the steps, and connect with vetted expertise without the clutter.",
    "home.section.cta": "Start browsing →",
    "home.feature1.title": "Verified listings only",
    "home.feature1.desc":
      "Every property is vetted and photo-checked by our team.",
    "home.feature2.title": "Local guidance",
    "home.feature2.desc":
      "Talk to area specialists who know the streets and schools.",
    "home.feature3.title": "Tours on your time",
    "home.feature3.desc":
      "Book in-person or virtual showings in just a few taps.",

    "auth.login.tag": "Secure access",
    "auth.login.title": "Welcome back.",
    "auth.login.subtitle":
      "Log in to pick up your saved properties, requests, and conversations right where you left off.",
    "auth.login.client": "Client satisfaction",
    "auth.login.sessions": "Secure sessions",
    "auth.login.cta": "Sign in",
    "auth.login.heading": "Access your account",
    "auth.login.desc":
      "Enter your details to continue your search or manage your listings.",
    "auth.login.email": "Email",
    "auth.login.password": "Password",
    "auth.login.submit": "Continue",
    "auth.login.noAccount": "Don't have an account?",
    "auth.login.create": "Create one",
    "auth.login.error.notFound":
      "Invalid credentials. Please try again or create an account.",
    "auth.login.error.generic": "An error occurred. Please try again later.",

    "auth.register.tag": "Start your journey",
    "auth.register.title": "Create, save, and move faster.",
    "auth.register.subtitle":
      "One account for listings, tours, and conversations. Keep everything in one calm, modern workspace.",
    "auth.register.client": "Listings and agents",
    "auth.register.sync": "Across all devices",
    "auth.register.cta": "Join LexEstateCo",
    "auth.register.heading": "Create an account",
    "auth.register.desc":
      "Save searches, list faster, and pick up conversations seamlessly.",
    "auth.register.firstName": "First name",
    "auth.register.lastName": "Last name",
    "auth.register.email": "Email",
    "auth.register.password": "Password",
    "auth.register.phone": "Phone",
    "auth.register.submit": "Create account",
    "auth.register.error.generic": "Error registering user, please try again.",
    "auth.register.error.later": "An error occurred. Please try again later.",

    "userType.tag": "Choose your path",
    "userType.title": "Buyer or seller, we keep it calm and clear.",
    "userType.subtitle":
      "Pick the experience that fits you. We'll surface the next steps and the right tools so you can move without the noise.",
    "userType.buyer.title": "I'm looking for a home",
    "userType.buyer.desc":
      "Discover spaces matched to your lifestyle, with fast tours and real guidance.",
    "userType.seller.title": "I want to sell my property",
    "userType.seller.desc":
      "List beautifully, manage visits effortlessly, and close with confidence.",
    "userType.meta": "Tailored steps and guidance",
    "userType.selected": "Selected",
    "userType.preview": "Preview next steps",

    "steps.label.buyer": "For buyers",
    "steps.label.seller": "For sellers",
    "steps.title.buyer": "Finding your next home is smoother than you think",
    "steps.title.seller": "Selling your home can be confident and calm",
    "steps.subtitle":
      "Follow the streamlined steps, each with the right context and support. No clutter, just momentum.",
    "steps.step": "Step",
    "steps.hover": "Stay guided, stay simple.",
    "steps.buyer.1.title": "Browse homes you love",
    "steps.buyer.1.desc":
      "Search by city, neighborhood, or price until something feels just right.",
    "steps.buyer.2.title": "Book a visit",
    "steps.buyer.2.desc":
      "Schedule a tour in seconds and see the property in person.",
    "steps.buyer.3.title": "Get the keys",
    "steps.buyer.3.desc": "Finalize everything and move into your new home.",
    "steps.seller.1.title": "List your property",
    "steps.seller.1.desc":
      "Add photos and details so buyers can discover your home.",
    "steps.seller.2.title": "Choose an agent",
    "steps.seller.2.desc":
      "Pick a trusted agent to help manage visits and offers.",
    "steps.seller.3.title": "Get paid",
    "steps.seller.3.desc": "Close the deal and receive your payment securely.",
  },
  ro: {
    "navbar.brandTag": "Case fără zgomot",
    "navbar.language": "Limbă",
    "navbar.myAccount": "Contul meu",
    "navbar.logout": "Deconectare",
    "navbar.login": "Autentificare",
    "navbar.register": "Înregistrare",
    "navbar.english": "Engleză",
    "navbar.romanian": "Română",

    "audience.title": "Cereri de tur primite",
    "audience.loading": "Se încarcă cererile...",
    "audience.empty": "Nu ai încă cereri de tur.",
    "audience.select": "Selectează o cerere pentru detalii.",
    "audience.price": "Preț",
    "audience.size": "Suprafață",
    "audience.neighborhood": "Cartier",
    "audience.zip": "Cod poștal",
    "audience.map": "Previzualizare hartă",
    "audience.accept": "Acceptă",
    "audience.reject": "Respinge",
    "audience.updating": "Se actualizează...",

    "status.pending": "în așteptare",
    "status.accepted": "acceptată",
    "status.rejected": "respinsă",
    "status.canceled": "anulată",

    "account.tabs.saved": "Salvate",
    "account.tabs.myProperties": "Proprietățile mele",
    "account.tabs.list": "Adaugă o proprietate",
    "account.tabs.requests": "Cererile mele",
    "account.tabs.audience": "Publicul meu",
    "account.tabs.messages": "Mesaje",

    "account.group.buyer": "Pentru cumpărători",
    "account.group.seller": "Pentru vânzători",
    "account.group.chat": "Conversații",

    "account.messages.title": "Mesaje",
    "account.messages.subtitle":
      "Comunică cu cumpărătorii și vânzătorii într-o singură căsuță.",
    "account.messages.placeholder":
      "Zona de chat apare în curând. Vei vedea conversații, istoric și acțiuni rapide aici.",

    "saved.title": "Proprietățile tale salvate",
    "saved.cta": "Hai să găsim proprietăți interesante!",

    "userProps.title": "Proprietățile tale",
    "userProps.empty": "Hai să publicăm o proprietate!",

    "requests.title": "Cererile de tur trimise",
    "requests.loading": "Se încarcă cererile de tur...",
    "requests.empty": "Nu ai cereri de tur încă.",
    "requests.select": "Selectează o cerere pentru detalii.",
    "requests.cancel": "Anulează cererea",
    "requests.canceling": "Se anulează...",

    "properties.filter.heading": "Explorează proprietăți cu filtre clare.",
    "properties.filter.sub":
      "Ajustează după preț, locație sau cartier. Fără aglomerație, doar oferte gata de vizionare.",
    "properties.filter.tag": "Filtrează inteligent",
    "properties.filter.min": "Preț minim",
    "properties.filter.max": "Preț maxim",
    "properties.filter.location": "Locație",
    "properties.filter.neighborhood": "Cartier",
    "properties.filter.placeholder.min": "ex. 120000",
    "properties.filter.placeholder.max": "ex. 450000",
    "properties.filter.placeholder.location": "Oraș sau sat",
    "properties.filter.placeholder.neighborhood": "ex. Drumul Taberei",
    "properties.filter.apply": "Aplică filtrele",
    "properties.resultsLabel": "Rezultate",
    "properties.results": "proprietăți",
    "properties.browse": "Vezi mai multe",
    "properties.map": "Previzualizare hartă",
    "properties.details": "Detalii",
    "properties.back": "Înapoi la rezultate",
    "properties.request": "Programează un tur",
    "properties.requested": "Tur solicitat",
    "properties.canceling": "Se anulează...",
    "properties.sending": "Se trimite...",
    "properties.requestSaved": "Cerere salvată. O găsești la Cererile mele.",
    "properties.requestCanceled": "Cerere anulată.",
    "properties.lastCanceled":
      "Ultima cerere a fost anulată. Alege o nouă oră pentru o nouă programare.",
    "properties.label.price": "Preț",
    "properties.label.size": "Suprafață",
    "properties.label.neighborhood": "Cartier",
    "properties.label.zip": "Cod poștal",
    "properties.label.seller": "Vânzător",
    "properties.label.date": "Dată",
    "properties.label.time": "Oră",
    "properties.empty":
      "Nicio proprietate nu corespunde filtrelor. Lărgește căutarea.",
    "properties.errorAuth":
      "Nu am putut trimite cererea. Autentifică-te și încearcă din nou.",

    "listing.title": "Prezintă-ți locuința",
    "listing.subtitle":
      "Adaugă elementele esențiale ca să poată fi descoperită rapid.",
    "listing.label.title": "Titlu",
    "listing.label.price": "Preț (USD)",
    "listing.label.location": "Locație",
    "listing.label.description": "Descriere",
    "listing.label.neighborhood": "Cartier",
    "listing.label.zip": "Cod poștal",
    "listing.label.size": "Suprafață (sq ft)",
    "listing.label.upload": "Încarcă imagini (max 8)",
    "listing.submit": "Publică proprietatea",

    "home.hero.tag": "Spații moderne, alese pentru tine",
    "home.hero.title":
      "Găsește o locuință pe care să o iubești sau publică-ți proprietatea cu încredere.",
    "home.hero.subtitle":
      "Compară cartiere, programează tururi rapid și primește ajutor personalizat de la oameni reali, nu feed-uri generice.",
    "home.hero.inputLabel": "Începe cu o locație",
    "home.hero.inputPlaceholder": "Oraș, cartier sau cod poștal",
    "home.hero.browse": "Caută proprietăți",
    "home.hero.viewListings": "Vezi anunțurile",
    "home.hero.listProperty": "Adaugă proprietatea",
    "home.hero.stat.active": "Anunțuri active",
    "home.hero.stat.response": "Răspuns mediu",
    "home.hero.stat.rating": "Evaluare clienți",
    "home.hero.freshDrops": "Noutăți",
    "home.hero.updated": "Actualizat zilnic",
    "home.hero.curated": "Selecția zilei",
    "home.hero.curatedCount": "15 recomandări",
    "home.hero.curatedExplore": "Vezi",
    "home.curated.idea1.title": "Escapade pe malul apei",
    "home.curated.idea1.meta": "Seattle și Portland",
    "home.curated.idea2.title": "Case pentru familie",
    "home.curated.idea2.meta": "Suburbiile Austin",
    "home.curated.idea3.title": "Lofturi moderne centrale",
    "home.curated.idea3.meta": "Chicago și Denver",
    "home.section.label": "Pentru cumpărători și vânzători",
    "home.section.title": "Mișcă-te mai repede cu o experiență calmă și clară.",
    "home.section.desc":
      "Alege traseul, vezi pașii și conectează-te cu experți verificați, fără aglomerație.",
    "home.section.cta": "Începe căutarea →",
    "home.feature1.title": "Doar anunțuri verificate",
    "home.feature1.desc":
      "Fiecare proprietate este verificată și inspectată foto de echipa noastră.",
    "home.feature2.title": "Ghidaj local",
    "home.feature2.desc":
      "Discută cu specialiști din zonă care cunosc străzile și școlile.",
    "home.feature3.title": "Tururi când vrei",
    "home.feature3.desc":
      "Programează tururi fizice sau virtuale în câteva click-uri.",

    "auth.login.tag": "Acces securizat",
    "auth.login.title": "Bine ai revenit.",
    "auth.login.subtitle":
      "Autentifică-te ca să continui cu proprietățile salvate, cererile și conversațiile exact de unde ai rămas.",
    "auth.login.client": "Satisfacția clienților",
    "auth.login.sessions": "Sesiuni securizate",
    "auth.login.cta": "Autentificare",
    "auth.login.heading": "Intră în cont",
    "auth.login.desc":
      "Introdu datele pentru a continua căutarea sau pentru a-ți gestiona anunțurile.",
    "auth.login.email": "Email",
    "auth.login.password": "Parolă",
    "auth.login.submit": "Continuă",
    "auth.login.noAccount": "Nu ai un cont?",
    "auth.login.create": "Creează unul",
    "auth.login.error.notFound":
      "Credențiale invalide. Încearcă din nou sau creează un cont.",
    "auth.login.error.generic":
      "A apărut o eroare. Te rugăm să încerci din nou.",

    "auth.register.tag": "Începe călătoria",
    "auth.register.title": "Creează, salvează și mișcă-te mai rapid.",
    "auth.register.subtitle":
      "Un singur cont pentru anunțuri, tururi și conversații. Păstrează totul într-un spațiu calm și modern.",
    "auth.register.client": "Anunțuri și agenți",
    "auth.register.sync": "Pe toate dispozitivele",
    "auth.register.cta": "Alătură-te LexEstateCo",
    "auth.register.heading": "Creează un cont",
    "auth.register.desc":
      "Salvează căutări, publică mai rapid și continuă conversațiile fără întreruperi.",
    "auth.register.firstName": "Prenume",
    "auth.register.lastName": "Nume",
    "auth.register.email": "Email",
    "auth.register.password": "Parolă",
    "auth.register.phone": "Telefon",
    "auth.register.submit": "Creează contul",
    "auth.register.error.generic": "Eroare la înregistrare, încearcă din nou.",
    "auth.register.error.later":
      "A apărut o eroare. Te rugăm să încerci mai târziu.",

    "userType.tag": "Alege-ți traseul",
    "userType.title":
      "Cumpărător sau vânzător, păstrăm totul clar și liniștit.",
    "userType.subtitle":
      "Alege experiența potrivită. Îți arătăm pașii următori și instrumentele potrivite ca să te miști fără zgomot.",
    "userType.buyer.title": "Caut o locuință",
    "userType.buyer.desc":
      "Descoperă locuri potrivite stilului tău de viață, cu tururi rapide și ghidare reală.",
    "userType.seller.title": "Vreau să vând proprietatea",
    "userType.seller.desc":
      "Publică frumos, gestionează vizitele ușor și încheie cu încredere.",
    "userType.meta": "Pași și ghidare personalizate",
    "userType.selected": "Selectat",
    "userType.preview": "Vezi pașii următori",

    "steps.label.buyer": "Pentru cumpărători",
    "steps.label.seller": "Pentru vânzători",
    "steps.title.buyer":
      "Să găsești următoarea locuință e mai simplu decât crezi",
    "steps.title.seller": "Vânzarea poate fi sigură și calmă",
    "steps.subtitle":
      "Urmează pașii clari, cu context și suport la fiecare etapă. Fără aglomerație, doar progres.",
    "steps.step": "Pas",
    "steps.hover": "Rămâi ghidat, rămâi simplu.",
    "steps.buyer.1.title": "Răsfoiește locuințe pe placul tău",
    "steps.buyer.1.desc":
      "Caută după oraș, cartier sau preț până găsești ceva potrivit.",
    "steps.buyer.2.title": "Programează o vizită",
    "steps.buyer.2.desc":
      "Planifică un tur în câteva secunde și vezi locuința pe viu.",
    "steps.buyer.3.title": "Primește cheile",
    "steps.buyer.3.desc": "Finalizează tot și mută-te în noua casă.",
    "steps.seller.1.title": "Publică proprietatea",
    "steps.seller.1.desc": "Adaugă poze și detalii ca să fie descoperită ușor.",
    "steps.seller.2.title": "Alege un agent",
    "steps.seller.2.desc":
      "Alege un agent de încredere pentru vizite și oferte.",
    "steps.seller.3.title": "Încasează plata",
    "steps.seller.3.desc":
      "Închide tranzacția și încasează banii în siguranță.",
  },
};

export const useTranslation = () => {
  const lang = useSelector((state: RootState) => state.lang) as Locale;

  const t = useCallback(
    (key: string): string => {
      const fromLang = translations[lang]?.[key];
      if (fromLang) return fromLang;
      const fallback = translations.en[key];
      return fallback || key;
    },
    [lang],
  );

  return { t, lang };
};
