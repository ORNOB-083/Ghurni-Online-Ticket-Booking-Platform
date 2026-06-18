import HeroSlider from "@/components/HeroSlider";
import PopularRoutes from "@/components/PopularRoutes";
import WhyChooseUs from "@/components/WhyChooseUs";
import Image from "next/image";

export default function Home() {
  return (
    <div className="">
      <HeroSlider />
      <PopularRoutes />
      <WhyChooseUs />
    </div>
  );
}
