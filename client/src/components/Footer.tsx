import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer: React.FC = () => {
  const MY_LINKEDIN_PROFILE =
    "https://www.linkedin.com/in/alexandru-florentin-ion-430a83249/";

  return (
    <div className="bg-blue-600 p-10 w-full flex flex-row justify-center gap-x-6">
      <a href={MY_LINKEDIN_PROFILE}>
        <Facebook
          className="text-white hover:text-blue-800 transition-colors"
          size={32}
        />
      </a>
      <a href={MY_LINKEDIN_PROFILE}>
        <Twitter
          className="text-white hover:text-blue-800 transition-colors"
          size={32}
        />
      </a>
      <a href={MY_LINKEDIN_PROFILE}>
        <Instagram
          className="text-white hover:text-blue-800 transition-colors"
          size={32}
        />
      </a>
      <a href={MY_LINKEDIN_PROFILE}>
        <Linkedin
          className="text-white hover:text-blue-800 transition-colors"
          size={32}
        />
      </a>
    </div>
  );
};

export default Footer;
