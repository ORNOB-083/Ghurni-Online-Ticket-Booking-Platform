import AdvertiseSection from "@/components/AdvertiseSection";
import HeroSlider from "@/components/HeroSlider";
import LatestTickets from "@/components/LatestTickets";
import PopularRoutes from "@/components/PopularRoutes";
import WhyChooseUs from "@/components/WhyChooseUs";
import Image from "next/image";

export default function Home() {
  return (
    <div className="">
      <HeroSlider />
      <AdvertiseSection />
      <LatestTickets />
      <PopularRoutes />
      <WhyChooseUs />
    </div>
  );
}
