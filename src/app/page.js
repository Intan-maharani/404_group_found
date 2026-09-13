import navbar from "../components/navbar"
import image from "next/image";

export default function Home() {
  return (
    <div>
      <navbar />
      <image src="/images/landing.png" alt="Landing Image" width={800} height={400} />
    </div>
  );
}